class MySqlProvider {
    constructor(connection) {
        this.connection = connection;
    }

    set() {
        let sql = `CREATE TABLE Persons (
            PersonID int,
            LastName varchar(255),
            FirstName varchar(255),
            Address varchar(255),
            City varchar(255)
        );`
        this.connection.query()
    }

    // get() {

    // }


    // getall() {

    // }

    // delete() {

    // }

    // update() {

    // }
}