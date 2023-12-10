import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import * as SQLITE from 'expo-sqlite'
import { router } from 'expo-router';
import bcrypt from 'bcrypt-react-native';
import { UserAuth } from '../components/UserAuth';

export default function App() {
  const db = SQLITE.openDatabase("KitchenAmateur.sqlite")
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined);
  

  const loginUser = () => {
    db.transaction(tx => {
      tx.executeSql(
        'select логин from [личные данные] where логин = ?;',[login],
        (txObj,resultSet) => {
          const hashedPassword = resultSet.rows.item[0]?.['хэш пароля'];
          if (hashedPassword) {
            const isPasswordValid = bcrypt.compareSync(password,hashedPassword);
            if (isPasswordValid) {
              return (
                router.push('../index.js')
              )
            } else {
              console.log("Incorrect password")
              return (
                Alert.alert('Ошибка','Не правильный пароль!!')
              )
            }
          } else {
            console.log('User not found')
          }
        },
        (txObj,error) => console.log(error)
      )
    })
  }

  return (
    <View>
        <UserAuth login={login} setLogin={setLogin} password={password} setPassword={setPassword} authUser={loginUser}/>
        <StatusBar theme='auto' />
    </View>
  );
}