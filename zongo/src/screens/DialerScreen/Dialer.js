import { Text, TouchableOpacity, StyleSheet, View, PanResponder, Platform, Alert, LayoutAnimation } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import LoadingView from '../../commonComponents/LoadingView';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../commonComponents/HeaderBackView';
import { useFocusEffect } from '@react-navigation/native';
import { bgColor01, black, greenPrimary, grey, light_grey, midGreen, paleGreen, red, white } from '../../constants/Color';
import { FCM_TOKEN, HEIGHT, STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../constants/ConstantKey';
import { FontSize, MEDIUM, SEMIBOLD, REGULAR } from '../../constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../../commonComponents/AsyncManager';
import { resetApiStatus } from '../../redux/reducers/contactReducer';
import { Log } from '../../commonComponents/Log';
import { Get_Contacts_List } from '../../redux/api/Api';
import { navigate } from '../../navigation/RootNavigation';


const ExpandableComponent = ({ item, onClickFunction }) => {
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);


  const GetName = (name) => {
    const words = name.split(" ");

    let initials = "";

    words.forEach(word => {
      if (word.length > 0) {
        initials += word[0].toUpperCase();
      }
    });

    return initials;
  }

  const getRandomColor = () => {
    const colors = ['#ADD8E6', '#90EE90', '#FFB6C1', '#E6E6FA'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };


  return (
    <View style={[
      styles.expandableView,
      item?.isExpanded && styles.expandedView,
    ]}>
      <TouchableOpacity onPress={onClickFunction}
        style={{
          // backgroundColor: white,
          paddingTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              backgroundColor: getRandomColor(),
              width: 35,
              height: 35,
              alignItems: "center",
              justifyContent: "center"

            }}>
            <Text style={{ fontSize: 14, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item.first_name)} </Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 14, }}>
            <Text style={{
              fontSize: FontSize.FS_14,
              color: black,
              fontFamily: REGULAR,
              lineHeight: 24
            }}>{item?.first_name}  {item?.last_name}</Text>

          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        <View>
          <Text style={{
            fontSize: FontSize.FS_10,
            color: black,
            fontFamily: MEDIUM,
            lineHeight: 24,
            marginLeft: 50
          }}>Mobile {item?.work_contact_number}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 40, marginVertical: 14 }}>
            <TouchableOpacity onPress={() => {
              navigate("CallScreen", { item: item, from: "CONTACTS" })
            }}
              style={{ width: 37, height: 37, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
              <Icon name="phone" size={22} color={white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigate("ChatScreen", { to_number: item?.work_contact_number, to_name: item?.first_name + " " + item?.last_name })
            }}
              style={{ width: 37, height: 37, backgroundColor: "#228aea", borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
              <Icon name="chat" size={22} color={white} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 37, height: 37, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
              <Icon name="video" size={24} color={white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigate("ContactInfo", { item: item, from: "CONTACTS" })
            }}
              style={{ width: 37, height: 37, backgroundColor: grey, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
              <Icon name="information" size={22} color={white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Dialer({ navigation }) {

  const [IsLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [ContactsData, setContactsData] = useState(null);
  const [FcmToken, setFcmToken] = useState(null);
  const [listDataSource, setListDataSource] = useState([]);
  const [Index, setIndex] = useState(0);
  const [multiSelect, setMultiSelect] = useState(false);

  const pan = useRef(new PanResponder.create());
  const [startY, setStartY] = useState(0);

  const SWIPE_VELOCITY_THRESHOLD = 0.1;
  const dispatch = useDispatch();
  const apiGetContactsList = useSelector(state => state.contactRedux.apiGetContactsList);
  const isLoading = useSelector(state => state.contactRedux.isLoader);
  const isError = useSelector(state => state.contactRedux.isError);
  const error_message = useSelector(state => state.contactRedux.error_message);
  const contacts_data = useSelector(state => state.contactRedux.contacts_data);
  const user_data = useSelector(state => state.userRedux.user_data);


  useFocusEffect(
    useCallback(() => {
      getData(FCM_TOKEN, data => {
        Log('FCM_TOKEN Contact: ', data);
        setFcmToken(data)
      });
      return () => {
        dispatch(resetApiStatus());
      };
    }, [])
  );

  useEffect(() => {
    if (FcmToken == null) {
      var dict = {};
      dict.is_search = false,
        dict.limits = "show_all",
        dict.off_set = 0,
        dict.orderby = "created_at DESC",
        dict.group_per = "all",
        dict.group_uuid = "",
        dict.user_type = "admin",
        dict.contact_type = "",
        dict.bussiness_name = "",
        dict.contact_title = "",
        dict.first_name = "",
        dict.last_name = "",
        dict.email = "",
        dict.work_contact_number = "",
        dict.other_contact_number = "",
        dict.country = "",
        dict.state = "",
        dict.city = "",
        dict.zipcode = "",
        dict.address = "",
        dict.address2 = "",
        dict.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxZjE5ZGNiMC1mODEwLTRlNmItOTNkNC03NTVkNjRjYjNiNjMiLCJpYXQiOjE2OTgyMTc2MzIsImV4cCI6MTY5ODMwNDAzMn0.uarREiHwNuB0-LT3Vxy5L6hLyd7dY_CmVOrVbx0B_cE",
        dict.createdby = user_data?.data?.user_uuid,
        dict.main_uuid = user_data?.data?.main_uuid,
        dict.user_uuid = user_data?.data?.user_uuid
      dispatch(Get_Contacts_List(dict))
    }

  }, [FcmToken])

  useEffect(() => {
    Log('apiGetContactsList :', apiGetContactsList);
    if (apiGetContactsList == STATUS_FULFILLED) {
      if (contacts_data !== null) {
        const initialListDataSource = contacts_data.map(item => ({
          ...item,
          isExpanded: false,
        }));
        setContactsData(initialListDataSource)
        setListDataSource(initialListDataSource)
      }
    } else if (apiGetContactsList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetContactsList]);

  // const closeView = () => {
  //   setIsVisible(false);
  // };

  // const handleStartShouldSetPanResponder = (e, gestureState) => {
  //   setStartY(gestureState.y0);
  //   return true;
  // };

  // const handleMoveShouldSetPanResponder = (e, gestureState) => {
  //   return Math.abs(gestureState.dy) > 10;
  // };

  // const handlePanResponderRelease = (e, gestureState) => {
  //   if (gestureState.vy > SWIPE_VELOCITY_THRESHOLD) {
  //     if (gestureState.moveY - startY > 50) {
  //       setIsVisible(false);
  //     }
  //   }
  // };
  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    if (multiSelect) {
      // If multiple select is enabled
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      // If single select is enabled
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false)
      );
    }
    setListDataSource(array);
  };

  const handleDial = () => {
    console.log(`Dialing ${phoneNumber}`);
  };

  const appendNumber = (num) => {
    setPhoneNumber(phoneNumber + num);
  };

  const removeLastNumber = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  return (
    <>
      <HeaderView
        title={'Zongo'}
        isProfilePic={true}
        imgUri={
          'https://www.shareicon.net/data/512x512/2016/05/24/770137_man_512x512.png'
        }
        onPressProfile={() => {
          Log('Profile');
        }}
        onPressSearch={() => {
          Log('Search');
        }}
        containerStyle={{
          paddingHorizontal: pixelSizeHorizontal(20),
        }}>
        <HeaderBackView
          title="Dialer"
          isBack={false}
          isMenu={false}
          onPressMenu={() => {
            navigation.toggleDrawer();
          }}
        />
        <View style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: bgColor01, flex: 1 }}>
            <TouchableOpacity onPress={() => {
              setIndex(0)
            }}
              style={{ padding: 10 }}>
              <Text style={{
                fontFamily: SEMIBOLD,
                color: black,
                fontSize: FontSize.FS_14,
              }}>Keypad</Text>
              {Index == 0 && <View style={{ width: Platform.OS == "android" ? 64 : 54, height: 2, backgroundColor: black, borderRadius: 10, marginTop: 2 }}></View>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setIndex(1)
            }}
              style={{ padding: 10, marginHorizontal: "15%" }}>
              <Text style={{
                fontFamily: SEMIBOLD,
                color: black,
                fontSize: FontSize.FS_14,
              }}>Recent</Text>
              {Index == 1 && <View style={{ width: Platform.OS == "android" ? 61 : 51, height: 2, backgroundColor: black, borderRadius: 10, marginTop: 2 }}></View>}

            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setIndex(2)
            }}
              style={{ padding: 10 }}>
              <Text style={{
                fontFamily: SEMIBOLD,
                color: black,
                fontSize: FontSize.FS_14,
              }}>Contacts</Text>
              {Index == 2 && <View style={{ width: Platform.OS == "android" ? 76 : 66, height: 2, backgroundColor: black, borderRadius: 10, marginTop: 2 }}></View>}

            </TouchableOpacity>
          </View>
        </View>
        {/* <TouchableOpacity onPress={() => {
          setIsVisible(true)
        }}
          style={{ backgroundColor: greenPrimary, position: "absolute", bottom: 30, right: 30, padding: 14, borderRadius: 50 }}>
          <Icon name="dialpad" size={25} color={white} />
        </TouchableOpacity> */}
        {Index == 0 &&
          <View
            //      {...(isVisible && PanResponder.create({
            //   onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
            //   onPanResponderRelease: handlePanResponderRelease,
            //   onPanResponderTerminationRequest: () => false,
            //   onShouldBlockNativeResponder: () => false,
            //   onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
            // }).panHandlers)}
            style={styles.mainBottomView}>
            <View
              style={styles.display}>
              <Text
                style={styles.displayText}
              >{phoneNumber}</Text>
              <TouchableOpacity onLongPress={() => {
                setPhoneNumber('')
              }}
                style={{ padding: 12, backgroundColor: white }} onPress={() => {
                  removeLastNumber()
                }}>
                <Icon name="backspace-outline" size={25} color={grey} />
              </TouchableOpacity>
            </View>
            <View style={styles.dialer}>
              <View style={styles.dialerRow}>
                {[1, 2, 3].map((num) => (
                  <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
                    <Text style={styles.dialerButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.dialerRow}>
                {[4, 5, 6].map((num) => (
                  <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
                    <Text style={styles.dialerButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.dialerRow}>
                {[7, 8, 9].map((num) => (
                  <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
                    <Text style={styles.dialerButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.dialerRow}>
                <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('*')}>
                  <Text style={styles.dialerButtonText}>*</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('0')}>
                  <Text style={styles.dialerButtonText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('#')}>
                  <Text style={styles.dialerButtonText}>#</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.callButton} onPress={handleDial}>
                <Icon name="phone" size={30} color={white} />
              </TouchableOpacity>
            </View>
          </View>
        }
        {
          Index == 2 && listDataSource !== null &&
          <>
            {listDataSource.map((item, key) => (
              <ExpandableComponent
                key={item.first_name}
                onClickFunction={() => {
                  updateLayout(key);
                }}
                item={item}
              />
            ))}
          </>
        }
        {Index == 1 &&
          <View style={{ marginVertical: 10, }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical:10 }}>
                <Icon name="arrow-bottom-left" size={22} color={black} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: MEDIUM, }}>{"Incoming call"} </Text>
                    <Text style={{ fontSize: FontSize.FS_11, color: black, fontFamily: REGULAR, }}>{"Jul 21 11:16 AM"} </Text>
                  </View>
                  <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical:10 }}>
                <Icon name="arrow-top-right" size={22} color={black} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: MEDIUM, }}>{"Outgoing call"} </Text>
                    <Text style={{ fontSize: FontSize.FS_11, color: black, fontFamily: REGULAR, }}>{"Jul 21 11:16 AM"} </Text>
                  </View>
                  <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
              <Icon name="arrow-u-right-top" size={22} color={red} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                  <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: REGULAR, }}>{"Missed call"} </Text>
                  <Text style={{ fontSize: FontSize.FS_11, color: red, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                </View>
                <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical:10 }}>
                <Icon name="arrow-bottom-left" size={22} color={black} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: MEDIUM, }}>{"Incoming call"} </Text>
                    <Text style={{ fontSize: FontSize.FS_11, color: black, fontFamily: REGULAR, }}>{"Jul 21 11:16 AM"} </Text>
                  </View>
                  <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical:10 }}>
                <Icon name="arrow-bottom-left" size={22} color={black} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: MEDIUM, }}>{"Incoming call"} </Text>
                    <Text style={{ fontSize: FontSize.FS_11, color: black, fontFamily: REGULAR, }}>{"Jul 21 11:16 AM"} </Text>
                  </View>
                  <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
              <Icon name="arrow-u-right-top" size={22} color={red} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                  <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: REGULAR, }}>{"Missed call"} </Text>
                  <Text style={{ fontSize: FontSize.FS_11, color: red, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                </View>
                <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
              <Icon name="arrow-u-right-top" size={22} color={red} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                  <Text style={{ fontSize: FontSize.FS_13, color: black, fontFamily: REGULAR, }}>{"Missed call"} </Text>
                  <Text style={{ fontSize: FontSize.FS_11, color: red, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                </View>
                <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"98764278987"} </Text>
              </View>
            </View>
           
          </View>
        }
      </HeaderView>
      {isLoading && <LoadingView />}

    </>
  )
}


const styles = StyleSheet.create({
  mainBottomView: {
    // backgroundColor: bgColor01,
    // backgroundColor: "red",
    width: WIDTH,
    height: Platform.OS == "android" ? 420 : HEIGHT / 2.1,
    position: "absolute",
    bottom: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,

      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
  },

  dialer: {
    width: WIDTH - 80,
    alignSelf: "center",
  },
  dialerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center",
    marginBottom: 10,
  },
  dialerButton: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: paleGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: midGreen,
    
  },
  dialerButtonText: {
    color: midGreen,
    fontSize: FontSize.FS_20,
    fontFamily: SEMIBOLD,
  },
  display: {
    width: '100%',
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  displayText: {
    height: 50,
    padding: 10,
    backgroundColor: white,
    fontSize: FontSize.FS_22,
    color: black,
    fontFamily: MEDIUM,
    textAlign: "center",
    pointerEvents: "none",
    flex: 1
  },
  callButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: greenPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: "green",
  },
  expandableView: {
    // backgroundColor: white,
    borderBottomColor: light_grey,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  expandedView: {
    borderBottomWidth: 1,
    borderBottomColor: light_grey,
  },
});