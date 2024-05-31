import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../context/authContext';
import Spinner from '../../components/Spinner';

const subjectIcons = {
  Urdu: require('../../../assets/urdu.jpg'),
  Math: require('../../../assets/math.png'),
  English: require('../../../assets/english.jpg'),
  GeneralKnowledge: require('../../../assets/science.jpg'),
  Islamyat: require('../../../assets/islamyat.jpg'),
  ComputerPart1: require('../../../assets/computerPart1.jpg'),
  ComputerPart2: require('../../../assets/computerPart2.jpg'),
  SocialStudy: require('../../../assets/physics.png'),
  NazreQuran: require('../../../assets/islamyat.jpg'),
  Quran: require('../../../assets/islamyat.jpg'),
};
const SyllabusScreen = ({navigation}) => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState('');
  const [loading, setLoading] = useState(true);

  const {user} = useContext(AuthContext);

  // const subjects = [
  //   {
  //     name: 'Mathematics',
  //     instructor: 'Prof. Smith',
  //     icon: require('../../../assets/math.png'),
  //   },
  //   {
  //     name: 'Science',
  //     instructor: 'Prof. Smith',
  //     icon: require('../../../assets/science.jpg'),
  //   },
  //   {
  //     name: 'Physics',
  //     instructor: 'Prof. Smith',
  //     icon: require('../../../assets/physics.png'),
  //   },
  //   // ... Add more subjects
  // ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (user) {
          const userEmail = user?.email;

          const studentSnapshot = await firestore()
            .collection('students')
            .where('email', '==', userEmail)
            .get();

          if (!studentSnapshot.empty) {
            const student = studentSnapshot.docs[0].data();
            if (student) {
              console.log(student);

              const admissionClass = student.admissionClass;
              setClasses(admissionClass);
              const classDoc = await firestore()
                .collection('Classes')
                .doc(student.admissionClass)
                .get();
              if (classDoc.exists) {
                const classData = classDoc.data();
                setSubjects(classData.subjects);
              }
            }
          }

          setLoading(false);

          // Get the subjects array from the class document
          // const classData = classDoc.data();
          // console.log(classData);

          // const classSubjects = classData.subjects;

          // // Set the subjects state
          // setSubjects(classSubjects);
        }
        // Fetch the student's class from Firestore
      } catch (error) {
        console.error('Error fetching subjects: ', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleViewSyllabus = async subject => {
    try {
      const syllabusDoc = await firestore()
        .collection('Syllabus')
        .doc(classes)
        .get();
      const subjectSyllabusUrl = syllabusDoc.data()[subject];

      navigation.navigate('SyllabusDetails', {syllabusUrl: subjectSyllabusUrl});
    } catch (error) {
      console.error('Error fetching syllabus URL: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>View Syllabus</Text>
      </View>
      {loading && <Spinner />}

      <ScrollView>
        {subjects.map((subject, index) => (
          <View key={index} style={styles.syllabusItem}>
            <Image source={subjectIcons[subject]} style={styles.subjectIcon} />
            <View style={styles.syllabusDetails}>
              <Text style={styles.subjectName}>{subject}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewSyllabus(subject)}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background
  },
  syllabusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff', // White background for syllabus details
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#104E8B',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  syllabusDetails: {
    flex: 1, // Grow to fill remaining space
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructorName: {
    fontSize: 16,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#104E8B', // Green color
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 'auto', // Align to right end
  },
  viewButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SyllabusScreen;
