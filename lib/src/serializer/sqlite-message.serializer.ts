import {SqliteMessageInterface} from "../interfaces/sqlite-message.interface";
import {SqliteMessageTypeEnum} from "../enums/sqlite-message-type.enum";
import {ExecuteSqlMessage} from "../messages/execute-sql.message";
import {ExecuteSqlResultMessage} from "../messages/execute-sql-result.message";
import {CreateDatabaseMessage} from "../messages/create-database.message";

export class SqliteMessageSerializer {
  static serialize(sqliteMessage: SqliteMessageInterface): string {
    return JSON.stringify(sqliteMessage);
  }

  static validateProperties(message: any, properties: string[]) {
    properties.forEach(property => {
      if(message.hasOwnProperty(property) === false) {
        throw new Error("The property '" + property + "' wasn't found in the Sqlite message and is mandatory.")
      }
    })
  }

  static deserialize(sqliteMessage: string): SqliteMessageInterface {
    const message = JSON.parse(sqliteMessage);

    if(message.hasOwnProperty("type") === false) {
      throw new Error("The Sqlite message must contain the 'type' property.")
    }

    switch (message.type as SqliteMessageTypeEnum) {
      case SqliteMessageTypeEnum.ExecuteSql:
        SqliteMessageSerializer.validateProperties(message, ["uniqueId", "sqlStatement", "bindParameters"]);
        return new ExecuteSqlMessage(message.uniqueId, message.sqlStatement, message.bindParameters);

      case SqliteMessageTypeEnum.ExecuteSqlResult:
        SqliteMessageSerializer.validateProperties(message, ["uniqueId", "result"]);
        return new ExecuteSqlResultMessage(message.uniqueId, message.result);

      case SqliteMessageTypeEnum.CreateDatabase:
        SqliteMessageSerializer.validateProperties(message, ["filename"]);
        return new CreateDatabaseMessage(message.filename);

      default:
        throw new Error("The property 'type' of message contains an invalid value '" + message.type + "'. ")
    }
  }
}
