/**
 * Provider using the `Mongoose` library.
 * @param {Model} model - A Mongoose model.
*/
class MongooseProvider {
    constructor(model) {
        this.model = model;
        /**
         * Mongoose model.
         * @type {Model}
         */
    }

    /**
     * Sets a value.
     * @param {object} datas - save datas in map order.
     */
    set(datas) {
        if (typeof datas !== "object") {
            throw new TypeError("The datas must be a type of object.");
        }
        this.model.create(datas);
    }

    /**
     * Sets a value.
     * @param {object} objectFetchDatas - a parameter to find data ordered by map.
     * @param {string} defaultValue - default value
     */
    get(objectFetchDatas, defaultValue = null) {
        return new Promise((res, rej) => {
            this.model.findOne(objectFetchDatas, (err, data) => {
                if (err) rej(err);
                else res(data ?? defaultValue);
            });
        });
    }

    /**
     *
     * @param {object} objectFetchDatas - a parameter to find data ordered by map.
     * @param {object} updatedDatas - a parameter to update data ordered by map.
     */
    update(objectFetchDatas, updatedDatas) {
        this.model.findOneAndUpdate(objectFetchDatas, updatedDatas, (err) => {
            if (err) throw err;
        });
    }

    /**
     *
     * @param {object} objectFetchDatas - a parameter to find data ordered by map.
    */
    delete(objectFetchDatas) {
        this.model.findOneAndDelete(objectFetchDatas, (err) => {
            if (err) throw err;
        });
    }

    getall() {
        return this.model.find({});
    }
}

module.exports = MongooseProvider;
