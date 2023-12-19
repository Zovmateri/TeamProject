import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert, Pressable, Image} from 'react-native';
import {OpenDatabase} from '../dbConfig'
import { getLogin } from '../Storage';
import {MaterialCommunityIcons, AntDesign,FontAwesome} from '@expo/vector-icons'

export default function App({navigation}) {
  const [database, setDatabase] = React.useState(null);
  const [allergens, setAllergens] = React.useState([]);
  const login = getLogin();

  
  React.useEffect(() => {
    OpenDatabase().then((db) => { 
      setDatabase(db);
    })
  }, []); 

  React.useEffect(() => {
    const fetchData = async () => {
      await getUserAllergenNames();
      console.log('user allergens:',allergens) 
    }
    fetchData()
  },[database])

   
  const getUserAllergenNames = async () => { 
    const temporaryAllergenNames = [];

    if (database && login) {
      const query =
        'SELECT a.[Название] FROM [Аллерген пользователя] al ' +
        'JOIN [Личные данные] ld ON ld.[ID Пользователя] = al.[ID Пользователя] ' +
        'JOIN [Аллерген] a ON a.[ID Аллергена] = al.[ID Аллергена] ' +
        'WHERE ld.[Логин] = (?);';
 
      await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            query,
            [login],
            (txObj, resultSet) => {
              const rows = resultSet.rows;
              if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                  const allergenName = rows.item(i)[Object.keys(resultSet.rows.item(0))[0]];
                  if (!temporaryAllergenNames.includes(allergenName)) {
                    temporaryAllergenNames.push(allergenName);
                  }
                }
                const newAllergens = temporaryAllergenNames.filter((allergen) => !allergens.includes(allergen));
                if (newAllergens.length > 0) {
                  setAllergens(newAllergens);
                  console.log('user allergens:',allergens);
                } 
                
                resolve();
              } else {
                console.log('No rows found.');
                resolve();
              }
            },
            (txObj, error) => reject(error)
          );
        });
      });
    } else if (database) {
      setAllergens([])
    }
  }

  
  return (
    <View style={styles.container}>
      <View style={styles.stackContainer}>
        <Pressable style={styles.addButton} onPress={() => navigateToAddScreen()}>
          <Text style={styles.addButtonText}>+ Добавить аллерген</Text>
        </Pressable>
        <View style={styles.titlesContainer}>
          <Text style={styles.title}>Выбрано</Text>
          <Text style={styles.title}>Ингредиент</Text>
          <Text style={styles.title}>Действия</Text>
        </View>
        <View style={styles.contentContainer}>
        {allergens.map((allergen, index) => (
            <View key={index} style={styles.allergenItem}>
                <Text style={styles.allergenText}>{allergen}</Text>
                <Image source={require('../assets/pics/navIcons/AccountGreen.png')} style={styles.allergenIcon} />
                <Pressable onPress={() => removeAllergen(allergen)}>
                    <Text style={styles.removeButton}>Удалить</Text>
                </Pressable>
            </View>
            ))}
        </View>
        
      </View>
    </View>
  );
  
  
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20,
      },
      stackContainer: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      },
    title: {
      fontSize: 15,
      marginBottom: 10,
      marginHorizontal: 5,
    },
    titlesContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      backgroundColor: '#f2f2f2',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 20,
      paddingVertical: 10,
      width: '100%',
      position: 'relative', // Added relative position to the titles container
    },
    contentContainer: {
      marginTop: 10,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 15,
      flex: 1,
      position: 'relative', // Added relative position to the content container
    },
    allergenItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    allergenText: {
      fontSize: 16,
    },
    allergenIcon: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    removeButton: {
      color: 'red',
      fontSize: 14,
    },
    addButton: {
        backgroundColor: '#00bb03',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 'auto',
        borderRadius: 25,
      },
    addButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
    