const crypto = require("crypto");
const Shipment = require("../shipments/shipment.model");
const Company = require("../companies/company.model");
const { getAdapter } = require("../provider/provider.factory");
const statusHistoryService = require("../status-history/statusHistory.service");

// verify the webhook actually came from Shopify
const verifyShopifyWebhook = (rawBody, signature, secret) => {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");
  return hash === signature;
};

// map Shopify order fields to our shipment schema
const mapOrderToShipment = (order) => ({
  sender: {
    name:    order.shop_name || "Merchant",
    phone:   order.billing_address?.phone || "0000000000",
    address: order.billing_address?.address1 || "",
    city:    order.billing_address?.city || "",
  },
  receiver: {
    name:    `${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`.trim(),
    phone:   order.shipping_address?.phone || "0000000000",
    address: order.shipping_address?.address1 || "",
    city:    order.shipping_address?.city || "",
  },
  weight:        order.total_weight ? order.total_weight / 1000 : 1, // shopify sends grams
  isCOD:         false, // shopify orders are prepaid
  codAmount:     0,
  shopifyOrderId: String(order.id),
  notes:         `Auto-created from Shopify order #${order.order_number}`,
});

const handleFulfillmentWebhook = async (companyId, order) => {
  // check if shipment already exists for this order
  const exists = await Shipment.findOne({
    companyId,
    shopifyOrderId: String(order.id),
  });

  if (exists) {
    console.log(`[Shopify] Shipment already exists for order ${order.id}`);
    return exists;
  }

  const company = await Company.findById(companyId).lean();
  if (!company) throw new Error("Company not found");

  // use first available provider that has keys, fallback to self
  const provider = Object.keys(company.providerKeys || {}).find(
    (p) => company.providerKeys[p]?.apiKey
  ) || "self";

  const keys = company.providerKeys?.[provider] || {};
  const adapter = getAdapter(provider, keys);
  const shipmentData = mapOrderToShipment(order);
  const booking = await adapter.bookShipment(shipmentData, companyId);

  const shipment = await Shipment.create({
    ...shipmentData,
    companyId,
    createdBy:          null, // system created
    provider,
    providerTrackingNo: booking.trackingNo,
    status:             "booked",
  });

  await statusHistoryService.log(
    shipment._id,
    "booked",
    null,
    `Auto-created from Shopify order #${order.order_number}`
  );

  console.log(`[Shopify] Shipment created for order ${order.id}`);
  return shipment;
};

module.exports = { verifyShopifyWebhook, handleFulfillmentWebhook };