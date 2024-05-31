// HomeScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNav from '../../components/BottomNav'; // Adjust the import path
import Auth from '@react-native-firebase/auth';
import {StackActions} from '@react-navigation/native';
import MenuModal from '../../components/MenuModal';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [events, setEvents] = useState([]);
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#104E8B" barStyle="light-content" />
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
          <View style={styles.schoolInfo}>
            <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/551/211/png-transparent-education-logo-pre-school-others-text-logo-business-thumbnail.png',
              }} // Replace with your school logo URL
              style={styles.schoolLogo}
            />
            <View>
              <Text style={styles.schoolName}>Punjab School</Text>
              <Text style={styles.schoolLocation}>
                Location: Lahore, Pakistan
              </Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>100</Text>
              <Text style={styles.summaryText}>Teachers</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>1500</Text>
              <Text style={styles.summaryText}>Students</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>10</Text>
              <Text style={styles.summaryText}>Deps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>50</Text>
              <Text style={styles.summaryText}>Staff</Text>
            </View>
          </View>
        </View>

        {/* Icons Grid */}
        <View style={styles.iconGrid}>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('StudentsScreen')}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={35}
                  color="#38598b"
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Students</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TeacherScreen')}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={35}
                  color="#38598b"
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Teachers</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TimeTable')}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={35}
                  color="#38598b"
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Timetable</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Syllabus')}>
                <MaterialCommunityIcons
                  name="book-open-outline"
                  size={35}
                  color="#38598b"
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Syllabus</Text>
            </View>
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
  menuButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    margin: 10,
    borderRadius: 10,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  schoolLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
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
    marginTop: 40,
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
