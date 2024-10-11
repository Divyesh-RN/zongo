import { Text, Image, TouchableOpacity, StyleSheet, View, FlatList, Alert, Modal, TextInput } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../commonComponents/HeaderBackView';
import CustomBottomSheet from '../../commonComponents/CustomBottomSheet';
import { black, black05, disableColor, greenPrimary, grey, grey01, midGreen, red, transparent, white } from '../../constants/Color';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import { navigate } from '../../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import LoadingView from '../../commonComponents/LoadingView';
import { resetApiStatus } from '../../redux/reducers/messageReducer';
import { HEIGHT, STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../constants/ConstantKey';
import { Get_Sms_Template_Details, Get_Sms_Template_List, Get_User_Assign_List, Send_sms, Sms_Chat_All_Contact_List, Sms_Chat_Contact_List } from '../../redux/api/Api';
import global from '../../constants/Global';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import BottomSheet from '../../commonComponents/BottomSheet/BottomSheet';

const Message = ({ navigation }) => {

  const [ContactList, setContactList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [FromNumberList, setFromNumberList] = useState(null);
  const [FromNumber, setFromNumber] = useState(null);
  const [FromNumberError, setFromNumberError] = useState("");
  const [ToNumberList, setToNumberList] = useState(null);
  const [ToNumber, setToNumber] = useState(null);
  const [ToNumberError, setToNumberError] = useState("");
  const [SmsTempleteDetails, setSmsTempleteDetails] = useState(null);
  const [SmsTempleteList, setSmsTempleteList] = useState(null);
  const [SmsTemplete, setSmsTemplete] = useState(null);
  const [SmsTempleteError, setSmsTempleteError] = useState("");
  const [Message, setMessage] = useState("");
  const [MessageError, setMessageError] = useState("");
  const [FromChange, setFromChange] = useState(false);



  const dispatch = useDispatch();
  const ref = useRef();
  const to = useRef();
  const smsTemplate = useRef();
  const apiGetSmsTemplateList = useSelector(state => state.messageRedux.apiGetSmsTemplateList);
  const sms_template_list = useSelector(state => state.messageRedux.sms_template_list);
  const apiGetSmsTemplateDetails = useSelector(state => state.messageRedux.apiGetSmsTemplateDetails);
  const sms_template_details = useSelector(state => state.messageRedux.sms_template_details);
  const apiGetUserAssignList = useSelector(state => state.messageRedux.apiGetUserAssignList);
  const sms_chat_user_assign_list = useSelector(state => state.messageRedux.sms_chat_user_assign_list);
  const apiSmsChatContactList = useSelector(state => state.messageRedux.apiSmsChatContactList);
  const contact_data = useSelector(state => state.messageRedux.contact_data);
  const apiSmsChatAllContactList = useSelector(state => state.messageRedux.apiSmsChatAllContactList);
  const sms_all_contact_list = useSelector(state => state.messageRedux.sms_all_contact_list);

  const apiSendSms = useSelector(state => state.messageRedux.apiSendSms);
  const isLoading = useSelector(state => state.messageRedux.isLoader);
  const isError = useSelector(state => state.messageRedux.isError);
  const error_message = useSelector(state => state.messageRedux.error_message);
  const user_data = useSelector(state => state.userRedux.user_data);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(resetApiStatus());
      setFromChange(false)
    };
  }, []);

  const AllApi = () => {
    var dict = {
      main_uuid: user_data?.data?.main_uuid,
      createdby: user_data?.data?.user_uuid,
      sms_campaign_log_uuid: ""
    }
    dispatch(Get_User_Assign_List(dict))

    var data = {
      main_uuid: user_data?.data?.main_uuid,
      createdby: user_data?.data?.user_uuid,
      message_type: "sms"
    }
    dispatch(Get_Sms_Template_List(data))

    var contact = {
      main_uuid: user_data?.data?.main_uuid,
      createdby: user_data?.data?.user_uuid,
      group_per: "all",
      group_uuid: "",
      user_type: user_data?.data?.role
    }
    dispatch(Sms_Chat_All_Contact_List(contact))
  }


  useFocusEffect(
    useCallback(() => {
      AllApi()
    }, [])
  );


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
    Log('apiGetUserAssignList :', apiGetUserAssignList);
    if (apiGetUserAssignList == STATUS_FULFILLED) {
      Log("GET CONTACT DATA ", sms_chat_user_assign_list)
      if (sms_chat_user_assign_list !== null) {
       
        setFromNumberList(sms_chat_user_assign_list?.data)
        if(FromChange == false){
          setFromNumber(sms_chat_user_assign_list?.data[0])
          setContactList(sms_chat_user_assign_list?.contact_list)
        }

      }
    } else if (apiGetUserAssignList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetUserAssignList]);

  useEffect(() => {
    Log('apiGetSmsTemplateList :', apiGetSmsTemplateList);
    if (apiGetSmsTemplateList == STATUS_FULFILLED) {
      Log("sms_template_list ", sms_template_list)
      if (sms_template_list !== null) {
        setSmsTempleteList(sms_template_list)
      }
    } else if (apiGetSmsTemplateList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetSmsTemplateList]);

  useEffect(() => {
    Log('apiGetSmsTemplateDetails :', apiGetSmsTemplateDetails);
    if (apiGetSmsTemplateDetails == STATUS_FULFILLED) {
      Log("sms_template_details ", sms_template_details)
      if (sms_template_details !== null) {
        setSmsTempleteDetails(sms_template_details)
        setMessage(sms_template_details?.message)
      }
    } else if (apiGetSmsTemplateDetails == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetSmsTemplateDetails]);

  useEffect(() => {
    Log('apiSendSms :', apiSendSms);
    if (apiSendSms == STATUS_FULFILLED) {
      setMessage("")
      AllApi()
      setToNumber(null)
      setSmsTemplete(null)
    } else if (apiSendSms == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiSendSms]);

  useEffect(() => {
    Log('apiSmsChatAllContactList :', apiSmsChatAllContactList);
    if (apiSmsChatAllContactList == STATUS_FULFILLED) {
      Log("sms_all_contact_list ", sms_all_contact_list)
      if (sms_all_contact_list !== null) {
        setToNumberList(sms_all_contact_list)
      }
    } else if (apiSmsChatAllContactList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiSmsChatAllContactList]);



  const onSend = () => {
    if (FromNumber == null) {
      setFromNumberError("* Please select from number")
    }
    if (ToNumber == null) {
      setToNumberError("* Please select to number")
    }
    if (Message == "") {
      setMessageError("* Please enter message")
    }
    else {
      setMessage("")
      setModalVisible(false)
      var dict = {};
      dict.from_number = FromNumber?.did_number,
        dict.to_number = ToNumber?.contact_uuid,
        dict.message = Message
      dict.main_uuid = user_data?.data?.main_uuid,
        dict.createdby = user_data?.data?.user_uuid
      dispatch(Send_sms(dict))
    }
  }

  const openFromBottomSheet = () => {
    if (ref.current) {
      ref.current.open();
    }
  };

  const openToBottomSheet = () => {
    if (to.current) {
      to.current.open();
    }
  };

  const openSmsTemplateBottomSheet = () => {
    if (smsTemplate.current) {
      smsTemplate.current.open();
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
          marginHorizontal: pixelSizeHorizontal(20),
        }}>
        <Text style={{
          color: black,
          fontFamily: SEMIBOLD,
          fontSize: FontSize.FS_13,
          marginTop: 14,
        }}>{"From Number"}</Text>
        <TouchableOpacity onPress={() => {
          openFromBottomSheet()
        }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: black,
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginVertical: 10,
            borderRadius: 4,
          }}>
          <Text style={{
            fontSize: FontSize.FS_12,
            color: black,
            fontFamily: MEDIUM,
            marginTop: 4,
          }}>{FromNumber == null ? "Select From Number" : FromNumber?.did_number}</Text>
          <Icon name={"chevron-down"} size={22} color={grey} />

        </TouchableOpacity>
        <Text style={{
          color: black,
          fontFamily: SEMIBOLD,
          fontSize: FontSize.FS_13,
          marginTop: 14,
          marginBottom: 7,
        }}>{"Contacts"}</Text>
        <FlatList
          style={{ marginHorizontal: -20, paddingHorizontal: 20, }}
          data={ContactList}
          keyExtractor={item => Math.random()}
          renderItem={({ item, index }) =>

            <TouchableOpacity onPress={() => {
              navigate("ChatScreen", { to_number: item?.to_number, to_name: item.contact_name, from_number: FromNumber?.did_number,to_uuid:item?.contact_uuid })
            }}
              style={{
                borderBottomWidth: 1,
                borderBlockColor: disableColor,
                marginBottom: 4,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ borderRadius: 14 }}>
                </TouchableOpacity>
                <View style={{}}>
                  <Text style={{
                    fontSize: FontSize.FS_14,
                    color: black,
                    fontFamily: MEDIUM,
                    lineHeight: 24
                  }}>{item?.contact_name}</Text>
                  <Text style={{
                    fontSize: FontSize.FS_14,
                    color: black,
                    fontFamily: REGULAR,
                    lineHeight: 24
                  }}>{item?.to_number}</Text>
                </View>
              </View>

            </TouchableOpacity>
          }
        />
        <TouchableOpacity onPress={() => {
          setModalVisible(!modalVisible);
        }}
          style={{
            position: "absolute", right: 20, bottom: 20, backgroundColor: midGreen, width: 50, height: 50, borderRadius: 100, alignItems: "center", justifyContent: "center"
          }}>
          <Icon name="message-text-outline" size={22} color={white} />
        </TouchableOpacity>
        <BottomSheet
          headerTitle={"From number"}
          Data={FromNumberList}
          titleValue={"did_number"}
          bottomSheetRef={ref}
          selectedValue={(data) => {
            console.log("data: ", data)
            setFromNumber(data)
            setFromNumberError("")
            if (modalVisible == false) {
              var dict = {
                createdby: user_data?.data?.user_uuid,
                from_number: data?.did_number,
                group_per: "all",
                group_uuid: "",
                main_uuid: user_data?.data?.main_uuid,
                user_type: user_data?.data?.role
              }
              console.log("dict get contact:", dict)
              dispatch(Sms_Chat_Contact_List(dict))
              setFromChange(true)
            }
          }} />
        <BottomSheet
          headerTitle={"To number"}
          Data={ToNumberList}
          titleValue={"contact_name"}
          bottomSheetRef={to}
          selectedValue={(data) => {
            console.log("data: ", data)
            setToNumber(data)
            setToNumberError("")
          }} />
        <BottomSheet
          headerTitle={"SMS Template"}
          Data={SmsTempleteList}
          titleValue={"name"}
          bottomSheetRef={smsTemplate}
          selectedValue={(data) => {
            console.log("data: ", data)
            setSmsTemplete(data)
            setSmsTempleteError("")
            var dict = {
              sms_temp_uuid: data?.sms_temp_uuid,
              createdby: user_data?.data?.user_uuid
            }
            dispatch(Get_Sms_Template_Details(dict))
          }} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => setModalVisible(!modalVisible)}>
                <Icon name={"close"} size={25} color={black} />
              </TouchableOpacity>
              <View style={{ marginVertical: 20 }}>
                <Text style={{
                  color: black,
                  fontFamily: SEMIBOLD,
                  fontSize: FontSize.FS_13,
                  marginTop: 4,
                }}>{"From Number"}</Text>
                <TouchableOpacity onPress={() => {
                  openFromBottomSheet()
                }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: black,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginVertical: 10,
                    borderRadius: 4,
                  }}>
                  <Text style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                    marginTop: 4
                  }}>{FromNumber == null ? "Select From Number" : FromNumber?.did_number}</Text>
                  <Icon name={"chevron-down"} size={22} color={grey} />

                </TouchableOpacity>
                {FromNumberError !== "" && <Text style={styles.errorText}>{FromNumberError}</Text>}
                <Text style={{
                  color: black,
                  fontFamily: SEMIBOLD,
                  fontSize: FontSize.FS_13,
                  marginTop: 4,
                }}>{"To Number"}</Text>
                <TouchableOpacity onPress={() => {
                  openToBottomSheet()
                }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: black,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginVertical: 10,
                    borderRadius: 4,
                  }}>
                  <Text style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                    marginTop: 4
                  }}>{ToNumber == null ? "Select To Number" : ToNumber?.contact_name}</Text>
                  <Icon name={"chevron-down"} size={22} color={grey} />

                </TouchableOpacity>
                {ToNumberError !== "" && <Text style={styles.errorText}>{ToNumberError}</Text>}
                <Text style={{
                  color: black,
                  fontFamily: SEMIBOLD,
                  fontSize: FontSize.FS_13,
                  marginTop: 4,
                }}>{"SMS Template"}</Text>
                <TouchableOpacity onPress={() => {
                  openSmsTemplateBottomSheet()
                }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: black,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginVertical: 10,
                    borderRadius: 4,
                  }}>
                  <Text style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                    marginTop: 4
                  }}>{SmsTemplete == null ? "Select SMS Template" : SmsTemplete?.name}</Text>
                  <Icon name={"chevron-down"} size={22} color={grey} />

                </TouchableOpacity>
                <Text style={{
                  color: black,
                  fontFamily: SEMIBOLD,
                  fontSize: FontSize.FS_13,
                  marginTop: 4,
                }}>{"Message"}</Text>
                <TextInput

                  multiline={true}
                  style={{
                    color: black, fontSize: FontSize.FS_12, fontFamily: MEDIUM, paddingVertical: 6, borderWidth: 1,
                    borderColor: black,
                    paddingVertical: 20,
                    paddingHorizontal: 12,
                    marginVertical: 10,
                    borderRadius: 4,

                  }}
                  placeholder="Type a message...."
                  value={Message}
                  onChangeText={(txt) => {
                    setMessage(txt)
                    setMessageError("")
                  }}
                />
                   {MessageError !== "" && <Text style={styles.errorText}>{MessageError}</Text>}

                <TouchableOpacity onPress={() => {
                  onSend()
                }}
                  style={{ backgroundColor: greenPrimary, alignItems: "center", justifyContent: "center", paddingVertical: 6, borderRadius: 4, marginTop: 30 }}>
                  <Text style={{
                    color: white,
                    fontFamily: SEMIBOLD,
                    fontSize: FontSize.FS_14,
                    marginTop: 4,
                  }}>{"Send SMS"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </HeaderView>
      {isLoading && <LoadingView />}
    </>
  );
};

export default Message;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: black05
  },
  modalView: {
    // height: HEIGHT - 150,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontFamily: REGULAR,
    fontSize: FontSize.FS_10,
    color: red,
    marginBottom: 4
  },
});
