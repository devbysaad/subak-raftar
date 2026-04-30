const TCSAdapter      = require("./tcs.adapter");
const TraxAdapter     = require("./trax.adapter");
const MPAdapter       = require("./mp.adapter");
const TranzoAdapter   = require("./tranzo.adapter");
const LeopardsAdapter = require("./leopards.adapter");
const SelfAdapter     = require("./self.adapter");

const ADAPTER_MAP = {
    tcs:      TCSAdapter,
    trax:     TraxAdapter,
    mp:       MPAdapter,
    tranzo:   TranzoAdapter,
    leopards: LeopardsAdapter,
    self:     SelfAdapter,
};

const getAdapter = (provider, keys = {}) => {
    const Adapter = ADAPTER_MAP[provider];
    if (!Adapter) throw new Error(`Unknown provider: ${provider}`);
    return new Adapter(keys);
};

module.exports = { getAdapter };