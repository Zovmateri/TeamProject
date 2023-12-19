import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  checkboxButton,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Checkbox from "expo-checkbox";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import style from "../public/style.css";

export const UserAuth = ({
  login,
  setLogin,
  password,
  setPassword,
  authUser,
  Checked,
  setChecked,
  nav,
}) => {
  return (
    <View style={style.body}>
      <ImageBackground source={require('../assets/pics/7.png')}>
      <Text style={[style.h2, style.auth, style.shadow]}>Авторизация</Text>
      <View>
        <TextInput
          style={style.inputAuth}
          placeholder="Логин"
          value={login}
          onChangeText={setLogin}
          required
        />
        <TextInput
          style={style.inputAuth}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          required
          last
        />
          <View style={style.checkboxContainer}>
            <Text style={style.isrememtxt}>Запомнить пароль</Text>
            <Checkbox
              style={style.isremember}
              value={Checked}
              onValueChange={(Checked) => setChecked(Checked)}
              color={Checked ? "#FBA806" : undefined}
            />
          </View>
        <Text onPress={authUser} style={style.enter}>
          Войти
        </Text>
        <Text
          style={style.toRegistr}
          onPress={nav}
        >
          Перейти на форму регистрации
        </Text>
      </View>
      </ImageBackground>
    </View>
  );
};
