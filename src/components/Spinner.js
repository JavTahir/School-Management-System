import {ActivityIndicator, StyleSheet, View} from 'react-native';

function Spinner() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#104E8B" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Add a semi-transparent background
  },
});

export default Spinner;
