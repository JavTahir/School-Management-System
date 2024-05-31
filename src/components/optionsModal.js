// ReportOptionsModal.js
import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ReportOptionsModal = ({visible, onClose, onSelectOption}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => onSelectOption('Students age record')}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="#38598b"
            />
            <Text style={styles.optionText}>Students age record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => onSelectOption('Marksheet')}>
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={24}
              color="#38598b"
            />
            <Text style={styles.optionText}>Marksheet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#38598b',
  },
});

export default ReportOptionsModal;
