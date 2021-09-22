/* eslint-disable no-irregular-whitespace */

const CachedManager = require("../Managers/CachedManager");

/**
 * @extends {CachedManager<string,string>}
 */
class AliasManager extends CachedManager {
    /**
     * Register the alias in the cache.
     * @param {string} alias - Alias referencing the command id
     * @param {string} commandId - The command ID referenced by the alias
     * @returns {this}
     */
    register(alias, commandId) {
        if (this.cache.has(alias)) {
            throw new Error(`Alias ​​'${alias}' exists in cache`);
        }
        return super.register(alias, commandId);
    }
}

module.exports = AliasManager;
