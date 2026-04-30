const { MockAdapter } = require("./mock.adapter");

class TranzoAdapter extends MockAdapter {
  constructor(keys) {
    super("tranzo");
    this.apiKey = keys?.apiKey;
    this.apiPassword = keys?.apiPassword;
    // TODO: replace mock calls with real Tranzo API
  }
}

module.exports = TranzoAdapter;