import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import logo from './assets/logo.png'
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {

  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted == false){
      alert("É necessário acesso ao Rolo de Câmera!");
      return
    }
    
    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true){
      return;
    }

    if (Platform.OS == 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    }
    else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null })
    }
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`A imagem está disponivel para compartilhar em: ${selectedImage.remoteUri}`)
      return;
    }

    Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri)
  }

  if (selectedImage !== null){
    return (
      <View style={styles.container}>
        <Text style={styles.titleThumb}>Essa é a foto que você carregou</Text>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TouchableOpacity
          onPress={openShareDialogAsync}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Compartilhar essa foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openImagePickerAsync}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Carregar outra foto</Text>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.imgur.com/TkIrScD.png' }} style={styles.logo} />
      <Text style={styles.instrucitons}>
        Para compartilhar uma foto do seu dispositivo com um amigo, pressione o botão abaixo!
      </Text>
      <TouchableOpacity
        onPress={openImagePickerAsync}
        style={styles.button}>
        <Text style={styles.buttonText}>Carregue uma foto</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
    marginBottom: 10
  },
  instrucitons: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15
  },
  button: {
    backgroundColor: '#FF6133',
    padding: 20,
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
  titleThumb: {
    fontSize: 24,
    color: '#888',
    marginBottom: 10
  }
});
