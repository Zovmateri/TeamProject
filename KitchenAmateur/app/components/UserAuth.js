import {StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, ImageBackground} from 'react-native';
import styled from 'styled-components';
import {Checkbox} from 'expo-checkbox';
import {widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Container = styled.View`
  background-color: #fff;
  justify-content: center;
  height: ${hp('100%')};
`;

const Heading = styled.Text`
  text-align: center;
  font-size: 50px;
  margin-bottom: 20px;

`;

const Form = styled.View`
  width: ${hp('100%')};
  align-items: center;
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
  margin-left: 5px;
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
const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  }
})
export const UserAuth = ({login,setLogin,password,setPassword,authUser,isChecked,setChecked}) => {
    return (
    <Container>
      <ImageBackground source={require('../assets/pics/7.png')} resizeMode=''>
      <Heading>Авторизация</Heading>
      <Form>
        <Input
          placeholder="Логин"
          value={login}
          onChangeText={setLogin}
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
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        <Buttons onPress={authUser}>
          <ButtonText>Войти</ButtonText>
        </Buttons>
        <AuthorizationText>
          <Text>До сих пор нет аккаунта? Зарегистрируйся здесь</Text>
          <Links onPress={() => console.log('Navigate to registration')}>
            www.registration.ru
          </Links>
        </AuthorizationText>
      </Form>
      </ImageBackground>
      
    </Container>
    )
}
