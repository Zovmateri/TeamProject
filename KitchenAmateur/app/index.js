// import React from "react";
// import { router } from 'expo-router';
// import {Pressable, Text,View} from 'react-native';

// export default function App() {
//     return (
//         <View>
//             <Text>Home Screen</Text>
//             <Pressable onPress={() => router.push('./views/Register')}>
//                 <Text>Go to Register</Text>
//             </Pressable>
//             <Pressable onPress={() => router.push('./views/Login')}>
//                 <Text>Go to Login</Text>
//             </Pressable>
//         </View>
//     )
// }

import React from 'react';
import {View, Text, Pressable} from 'react-native';
import { router } from "expo-router";
import { navigateToLogin, navigateToRegister } from "./routes";

export default function App() {
    
    return (
        <View>
             <Text>Home Screen</Text>
             <Pressable onPress={navigateToRegister}>
                 <Text>Go to Register</Text>
             </Pressable>
             <Pressable onPress={navigateToLogin}>
                 <Text>Go to Login</Text>
             </Pressable>
         </View>
    )
}