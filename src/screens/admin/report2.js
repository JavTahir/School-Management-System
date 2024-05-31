import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/BottomNav';
import firestore from '@react-native-firebase/firestore';
import FilterModal from '../../components/ClassFilterModal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Spinner from '../../components/Spinner';

const Report2 = ({navigation}) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [totalPassedStudents, setTotalPassedStudents] = useState(0);
  const [totalFailedStudents, setTotalFailedStudents] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);

    const unsubscribe = firestore()
      .collection('students')
      .where('admissionClass', '==', selectedClass)
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

        // // Collect all subjects from all terms
        // const allSubjects = new Set();
        // studentsData.forEach(student => {
        //   ['First', 'Mid', 'Final'].forEach(term => {
        //     Object.keys(student.marks[term]).forEach(subject => {
        //       allSubjects.add(subject);
        //     });
        //   });
        // });

        // setSubjects(Array.from(allSubjects));
        setStudents(studentsData);
        updateFilteredStudents(studentsData);
        setLoading(false); // Set loading to false after data is fetched
      });

    return () => unsubscribe();
  }, [selectedClass]);

  const updateFilteredStudents = students => {
    const updatedStudents = students.map(student => {
      const totalFirstMarks = Object.values(student.marks.First || {}).reduce(
        (sum, {marks}) => sum + Number(marks || 0),
        0,
      );
      const totalMidMarks = Object.values(student.marks.Mid || {}).reduce(
        (sum, {marks}) => sum + Number(marks || 0),
        0,
      );
      const totalFinalMarks = Object.values(student.marks.Final || {}).reduce(
        (sum, {marks}) => sum + Number(marks || 0),
        0,
      );

      const totalFinalPossibleMarks = Object.values(
        student.marks.Final || {},
      ).reduce((sum, {totalMarks}) => sum + (totalMarks || 0), 0);

      const percentage = (
        (totalFinalMarks / totalFinalPossibleMarks) *
        100
      ).toFixed(0);
      const status = percentage >= 50 ? 'Passed' : 'Failed';

      return {
        ...student,
        totalFirstMarks,
        totalMidMarks,
        totalFinalMarks,
        totalFinalPossibleMarks,
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

  const handleClassChange = newClass => {
    setSelectedClass(newClass);
    setShowFilterModal(false);
  };
  const generatePDF = async () => {
    try {
      // Generate HTML content for the table
      let htmlContent = '<table border="1">';
      htmlContent += '<thead>';
      htmlContent += '<tr>';
      htmlContent += '<th>R.No</th>';
      htmlContent += '<th>Name</th>';
      htmlContent += '<th>Class</th>'; // New class header
      htmlContent += '<th>First Term</th>';
      htmlContent += '<th>Mid Term</th>';
      htmlContent += '<th>Final Term</th>';
      htmlContent += '<th>Percentage</th>';
      htmlContent += '</tr>';
      htmlContent += '</thead>';
      htmlContent += '<tbody>';
      filteredStudents.forEach(student => {
        htmlContent += '<tr>';
        htmlContent += `<td>${student.registrationNumber}</td>`;
        htmlContent += `<td>${student.name}</td>`;
        htmlContent += `<td>${student.admissionClass}</td>`; // New class data
        htmlContent += `<td>${student.totalFirstMarks}</td>`;
        htmlContent += `<td>${student.totalMidMarks}</td>`;
        htmlContent += `<td>${student.totalFinalMarks}</td>`;
        htmlContent += `<td>${student.percentage}%</td>`;
        htmlContent += '</tr>';
      });
      htmlContent += '</tbody>';
      htmlContent += '</table>';

      // Define options for PDF generation
      const options = {
        html: htmlContent,
        fileName: 'report2',
        directory: 'Documents',
      };
      // Generate PDF
      const file = await RNHTMLtoPDF.convert(options);
      await Share.open({url: `file://${file.filePath}`});

      console.log('PDF generated:', file.filePath);
    } catch (error) {
      // console.error('Error generating PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />

      {loading && <Spinner />}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mark Sheet</Text>
        <TouchableOpacity onPress={generatePDF}>
          <MaterialIcons name="file-download" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.filterByContainer}
          onPress={() => setShowFilterModal(true)}>
          <Text>Filter by: {selectedClass || 'Select option'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Analytics Overview</Text>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onSelect={handleClassChange}
      />

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
              <Text style={styles.tableHeader}>Class</Text>
              <Text style={styles.tableHeader}>First Term</Text>
              <Text style={styles.tableHeader}>Mid Term</Text>
              <Text style={styles.tableHeader}>Final Term</Text>
              <Text style={styles.tableHeader}>Percentage</Text>
              <Text style={styles.tableHeader}>Status</Text>
            </View>

            {filteredStudents.map((student, index) => {
              console.log('student', student);
              const {
                totalFirstMarks,
                totalMidMarks,
                totalFinalMarks,
                percentage,
                status,
              } = student;
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.regNo]}>
                    {student.id}
                  </Text>
                  <Text style={styles.tableCell}>{student.name}</Text>
                  <Text style={styles.tableCell}>{student.admissionClass}</Text>
                  {/* New class data */}
                  <Text style={styles.tableCell}>{totalFirstMarks}</Text>
                  <Text style={styles.tableCell}>{totalMidMarks}</Text>
                  <Text style={styles.tableCell}>{totalFinalMarks}</Text>
                  <Text style={styles.tableCell}>{percentage}%</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      status === 'Passed' ? styles.passed : styles.failed,
                    ]}>
                    {status}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginTop: 20,
  },
  filterByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    position: 'relative',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 30,
    color: 'grey',
    marginBottom: 20,
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 100,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    width: 100,
    textAlign: 'center',
  },
  regNo: {
    width: 50,
    textAlign: 'left',
  },
  passed: {
    color: 'green',
    fontWeight: 'bold',
  },
  failed: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Report2;
