import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View, Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
// @ts-expect-error
import MLKitOcr from 'react-native-mlkit-ocr'

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;

const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (text !== null) {
      console.log(text)
    }
  }, [text])

  const recognizeTextFromImage = async (path: string, isFile = false) => {
    setIsLoading(true);

    try {
      const detectionObjs: { text: string }[] = isFile ? await MLKitOcr.detectFromFile(path) : await MLKitOcr.detectFromUri(path)
      if (detectionObjs.length !== 0) {
        const totalStr = detectionObjs.map(obj => obj.text).join(' ')
        setText(totalStr)
      } else {
        console.warn('No text detected')
        setText(null)
      }
    } catch (err) {
      console.error(err);
      setText(null);
    }

    setIsLoading(false);
  };

  const recognizeFromCamera = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openCamera(options);
      setImgSrc(image.path);
      await recognizeTextFromImage(image.path);
    } catch (err: any) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tesseract OCR example</Text>
      <Text style={styles.instructions}>Select an image source:</Text>
      <View style={styles.options}>
        <View style={styles.button}>
          <Button
            disabled={isLoading}
            title="Camera"
            onPress={() => {
              recognizeFromCamera();
            }}
          />
        </View>
      </View>
      {imgSrc && (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: imgSrc}} />
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <Text>{text}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginVertical: 15,
    height: DEFAULT_HEIGHT / 2.5,
    width: DEFAULT_WITH / 2.5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;