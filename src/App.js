import {View, StyleSheet} from 'react-native';
import RouteNavigation from './navigation/RouteNavigator';
import database from '@react-native-firebase/database';
import {AuthProvider} from './context/authContext';

const App = () => {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <RouteNavigation />
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
