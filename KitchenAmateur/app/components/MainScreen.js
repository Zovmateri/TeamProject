import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import style from "../public/style.css";

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchBar}>
//         <TextInput
//           placeholder="Поиск"
//           value={searchTerm}
//           onChangeText={(text) => setSearchTerm(text)}
//         />
//       </View>
//       <TouchableOpacity
//         style={styles.menuButton}
//         onPress={() => {
//           // Открыть навигационное меню
//         }}
//       >
//         <Image source={require("./assets/menu.png")} style={styles.menuImage} />
//       </TouchableOpacity>
//       <ScrollView style={styles.scrollView}>
//         <View style={styles.wrapMenu}>{/* Здесь будут фотографии */}</View>
//       </ScrollView>
//     </View>
//   );
// };
