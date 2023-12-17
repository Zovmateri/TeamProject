import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import * as bcrypt from 'react-native-bcrypt';
import { UserAuth } from '../components/UserAuth';
import {OpenDatabase} from '../dbConfig'
import { getLogin } from '../Storage';


export default function App() {
  const [database, setDatabase] = React.useState(null); // Stores the database connection
  const [allergens, setAllergens] = React.useState([]);
  const login = getLogin();

  
  React.useEffect(() => {
    OpenDatabase().then((db) => {
      setDatabase(db);
    })
  }, []);

  const getUsersAllergensForSearchBox = () => {
    let foundAllergens
    let allergenIndex
    if (database) {
      const query = `SELECT al.[ID Аллергена] 
                     FROM [Аллерген пользователя] al 
                     JOIN [Личные данные] ld ON ld.[ID Пользователя] = al.[ID Пользователя] 
                     WHERE ld.[Логин] = (?);`;
      database.transaction((tx) => {
        tx.executeSql(
          query,[login],
          (txObj, resultSet) => {
            for (let i=0; i< resultSet.rows.length; i++) {
              allergenIndex = resultSet.rows.item(i)['ID Аллергена']
              const index = index = allergens.findIndex((s) => s.Index === allergenIndex);
              const allergentName = allergens[index].Name;
              const allergen = allergentName;
              allergens.push(allergen)
            }
            setAllergens(allergens)
          },
          (txObj, error) => console.log('Query Error:', error)
        );
      },
      (error) => console.log('Transaction Error:', error));
    } else {
      console.log('database not connected!');
    }
  }
  const pinRecipeesToBoard = () => {

  }
  return (
    <View>
      <Text onPress={getUsersAllergensForSearchBox}>
        <Text>get user allergens</Text>
      </Text>
        <StatusBar theme='auto' />
    </View>
  );
}