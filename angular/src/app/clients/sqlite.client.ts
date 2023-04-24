import {Result} from "../../../sqlite.client";

export class SqliteClient {
  constructor(private readonly filename: string) {

  }

  executeSql(sqlStatement: string, bindParameters: string[]): Promise<Result> {
    const result = new Promise<Result>();



    return result;
  }
}
