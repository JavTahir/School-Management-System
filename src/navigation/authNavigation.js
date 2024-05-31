// Navigation.js
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import SignUpScreen from '../screens/authScreens/signup';
import LoginScreen from '../screens/authScreens/login';
import RootClientTabs from './ClientTabs';
import StudentScreen from '../screens/admin/students';
import TeacherScreen from '../screens/admin/teachers';
import StudentForm from '../screens/admin/studentForm';
import RoleSelectionScreen from '../screens/roles';
import RootStudentNavigation from './StudentTabs';
import RootTeacherNavigation from './TeacherTabs';
import TeacherForm from '../screens/admin/TeacherForm';
import UploadSyllabusScreen from '../screens/admin/syllabus';
import UploadTimetableScreen from '../screens/admin/timetable';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="RoleScreen">
      <Stack.Screen
        name="RoleScreen"
        component={RoleSelectionScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>

      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="RootClientTabs"
        component={RootClientTabs}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="RootStudentNavigation"
        component={RootStudentNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RootTeacherNavigation"
        component={RootTeacherNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StudentsScreen"
        component={StudentScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="TeacherScreen"
        component={TeacherScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="StudentForm"
        component={StudentForm}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="TeacherForm"
        component={TeacherForm}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="Syllabus"
        component={UploadSyllabusScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="TimeTable"
        component={UploadTimetableScreen}
        options={{
          headerShown: false,
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigation;
