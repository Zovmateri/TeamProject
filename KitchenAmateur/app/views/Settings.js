import React, { useContext, useState } from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity} from 'react-native';
import {OpenDatabase} from '../dbConfig'
import { setLoginState } from '../Storage';
import style from "../public/style.css";
import { getLogin } from '../Storage'



export default function App({navigation}) {
    const [database, setDatabase] = React.useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [ID,setId] = useState(null);
    const login = getLogin();
    const [changes, setChanges] = useState({});
    const [marginn, setMarginn] = React.useState(0)

    const marginForOS = () => {
      if (Platform.OS === 'android') {
         setMarginn(150)
      } else if (Platform.OS === 'ios') {
         setMarginn(25)
      }
   }

    React.useEffect(() => {
        OpenDatabase().then((db) => { 
          setDatabase(db);
        })
      }, []); 
    
    React.useEffect(() => {
        if (database) {
            console.log('database')
            GetUserData();
            getUserID();
            marginForOS();
        }
    },[database,!login])
        
    const exitAccount = () => {
      setLoginState(null)
      navigation.goBack();
    }

  const GetUserData = async () => {
    try {
        if (database && login) {
            const getUserIdQuery = 
            'Select po.Имя, po.Фамилия, ' +
            'ld.Логин, ld.[Электронная почта], ld.[Номер телефона], ld.[Тип владельца данных],ld.[Хэш пароля] ' +
            'FROM [Личные данные] ld ' +
            'Left JOIN [Пользователь] po ON ld.[ID Пользователя] = po.[ID Пользователя] ' +
            'Where ld.Логин = ?;'
            await database.transaction((tx) => {
                tx.executeSql(getUserIdQuery, [login],
                        (txObj,resultSet) => {
                            setFirstName(resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[0]])
                            setLastName(resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[1]])
                            setUsername(resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[2]])
                            setEmail(resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[3]])
                            setPhone(resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[4]])
                        }
                    );
            })   
        } 
    } catch (error) {
      console.error(error);
    }
  };
  const getUserID = async () => {
    if (database && login) {
      const userIDQuery = 'SELECT [ID Пользователя] FROM [Личные данные] WHERE [Логин] = ?;'
          await database.transaction((tx) => {
            tx.executeSql(userIDQuery, [login], (txObj, resultSet) => {
              if (resultSet.rows.length > 0) {
                userID = resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[0]];
                setId(userID);
              } else {
                console.log('User not found');
              }
            });
          });
      }
  }

  const handleChange = (field, value) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Submitting form...');
    console.log('Changes:', changes);

    try {
      if (Object.keys(changes).length > 0 && database && login) {
        await updateUserData();
        await GetUserData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserData = async () => {
    try {
      if (database && login) {
        const updateQueries = [];

        for (const [field, value] of Object.entries(changes)) {
          switch (field) {
            case 'firstName':
            updateQueries.push({
              query: 'UPDATE [Пользователь] SET [Имя] = ? WHERE [ID Пользователя] = ?;',
              values: [value, ID],
            });
            break;
          case 'lastName':
            updateQueries.push({
              query: 'UPDATE [Пользователь] SET [Фамилия] = ? WHERE [ID Пользователя] = ?;',
              values: [value, ID],
            });
            break;
          case 'username':
            updateQueries.push({
              query: 'UPDATE [Личные данные] SET [Логин] = ? WHERE [ID Пользователя] = ?;',
              values: [value, ID],
            });
            break;
          case 'email':
            updateQueries.push({
              query: 'UPDATE [Личные данные] SET [Электронная почта] = ? WHERE [ID Пользователя] = ?;',
              values: [value, ID],
            });
            break;
          case 'phone':
            updateQueries.push({
              query: 'UPDATE [Личные данные] SET [Номер телефона] = ? WHERE [ID Пользователя] = ?;',
              values: [value, ID],
            });
            break;
            // Add cases for other fields if needed
            default:
              break;
          }
        }

        if (updateQueries.length > 0) {
          await database.transaction((tx) => {
            updateQueries.forEach((update) => {
              tx.executeSql(update.query, update.values);
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    textboxGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    input: {
      width: 150,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      marginHorizontal: 10,
      borderRadius: 10,
    },
    inputText: {
      width: 150,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      textAlignVertical: 'center',
    },
    save: {
        borderRadius: 25,
        backgroundColor: "#FBA806",
        paddingHorizontal: 30,
        paddingVertical: 15,
        fontSize: 15,
        marginTop: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        marginBottom: 50,
        marginTop: 100,
    },
    exit: {
        marginTop: marginn,
    }
  });

  return (
    <View style={styles.container}>
      <Image
        source={ require('../assets/pics/profile.png')}
        style={styles.profileImage}
        />
      <View style={styles.textboxGroup}>
        <TextInput 
            style={styles.input}
            placeholder="Имя"
            onChangeText={(text) => {
              setFirstName(text);
              handleChange('lastName',text)
            }}
            value={firstName}
        />
        <TextInput 
            style={styles.input}
            placeholder="Фамилия"
            onChangeText={(text) => {
              setLastName(text);
              handleChange('lastName', text);
            }}
            value={lastName}
        />
      </View>
      <View style={styles.textboxGroup}>
        <TextInput 
            style={styles.input}
            placeholder="Логин"
            onChangeText={(text) => {
              setUsername(text);
              handleChange('username', text);
            }}
            value={username}
        />
        <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Пароль"
            onChangeText={(text) => setPassword(text)}
            value={password}
        />
      </View>
      <View style={styles.textboxGroup}>
        <TextInput 
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => {
              setEmail(text);
              handleChange('email', text);
            }}
            value={email}
        />
        <TextInput
            style={styles.input}
            placeholder="Телефон"
            onChangeText={(text) => {
              setPhone(text.toString());
              handleChange('phone', text.toString());
            }} 
            value={`+7 ${phone.toString()}`}
        />
      </View> 
      <TouchableOpacity onPress={handleSubmit}>
      <Text
            style={styles.save}
            color="#FBA806"
      >Сохранить</Text>
      </TouchableOpacity>
      <Text 
        style={styles.exit}
        onPress={exitAccount}
        >Выйти из аккаунта</Text>
</View>
  );
  
}
