/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';


messaging().setBackgroundMessageHandler(
    async remoteMessage => {
        console.log('KILLED STATE NOTIFICATIONS',JSON.stringify(remoteMessage),
        );
    },
);

AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
    // Make your call here

    return Promise.resolve();
});

AppRegistry.registerComponent(appName, () => App);
