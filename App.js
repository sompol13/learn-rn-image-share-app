import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import logo from './assets/logo.png'
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import ReuseableButton from './components/ReuseableButton'

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!")
    }
    
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      console.log(remoteUri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: remoteUri })
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  }

  let openShareDialogAsync = async () => {
    if (!await Sharing.isAvailableAsync()) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }

  const handleClickUnpickButton = () => {
    setSelectedImage(null);
  }

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <ReuseableButton onPress={openShareDialogAsync} label="Share this photo"/>
        <ReuseableButton onPress={handleClickUnpickButton} label="Unpick this photo" style={{ backgroundColor: '#cd5d7d' }} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.imgur.com/TkIrScD.png' }} style={styles.logo} />

      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!
      </Text>

      <ReuseableButton onPress={openImagePickerAsync} label="Pick a photo" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  }
});
