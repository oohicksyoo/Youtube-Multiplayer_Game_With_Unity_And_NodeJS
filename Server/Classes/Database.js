let MySql = require('mysql')
let DatabaseSettings = require('../Files/DatabaseSettings.json')
let DatabaseSettingsLocal = require('../Files/DatabaseSettingsLocal.json')

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
            let query = "SELECT * FROM users WHERE userName = ?";

            connection.query(query, [username], (error, results) => {
                connection.release();
                if (error) throw error;
                callback(results);
            });
        });
    }
}