import axios from 'axios';
import React from 'react';
import {StatusBar, View, Alert, Image, Text } from 'react-native';
import { Post } from './components/Post';

export default function App() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    axios
      .get('https://6570dde709586eff66420ddb.mockapi.io/articles')
      .then(({data}) => {
        setItems(data);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Ошибка', 'Не удалось получить статии!')
      })
  }, []);

  return (
    <View>
      {items.map((obj) => (
        <Post 
          title={obj.title}
          imageUrl={obj.imageUrl} 
          createdAt={obj.createdAt} 
        />
      ))}
      <StatusBar theme='auto' />
    </View>
  );
}