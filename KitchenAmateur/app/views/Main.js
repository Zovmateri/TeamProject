import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert, Pressable} from 'react-native';
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
      const query = 'SELECT al.[ID Аллергена] FROM [Аллерген пользователя] al JOIN [Личные данные] ld ON ld.[ID Пользователя] = al.[ID Пользователя] WHERE ld.[Логин] = (?);';
      database.transaction((tx) => {
        console.log('transaction for allergens started')
        tx.executeSql(
          console.log('query is:',query, '\nlogin is:',login),
          query,[login],
          (txObj, resultSet) => {
            const rows = resultSet.rows;
            console.log('Query Result:', rows); 
            
            if (rows && rows.length > 0) {
              let updatedAllergens = []; // Use a temporary array
              console.log('length:',resultSet.rows.item(0))
              for (let i = 0; i < resultSet.rows.length; i++) {
                const allergenIndex = resultSet.rows.item(i)['ID Аллергена'];
                const index = allergens.findIndex((s) => s.Index === allergenIndex);
                const allergenName = allergens[index].Name;
                const allergen = allergenName;
                updatedAllergens.push(allergen);
                console.log(allergen);
             }
            setAllergens(updatedAllergens)
            } else console.log('no rows')
            
          },
          (txObj, error) => console.log('Query Error:', error)
        );
      },
      (error) => console.log('Transaction Error:', error));
    }
  }
  const pinRecipeesToBoard = () => {

  }
  return (
    <View>
      <Text onPress={() => getUsersAllergensForSearchBox()}>
        <Text>get user allergens</Text>
      </Text>
        <StatusBar theme='auto' />
    </View>
  );
}