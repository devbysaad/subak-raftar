const MockAdapter = require("./mock.adapter");

class TraxAdapter extends MockAdapter {
  constructor(keys) {
    super("trax");
    this.apiKey = keys?.apiKey;
    this.apiPassword = keys?.apiPassword;
    // TODO: replace mock calls with real Trax API
    // Contact trax.pk for credentials
  }
}

module.exports = TraxAdapter;