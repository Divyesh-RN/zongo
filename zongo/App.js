import React, { useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, useColorScheme } from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import { Log } from './src/commonComponents/Log';
import { DisplayMessage } from './src/commonComponents/AlertManager';
import { getData, storeData } from './src/commonComponents/AsyncManager';
import { FCM_TOKEN, USER_DATA } from './src/constants/ConstantKey';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { WEBSOCKET_URL } from './src/constants/ApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import { navigate, resetScreen } from './src/navigation/RootNavigation';
import { storeUserData } from './src/redux/reducers/userModuleReducer';

let persistedStore = persistStore(store)
window.RTCPeerConnection = window.RTCPeerConnection || RTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || RTCIceCandidate;
window.RTCSessionDescription =
  window.RTCSessionDescription || RTCSessionDescription;
window.MediaStream = window.MediaStream || MediaStream;
window.MediaStreamTrack = window.MediaStreamTrack || MediaStreamTrack;
window.navigator.mediaDevices = window.navigator.mediaDevices || mediaDevices;
window.navigator.getUserMedia =
  window.navigator.getUserMedia || mediaDevices.getUserMedia;

function App() {


  useEffect(() => {
    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      getFcmToken()

    }
    /** Use when Tap on Notification & app is in backgroud state to foreground */
    messaging().onNotificationOpenedApp(remoteMessage => {

      Log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
        'Data Is ',
        remoteMessage.data,
      );

      let data = remoteMessage.data

      setTimeout(() => {
        Log("BACKGROUND STATE TO FOREGROUND STATE")
      }, 3000);

    })

    /** Use when Tap on Notification & app is in Kill state to foreground */
    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          Log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
            'Data Is ',
            remoteMessage.data,
          );
          let data = remoteMessage.data
          setTimeout(() => {
            Log("KILL STATE TO FOREGROUND STATE")
          }, 3000);
        }
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // Handle the background message here.
      Log('Received background message', remoteMessage);
    });

    /** Use when app is in foreground state & display a notification*/
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Log("A new FCM message arrived!" + JSON.stringify(remoteMessage));

      let notification = remoteMessage.notification

      DisplayMessage({
        title: notification.title,
        description: notification.body,
        type: 'success',
        onPress: () => {

          let data = remoteMessage.data
          // navigate("Notification")
        }
      })

    });
    return unsubscribe;

  },)

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {

      Log('Authorization status:', authStatus);

      getFcmToken()

    } else {
      await messaging().requestPermission({
        sound: true,
        alert: true,
        badge: true,
        announcement: true,
      });
    }
  }
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {

      Log(" Firebase Token :", fcmToken);
      storeData(FCM_TOKEN, fcmToken)

    } else {
      Log("Failed", "No token received");
    }
  }

  return (
    <Provider store={store} >
      <PersistGate persistor={persistedStore}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
