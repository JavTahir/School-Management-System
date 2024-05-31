import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import BottomNav from '../../components/BottomNav'; // Adjust the import path
import firestore from '@react-native-firebase/firestore'; // Import firestore
import FilterModal from '../../components/ClassFilterModal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const Report1 = ({navigation}) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [avgAgeBoys, setAvgAgeBoys] = useState(0);
  const [avgAgeGirls, setAvgAgeGirls] = useState(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentList = [];
        const snapshot = await firestore().collection('students').get();
        snapshot.forEach(doc => {
          const studentData = doc.data();
          // Calculate age from date of birth
          // const dobParts = studentData.dateOfBirth.split('/');
          // const dob = new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`);

          // // Calculate age from date of birth
          // const today = new Date();
          // let ageInYears = today.getFullYear() - dob.getFullYear();
          // let ageMonths = today.getMonth() - dob.getMonth();
          // let ageDays = today.getDate() - dob.getDate();

          // // Adjust age if birthday has not occurred this year
          // if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
          //   ageInYears -= 1;
          //   ageMonths += 12;
          // }

          // const ageString = ageInYears > 0 ? `${ageInYears} years` : '';
          // const monthsString = ageMonths > 0 ? `${ageMonths} months` : '';

          studentList.push({
            id: doc.id,
            registrationNo: doc.id,
            name: studentData.name,
            fatherName: studentData.fatherName,
            dob: studentData.dateOfBirth,
            gender: studentData.gender,
            class: studentData.admissionClass, // Add class information
            // ageInYears: ageInYears + ageMonths / 12,
            age: studentData.age,
          });
        });
        setStudents(studentList);
        setFilteredStudents(studentList);
        calculateAverages(studentList);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const calculateAverages = studentList => {
    const boys = studentList.filter(student => student.gender === 'Male');
    const girls = studentList.filter(student => student.gender === 'Female');

    const totalBoysAge = boys.reduce(
      (acc, student) => acc + parseFloat(student.age),
      0,
    );
    const totalGirlsAge = girls.reduce(
      (acc, student) => acc + parseFloat(student.age),
      0,
    );

    const avgAgeBoys =
      boys.length > 0 ? (totalBoysAge / boys.length).toFixed(0) : 0;
    const avgAgeGirls =
      girls.length > 0 ? (totalGirlsAge / girls.length).toFixed(0) : 0;

    setAvgAgeBoys(avgAgeBoys);
    setAvgAgeGirls(avgAgeGirls);
  };

  const handleFilterSelect = filter => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
    if (filter) {
      const trimmedFilter = filter.replace(/\s/g, '');
      const filtered = students.filter(
        student => student.class.replace(/\s/g, '') === trimmedFilter,
      );
      setFilteredStudents(filtered);
      calculateAverages(filtered);
    } else {
      console.log('None');
      setFilteredStudents(students);
      calculateAverages(students);
    }
  };

  const generatePDF = async () => {
    try {
      // // Request external storage permission if not granted
      // if (Platform.OS === 'android') {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //     {
      //       title: 'Storage Permission Required',
      //       message:
      //         'This app needs access to your storage to download the PDF file.',
      //       buttonPositive: 'OK',
      //     },
      //   );
      //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      //     console.error('Storage permission denied');
      //     return;
      //   }
      // }

      // Generate HTML content for the table
      let htmlContent = '<table border="1">';
      htmlContent += '<thead>';
      htmlContent += '<tr>';
      htmlContent += '<th>R.No</th>';
      htmlContent += '<th>Name</th>';
      htmlContent += '<th>Father Name</th>';
      htmlContent += '<th>DOB</th>';
      htmlContent += '<th>Age</th>';
      htmlContent += '</tr>';
      htmlContent += '</thead>';
      htmlContent += '<tbody>';
      filteredStudents.forEach(student => {
        htmlContent += '<tr>';
        htmlContent += `<td>${student.registrationNo}</td>`;
        htmlContent += `<td>${student.name}</td>`;
        htmlContent += `<td>${student.fatherName}</td>`;
        htmlContent += `<td>${student.dob}</td>`;
        htmlContent += `<td>${student.age}</td>`;
        htmlContent += '</tr>';
      });
      htmlContent += '</tbody>';
      htmlContent += '</table>';

      // Define options for PDF generation
      const options = {
        html: htmlContent,
        fileName: 'student_report',
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Age Record</Text>
        <TouchableOpacity onPress={generatePDF}>
          <MaterialIcons name="file-download" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.filterByContainer}
          onPress={() => setShowFilterModal(true)}>
          <Text>Filter by: {selectedFilter || 'Select option'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onSelect={handleFilterSelect}
      />

      <Text style={styles.text}>Analytics Overview</Text>

      <ScrollView>
        {/* Statistic Boxes */}
        <View style={styles.statisticsContainer}>
          <LinearGradient
            colors={['#BDC3C7', '#2C3E50']}
            style={styles.statBox}>
            <Text style={styles.statNumber}>{avgAgeBoys}</Text>
            <Text style={styles.statLabel}>Avg Age Boys</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#070606', '#104E8B']}
            style={styles.statBox}>
            <Text style={styles.statNumber}>{avgAgeGirls}</Text>
            <Text style={styles.statLabel}>Avg Age Girls</Text>
          </LinearGradient>
        </View>

        <Text style={styles.text}>Students Details</Text>

        {/* Table Header */}
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.regNo]}>R.No</Text>
              <Text style={styles.tableHeader}> Name</Text>
              <Text style={styles.tableHeader}>Father Name</Text>
              <Text style={styles.tableHeader}>dob</Text>
              <Text style={styles.tableHeader}>Age</Text>
            </View>

            {filteredStudents.map(student => (
              <View key={student.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.regNo]}>
                  {student.registrationNo}
                </Text>
                <Text style={styles.tableCell}>{student.name}</Text>
                <Text style={styles.tableCell}>{student.fatherName}</Text>
                <Text style={styles.tableCell}>{student.dob}</Text>
                <Text style={styles.tableCell}>{student.age}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
      {/* Bottom Navigation */}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    marginLeft: 'auto',
    marginRight: 0,
    marginTop: 20,
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
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
});

export default Report1;
