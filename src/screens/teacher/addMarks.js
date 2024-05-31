// AddMarksScreen.js

import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextInput as PaperTextInput} from 'react-native-paper';
import {AuthContext} from '../../context/authContext';
import firestore from '@react-native-firebase/firestore';
import TermSelectorModal from '../../components/TermsSelectorModal';

const AddMarksScreen = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const {uid} = user;
  const {subject} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [students, setStudents] = useState([]);
  const [teacherClass, setTeacherClass] = useState('');
  const [enteredMarks, setEnteredMarks] = useState({}); // Store entered marks for each student

  const fetchTeacherDataFromDatabase = async uid => {
    try {
      const teacherDoc = await firestore()
        .collection('Teachers')
        .doc(uid)
        .get();

      if (teacherDoc.exists) {
        return teacherDoc.data();
      } else {
        console.log('Teacher document not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherData = await fetchTeacherDataFromDatabase(uid);
        if (teacherData) {
          setTeacherClass(teacherData.assignedClass);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, [uid]);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const studentsSnapshot = await firestore()
          .collection('students')
          .where('admissionClass', '==', teacherClass)
          .get();

        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students data:', error);
      }
    };

    if (teacherClass) {
      fetchStudentsData();
    }
  }, [teacherClass]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectTerm = async term => {
    setSelectedTerm(term);
    toggleModal();

    if (term) {
      try {
        const studentMarks = {};
        let fetchedTotalMarks = '';
        for (const student of students) {
          const marksRef = firestore()
            .collection('students')
            .doc(student.id)
            .collection('marks')
            .doc(term);

          const marksDoc = await marksRef.get();
          if (marksDoc.exists && marksDoc.data()[subject]) {
            studentMarks[student.id] = marksDoc.data()[subject].marks;
            fetchedTotalMarks = marksDoc.data()[subject].totalMarks; // Assuming total marks are the same for all students for a subject in a term
          }
        }
        setEnteredMarks(studentMarks);
        setTotalMarks(fetchedTotalMarks);
      } catch (error) {
        console.error('Error fetching existing marks:', error);
      }
    }
  };

  const handleMarksChange = (text, studentId) => {
    setEnteredMarks(prevMarks => ({
      ...prevMarks,
      [studentId]: text,
    }));
  };

  const saveMarks = async () => {
    if (!selectedTerm || !totalMarks) {
      Alert.alert('Error', 'Please select a term and enter total marks.');
      return;
    }

    try {
      const batch = firestore().batch();
      for (const student of students) {
        const studentMarks = enteredMarks[student.id] || '';
        const marksRef = firestore()
          .collection('students')
          .doc(student.id)
          .collection('marks')
          .doc(selectedTerm);

        const marksDoc = await marksRef.get();
        const existingMarks = marksDoc.exists ? marksDoc.data() : {};

        batch.set(marksRef, {
          ...existingMarks,
          [subject]: {
            marks: studentMarks,
            totalMarks: totalMarks,
          },
        });
      }

      await batch.commit();
      Alert.alert('Success', 'Marks saved successfully.');
      setEnteredMarks({});
      setTotalMarks('');
    } catch (error) {
      console.error('Error saving marks:', error);
      Alert.alert('Error', 'An error occurred while saving marks.');
    }
  };

  return (
    <View>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Marks</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.filterRow}>
          <PaperTextInput
            style={styles.totalMarksInput}
            label="Total Marks"
            value={totalMarks}
            mode="outlined"
            onChangeText={text => setTotalMarks(text)}
          />
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.termText}>
              {selectedTerm ? selectedTerm : 'Select Term'}
            </Text>
          </TouchableOpacity>
        </View>
        <TermSelectorModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          onSelectTerm={selectTerm}
        />
        {students.map((student, index) => (
          <View key={index} style={styles.studentContainer}>
            <Image
              source={{uri: student.profilePicture}}
              style={styles.profilePic}
            />
            <Text style={styles.studentName}>{student.name}</Text>
            <View style={styles.marksContainer}>
              <TextInput
                style={styles.marksInput}
                keyboardType="numeric"
                onChangeText={text => handleMarksChange(text, student.id)}
                value={enteredMarks[student.id] || ''}
              />
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.saveButton} onPress={saveMarks}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  saveButton: {
    backgroundColor: '#104E8B',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#104E8B',
    paddingVertical: 15,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center', // Ensures the text is centered
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 'auto',
  },
  filterText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  totalMarksInput: {
    flex: 1,
    marginRight: 100,
    height: 40, // Adjust height here
    width: 20,
  },
  termText: {
    fontSize: 16,
    color: 'blue',
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marksInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    width: 60,
  },
  marksDisplay: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 60,
    backgroundColor: '#f0f0f0',
  },
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

export default AddMarksScreen;
