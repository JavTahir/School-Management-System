// Navigation.js
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import HomeScreen from '../screens/admin/home';
import Report1 from '../screens/admin/report1';
import Report2 from '../screens/admin/report2';
import ProfileScreen from '../screens/admin/profile';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ClientTabs = createStackNavigator();

const RootClientTabs = () => {
  return (
    <ClientTabs.Navigator initialRouteName="SignUp">
      <ClientTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}></ClientTabs.Screen>
      <ClientTabs.Screen
        name="Report1"
        component={Report1}
        options={{headerShown: false}}
      />
      <ClientTabs.Screen
        name="Report2"
        component={Report2}
        options={{headerShown: false}}
      />
      <ClientTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </ClientTabs.Navigator>
  );
};

export default RootClientTabs;
