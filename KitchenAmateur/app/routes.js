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
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { getLogin } from './Storage';


const Tab = createBottomTabNavigator();

export const MyTabs = () => {
    
    const login = getLogin();

    if (login === null || login === undefined) {
        return (
            <Tab.Navigator initialRouteName='Main' screenOptions={commonScreenOptions} >
                <Tab.Screen 
                    name='Main' 
                    component={MainScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name="search-outline" size={34} color={focused ? "#FBA806" : "#00bb03"} />
                            //<FontAwesome name="search" size={34} color={focused ? "#FBA806" : "#00bb03"} />
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
                                    require('./assets/pics/navIcons/AccountOrange.png') : 
                                    require('./assets/pics/navIcons/AccountGreen.png')
                                }
                                style={{ width: 34, height: 34}}
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
                            <Ionicons name="search-outline" size={34} color={focused ? "#FBA806" : "#00bb03"} />
                            //<FontAwesome name="search" size={34} color={focused ? "#FBA806" : "#00bb03"} />
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
                                require('./assets/pics/navIcons/allergenOrange.png') : 
                                require('./assets/pics/navIcons/allergenGreen.png')
                            }
                            style={{ width: 34, height: 34}}
                          />
                        ),
                        
                      }}
                />
                <Tab.Screen 
                    name='Home' 
                    component={HomeScreen} 
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                          <Image
                            source={
                                focused ? 
                                require('./assets/pics/navIcons/foodOrange.png') : 
                                require('./assets/pics/navIcons/foodGreen.png')
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
                                    require('./assets/pics/navIcons/AccountOrange.png') : 
                                    require('./assets/pics/navIcons/AccountGreen.png')
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
                                    require('./assets/pics/navIcons/AccountOrange.png') : 
                                    require('./assets/pics/navIcons/AccountGreen.png')
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
                                require('./assets/pics/navIcons/allergenOrange.png') : 
                                require('./assets/pics/navIcons/allergenGreen.png')
                            }
                            style={{ width: 34, height: 34}}
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
