import { Text, Image, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../commonComponents/HeaderBackView';
import CustomBottomSheet from '../../commonComponents/CustomBottomSheet';
import { ic_calender, ic_communication, ic_crm } from '../../constants/Images';
import { black, white } from '../../constants/Color';
import { FontSize, SEMIBOLD } from '../../constants/Fonts';
import { navigate } from '../../navigation/RootNavigation';
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import RegisterAccount from '../DialerScreen/Component/RegisterAccount';
import { useFocusEffect } from '@react-navigation/native';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Get_User_Extension } from '../../redux/api/Api';
import LoadingView from '../../commonComponents/LoadingView';
import DeviceInfo from 'react-native-device-info';
import { useAppContext } from '../../commonComponents/Context/AppContext';
import { CALENDAR, COMMUNICATIONS, CRM } from '../../constants/DATA/DrawerData';
import Global from '../../constants/Global';
// import WebSocket from 'ws';


const DashBoard = ({ navigation }) => {

  const dispatch = useDispatch();

  const [IsLoading, setIsLoading] = useState(false);
  const [UserData, setUserData] = useState(null);
  const [RegisterData, setRegisterData] = useState(null);
  const [DisplayName, setDisplayName] = useState(user_data?.data?.first_name || "");
  const [PrivateIdentity, setPrivateIdentity] = useState(user_data?.data?.extension || "");
  const [PublicIdentity, setPublicIdentity] = useState(`sip:${user_data?.data?.extension}@xTce64tEYZ` || "");
  const [Password, setPassword] = useState(user_data?.data?.extension_password || '9656091');
  const [Realm, setRealm] = useState('23.239.18.15:5062');
  const [WebsoketUrl, setWebsoketUrl] = useState('wss://zongopbx.com:7443');

  const bottomSheetRef = useRef(null);
  const user_data = useSelector(state => state.userRedux.user_data);
  const user_extension_data = useSelector(state => state.userRedux.user_extension_data);
  const apiGetUserExtension = useSelector(state => state.userRedux.apiGetUserExtension);
  const isLoading = useSelector(state => state.userRedux.isLoader);
  const isError = useSelector(state => state.userRedux.isError);
  const error_message = useSelector(state => state.userRedux.error_message);
  const tab = user_data?.data?.tab_per
  const CommunicationsStatus = tab?.find(tab => tab.tab_name === "Commumication" && tab.status === "enable");
  const CrmStatus = tab?.find(tab => tab.tab_name === "Contact Management" && tab.status === "enable");
  const CalandarStatus = tab?.find(tab => tab.tab_name === "Calendar" && tab.status === "enable");

  useFocusEffect(
    useCallback(() => {
      requestPermissions()
      Log('apiGetUserExtension :', apiGetUserExtension);
      if (apiGetUserExtension == STATUS_FULFILLED) {
        if (user_extension_data !== null) {
          Log("GET USER EXTENSION DATA", user_extension_data.data[0])
          DeviceInfo.getIpAddress().then((ip) => {
            console.log("IpAddress", ip)
            setDisplayName(user_data?.data?.first_name)
            setPrivateIdentity(user_extension_data.data[0]?.extension)
            setPublicIdentity(`sip:${user_extension_data?.data[0]?.extension}@${user_extension_data?.data[0]?.domain_name}`)
            setPassword(user_extension_data?.data[0]?.extension_password)
            var dict = {};
            (dict.displayName = user_data?.data?.first_name),
              (dict.PrivateIdentity = user_extension_data.data[0]?.extension),
              (dict.PublicIdentity = `sip:${user_extension_data?.data[0]?.extension}@${user_extension_data?.data[0]?.domain_name}`),
              (dict.Password = user_extension_data?.data[0]?.extension_password),
              // (dict.Password = user_extension_data?.data[0]?.extension_password == " " ? "9656091":user_extension_data?.data[0]?.extension_password),
              // (dict.Password = "9656091"),
              (dict.Realm = Platform.OS == "android" ? Realm : Realm),
              (dict.WebsoketUrl = WebsoketUrl)
            Log("REGISTER SIP DICT DASHBOARD  :", dict)
            setRegisterData(dict)
          });


        }
      } else if (apiGetUserExtension == STATUS_REJECTED) {
        if (isError) {
          Alert.alert('Alert', error_message);
        }
      }
    }, [apiGetUserExtension])
  );

  useFocusEffect(
    useCallback(() => {
      if (user_data !== null) {
        var dict = {};
        dict.user_uuid = user_data?.data?.user_uuid,
          dict.createdby = user_data?.data?.user_uuid
        dispatch(Get_User_Extension(dict));
      }
    }, [])
  );


  

  const Loading = val => {
    setIsLoading(val);
  };

  const requestPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      PermissionsAndroid.requestMultiple(permissions)
        .then(granted => {
          console.log("granted", granted)
          if (
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED

          ) {
            console.log('User accepted all  permissions');
          } else {
            console.log('One or more permissions were denied');
            // requestPermissions()
          }
        })
        .catch(err => {
          console.warn('Error in requesting permissions:', err);
        });
    }
  }

  const { setActiveArray } = useAppContext();
  const handleDrawerArray = (array) => {
    if (array == 'Communications') {
      setActiveArray(COMMUNICATIONS);
    }
    else if (array == 'Crm') {
      setActiveArray(CRM);
    }
    else {
      setActiveArray(CALENDAR);
    }
  };

  return (
    <>
      <HeaderView
        title={UserData?.data?.first_name + ' ' + UserData?.data?.last_name}
        isProfilePic={true}
        imgUri={
          'https://www.shareicon.net/data/512x512/2016/05/24/770137_man_512x512.png'
        }
        onPressProfile={() => {
          Log('Profile');
        }}
        onPressSearch={() => {

        }}
        containerStyle={{
          paddingHorizontal: pixelSizeHorizontal(20),
        }}>
        <HeaderBackView
          title="Dashboard"
          isBack={false}
          isMenu={false}
          onPressMenu={() => {
            navigation.toggleDrawer();
          }}
        />
        {CommunicationsStatus &&
          <TouchableOpacity
            onPress={() => {
              handleDrawerArray('Communications')
              navigate('Communications');
            }}
            style={styles.dashBoardCardMainContainer}>
            <Image
              style={styles.iconSize}
              resizeMode="contain"
              source={ic_communication}
            />
            <Text style={styles.dashBoardCardText}>{'Communications'}</Text>
          </TouchableOpacity>
        }
        {CrmStatus &&
          <TouchableOpacity
            onPress={() => {
              handleDrawerArray('Crm')
              navigate("Crm")
            }}
            style={styles.dashBoardCardMainContainer}>
            <Image
              style={styles.iconSize}
              resizeMode="contain"
              source={ic_crm}
            />
            <Text style={styles.dashBoardCardText}>{'CRM'}</Text>
          </TouchableOpacity>
        }
        {CalandarStatus &&
          <TouchableOpacity
            onPress={() => {
              handleDrawerArray('Calendar')
              navigate("Calendar")
            }}
            style={styles.dashBoardCardMainContainer}>
            <Image
              style={styles.iconSize}
              resizeMode="contain"
              source={ic_calender}
            />
            <Text style={styles.dashBoardCardText}>{'CALENDAR'}</Text>
          </TouchableOpacity>
        }
        <CustomBottomSheet bottomSheetRef={bottomSheetRef} />
        {RegisterData !== null ?
          <RegisterAccount toggleLoading={Loading} registerData={RegisterData} />
          : null}
      </HeaderView>
      {isLoading && <LoadingView />}

    </>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  iconSize: {
    width: 55,
    height: 55,
  },
  dashBoardCardText: {
    fontSize: FontSize.FS_18,
    color: black,
    fontFamily: SEMIBOLD,
    textTransform: 'uppercase',
    marginTop: 14,
  },
  dashBoardCardMainContainer: {
    backgroundColor: white,
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 26,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
