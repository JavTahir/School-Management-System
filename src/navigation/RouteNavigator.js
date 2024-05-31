// Navigation.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './authNavigation';

const RouteNavigation = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  );
};

export default RouteNavigation;
