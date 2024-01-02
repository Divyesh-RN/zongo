
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black05 } from '@constants/Color';
import { black, disableColor, greenPrimary, grey, grey01, white, paleGreen, red } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Create_Auto_Attendant, Get_Audio_File_List, Get_Auto_Attendant_Details, Get_Auto_Attendant_Next_Id, Get_Destination_List, Get_Route_To_Destination, Update_Auto_Attendant, Update_Auto_Attendant_Options } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { resetAutoAttendantApiStatus } from '../../../redux/reducers/autoAttendantReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import LoadingView from '../../../commonComponents/LoadingView';
import { Log } from '../../../commonComponents/Log';
import AudioFileListBottomSheet from '../../../commonComponents/BottomSheet/AudioFIleListBottomSheet';
import { navigate } from '../../../navigation/RootNavigation';
import SingleTimeoutBottomSheet from '../../../commonComponents/BottomSheet/SingleTImeoutBottomSheet';
import { SINGLETIMEOUT } from '../../../constants/DATA/SingleTimeOut';
import SectionBottomSheet from '../../../commonComponents/BottomSheet/SectionBottomSheet';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';



const ManageAutoAttendant = ({ navigation, route }) => {

  const [isEdit, setIsEdit] = useState(route?.params?.isEdit ? true : false);
  const [AutoAttendantId, setAutoAttendantId] = useState('');
  const [AutoAttendantNextId, setAutoAttendantNextId] = useState(null);
  const [AutoAttendantName, setAutoAttendantName] = useState('');
  const [AutoAttendantNameError, setAutoAttendantNameError] = useState('');
  const [AutoAttendantNameEdit, setAutoAttendantNameEdit] = useState(false);

  const [SelectedAudioFileName, setSelectedAudioFileName] = useState('');
  const [SelectedAudioFile, setSelectedAudioFile] = useState(null);

  const [GreetinCallerSwitch, setGreetinCallerSwitch] = useState(false);
  const [AudioFileList, setAudioFileList] = useState([]);
  const [WelcomeMessageError, setWelcomeMessageError] = useState('');
  const [MainSelectedAudioFileName, setMainSelectedAudioFileName] = useState('');
  const [MainSelectedAudioFileId, setMainSelectedAudioFileId] = useState('');

  const [DirectDial, setDirectDial] = useState(false);

  const [SelectionTimeOut, setSelectionTimeOut] = useState(null);

  const [TimeoutAction, setTimeoutAction] = useState(null);
  const [TimeoutActionName, setTimeoutActionName] = useState("");

  const [CallerIdNameEdit, setCallerIdNameEdit] = useState(false);
  const [CallerIdNamePrefix, setCallerIdNamePrefix] = useState('');

  const [MaxAttempts, setMaxAttempts] = useState(null);

  const [InvalidDestination, setInvalidDestination] = useState(null);
  const [InvalidDestinationType, setInvalidDestinationType] = useState(null);
  const [InvalidDestinationValue, setInvalidDestinationValue] = useState(null);

  const [activeButton, setActiveButton] = useState(1);

  const [EditKeyPadOption, setEditKeyPadOption] = useState(false);
  const [DestinationTypeError, setDestinationTypeError] = useState("");
  const [DestinationType, setDestinationType] = useState("");
  const [DestinationTypeID, setDestinationTypeId] = useState("");
  const [Destination, setDestination] = useState("");
  const [DestinationError, setDestinationError] = useState("");
  const [DestinationId, setDestinationId] = useState("");


  const [AutoAttendantData, setAutoAttendantData] = useState(null);
  const [AutoAttendantOptData, setAutoAttendantOptData] = useState(null);
  const [SelectedAutoAttendantOptData, setSelectedAutoAttendantOptData] = useState(null);

  const [DestinationList, setDestinationList] = useState([]);

  const [buttonStyles, setButtonStyles] = useState({});


  const dispatch = useDispatch();

  const apiAutoAttendantDetails = useSelector(state => state.AutoAttendantRedux.apiAutoAttendantDetails);
  const apiCreateAutoAttendant = useSelector(state => state.AutoAttendantRedux.apiCreateAutoAttendant);
  const apiUpdateAutoAttendantOptions = useSelector(state => state.AutoAttendantRedux.apiUpdateAutoAttendantOptions);
  const apiUpdateAttendant = useSelector(state => state.AutoAttendantRedux.apiUpdateAttendant);
  const auto_attendant_next_id = useSelector(state => state.AutoAttendantRedux.auto_attendant_next_id);
  const apiGetAutoAttendantNextId = useSelector(state => state.AutoAttendantRedux.apiGetAutoAttendantNextId);
  const auto_attendant_details = useSelector(state => state.AutoAttendantRedux.auto_attendant_details);

  const apiAudioFileList = useSelector(state => state.audioRedux.apiAudioFileList);
  const audio_file_list = useSelector(state => state.audioRedux.audio_file_list,);

  const apiGetDestinationList = useSelector(state => state.generalRedux.apiGetDestinationList);
  const destination_list = useSelector(state => state.generalRedux.destination_list);

  const apiGetRouteToDestination = useSelector(state => state.generalRedux.apiGetRouteToDestination);
  const route_by_destination_list = useSelector(state => state.generalRedux.route_by_destination_list,);

  const isLoading = useSelector(state => state.AutoAttendantRedux.isLoader);
  const isError = useSelector(state => state.AutoAttendantRedux.isError);
  const error_message = useSelector(state => state.AutoAttendantRedux.error_message);
  const user_data = useSelector(state => state.userRedux.user_data);


  const CallAllApi = async () => {
    await GetAudioFileDropDown()

    await GetDestinationList()

    if (route?.params?.isEdit == false) {
      GetNextAutoAttendantID()
    } else {
      GetAutoAttendantDetails()

    }
  }

  const GetAutoAttendantDetails = () => {
    if (user_data !== null) {
      var dict = {};
      dict.createdby = user_data?.data?.user_uuid,
        dict.ivr_menu_uuid = route?.params?.item?.ivr_menu_uuid,
        dispatch(Get_Auto_Attendant_Details(dict))
    }
  }

  useFocusEffect(
    useCallback(() => {
      CallAllApi()
      return () => {
        dispatch(resetAutoAttendantApiStatus());
      };
    }, [route?.params?.item])
  )

  //Get Next Auto Attendant ID

  const GetNextAutoAttendantID = () => {
    var dict = {};
    dict.createdby = user_data?.data?.user_uuid,
      dict.main_admin_uuid = user_data?.data?.main_uuid
    dispatch(Get_Auto_Attendant_Next_Id(dict));
  }


  useEffect(() => {
    Log('apiGetAutoAttendantNextId :', apiGetAutoAttendantNextId);
    if (apiGetAutoAttendantNextId == STATUS_FULFILLED) {
      console.log('auto_attendant_next_id :', auto_attendant_next_id);
      if (auto_attendant_next_id !== null) {
        setAutoAttendantNextId(auto_attendant_next_id);
        setAutoAttendantId(auto_attendant_next_id?.extension)
      }
    } else if (apiGetAutoAttendantNextId == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetAutoAttendantNextId]);



  useEffect(() => {
    console.log('apiAutoAttendantDetails :', apiAutoAttendantDetails);
    if (apiAutoAttendantDetails == STATUS_FULFILLED) {
      console.log("auto_attendant_details :", auto_attendant_details)
      if (auto_attendant_details !== null) {
        setAutoAttendantData(auto_attendant_details?.ivr_data[0])
        setAutoAttendantOptData(auto_attendant_details?.ivr_option_data)


        const val = auto_attendant_details?.ivr_option_data?.filter(item => item.ivr_menu_option_digits == String(activeButton))
        setSelectedAutoAttendantOptData(val)
        if (val.length > 0) {
          const DestinationByRoute = ROUTE?.find(item => item.route === val[0]?.ivr_menu_option_action_type)?.value || "";
          setDestinationTypeId(val[0]?.ivr_menu_option_action_type)
          setDestinationType(DestinationByRoute)
          setDestination(val[0]?.ivr_menu_option_destination)
          setDestinationId(val[0]?.ivr_menu_option_action_uuid)
        }



        var data = auto_attendant_details?.ivr_data[0];
        setAutoAttendantId(data?.ivr_menu_extension)
        setAutoAttendantName(data?.ivr_menu_name)
        setMainSelectedAudioFileId(data?.ivr_menu_welcome_message)
        const name = audio_file_list?.find(item => item.recording_uuid === data?.ivr_menu_welcome_message)?.recording_name || "";
        setMainSelectedAudioFileName(name)
        setDirectDial(data?.ivr_menu_direct_dial == "TRUE" ? true : false)
        setSelectionTimeOut(data?.ivr_menu_timeout)
        setTimeoutAction(data?.ivr_menu_exit_action)
        const Actionname = destination_list?.find(item => item.value === data?.ivr_menu_exit_action)?.text || "";
        setTimeoutActionName(Actionname)
        setCallerIdNamePrefix(data?.ivr_menu_cid_prefix)
        setMaxAttempts(data?.ivr_menu_max_attempt)
        const destination = destination_list?.find(item => item.value === data?.ivr_menu_invalid_destination_type + "_" + data?.ivr_menu_invalid_destination)?.text || "";
        setInvalidDestination(destination)
        const destinationType = destination_list?.find(item => item.value === data?.ivr_menu_invalid_destination_type + "_" + data?.ivr_menu_invalid_destination)?.optgroup || "";
        setInvalidDestinationType(destinationType)
        setInvalidDestinationValue(data?.ivr_menu_invalid_destination_type + "_" + data?.ivr_menu_invalid_destination)
      }
    } else if (apiAutoAttendantDetails == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiAutoAttendantDetails]);

  useEffect(() => {
    // Create a mapping of ivr_menu_option_digits to background color
    console.log("AutoAttendantOptData :", AutoAttendantOptData)
    if (AutoAttendantOptData !== null) {
      const digitColorMap = {};
      AutoAttendantOptData.forEach((option) => {
        digitColorMap[option.ivr_menu_option_digits] = 'red';
      });
      console.log("digitColorMap", digitColorMap)
      // Set initial button styles based on the mapping
      const initialStyles = {};
      [1, 2, 3, 4, 5, 6, 7, 8, 9, '#', 0, '*'].forEach((button) => {
        initialStyles[button] = {
          backgroundColor: digitColorMap[button] ? paleGreen : grey,
          color: digitColorMap[button] ? greenPrimary : white,
        };
      });
      console.log("initialStyles ", initialStyles)
      setButtonStyles(initialStyles);
    }
  }, [AutoAttendantOptData]);



  //Get Audio File DropDown List
  const GetAudioFileDropDown = () => {
    var dict = {};
    dict.type = 'ivr',
      dict.createdby = user_data?.data?.user_uuid,
      dispatch(Get_Audio_File_List(dict));
  }


  useEffect(() => {
    Log('apiAudioFileList :', apiAudioFileList);
    if (apiAudioFileList == STATUS_FULFILLED) {
      console.log('audio_file_list :', audio_file_list);
      if (audio_file_list !== null) {
        setAudioFileList(audio_file_list);

      }
    } else if (apiAudioFileList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiAudioFileList]);


  //Get destination list

  const GetDestinationList = () => {
    var dict = {};
    dict.type = "",
      dict.createdby = user_data?.data?.user_uuid
    dispatch(Get_Destination_List(dict));
  }


  useEffect(() => {
    Log('apiGetDestinationList :', apiGetDestinationList);
    if (apiGetDestinationList == STATUS_FULFILLED) {
      console.log('destination_list', destination_list);
      if (destination_list !== null) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        setDestinationList(destination_list)
        //   const extensionNameViaId = destination_list?.find(item => item.value.toLowerCase() === (FailOverDesMaxWaitType + "_" + FailOverDesMaxWaitValue).toLowerCase())?.text || "";
        //   setFailOverDesMaxWait(extensionNameViaId) // set extension name
        //   const routeValByName = destination_list?.find(item => item.value.toLowerCase() === (FailOverDesMaxWaitType + "_" + FailOverDesMaxWaitValue).toLowerCase())?.optgroup || "";
        //   setFailOverDesMaxWaitTypeName(routeValByName) // set his route capital
        //  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        //   GetAdminVoiceMail()


      }
    } else if (apiGetDestinationList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetDestinationList]);

  const RouteToDestination = (route) => {
    var dict = {};
    dict.createdby = user_data?.data?.user_uuid,
      dict.main_uuid = user_data?.data?.main_uuid
    dict.type = route
    dispatch(Get_Route_To_Destination(dict));

  };

  useEffect(() => {
    Log('apiGetRouteToDestination :', apiGetRouteToDestination);
    if (apiGetRouteToDestination == STATUS_FULFILLED) {
      console.log('route_by_destination_list :', route_by_destination_list);
      if (route_by_destination_list !== null) {
        setDestinationList(route_by_destination_list);
        // const DestinationByRoute = route_by_destination_list?.find(item => item.value === DestinationValue)?.text || "";
        // setDestinationTo(DestinationByRoute)
      }
    } else if (apiGetRouteToDestination == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetRouteToDestination]);

  const UpdateAutoAttandantOptions = () => {
    if (DestinationTypeID == "") {
      setDestinationTypeError("* Please select a destination type")
    }
    else if (Destination == "") {
      setDestinationError("* Please select a destination")
    }
    else {
      var dict = {};
      dict.createdby = user_data?.data?.user_uuid,
        dict.main_admin_uuid = user_data?.data?.main_uuid
      dict.user_uuid = user_data?.data?.user_uuid
      dict.ivr_menu_option_action_type = DestinationTypeID
      dict.ivr_menu_option_action_uuid = DestinationId
      dict.ivr_menu_option_destination = Destination
      dict.ivr_menu_option_digits = activeButton
      dict.ivr_menu_option_uuid = SelectedAutoAttendantOptData[0]?.ivr_menu_option_uuid == undefined ? null : SelectedAutoAttendantOptData[0]?.ivr_menu_option_uuid
      dict.ivr_menu_uuid = AutoAttendantData?.ivr_menu_uuid
      console.log("OPTION UPDATE : ", dict)
      dispatch(Update_Auto_Attendant_Options(dict));
    }
  }


  useEffect(() => {
    Log('apiUpdateAutoAttendantOptions :', apiUpdateAutoAttendantOptions);
    if (apiUpdateAutoAttendantOptions == STATUS_FULFILLED) {
      CallAllApi()
      setEditKeyPadOption(false);

    } else if (apiUpdateAutoAttendantOptions == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiUpdateAutoAttendantOptions]);

  const UpdateAutoAttandant = () => {
    var invalid_destination = InvalidDestinationValue.split('_')
    if (AutoAttendantName == "") {
      setAutoAttendantNameError("* Please enter a auto-attendant name")
    }
    else {
      var dict = {};

      dict.attribute = "",
        dict.createdby = user_data?.data?.user_uuid,
        dict.ivr_menu_cid_prefix = CallerIdNamePrefix,
        dict.ivr_menu_direct_dial = DirectDial == true ? "TRUE" : "FALSE"
      dict.ivr_menu_enabled = AutoAttendantData?.ivr_menu_enabled,
        dict.ivr_menu_exit_action = TimeoutAction,
        dict.ivr_menu_exit_sound = AutoAttendantData?.ivr_menu_exit_sound,
        dict.ivr_menu_extension = AutoAttendantId,
        dict.ivr_menu_greet_short = AutoAttendantData?.ivr_menu_greet_short,
        dict.ivr_menu_invalid_destination = invalid_destination[1],
        dict.ivr_menu_invalid_destination_type = invalid_destination[0],
        dict.ivr_menu_invalid_sound = AutoAttendantData?.ivr_menu_invalid_sound,
        dict.ivr_menu_max_attempt = MaxAttempts,
        dict.ivr_menu_max_failures = AutoAttendantData?.ivr_menu_max_failures,
        dict.ivr_menu_name = AutoAttendantName,
        dict.ivr_menu_options = AutoAttendantOptData,
        dict.ivr_menu_pin_number = AutoAttendantData?.ivr_menu_pin_number,
        dict.ivr_menu_timeout = SelectionTimeOut,
        dict.ivr_menu_uuid = AutoAttendantData?.ivr_menu_uuid,
        dict.ivr_menu_welcome_message = MainSelectedAudioFileId,
        dict.main_admin_uuid = user_data?.data?.main_uuid
      dict.user_uuid = user_data?.data?.user_uuid
      console.log(" UPDATE AUTO-ATTENDANT : ", dict)
      dispatch(Update_Auto_Attendant(dict));
    }
  }


  useEffect(() => {
    Log('apiUpdateAttendant :', apiUpdateAttendant);
    if (apiUpdateAttendant == STATUS_FULFILLED) {
      CallAllApi()
    } else if (apiUpdateAttendant == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiUpdateAttendant]);

  const CreateAutoAttandant = () => {
    if (AutoAttendantName == "") {
      setAutoAttendantNameError("* Please enter a auto-attendant name")
    }
    if (MainSelectedAudioFileName == '') {
      setWelcomeMessageError("* Please select welcome message")
    }
    else {
      var dict = {};

      dict.createdby = user_data?.data?.user_uuid,
        dict.ivr_menu_cid_prefix = CallerIdNamePrefix,
        dict.ivr_menu_direct_dial = DirectDial == true ? "TRUE" : "FALSE"
      dict.ivr_menu_enabled = "TRUE",
        dict.ivr_menu_exit_action = "",
        dict.ivr_menu_exit_sound = "",
        dict.ivr_menu_extension = AutoAttendantId,
        dict.ivr_menu_invalid_destination = "00000000-0000-0000-0000-000000000000",
        dict.ivr_menu_invalid_destination_type = "",
        dict.ivr_menu_invalid_sound = "",
        dict.ivr_menu_max_attempt = "3",
        dict.ivr_menu_max_failures = "",
        dict.ivr_menu_max_timeouts = "",
        dict.ivr_menu_name = AutoAttendantName,
        dict.ivr_menu_pin_number = "",
        dict.ivr_menu_timeout = "5",
        dict.ivr_menu_welcome_message = MainSelectedAudioFileId,
        dict.main_admin_uuid = user_data?.data?.main_uuid
      dict.user_uuid = user_data?.data?.user_uuid
      console.log(" CREATE AUTO-ATTENDANT : ", dict)
      dispatch(Create_Auto_Attendant(dict));
    }

  }


  useEffect(() => {
    Log('apiCreateAutoAttendant :', apiCreateAutoAttendant);
    if (apiCreateAutoAttendant == STATUS_FULFILLED) {
      goBack()
    } else if (apiCreateAutoAttendant == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiCreateAutoAttendant]);

  const AudioFilebottomSheetRef = useRef(null);
  const openAudioFileoBottomSheet = () => {
    if (AudioFilebottomSheetRef.current) {
      AudioFilebottomSheetRef.current.open();
    }
  };

  const SelectionTimeoutBottomSheetRef = useRef(null);
  const openSelectionTimeoutBottomSheet = () => {
    if (SelectionTimeoutBottomSheetRef.current) {
      SelectionTimeoutBottomSheetRef.current.open();
    }
  };
  const MaxAttemptsBottomSheetRef = useRef(null);
  const openMaxAttemptsBottomSheet = () => {
    if (MaxAttemptsBottomSheetRef.current) {
      MaxAttemptsBottomSheetRef.current.open();
    }
  };

  const MAXATTEMPTS = [
    {
      id: 1,
      value: 1,
    },
    {
      id: 2,
      value: 2,
    },
    {
      id: 3,
      value: 3,
    },
    {
      id: 4,
      value: 4,
    },
    {
      id: 5,
      value: 5,
    },
    {
      id: 6,
      value: 6,
    },
    {
      id: 7,
      value: 7,
    },
    {
      id: 8,
      value: 8,
    },
    {
      id: 9,
      value: 9,
    },
    {
      id: 10,
      value: 10,
    },
    {
      id: 11,
      value: 11,
    },
    {
      id: 12,
      value: 12,
    },
  ];

  const TimeoutActionRef = useRef(null)
  const openTimeoutActionBottomSheet = () => {
    if (TimeoutActionRef.current) {
      TimeoutActionRef.current.open();
    }
  };


  const InvalidDestinationRef = useRef(null)
  const openInvalidDestinationBottomSheet = () => {
    if (InvalidDestinationRef.current) {
      InvalidDestinationRef.current.open();
    }
  };



  const DestinationTypebottomSheetRef = useRef(null);
  const openDestinationTypeBottomSheet = () => {
    if (DestinationTypebottomSheetRef.current) {
      DestinationTypebottomSheetRef.current.open();
    }
  };


  const DestinationobottomSheetRef = useRef(null);
  const openDestinationBottomSheet = () => {
    if (DestinationobottomSheetRef.current) {
      DestinationobottomSheetRef.current.open();
    }
  };

  const handleButtonClick = (button) => {
    setDestinationError("")
    setDestinationTypeError("")
    setActiveButton(button);
    const data = AutoAttendantOptData?.filter(item => item.ivr_menu_option_digits == String(button))
    console.log("data", data)
    setSelectedAutoAttendantOptData(data)
    if (data?.length > 0) {
      const DestinationByRoute = ROUTE?.find(item => item.route === data[0]?.ivr_menu_option_action_type)?.value || "";
      setDestinationTypeId(data[0]?.ivr_menu_option_action_type)
      setDestinationType(DestinationByRoute)
      setDestination(data[0]?.ivr_menu_option_destination)
      setDestinationId(data[0]?.ivr_menu_option_action_uuid)
    }
    else {
      setDestinationTypeId("")
      setDestinationType("")
      setDestination("")
      setDestinationId("")
    }
  };

  return (
    <>
      <HeaderView
        title={'Zongo'}
        isProfilePic={true}
        imgUri={
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        }
        containerStyle={{
          marginHorizontal: pixelSizeHorizontal(0),
        }}>
        <View style={{ marginHorizontal: 20 }}>
          <HeaderBackView
            title="Manage Auto-Ateendant"
            isBack={true}
            onPressBack={() => {
              goBack();
            }}
            onPressMenu={() => {
              navigation.toggleDrawer();
            }}
          />
          <View style={{ marginTop: 0, marginBottom: 40 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <Text
                style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>
                {'Auto-Attendant ID'}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: SEMIBOLD,
                }}>
                {AutoAttendantId}
              </Text>
            </View>
            <Text style={{
              fontSize: FontSize.FS_14,
              color: black,
              fontFamily: SEMIBOLD,
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginHorizontal: -20,
              backgroundColor: "#f0f0f0b5"
            }}>{"General"}</Text>
            <View style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: disableColor,
              marginHorizontal: -20,
            }}>

              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View>

                  <Text style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                  }}>{"Auto-Attendant Name"}</Text>
                  <Text style={{
                    fontSize: FontSize.FS_11,
                    color: grey,
                    fontFamily: MEDIUM,
                    marginTop: 4
                  }}>{AutoAttendantName}</Text>
                </View>
                {AutoAttendantNameEdit == false &&
                  <TouchableOpacity onPress={() => {
                    setAutoAttendantNameEdit(!AutoAttendantNameEdit)
                  }}>
                    <Icon name={"pencil"} size={22} color={black} />
                  </TouchableOpacity>
                }
              </View>
              {AutoAttendantNameEdit == true &&
                <View style={{
                  marginTop: 14,
                  flexDirection: "row", alignItems: "center"
                }}>
                  <TextInput
                    value={AutoAttendantName}
                    placeholder='Enter Auto Attendant Name'
                    placeholderTextColor={grey01}
                    style={{
                      fontFamily: MEDIUM,
                      fontSize: FontSize.FS_12,
                      borderWidth: 1,
                      borderColor: grey01,
                      height: 40,
                      borderRadius: 6,
                      paddingHorizontal: 14,
                      flex: 1

                    }}
                    onChangeText={(txt) => {
                      setAutoAttendantName(txt)
                      setAutoAttendantNameError("")
                    }}
                  />
                  <TouchableOpacity onPress={() => {
                    setAutoAttendantNameEdit(false)
                  }}
                    style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                    <Icon name="check" size={22} color={white} />
                  </TouchableOpacity>
                </View>
              }
              {AutoAttendantNameError !== "" && <Text
                style={{
                  fontSize: FontSize.FS_10,
                  color: red,
                  fontFamily: MEDIUM,
                  marginTop: 8

                }}>
                {AutoAttendantNameError}
              </Text>}
            </View>
            <View
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                  }}>
                  {'Welcome Message'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate("ManageAudioFiles", { type: "ivr", isEdit: false })
                  }}
                  style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: FontSize.FS_12,
                      color: grey,
                      fontFamily: SEMIBOLD,
                    }}>
                    {'Upload'}
                  </Text>
                  <Icon name="cloud-upload-outline" size={22} color={grey} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  openAudioFileoBottomSheet();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  borderWidth: 1.5,
                  borderColor: grey,
                  borderRadius: 4,
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                }}>
                <Text
                  style={{
                    fontSize: FontSize.FS_11,
                    color: grey,
                    fontFamily: MEDIUM,
                  }}>
                  {MainSelectedAudioFileName == ''
                    ? 'Choose Music On Hold file'
                    : MainSelectedAudioFileName}
                </Text>
                <Icon name="chevron-down" size={22} color={grey} />
              </TouchableOpacity>
              {WelcomeMessageError !== "" && <Text
                style={{
                  fontSize: FontSize.FS_10,
                  color: red,
                  fontFamily: MEDIUM,
                  marginTop: 8

                }}>
                {WelcomeMessageError}</Text>}
            </View>

            <View style={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: disableColor,
              marginHorizontal: -20,
            }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View>
                  <Text style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                  }}>{"Enable Direct Dial"}</Text>
                  <Text style={{
                    fontSize: FontSize.FS_10,
                    color: black,
                    fontFamily: SEMIBOLD,
                    marginLeft: 1
                  }}>{DirectDial == true ? "YES" : "NO"}</Text>
                </View>
                <Switch style={{ marginRight: -10 }}
                  trackColor={{ false: '#767577', true: greenPrimary }}
                  thumbColor={DirectDial ? white : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(val) => {
                    setDirectDial(val)
                  }}
                  value={DirectDial}
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => {
              openSelectionTimeoutBottomSheet()
            }}
              style={{

                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <Text style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>{"Selection Timeout"}</Text>
                <Icon name="chevron-down" size={22} color={black} />
              </View>
              <Text style={{
                fontSize: FontSize.FS_11,
                color: grey,
                fontFamily: MEDIUM,
              }}>{SelectionTimeOut == null ? "Select Timeout" : SelectionTimeOut}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              openTimeoutActionBottomSheet()
            }}
              style={{

                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <Text style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>{"Timeout Action"}</Text>
                <Icon name="chevron-down" size={22} color={black} />
              </View>
              <Text style={{
                fontSize: FontSize.FS_11,
                color: grey,
                fontFamily: MEDIUM,
              }}>{TimeoutActionName == "" ? "Select Time out Action" : TimeoutActionName}</Text>
            </TouchableOpacity>
            <View style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: disableColor,
              marginHorizontal: -20,
            }}>

              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View>

                  <Text style={{
                    fontSize: FontSize.FS_12,
                    color: black,
                    fontFamily: MEDIUM,
                  }}>{"Caller ID Name Prefix"}</Text>
                  <Text style={{
                    fontSize: FontSize.FS_11,
                    color: grey,
                    fontFamily: MEDIUM,
                    marginTop: 4
                  }}>{CallerIdNamePrefix == "" ? "None" : CallerIdNamePrefix}</Text>
                </View>
                {CallerIdNameEdit == false &&
                  <TouchableOpacity onPress={() => {
                    setCallerIdNameEdit(!CallerIdNameEdit)
                  }}>
                    <Icon name={"pencil"} size={22} color={black} />
                  </TouchableOpacity>
                }
              </View>
              {CallerIdNameEdit == true &&
                <View style={{
                  marginTop: 14,
                  flexDirection: "row", alignItems: "center"
                }}>
                  <TextInput
                    value={CallerIdNamePrefix}
                    placeholder='Enter Caller ID Name'
                    placeholderTextColor={grey01}
                    style={{
                      fontFamily: MEDIUM,
                      fontSize: FontSize.FS_12,
                      borderWidth: 1,
                      borderColor: grey01,
                      height: 40,
                      borderRadius: 6,
                      paddingHorizontal: 14,
                      flex: 1
                    }}
                    onChangeText={(txt) => {
                      setCallerIdNamePrefix(txt)
                    }}
                  />
                  <TouchableOpacity onPress={() => {
                    setCallerIdNameEdit(false)
                  }}
                    style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                    <Icon name="check" size={22} color={white} />
                  </TouchableOpacity>
                </View>
              }
            </View>
            <TouchableOpacity onPress={() => {
              openMaxAttemptsBottomSheet()
            }}
              style={{

                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <Text style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>{"Max Attempts"}</Text>
                <Icon name="chevron-down" size={22} color={black} />
              </View>
              <Text style={{
                fontSize: FontSize.FS_11,
                color: grey,
                fontFamily: MEDIUM,
              }}>{MaxAttempts == null ? "Select Max Attempts" : MaxAttempts}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              openInvalidDestinationBottomSheet()
            }}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <Text style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>{"Invalid Destination"}</Text>
                <Icon name="chevron-down" size={22} color={black} />
              </View>
              <Text style={{
                fontSize: FontSize.FS_11,
                color: grey,
                fontFamily: MEDIUM,
              }}>{InvalidDestination == null ? "Select Invalid Destination" : InvalidDestinationType + " - " + InvalidDestination}</Text>
            </TouchableOpacity>
            <Text style={{
              fontSize: FontSize.FS_14,
              color: black,
              fontFamily: SEMIBOLD,
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginHorizontal: -20,
              backgroundColor: "#f0f0f0b5"
            }}>{"Keypad Options"}</Text>

            <View style={styles.container}>
              <View style={styles.row}>
                {[1, 2, 3].map((button) => (
                  <TouchableOpacity
                    key={button}
                    style={[styles.button, activeButton === button ? styles.activeButton : { backgroundColor: buttonStyles[button]?.backgroundColor? buttonStyles[button]?.backgroundColor : grey }]}
                    // style={[styles.button, { backgroundColor: buttonStyles[button]?.backgroundColor,color : buttonStyles[button]?.color }]}
                    onPress={() => handleButtonClick(button)}
                  >
                    <Text key={button} style={[styles.KeypadText, activeButton === button ? styles.ActiveKeypadText : { color: buttonStyles[button]?.color? buttonStyles[button]?.color : white }]}>{button}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                {[4, 5, 6].map((button) => (
                  <TouchableOpacity
                    key={button}
                    style={[styles.button, activeButton === button ? styles.activeButton : { backgroundColor: buttonStyles[button]?.backgroundColor? buttonStyles[button]?.backgroundColor : grey }]}
                    onPress={() => handleButtonClick(button)}
                  >
                    <Text key={button} style={[styles.KeypadText, activeButton === button ? styles.ActiveKeypadText : { color:buttonStyles[button]?.color? buttonStyles[button]?.color : white}]}>{button}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                {[7, 8, 9].map((button) => (
                  <TouchableOpacity
                    key={button}
                    style={[styles.button, activeButton === button ? styles.activeButton : { backgroundColor:buttonStyles[button]?.backgroundColor? buttonStyles[button]?.backgroundColor : grey }]}
                    onPress={() => handleButtonClick(button)}
                  >
                    <Text key={button} style={[styles.KeypadText, activeButton === button ? styles.ActiveKeypadText : { color:buttonStyles[button]?.color? buttonStyles[button]?.color : white}]}>{button}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                {['#', 0, '*'].map((button) => (
                  <TouchableOpacity
                    key={button}
                    style={[styles.button, activeButton === button ? styles.activeButton : { backgroundColor: buttonStyles[button]?.backgroundColor? buttonStyles[button]?.backgroundColor : grey }]}
                    onPress={() => handleButtonClick(button)}
                  >
                    <Text key={button} style={[styles.KeypadText, activeButton === button ? styles.ActiveKeypadText : { color: buttonStyles[button]?.color? buttonStyles[button]?.color : white }]}>{button}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                marginHorizontal: -20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <View style={{ backgroundColor: greenPrimary, width: 40, borderRadius: 20, height: 40, alignItems: "center", justifyContent: "center" }}>
                    <Text
                      style={{
                        fontSize: FontSize.FS_15,
                        color: white,
                        fontFamily: SEMIBOLD,
                      }}>
                      {activeButton}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text
                      style={{
                        fontSize: FontSize.FS_12,
                        color: black,
                        fontFamily: SEMIBOLD,
                      }}>
                      {'Destination Type - Destination'}
                    </Text>
                    <Text
                      style={{
                        fontSize: FontSize.FS_11,
                        color: grey,
                        fontFamily: MEDIUM,
                        marginTop: 4,
                      }}>
                      {EditKeyPadOption == false ? "Click to Edit" : DestinationType == "" ? 'None' : DestinationType}
                      {EditKeyPadOption == false ? "" : ' - '}
                      {EditKeyPadOption == false ? "" : Destination == "" ? 'None' : Destination}
                    </Text>
                  </View>
                </View>
                {EditKeyPadOption == false && (
                  <TouchableOpacity
                    onPress={() => {
                      setEditKeyPadOption(!EditKeyPadOption);
                    }}>
                    <Icon name={'pencil'} size={22} color={black} />
                  </TouchableOpacity>
                )}
              </View>
              {EditKeyPadOption == true && (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      openDestinationTypeBottomSheet();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: grey,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginVertical: 10,
                      borderRadius: 6,
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: FontSize.FS_11,
                        color: grey,
                        fontFamily: MEDIUM,
                      }}>
                      {DestinationType == "" || DestinationType == undefined ? 'Select Type' : DestinationType}
                    </Text>
                    <Icon name={'chevron-down'} size={18} color={grey} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      openDestinationBottomSheet();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: grey,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginVertical: 10,
                      marginLeft: 10,
                      borderRadius: 6,
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: FontSize.FS_11,
                        color: grey,
                        fontFamily: MEDIUM,
                      }}>
                      {Destination == "" ? 'Select Destination' : Destination}
                    </Text>
                    <Icon name={'chevron-down'} size={18} color={grey} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      UpdateAutoAttandantOptions()
                    }}
                    style={{
                      backgroundColor: greenPrimary,
                      height: 34,
                      width: 34,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      marginLeft: 10,
                    }}>
                    <Icon name="check" size={22} color={white} />
                  </TouchableOpacity>
                </View>
              )}
              {DestinationError !== "" && <Text
                style={{
                  fontSize: FontSize.FS_10,
                  color: red,
                  fontFamily: MEDIUM,
                  marginTop: 8

                }}>
                {DestinationError}
              </Text>
              }
              {DestinationTypeError !== "" && <Text
                style={{
                  fontSize: FontSize.FS_10,
                  color: red,
                  fontFamily: MEDIUM,
                  marginTop: 8

                }}>
                {DestinationTypeError}
              </Text>
              }
            </View>

            <TouchableOpacity onPress={() => {
              if (route?.params?.isEdit == true) {
                UpdateAutoAttandant()
              }
              else {
                CreateAutoAttandant()
              }
            }}
              style={{
                backgroundColor: greenPrimary,
                alignItems: "center",
                paddingVertical: 10,
                marginVertical: 40,
                justifyContent: "center",
                borderRadius: 4,
                width: "100%"
              }}>
              <Text style={{
                fontSize: FontSize.FS_14,
                color: white,
                fontFamily: SEMIBOLD,
                lineHeight: 24,
                marginLeft: 10
              }}>{isEdit ? "Update" : "Add New Auto-Attendant"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AudioFileListBottomSheet
          headerTitle={'Please select welcome message'}
          AudioFileList={AudioFileList}
          CurrantId={MainSelectedAudioFileId}
          bottomSheetRef={AudioFilebottomSheetRef}
          selectedValue={data => {
            setMainSelectedAudioFileName(data);
            setWelcomeMessageError("")
          }}
          selectedId={data => {
            setMainSelectedAudioFileId(data);
          }}
        />
        <SingleTimeoutBottomSheet
          data={SINGLETIMEOUT}
          headerTitle={'Selection Time Out'}
          bottomSheetRef={SelectionTimeoutBottomSheetRef}
          selectedValue={data => {
            setSelectionTimeOut(data);
          }}
        />

        {destination_list !== null && <SectionBottomSheet
          data={DestinationList}
          headerTitle={'Timeout Action'}
          currentValue={TimeoutAction}
          bottomSheetRef={TimeoutActionRef}
          selectedValue={data => {
            setTimeoutActionName(data)
          }}
          selectedRoute={data => {
            setTimeoutAction(data)
          }}
          selectedRouteType={data => { }}
        />
        }
        <SingleTimeoutBottomSheet
          data={MAXATTEMPTS}
          headerTitle={'Max Attempts'}
          bottomSheetRef={MaxAttemptsBottomSheetRef}
          selectedValue={data => {
            setMaxAttempts(data);
          }}
        />

        {destination_list !== null && <SectionBottomSheet
          data={DestinationList}
          headerTitle={'Invalid Destination'}
          currentValue={InvalidDestinationValue}
          bottomSheetRef={InvalidDestinationRef}
          selectedValue={data => {
            setInvalidDestination(data)
          }}
          selectedRoute={data => {
            setInvalidDestinationValue(data)
          }}
          selectedRouteType={data => { setInvalidDestinationType(data) }}
        />
        }

        <RouteDestinationBottomSheet
          data={ROUTE}
          headerTitle={'Select Destination Type'}
          currentValue={DestinationTypeID}
          bottomSheetRef={DestinationTypebottomSheetRef}
          selectedValue={data => {
            console.log("Destination Type", data)
            setDestinationType(data);
            setDestinationTypeError("")

          }}
          selectedRoute={data => {
            console.log("Destination Type ID ", data)
            setDestinationTypeError("")
            setDestinationTypeId(data)
            RouteToDestination(data)
          }}
        />

        <DestinationBottomSheet
          data={DestinationList}
          headerTitle={'Select Destination'}
          currentValue={DestinationId}
          bottomSheetRef={DestinationobottomSheetRef}
          selectedValue={data => {
            setDestination(data);
            setDestinationError("")
          }}
          selectedDestination={data => {
            setDestinationId(data)
            setDestinationError("")
          }}
        />
      </HeaderView>
      {isLoading && <LoadingView />}
    </>
  );
};

export default ManageAutoAttendant;

const styles = StyleSheet.create({
  KeypadText: {
    fontFamily: MEDIUM,
    fontSize: FontSize.FS_14,
    color: greenPrimary
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: black05
  },
  modalView: {
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
  container: {
    justifyContent: 'center',
    marginVertical: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: grey
  },
  activeButton: {
    backgroundColor: greenPrimary,
  },
  KeypadText: {
    fontFamily: MEDIUM,
    fontSize: FontSize.FS_14,
    color: white
  },
  ActiveKeypadText: {
    fontFamily: MEDIUM,
    fontSize: FontSize.FS_14,
    color: white
  },
});
