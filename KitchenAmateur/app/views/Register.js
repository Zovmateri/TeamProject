import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, ImageBackground} from 'react-native';
import * as SQLITE from 'expo-sqlite'
import { Link } from 'expo-router';
import bcrypt from 'bcrypt-react-native';
import styled from 'styled-components';
import { UserRegister } from '../components/UserRegister';



export default function App() {
  const db = SQLITE.openDatabase("KitchenAmateur.sqlite")
  const [currentName, setCurrentName] = React.useState(undefined)
  const [surname,setSurname] = React.useState(undefined);
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined);
  const [email,setEmail] = React.useState(undefined);
  const hashedPassword = undefined;
  const [id,setID] = React.useState(undefined);

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

