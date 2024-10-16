import { useEffect, useState, useCallback } from 'react';
import PushNotification, { Importance } from 'react-native-push-notification';
import useNotificationHandler from './NotificationHandler';

const NotifService = (onRegister, onNotification) => {
  const [lastId, setLastId] = useState(0);
  const [lastChannelCounter, setLastChannelCounter] = useState(0);
  const { attachRegister, attachNotification } = useNotificationHandler(); // Use the hook

  // Create default channels on mount
  useEffect(() => {
    createDefaultChannels();

    attachRegister(onRegister);
    attachNotification(onNotification);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber((number) => {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });

    PushNotification.getChannels((channels) => {
      console.log(channels);
    });
  }, [onRegister, onNotification]);

  const createDefaultChannels = useCallback(() => {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (required)
        channelName: `Default channel`, // (required)
        channelDescription: "A default channel", // (optional) default: undefined.
        soundName: "default", // (optional)
        importance: Importance.HIGH, // (optional) default: Importance.HIGH
        vibrate: true, // (optional) default: true
      },
      (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`)
    );

    PushNotification.createChannel(
      {
        channelId: "sound-channel-id", // (required)
        channelName: `Sound channel`, // (required)
        channelDescription: "A sound channel", // (optional)
        soundName: "sample.mp3", // (optional)
        importance: Importance.HIGH, // (optional) default: Importance.HIGH
        vibrate: true, // (optional) default: true
      },
      (created) => console.log(`createChannel 'sound-channel-id' returned '${created}'`)
    );
  }, []);

  const createOrUpdateChannel = useCallback(() => {
    setLastChannelCounter((prevCounter) => prevCounter + 1);
    PushNotification.createChannel(
      {
        channelId: "custom-channel-id", // (required)
        channelName: `Custom channel - Counter: ${lastChannelCounter + 1}`, // (required)
        channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional)
        soundName: "default", // (optional)
        importance: Importance.HIGH, // (optional) default: Importance.HIGH
        vibrate: true, // (optional) default: true
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }, [lastChannelCounter]);

  const popInitialNotification = useCallback(() => {
    PushNotification.popInitialNotification((notification) => {
      console.log('InitialNotification:', notification);
    });
  }, []);

  const localNotif = useCallback((soundName) => {
    setLastId((prevId) => prevId + 1);
    PushNotification.localNotification({
      channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
      ticker: 'My Notification Ticker',
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: 'My big text that will be shown when notification is expanded',
      subText: 'This is a subText',
      color: 'red',
      vibrate: true,
      vibration: 300,
      tag: 'some_tag',
      group: 'group',
      groupSummary: false,
      ongoing: false,
      actions: ['Yes', 'No'],
      invokeApp: true,
      when: null,
      usesChronometer: false,
      timeoutAfter: null,
      category: '',
      subtitle: "My Notification Subtitle",
      id: lastId + 1,
      title: 'Local Notification',
      message: 'My Notification Message',
      userInfo: { screen: 'home' },
      playSound: !!soundName,
      soundName: soundName || 'default',
      number: 10,
    });
  }, [lastId]);

  const scheduleNotif = useCallback((soundName) => {
    setLastId((prevId) => prevId + 1);
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + 30 * 1000),
      channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
      ticker: 'My Notification Ticker',
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: 'My <strong>big text</strong> that will be shown when notification is expanded',
      subText: 'This is a subText',
      color: 'blue',
      vibrate: true,
      vibration: 300,
      tag: 'some_tag',
      group: 'group',
      groupSummary: false,
      ongoing: false,
      actions: ['Yes', 'No'],
      invokeApp: false,
      when: null,
      usesChronometer: false,
      timeoutAfter: null,
      category: '',
      id: lastId + 1,
      title: 'Scheduled Notification',
      message: 'My Notification Message',
      userInfo: { screen: 'home' },
      playSound: !!soundName,
      soundName: soundName || 'default',
      number: 10,
    });
  }, [lastId]);

  const checkPermission = useCallback((cbk) => {
    return PushNotification.checkPermissions(cbk);
  }, []);

  const requestPermissions = useCallback(() => {
    return PushNotification.requestPermissions();
  }, []);

  const cancelNotif = useCallback(() => {
    PushNotification.cancelLocalNotification(lastId);
  }, [lastId]);

  const cancelAll = useCallback(() => {
    PushNotification.cancelAllLocalNotifications();
  }, []);

  const abandonPermissions = useCallback(() => {
    PushNotification.abandonPermissions();
  }, []);

  const getScheduledLocalNotifications = useCallback((callback) => {
    PushNotification.getScheduledLocalNotifications(callback);
  }, []);

  const getDeliveredNotifications = useCallback((callback) => {
    PushNotification.getDeliveredNotifications(callback);
  }, []);

  return {
    createOrUpdateChannel,
    popInitialNotification,
    localNotif,
    scheduleNotif,
    checkPermission,
    requestPermissions,
    cancelNotif,
    cancelAll,
    abandonPermissions,
    getScheduledLocalNotifications,
    getDeliveredNotifications,
  };
};

export default NotifService;
