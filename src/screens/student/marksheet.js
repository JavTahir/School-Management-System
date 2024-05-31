import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import BottomNav from '../../components/BottomNavStudent'; // Adjust the import path
import DropdownMenu from '../../components/TermsDropDown'; // Adjust the import path
import MarksTable from '../../components/MarksTable'; // Adjust the import path
import {AuthContext} from '../../context/authContext';
import firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import Spinner from '../../components/Spinner';

const MarksScreen = () => {
  const {user} = useContext(AuthContext);

  const [currentSelectedTerm, setCurrentSelectedTerm] = useState('First');
  const [currentDropdownVisible, setCurrentDropdownVisible] = useState(false);
  // const [showPreviousResults, setShowPreviousResults] = useState(false);
  // const [previousSelectedTerms, setPreviousSelectedTerms] = useState({});
  // const [previousDropdownVisible, setPreviousDropdownVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [marksData, setMarksData] = useState({});
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      try {
        const userEmail = user?.email;

        const studentSnapshot = await firestore()
          .collection('students')
          .where('email', '==', userEmail)
          .get();

        if (!studentSnapshot.empty) {
          const studentData = studentSnapshot.docs[0].data();
          setStudent(studentData);
          console.log('studenyt', studentData);
          const terms = ['First', 'Mid', 'Final'];
          const marks = {};
          const allSubjects = new Set();

          for (const term of terms) {
            const termMarksDoc = await firestore()
              .collection('students')
              .doc(studentSnapshot.docs[0].id)
              .collection('marks')
              .doc(term)
              .get();
            console.log('termdoc', termMarksDoc);

            if (termMarksDoc.exists) {
              marks[term] = termMarksDoc.data();
              console.log('term', marks[term]);
            } else {
              marks[term] = {}; // Initialize with an empty object if no marks document exists for this term
            }
          }

          setMarksData(marks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // const marksData = {
  //   First: [
  //     {subject: 'Math', marks: 85, percentage: '85%'},
  //     {subject: 'Science', marks: 90, percentage: '90%'},
  //     {subject: 'English', marks: 78, percentage: '78%'},
  //   ],
  //   Mid: [
  //     {subject: 'Math', marks: 80, percentage: '80%'},
  //     {subject: 'Science', marks: 88, percentage: '88%'},
  //     {subject: 'English', marks: 82, percentage: '82%'},
  //   ],
  //   Final: [
  //     {subject: 'Math', marks: 92, percentage: '92%'},
  //     {subject: 'Science', marks: 95, percentage: '95%'},
  //     {subject: 'English', marks: 85, percentage: '85%'},
  //   ],
  // };

  // const handlePreviousDropdownPress = className => {
  //   setPreviousDropdownVisible(prevState => ({
  //     ...prevState,
  //     [className]: !prevState[className],
  //   }));
  // };

  // const handlePreviousTermSelect = (className, term) => {
  //   setPreviousSelectedTerms(prevState => ({
  //     ...prevState,
  //     [className]: term,
  //   }));
  //   setPreviousDropdownVisible(prevState => ({
  //     ...prevState,
  //     [className]: false,
  //   }));
  // };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />

      {isLoading && <Spinner />}

      <View style={styles.header}>
        <Text style={styles.headerText}>MarkSheet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.rowContainer}>
          <View style={styles.classLabelContainer}>
            <Text style={styles.classLabelText}>{student?.admissionClass}</Text>
            <Text style={styles.currentLabel}>Current</Text>
          </View>
          <DropdownMenu
            visible={currentDropdownVisible}
            selectedTerm={currentSelectedTerm}
            onToggle={() => setCurrentDropdownVisible(!currentDropdownVisible)}
            onSelect={term => {
              setCurrentSelectedTerm(term);
              setCurrentDropdownVisible(false);
            }}
          />
        </View>

        <MarksTable data={marksData[currentSelectedTerm] || {}} />

        {/* {!showPreviousResults && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => setShowPreviousResults(true)}>
            <Text style={styles.seeAllText}>
              See result of previous classes
            </Text>
          </TouchableOpacity>
        )} */}

        {/* {showPreviousResults &&
          Object.keys(previousMarksData).map(className => (
            <View key={className}>
              <Text style={styles.className}>{className}</Text>
              <View style={styles.rowContainer}>
                <DropdownMenu
                  visible={previousDropdownVisible[className]}
                  selectedTerm={previousSelectedTerms[className] || 'First'}
                  onToggle={() => handlePreviousDropdownPress(className)}
                  onSelect={term => handlePreviousTermSelect(className, term)}
                />
              </View>

              <MarksTable
                data={
                  previousMarksData[className][
                    previousSelectedTerms[className] || 'First'
                  ]
                }
              />
            </View>
          ))} */}
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
    justifyContent: 'center',
    backgroundColor: '#104E8B',
    paddingTop: 30,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 30,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    position: 'relative',
  },
  classLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classLabelText: {
    fontSize: 18,
  },
  currentLabel: {
    marginLeft: 10,
    fontSize: 12,
    color: 'green',
  },
  className: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  seeAllButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  seeAllText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MarksScreen;
