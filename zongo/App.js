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
import RNCallKeep from 'react-native-callkeep';
import usePushNotification from './src/commonComponents/PushNotification/usePushNotification';
import PushNotification from 'react-native-push-notification';


let persistedStore = persistStore(store)
//REACT NATIVE WEB RTC
window.RTCPeerConnection = window.RTCPeerConnection || RTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || RTCIceCandidate;
window.RTCSessionDescription =
  window.RTCSessionDescription || RTCSessionDescription;
window.MediaStream = window.MediaStream || MediaStream;
window.MediaStreamTrack = window.MediaStreamTrack || MediaStreamTrack;
window.navigator.mediaDevices = window.navigator.mediaDevices || mediaDevices;
window.navigator.getUserMedia =
  window.navigator.getUserMedia || mediaDevices.getUserMedia;

// REACT_NATIVE CALL_KEEP
const options = {
  ios: {
    appName: 'My app name',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    foregroundService: {
      channelId: 'com.zongo',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  }
};

function App() {

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
  showStickyNotification()

    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

  useEffect(() => {
    setupCallKeep();
  }, []);

  const setupCallKeep = async () => {
    try {
      // Request permissions for Android
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      }

      // Initialize CallKeep
      RNCallKeep.setup(options)
        .then((accepted) => console.log('CallKeep setup done', accepted))
        .catch((err) => console.error('CallKeep setup failed', err));

      // RNCallKeep.setAvailable(true);

      // Event listeners for handling call events
      // RNCallKeep.addEventListener('answerCall', onAnswerCall);
      // RNCallKeep.addEventListener('endCall', onEndCall);

      // If you want to display an incoming call UI
      // RNCallKeep.displayIncomingCall('callUUID', 'Caller Name');
    } catch (error) {
      console.error('Error setting up CallKeep', error);
    }
  };

  PushNotification.configure({
    onNotification: function(notification) {
      console.log("NOTIFICATION:", notification);
      // process the notification here
    },
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
      console.log("TOKEN:", token);
    },
  });

  PushNotification.createChannel(
    {
      channelId: "voip-channel", // unique channel ID
      channelName: "VoIP Notifications", // user-visible name
      importance: PushNotification.Importance.HIGH, // Set importance to high
      vibrate: true,
    },
    (created) => {
      if (created) {
        console.log(`Channel created: ${created}`);
      } else {
        console.log("Channel already exists or was not created.");
      }
    }
  );

  const showStickyNotification = () => {
    console.log("1")
    PushNotification.localNotification({
      id: 123, // Unique ID for the notification
    channelId: "voip-channel", // Must match the channel ID you created
    title: "VoIP Service Active ", // Title of the notification
    message: "You are registered for calls.", // Message of the notification
    ongoing: true, // Makes the notification non-removable
    autoCancel: false, // Prevents the notification from being canceled by the user
    priority: "high", // Sets the priority
    visibility: "public", // Makes the notification visible to everyone
    vibrate: true, // Enables vibration
    playSound: false, // Disable sound
    repeatType: 'minute',


    });
  };



  // const onAnswerCall = ({ callUUID }) => {
  //   console.log('Call answered:');
  //   // Add your call answering logic here
  // };

  // const onEndCall = ({ callUUID }) => {
  //   console.log('Call ended:');
  //   // Add your call ending logic here
  // };






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
