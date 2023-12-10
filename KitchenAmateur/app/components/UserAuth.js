import {StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, ImageBackground} from 'react-native';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  background-image: url(7.png);
`;

const Heading = styled.Text`
  text-align: center;
  font-size: 50px;
  margin-bottom: 20px;
`;

const Form = styled.View`
  width: 80%;
  align-items: center;
`;

const Input = styled.TextInput`
  width: 456px;
  height: 86px;
  border-radius: 20px;
  border-width: 7px;
  border-color: #fba806;
  margin-bottom: 50px;
  font-size: 45px;
  padding-left: 10px;
`;
const PostImage = styled.Image`
    width: 100px;
    height: 100px;
`
const Buttons = styled(TouchableOpacity)`
  width: 500px;
  height: 64px;
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
  margin-left: 64px;
  border-radius: 10px;
  outline: none;
  transition: background-color 300ms, text-shadow 300ms;
  margin-bottom: 40px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const AuthorizationText = styled.Text`
  text-align: center;
`;

const Links = styled.Text`
  color: #007bff;
`;

export const UserAuth = ({login,setLogin,currentName,setCurrentName,surname,setSurname,email,setEmail,password,setPassword,registerUser}) => {
    return (
    <Container>
      <ImageBackground source={require('../assets/pics/7.png')} />
      <Heading>Регистрация</Heading>
      <Form>
        <Input
          placeholder="Логин"
          value={login}
          onChangeText={setLogin}
          required
        />
        <Input
          placeholder="Имя"
          value={currentName}
          onChangeText={setCurrentName}
          required
        />
        <Input
          placeholder="Фамилию"
          value={surname}
          onChangeText={setSurname}
          required
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          required
        />
        <Input
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
        <AuthorizationText>
          <Text>Авторизоваться </Text>
          <Links onPress={() => console.log('Navigate to authorization')}>
            www.autorization.ru
          </Links>
        </AuthorizationText>
      </Form>
    </Container>
    )
}