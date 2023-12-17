// HomeScreen.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text>Go to Register</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text>Go to Login</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Main')}>
        <Text>Go to Main screen</Text>
      </Pressable>
    </View>
  );
};
 
export default HomeScreen;
