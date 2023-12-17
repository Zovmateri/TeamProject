import React from 'react';
import {router, useRouter} from 'expo-router'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './views/Main';
import LoginScreen from './views/Login';
import RegisterScreen from './views/Register';
import HomeScreen from './views/Home';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
        <Stack.Navigator initialRouteName='Home' >
            <Stack.Screen 
                name='Main' 
                component={MainScreen}
                //options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name='Login' 
                component={LoginScreen} 
                //options={{ headerShown: false }}
            />
            <Stack.Screen 
                name='Register' 
                component={RegisterScreen} 
                //options={{ headerShown: false }}
            />
            <Stack.Screen 
                name='Home' component={HomeScreen} 
                //options={{ headerShown: false }}
            />
        </Stack.Navigator>
)
