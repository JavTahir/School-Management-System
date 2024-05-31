import React, {useContext, useState, useEffect} from 'react';
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
import BottomNav from '../../components/BottomNavTeacher'; // Adjust the import path
import {AuthContext} from '../../context/authContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [teacherData, setTeacherData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherDoc = await firestore()
          .collection('Teachers')
          .doc(user.uid)
          .get();
        if (teacherDoc.exists) {
          setTeacherData(teacherDoc.data());
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, []);

  const handleChangePassword = async () => {
    setLoading(true);
    try {
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../../assets/student.jpg')} // Placeholder image URL
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{teacherData?.name}</Text>
        <Text style={styles.phone}>{teacherData?.occupation}</Text>
      </View>

      {/* Profile details */}
      <View style={styles.profileDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Reg No:</Text>
          <Text style={styles.detailText}>
            {teacherData?.registrationNumber}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Assigned Class:</Text>
          <Text style={styles.detailText}>{teacherData?.assignedClass}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Email:</Text>
          <Text style={styles.detailText}>{teacherData?.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Gender:</Text>
          <Text style={styles.detailText}>{teacherData?.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Date of Birth:</Text>
          <Text style={styles.detailText}>{teacherData?.dateOfBirth}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Phone:</Text>
          <Text style={styles.detailText}>123-456-7890</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailHeading}>Address:</Text>
          <Text style={styles.detailText}>{teacherData?.residence}</Text>
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

      {/* Change Password Modal */}
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
    marginBottom: 20,
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
