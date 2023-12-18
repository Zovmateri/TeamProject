import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert, Pressable, Image} from 'react-native';
import {OpenDatabase} from '../dbConfig'
import { getLogin } from '../Storage';
import {MaterialCommunityIcons, AntDesign,FontAwesome} from '@expo/vector-icons'


export default function App({navigation}) {
  const [database, setDatabase] = React.useState(null); // Stores the database connection
  const [allergens, setAllergens] = React.useState([]);
  const [selectedRecipes, setSelectedRecipes] = React.useState([]);
  const [recipeeAllergens,setRecipeeAllergens] = React.useState([]);
  const login = getLogin();

  
  React.useEffect(() => {
    OpenDatabase().then((db) => { 
      setDatabase(db);
    })
  }, []); 
   
  React.useLayoutEffect(() => {
    const fetchData = async () => {
      if (database) {
        await getUserAllergenNames();
        await getRecipeeAllergens();
        await getAllRecipees(); // Wait for getRecipeeAllergens to complete before calling getAllRecipees
      }
    };
 
    fetchData(); 
  }, [database]);
  
  React.useEffect(() => {
    getAllRecipees();
  },[recipeeAllergens])

  const getUserAllergenNames = async () => {
    const temporaryAllergenNames = [];

    if (database) {
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
                  const allergenName = rows.item(i)['Название'];
                  temporaryAllergenNames.push(allergenName);
                }
                setAllergens(temporaryAllergenNames);
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
    }
  }
   
  const getRecipeeAllergens = async() => {
    if (database) {
      const query =
      'SELECT inset.[ID Набора ингредиента], aler.[ID Аллергена],aler.Название ' +
      'from [Набор ингредиента] inset ' +
      'inner join [Содержание рецепта] rccont on inset.[ID Набора ингредиента] = rccont.[ID Набора ингредиента] ' +
      'inner join Ингредиент ing on inset.[ID Ингредиента] = ing.[ID Ингредиента] ' +
      'inner join Аллерген aler on ing.[ID Аллергена] = aler.[ID Аллергена] ' +
      'Where rccont.[ID Рецепта]= ?';

      const Allergens = [];

      for (const recipe of selectedRecipes) {
        await new Promise((resolve, reject) => {
          database.transaction((tx) => {
            tx.executeSql( 
              query,[recipe.id], 
              (txObj, resultSet) => {
                
                for (let i = 0; i < resultSet.rows.length; i++) {
                  Allergens.push(resultSet.rows.item(i)['Название'])
                  console.log('allergen name:',resultSet.rows.item(i)['Название'])
                }
                setRecipeeAllergens(Allergens)
                console.log('recipe allergens:',Allergens)
                resolve();
              },
              (txObj, error) => reject(error)  
            ); 
          }); 
        });
      } 
    }
  }

  const getAllRecipees = async() => {

    if (database) {
      const query =
        'Select rc.[ID Рецепта], rc.[Название рецепта],rc.Инструкция, rc.[Время приготовления], ' +
        'rc.[Рейтинг рецепта],rc.[Фотография блюда] From Рецепт rc';

      await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql( 
            query,[], 
            (txObj, resultSet) => {
              const recipes = [];
              for (let i = 0; i < resultSet.rows.length; i++) {
                const row = resultSet.rows.item(i);
                const recipe = {
                  id: row['ID Рецепта'],
                  name: row['Название рецепта'],
                  instructions: row['Инструкция'],
                  cookingTime: row['Время приготовления'],
                  rating: row['Рейтинг рецепта'],
                  photo: row['Фотография блюда'],
                };
                const hasOverlap = recipeeAllergens.some((recipeAllergen) => allergens.includes(recipeAllergen))
                if (!hasOverlap) {
                  recipes.push(recipe);
                }

              }
              setSelectedRecipes(recipes)
              resolve(); 
            }, 
            (txObj, error) => reject(error) 
          );
        }); 
      });
    }
  }
  
  return (
    <View>
      <StatusBar theme='auto' />
      {allergens.length > 0 && (
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {allergens.map((allergen, index) => (
            <Text 
              key={index}
              style={{ margin: 5, backgroundColor: '#eee', padding: 10 }}
            >
              {allergen}
            </Text>
          ))}
        </View>
      )}
      {selectedRecipes.length > 0 && (
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {selectedRecipes.map((recipe, index) => (
            <View key={index} style={{ margin: 5, padding: 10, flexDirection: 'column' }}>
              <Image source={{ uri: recipe.photo }} style={{ width: 150, height: 150, borderRadius: 25, marginBottom: 2 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="face-man" size={15} color="green" style={{ marginRight: 5 }} />
                  <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{recipe.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AntDesign name="staro" size={10} color="green" style={{ marginRight: 5 }} />
                  <Text>{recipe.rating} </Text>
                  <FontAwesome name="comment-o" size={10} color="green" style={{ marginRight: 5 }} />
                  <Text>{recipe.rating} </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}