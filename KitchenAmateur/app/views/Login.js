import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import { router } from 'expo-router';
import * as bcrypt from 'react-native-bcrypt';
import { UserAuth } from '../components/UserAuth';
import {OpenDatabase} from '../dbConfig'
import { navigateToIndex, navigateToRegister } from '../routes';


export default function App() {
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined)
  const [database, setDatabase] = React.useState(null); // Stores the database connection

  React.useEffect(() => {
    OpenDatabase().then((db) => {
      setDatabase(db);
    })
  }, []);

  bcrypt.setRandomFallback((len) => {
    const buf = new Uint8Array(len);
    return buf.map(() => Math.floor(Isaac.random() * 256));
  });

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
  return (
    <View>
        <UserAuth login={login} setLogin={setLogin} password={password} setPassword={setPassword} authUser={loginUser}/>
        <StatusBar theme='auto' />
    </View>
  );
}