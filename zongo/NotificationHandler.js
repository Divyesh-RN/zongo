import { useEffect, useRef } from 'react';
import PushNotification from 'react-native-push-notification';

const useNotificationHandler = () => {
  const onNotificationRef = useRef(null);
  const onRegisterRef = useRef(null);

  const onNotification = (notification) => {
    console.log('NotificationHandler:', notification);
    if (typeof onNotificationRef.current === 'function') {
      onNotificationRef.current(notification);
    }
  };

  const onRegister = (token) => {
    console.log('NotificationHandler:', token);
    if (typeof onRegisterRef.current === 'function') {
      onRegisterRef.current(token);
    }
  };

  const onAction = (notification) => {
    console.log('Notification action received:');
    console.log(notification.action);
    console.log(notification);

    if (notification.action === 'Yes') {
      PushNotification.invokeApp(notification);
    }
  };

  const onRegistrationError = (err) => {
    console.log(err);
  };

  const attachRegister = (handler) => {
    onRegisterRef.current = handler;
  };

  const attachNotification = (handler) => {
    onNotificationRef.current = handler;
  };

  useEffect(() => {
    PushNotification.configure({
      onRegister: onRegister,
      onNotification: onNotification,
      onAction: onAction,
      onRegistrationError: onRegistrationError,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return { attachRegister, attachNotification };
};

export default useNotificationHandler;
