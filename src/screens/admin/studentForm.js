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
import Spinner from '../../components/Spinner';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const StudentForm = ({route, navigation}) => {
  const {studentId} = route.params || '';
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dateOfAdmission, setDateOfAdmission] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [caste, setCaste] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residence, setResidence] = useState('');
  const [admissionClass, setAdmissionClass] = useState('');
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  const [valid, setValid] = useState({});
  const [isTouched, setIsTouched] = useState({});

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      // Fetch student data based on studentId from Firestore
      const fetchStudentData = async () => {
        try {
          const snapshot = await firestore()
            .collection('students')
            .doc(studentId)
            .get();
          const studentData = snapshot.data();
          setRegistrationNumber(studentId);
          setDateOfAdmission(studentData.dateOfAdmission);
          setName(studentData.name);
          setDateOfBirth(studentData.dateOfBirth);
          setGender(studentData.gender);
          setAge(studentData.age);
          setFatherName(studentData.fatherName);
          setCaste(studentData.caste);
          setOccupation(studentData.occupation);
          setResidence(studentData.residence);
          setAdmissionClass(studentData.admissionClass);
          setPassword(studentData.password);
          setEmail(studentData.email);
          setRemarks(studentData.remarks);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student data:', error);
          // Handle error
        }
      };

      fetchStudentData();
    }
  }, [studentId]);

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

  const validateFields = () => {
    const newValid = {};

    const nonNumericFields = {
      name,
      fatherName,
      caste,
      occupation,
      residence,

      remarks,
    };

    Object.entries(nonNumericFields).forEach(([key, value]) => {
      newValid[key] = /^[^\d]+$/.test(value); // Validate that the value does not contain numeric characters
    });

    newValid.registrationNumber = true; // Validate that the registration number contains only digits
    newValid.password = true;
    newValid.email = true;
    newValid.admissionClass = true;

    setValid(newValid);
  };

  const handleSave = async () => {
    // Check for empty fields
    const fields = [
      {name: 'Registration Number', value: registrationNumber},
      {name: 'Date of Admission', value: dateOfAdmission},
      {name: 'Name', value: name},
      {name: 'Date of Birth', value: dateOfBirth},
      {name: 'Gender', value: gender},
      {name: 'Age', value: age},
      {name: 'Father Name', value: fatherName},
      {name: 'Caste', value: caste},
      {name: 'Occupation', value: occupation},
      {name: 'Residence', value: residence},
      {name: 'Admission Class', value: admissionClass},
      {name: 'Password', value: password},
      {name: 'Email', value: email},
      {name: 'Remarks', value: remarks},
    ];

    const emptyField = fields.find(field => !field.value.trim());

    if (emptyField) {
      Alert.alert('Error', `Please fill the empty field: ${emptyField.name}`);
      return;
    }

    // Validate fields
    validateFields();
    const allFieldsValid = Object.values(valid).every(Boolean);

    // if (!allFieldsValid) {
    //   Alert.alert('Error', 'Some fields are invalid');
    //   return;
    // }

    try {
      if (studentId) {
        // If studentId is present, update existing student data
        await firestore().collection('students').doc(studentId).update({
          dateOfAdmission,
          name,
          dateOfBirth,
          gender,
          age,
          fatherName,
          caste,
          occupation,
          residence,
          admissionClass,

          password,
          email,
          remarks,
        });
        Alert.alert('Success', 'Student record updated', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const imageUrl = await uploadImage();

        // If studentId is not present, add new student data
        const docRef = await firestore()
          .collection('students')
          .doc(registrationNumber)
          .set({
            dateOfAdmission,
            name,
            dateOfBirth,
            gender,
            age,
            fatherName,
            caste,
            occupation,
            residence,
            admissionClass,
            remarks,
            password,
            email,
            profilePicture: imageUrl,
          });
        Alert.alert('Success', 'Student record saved', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving/updating student data:', error);
      Alert.alert('Error', 'Failed to save/update student data');
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
        <Text style={styles.headerText}>Add Student Details</Text>
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

          <CustomDatePicker
            placeholder="Date of Admission"
            date={dateOfAdmission}
            setDate={setDateOfAdmission}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name of Student"
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
              placeholder="Age"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Father Name"
              value={fatherName}
              onChangeText={setFatherName}
              onBlur={() => handleBlur('fatherName')}
            />
            {renderValidationIcon('fatherName')}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Caste"
              value={caste}
              onChangeText={setCaste}
              onBlur={() => handleBlur('caste')}
            />
            {renderValidationIcon('caste')}
          </View>

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
            <TextInput
              style={styles.input}
              placeholder="Admission Class"
              value={admissionClass}
              onChangeText={setAdmissionClass}
              onBlur={() => handleBlur('admissionClass')}
            />
            {renderValidationIcon('admissionClass')}
          </View>

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

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.remarks}
              placeholder="Remarks"
              value={remarks}
              onChangeText={setRemarks}
              onBlur={() => handleBlur('remarks')}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
  imagePickerText: {
    color: '#104E8B',
    fontWeight: 'bold',
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
});

export default StudentForm;
