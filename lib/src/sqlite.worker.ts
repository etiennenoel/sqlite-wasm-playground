import {SqliteMessageSerializer} from "./serializer/sqlite-message.serializer";
import {SqliteMessageTypeEnum} from "./enums/sqlite-message-type.enum";
import {CreateDatabaseMessage} from "./messages/create-database.message";
import {SqliteMessageInterface} from "./interfaces/sqlite-message.interface";
import {CreateDatabaseResultMessage} from "./messages/create-database-result.message";
import {default as sqlite3InitModule} from "../third_party/sqlite-wasm/sqlite3.mjs";

let db;
const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

self.onmessage = (messageEvent: MessageEvent) => {
  const sqliteMessage = messageEvent.data as SqliteMessageInterface;

  switch (sqliteMessage.type) {
    case SqliteMessageTypeEnum.CreateDatabase:
      sqlite3InitModule({
        print: log,
        printErr: error,
      }).then((sqlite3) => {
        try {
          sqlite3.sqlite3.initWorker1API();
          db = new sqlite3.sqlite3.oo1.OpfsDb((sqliteMessage as CreateDatabaseMessage).filename);
        } catch (err) {
          error(err.name, err.message);
        }
      });

      console.log("Create database message received")
      self.postMessage(new CreateDatabaseResultMessage());

    case SqliteMessageTypeEnum.ExecuteSql:
      // Execute the sql command.
      // Check if the database exists and if yes,
  }
}

