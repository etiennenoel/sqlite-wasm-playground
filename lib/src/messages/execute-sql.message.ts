import {SqliteMessageInterface} from "../interfaces/sqlite-message.interface";
import {SqliteMessageTypeEnum} from "../enums/sqlite-message-type.enum";

export class ExecuteSqlMessage implements SqliteMessageInterface {
  type: SqliteMessageTypeEnum = SqliteMessageTypeEnum.ExecuteSql;

  constructor(public readonly uniqueId: string,
              public readonly sqlStatement: string,
              public readonly bindingParameters: string[] = []) {
  }


}
