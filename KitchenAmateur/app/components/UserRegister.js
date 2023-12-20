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
import styled from "styled-components";

const Buttons = styled.TouchableOpacity`
  
  width: 190px;
  height: 38px;
  text-transform: uppercase;
  font-size: 40px;
  color: #fba806;
  background-color: transparent;
  padding: 8px;
  border-width: 3px;
  border-color: #fba806;
  text-shadow: 0 0 0.5em #fba806;
  box-shadow: 0 0 0.5em #fba806;
  margin: auto;
  border-radius: 10px;
  outline: none;
  transition: background-color 300ms, text-shadow 300ms;
  margin-bottom: 40px;
`;

const ButtonText = styled.Text`
  color: green;
  font-weight: bold;
  text-align: center;
`;


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