import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import BottomNav from '../../components/BottomNav';
import firestore from '@react-native-firebase/firestore';
import TermSelectorModal from '../../components/TermsSelectorModal';
import {AuthContext} from '../../context/authContext';

const MarksScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {uid} = user;

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [totalPassedStudents, setTotalPassedStudents] = useState(0);
  const [totalFailedStudents, setTotalFailedStudents] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('First');
  const [teacherClass, setTeacherClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherDoc = await firestore()
          .collection('Teachers')
          .doc(uid)
          .get();
        if (teacherDoc.exists) {
          setTeacherClass(teacherDoc.data().assignedClass);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, [uid]);

  useEffect(() => {
    if (!teacherClass) return;

    const unsubscribe = firestore()
      .collection('students')
      .where('admissionClass', '==', teacherClass)
      .onSnapshot(async querySnapshot => {
        const studentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          marks: {},
        }));

        const fetchMarks = async student => {
          const terms = ['First', 'Mid', 'Final'];
          const marks = {};

          for (const term of terms) {
            const termMarksDoc = await firestore()
              .collection('students')
              .doc(student.id)
              .collection('marks')
              .doc(term)
              .get();

            if (termMarksDoc.exists) {
              marks[term] = termMarksDoc.data();
            } else {
              marks[term] = {}; // Initialize with an empty object if no marks document exists for this term
            }
          }

          student.marks = marks;
          console.log(student.marks);
        };

        const promises = studentsData.map(fetchMarks);
        await Promise.all(promises);

        // Collect all subjects from all terms
        const allSubjects = new Set();
        studentsData.forEach(student => {
          ['First', 'Mid', 'Final'].forEach(term => {
            Object.keys(student.marks[term]).forEach(subject => {
              allSubjects.add(subject);
            });
          });
        });

        setSubjects(Array.from(allSubjects));
        setStudents(studentsData);
        updateFilteredStudents(
          studentsData,
          selectedTerm,
          Array.from(allSubjects),
        );
        setIsLoading(false); // Set loading to false after data is fetched
      });

    return () => unsubscribe();
  }, [teacherClass]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectTerm = term => {
    setSelectedTerm(term);
    updateFilteredStudents(students, term, subjects);
    toggleModal();
  };

  const updateFilteredStudents = (students, term, subjects) => {
    const termKey = term;

    const updatedStudents = students.map(student => {
      const termMarks = student.marks[termKey] || {};
      const totalMarks = subjects.reduce(
        (acc, subject) => acc + (termMarks[subject]?.marks || 0),
        0,
      );
      const totalPossibleMarks = subjects.reduce(
        (acc, subject) => acc + (termMarks[subject]?.totalMarks || 0),
        0,
      );
      const percentage = ((totalMarks / totalPossibleMarks) * 100).toFixed(0);
      const status = percentage >= 50 ? 'Passed' : 'Failed';
      return {
        ...student,
        termMarks,
        percentage,
        status,
      };
    });

    const passedCount = updatedStudents.filter(
      student => student.status === 'Passed',
    ).length;
    const failedCount = updatedStudents.length - passedCount;
    const avgPercentage =
      updatedStudents.reduce(
        (acc, student) => acc + parseFloat(student.percentage),
        0,
      ) / updatedStudents.length;

    setFilteredStudents(updatedStudents);
    setTotalPassedStudents(passedCount);
    setTotalFailedStudents(failedCount);
    setTotalPercentage(avgPercentage.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mark Sheet</Text>
        <TouchableOpacity
          onPress={() => {
            /* Generate PDF functionality */
          }}></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.termText}>
          {selectedTerm ? selectedTerm : 'Select Term'}
        </Text>
      </TouchableOpacity>

      <TermSelectorModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        onSelectTerm={selectTerm}
      />

      <Text style={styles.text}>Analytics Overview</Text>

      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#104E8B" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.statisticsContainer}>
            <LinearGradient
              colors={['#1a3c5e', '#104E8B']}
              style={styles.statBox}>
              <Text style={styles.statNumber}>{totalPassedStudents}</Text>
              <Text style={styles.statLabel}>Passed</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#BDC3C7', '#2C3E50']}
              style={styles.statBox}>
              <Text style={styles.statNumber}>{totalFailedStudents}</Text>
              <Text style={styles.statLabel}>Failed</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#070606', '#104E8B']}
              style={styles.statBox}>
              <Text style={styles.statNumber}>{totalPercentage}%</Text>
              <Text style={styles.statLabel}>Average Percentage</Text>
            </LinearGradient>
          </View>

          <Text style={styles.text}>Students Details</Text>
          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.regNo]}>R.No</Text>
                <Text style={styles.tableHeader}>Name</Text>
                {subjects.map((subject, index) => (
                  <Text key={index} style={styles.tableHeader}>
                    {subject}
                  </Text>
                ))}
                <Text style={styles.tableHeader}>Percentage</Text>
                <Text style={styles.tableHeader}>Status</Text>
              </View>

              {filteredStudents.map((student, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.regNo]}>
                    {student.id}
                  </Text>
                  <Text style={styles.tableCell}>{student.name}</Text>
                  {subjects.map((subject, index) => (
                    <Text key={index} style={styles.tableCell}>
                      {student.termMarks[subject]?.marks !== undefined
                        ? student.termMarks[subject].marks
                        : 0}
                    </Text>
                  ))}
                  <Text style={styles.tableCell}>{student.percentage}%</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      student.status === 'Passed'
                        ? styles.passed
                        : styles.failed,
                    ]}>
                    {student.status}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  termText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'right',
    marginRight: 10,
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
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
    marginLeft: 'auto',
    marginRight: 0,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  tableContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontWeight: 'bold',
    paddingHorizontal: 5,
    flex: 1,
    textAlign: 'center',
    width: 100, // Adjust width as needed for fixed-width columns
    flexWrap: 'wrap', // Allow text wrapping
  },
  tableCell: {
    paddingHorizontal: 5,
    flex: 1,
    textAlign: 'center',
    width: 100, // Adjust width as needed for fixed-width columns
    flexWrap: 'wrap', // Allow text wrapping
  },
  regNo: {
    width: 50, // Adjust width as needed for registration number column
  },
  passed: {
    color: 'green',
  },
  failed: {
    color: 'red',
  },
});

export default MarksScreen;
