import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/BottomNavStudent'; // Adjust the import path
import {AuthContext} from '../../context/authContext';
import Spinner from '../../components/Spinner';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  console.log('haha', user);

  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState('');
  const [studentid, setStudentId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      try {
        const userEmail = user?.email;

        const studentSnapshot = await firestore()
          .collection('students')
          .where('email', '==', userEmail)
          .get();
        console.log('snapshot', studentSnapshot);

        if (!studentSnapshot.empty) {
          const studentData = studentSnapshot.docs[0].data();
          console.log('hahhahhahahaha', studentData);
          setStudent(studentData);
          setStudentId(studentSnapshot.docs[0].id);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      console.log('user', auth().currentUser);
      await auth().currentUser.updatePassword(newPassword);
      Alert.alert('Pasword set successfully');
      await auth().signOut();
      navigation.navigate('RoleScreen');
    } catch (error) {
      Alert.alert('Error occurred');
    }
    setLoading(false);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && <Spinner />}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                student?.profilePicture ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{student?.name}</Text>
        <Text style={styles.phone}>
          {student?.admissionClass} | {studentid || ''}
        </Text>
      </View>

      {/* Profile details */}
      <View style={styles.profileDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Email:</Text>
          <Text style={styles.detailText}>{student?.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Gender:</Text>
          <Text style={styles.detailText}>{student?.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Date of Birth:</Text>
          <Text style={styles.detailText}>{student?.dateOfBirth}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Phone:</Text>
          <Text style={styles.detailText}>123-456-7890</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>PAddress:</Text>
          <Text style={styles.detailText}>{student?.residence}</Text>
        </View>
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setModalVisible(true)}>
          <MaterialIcons name="lock" size={24} color="#104E8B" />
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </View>
      {/* Bottom Navigation */}
      <BottomNav />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.modalButtonContainer}>
              <Button
                title="Cancel"
                color="#FF4500"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title={loading ? 'Updating...' : 'Update Password'}
                color="#104E8B"
                onPress={handleChangePassword}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#104E8B',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phone: {
    color: 'white',
    fontSize: 16,
    marginBottom: 30,
  },
  profileDetails: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    marginTop: -20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailHeading: {
    fontWeight: 'bold',
    marginRight: 15,
    fontSize: 18,
    width: 170,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  changePasswordText: {
    color: '#104E8B',
    marginLeft: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#104E8B',
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderColor: '#104E8B',
    borderWidth: 1,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ProfileScreen;
