import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

const TermSelectorModal = ({isVisible, onClose, onSelectTerm}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => onSelectTerm('First')}>
              <Text style={styles.modalOption}>First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelectTerm('Mid')}>
              <Text style={styles.modalOption}>Mid</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelectTerm('Final')}>
              <Text style={styles.modalOption}>Final</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    paddingHorizontal: 90,
    borderRadius: 10,
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'center',
  },
});

export default TermSelectorModal;
