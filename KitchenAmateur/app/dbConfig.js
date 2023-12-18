import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLITE from 'expo-sqlite';

const FOO = 'foo.sqlite'
export async function OpenDatabase() {
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
// export async function OpenDatabase() {
//   try {
//     const datab = SQLITE.openDatabase(FOO,1);
//     datab._db.closeAsync();
    
//     const database = SQLITE.openDatabase(FOO,1);
//     console.log('database: ',database)
//     console.log('database loaded  successfully!!!') 
//     return database
//   } catch (error) {
//     console.error(error);
//     return null;
//   } 
// }
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