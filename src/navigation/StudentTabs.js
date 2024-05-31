// Navigation.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/student/home';
import MarksScreen from '../screens/student/marksheet';
import ProfileScreen from '../screens/student/profile';
import SyllabusScreen from '../screens/student/syllabus';
import SyllabusDetailsScreen from '../screens/student/syllabusDetails';
import TimetableScreen from '../screens/student/timetable';

const StudentTabs = createStackNavigator();

const RootStudentNavigation = ({route}) => {
  const {role, registrationNumber, studentData} = route.params || {};

  return (
    <StudentTabs.Navigator initialRouteName="Home">
      <StudentTabs.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{role, registrationNumber, studentData}}
        options={{
          headerShown: false,
        }}
      />
      <StudentTabs.Screen
        name="Marksheet"
        component={MarksScreen}
        options={{headerShown: false}}
      />
      <StudentTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <StudentTabs.Screen
        name="Syllabus"
        component={SyllabusScreen}
        options={{headerShown: false}}
      />
      <StudentTabs.Screen
        name="SyllabusDetails"
        component={SyllabusDetailsScreen}
        options={{headerShown: false}}
      />
      <StudentTabs.Screen
        name="TimeTable"
        component={TimetableScreen}
        options={{headerShown: false}}
      />
    </StudentTabs.Navigator>
  );
};

export default RootStudentNavigation;
