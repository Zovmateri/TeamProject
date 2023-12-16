import {router, useRouter} from 'expo-router'


export const navigateToLogin = () => router.replace('./views/Login');
export const navigateToRegister = () => router.replace('./views/Register');
export const navigateToIndex = () => router.replace('./index');
export const goBack = () => router.back();