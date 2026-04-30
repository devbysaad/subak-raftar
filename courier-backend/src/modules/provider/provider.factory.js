import TCSAdapter      from "./tcs.adapter.js";
import TraxAdapter     from "./trax.adapter.js";
import MPAdapter       from "./mp.adapter.js";
import TranzoAdapter   from "./tranzo.adapter.js";
import LeopardsAdapter from "./leopards.adapter.js";
import SelfAdapter     from "./self.adapter.js";

const ADAPTER_MAP = {
    tcs:      TCSAdapter,
    trax:     TraxAdapter,
    mp:       MPAdapter,
    tranzo:   TranzoAdapter,
    leopards: LeopardsAdapter,
    self:     SelfAdapter,
};

export const getAdapter = (provider, keys = {}) => {
    const Adapter = ADAPTER_MAP[provider];
    if (!Adapter) throw new Error(`Unknown provider: ${provider}`);
    return new Adapter(keys);
};