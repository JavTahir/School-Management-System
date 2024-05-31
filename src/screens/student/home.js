import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNav from '../../components/BottomNavStudent'; // Adjust the import path
import {StackActions} from '@react-navigation/native';
import MenuModal from '../../components/MenuModal';
import {AuthContext} from '../../context/authContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import Spinner from '../../components/Spinner';

const HomeScreen = ({navigation}) => {
  const [isDuesCleared, setIsDuesCleared] = useState(true); // State to track due status
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [studentData, setStudentData] = useState('');
  const [loading, setLoading] = useState(true);

  const {user} = useContext(AuthContext);

  // const {role, registrationNumber, studentData} = route.params || {};

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        console.log('user', user);

        if (user) {
          const userEmail = user?.email;

          const studentSnapshot = await firestore()
            .collection('students')
            .where('email', '==', userEmail)
            .get();

          if (!studentSnapshot.empty) {
            const student = studentSnapshot.docs[0].data();

            const studentId = studentSnapshot.docs[0].id; // Access the document ID
            setStudentData({...student, docId: studentId});
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data: ', error);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleLogout = async () => {
    await Auth().signOut();
    navigation.navigate('RoleScreen');
  };

  const events = [
    {
      id: 1,
      name: 'Science Fair',
      location: 'Auditorium',
      date: '22 May',
      image:
        'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg',
    },
    {
      id: 2,
      name: 'Math Olympiad',
      location: 'Hall B',
      date: '30 May',
      image:
        'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg',
    },
    {
      id: 3,
      name: 'Art Exhibition',
      location: 'Art Gallery',
      date: '4 Jun',
      image:
        'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg',
    },
  ];

  const handleViewTimeTable = async () => {
    try {
      const timetableDoc = await firestore()
        .collection('Timetable')
        .doc('timetableImage')
        .get();
      const TimeTableUrl = timetableDoc.data();
      // console.log('timetable', timetableDoc);
      // console.log('image', subjectSyllabusUrl);

      navigation.navigate('TimeTable', {TimeTableUrl: TimeTableUrl});
    } catch (error) {
      console.error('Error fetching syllabus URL: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />
      {loading && <Spinner />}

      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLogoutModal(true)}>
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <MenuModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onNavigate={handleLogout}
        buttonText="Logout"
      />

      {/* Summary Container */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.shareIcon}>
            <MaterialIcons name="share" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.schoolInfo}>
            <Image
              source={{
                uri:
                  studentData?.profilePicture ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
              }}
              style={styles.schoolLogo}
            />
            <View>
              <Text style={styles.schoolName}>{studentData.name}</Text>
              <Text style={styles.schoolLocation}>
                {studentData.admissionClass} | {studentData.docId}
              </Text>
              <View
                style={[
                  styles.duesStatus,
                  {backgroundColor: isDuesCleared ? 'green' : 'red'},
                ]}>
                <Text style={styles.duesStatusText}>
                  {isDuesCleared ? 'In' : 'Out'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Icons Grid */}
        <Text style={{marginLeft: 20, fontWeight: 'bold', fontSize: 20}}>
          Student Services
        </Text>
        <View style={styles.iconGrid}>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="bank" // Use "bank" for the bank icon
                size={35}
                color="#38598b"
              />
              <Text style={styles.iconText}>Fees</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Syllabus')}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={35}
                  color="#38598b"
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Syllabus</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleViewTimeTable}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={35}
                  color="#38598b"
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Timetable</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <Image source={{uri: event.image}} style={styles.eventImage} />
              <View style={styles.eventDetails}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
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
  },
  headerActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  actionButton: {
    marginLeft: 10,
  },
  summaryContainer: {
    backgroundColor: '#38598b',
    padding: 20,
    margin: 30,
    borderRadius: 10,
    position: 'relative', // Ensure share icon is positioned correctly
  },
  shareIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 20,
    width: 20,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  schoolLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 30,
    marginTop: 20,
    justifyContent: 'center',
  },
  schoolName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  schoolLocation: {
    color: 'white',
    fontSize: 16,
  },
  duesStatus: {
    marginTop: 5,
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: 50,
    borderRadius: 5,
    alignItems: 'center',
  },
  duesStatusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '20%',
    backgroundColor: '#4B6C8B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  summaryText: {
    color: 'white',
    fontSize: 12,
  },
  summaryCount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconGrid: {
    marginTop: 30,
    marginHorizontal: 30,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    width: '25%',
    height: 85,
    padding: 10,
  },
  iconText: {
    color: 'black',
    marginTop: 5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#38598b',
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
    color: 'black',
  },
  eventsContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    position: 'relative', // Add relative positioning for children
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
    position: 'relative', // Add relative positioning for children
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventLocation: {
    fontSize: 14,
    color: '#777',
    position: 'absolute',
    bottom: 5,
    right: 15,
  },
  eventDate: {
    fontSize: 14,
    color: '#777',
    position: 'absolute',
    bottom: 25,
    right: 15,
  },
  scrollContent: {
    paddingBottom: 100, // Ensure the content does not get hidden behind the bottom navigation
  },
});

export default HomeScreen;
