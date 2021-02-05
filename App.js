import React, { useState } from 'react';
import * as ImagePicker from 'react-native-image-picker';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

const App = () => {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [fileUri, setFileUri] = useState(null);


  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        setImage(source);
        setFileUri(response.uri)

      }
    });

  }

  const uploadImage = async () => {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    setImage(null);
  };

  return (
    <SafeAreaView>
      <View style={styles.body}>
        <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} >Pick Images from Camera & Gallery</Text>

        <View style={styles.btnParentSection}>
          <TouchableOpacity onPress={launchImageLibrary} style={styles.btnSection}  >
            <Text style={styles.btnText}>Directly Launch Image Library</Text>
          </TouchableOpacity>
        </View>
        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
          <View style={styles.buttonCont}>
            <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
              <Text style={styles.buttonText} numberOfLines={1}>Upload image</Text>
            </TouchableOpacity>
            </View>
          )}
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },

  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold'
  },
  btnParentSection: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton:{
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
  },
  buttonCont:{
    alignItems: 'center',
  },
  buttonText:{
    color: 'white',
    fontSize: 18,
  },
  progressBarContainer:{
    alignItems: 'center',
  }
});

export default App;