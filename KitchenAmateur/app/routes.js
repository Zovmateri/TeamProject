import React from 'react';
import {router, useRouter} from 'expo-router'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './views/Main';
import LoginScreen from './views/Login';
import RegisterScreen from './views/Register';
import HomeScreen from './views/Home';

const Stack = createNativeStackNavigator();

const commonScreenOptions = {
    headerStyle: {backgroundColor: 'white'},
    headerTitleAlign: 'center',
    gestureEnabled: true,
    //headerShown: false,
  };
export const AppNavigator = () => (
        <Stack.Navigator initialRouteName='Home' screenOptions={commonScreenOptions}>
            <Stack.Screen 
                name='Main' 
                component={MainScreen}
            />
            <Stack.Screen 
                name='Login' 
                component={LoginScreen} 
            />
            <Stack.Screen 
                name='Register' 
                component={RegisterScreen} 
            />
            <Stack.Screen 
                name='Home' component={HomeScreen} 
                //options={{ headerShown: false }}
            />
        </Stack.Navigator>
)
