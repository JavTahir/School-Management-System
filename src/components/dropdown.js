import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Dropdown = ({options, selectedValue, onValueChange, placeholder}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownButtonText}>
          {selectedValue ? selectedValue : placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#007bff" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    width: 363,
    marginBottom: 30,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Dropdown;
