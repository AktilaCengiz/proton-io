/**
 * Provider using the `better-sqlite3` library.
 *@param {any} sql - A sql database path.
 */

class sqlProvider {
    constructor(sql) {
        this.sql = sql;
    }

    /**
     *
     * @param {string} id - Data object to save.
     * @param {object} savedDatas - Data object key to save.
     */
    set(id, savedDatas) {
        if (typeof id !== "string") {
            throw new TypeError("The id must be a type of object.");
        }

        if (typeof savedDatas !== "object") {
            throw new TypeError("The datas must be a type of object.");
        }

        const dist = Object.entries(savedDatas).map(([name, value]) => ({ name, value }));
        const datas = [];
        const datas2 = [];
        const datas3 = [];

        for (let i = 0; i < dist.length; i++) {
            datas.push(dist[i].name);
        }
        for (let i = 0; i < dist.length; i++) {
            datas2.push(`'${dist[i].value}'`);
        }
        for (let i = 0; i < dist.length; i++) {
            datas3.push(`'${dist[i].name}'`);
        }

        const featuress = datas.toString();
        const features = `${featuress.replaceAll(",", " TEXT, ")} TEXT`;
        const valuess = datas2.toString();

        this.sql.prepare(`CREATE TABLE IF NOT EXISTS ${id} (${features});`).run();
        this.sql.prepare(`INSERT OR REPLACE INTO ${id} (${featuress}) VALUES (${valuess});`).run();
    }

    /**
     *
     * @param {string} id - Data object to get.
     * @param {string} defaultValue - defaultvalue if error optional.
     * @returns
     */
    get(id, defaultValue) {
        if (typeof id !== "string") {
            throw new TypeError("The id must be a type of object.");
        }

        const datas = this.sql.prepare(`SELECT * FROM ${id}`).get();
        if (datas) {
            return datas;
        }
        return defaultValue;
    }

    /**
     *
     * @param {string} id - parameter for delete action.
     */
    delete(id) {
        if (typeof id !== "string") {
            throw new TypeError("The id must be a type of object.");
        }
        this.sql.prepare(`delete from ${id}`).run();
    }

    /**
     *
     * @param {string} id - parameter for update action.
     * @param {object} updatedDatas - parameter for actually update action.
     * @returns
     */
    update(id, updatedDatas) {
        if (typeof id !== "string") {
            throw new TypeError("The id must be a type of object.");
        }
        if (typeof updatedDatas !== "object") {
            throw new TypeError("The updatedDatas must be a type of object.");
        }
        const data = this.sql.prepare(`select * from ${id}`).get();
        if (!data) {
            return null;
        }
        const dist = Object.entries(updatedDatas).map(([name, value]) => ({ name, value }));
        const changedDatas = [];
        const changedValue = [];
        for (let i = 0; i < dist.length; i++) {
            changedDatas.push(dist[i].name);
            changedValue.push(dist[i].value);
        }

        let text = "";
        if (changedDatas.length === 1) {
            changedDatas.forEach((m) => {
                changedValue.forEach((t) => {
                    text += ` ${m} = '${t}'  `;
                });
            });
        } else {
            for (let i = 0; i < changedDatas.length; i++) {
                text += `${changedDatas[i]} = '${changedValue[i]}', `;
            }
        }

        const sql2 = `UPDATE ${id} SET ${text.slice(0, (text.length - 2))}`;
        return this.sql.prepare(sql2).run();
    }
}

module.exports = sqlProvider;
