const MockAdapter = require("./mock.adapter");

class MPAdapter extends MockAdapter {
  constructor(keys) {
    super("mp");
    this.apiKey = keys?.apiKey;
    this.apiPassword = keys?.apiPassword;
    // TODO: replace mock calls with real M&P API
  }
}

module.exports = MPAdapter;