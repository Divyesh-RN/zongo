import { Text, Image, TouchableOpacity, StyleSheet, View, FlatList, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../commonComponents/HeaderBackView';
import CustomBottomSheet from '../../commonComponents/CustomBottomSheet';
import { black, greenPrimary, grey, white } from '../../constants/Color';
import { FontSize, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import { navigate } from '../../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import LoadingView from '../../commonComponents/LoadingView';
import { resetApiStatus } from '../../redux/reducers/messageReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Sms_Chat_Contact_List } from '../../redux/api/Api';
import global from '../../constants/Global';

const Message = ({ navigation }) => {

  const [ContactList, setContactList] = useState(null);


  const dispatch = useDispatch();

  const apiSmsChatContactList = useSelector(state => state.messageRedux.apiSmsChatContactList);
  const isLoading = useSelector(state => state.messageRedux.isLoader);
  const isError = useSelector(state => state.messageRedux.isError);
  const error_message = useSelector(state => state.messageRedux.error_message);
  const contact_data = useSelector(state => state.messageRedux.contact_data);
  const user_data = useSelector(state => state.userRedux.user_data);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(resetApiStatus());
    };
  }, []);

  useEffect(() => {
    Log('apiSmsChatContactList :', apiSmsChatContactList);
    if (apiSmsChatContactList == STATUS_FULFILLED) {
      Log("GET CONTACT DATA ", contact_data)
      if (contact_data !== null) {
        setContactList(contact_data?.data?.data)
      }
    } else if (apiSmsChatContactList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiSmsChatContactList]);

  useEffect(() => {
    var dict = {};
    dict.from_number = "+17869210666",
      dict.main_uuid = user_data?.data?.main_uuid,
      dict.user_type = "admin",
      dict.group_per = "all",
      dict.group_uuid = "",
      dict.createdby = user_data?.data?.user_uuid

    dispatch(Sms_Chat_Contact_List(dict))
  }, [])


  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
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
          title="Message"
          isMenu={false}
          onPressMenu={() => {
            Log('back', global.userAgent);
            navigation.toggleDrawer();
          }}
          isBack={false}
        />
        <FlatList
          style={{ marginHorizontal: -20, paddingBottom: 40 }}
          data={ContactList}
          keyExtractor={item => Math.random()}
          renderItem={({ item, index }) =>

            <TouchableOpacity onPress={() => {
              navigate("ChatScreen", { to_number: item?.to_number, to_name: item.contact_name })
            }}
              style={{
                backgroundColor: white,
                marginBottom: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,

                elevation: 1,
              }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ borderRadius: 14 }}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      backgroundColor: 'green',
                    }}
                    resizeMode="cover"
                    source={{
                      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScvr384-HY-LVXWZjIIzQXAXo1ioKVIpQCiYd1KxsQ2amd710KW8miXKgDWm5tRViy1NU&usqp=CAU',
                    }}
                  />
                </TouchableOpacity>
                <View style={{ marginLeft: 14, }}>
                  <Text style={{
                    fontSize: FontSize.FS_14,
                    color: black,
                    fontFamily: REGULAR,
                    lineHeight: 24
                  }}>{item?.contact_name}</Text>
                  <Text style={{
                    fontSize: FontSize.FS_14,
                    color: black,
                    fontFamily: REGULAR,
                    lineHeight: 24
                  }}>{item?.to_number}</Text>
                  {/* <Text  style={{
               fontSize: FontSize.FS_12,
               color: grey,
               fontFamily: REGULAR,
               lineHeight:20
            }}>Hello , How are you ?</Text> */}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', }}>
                <Text style={{
                  fontSize: FontSize.FS_10,
                  color: grey,
                  fontFamily: REGULAR,
                }}>11:20 AM</Text>
                {index > 2 ?
                  <Icon name="check" size={20} color={greenPrimary} />
                  :
                  <View style={{
                    width: 20, height: 20, borderRadius: 10, backgroundColor: "#52b1411f", alignItems: "center", justifyContent: "center", marginTop: 4
                  }}>
                    <Text style={{
                      fontSize: FontSize.FS_10,
                      color: greenPrimary,
                      fontFamily: REGULAR,
                    }}>1</Text>
                  </View>
                }
              </View>
            </TouchableOpacity>
          }
        />

        <CustomBottomSheet bottomSheetRef={bottomSheetRef} />
      </HeaderView>
      {isLoading && <LoadingView />}
    </>
  );
};

export default Message;

const styles = StyleSheet.create({
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
