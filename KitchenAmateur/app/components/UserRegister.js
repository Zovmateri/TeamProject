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
import styled from "styled-components";
import style from "../public/style.css";

const Heading = styled.Text`
  text-align: center;
  font-size: 50px;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 250px;
  height: 30px;
  border-radius: 10px;
  border-width: 3px;
  border-color: #fba806;
  margin-bottom: 40px;
  font-size: 20px;
  padding-left: 15px;
`;
const Buttons = styled(TouchableOpacity)`
  
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
  margin-top: 32px;
  margin-left: 110px;
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

const AuthorizationText = styled.Text`
  text-align: center;
`;

const Links = styled.Text`
  color: #007bff;
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