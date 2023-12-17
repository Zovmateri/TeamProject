import {StyleSheet, View, Text, TextInput, checkboxButton, Image, TouchableOpacity, ImageBackground} from 'react-native';
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
        <View>
          <TextInput style={style.input}
            placeholder="Логин"
            value={login}
            onChangeText={setLogin} //Зачем?
            required
          />
          <TextInput style={style.input}
            placeholder="Пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword} //Зачем?
            required
            last
          />
          <TextInput style={style.isremember}
            value={isChecked}
            onValueChange={setChecked}    
            color={isChecked ? '#4630EB' : undefined}
          />
          <Text onPress={authUser} style={style.enter}>
            <Text textAslign ="center">Войти</Text>
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
