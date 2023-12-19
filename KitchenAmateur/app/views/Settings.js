import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import * as bcrypt from 'react-native-bcrypt';
import { UserAuth } from '../components/UserAuth';
import {OpenDatabase} from '../dbConfig'
import { setLoginState } from '../Storage';


export default function App({navigation}) {
}