import React, { useEffect } from 'react';
import { navigationRef } from './RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import InitialFlow from './AppStack';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import FlashMessage from 'react-native-flash-message';
import Incoming from './incomingRoot/incoming';
import Global from '../constants/Global';
import { Log } from '../commonComponents/Log';

function AppNavigator({}) {
	
	return (
		<NavigationContainer ref={navigationRef} >
			<AlertNotificationRoot>
			<InitialFlow />
		 	<Incoming/>
			<FlashMessage position="top" />
			</AlertNotificationRoot>

		</NavigationContainer>
	)
}

export default AppNavigator;





// # Resolve react_native_pods.rb with node to allow for hoisting
// $RNFirebaseAsStaticFramework = true

// require Pod::Executable.execute_command('node', ['-p',
//   'require.resolve(
//     "react-native/scripts/react_native_pods.rb",
//     {paths: [process.argv[1]]},
//   )', __dir__]).strip

// platform :ios, min_ios_version_supported
// prepare_react_native_project!

// # If you are using a `react-native-flipper` your iOS build will fail when `NO_FLIPPER=1` is set.
// # because `react-native-flipper` depends on (FlipperKit,...) that will be excluded
// #
// # To fix this you can also exclude `react-native-flipper` using a `react-native.config.js`
// # ```js
// # module.exports = {
// #   dependencies: {
// #     ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {}),
// # ```
// flipper_config = ENV['NO_FLIPPER'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled

// linkage = ENV['USE_FRAMEWORKS']
// if linkage != nil
//   Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
//   use_frameworks! :linkage => linkage.to_sym
// end
// pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
// target 'zongo' do
//   config = use_native_modules!
//   use_frameworks! :linkage => :static
//   # Flags change depending on the env values.
//   flags = get_default_flags()

//   use_react_native!(
//     :path => config[:reactNativePath],
//     # Hermes is now enabled by default. Disable by setting this flag to false.
//     :hermes_enabled => flags[:hermes_enabled],
//     :fabric_enabled => flags[:fabric_enabled],
//     # Enables Flipper.
//     #
//     # Note that if you have use_frameworks! enabled, Flipper will not work and
//     # you should disable the next line.
//    # :flipper_configuration => flipper_config,
//     # An absolute path to your application root.
//     :app_path => "#{Pod::Config.instance.installation_root}/.."
//   )

//   target 'zongoTests' do
//     inherit! :complete
//     # Pods for testing
//   end

//   post_install do |installer|
    
//     # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
//     react_native_post_install(
//       installer,
//       config[:reactNativePath],
//       :mac_catalyst_enabled => false
//     )
//     __apply_Xcode_12_5_M1_post_install_workaround(installer)
//   end
// end
