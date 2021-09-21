/**
* Provider using the `MySql2` library.
* @param {any} connection - A mysql connection.
*/

class MySqlProvider {
    constructor(connection) {
        this.connection = connection;
    }
    /**
     *
     * @param {object} savedDatas - Data object to save
     * @param {string} id - Data string key to save
     */

    set(id, savedDatas) {
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
            datas3.push(`'${dist[i].name}'`);
        }
        for (let i = 0; i < dist.length; i++) {
            datas2.push(`'${dist[i].value}'`);
        }

        const featuress = datas.toString();
        const features = `${featuress.replaceAll(",", " varchar(300), \n")} varchar(300)`;
        const sql = `CREATE TABLE IF NOT EXISTS ${id} (
            ${features}
            );`;

        const values = datas2.toString();
        const valuess = values.replaceAll(",", ", ");
        this.connection.query(sql);
        const sql2 = `INSERT INTO ${id} (${featuress}) VALUES (${valuess});`;
        this.connection.query(sql2);
    }

    /**
     *
     * @param {string} id - Data string key to find.
     * @param {string} defaultValue - Data string default value to find.
     * @returns
     */
    async get(id, defaultValue = null) {
        const sql = `select * from ${id};`;
        return new Promise((res, rej) => {
            this.connection.query(sql, (err, data) => {
                if (err) rej(err);
                else res(data ?? defaultValue);
            });
        });
    }

    /**
     *
     * @param {string} id - Data key to delete.
     */

    delete(id) {
        const sql = `delete from ${id};`;
        this.connection.query(sql);
    }
    /**
     *
     * @param {string} id -Data key to update.
     * @param {object} updatedDatas - Data update values to update.
     */

    update(id, updatedDatas) {
        const sql = `select * from ${id};`;
        // eslint-disable-next-line consistent-return
        this.connection.query(sql, (err, data) => {
            if (err) throw err;
            if (data == null) {
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
            this.connection.query(sql2);
        });
    }
}

module.exports = MySqlProvider;
