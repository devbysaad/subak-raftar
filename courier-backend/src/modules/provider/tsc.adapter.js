const MockAdapter = require("./mock.adapter");

class TCSAdapter extends MockAdapter {
  constructor(keys) {
    super("tcs");
    this.apiKey = keys?.apiKey;
    this.apiPassword = keys?.apiPassword;
    // TODO: replace mock calls with real TCS API
    // Sandbox: https://sandbox.tcscourier.com
  }
}

module.exports = TCSAdapter;