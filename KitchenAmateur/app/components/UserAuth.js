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
}) => {
  return (
    <View style={style.body}>
      <Text style={style.h2}>Авторизация</Text>
      <View>
        <TextInput
          style={style.input}
          placeholder="Логин"
          value={login}
          onChangeText={setLogin} //Зачем?
          required
        />
        <TextInput
          style={style.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword} //Зачем?
          required
          last
        />
        <View style={style.container}>
          <View style={style.checkboxContainer}>
            <Text style={style.isrememtxt}>Запомнить пароль</Text>
            <Checkbox
              style={style.isremember}
              value={Checked}
              onValueChange={(Checked) => setChecked(Checked)}
              color={Checked ? "#FBA806" : undefined}
            />
          </View>
        </View>
        <Text onPress={authUser} style={style.enter}>
          Войти
        </Text>
        <Text
          style={style.toRegistr}
          onPress={() => console.log("Navigate to registration")}
        >
          Перейти на форму регистрации
        </Text>
      </View>
    </View>
  );
};
