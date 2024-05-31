// BottomNav.js
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReportOptionsModal from './optionsModal';
import {useNavigation} from '@react-navigation/native';

const BottomNav = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleReportPress = () => {
    setModalVisible(true);
  };

  const handleOptionSelect = option => {
    // Handle option selection here
    console.log('Selected Option:', option);
    setModalVisible(false);

    if (option === 'Students age record') {
      navigation.navigate('Report1');
    } else if (option === 'Marksheet') {
      navigation.navigate('Report2');
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}>
        <MaterialCommunityIcons name="home-outline" size={24} color="#38598b" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={handleReportPress}>
        <MaterialCommunityIcons
          name="chart-box-outline"
          size={24}
          color="#38598b"
        />
        <Text style={styles.navText}>Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}>
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color="#38598b"
        />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>

      {/* Report Options Modal */}
      <ReportOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectOption={handleOptionSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',

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
});

export default BottomNav;
