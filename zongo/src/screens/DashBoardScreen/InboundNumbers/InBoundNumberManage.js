import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { black, disableColor, greenPrimary, grey, grey01, red, white } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { Get_Did_Routing, Get_Music_On_Hold_File, Get_Route_To_Destination, Update_Inbound_Number } from '../../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import AudioFileListBottomSheet from '../../../commonComponents/BottomSheet/AudioFIleListBottomSheet';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import LoadingView from '../../../commonComponents/LoadingView';
import { resetInboundApiStatus } from '../../../redux/reducers/inboundReducer';

const InBoundNumberManage = ({ navigation, route }) => {
  const [isEdit, setIsEdit] = useState(route?.params.isEdit ? true : false);
  const [InBoundNumberData, setInBoundNumberData] = useState(route?.params.item);
  const [InboundDescriptionEdit, setInboundDescriptionEdit] = useState(false);
  const [InboundDescription, setInboundDescription] = useState(route?.params.item?.description);

  const [RouteDestinationEdit, setRouteDestinationEdit] = useState(false);
  const [RouteTo, setRouteTo] = useState('');
  const [RouteValue, setRouteValue] = useState('');

  const [DestinationTo, setDestinationTo] = useState('');
  const [DestinationToError, setDestinationToError] = useState('');
  const [DestinationValue, setDestinationValue] = useState('');
  const [DestinationList, setDestinationList] = useState([]);

  const [MusicOnHoldFileList, setMusicOnHoldFileList] = useState([]);
  const [MusicOnHoldFileName, setMusicOnHoldFileName] = useState('');
  const [MusicOnHoldFileId, setMusicOnHoldFileId] = useState('');

  const dispatch = useDispatch()
  const apiGetMusicOnHoldFile = useSelector(state => state.audioRedux.apiGetMusicOnHoldFile,);
  const music_on_hold_file_list = useSelector(state => state.audioRedux.music_on_hold_file_list);
  const did_routing_data = useSelector(state => state.inboundRedux.did_routing_data);
  const apiGetDidRouting = useSelector(state => state.inboundRedux.apiGetDidRouting);
  const apiUpdateInboundNumber = useSelector(state => state.inboundRedux.apiUpdateInboundNumber);
  const apiGetRouteToDestination = useSelector(
    state => state.generalRedux.apiGetRouteToDestination,
  );
  const route_by_destination_list = useSelector(
    state => state.generalRedux.route_by_destination_list,
  );
  const user_data = useSelector(state => state.userRedux.user_data);
  const isLoading = useSelector(state => state.inboundRedux.isLoader);
  const isError = useSelector(state => state.inboundRedux.isError);
  const error_message = useSelector(state => state.inboundRedux.error_message);
  //Get Music On Hold list
  useEffect(() => {
    GetDidRoutingData()
    return () => {
      dispatch(resetInboundApiStatus());
    };
  }, []);



  const GetMusicOnHoldList = () => {
    var dict = {};
    dict.createdby = user_data?.data?.user_uuid
    dict.main_admin_uuid = user_data?.data?.main_uuid
    dispatch(Get_Music_On_Hold_File(dict));
  }

  useEffect(() => {
    Log('apiGetMusicOnHoldFile :', apiGetMusicOnHoldFile);
    if (apiGetMusicOnHoldFile == STATUS_FULFILLED) {
      if (music_on_hold_file_list !== null) {
        setMusicOnHoldFileList(music_on_hold_file_list)
        const setMohName = music_on_hold_file_list?.find(item => item.recording_uuid == (MusicOnHoldFileId))?.recording_name || "";
        setMusicOnHoldFileName(setMohName)
      }
    } else if (apiGetMusicOnHoldFile == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetMusicOnHoldFile]);

  const GetDidRoutingData = () => {
    var dict = {};
    dict.createdby = user_data?.data?.user_uuid
    dict.did_uuid = route?.params.item?.uuid
    dispatch(Get_Did_Routing(dict));
  }

  useEffect(() => {
    Log('apiGetDidRouting :', apiGetDidRouting);
    if (apiGetDidRouting == STATUS_FULFILLED) {
      if (did_routing_data !== null) {
        setRouteValue(did_routing_data["0"]?.did_action_type)

        const routeValByName = ROUTE?.find(item => (item.route) == (did_routing_data["0"]?.did_action_type))?.value || "";
        setRouteTo(routeValByName)
        setDestinationTo(did_routing_data?.route_val)
        setMusicOnHoldFileId(did_routing_data["0"]?.music_on_hold)
        GetMusicOnHoldList()
      }
    } else if (apiGetDidRouting == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetDidRouting]);

  // Get ROute To Destination List
  useEffect(() => {
    if (RouteValue !== "") {
      var dict = {};
      dict.createdby = user_data?.data?.user_uuid,
        dict.main_uuid = user_data?.data?.main_uuid
      dict.type = RouteValue
      dispatch(Get_Route_To_Destination(dict));
    }
  }, [RouteValue]);

  useEffect(() => {
    Log('apiGetRouteToDestination :', apiGetRouteToDestination);
    if (apiGetRouteToDestination == STATUS_FULFILLED) {
      if (route_by_destination_list !== null) {
        setDestinationList(route_by_destination_list);
        const DestinationByRoute = route_by_destination_list?.find(item => item.text === DestinationTo)?.value || "";
        setDestinationValue(DestinationByRoute)
      }
    } else if (apiGetRouteToDestination == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetRouteToDestination]);

  const UpdateInboundNumber = () => {
    var dict = {

      createdby: user_data?.data?.user_uuid,
      description: InboundDescription,
      main_uuid: user_data?.data?.main_uuid,
      did_action_type: RouteValue,
      did_action_uuid: DestinationValue,
      did_uuid: InBoundNumberData?.uuid,
      music_on_hold: MusicOnHoldFileId,
      route_and_destination: {
        did_uuid: InBoundNumberData?.uuid,
        did_action_type: RouteValue,
        did_action_uuid: DestinationValue,
        description: InboundDescription,
        music_on_hold: MusicOnHoldFileId,
        route_val: DestinationTo,
        createdby: user_data?.data?.user_uuid,
        main_uuid: user_data?.data?.main_uuid,
      },
      route_val: DestinationTo
    };
    dispatch(Update_Inbound_Number(dict));
  }

  useEffect(() => {
    Log('apiUpdateInboundNumber :', apiUpdateInboundNumber);
    if (apiUpdateInboundNumber == STATUS_FULFILLED) {
      goBack()
    } else if (apiUpdateInboundNumber == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiUpdateInboundNumber]);

  const AudioFilebottomSheetRef = useRef(null);
  const openAudioFileoBottomSheet = () => {
    if (AudioFilebottomSheetRef.current) {
      AudioFilebottomSheetRef.current.open();
    }
  };

  const RouteTobottomSheetRef = useRef(null);
  const openRouteToBottomSheet = () => {
    if (RouteTobottomSheetRef.current) {
      RouteTobottomSheetRef.current.open();
    }
  };

  const DestinationTobottomSheetRef = useRef(null);
  const openDestinationToBottomSheet = () => {
    if (DestinationTobottomSheetRef.current) {
      DestinationTobottomSheetRef.current.open();
    }
  };

  return (
    <>
      <HeaderBackView
        title="Manage Inbound Number"
        isBack={true}
        onPressBack={() => {
          goBack();
        }}
        onPressMenu={() => {
          navigation.toggleDrawer();
        }}
      />

      <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
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
            {'Inbound Number'}
          </Text>
          <Text
            style={{
              fontSize: FontSize.FS_12,
              color: black,
              fontFamily: SEMIBOLD,
            }}>
            {route?.params?.item?.did_number}
          </Text>
        </View>
        <Text
          style={{
            fontSize: FontSize.FS_14,
            color: black,
            fontFamily: SEMIBOLD,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: -20,
            backgroundColor: '#f0f0f0b5',
          }}>
          {'General'}
        </Text>
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
            <View>
              <Text
                style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>
                {'Description'}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.FS_11,
                  color: grey,
                  fontFamily: MEDIUM,
                  marginTop: 4,
                }}>
                {InboundDescription}
              </Text>
            </View>
            {InboundDescriptionEdit == false && (
              <TouchableOpacity
                onPress={() => {
                  setInboundDescriptionEdit(!InboundDescriptionEdit);
                }}>
                <Icon name={'pencil'} size={22} color={black} />
              </TouchableOpacity>
            )}
          </View>
          {InboundDescriptionEdit == true && (
            <View
              style={{
                marginTop: 14,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                value={InboundDescription}
                placeholder="12345"
                placeholderTextColor={grey01}
                style={{
                  borderWidth: 1,
                  borderColor: grey01,
                  height: 40,
                  borderRadius: 6,
                  paddingHorizontal: 14,
                  flex: 1,
                }}
                onChangeText={txt => {
                  setInboundDescription(txt);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setInboundDescriptionEdit(false);
                }}
                style={{
                  backgroundColor: greenPrimary,
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  marginLeft: 10,
                }}>
                <Icon name="check" size={22} color={white} />
              </TouchableOpacity>
            </View>
          )}
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
            <View>
              <Text
                style={{
                  fontSize: FontSize.FS_12,
                  color: black,
                  fontFamily: MEDIUM,
                }}>
                {'Route and Destination'}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.FS_11,
                  color: grey,
                  fontFamily: MEDIUM,
                  marginTop: 4,
                }}>
                {RouteTo == "" ? 'None' : RouteTo}
                {' - '}
                {DestinationTo == "" ? 'None' : DestinationTo}
              </Text>
            </View>
            {RouteDestinationEdit == false && (
              <TouchableOpacity
                onPress={() => {
                  setRouteDestinationEdit(!RouteDestinationEdit);
                }}>
                <Icon name={'pencil'} size={22} color={black} />
              </TouchableOpacity>
            )}
          </View>
          {RouteDestinationEdit == true && (
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  openRouteToBottomSheet();
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
                    fontSize: FontSize.FS_12,
                    color: grey,
                    fontFamily: MEDIUM,
                    marginTop: 4,
                  }}>
                  {RouteTo == "" ? 'None' : RouteTo}
                </Text>
                <Icon name={'chevron-down'} size={22} color={grey} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  openDestinationToBottomSheet();
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
                    fontSize: FontSize.FS_12,
                    color: grey,
                    fontFamily: MEDIUM,
                    marginTop: 4,
                  }}>
                  {DestinationTo == "" ? 'None' : DestinationTo}
                </Text>
                <Icon name={'chevron-down'} size={22} color={grey} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (DestinationTo == "") {
                    setDestinationToError("* Please select a destination")
                  }
                  else {
                    setRouteDestinationEdit(false);
                    setDestinationToError("")
                  }
                }}
                style={{
                  backgroundColor: greenPrimary,
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  marginLeft: 10,
                }}>
                <Icon name="check" size={22} color={white} />
              </TouchableOpacity>
            </View>
          )}
          {DestinationToError !== "" && <Text
            style={{
              fontSize: FontSize.FS_10,
              color: red,
              fontFamily: MEDIUM,
              marginTop: 8

            }}>
            {DestinationToError}
          </Text>
          }
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
              {'Music On Hold'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigate("ManageAudioFiles", { type: "moh", isEdit: false })
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
              {MusicOnHoldFileName == ''
                ? 'Choose Music On Hold file'
                : MusicOnHoldFileName}
            </Text>
            <Icon name="chevron-down" size={22} color={grey} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {
          UpdateInboundNumber()
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
          }}>{isEdit ? "Update" : "Add Ring Group"}</Text>
        </TouchableOpacity>
      </View>


      <RouteDestinationBottomSheet
        data={ROUTE}
        headerTitle={'Select Route Type'}
        currentValue={RouteValue}
        bottomSheetRef={RouteTobottomSheetRef}
        selectedValue={data => {
          setRouteTo(data);
        }}
        selectedRoute={data => {
          setRouteValue(data)
          setDestinationTo("")
        }}
      />

      <DestinationBottomSheet
        data={DestinationList}
        headerTitle={'Select Destination'}
        currentValue={DestinationValue}
        bottomSheetRef={DestinationTobottomSheetRef}
        selectedValue={data => {
          setDestinationTo(data);
          setDestinationToError("")
        }}
        selectedDestination={data => {
          setDestinationValue(data)
          setDestinationToError("")
        }}
      />



      <AudioFileListBottomSheet
        headerTitle={'Please select music on hold'}
        AudioFileList={MusicOnHoldFileList}
        CurrantId={MusicOnHoldFileId}
        bottomSheetRef={AudioFilebottomSheetRef}
        selectedValue={data => {
          setMusicOnHoldFileName(data);
        }}
        selectedId={data => {
          setMusicOnHoldFileId(data);
        }}
      />
      {isLoading && <LoadingView />}
    </>
  );
};

export default InBoundNumberManage;

const styles = StyleSheet.create({

});
