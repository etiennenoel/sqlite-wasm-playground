var SqliteMessageTypeEnum;
(function (SqliteMessageTypeEnum) {
    SqliteMessageTypeEnum["CreateDatabase"] = "CREATE_DATABASE";
    SqliteMessageTypeEnum["CreateDatabaseResult"] = "CREATE_DATABASE_RESULT";
    SqliteMessageTypeEnum["ExecuteSql"] = "EXECUTE_SQL";
    SqliteMessageTypeEnum["ExecuteSqlResult"] = "EXECUTE_SQL_RESULT";
})(SqliteMessageTypeEnum || (SqliteMessageTypeEnum = {}));class ExecuteSqlMessage {
    constructor(uniqueId, sqlStatement, bindingParameters = []) {
        this.uniqueId = uniqueId;
        this.sqlStatement = sqlStatement;
        this.bindingParameters = bindingParameters;
        this.type = SqliteMessageTypeEnum.ExecuteSql;
    }
}class CreateDatabaseMessage {
    constructor(filename) {
        this.filename = filename;
        this.type = SqliteMessageTypeEnum.CreateDatabase;
    }
}class SqliteClient {
    constructor(filename, sqliteWorkerPath) {
        this.filename = filename;
        this.sqliteWorkerPath = sqliteWorkerPath;
        this.executeSqlPromises = {};
        this.worker = new Worker("assets/js/sqlite.worker.js", {
            type: "module",
        });
        this.worker.onmessage = this.messageReceived;
        this.worker.postMessage(new CreateDatabaseMessage(filename));
    }
    messageReceived(message) {
        console.log(message.data);
    }
    hashAndQueueExecuteSqlCommand(sqlStatement, bindParameters) {
        return crypto.randomUUID();
    }
    executeSql(sqlStatement, bindParameters = []) {
        const uniqueId = this.hashAndQueueExecuteSqlCommand(sqlStatement, bindParameters);
        const executeSqlMessage = new ExecuteSqlMessage(uniqueId, sqlStatement, bindParameters);
        this.worker.postMessage(executeSqlMessage);
        const result = new Promise(resolve => { });
        return result;
    }
}export{SqliteClient};