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
  const [ingrientPlaceHolder, setIngrientPlaceHolder] = React.useState([]);
  const [isOverlayVisible, setOverlayVisible] = React.useState(false);
  const [modalDefaultIngredient, setModalDefaultIngredient] = React.useState(null);
  const [modalDefaultUnit, setModalDefaultUnit] = React.useState(null);
  const [unit,setUnit] = React.useState(null);
  const [amount,setAmount] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const login = getLogin();
  const [items, setItems] = React.useState([
    {label: 'шт.', value: '1'},
    {label: 'г.', value: '2'},
    {label: 'кг.', value: '3'},
    {label: 'л.', value: '4'},
    {label: 'мл.', value: '5'},
    {label: 'чайн. л.', value: '6'},
    {label: 'стол. л.', value: '7'}
  ]);

  
  React.useEffect(() => {
    OpenDatabase().then((db) => { 
      setDatabase(db);
    })
  }, []); 

  React.useEffect(() => {
    const fetchData = async () => {
      await getUserIngredientNames();
      console.log('user allergens:',ingredientInfo) 
      await getAllIngredients();
    }
    fetchData()
  },[database]) 


   
  const getUserIngredientNames = async () => { 
    const ingredientData = [];

    if (database && login) {
      const query =
      'SELECT ia.Ингредиент, aa.[Название ингредиента], ia.Количество, ia.[Единица измерения] ' +  
      'FROM [Ингредиент в наличии] ia ' + 
      'JOIN [Ингредиент] aa on ia.Ингредиент = aa.[ID Ингредиента] ' +
      'JOIN [Личные данные] ld ON ld.[ID Пользователя] = ia.[Пользователь] ' +
      'WHERE ld.[Логин] = ?;'
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
                    id: rows.item(i)[Object.keys(resultSet.rows.item(i))[0]],
                    ingredient: rows.item(i)[Object.keys(resultSet.rows.item(i))[1]],
                    amount: rows.item(i)[Object.keys(resultSet.rows.item(i))[2]],
                    unit: rows.item(i)[Object.keys(resultSet.rows.item(i))[3]],
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
  const getAllIngredients = async () => { 
    const allIngredientData = [];

    if (database && login) {
        const query =
            'SELECT  ab.[ID Ингредиента], ab.[Название ингредиента] ' +
            'FROM Ингредиент ab ' +
            'WHERE NOT EXISTS ( ' +
                'SELECT 1 ' +
                'FROM [Ингредиент в наличии] ia ' +
                'JOIN [Личные данные] ld ON ia.Пользователь = ld.[ID Пользователя] ' +
                'WHERE ab.[ID Ингредиента] = ia.[Ингредиент] AND ld.[Логин] = ? ' +
            ');'
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
                        id: rows.item(i)[Object.keys(resultSet.rows.item(i))[0]],
                        ingredient: rows.item(i)[Object.keys(resultSet.rows.item(i))[1]],
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

  const deleteUsersIngredient = async (deletedIngredient) => {
    try {
      let currentIngredientInfo = ingredientInfo;
      if (database && login) {
        // Find the allergen index by name
        const index = deletedIngredient.id;
        console.log('index',index);

        const query = "DELETE FROM [Ингредиент в наличии] " + "WHERE [Пользователь] = (SELECT [ID Пользователя] FROM [Личные данные] WHERE [Логин] = ?) " + "AND [Ингредиент] = ?";

        database.transaction((tx) => {
            tx.executeSql(query, [login, index]);
    
            // Update state to reflect the changes
            const newIngredientsInfo = ingredientInfo.filter((ingredient) => ingredient !== deletedIngredient);
            setIngredientInfo(newIngredientsInfo);
    
            console.log('User allergens after deletion:', newIngredientsInfo);
            
        })
        await getUserIngredientNames();
      }
    } catch (error) {
      console.error(error);
    } 
  };
  
// fix add ingredient query
  const addUserIngredient = async (addedIngredient) => {
    try {
        let userId
      if (database && login) {
        const getUserIdQuery = 'SELECT [ID Пользователя] FROM [Личные данные] WHERE [Логин] = ?;'
        await database.transaction((tx) => {
            tx.executeSql(getUserIdQuery, [login],
                    (txObj,resultSet) => {
                        userId = resultSet.rows.item(0)[Object.keys(resultSet.rows.item(0))[0]];
                    }
                );
        })  
        if (amount !== null && unit !== null && addedIngredient.id !== null) {
            const ingredientIndex = addedIngredient.id
          console.log('index:',ingredientIndex)
          const insertIngredientQuery = 'INSERT INTO [Ингредиент в наличии] ([Пользователь], [Ингредиент], [Количество], [Единица измерения]) ' +
          'VALUES (?, ?, ?, ?)';
          await database.transaction((tx) => {
              tx.executeSql(insertIngredientQuery, [userId, ingredientIndex,unit,amount]);
          })
          setAmount(null)    
          setIngredientInfo((prevIngredientInfo) => [...prevIngredientInfo,addedIngredient]);
          await getUserIngredientNames();
          await getAllIngredients();
        } else {Alert.alert('Ошибка', 'Введите данные для добавление')}
      } 
    } catch (error) {
      console.error(error);
    }
  };
  
    const handleCheckboxChange = (ingredientId) => {
        // Toggle the checkbox state
        setIngredientInfo((prevIngredientInfo) =>
        prevIngredientInfo.map((ingredient) =>
        ingredient.id === ingredientId
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
                  deleteUsersIngredient(selectedAllergen);
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
        console.log('allergen:',getAllergenInfoById(ingrientPlaceHolder))
        addUserIngredient(getAllergenInfoById(ingrientPlaceHolder))
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
                    <Text style={styles.addButtonText}>+ Добавить ингредиент</Text>
                </Pressable>
            </View>
            <View style={styles.titlesContainer}>
            <Text style={styles.title}>Выбрано</Text>
            <Text style={styles.title}>Ингридиент</Text>
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
                <Text style={styles.allergenTextUnit}>{ingredient.unit}</Text>
                <Pressable onPress={() => deleteUsersIngredient(ingredient)} style={styles.removeButton}>
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
                        items={allIngredientInfo.map((ingredient) => ({ label: ingredient.ingredient, value: ingredient.id }))}
                        setValue={setModalDefaultIngredient}
                        value={modalDefaultIngredient}
                        placeholder="Ингредиент"
                        containerStyle={{ height: 40, marginBottom: 20, width: 250}}
                        style={{ 
                          backgroundColor: '#fafafa',
                          zIndex: 10,
                         }} 
                        itemStyle={{ 
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fff' }}
                        onSelectItem={(item) => setIngrientPlaceHolder(item.value)}
                        onChangeItem={(item) => 
                          setIngrientPlaceHolder(item.value)
                        }
                    />
                    <View style={modalStyles.modalCount}>
                      <TextInput
                        style={{
                          borderColor: '#000',
                          borderWidth: 1,
                          padding: 10,
                          height: 48,
                          width: 250,
                          borderRadius: 8,
                          marginBottom: 10,
                          backgroundColor: '#fafafa',
                        }}
                        placeholder="Единица измерения"
                        onChangeText={(amount) => setAmount(amount)}
                        />
                    </View>
                    <DropDownPicker
                        onOpen={() => setOpen2(true)}
                        onClose={() => setOpen2(false)}
                        open={open2}
                        items={items}
                        setValue={setModalDefaultUnit}
                        value={modalDefaultUnit}
                        placeholder="Мера"
                        containerStyle={{ height: 40, marginBottom: 40, width: 250}}
                        style={{ 
                          backgroundColor: '#fafafa',
                          zIndex: 20,
                         }} 
                        itemStyle={{ 
                            justifyContent: 'flex-start', 
                        }}
                        dropDownStyle={{ backgroundColor: '#fff' }}
                        onSelectItem={(item) => {
                          setUnit(item.value)}}
                        onChangeItem={(item) => 
                            {
                            setUnit(item.value)}
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
      width: 63,
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
      paddingHorizontal: 5,
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
      fontSize: 10,
      width: 50,
      marginLeft: 30,
    },
    allergenTextUnit: {
      marginRight: 45,
      fontSize: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginLeft: 10,
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
      marginTop: 250,
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
    modalCount: {
      flexDirection: 'row',
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