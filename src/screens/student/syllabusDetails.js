import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SyllabusDetailsScreen = ({navigation, route}) => {
  const {syllabusUrl} = route.params;

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Syllabus Details</Text>
      </View>

      <View style={styles.content}>
        {syllabusUrl ? (
          <Image source={{uri: syllabusUrl}} style={styles.syllabusImage} />
        ) : (
          <Text style={styles.noSyllabusText}>No syllabus uploaded</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#104E8B',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  syllabusImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  noSyllabusText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default SyllabusDetailsScreen;
