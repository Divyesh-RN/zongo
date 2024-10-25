/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const MyHeadlessTask = async () => {
  console.log('Receiving HeartBeat!');
  // store.dispatch(setHeartBeat(true));
  // setTimeout(() => {
  //   store.dispatch(setHeartBeat(false));
  // }, 1000);
};
AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);

AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
  // Make your call here
  console.log("name ",name)
  console.log("callUUID ",callUUID)
  console.log("handle ",handle)
  return Promise.resolve();
});

AppRegistry.registerComponent(appName, () => App);
