// components/DropdownMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DropdownMenu = ({
  visible,
  selectedTerm,
  onToggle,
  onSelect,
  terms = ['First', 'Mid', 'Final'],
}) => {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Text style={styles.dropdownButtonText}>{selectedTerm} Term</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="blue" />
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdownMenu}>
          {terms.map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.dropdownItem}
              onPress={() => onSelect(term)}
            >
              <Text style={styles.dropdownItemText}>{term} Term</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownButtonText: {
    color: 'blue',
    fontSize: 16,
    marginRight: 5,
    marginLeft: 'auto',
  },
  dropdownMenu: {
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    position: 'absolute',
    right: 0,
    zIndex: 10, // Ensuring it appears above other elements
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default DropdownMenu;
