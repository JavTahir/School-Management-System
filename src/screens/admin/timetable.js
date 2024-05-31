import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

const UploadTimetableScreen = ({navigation}) => {
  const [timetableImage, setTimetableImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setTimetableImage(uri);
      }
    });
  };

  const handleSaveImage = async () => {
    if (!timetableImage) {
      console.error('No image selected');
      return;
    }

    setUploading(true);
    try {
      const filename = timetableImage.substring(
        timetableImage.lastIndexOf('/') + 1,
      );
      const uploadTask = storage()
        .ref(`timetable/${filename}`)
        .putFile(timetableImage);

      uploadTask.on(
        'state_changed',
        snapshot => {
          console.log(
            'Upload is ' +
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +
              '% done',
          );
        },
        error => {
          console.error('Error uploading image:', error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

          await firestore().collection('Timetable').doc('timetableImage').set({
            url: downloadURL,
          });

          console.log('Image uploaded successfully:', downloadURL);
          setUploading(false);
          setTimetableImage(null);
          navigation.goBack();
        },
      );
    } catch (error) {
      console.error('Error saving image:', error);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload Timetable</Text>
        <View style={{width: 24}} />
      </View>

      {/* Upload Container */}
      <View style={styles.uploadContainer}>
        {timetableImage ? (
          <Image source={{uri: timetableImage}} style={styles.image} />
        ) : (
          <TouchableOpacity onPress={handleSelectImage}>
            <MaterialIcons name="file-upload" size={60} color="#104E8B" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, uploading && styles.disabledButton]}
        onPress={handleSaveImage}
        disabled={uploading}>
        <Text style={styles.saveButtonText}>
          {uploading ? 'Uploading...' : 'Save'}
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  uploadContainer: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: '#104E8B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 100, // Adjust marginTop as needed
    marginHorizontal: 50,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadText: {
    marginTop: 10,
    color: '#104E8B',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#104E8B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: 100,
    marginHorizontal: 150,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

export default UploadTimetableScreen;
