// Navigation.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/teacher/home';
import MarksScreen from '../screens/teacher/marksheet';
import AddMarksScreen from '../screens/teacher/addMarks';
import ProfileScreen from '../screens/teacher/profile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity, View} from 'react-native';


const TeacherTabs = createStackNavigator();

const RootTeacherNavigation = () => {
  return (
    <TeacherTabs.Navigator initialRouteName="Home">
      <TeacherTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <TeacherTabs.Screen
        name="AddMarks"
        component={AddMarksScreen}
        options={{headerShown: false}}
      />
      <TeacherTabs.Screen
        name="Marksheet"
        component={MarksScreen}
        options={{headerShown: false}}
      />
      <TeacherTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />

      {/* <Stack.Screen
          name="Marksheet"
          component={MarksScreen}
          options={{headerShown: false}}
        />
         */}
    </TeacherTabs.Navigator>
  );
};

export default RootTeacherNavigation;
