import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    await AsyncStorage.setItem('userToken', user.uid); // Save user token
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password, role) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    await AsyncStorage.setItem('userToken', user.uid); // Save user token

    let userDoc;
    if (role === 'teacher') {
      const teachersQuery = firestore()
        .collection('Teachers')
        .where('email', '==', email)
        .limit(1);

      const teachersSnapshot = await teachersQuery.get();

      if (teachersSnapshot.empty) {
        throw new Error('No teacher record found for this email.');
      } else {
        userDoc = teachersSnapshot.docs[0];
      }
    } else if (role === 'admin') {
      userDoc = await firestore().collection('admin').doc(user.uid).get();
    }

    if (!userDoc.exists) {
      throw new Error(`No ${role} record found for this user.`);
    }

    return {user, userDoc};
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    await AsyncStorage.removeItem('userToken'); // Remove user token
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    return userToken;
  } catch (error) {
    throw error;
  }
};
