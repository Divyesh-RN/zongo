import {
  Text, TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../commonComponents/HeaderBackView';
import {
  bgColor01,
  black,
  greenPrimary,
  grey, light_grey,
  white
} from '../../constants/Color';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import { goBack } from '../../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import { resetApiStatus } from '../../redux/reducers/messageReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Get_Sms_Chat, Send_sms } from '../../redux/api/Api';
import moment from 'moment';

const ChatScreen = ({ route }) => {
  const [messageText, setMessageText] = useState('');
  const [ChatData, setChatData] = useState(null);
  const [ToNumber, setToNumber] = useState(route?.params?.to_number || "");
  const [ToName, setToName] = useState(route?.params?.to_name || "");

  const dispatch = useDispatch();

  const apiGetSmsChat = useSelector(state => state.messageRedux.apiGetSmsChat);
  const apiSendSms = useSelector(state => state.messageRedux.apiSendSms);
  const isLoading = useSelector(state => state.messageRedux.isLoader);
  const isError = useSelector(state => state.messageRedux.isError);
  const error_message = useSelector(state => state.messageRedux.error_message);
  const sms_chat_data = useSelector(state => state.messageRedux.sms_chat_data);
  const user_data = useSelector(state => state.userRedux.user_data);


  useEffect(() => {
    return () => {
      dispatch(resetApiStatus());
    };
  }, []);

  useEffect(() => {
    Log('apiGetSmsChat :', apiGetSmsChat);
    if (apiGetSmsChat == STATUS_FULFILLED) {
      if (sms_chat_data !== null) {
        ShortDataByTime(sms_chat_data?.data?.data)
        // setChatData(sms_chat_data?.data?.data)
      }
    } else if (apiGetSmsChat == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetSmsChat]);

  useEffect(() => {
    Log('apiSendSms :', apiSendSms);
    if (apiSendSms == STATUS_FULFILLED) {
      setMessageText("")
      var dict = {};
      dict.from_number = "+17869210666",
        dict.to_number = route?.params?.to_number,
        dict.main_uuid = user_data?.data?.main_uuid,
        dict.createdby = user_data?.data?.user_uuid
      dispatch(Get_Sms_Chat(dict))
    } else if (apiSendSms == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiSendSms]);

  useEffect(() => {
    var dict = {};
    dict.from_number = "+17869210666",
      dict.to_number = route?.params?.to_number,
      dict.main_uuid = user_data?.data?.main_uuid,
      dict.createdby = user_data?.data?.user_uuid
      Log("CHAT DATA USER ",dict)
    dispatch(Get_Sms_Chat(dict))
  }, [])

  useEffect(() => {
    // Call the API function immediately when the component mounts
    GetSmsChatData()
    // Set up a repeating timer to call the API every 5 seconds
    const intervalId = setInterval(GetSmsChatData, 5000);

    // Clear the timer when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  const GetSmsChatData = () => {
    var dict = {};
    dict.from_number = "+17869210666",
      dict.to_number = route?.params?.to_number,
      dict.main_uuid = user_data?.data?.main_uuid,
      dict.createdby = user_data?.data?.user_uuid
    dispatch(Get_Sms_Chat(dict))
  }

  const ShortDataByTime = (data) => {
    const copiedData = JSON.parse(JSON.stringify(data));
    copiedData.forEach((item) => {
      item.date_time = moment(item.date_time, 'MM/DD/YYYY HH:mm:ss').toDate();
    });
    copiedData.sort((a, b) => a.date_time - b.date_time);
    setChatData(copiedData);
  };
  const onSend = () => {
    if (messageText !== "") {
      setMessageText("")
      var dict = {};
      dict.from_number = "+17869210666",
        dict.to_number = route?.params?.to_number,
        dict.message = messageText
      dict.main_uuid = user_data?.data?.main_uuid,
        dict.createdby = user_data?.data?.user_uuid
    }
    dispatch(Send_sms(dict))

  }

  const ChatTimestamp = (date) => {
    const inputDateString = date; // Assuming the format is 'DD/MM/YYYY HH:mm:ss'
    const [dateString, timeString] = date.split(' ');
    const dateTime = moment(`${dateString} ${timeString}`, 'MM/DD/YYYY HH:mm:ss');
    const formattedDate = dateTime.format('MMM DD YYYY h:mm A');
    return formattedDate;
  };

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
          paddingHorizontal: pixelSizeHorizontal(0),
        }}>
        <View style={{ paddingHorizontal: pixelSizeHorizontal(20), }}>
          <HeaderBackView
            title={ToName == " " ? ToNumber : ToName}
            isBack={true}
            isMenu={false}
            onPressBack={() => {
              goBack();
            }}
            onPressMenu={() => {
              navigation.toggleDrawer();
            }}
          /></View>
        <FlatList
          style={{ marginBottom: 120, flex: 1, marginTop: 20 }}
          data={ChatData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.direction === 'inbound' ? styles.inboundMessage : styles.outboundMessage,
              ]}
            >

              <View style={{ flexDirection: item.direction === 'inbound' ? "row" : "row-reverse", alignItems: "center" }}>
                {item.contact_name !== " " && <View style={{
                  borderWidth: 1,
                  borderColor: white,
                  backgroundColor: greenPrimary,
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: item.direction === 'inbound' ? 10 : 0,
                  marginLeft: item.direction === 'inbound' ? 0 : 10,

                }}>
                  <Text style={{ fontSize: 12, color: white, fontFamily: REGULAR, marginLeft: 2 }}>{GetName(item.contact_name)} </Text>
                </View>}
                <View>
                  <Text style={styles.messageText}>
                    {item.message_text}
                  </Text>
                  <Text style={styles.timeText}>
                    {moment(item.date_time).format('MM/DD/YYYY HH:mm:ss')}
                  </Text>
                </View>
              </View>
              {/* <Text style={styles.timeText}>
                {ChatTimestamp(item.date_time)}
              </Text> */}

            </View>
          )}
        />
        {/* <View style={{ backgroundColor: greenPrimary, position: "absolute", bottom: 0, width: "100%", height: 90, flexDirection: "row", paddingHorizontal: 20 }} >
        <TouchableOpacity style={{ flex: 0.10, alignSelf: "center" }}>
          <Icon name="plus" size={30} color={white} />
        </TouchableOpacity>
        <View style={{ backgroundColor: white, flex: 0.90, height: 60, alignSelf: "center", borderRadius: 6, paddingHorizontal: 16, flexDirection: "row", alignItems: "center",shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5, }}>
          <TextInput
            multiline={true}
            style={{ color: black, fontSize: FontSize.FS_14, fontFamily: MEDIUM, flex: 0.90 }}
            placeholder="Type a message...."
            value={messageText}
            onChangeText={setMessageText}
          />
          {messageText.length > 0 &&
            <TouchableOpacity onPress={() => {
              onSend()
            }}
              style={{ flex: 0.10 }}>
              <Icon name="send" size={30} color={greenPrimary} />
            </TouchableOpacity>}
        </View>
      </View> */}
      </HeaderView>

      <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:10,backgroundColor:bgColor01}}>
        <View style={{
          backgroundColor: white, height: 50, alignSelf: "center", borderRadius: 6, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", shadowColor: "#000", marginBottom: 20, borderRadius: 50, borderWidth: 1, borderColor: light_grey,
          width:"80%",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
          <TextInput
            multiline={true}
            style={{ color: black, fontSize: FontSize.FS_14, fontFamily: MEDIUM, flex: 0.90, }}
            placeholder="Type a message...."
            value={messageText}
            onChangeText={setMessageText}
          />
          
            <TouchableOpacity style={{ flex:0.10 }}>
          <Icon name="plus" size={30} color={greenPrimary} />
          
        </TouchableOpacity>
       
        </View>
        <View style={{width:"5%"}}>

        </View>
        {/* {messageText.length > 0 && */}
            <TouchableOpacity onPress={() => {
              onSend()
            }}
              style={{width:"15%",backgroundColor:greenPrimary,width:50,height:50,borderRadius:50,alignItems:"center",justifyContent:"center", marginBottom: 16,}}>
              <Icon name="send" size={30} color={white} />
            </TouchableOpacity>
            {/* } */}
            </View>

    </>
  );
};

export default ChatScreen;

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
  messageContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 4,
    marginHorizontal: 20,
    maxWidth: '70%',
    borderRadius: 8,
  },
  inboundMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  outboundMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: black,
    fontFamily: MEDIUM
  },
  timeText: {
    fontSize: 8,
    color: grey,
    fontFamily: REGULAR,
    textAlign: "right",
    marginTop: 4
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 20,
  },
});
