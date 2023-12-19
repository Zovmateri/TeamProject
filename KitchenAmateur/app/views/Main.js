import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert, Pressable, Image} from 'react-native';
import {OpenDatabase} from '../dbConfig'
import { getLogin } from '../Storage';
import {MaterialCommunityIcons, AntDesign,FontAwesome} from '@expo/vector-icons'

export default function App({navigation}) {
  const [database, setDatabase] = React.useState(null);
  const [allergens, setAllergens] = React.useState([]);
  const [selectedRecipes, setSelectedRecipes] = React.useState([]);
  const [recipeeAllergens,setRecipeeAllergens] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [originalRecipes, setOriginalRecipes] = React.useState([]);
  const login = getLogin();

  
  React.useEffect(() => {
    OpenDatabase().then((db) => { 
      setDatabase(db);
    })
  }, []); 
   
  React.useEffect(() => {
    const fetchData = async () => {
      await getUserAllergenNames();
      console.log('end first:',allergens)
    }
    fetchData()
  },[database])

  React.useEffect(() => {
    const fetchData = async () => {
      await getRecipeeAllergens();
      console.log('end second',recipeeAllergens)
    }
    fetchData()
  },[database, allergens,selectedRecipes])  

  React.useEffect(() => {
    const fetchData = async () => {
      await getAllRecipees();
      console.log('end third',selectedRecipes)
    }
    fetchData()
  },[database,allergens ,recipeeAllergens])

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
                  console.log('first');
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
   
  const getRecipeeAllergens = async() => {
    console.log('second')
    if (database) {
      const query =
      'SELECT distinct inset.[ID Набора ингредиента], aler.[ID Аллергена], aler.Название ' +
      'from [Набор ингредиента] inset ' +
      'inner join [Содержание рецепта] rccont on inset.[ID Набора ингредиента] = rccont.[ID Набора ингредиента] ' +
      'inner join Ингредиент ing on inset.[ID Ингредиента] = ing.[ID Ингредиента] ' +
      'inner join Аллерген aler on ing.[ID Аллергена] = aler.[ID Аллергена] ' +
      'Where rccont.[ID Рецепта]= ?';

      const allergensSet = new Set(recipeeAllergens);

      for (const recipe of selectedRecipes) {
        await new Promise((resolve, reject) => {
          database.transaction((tx) => {
            tx.executeSql( 
              query,[recipe.id], 
              (txObj, resultSet) => {
                
                for (let i = 0; i < resultSet.rows.length; i++) {
                  allergensSet.add(resultSet.rows.item(i)[Object.keys(resultSet.rows.item(i))[2]])
                }
                // Check if recipeeAllergens has anything added
                if (allergensSet.size > recipeeAllergens.length) {
                  setRecipeeAllergens(Array.from(allergensSet));
                } else {
                  // No more allergens are added, move to the next step 
                  resolve();
                }
              },
              (txObj, error) => reject(error)  
            ); 
          }); 
        });
      } 
    }  
  }

  const getAllRecipees = async () => {
    console.log('start');
    if (database) {
      const query =
        'SELECT distinct rc.[ID Рецепта], rc.[Название рецепта],rc.Инструкция, rc.[Время приготовления], ' +
        'rc.[Рейтинг рецепта],rc.[Фотография блюда], ing.[Название ингредиента] ' +
        'FROM Рецепт rc ' +
        'LEFT JOIN [Содержание рецепта] rccont ON rc.[ID Рецепта] = rccont.[ID Рецепта] ' +
        'LEFT JOIN [Набор ингредиента] inset ON rccont.[ID Набора ингредиента] = inset.[ID Набора ингредиента] ' +
        'LEFT JOIN Ингредиент ing ON inset.[ID Ингредиента] = ing.[ID Ингредиента]';
  
      await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            query,
            [],
            (txObj, resultSet) => {
              const recipesWithIngredients = [];
              let currentRecipe = null;
              for (let i = 0; i < resultSet.rows.length; i++) {
                const row = resultSet.rows.item(i);
                const recipeId = row[Object.keys(resultSet.rows.item(i))[0]];
  
                if (!currentRecipe || currentRecipe.id !== recipeId) {
                  // Create a new recipe object
                  currentRecipe = {
                    id: recipeId,
                    name: row[Object.keys(resultSet.rows.item(i))[1]],
                    instructions: row[Object.keys(resultSet.rows.item(i))[2]],
                    cookingTime: row[Object.keys(resultSet.rows.item(i))[3]],
                    rating: row[Object.keys(resultSet.rows.item(i))[4]],
                    photo: row[Object.keys(resultSet.rows.item(i))[5]],
                    ingredients: [],
                  };
  
                  recipesWithIngredients.push(currentRecipe);
                }
  
                // Add ingredient to the current recipe
                const ingredientName = row[Object.keys(resultSet.rows.item(i))[6]];
                if (ingredientName) {
                  currentRecipe.ingredients.push(ingredientName);
                }
              }
  
              const recipesWithoutAllergens = recipesWithIngredients.filter((recipe) => {
                const recipeeAllergenOverlap =
                  Array.isArray(recipeeAllergens) &&
                  recipeeAllergens.some((recipeAllergen) => allergens.includes(recipeAllergen));
                return !recipeeAllergenOverlap;
              });
  
              const sortedRecipes = recipesWithoutAllergens.sort((a, b) => b.rating - a.rating);
              setSelectedRecipes(sortedRecipes);
              setOriginalRecipes(sortedRecipes);
              resolve();
            },
            (txObj, error) => reject(error)
          );
        });
      });
    }
  };
  
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  
    if (text) {
      const filteredRecipes = originalRecipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().startsWith(text.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().startsWith(text.toLowerCase())
          ) ||
          recipe.instructions.toLowerCase().includes(text.toLowerCase())
      );
      const filteredRecipesWithoutAllergens =
        allergens.length > 0
          ? filteredRecipes.filter(
              (recipe) =>
                !recipeeAllergens.some((allergen) => allergens.includes(allergen))
            )
          : filteredRecipes;
  
      setSelectedRecipes(filteredRecipesWithoutAllergens);
    } else {
      const filteredRecipesWithoutAllergens =
        allergens.length > 0
          ? originalRecipes.filter(
              (recipe) =>
                !recipeeAllergens.some((allergen) => allergens.includes(allergen))
            )
          : originalRecipes;
  
      setSelectedRecipes(filteredRecipesWithoutAllergens);
    }
  };
  
  
  
  return (
    <View>
      <StatusBar theme='auto' />
      <TextInput
        style={styles.searchBar}
        placeholder="Поиск..."
        onChangeText={handleSearchTextChange}
        value={searchText}
      />
      {selectedRecipes.length > 0 && (
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {selectedRecipes.map((recipe, index) => (
            <View key={index} style={{ margin: 5, padding: 10, flexDirection: 'column' }}>
              <Image source={{ uri: recipe.photo }} style={{ width: 160, height: 250, borderRadius: 25, marginBottom: 2 }} />
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
const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    width: 380,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 50,
    marginTop: 15,
  },
});