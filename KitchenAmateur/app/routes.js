import React from 'react';
import {router, useRouter} from 'expo-router'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './views/Main';
import LoginScreen from './views/Login';
import RegisterScreen from './views/Register';
import HomeScreen from './views/Home';
import SettingsScreen from './views/Settings'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { getLogin } from './Storage';


const Tab = createBottomTabNavigator();

export const MyTabs = () => {
    
    return (
        <Tab.Navigator initialRouteName='Main' screenOptions={commonScreenOptions} 
        tabBar={props => <BottomTabBar {...props} state={{...props.state, routes: props.state.routes.slice(0,4)}}></BottomTabBar>} >
            <Tab.Screen 
                name='Main' 
                component={MainScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome name="search" size={34} color={focused ? "#FBA806" : "#00bb03"} />
                    ),
                  }}
            />
            <Tab.Screen  
                name='Register' 
                component={RegisterScreen} 
            />
            <Tab.Screen 
                name='Home' 
                component={HomeScreen} 
            />
            
            <Tab.Screen
                name='Login' 
                component={LoginScreen} 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({color,focused}) => (
                        <MaterialCommunityIcons name="account" size={34} color={focused ? "#FBA806" : "#00bb03"} />
                    ),
                }}
            />

            <Tab.Screen 
                name='Settings' 
                component={SettingsScreen}
                
            />
        </Tab.Navigator>
    )
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
