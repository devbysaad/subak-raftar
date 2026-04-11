const MockAdapter = require("./mock.adapter");

// real Leopards API uses:
// POST https://merchantapi.leopardscourier.com/api/bookPacket
// POST https://merchantapi.leopardscourier.com/api/trackBookedPacket
// auth: api_key + api_password in request body

class LeopardsAdapter extends MockAdapter {
  constructor(keys) {
    super("leopards");
    this.apiKey      = keys?.apiKey;
    this.apiPassword = keys?.apiPassword;
    // TODO: swap out mock calls with real Leopards REST API
  }
}

module.exports = LeopardsAdapter;