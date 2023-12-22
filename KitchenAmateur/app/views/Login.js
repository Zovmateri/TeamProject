import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert, ActivityIndicator} from 'react-native';
import * as bcrypt from 'react-native-bcrypt';
import { UserAuth } from '../components/UserAuth';
import {OpenDatabase} from '../dbConfig'
import { setLoginState } from '../Storage';


export default function App({navigation}) {
  const [login,setLogin] = React.useState(undefined);
  const [password,setPassword] = React.useState(undefined)
  const [database, setDatabase] = React.useState(null); // Stores the database connection
  const [Checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);


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

    if(login !== null && password !== null && login !== undefined && password !== undefined) {
      setLoading(true);
      setLoadingProgress(10);
      console.log('login:', login);
      console.log('password:', password);
      if (database) {
        setLoadingProgress(20);
        console.log('database is running');
        console.log('database info:',database)
        database.transaction((tx) => {
            setLoadingProgress(30);
            tx.executeSql(
              'select [Хэш пароля] from [Личные данные] where Логин = (?);',
              [login],
              (txObj, resultSet) => {
                setLoadingProgress(50);
                const rows = resultSet.rows;
                console.log('Query Result:', rows); 
      
                if (rows && rows.length > 0) {
                  hashedPassword = rows.item(0)[Object.keys(rows.item(0))[0]];
                  console.log('hashedPassword:', hashedPassword);
                  setLoadingProgress(70);
      
                  if (hashedPassword !== null) {
                    isPasswordValid = bcrypt.compareSync(password, hashedPassword);
                    console.log('isPasswordValid:', isPasswordValid);
                    setLoadingProgress(90);
      
                    if (isPasswordValid) {
                      setLoginState(login);
                      console.log('Welcome user');
                      setLoading(false);
                      setLoadingProgress(100);
                      navigation.navigate('Main')
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
      }
    } else  return Alert.alert('Ошибка','Заполните все поля.')
  };  
  const authorized = () => {
    return (navigation.navigate('Register'))
  }
  return (
    <View>
        <UserAuth login={login} setLogin={setLogin} password={password} setPassword={setPassword} authUser={loginUser} Checked={Checked} setChecked={setChecked} nav={authorized}/>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00bb03" />
            <Text style={styles.loadingText}>Loading: {loadingProgress}%</Text>
          </View>
        )}
        <StatusBar theme='auto' />
    </View>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});