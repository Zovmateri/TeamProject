// HomeScreen.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import style from "../public/style.css";

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Pressable style={style.borderForMain} onPress={() => navigation.navigate('Register')}>
        <Text>Go to Register</Text>
      </Pressable>
      <Pressable style={style.borderForMain} onPress={() => navigation.navigate('Login')}>
        <Text>Go to Login</Text>
      </Pressable>
      <Pressable style={style.borderForMain} onPress={() => navigation.navigate('Main')}>
        <Text>Go to Main screen</Text>
      </Pressable>
    </View>
  );
};
 
export default HomeScreen;
