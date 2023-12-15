import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import * as SQLITE from 'expo-sqlite'
import { router } from 'expo-router';
import * as bcrypt from 'bcryptjs';
import { UserAuth } from '../components/UserAuth';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


export default function App() {
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined)
  const [isLoading, setIsLoading] = React.useState(true); // Tracks database loading state
  const [database, setDatabase] = React.useState(undefined); // Stores the database connection

  const FOO = 'foo.sqlite'
    async function OpenDatabase() {
      try {
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        };
        await FileSystem.downloadAsync(
          Asset.fromModule(require("../assets/foo.sqlite")).uri,
          FileSystem.documentDirectory + `SQLite/${FOO}`
        );
        console.log('database: ',SQLITE.openDatabase(FOO,1))
        setDatabase(SQLITE.openDatabase(FOO));
        setIsLoading(false); // Database loaded, set loading state to false
        console.log('database loaded successfully!') 
      } catch (error) {
        console.error(error);
      }
    }
  React.useEffect(() => {
    OpenDatabase();
  }, []);
  
  function CloseDatabase() {
    if (database) {
      database.closeAsync()
      console.log('database is closed')
    }
  }
  const loginUser = () => {
    console.log('login:', login);
    console.log('password:', password);
    if (database) {
      console.log('database is running');
      console.log('database info:',database)
      database.transaction((tx) => {
        tx.executeSql(
          'select [Хэш пароля] from [Личные данные] where Логин = (?);',
          [login],
          (txObj, resultSet) => {
            const rows = resultSet.rows;
            console.log('Query Result:', rows);
  
            if (rows && rows.length > 0) {
              hashedPassword = rows.item(0)['Хэш пароля'];
              console.log('hashedPassword:', hashedPassword);
  
              if (hashedPassword !== null) {
                isPasswordValid = bcrypt.compareSync(password, hashedPassword);
                console.log('isPasswordValid:', isPasswordValid);
  
                if (isPasswordValid) {
                  console.log('Welcome user');
                } else {
                  console.log('Incorrect password');
                  Alert.alert('Ошибка', 'Не правильный пароль!!');
                }
              } else {
                console.log('Password is null');
              }
            } else {
              console.log('No rows returned');
            }
          },
          (txObj, error) => console.log('Query Error:', error)
        );
      },
      (error) => console.log('Transaction Error:', error));
    } else {
      console.log('database not connected!');
    }
  };
  if (isLoading) {
    return (
      <View>
        <Text>Connecting to database...</Text>
        <StatusBar theme="auto" />
      </View>
    );
  }
  
  return (
    <View>
        <UserAuth login={login} setLogin={setLogin} password={password} setPassword={setPassword} authUser={loginUser}/>
        <StatusBar theme='auto' />
    </View>
  );
}