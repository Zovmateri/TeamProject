import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert, Pressable, Image, ScrollView, Modal} from 'react-native';
import {OpenDatabase} from '../dbConfig'
import { getLogin } from '../Storage';
import {MaterialCommunityIcons, AntDesign,FontAwesome} from '@expo/vector-icons'
import Checkbox from "expo-checkbox";
import DropDownPicker from 'react-native-dropdown-picker'


export default function App({navigation}) {
  const [database, setDatabase] = React.useState(null);
  const [ingredientInfo, setIngredientInfo] = React.useState([]);
  const [allIngredientInfo, setAllIngredientInfo] = React.useState([]);
  const [isAddAllergenModalVisible, setAddAllergenModalVisible] = React.useState(false);
  const [addAllergenSelected, setAddAllergenSelected] = React.useState([]);
  const [isOverlayVisible, setOverlayVisible] = React.useState(false);
  const [modalDefault, setModalDefault] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const login = getLogin();

  
  React.useEffect(() => {
    OpenDatabase().then((db) => { 
      setDatabase(db);
    })
  }, []); 

  React.useEffect(() => {
    const fetchData = async () => {
      await getUserAllergenNames();
      console.log('user allergens:',ingredientInfo) 
      await getAllAllergens();
    }
    fetchData()
  },[database]) 


   
  const getUserAllergenNames = async () => { 
    const ingredientData = [];

    if (database && login) {
      const query =
      'SELECT ia.Ингредиент, ia.Количество, ia.[Единица измерения] ' +
      'FROM [Ингредиент в наличии] ia ' +
      'JOIN [Личные данные] ld ON ld.[ID Пользователя] = ia.[Пользователь] ' +
      'WHERE ld.[Логин] = ?';
      await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            query,
            [login],
            (txObj, resultSet) => {
              const rows = resultSet.rows;
              if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                  const ingredient = {
                    ingredient: rows.item(i)[Object.keys(resultSet.rows.item(i))[0]],
                    amount: rows.item(i)[Object.keys(resultSet.rows.item(i))[1]],
                    unit: rows.item(i)[Object.keys(resultSet.rows.item(i))[2]],
                    selected: false,
                  };
                  if (!ingredientData.includes(ingredient)) {
                    ingredientData.push(ingredient);
                  }
                }
                const newIngredients = ingredientData.filter((ingredient) => !ingredientInfo.includes(ingredient));
                if (newIngredients.length > 0) {
                  setIngredientInfo(newIngredients);
                  console.log('user ingredients:',ingredientInfo);
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
      setIngredientInfo([])
    }
  }
  const getAllAllergens = async () => { 
    const allIngredientData = [];

    if (database && login) {
        const query =
            'SELECT ia.Ингредиент, ia.Количество, ia.[Единица измерения] ' +
            'FROM [Ингредиент в наличии] ia where ia.Ингредиент not in (select aa.Ингредиент from [Ингредиент в наличии] aa where aa.Пользователь = (select [ID Пользователя] FROM [Личные данные] WHERE [Логин] = ?))'
      await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            query,
            [login],
            (txObj, resultSet) => {
              const rows = resultSet.rows;
              if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    const ingredient = {
                        ingredient: rows.item(i)[Object.keys(resultSet.rows.item(i))[0]],
                        amount: rows.item(i)[Object.keys(resultSet.rows.item(i))[1]],
                        unit: rows.item(i)[Object.keys(resultSet.rows.item(i))[2]],
                        selected: false,
                      };
                  if (!allIngredientData.includes(ingredient)) { 
                    allIngredientData.push(ingredient);
                  }
                }
                const newIngredients = allIngredientData.filter((ingredient) => !allIngredientInfo.includes(ingredient));
                if (newIngredients.length > 0) {
                  setAllIngredientInfo(newIngredients);
                  console.log('all ingredients:',allIngredientInfo);
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
      setAllIngredientInfo([])
    }
  }

  const deleteUsersAllergen = async (deletedIngredient) => {
    try {
      if (database && login) {
        // Find the allergen index by name
        const index = deletedIngredient.ingredient;
        console.log('index',index);

        const query = "DELETE FROM [Ингредиент в наличии] " + "WHERE [Пользователь] = (SELECT [ID Пользователя] FROM [Личные данные] WHERE [Логин] = ?) " + "AND [Ингредиент] = ?";

        database.transaction((tx) => {
            tx.executeSql(query, [login, index]);
    
            // Update state to reflect the changes
            const newIngredientsInfo = ingredientInfo.filter((ingredient) => ingredient !== deletedIngredient);
            setIngredientInfo(newIngredientsInfo);
    
            console.log('User allergens after deletion:', newIngredientsInfo);
            
        })
        await getUserAllergenNames();
      }
    } catch (error) {
      console.error(error);
    } 
  };
  
// fix add ingredient query
  const addUserAllergen = async (addedAllergen) => {
    try {
        let userId
      if (database && login) {
        const getUserIdQuery = 'INSERT INTO [Ингредиент в наличии] ([Пользователь], [Ингредиент], [Количество], [Единица измерения]) ' +
        'VALUES (?, ?, ?, ?)'
        await database.transaction((tx) => {
            tx.executeSql(getUserIdQuery, [login],
                    (txObj,resultSet) => {
                        userId = resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[0]];
                        console.log('userid',userId)
                    }
                );
        })  
        const allergenIndex = addedAllergen.id
        console.log('index:',allergenIndex)
        const insertAllergenQuery = 'INSERT INTO [Аллерген пользователя] ([ID Пользователя], [ID Аллергена]) VALUES (?, ?);';
        await database.transaction((tx) => {
            tx.executeSql(insertAllergenQuery, [userId, allergenIndex]);
        })    
        // Update state with the new allergens
        // Update state with the new allergens
        setAllergenInfo((prevAllergenInfo) => [...prevAllergenInfo,addedAllergen]);
        await getUserAllergenNames();
        await getAllAllergens();
      } 
    } catch (error) {
      console.error(error);
    }
  };
  
    const handleCheckboxChange = (allergenId) => {
        // Toggle the checkbox state
        setIngredientInfo((prevIngredientInfo) =>
        prevIngredientInfo.map((ingredient) =>
        ingredient.name === allergenId
            ? { ...ingredient, selected: !ingredient.selected }
            : ingredient
        )
        );
    };
  
    const renderDeleteButton = () => {
        const selectedAllergens = ingredientInfo.filter((ingredient) => ingredient.selected);
      
        if (selectedAllergens.length > 0) {
          return (
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                selectedAllergens.forEach((selectedAllergen) => {
                  deleteUsersAllergen(selectedAllergen);
                });
              }}
            >
              <Text style={styles.deleteButtonText}>Удалить</Text>
            </Pressable>
          );
        } else {
          return null;
        }
      }; 

 
    const navigateToAddScreen = () => {
        setAddAllergenModalVisible(true);
        setOverlayVisible(true)
    };

    const closeAddAllergenModal = () => {
        setAddAllergenModalVisible(false);
        setOverlayVisible(false)
    };

    const handleAddAllergen = () => {
        console.log('allergen:',getAllergenInfoById(addAllergenSelected))
        addUserAllergen(getAllergenInfoById(addAllergenSelected))
        closeAddAllergenModal();
    };
    const getAllergenInfoById = (allergenId) => {
        const allergen = allIngredientInfo.find((item) => item.id === allergenId);
        return allergen;
      };
      
  return (
    <View style={styles.container}>
        <ScrollView>
            <View style={styles.buttons}>
                {renderDeleteButton()}
                <Pressable style={styles.addButton} onPress={navigateToAddScreen}>
                    <Text style={styles.addButtonText}>+ Добавить аллерген</Text>
                </Pressable>
            </View>
            <View style={styles.titlesContainer}>
            <Text style={styles.title}>Выбрано</Text>
            <Text style={styles.title}>Ингридиентов</Text>
            <Text style={styles.title}>Количество</Text>
            <Text style={styles.title}>Единица измерения</Text>
            <Text style={styles.title}>Действия</Text>
            </View>
            <View style={styles.contentContainer}>
            {ingredientInfo.map((ingredient, index) => (
                <View key={index} style={styles.allergenItem}>
                <Checkbox
                    style={styles.checkbox}
                    value={ingredient.selected}
                    onValueChange={() => handleCheckboxChange(ingredient.id)}
                />
                <Text style={styles.allergenText}>{ingredient.ingredient}</Text>
                <Text style={styles.allergenText}>{ingredient.amount}</Text>
                <Text style={styles.allergenText}>{ingredient.unit}</Text>
                <Pressable onPress={() => deleteUsersAllergen(ingredient)} style={styles.removeButton}>
                    <AntDesign name="delete" size={24} color="red" />
                </Pressable>
                </View>
            ))}
            </View>
            <Modal
                animationType="fade"
                transparent={true} 
                visible={isAddAllergenModalVisible}
                onRequestClose={closeAddAllergenModal}
                
            >
                <View style={modalStyles.modalContainer}>
                <View style={modalStyles.modalContent}>
                    <Text style={modalStyles.modalText}>Выбрать для добавления</Text>
                    <DropDownPicker
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        open={open}
                        items={allIngredientInfo.map((ingredient) => ({ label: ingredient.name, value: ingredient.unit }))}
                        defaultValue={modalDefault}
                        placeholder="Выберите аллерген"
                        containerStyle={{ height: 40, marginBottom: 20, width: 250 }}
                        style={{ backgroundColor: '#fafafa' }} 
                        itemStyle={{ 
                            justifyContent: 'flex-start', 
                        }}
                        dropDownStyle={{ backgroundColor: '#fff' }}
                        onSelectItem={(item) => setAddAllergenSelected(item.value)}
                        onChangeItem={(item) => {
                            setAddAllergenSelected(item.value), setModalDefault(item.label)}
                        }
                    />
                    <View style={modalStyles.modalButtons}>
                        <Pressable style={modalStyles.modalButton1} onPress={handleAddAllergen}>
                            <Text>Добавить</Text>
                        </Pressable>
                        <Pressable style={modalStyles.modalButton2} onPress={closeAddAllergenModal}>
                            <Text>Отмена</Text> 
                        </Pressable>
                    </View>
                </View>
                </View> 
            </Modal> 
            
        </ScrollView>
        {isOverlayVisible && <View style={modalStyles.overlay} />}
    </View>
  );
  
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: 20,
      position: 'relative',
    },
    buttons: {
        flexDirection: 'row',
    },
    title: {
      fontSize: 10,
      marginBottom: 10,
      marginHorizontal: 5,
      color: '#888',
      width: 55,
    },
    deleteImage: {
        width: 30,
        height: 30,
        marginRight: 10,
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
      paddingTop: 20,
      top: 20,
      width: '100%',
      position: 'relative',
    },
    contentContainer: {
      marginTop: 10,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 25,
      flex: 1,
      position: 'relative',
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
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginLeft: 25,
      },
    removeButton: {
      fontSize: 14,
      marginRight: 25,
      width: 24,
      height: 24,
    },
    addButton: {
      backgroundColor: '#00bb03',
      padding: 10,
      borderRadius: 25,
      alignItems: 'flex-end',
      position: 'relative',
      top: 10,
      right: 10,
      //zIndex: 1,
      marginLeft: 'auto'
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 25,
        alignItems: 'flex-end',
        position: 'relative', 
        top: 10,
        right: 10,
        zIndex: 1,
        marginRight: 'auto',
        marginLeft: 10,
      },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
    },
  });
  const modalStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(200,200,200,0.8)', // Adjust the transparency level of the overlay
      },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      marginTop: 300,
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 16,
      marginBottom: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 10,
    },
    modalButton1: {
      padding: 10,
      borderRadius: 5,
      borderWidth: 2,
      marginHorizontal: 20,
      backgroundColor: '#FBA806',
      borderColor: '#FBA806'

    },
    modalButton2: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        marginHorizontal: 20,
        backgroundColor: '#00bb03',
        borderColor: '#00bb03'
      },
  });