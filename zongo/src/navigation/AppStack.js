import { FlatList, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { greenPrimary, light_grey, white } from '@constants/Color';
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
import ForgetPassword from '../screens/AuthScreen/ForgetPassword';
import Communications from '../screens/DashBoardScreen/Communications/Communications';
import ChatScreen from '../screens/MessageScreen/ChatScreen';
import { black, midGreen } from '../constants/Color';
import { MEDIUM, SEMIBOLD } from '../constants/Fonts';
import Contacts from '../screens/DashBoardScreen/Communications/Contacts';
import CallScreen from '../screens/DashBoardScreen/Communications/CallScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { WIDTH } from '../constants/ConstantKey';
import { ic_audio_file, ic_auto_attendant, ic_block_number, ic_business_hour, ic_call_campaigns, ic_dashlets, ic_dnc_list, ic_extension, ic_inbound, ic_ring_group } from '../constants/Images';
import Call from '../screens/DashBoardScreen/Communications/Call';
import ContactInfo from '../screens/DashBoardScreen/Communications/ContactInfo';
import EditExtension from '../screens/DashBoardScreen/Communications/EditExtension';
import Availability from '../screens/DashBoardScreen/Communications/Availability';
import RingGroup from '../screens/DashBoardScreen/RingGroup/RingGroup';
import { navigate } from './RootNavigation';
import RingGroupManage from '../screens/DashBoardScreen/RingGroup/RingGroupManage';
import InBoundNumbers from '../screens/DashBoardScreen/InboundNumbers/InBoundNumbers';
import InBoundNumberManage from '../screens/DashBoardScreen/InboundNumbers/InBoundNumberManage';
import AddNewInboundNumber from '../screens/DashBoardScreen/InboundNumbers/AddNewInBoundNumber';
import AutoAttendant from '../screens/DashBoardScreen/AutoAttendant/AutoAttendant';
import ManageAutoAttendant from '../screens/DashBoardScreen/AutoAttendant/ManageAutoAttendant';
import TimebasedRouting from '../screens/DashBoardScreen/TimebasedRouting/TimebasedRouting';
import ManageTimebasedRouting from '../screens/DashBoardScreen/TimebasedRouting/ManageTimebasedRouting';
import HolidaySpecific from '../screens/DashBoardScreen/TimebasedRouting/HolidaySpecific';
import AudioFiles from '../screens/DashBoardScreen/AudioFIles/AudioFIles';
import ManageAudioFiles from '../screens/DashBoardScreen/AudioFIles/ManageAudioFiles';
import FileTypeList from '../screens/DashBoardScreen/AudioFIles/FIleTypeList';
import BlockNumbers from '../screens/DashBoardScreen/BlockedNumbers/BlockNumbers';
import BlockNumberSetting from '../screens/DashBoardScreen/BlockedNumbers/BlockNumberSetting';
import BulkImport from '../screens/DashBoardScreen/BlockedNumbers/BulkImport';
const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
const { createNativeStackNavigator } = require('@react-navigation/native-stack');

// Create constanst for navigations
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const DATA = [
  {
    id: 1,
    title: 'Dashboard',
    image: ic_dashboard,
  },
  {
    id: 2,
    title: 'Inbound Numbers',
    image: ic_dashboard,
  },
  {
    id: 3,
    title: 'Extensions',
    image: ic_dashboard,
  },
  {
    id: 4,
    title: 'Auto Attendant',
    image: ic_dashboard,
  },
  {
    id: 5,
    title: 'Business Hours',
    image: ic_dashboard,
  },
  {
    id: 6,
    title: 'Audio Files',
    image: ic_dashboard,
  },
  {
    id: 7,
    title: 'Ring Groups',
    image: ic_dashboard,
  },
  {
    id: 8,
    title: 'Call Campaigns',
    image: ic_dashboard,
  },
  {
    id: 9,
    title: 'Blocked Numbers',
    image: ic_dashboard,
  },
  {
    id: 10,
    title: 'DNC List',
    image: ic_dashboard,
  },
  {
    id: 11,
    title: 'Dashlets',
    image: ic_dashboard,
  },
];

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
            height: Platform.OS == 'ios' ? 80 : 55,
            paddingHorizontal: 10
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
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: focused ? white : greenPrimary,
                  width: 65,
                  paddingVertical: 8,
                  flex: 1
                }}>
                <Image
                  style={{ width: size - 5, height: size - 5 }}
                  tintColor={focused ? greenPrimary : white}
                  resizeMode="contain"
                  source={focused ? ic_dashboard : ic_dashboard}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: focused ? greenPrimary : white,
                    fontFamily: SEMIBOLD,
                    marginTop: 3
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
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: focused ? white : greenPrimary,
                  width: 65,
                  paddingVertical: 8,
                  flex: 1
                }}>
                <Image
                  style={{ width: size - 5, height: size - 5 }}
                  tintColor={focused ? greenPrimary : white}
                  resizeMode="contain"
                  source={focused ? ic_message : ic_message}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: focused ? greenPrimary : white,
                    fontFamily: SEMIBOLD,
                    marginTop: 3
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
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: focused ? white : greenPrimary,
                  width: 65,
                  paddingVertical: 8,
                  flex: 1
                }}>
                <Image
                  style={{ width: size - 5, height: size - 5 }}
                  tintColor={focused ? greenPrimary : white}
                  resizeMode="contain"
                  source={focused ? ic_email : ic_email}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: focused ? greenPrimary : white,
                    fontFamily: SEMIBOLD,
                    marginTop: 3
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
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: focused ? white : greenPrimary,
                  width: 65,
                  paddingVertical: 8,
                  flex: 1
                }}>
                <Image
                  style={{ width: size - 5, height: size - 5 }}
                  tintColor={focused ? greenPrimary : white}
                  resizeMode="contain"
                  source={focused ? ic_dialer : ic_dialer}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: focused ? greenPrimary : white,
                    fontFamily: SEMIBOLD,
                    marginTop: 3
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
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: focused ? white : greenPrimary,
                  width: 65,
                  paddingVertical: 8,
                  flex: 1
                }}>
                <Image
                  style={{ width: size - 5, height: size - 5 }}
                  tintColor={focused ? greenPrimary : white}
                  resizeMode="contain"
                  source={focused ? ic_account : ic_account}
                />
                <Text
                  style={{
                    fontSize: FontSize.FS_09,
                    color: focused ? greenPrimary : white,
                    fontFamily: SEMIBOLD,
                    marginTop: 3
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
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Communications" component={Communications} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="CallScreen" component={CallScreen} />
      <Stack.Screen name="Call" component={Call} />
      <Stack.Screen name="ContactInfo" component={ContactInfo} />
      <Stack.Screen name="EditExtension" component={EditExtension} />
      <Stack.Screen name="Availability" component={Availability} />
      <Stack.Screen name="RingGroup" component={RingGroup} />
      <Stack.Screen name="RingGroupManage" component={RingGroupManage} />
      <Stack.Screen name="InBoundNumbers" component={InBoundNumbers} />
      <Stack.Screen name="InBoundNumberManage" component={InBoundNumberManage} />
      <Stack.Screen name="AddNewInboundNumber" component={AddNewInboundNumber} />
      <Stack.Screen name="AutoAttendant" component={AutoAttendant} />
      <Stack.Screen name="ManageAutoAttendant" component={ManageAutoAttendant} />
      <Stack.Screen name="TimebasedRouting" component={TimebasedRouting} />
      <Stack.Screen name="ManageTimebasedRouting" component={ManageTimebasedRouting} />
      <Stack.Screen name="HolidaySpecific" component={HolidaySpecific} />
      <Stack.Screen name="AudioFiles" component={AudioFiles} />
      <Stack.Screen name="FileTypeList" component={FileTypeList} />
      <Stack.Screen name="ManageAudioFiles" component={ManageAudioFiles} />
      <Stack.Screen name="BlockNumbers" component={BlockNumbers} />
      <Stack.Screen name="BlockNumberSetting" component={BlockNumberSetting} />
      <Stack.Screen name="BulkImport" component={BulkImport} />
      <Stack.Screen name="Home" component={HomeTabs} />
    </Stack.Navigator>
  );
}
function CustomDrawerContent({ navigation }) {
  const openScreen = (screenName) => {
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        style={{ paddingTop: "25%" }}
        data={DATA}
        renderItem={({ item }) => {
          let imageSource, url;
          switch (true) {
            case item.title.toLowerCase().includes("dashboard"):
              imageSource = ic_dashboard;
              break;
            case item.title.toLowerCase().includes("inbound"):
              imageSource = ic_inbound;
              url = "InBoundNumbers"
              break;
            case item.title.toLowerCase().includes("extension"):
              imageSource = ic_extension;
              url = "Call"
              break;
            case item.title.toLowerCase().includes("attendant"):
              imageSource = ic_auto_attendant;
              url = "AutoAttendant"
              break;
            case item.title.toLowerCase().includes("business"):
              imageSource = ic_business_hour;
              url = "TimebasedRouting"
              break;
            case item.title.toLowerCase().includes("audio"):
              imageSource = ic_audio_file;
              url = "FileTypeList"
              break;
            case item.title.toLowerCase().includes("ring"):
              imageSource = ic_ring_group;
              url = "RingGroup";
              break;
            case item.title.toLowerCase().includes("campaigns"):
              imageSource = ic_call_campaigns;
              break;
            case item.title.toLowerCase().includes("inbound"):
              imageSource = ic_inbound;
              url = "InBoundNumbers"
              break;
            case item.title.toLowerCase().includes("block"):
              imageSource = ic_block_number;
              url = "BlockNumbers"
              break;
            case item.title.toLowerCase().includes("dnc"):
              imageSource = ic_dnc_list;
              break;
            case item.title.toLowerCase().includes("dashlets"):
              imageSource = ic_dashlets;
              break;
            default:
              imageSource = ic_dashboard;
              break;
          }
          return (
            <TouchableOpacity onPress={() => {
              // navigation.toggleDrawer();
              console.log("url", url)
              if (url) {
                navigate(url)
              }
            }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBlockColor: " rgba(255, 255, 255, 0.25)",
                paddingVertical: 14,
              }}>
              <Image
                style={{ width: 20, height: 20, marginRight: 18 }}
                tintColor={white}
                resizeMode="contain"
                source={imageSource}
              />
              <Text style={{
                fontSize: FontSize.FS_16,
                color: white,
                fontFamily: MEDIUM
              }}>{item.title}</Text>
            </TouchableOpacity>
          )

        }
        }
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        drawerType: Platform.OS == "android" ? "front" : "front",
        swipeEnabled: false,
        drawerStyle: {
          width: Platform.OS == "android" ? WIDTH / 1.7 : WIDTH / 1.7,
          backgroundColor: midGreen,
          position: "absolute"
        }
      }}

      drawerContent={props => <CustomDrawerContent {...props}
      />}>
      <Drawer.Screen name="Homse" component={AppStacks}
        options={{ headerShown: false }} />
      {/* Add other screens you want to include in the drawer */}
    </Drawer.Navigator>
  );
}
// export default AppStacks;
export default MainDrawerNavigator;
