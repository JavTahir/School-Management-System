import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';

const SubjectModal = ({visible, onClose, onAddMarks, onUpdateMarks}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Choose an action</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onAddMarks}>
            <Text style={styles.modalButtonText}>Add/Update Marks</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.modalButton} onPress={onUpdateMarks}>
            <Text style={styles.modalButtonText}>Update Marks</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#104E8B',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#104E8B',
    fontSize: 16,
  },
});

export default SubjectModal;
