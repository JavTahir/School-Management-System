import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MenuModal from '../../components/MenuModal';
import firestore from '@react-native-firebase/firestore';
import Spinner from '../../components/Spinner';

// const teachers = [
//   {
//     id: '1',
//     name: 'John Doe',
//     designation: 'Math Teacher',
//     image:
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMROGiPiz70ixBvUgH3hUI3R6kvtFdStkqlLAQ_MmjA&s',
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     designation: 'Science Teacher',
//     image:
//       'https://www.shutterstock.com/image-photo/profile-picture-smiling-millennial-asian-260nw-1836020740.jpg',
//   },
//   {
//     id: '3',
//     name: 'Alice Johnson',
//     designation: 'History Teacher',
//     image:
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMROGiPiz70ixBvUgH3hUI3R6kvtFdStkqlLAQ_MmjA&s',
//   },
//   {
//     id: '4',
//     name: 'Bob Brown',
//     designation: 'Geography Teacher',
//     image:
//       'https://www.shutterstock.com/image-photo/profile-picture-smiling-millennial-asian-260nw-1836020740.jpg',
//   },
//   // Add more teachers as needed
// ];

const TeacherScreen = ({navigation}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  // const [selectedTeacher, setSelectedTeacher] = useState(null);
  // const [checkedClasses, setCheckedClasses] = useState({});
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // const profilePicUrl =
  //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWMROGiPiz70ixBvUgH3hUI3R6kvtFdStkqlLAQ_MmjA&s';

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherList = [];
        const snapshot = await firestore().collection('Teachers').get();
        snapshot.forEach(doc => {
          teacherList.push({id: doc.id, ...doc.data()});
        });
        setTeachers(teacherList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, [teachers]);

  const renderTeacherCard = ({item}) => {
    const {id, name, occupation, assignedClass, profilePicture} = item;

    const navigateToTeacherForm = () => {
      navigation.navigate('TeacherForm', {teacherId: id}); // Navigate to TeacherForm with teacher's ID as parameter
    };

    return (
      <TouchableOpacity
        style={styles.teacherCard}
        onPress={navigateToTeacherForm}>
        <Image source={{uri: profilePicture}} style={styles.teacherImage} />
        <Text style={styles.teacherName}>{name}</Text>
        <Text style={styles.teacherDesignation}>{occupation}</Text>
        <Text style={styles.assignedClassName}>Assigned: {assignedClass}</Text>
      </TouchableOpacity>
    );
  };

  const filterTeachers = () => {
    if (searchQuery === '') {
      return teachers;
    }
    return teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
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
        <Text style={styles.headerText}>Teachers</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenuOptions(true)}>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <MenuModal
        visible={showMenuOptions}
        onClose={() => setShowMenuOptions(false)}
        onNavigate={() => navigation.navigate('TeacherForm')}
        buttonText="Add a Teacher"
      />

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          placeholder="Search teachers"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onBlur={() => setSearchQuery('')}
        />
      </View>

      <FlatList
        data={filterTeachers()}
        renderItem={renderTeacherCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
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
  menuButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  teacherCard: {
    flex: 2,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    elevation: 2,
    position: 'relative',
  },
  teacherImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  teacherDesignation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  teacherClasses: {
    fontSize: 10,
    color: '#104E8B',
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  scrollContent: {
    paddingBottom: 100, // Ensure the content does not get hidden behind the bottom navigation
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalSearchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  modalContent: {
    paddingBottom: 20,
  },
  classItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  className: {
    marginLeft: 40,
    fontSize: 20,
    color: 'blue',
  },
  assignButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  assignButtonText: {
    color: 'white',
    fontSize: 16,
  },
  assignedClassName: {
    color: 'blue', // Change the color to blue
    fontSize: 16,
    marginRight: 5,
  },
});

export default TeacherScreen;
