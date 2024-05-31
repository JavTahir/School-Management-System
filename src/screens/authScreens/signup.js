import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      const marksData = [
        {
          className: 'Class 5',
          students: [
            {
              studentDocId: '001', //which is that particulat student doc id
              name: 'John Doe',
              marks: {
                firstTerm: {
                  English: 80 / 100,
                  Urdu: 75 / 80,
                  Math: 85 / 100,
                  NazraeQuran: 90 / 100,
                },
                midTerm: {English: 70 / 80, Urdu: 65 / 70},
                finalTerm: {
                  English: 90 / 100,
                  Urdu: 85 / 100,
                  Math: 95 / 100,
                  NazraeQuran: 92 / 100,
                },
              },
            },
            // Add more students as needed
          ],
        },
        {
          className: 'Prep',
          students: [
            {
              registrationNumber: '002',
              name: 'Jenny',
              marks: {
                firstTerm: {
                  English: 85,
                  Urdu: 80,
                  Math: 90,
                  'Nazra-e-Quran': 95,
                  'General Knowledge': 85,
                },
                midTerm: {
                  English: 75,
                  Urdu: 70,
                  Math: 80,
                  'Nazra-e-Quran': 90,
                  'General Knowledge': 80,
                },
                finalTerm: {
                  English: 88,
                  Urdu: 83,
                  Math: 92,
                  'Nazra-e-Quran': 94,
                  'General Knowledge': 85,
                },
              },
            },
            {
              registrationNumber: '001',
              name: 'John Doe',
              marks: {
                firstTerm: {
                  English: 85,
                  Urdu: 80,
                  Math: 90,
                  'Nazra-e-Quran': 95,
                  'General Knowledge': 85,
                },
                midTerm: {
                  English: 75,
                  Urdu: 70,
                  Math: 80,
                  'Nazra-e-Quran': 90,
                  'General Knowledge': 80,
                },
                finalTerm: {
                  English: 88,
                  Urdu: 83,
                  Math: 92,
                  'Nazra-e-Quran': 94,
                  'General Knowledge': 85,
                },
              },
            },
            // Add more students as needed
          ],
        },
        {
          className: 'Class1',
          students: [
            {
              registrationNumber: '002',
              name: 'Jenny',
              marks: {
                firstTerm: {
                  English: 90,
                  Urdu: 85,
                  Math: 95,
                  'General Knowledge': 85,
                  Islamyat: 80,
                },
                midTerm: {
                  English: 85,
                  Urdu: 80,
                  Math: 90,
                  'General Knowledge': 82,
                  Islamyat: 75,
                },
                finalTerm: {
                  English: 92,
                  Urdu: 88,
                  Math: 96,
                  'General Knowledge': 88,
                  Islamyat: 85,
                },
              },
            },
            // Add more students as needed
          ],
        },
        {
          className: 'Class2',
          students: [
            {
              registrationNumber: '002',
              name: 'Jennny',
              marks: {
                firstTerm: {
                  English: 88,
                  Urdu: 82,
                  Math: 90,
                  'General Knowledge': 85,
                  Islamyat: 78,
                  'Computer (Part1)': 85,
                },
                midTerm: {
                  English: 82,
                  Urdu: 78,
                  Math: 88,
                  'General Knowledge': 80,
                  Islamyat: 72,
                  'Computer (Part1)': 80,
                },
              },
            },
            // Add more students as needed
          ],
        },
        // Add more classes as needed
      ];

      // Add data for remaining classes as needed

      for (const classData of marksData) {
        const {className, students} = classData;

        // Reference to the collection for the current class
        const classRef = firestore().collection('Marks').doc(className);

        // Loop through the students array for the current class
        for (const student of students) {
          const {registrationNumber, name, marks} = student;

          // Reference to the document for the current student
          const studentRef = classRef
            .collection('Students')
            .doc(`${registrationNumber}`);

          // Set or update the marks data for the current student
          await studentRef.set({
            name,
            marks,
          });
        }
      }
      console.log('Marks data stored successfully');

      navigation.navigate('RoleScreen');

      // console.log('User created:', userCredential);
      setMessage('User created successfully');
      setMessage('');
    } catch (err) {
      console.error('Error creating user:', err);
      setMessage(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={() => handleSignUp()}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signup}
        onPress={() => navigation.navigate('Login')}>
        <Text style={{color: 'blue'}}>Already have an account?Login</Text>
      </TouchableOpacity>
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#3498db',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  signup: {
    alignItems: 'center',
  },
});

export default SignUpScreen;
