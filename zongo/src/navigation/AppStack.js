import { Image, Platform, Text, View } from 'react-native';
import { greenPrimary, light_grey, white} from '@constants/Color';
import { FontSize, REGULAR } from '@constants/Fonts';
import Login from '@screens/AuthScreen/Login';
import Register from '@screens/AuthScreen/Register';
import Splash from '@screens/AuthScreen/Splash';
import DashBoard from '@screens/DashBoardScreen/DashBoard';
import { ic_account, ic_dashboard, ic_dialer, ic_email, ic_message } from '@constants/Images';
import Message from '@screens/MessageScreen/Message';
import Email from '@screens/EmailScreen/Email';
import Dialer from '@screens/DialerScreen/Dialer';
import Account from '@screens/AccountScreen/Account';
const {createBottomTabNavigator} = require('@react-navigation/bottom-tabs');
const {createNativeStackNavigator} = require('@react-navigation/native-stack');

// Create constanst for navigations
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <>
      <Tab.Navigator
        initialRouteName="DashBoard"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: white,
          tabBarInactiveTintColor: light_grey,
          tabBarStyle: {
            backgroundColor: greenPrimary,
            height: Platform.OS == 'ios' ? 70 : 60,
            paddingHorizontal:10
          },
          tabBarLabelStyle: {
            fontFamily: REGULAR,
            fontSize: FontSize.FS_11,
            color: white,
          },
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name={'DashBoard'}
          component={DashBoard}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: Platform.OS == 'ios' ? 10 : 0,
                }}>
                <Image
                style={{width: size - 5, height: size -5}}
                  tintColor={color}
                  resizeMode="contain"
                  source={focused ? ic_dashboard : ic_dashboard}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: white,
                    fontFamily: REGULAR,
                    marginTop:3
                  }}>
                  Dashboard
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={'Message'}
          component={Message}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: Platform.OS == 'ios' ? 10 : 0,
                }}>
                <Image
               style={{width: size - 5, height: size -5}}
                  tintColor={color}
                  resizeMode="contain"
                  source={focused ? ic_message : ic_message}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: white,
                    fontFamily: REGULAR,
                    marginTop:3
                  }}>
                  Message
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name={'Email'}
          component={Email}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: Platform.OS == 'ios' ? 10 : 0,
                }}>
                <Image
               style={{width: size - 5, height: size -5}}
                  tintColor={color}
                  resizeMode="contain"
                  source={focused ? ic_email : ic_email}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: white,
                    fontFamily: REGULAR,
                    marginTop:3
                  }}>
                  Email
                </Text>
              </View>
            ),
          }}
        />
         <Tab.Screen
          name={'Dialer'}
          component={Dialer}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: Platform.OS == 'ios' ? 10 : 0,
                }}>
                <Image
                  style={{width: size - 5, height: size -5}}
                  tintColor={color}
                  resizeMode="contain"
                  source={focused ? ic_dialer : ic_dialer}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: white,
                    fontFamily: REGULAR,
                    marginTop:3
                  }}>
                  Dialer
                </Text>
              </View>
            ),
          }}
        />
           <Tab.Screen
          name={'Account'}
          component={Account}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: Platform.OS == 'ios' ? 10 : 0,
                }}>
                <Image
                  style={{width: size - 5, height: size -5}}
                  tintColor={color}
                  resizeMode="contain"
                  source={focused ? ic_account : ic_account}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: white,
                    fontFamily: REGULAR,
                  }}>
                  Account
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

function AppStacks() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gesturesEnabled: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={HomeTabs} />
    </Stack.Navigator>
  );
}

export default AppStacks;
