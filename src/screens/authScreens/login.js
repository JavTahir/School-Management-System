import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Spinner from '../../components/Spinner';

const LoginScreen = ({route, navigation}) => {
  const {role} = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regNo, setRegNo] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (role === 'student') {
      await handleStudentLogin();
    } else {
      await handleAuthLogin();
    }
    setLoading(false);
  };

  const handleStudentLogin = async () => {
    try {
      const studentDoc = await firestore()
        .collection('students')
        .doc(regNo)
        .get();

      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        const Email = studentData.email;
        const userCredential = await auth().signInWithEmailAndPassword(
          Email,
          password,
        );
        navigation.navigate('RootStudentNavigation');
      } else {
        setMessage('No student record found for this registration number.');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAuthLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      console.log('Login:', user);

      let dbRef;
      if (role === 'teacher') {
        const teacherDoc = await firestore()
          .collection('Teachers')
          .doc(user.uid)
          .get();

        if (teacherDoc.exists) {
          navigation.navigate('RootTeacherNavigation');
        } else {
          setMessage('No teacher record found for this user.');
        }
      } else if (role === 'admin') {
        dbRef = firestore().collection('admin').doc(user.uid);
        const userDoc = await dbRef.get();
        if (userDoc.exists) {
          navigation.navigate('RootClientTabs');
        }
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')} // Replace with the actual path to your logo
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>
      {role === 'student' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Reg No"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={regNo}
            onChangeText={setRegNo}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </>
      ) : (
        <>
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
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
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
    padding: 20,
    marginTop: 40,
  },
  logo: {
    width: 200, // Adjust the width and height as needed
    height: 200,
    marginBottom: 20, // Add some margin for spacing
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b4e6c',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: -30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#104E8B', // Updated color
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
    backgroundColor: '#104E8B', // Updated color
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#104E8B', // Updated color
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

export default LoginScreen;
