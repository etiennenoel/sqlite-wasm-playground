import {ExecuteSqlMessage} from "./messages/execute-sql.message";
import {SqliteMessageSerializer} from "./serializer/sqlite-message.serializer";
import {CreateDatabaseMessage} from "./messages/create-database.message";

export class SqliteClient {
  private executeSqlPromises: {[hash in string]: Promise<any>} = {}

  private worker: Worker;

  constructor(private readonly filename: string, private sqliteWorkerPath: string) {
    // Instantiate the worker

    this.worker = new Worker("assets/js/sqlite.worker.js", {
      type: "module", // You need module for the '@sqlite.org/sqlite-wasm' library.
    })
    this.worker.onmessage = this.messageReceived;
    this.worker.postMessage(new CreateDatabaseMessage(filename));
  }

  messageReceived(message: MessageEvent) {
    console.log(message.data);
  }

  /**
   *
   * @param sqlStatement
   * @param bindParameters
   *
   * returns the hash
   * @param promise
   */
  hashAndQueueExecuteSqlCommand(sqlStatement: string, bindParameters: string[]): string {
    // todo: there's a very small possibility of a collision but also, this can potentially slow down things.
    return crypto.randomUUID();
  }

  executeSql(sqlStatement: string, bindParameters: string[] = []): Promise<any> {
    const uniqueId = this.hashAndQueueExecuteSqlCommand(sqlStatement, bindParameters);
    const executeSqlMessage = new ExecuteSqlMessage(uniqueId, sqlStatement, bindParameters);

    this.worker.postMessage(executeSqlMessage);



    const result = new Promise<any>(resolve => {});



    return result;
  }
}

// Will we need to queue promises to resolve them only when we get a postMessage?
