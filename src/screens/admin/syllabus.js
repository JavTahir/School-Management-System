import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FilterModal from '../../components/ClassFilterModal';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

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

const UploadSyllabusScreen = ({navigation}) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, [selectedClass]);

  const handleFilterSelect = filter => {
    setSelectedClass(filter);
    setShowFilterModal(false);
  };

  // Function to fetch subjects based on selected class
  const fetchSubjects = async () => {
    try {
      if (!selectedClass) return; // Don't fetch if no class is selected

      // Fetch the class document from Firestore
      const classDoc = await firestore()
        .collection('Classes')
        .doc(selectedClass)
        .get();

      // Check if the class document exists
      if (classDoc.exists) {
        const {subjects} = classDoc.data();
        setSubjects(subjects || []); // Set subjects array from document data, or empty array if not found
      } else {
        console.error('Class document not found');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleUploadImage = async subject => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          setProfilePicture(uri);

          const filename = uri.substring(uri.lastIndexOf('/') + 1);
          setUploadStatus(prevStatus => ({
            ...prevStatus,
            [subject]: 'Uploading',
          }));
          // Upload image to Firebase Storage
          const uploadTask = storage()
            .ref(`${selectedClass}/${subject}/${filename}`)
            .putFile(uri);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(
            'state_changed',
            snapshot => {
              // Handle progress changes
              console.log(
                'Upload is ' +
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +
                  '% done',
              );
            },
            error => {
              // Handle unsuccessful uploads
              console.error('Error uploading image:', error);
            },
            async () => {
              // Handle successful uploads on complete
              const downloadURL =
                await uploadTask.snapshot.ref.getDownloadURL();

              // Save the image URL along with the subject name in the Syllabus collection
              await firestore()
                .collection('Syllabus')
                .doc(selectedClass)
                .set(
                  {
                    [subject]: downloadURL,
                  },
                  {merge: true},
                );

              console.log('Image uploaded successfully:', downloadURL);
              setUploadStatus(prevStatus => ({
                ...prevStatus,
                [subject]: 'Uploaded',
              }));
            },
          );
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload Syllabus</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <MaterialIcons name="filter-list" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)} // Close the modal when an option is selected
        onSelect={handleFilterSelect}
      />

      {/* Prompt Message */}
      {!selectedClass && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Select the class from drop down and upload the syllabus
          </Text>
        </View>
      )}

      {/* Subjects List */}
      {/* Subjects List */}
      {selectedClass && (
        <ScrollView>
          <View style={styles.subjectsContainer}>
            {subjects.map(subject => (
              <View key={subject} style={styles.subjectItem}>
                <Image
                  source={subjectIcons[subject]}
                  style={styles.subjectIcon}
                />
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject}</Text>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleUploadImage(subject)}
                    disabled={uploadStatus[subject] === 'Uploading'}>
                    {uploadStatus[subject] === 'Uploading' ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.uploadButtonText}>
                        {uploadStatus[subject] === 'Uploaded'
                          ? 'Uploaded'
                          : 'Upload'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  subjectsContainer: {
    paddingVertical: 20,
    marginHorizontal: 10,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: 'white', // Background color for the container
    borderRadius: 10, // Rounded border
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3, // Shadow effect for Android
  },
  subjectIcon: {
    width: 50,
    height: 70,
    marginRight: 20,
  },
  subjectInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#104E8B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UploadSyllabusScreen;
