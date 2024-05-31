// Navigation.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/admin/home';
import Report1Screen from './screens/admin/report1';
import Report2Screen from './screens/admin/report2';
import ProfileScreen from './screens/admin/profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity, View} from 'react-native';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#104E8B', // Change background color to blue
          },
          headerTintColor: 'white', // Change header title color to white
          headerTitleStyle: {
            fontWeight: 'bold', // You can customize more styles here
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({navigation}) => ({
            title: 'Home',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  // Handle menu action
                }}
                style={{marginLeft: 10}}>
                <MaterialIcons name="menu" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={() => {
                    // Handle notifications action
                  }}>
                  <MaterialIcons name="notifications" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={() => {
                    // Handle settings action
                  }}>
                  <MaterialIcons name="settings" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Report1"
          component={Report1Screen}
          options={({navigation}) => ({
            title: 'Report 1',
            headerRight: () => (
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  // Handle download action for Report 1
                }}>
                <MaterialCommunityIcons
                  name="download"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Report2"
          component={Report2Screen}
          options={({navigation}) => ({
            title: 'Report 2',
            headerRight: () => (
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  // Handle download action for Report 2
                }}>
                <MaterialCommunityIcons
                  name="download"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
