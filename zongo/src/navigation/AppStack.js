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
import DncLists from '../screens/DashBoardScreen/DncList/DncList';
import DncBulkImport from '../screens/DashBoardScreen/DncList/DncBulkImport';
import Users from '../screens/DashBoardScreen/Users/Users';
import ManageUser from '../screens/DashBoardScreen/Users/ManageUser';
import UserAvaliability from '../screens/DashBoardScreen/Users/UserAvaliability';
import UserE911 from '../screens/DashBoardScreen/Users/UserE911';
import ContactInformation from '../screens/AuthScreen/ContactInformation';
import InComingCallScreen from './incomingRoot/inComingCallScreen';
import { useSelector } from 'react-redux';
import Error from '../screens/DashBoardScreen/Error/Error';
import { user_data } from '../redux/reducers/userReducer';
import SideMenuModuleCheck from '../commonComponents/RolePermission/SideMenuModuleCheck';
import Crm from '../screens/DashBoardScreen/Crm/Crm';
import Calendar from '../screens/DashBoardScreen/Calender/Calendar';
import { AppProvider, useAppContext } from '../commonComponents/Context/AppContext';
import { COMMUNICATIONS } from '../constants/DATA/DrawerData';
import InternalChat from '../screens/DashBoardScreen/InternalChat/InternalChat';
import UserChatLog from '../screens/DashBoardScreen/InternalChat/UserChatLog';
import GroupChatLog from '../screens/DashBoardScreen/InternalChat/GroupChatLog';
import GroupInfo from '../screens/DashBoardScreen/InternalChat/GroupInfo';

const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
const { createNativeStackNavigator } = require('@react-navigation/native-stack');

// Create constanst for navigations
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//bottom tab 
function HomeTabs() {
  var DialerStatus = true;
  var CommunicationsStatus = true;
  var EmailStatus = true;
  var MessageStatus = true;
  var AccountStatus = true;

  const user_data = useSelector(state => state.userRedux.user_data);
  const userRole = user_data?.data?.role;
  const permission = user_data?.data?.role_permission
  const tab = user_data?.data?.tab_per
  if (user_data !== null && userRole !== "admin" ) {
    DialerStatus = tab?.find(tab => tab.tab_name === "Web Phone" && tab.status === "enable");
    CommunicationsStatus = tab?.find(tab => tab.tab_name === "Commumication" && tab.status === "enable");
    EmailStatus = permission?.find(permission => permission.slug === "email" && permission.status === "enable");
    MessageStatus = permission?.find(permission => permission.slug === "chat-sms" && permission.status === "enable");
  }

  const tabs = [
    { name: 'DashBoard', component: DashBoard, icon: ic_dashboard, label: 'Dashboard' },
    { name: 'Message', component: Message, icon: ic_message, label: 'Message' },
    { name: 'Email', component: Email, icon: ic_email, label: 'Email' },
    { name: 'Dialer', component: Dialer, icon: ic_dialer, label: 'Dialer' },
    { name: 'Account', component: Account, icon: ic_account, label: 'Account' },
  ];
  const filteredTabs = tabs.filter(tab => {
    if (userRole !== "admin" || userRole !== "superadmin") {
      if (tab.name === "Dialer" && DialerStatus?.status == "disable") {
        return false;
      }
      if (tab.name === "Email" && EmailStatus?.status == "disable") {
        return false;
      }
      if (tab.name === "Account" && AccountStatus == false) {
        return false;
      }
      if (CommunicationsStatus?.status == "disable" && tab.name === "Message" && MessageStatus?.status == "enable") {
        return false
      }
      if (tab.name === "Message" && MessageStatus?.status == "disable") {
        return false;
      }
    }
    return true;
  });

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
            paddingHorizontal: 10,
          },
          tabBarLabelStyle: {
            fontFamily: REGULAR,
            fontSize: FontSize.FS_11,
            color: white,
          },
          tabBarHideOnKeyboard: true,
        }}>
        {filteredTabs.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: focused ? white : greenPrimary,
                    width: 65,
                    paddingVertical: 8,
                    flex: 1,
                  }}>
                  <Image
                    style={{ width: size - 5, height: size - 5 }}
                    tintColor={focused ? greenPrimary : white}
                    resizeMode="contain"
                    source={focused ? tab.icon : tab.icon}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.FS_09,
                      color: focused ? greenPrimary : white,
                      fontFamily: SEMIBOLD,
                      marginTop: 3,
                    }}>
                    {tab.label}
                  </Text>
                </View>
              ),
            }}
          />
        ))}
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
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ContactInformation" component={ContactInformation} />
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
      <Stack.Screen name="DncLists" component={DncLists} />
      <Stack.Screen name="DncBulkImport" component={DncBulkImport} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="ManageUser" component={ManageUser} />
      <Stack.Screen name="UserAvaliability" component={UserAvaliability} />
      <Stack.Screen name="UserE911" component={UserE911} />
      <Stack.Screen name="InComingCallScreen" component={InComingCallScreen} />
      <Stack.Screen name="Error" component={Error} />
      <Stack.Screen name="Crm" component={Crm} />
      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="InternalChat" component={InternalChat} />
      <Stack.Screen name="UserChatLog" component={UserChatLog} />
      <Stack.Screen name="GroupChatLog" component={GroupChatLog} />
      <Stack.Screen name="GroupInfo" component={GroupInfo} />
    </Stack.Navigator>
  );
}



function CustomDrawerContent({ navigation }) {

  const user_data = useSelector(state => state.userRedux.user_data);
  const { activeArray } = useAppContext();
  return (
    <View style={{ marginHorizontal: 20, paddingVertical: 20 }}>
      <FlatList
        style={{ paddingTop: "25%" }}
        data={activeArray}
        renderItem={({ item }) => {
          var permission = "";
          permission = SideMenuModuleCheck(item?.name, user_data);
          let imageSource, url, name;
          switch (true) {
            case item.title.toLowerCase().includes("inbound"):
              imageSource = ic_inbound;
              url = "InBoundNumbers";
              name = item.title;
              break;
            case item.title.toLowerCase().includes("extension"):
              imageSource = ic_extension;
              url = "Call";
              name = item.title
              break;
            case item.title.toLowerCase().includes("attendant"):
              imageSource = ic_auto_attendant;
              url = "AutoAttendant";
              name = item.title
              break;
            case item.title.toLowerCase().includes("business"):
              imageSource = ic_business_hour;
              url = "TimebasedRouting";
              name = item.title
              break;
            case item.title.toLowerCase().includes("audio"):
              imageSource = ic_audio_file;
              url = "FileTypeList";
              name = item.title
              break;
            case item.title.toLowerCase().includes("ring"):
              imageSource = ic_ring_group;
              url = "RingGroup";;
              name = item.title
              break;
            case item.title.toLowerCase().includes("inbound"):
              imageSource = ic_inbound;
              url = "InBoundNumbers";
              name = item.title
              break;
            case item.title.toLowerCase().includes("block"):
              imageSource = ic_block_number;
              url = "BlockNumbers";
              name = item.title
              break;
            case item.title.toLowerCase().includes("dnc"):
              imageSource = ic_dnc_list;
              url = "DncLists";
              name = item.title
              break;
            case item.title.toLowerCase().includes("dashlets"):
              imageSource = ic_dashlets;
              name = item.title
              break;
            case item.title.toLowerCase().includes("users"):
              imageSource = ic_dashlets;
              url = "Users";
              name = item.title
              break;
            default:
              imageSource = ic_dashboard;
              name = item.title
              break;
          }
          if (permission !== "hidden") {
            return (
              <TouchableOpacity onPress={() => {
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
                }}>{name}</Text>
              </TouchableOpacity>
            )
          }
          else {
            return null;
          }
        }
        }
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function MainDrawerNavigator() {
  return (
    <AppProvider>
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
        <Drawer.Screen name="Homes" component={AppStacks}
          options={{ headerShown: false }}
        />

      </Drawer.Navigator>
    </AppProvider>
  );
}
export default MainDrawerNavigator;
