let MySql = require('mysql')
let DatabaseSettings = require('../Files/DatabaseSettings.json')
let DatabaseSettingsLocal = require('../Files/DatabaseSettingsLocal.json')
let PasswordHash = require('password-hash')

module.exports = class Database {
    constructor(isLocal = false) {
        this.currentSettings = (isLocal) ? DatabaseSettingsLocal : DatabaseSettings;
        this.pool = MySql.createPool({
            host: this.currentSettings.Host,
            user: this.currentSettings.User,
            password: this.currentSettings.Password,
            database: this.currentSettings.Database
        });
    }

    Connect(callback) {
        let pool = this.pool;
        pool.getConnection((error, connection) => {
            if (error) throw error;
            callback(connection);
        });
    }

    GetSampleData(callback) {
        this.Connect(connection => {
            let query = "SELECT * FROM users";

            connection.query(query, (error, results) => {
                connection.release();
                if (error) throw error;
                callback(results);
            });
        });
    }

    GetSampleDataByUsername(username, callback) {
        this.Connect(connection => {
            let query = "SELECT * FROM users WHERE username = ?";

            connection.query(query, [username], (error, results) => {
                connection.release();
                if (error) throw error;
                callback(results);
            });
        });
    }

    //ACCOUNT QUERIES
    CreateAccount(username, password, callback) {
        //You may want to check the length and preform a regex on this
        var hashedPassword = PasswordHash.generate(password);

        //Attempt to see if someone is already the db
        this.Connect(connection => {
            let query = "SELECT username FROM users WHERE username = ?";

            connection.query(query, [username], (error, results) => {
                if (error) {
                    connection.release();
                    throw error;
                }

                if (results[0] != undefined) {
                    callback({
                        valid: false,
                        reason: "user already exists."
                    });
                    connection.release();
                    return;
                }

                //If not put out user in there
                query = "INSERT INTO users (username, password) VALUES (?, ?)";
                connection.query(query, [username, hashedPassword], (error, results) => {
                    connection.release();
                    if (error) {
                        throw error;
                    }

                    callback({
                        valid: true,
                        reason: "Success."
                    });
                });
            });
        });
    }

    SignIn(username, password, callback) {
        this.Connect(connection => {
            let query = "SELECT password FROM users WHERE username = ?";

            connection.query(query, [username], (error, results) => {
                connection.release();
                if (error) {
                    throw error;
                }

                if (results[0] != undefined) {
                    if (PasswordHash.verify(password, results[0].password)) {
                        callback({
                            valid: true,
                            reason: "Success."
                        });
                    } else {
                        //In reality you should never return this or youll get botted hahahah
                        callback({
                            valid: false,
                            reason: "Password does not match."
                        });
                    }
                } else {
                    callback({
                        valid: false,
                        reason: "User does not exists."
                    });
                }
            });
        });
    }
}