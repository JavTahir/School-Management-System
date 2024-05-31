import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDatePicker = ({placeholder, date, setDate}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formatDate = date => {
    // Function to format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.dateInput}
        placeholder={placeholder}
        value={date ? formatDate(new Date(date)) : ''}
        editable={false} // Make the TextInput non-editable
      />
      <TouchableOpacity
        style={styles.calendarIcon}
        onPress={() => setDatePickerVisibility(true)}>
        <MaterialCommunityIcons name="calendar" size={24} color="#007bff" />
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DatePicker
          modal
          open={isDatePickerVisible}
          date={date ? new Date(date) : new Date()}
          mode="date"
          onConfirm={date => {
            setDatePickerVisibility(false);
            setDate(formatDate(date));
          }}
          onCancel={() => {
            setDatePickerVisibility(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
    width: 363,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  calendarIcon: {
    position: 'absolute',
    top: '50%',
    right: 10,

    transform: [{translateY: -12}], // Adjust vertical position to center
  },
});

export default CustomDatePicker;
