import React, {useState, useEffect, useContext} from 'react';
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
import BottomNav from '../../components/BottomNavStudent'; // Adjust the import path
import SubjectModal from '../../components/SubjectModal'; // Adjust the import path
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../context/authContext';
import Spinner from '../../components/Spinner';
import {Social} from 'react-native-share';
import MenuModal from '../../components/MenuModal';
import Auth from '@react-native-firebase/auth';

const HomeScreen = ({navigation}) => {
  // const params = route.params || {};
  const {user} = useContext(AuthContext);

  // const {uid} = user;

  const [modalVisible, setModalVisible] = useState(false);
  const [teacher, setTeacher] = useState('');
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [events, setEvents] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const eventUrl =
    'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventList = [];
        const snapshot = await firestore().collection('events').get();
        snapshot.forEach(doc => {
          eventList.push({...doc.data(), id: doc.id});
        });
        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        if (user) {
          const {uid} = user;
          const teacherDoc = await firestore()
            .collection('Teachers')
            .doc(uid)
            .get();

          if (teacherDoc.exists) {
            const teacherData = teacherDoc.data();
            setTeacher(teacherData);

            const classDoc = await firestore()
              .collection('Classes')
              .doc(teacherData.assignedClass)
              .get();

            if (classDoc.exists) {
              const classData = classDoc.data();
              setSubjects(classData.subjects);
            }
          } else {
            console.log('Teacher not found');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, [user]);

  const handleLogout = async () => {
    await Auth().signOut();
    navigation.navigate('RoleScreen');
  };

  // const events = [
  //   {
  //     id: 1,
  //     name: 'Science Fair',
  //     location: 'Auditorium',
  //     date: '22 May',
  //     image:
  //       'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg',
  //   },
  //   {
  //     id: 2,
  //     name: 'Math Olympiad',
  //     location: 'Hall B',
  //     date: '30 May',
  //     image:
  //       'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg',
  //   },
  //   {
  //     id: 3,
  //     name: 'Art Exhibition',
  //     location: 'Art Gallery',
  //     date: '4 Jun',
  //     image:
  //       'https://png.pngtree.com/png-clipart/20200908/ourmid/pngtree-creative-design-cartoon-emoji-package-event-png-image_2335507.jpg',
  //   },
  // ];

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

  const handleSubjectPress = subject => {
    setSelectedSubject(subject);
    setModalVisible(true);
  };

  const handleAddMarks = subject => {
    setModalVisible(false);
    navigation.navigate('AddMarks', {subject});
  };

  // const handleUpdateMarks = subject => {
  //   setModalVisible(false);
  //   navigation.navigate('AddMarks', {subject});
  // };

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
                uri: 'https://img.freepik.com/free-photo/close-up-beautiful-woman-smiling_23-2148369437.jpg',
              }} // Replace with your school logo URL
              style={styles.schoolLogo}
            />
            <View>
              <Text style={styles.schoolName}>{teacher.name}</Text>
              <Text style={styles.schoolLocation}>{teacher.occupation}</Text>
              <View style={styles.duesStatus}>
                <Text style={styles.duesStatusText}>
                  {teacher.assignedClass}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Icons Grid */}
        <Text style={{marginLeft: 20, fontWeight: 'bold', fontSize: 20}}>
          All Subjects
        </Text>
        <View style={styles.iconGrid}>
          <View style={styles.iconRow}>
            {subjects.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconContainer}
                onPress={() => handleSubjectPress(subject)}>
                <Image
                  source={subjectIcons[subject]}
                  style={styles.subjectImage}
                />
                <Text style={styles.iconText}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <Image source={{uri: eventUrl}} style={styles.eventImage} />
              <View style={styles.eventDetails}>
                <Text style={styles.eventName}>{event.eventName}</Text>
                <Text style={styles.eventLocation}>{event.eventLocation}</Text>
              </View>
              <Text style={styles.eventDate}>{event.eventDate}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modal */}
      <SubjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddMarks={() => handleAddMarks(selectedSubject)}
        // onUpdateMarks={handleUpdateMarks}
      />
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
    width: 70,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'green',
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
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'start',
  },
  iconContainer: {
    alignItems: 'center',
    width: '29%',
    height: 85,
  },
  subjectImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  iconText: {
    color: 'black',
    marginTop: 5,
    fontSize: 12,
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
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventLocation: {
    fontSize: 14,
    color: '#777',
  },
  eventDate: {
    fontSize: 14,
    color: '#777',
    position: 'absolute',
    top: 15,
    right: 15,
  },
  scrollContent: {
    paddingBottom: 100, // Ensure the content does not get hidden behind the bottom navigation
  },
});

export default HomeScreen;
