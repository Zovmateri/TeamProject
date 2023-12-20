import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {View, Alert} from 'react-native';
//import * as bcrypt from 'bcryptjs';
import { UserRegister } from '../components/UserRegister';
import {OpenDatabase, updateAppDatabase} from '../dbConfig'
import * as Isaac from 'isaac'
import bcrypt from 'react-native-bcrypt'

export default function App({navigation}) {
  const [name, setName] = React.useState(undefined)
  const [surname,setSurname] = React.useState(undefined);
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined);
  const [email,setEmail] = React.useState(undefined);
  const [id,setID] = React.useState(undefined);
  const [database, setDatabase] = React.useState(null);
  const registrationDate = new Date().getDate();


  React.useEffect(() => {
    OpenDatabase().then((db) => {
      setDatabase(db);
    })
  }, []);

  const IsLoginUnique = () => {
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'select count(*) from [Личные данные] where [Логин] = ?',
          [login],
          (txObj, resultSet) => {
            const count = resultSet.rows.item(0)['count(*)'];
            if (count === 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (txObj, error) => reject(error)
        );
      });
    });
  };
  const IsEmailUnique = () => {
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'select count(*) from [Личные данные] where [Электронная почта] = ?',[email],
          (txObj, resultSet) => {
            const count = resultSet.rows.item(0)['count(*)'];
            if (count === 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (txObj, error) => reject(error)
        );
      });
    });
  };  
  bcrypt.setRandomFallback((len) => {
    const buf = new Uint8Array(len);
    return buf.map(() => Math.floor(Isaac.random() * 256));
  });
  const registerUser = async () => {
    let hashedPassword;
    let salt;
  
    try {
      if (!(await IsLoginUnique())) {
        Alert.alert('Ошибка', 'Такой логин уже существует, попробуйте опять с другим логином.');
        return;
      }
  
      if (!(await IsEmailUnique())) {
        Alert.alert('Ошибка', 'У данной электронной почты уже существует учетная запись.');
        return;
      }
  
      if (password !== null && password !== undefined) {
        salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
        console.log('found hash', hashedPassword);
      }
  
      await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          console.log('first query');
          tx.executeSql(
            'insert into [Пользователь] ([Имя],[Фамилия],[режим Веган],[Статус]) values (?,?,0,0);',
            [name, surname],
            (txObj, resultSet) => {
              // Set the ID and resolve the promise
              console.log('id is:', resultSet.insertId);
              setID(resultSet.insertId);
              resolve();
            },
            (txObj, error) => reject(error)
          );
        });
      });
  
      // Callback function to execute the second query
      await new Promise((resolve, reject) => {
        console.log('repeat first id:', id);
        console.log('second query');
        database.transaction((tx) => {
          console.log('starting second queue now:');
          console.log(id, login, email, registrationDate, hashedPassword);
          tx.executeSql(
            'insert into [Личные данные] ([ID Пользователя],[Логин],[Электронная почта],[Дата регистрации],[Тип владельца данных],[Хэш пароля]) values (?,?,?,?,0,?)',
            [id, login, email, registrationDate, hashedPassword],
            (txObj, secondResultSet) => {
              console.log('second id is:', secondResultSet.insertId);
              console.log('success!!!!');
              navigation.navigate('Login')
              resolve();
            },
            (txObj, secondError) => {
              console.error('Error in second query:', secondError);
              reject(secondError);
            }
          );
        });
      });
      console.log('the end');
    } catch (error) {
      console.error('Error during registration:', error); 
    }
  };
  const authorized = () => {
    return (navigation.navigate('Login'))
  }
  return (
    <View>
        <UserRegister login={login} setLogin={setLogin} currentName={name} setCurrentName={setName} surname={surname} setSurname={setSurname} email={email} setEmail={setEmail} password={password} setPassword={setPassword} registerUser={registerUser} nav={authorized}/>
        <StatusBar theme='auto' />
    </View>
  );
}

