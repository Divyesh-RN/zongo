import { CommonActions } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function push(name, params) {
  navigationRef.current && navigationRef.current.dispatch(StackActions.push(name, params));
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function resetScreen(screenName) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screenName }],
    }),
  );
}

/** Use for Jump to diff tabs after screen reset
 Promise.all([
				resetScreen("Dashboard")
			  ]).then(() => navigate('AllRequest'))
 */
