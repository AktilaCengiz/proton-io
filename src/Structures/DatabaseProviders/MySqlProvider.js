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
     * @param {string} id - s
     * @param {string} defaultValue - s
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
     * @param {string} id -s
     */

    delete(id) {
        const sql = `delete from ${id};`;
        this.connection.query(sql);
    }

    // // db.update("aktilacengiz", {name: "hüsamettin", soyad: "s"})
    // update(id, updatedDatas) {
    //     const sql = `select datas from ProtonTable where id='${id}';`;
    //     this.connection.query(sql, (err, data) => {
    //         if (err) throw err;
    //         if (data == null) {
    //             return null;
    //         }
    //         const customDatas = JSON.parse(data[0].datas);
    //     });
    // }
}

module.exports = MySqlProvider;
