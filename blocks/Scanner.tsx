import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, Button, Text, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import tw from 'tailwind-rn'

const Scanner: React.FC = () => {
  const [url, setUrl] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState<boolean>(false)

  const onSuccess = useCallback((e: BarCodeReadEvent): void => {
    setUrl(e.data)
    setIsScanning(false)
  }, [])

  const handleBackPress = useCallback((): boolean => {
    if (isScanning) {
      setIsScanning(false)

      return true
    } else {
      return false
    }
  }, [isScanning])

  useEffect(function addBackListener() {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => backHandler.remove()
  }, [handleBackPress])

  return (
    <>
      {isScanning ?
        <QRCodeScanner
        onRead={onSuccess}
        cameraProps={{ flashMode: RNCamera.Constants.FlashMode.auto }} />
      :
        <View style={tw('h-full justify-center')}>
          <Button onPress={() => setIsScanning(true)} title="Scan" />
          {url !== null && <Text style={tw('self-center mt-4')}>{url}</Text>}
        </View>
      }
    </>
  )
}

export default Scanner