import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import style from "../public/style.css";

export const UserRegister = ({
  login,
  setLogin,
  currentName,
  setCurrentName,
  surname,
  setSurname,
  email,
  setEmail,
  password,
  setPassword,
  registerUser,
  nav,
}) => {
  return (
    <View style={style.body}>
      <ImageBackground source={require("../assets/pics/7.png")}>
        <Text style={[style.h2, style.reg, style.shadow]}>Регистрация</Text>
        <TextInput
          style={style.inputReg}
          placeholder="Логин"
          value={login}
          onChangeText={setLogin}
          required
        />
        <TextInput
          style={style.inputReg}
          placeholder="Имя"
          value={currentName}
          onChangeText={setCurrentName}
          required
        />
        <TextInput
          style={style.inputReg}
          placeholder="Фамилия"
          value={surname}
          onChangeText={setSurname}
          required
        />
        <TextInput
          style={style.inputReg}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          required
        />
        <TextInput
          style={style.inputReg}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          required
          last
        />
        <Buttons onPress={registerUser}>
          <ButtonText>Зарегистрироваться</ButtonText>
        </Buttons>
        <Text
          style={style.toRegistr}
          onPress={nav}
        >
          Авторизироваться
        </Text>
      </ImageBackground>
    </View>
  );
};