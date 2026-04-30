import { MockAdapter } from "./mock.adapter.js";

class TranzoAdapter extends MockAdapter {
    constructor(keys) {
        super("tranzo");
        this.apiKey      = keys?.apiKey;
        this.apiPassword = keys?.apiPassword;
    }
}

export default TranzoAdapter;