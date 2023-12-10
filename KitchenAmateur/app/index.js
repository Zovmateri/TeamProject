import React from "react";
import { router } from 'expo-router';
import {Pressable, Text,View} from 'react-native';

export default function App() {
    return (
        <View>
        <Text>Home Screen</Text>
        <Pressable onPress={() => router.push('./views/Register')}>
            <Text>Go to Register</Text>
        </Pressable>
        <Pressable onPress={() => router.push('./views/Login')}>
            <Text>Go to Login</Text>
        </Pressable>
        </View>
    )
}
