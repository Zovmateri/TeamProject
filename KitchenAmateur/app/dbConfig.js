import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLITE from 'expo-sqlite';

const FOO = 'foo.sqlite'
// this is to load from assets, no saving
export async function LoadFromAssets() {
    try {
      const datab = SQLITE.openDatabase(FOO,1);
      datab._db.closeAsync();
      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        console.log('created db again')
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      };
      await FileSystem.downloadAsync(
        Asset.fromModule(require("./assets/foo.sqlite")).uri,
        FileSystem.documentDirectory + `SQLite/${FOO}`
      );
      const database = SQLITE.openDatabase(FOO,1);
      console.log('database: ',database)
      console.log('database loaded  successfully!') 
      return database
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // this saves but doesnt load from db (local only)
export async function OpenDatabase() {
  try {
    const dbDirectory = FileSystem.documentDirectory + 'SQLite/';
    const dbFilePath = dbDirectory + FOO;
    if (!(await FileSystem.getInfoAsync(dbDirectory)).exists) {
      console.log('Creating the SQLite directory');
      await FileSystem.makeDirectoryAsync(dbDirectory);
    }
    if (!(await FileSystem.getInfoAsync(dbFilePath)).exists) {
      console.log('Database file not found. Downloading...');
      await FileSystem.downloadAsync(
        Asset.fromModule(require('./assets/foo.sqlite')).uri,
        dbFilePath
      );
    }
    const database = SQLITE.openDatabase(FOO);
    if (database) {
      console.log('Database opened successfully!');
    }
    return database;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// this deletes the database locally
export async function deleteDatabase() {
  try {
    const databasePath = FileSystem.documentDirectory + `SQLite/${FOO}`;

    // Check if the file exists before attempting to delete
    if (await FileSystem.getInfoAsync(databasePath).exists) {
      await FileSystem.deleteAsync(databasePath);
      console.log('Database deleted successfully!');
    } else {
      console.log('Database does not exist.');
    }
  } catch (error) {
    console.error(error);
  }
}