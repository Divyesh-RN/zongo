
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black, disableColor, greenPrimary, grey, white, red } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Get_Blocked_Numbers_Settings, Get_Route_To_Destination, Update_Blocked_Numbers_Settings } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { resetAutoAttendantApiStatus } from '../../../redux/reducers/autoAttendantReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import LoadingView from '../../../commonComponents/LoadingView';
import { Log } from '../../../commonComponents/Log';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import { Switch } from 'react-native-gesture-handler';

const BlockNumberSetting = ({ navigation }) => {

    const [EditKeyPadOption, setEditKeyPadOption] = useState(false);
    const [BlockSettingId, setBlockSettingId] = useState("");
    const [RouteError, setRouteError] = useState("");
    const [Route, setRoute] = useState("");
    const [RouteValue, setRouteValue] = useState("");
    const [Destination, setDestination] = useState("");
    const [DestinationError, setDestinationError] = useState("");
    const [DestinationId, setDestinationId] = useState("");
    const [BlockCalls, setBlockCalls] = useState(false);
    const [DestinationList, setDestinationList] = useState([]);

    const dispatch = useDispatch();

    const apiGetRouteToDestination = useSelector(state => state.generalRedux.apiGetRouteToDestination);
    const apiGetBlockedNumbersSetting = useSelector(state => state.blockNumberRedux.apiGetBlockedNumbersSetting);
    const apiUpdateBlockedNumbersSetting = useSelector(state => state.blockNumberRedux.apiUpdateBlockedNumbersSetting);
    const blocked_numbers_setting = useSelector(state => state.blockNumberRedux.blocked_numbers_setting);
    const route_by_destination_list = useSelector(state => state.generalRedux.route_by_destination_list);

    const isLoading = useSelector(state => state.blockNumberRedux.isLoader);
    const isError = useSelector(state => state.blockNumberRedux.isError);
    const error_message = useSelector(state => state.blockNumberRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    useFocusEffect(
        useCallback(() => {
            GetBlockNumberSetting()
            return () => {
                dispatch(resetAutoAttendantApiStatus());
            };
        }, [])
    )

    const GetBlockNumberSetting = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
            user_uuid: user_data?.data?.user_uuid,
        }
        dispatch(Get_Blocked_Numbers_Settings(dict))
    }

    useEffect(() => {
        Log('apiGetBlockedNumbersSetting :', apiGetBlockedNumbersSetting);
        if (apiGetBlockedNumbersSetting == STATUS_FULFILLED) {
            if (blocked_numbers_setting !== null) {
                setBlockCalls(blocked_numbers_setting?.anonymous_calls == "NO" ? false : true)
                setBlockSettingId(blocked_numbers_setting?.blocked_numbers_settings_uuid)
                setRouteValue(blocked_numbers_setting?.route)
                const route = ROUTE?.find(item => item.route === blocked_numbers_setting?.route)?.value || "";
                setRoute(route)
                setDestinationId(blocked_numbers_setting?.destination)
                RouteToDestination(blocked_numbers_setting?.route)
            }
        } else if (apiGetBlockedNumbersSetting == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetBlockedNumbersSetting]);

    const UpdateBlockNumberSetting = () => {
        if (Route == "") {
            setRouteError("* Please select a route.")
        }
        if (Destination == "") {
            setDestinationError("* Please select a destination.")
        }
        else {
            var dict = {
                createdby: user_data?.data?.user_uuid,
                user_uuid: user_data?.data?.user_uuid,
                main_admin_uuid: user_data?.data?.main_uuid,
                anonymous_calls: BlockCalls == true ? "YES" : "NO",
                blocked_numbers_settings_uuid: BlockSettingId,
                destination: DestinationId,
                destination_val: Destination,
                route: RouteValue,
                route_val: Route,
            }
            dispatch(Update_Blocked_Numbers_Settings(dict))
        }
    }

    useEffect(() => {
        Log('apiUpdateBlockedNumbersSetting :', apiUpdateBlockedNumbersSetting);
        if (apiUpdateBlockedNumbersSetting == STATUS_FULFILLED) {
            GetBlockNumberSetting()
        } else if (apiUpdateBlockedNumbersSetting == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateBlockedNumbersSetting]);

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
            if (route_by_destination_list !== null) {
                setDestinationList(route_by_destination_list);
                const DestinationByRoute = route_by_destination_list?.find(item => item.value === DestinationId)?.text || "";
                setDestination(DestinationByRoute)
            }
        } else if (apiGetRouteToDestination == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetRouteToDestination]);

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

    return (
        <>
            <HeaderBackView
                title="Settings"
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
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
                            }}>{"Block Anonymous Calls"}</Text>
                            <Text style={{
                                fontSize: FontSize.FS_10,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginLeft: 1
                            }}>{BlockCalls == true ? "YES" : "NO"}</Text>
                        </View>
                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={BlockCalls ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setBlockCalls(val)
                            }}
                            value={BlockCalls}
                        />
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
                            <View style={{}}>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                    }}>
                                    {'Destination for Black listed Calls'}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_11,
                                        color: grey,
                                        fontFamily: MEDIUM,
                                        marginTop: 4,
                                    }}>
                                    {Route == "" ? 'None' : Route}
                                    {' - '}
                                    {Destination == "" ? 'None' : Destination}
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
                                    {Route == "" || Route == undefined ? 'Select Route' : Route}
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
                                    setEditKeyPadOption(false);

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
                    {RouteError !== "" && <Text
                        style={{
                            fontSize: FontSize.FS_10,
                            color: red,
                            fontFamily: MEDIUM,
                            marginTop: 8

                        }}>
                        {RouteError}
                    </Text>
                    }
                </View>

                <TouchableOpacity onPress={() => {
                    UpdateBlockNumberSetting()
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
                    }}>{"SAVE"}</Text>
                </TouchableOpacity>
            </View>
            <RouteDestinationBottomSheet
                data={ROUTE}
                headerTitle={'Select Destination Type'}
                currentValue={RouteValue}
                bottomSheetRef={DestinationTypebottomSheetRef}
                selectedValue={data => {
                    setRoute(data);
                    setRouteError("")
                }}
                selectedRoute={data => {
                    setRouteError("")
                    setRouteValue(data)
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
            {isLoading && <LoadingView />}
        </>
    );
};

export default BlockNumberSetting;

const styles = StyleSheet.create({

});

