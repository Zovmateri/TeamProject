import React from 'react';
import {router, useRouter} from 'expo-router'
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './views/Main';
import LoginScreen from './views/Login';
import RegisterScreen from './views/Register';
import HomeScreen from './views/Home';
import SettingsScreen from './views/Settings'
import AllergensScreen from './views/Allergens'
import IngredientScreen from './views/Ingredients'
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { getLogin } from './Storage';


const Tab = createBottomTabNavigator();


export const MyTabs = () => {
    
    const login = getLogin();
    if (login === null || login === undefined) {
        return (
            <Tab.Navigator 
                initialRouteName='Main' 
                screenOptions={commonScreenOptions} 
                tabBar={props => <BottomTabBar {...props} state={{...props.state, routes: props.state.routes.slice(0,3)}}></BottomTabBar>}
                >
                <Tab.Screen 
                    name='Main' 
                    component={MainScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name="search-outline" size={34} color={focused ? "#00bb03" : "#FBA806"} />
                        ),
                      }}
                />
                <Tab.Screen
                    name={'Login'}
                    component={LoginScreen}
                    options={{ 
                        tabBarIcon: ({color,focused}) => (
                            <Image
                                source={
                                    focused ? 
                                    require('./assets/pics/navIcons/AccountGreen.png') : 
                                    require('./assets/pics/navIcons/AccountOrange.png')
                                }
                                style={{ width: 34, height: 34}}
                          />
                        ),
                    }}
                />
                <Tab.Screen  
                    name='Register' 
                    component={RegisterScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                          <Image
                            source={
                                focused ? 
                                require('./assets/pics/navIcons/RegistrGreen.png') : 
                                require('./assets/pics/navIcons/RegistrOrange.png')
                            }
                            style={{ width: 45, height: 45}}
                          />
                        ),
                        
                      }}
                />
            </Tab.Navigator>
        )
    } else {
        return (
            <Tab.Navigator initialRouteName='Main' screenOptions={commonScreenOptions} 
            tabBar={props => <BottomTabBar {...props} state={{...props.state, routes: props.state.routes.slice(0,4)}}></BottomTabBar>} >
                <Tab.Screen 
                    name='Main' 
                    component={MainScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name="search-outline" size={34} color={focused ? "#00bb03" : "#FBA806"} />
                        ),
                      }}
                />
                <Tab.Screen  
                    name='Allergens' 
                    component={AllergensScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                          <Image
                            source={
                                focused ? 
                                require('./assets/pics/navIcons/allergenGreen.png') : 
                                require('./assets/pics/navIcons/allergenOrange.png')
                            }
                            style={{ width: 34, height: 34}}
                          />
                        ),
                        
                      }}
                />
                <Tab.Screen 
                    name='Ingredient' 
                    component={IngredientScreen} 
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                          <Image
                            source={
                                focused ? 
                                require('./assets/pics/navIcons/foodGreen.png') : 
                                require('./assets/pics/navIcons/foodOrange.png')
                            }
                            style={{ width: 34, height: 34}}
                          />
                        ),
                      }} 
                />
                
                <Tab.Screen
                    name={'Settings'} // Dynamically determines name based on login status
                    component={SettingsScreen} // Dynamically renders component based on login status
                    options={{ 
                        tabBarIcon: ({color,focused}) => (
                            <Image
                                source={
                                    focused ? 
                                    require('./assets/pics/navIcons/AccountGreen.png') : 
                                    require('./assets/pics/navIcons/AccountOrange.png')
                                }
                                style={{ width: 34, height: 34}}
                          />
                        ),
                    }}
                />
                <Tab.Screen
                    name={'Login'} // Dynamically determines name based on login status
                    component={LoginScreen} // Dynamically renders component based on login status
                    options={{ 
                        tabBarIcon: ({color,focused}) => (
                            <Image
                                source={
                                    focused ? 
                                    require('./assets/pics/navIcons/AccountGreen.png') : 
                                    require('./assets/pics/navIcons/AccountOrange.png')
                                }
                                style={{ width: 34, height: 34}}
                          />
                        ),
                    }}
                />
                <Tab.Screen  
                    name='Register' 
                    component={RegisterScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                          <Image
                            source={
                                focused ? 
                                require('./assets/pics/navIcons/allergenGreen.png') : 
                                require('./assets/pics/navIcons/allergenOrange.png')
                            }
                            style={{ width: 45, height: 45}}
                          />
                        ),
                        
                      }}
                />
            </Tab.Navigator>
        )
    }
    
}

const commonScreenOptions = {
    headerStyle: {backgroundColor: 'white'},
    headerTitleAlign: 'center',
    gestureEnabled: true,
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: false,
    tabBarStyle: { height: 80 },
  };
