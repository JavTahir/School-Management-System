import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RoleSelectionScreen = ({navigation}) => {
  const handleRoleSelection = role => {
    navigation.navigate('Login', {role});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a role</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleRoleSelection('admin')}>
          <MaterialCommunityIcons
            name="shield-account"
            size={50}
            color="#fff"
          />
          <Text style={styles.optionText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleRoleSelection('student')}>
          <MaterialCommunityIcons name="school" size={50} color="#fff" />
          <Text style={styles.optionText}>Student</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.singleRow}>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleRoleSelection('teacher')}>
          <MaterialCommunityIcons name="account" size={50} color="#fff" />
          <Text style={styles.optionText}>Teacher</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  singleRow: {
    alignItems: 'center',
  },
  optionContainer: {
    backgroundColor: '#6200ea',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  optionText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;
