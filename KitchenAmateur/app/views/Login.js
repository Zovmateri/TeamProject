import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import * as SQLITE from 'expo-sqlite'
import { router } from 'expo-router';
import bcrypt from 'bcrypt-react-native';

export default function App() {
  const db = SQLITE.openDatabase("KitchenAmateur.sqlite")
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined);
  const hashedPassword = undefined;
  const [id,setID] = React.useState(undefined);

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
          }
        },
        (txObj,error) => console.log(error)
      )
    })
  }
  const registerUser = () => {
    hashedPassword = bcrypt.hash(10,password);
    db.transaction(tx => {
      tx.executeSql(
        'insert into пользователь (имя,[trial_фамилия_3],[режим веган],[trial_статус_5]) values (?,?,0,0);',[currentName,surname],
        (txObj,resultSet) => {
          setID(resultSet.insertId),
          console.log('id found:',id)
        },
        (txObj,error) => console.log(error)
      )
      tx.executeSql(
        'insert into [личные данные] ([trial_id пользователя_3],[логин],[электронная почта],[тип владельца данных],[хэш пароля]) values (?,?,?,?,0,?)',
        [id,login,email,hashedPassword],
        (txObj,resultSet) => {

        },
        (txObj,error) => console.log(error)
      )
    })
  }

  return (
    <View>
        <UserRegister login={login} setLogin={setLogin} currentName={currentName} setCurrentName={setCurrentName} surname={surname} setSurname={setSurname} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>
        <StatusBar theme='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8,
  },
});