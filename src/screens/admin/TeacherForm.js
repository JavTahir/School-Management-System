import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDatePicker from '../../components/CustomDatePicker';
import Dropdown from '../../components/dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import FilterModal from '../../components/ClassFilterModal';
import Spinner from '../../components/Spinner';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const TeacherForm = ({route, navigation}) => {
  const {teacherId} = route.params || '';
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residence, setResidence] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [valid, setValid] = useState({});
  const [isTouched, setIsTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (teacherId) {
      setLoading(true);
      const fetchTeacherData = async () => {
        try {
          const snapshot = await firestore()
            .collection('Teachers')
            .doc(teacherId)
            .get();
          const teacherData = snapshot.data();
          setRegistrationNumber(teacherData.registrationNumber);
          setName(teacherData.name);
          setDateOfBirth(teacherData.dateOfBirth);
          setGender(teacherData.gender);
          setOccupation(teacherData.occupation);
          setResidence(teacherData.residence);
          setAssignedClass(teacherData.assignedClass);
          setPassword(teacherData.password);
          setEmail(teacherData.email);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching teacher data:', error);
          // Handle error
        }
      };

      fetchTeacherData();
    }
  }, [teacherId]);

  const selectImage = () => {
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
      }
    });
  };

  const uploadImage = async () => {
    if (!profilePicture) {
      console.error('No profile picture selected');
      return '';
    }

    const filename = profilePicture.substring(
      profilePicture.lastIndexOf('/') + 1,
    );
    const storageRef = storage().ref(`profile_pictures/${filename}`);

    try {
      // Upload the file to Firebase Storage
      await storageRef.putFile(profilePicture);
      console.log('Image uploaded successfully');

      // Retrieve the download URL for the uploaded file
      const url = await storageRef.getDownloadURL();
      console.log('Download URL:', url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  };

  const handleFilterSelect = async filter => {
    // Check if the selected class has already been assigned to another teacher
    try {
      const snapshot = await firestore()
        .collection('Teachers')
        .where('assignedClass', '==', filter)
        .get();

      if (!snapshot.empty) {
        Alert.alert(
          'Class Already Assigned',
          'This class has already been assigned to some other teacher.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      } else {
        setAssignedClass(filter);
        setShowFilterModal(false);
      }
    } catch (error) {
      console.error('Error checking assigned class:', error);
      Alert.alert('Error', 'Failed to check assigned class');
    }
  };

  const validateFields = () => {
    const newValid = {};

    const nonNumericFields = {
      name: name,
      occupation: occupation,
      residence: residence,
    };

    Object.entries(nonNumericFields).forEach(([key, value]) => {
      newValid[key] = /^[^\d]+$/.test(value); // Validate that the value does not contain numeric characters
    });

    newValid.registrationNumber = true; // Validate that the registration number contains only digits
    newValid.password = true;
    newValid.email = true;

    setValid(newValid);
  };

  const handleSave = async () => {
    // Check for empty fields
    const fields = [
      {name: 'Registration Number', value: registrationNumber},
      {name: 'Name', value: name},
      {name: 'Date of Birth', value: dateOfBirth},
      {name: 'Gender', value: gender},
      {name: 'Occupation', value: occupation},
      {name: 'Residence', value: residence},
      {name: 'Assigned Class', value: assignedClass},
      {name: 'Password', value: password},
      {name: 'Email', value: email},
    ];

    const emptyField = fields.find(field => !field.value.trim());

    if (emptyField) {
      Alert.alert('Error', `Please fill the empty field: ${emptyField.name}`);
      return;
    }

    // Validate fields
    validateFields();
    const allFieldsValid = Object.values(valid).every(Boolean);

    if (!allFieldsValid) {
      Alert.alert('Error', 'Some fields are invalid');
      return;
    }

    try {
      if (teacherId) {
        // If teacherId is present, update existing teacher data
        await firestore().collection('Teachers').doc(teacherId).update({
          registrationNumber,
          name,
          dateOfBirth,
          gender,
          occupation,
          residence,
          assignedClass,
          password,
          email,
        });
        Alert.alert('Success', 'Teacher record updated', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // If teacherId is not present, add new teacher data
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const user = userCredential.user;

        const imageUrl = await uploadImage();

        // Add user data to Firestore
        await firestore().collection('Teachers').doc(user.uid).set({
          registrationNumber,
          name,
          dateOfBirth,
          gender,
          occupation,
          residence,
          assignedClass,
          password,
          email,
          profilePicture: imageUrl,
        });

        Alert.alert('Success', 'Teacher record saved', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving/updating teacher data:', error);
      Alert.alert('Error', 'Failed to save/update teacher data');
    }
  };

  const handleBlur = field => {
    setIsTouched({...isTouched, [field]: true});
    validateFields();
  };

  const renderValidationIcon = field => {
    if (!isTouched[field]) return null;

    return (
      <MaterialCommunityIcons
        name={valid[field] ? 'check' : 'close'}
        size={20}
        color={valid[field] ? 'green' : 'red'}
        style={styles.validationIcon}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />
      {loading && <Spinner />}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Teacher Details</Text>
      </View>
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Registration Number"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              onBlur={() => handleBlur('registrationNumber')}
              keyboardType="numeric"
            />
            {renderValidationIcon('registrationNumber')}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name of Teacher"
              value={name}
              onChangeText={setName}
              onBlur={() => handleBlur('name')}
            />
            {renderValidationIcon('name')}
          </View>

          <CustomDatePicker
            placeholder="Date of Birth"
            date={dateOfBirth}
            setDate={setDateOfBirth}
          />

          <Dropdown
            options={['Male', 'Female']}
            selectedValue={gender}
            onValueChange={setGender}
            placeholder="Select Gender"
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              value={occupation}
              onChangeText={setOccupation}
              onBlur={() => handleBlur('occupation')}
            />
            {renderValidationIcon('Fathers occupation')}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Residence"
              value={residence}
              onChangeText={setResidence}
              onBlur={() => handleBlur('residence')}
            />
            {renderValidationIcon('residence')}
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.touchableInput}
              onPress={() => setShowFilterModal(true)}>
              <Text style={styles.touchableInputText}>
                {assignedClass ? assignedClass : 'Select Assigned Class'}
              </Text>
            </TouchableOpacity>
          </View>
          <FilterModal
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onSelect={handleFilterSelect}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => handleBlur('password')}
              secureTextEntry
            />
            {renderValidationIcon('password')}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => handleBlur('email')}
            />
            {renderValidationIcon('email')}
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>
                {profilePicture
                  ? 'Change Profile Picture'
                  : 'Select Profile Picture'}
              </Text>
            </TouchableOpacity>
            {profilePicture && (
              <Image
                source={{uri: profilePicture}}
                style={styles.profileImage}
              />
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imagePickerText: {
    color: '#104E8B',
    fontWeight: 'bold',
  },
  imagePicker: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  input: {
    flex: 1,

    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
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
  remarks: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    textAlignVertical: 'top',
  },
  validationIcon: {
    marginLeft: 10,
  },
  touchableInputText: {
    color: '#000',
  },
  touchableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
});

export default TeacherForm;
