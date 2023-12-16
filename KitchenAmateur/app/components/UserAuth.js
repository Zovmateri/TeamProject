import {StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, ImageBackground} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../public/style.css';

const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  }
})
export const UserAuth = ({login,setLogin,password,setPassword,authUser,isChecked,setChecked}) => {
    return (
      <View style={style.body}>
        <Text style={style.h2}>Авторизация</Text>
        <View style={style.div}>
          <TextInput style={style.input}
            placeholder="Логин"
            value={login}
            onChangeText={setLogin}
            required
          />
          <TextInput style={style.input}
            placeholder="Пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            required
            last
          />
          <TextInput style={style.isremember}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#4630EB' : undefined}
          />
          <Text onPress={authUser} style={style.enter}>
            <Text>Войти</Text>
          </Text>
          <Text>
            <Text>До сих пор нет аккаунта? Зарегистрируйся здесь</Text>
            <Text onPress={() => console.log('Navigate to registration')}>
              www.registration.ru
            </Text>
          </Text>
        </View>
    </View>
    )
}
