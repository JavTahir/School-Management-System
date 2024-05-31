import {View, StyleSheet} from 'react-native';
import RouteNavigation from './navigation/RouteNavigator';
import database from '@react-native-firebase/database';

const App = () => {
  return (
    <View style={styles.container}>
      <RouteNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
