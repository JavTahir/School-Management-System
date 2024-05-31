import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MenuModal from '../../components/MenuModal';
import firestore from '@react-native-firebase/firestore';
import FilterModal from '../../components/ClassFilterModal';
import Spinner from '../../components/Spinner';

const StudentScreen = ({navigation}) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const profilePicUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMROGiPiz70ixBvUgH3hUI3R6kvtFdStkqlLAQ_MmjA&s';

  // const students = [
  //   {
  //     id: '1',
  //     name: 'John Doe',
  //     department: 'Computer Science',
  //     class: 'Class 1',
  //     profilePicUrl:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMROGiPiz70ixBvUgH3hUI3R6kvtFdStkqlLAQ_MmjA&s',
  //     status: 'In',
  //   },
  //   {
  //     id: '2',
  //     name: 'Jane Smith',
  //     department: 'Mathematics',
  //     class: 'Class 2',
  //     profilePicUrl:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMROGiPiz70ixBvUgH3hUI3R6kvtFdStkqlLAQ_MmjA&s',
  //     status: 'Out',
  //   },
  //   // Add more student objects as needed
  // ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsList = [];
        const querySnapshot = await firestore().collection('students').get();
        querySnapshot.forEach(documentSnapshot => {
          studentsList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setStudents(studentsList);
        setFilteredStudents(studentsList);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleFilterSelect = filter => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
    if (filter) {
      const filteredList = students.filter(
        student => student.admissionClass === filter,
      );
      setFilteredStudents(filteredList);
    } else {
      setFilteredStudents(students);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const filteredList = students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredStudents(filteredList);
    } else {
      setFilteredStudents(students);
    }
  };

  const handleDeleteStudent = async studentId => {
    try {
      await firestore().collection('students').doc(studentId).delete();
      setStudents(prevStudents =>
        prevStudents.filter(student => student.id !== studentId),
      );
      setFilteredStudents(prevStudents =>
        prevStudents.filter(student => student.id !== studentId),
      );
      Alert.alert('Success', 'Student record deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete student record');
    }
  };

  const confirmDeleteStudent = studentId => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteStudent(studentId),
        },
      ],
      {cancelable: true},
    );
  };

  const handleSearchBlur = () => {
    setSearchQuery('');
    setFilteredStudents(students);
  };

  // const getStatusColor = status => {
  //   if (status === 'In') {
  //     return {backgroundColor: 'green', color: '#104E8B'};
  //   } else {
  //     return {backgroundColor: '#104E8B', color: 'white'};
  //   }
  // };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />
      {/* Activity Indicator */}
      {loading && <Spinner />}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Students</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenuOptions(true)}>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <MenuModal
        visible={showMenuOptions}
        onClose={() => setShowMenuOptions(false)}
        onNavigate={() => navigation.navigate('StudentForm')}
        buttonText="Add a Student"
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          placeholder="Search students"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          onBlur={handleSearchBlur}
        />
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

      {/* List of Students */}
      <ScrollView>
        {filteredStudents.map(student => (
          <TouchableOpacity
            key={student.id}
            style={styles.studentContainer}
            onPress={() => alert(`Selected ${student.name}`)}>
            <Image
              source={{uri: student.profilePicture}}
              style={styles.profilePic}
            />
            <View style={styles.studentInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.studentName}>
                  {student.name} | {student.id}
                </Text>
              </View>
              <Text style={styles.studentClass}>{student.admissionClass}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => confirmDeleteStudent(student.id)}>
              <MaterialIcons name="delete" size={24} color="#104E8B" />
            </TouchableOpacity>
            <TouchableOpacity
              key={student.id}
              style={styles.viewDetails}
              onPress={() =>
                navigation.navigate('StudentForm', {studentId: student.id})
              }>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   position: 'absolute',
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: 'rgba(255, 255, 255, 0.7)', // Add a semi-transparent background
  // },
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
  backButton: {
    marginRight: 20, // Adjust as needed for spacing
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center', // Ensures the text is centered
  },
  menuButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
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
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#104E8B',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    height: 120,
    position: 'relative', // Needed for absolute positioning of View Details
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  studentDetails: {
    color: '#666',
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  viewDetails: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewDetailsText: {
    color: 'black',
  },
  statusLabel: {
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 60,
    alignItems: 'center',
    marginHorizontal: 20,
    height: 25,
    justifyContent: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    color: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  classItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default StudentScreen;
