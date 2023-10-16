import React from 'react';
import { navigationRef } from './RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import InitialFlow from './AppStack';


function AppNavigator({}) {
	return (
		<NavigationContainer ref={navigationRef} >
			<InitialFlow />
		</NavigationContainer>
	)
}

export default AppNavigator;