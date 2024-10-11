
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, FlatList, Alert, ScrollView } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black05 } from '@constants/Color';
import { black, disableColor, greenPrimary, grey, grey01, white, paleGreen, yellow, red } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { Copy_Time_Slot, Create_Time_Slot, Delete_Time_Slot, Get_Business_Hours_Time_Details, Get_Route_To_Destination, Get_Time_Based_Routing_Details, Update_Time_Condition, Update_Time_Slot } from '../../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import { resetTimeBasedRoutingApiStatus } from '../../../redux/reducers/timeBasedRoutingReducer';
import LoadingView from '../../../commonComponents/LoadingView';
import { useFocusEffect } from '@react-navigation/native';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';

const ManageTimebasedRouting = ({ navigation, route }) => {
    const [isEdit, setIsEdit] = useState(route?.params?.isEdit ? true : false);
    const [TimeBasedRoutingDetails, setTimeBasedRoutingDetails] = useState([]);
    const [TimeConditionDayData, setTimeConditionDayData] = useState(null);
    const [CallScheduleName, setCallScheduleName] = useState("");
    const [CallScheduleNameEdit, setCallScheduleNameEdit] = useState(false);

    const [SelectedDayName, setSelectedDayName] = useState(null);
    const [SelectedDay, setSelectedDay] = useState(null);
    const [SelectedSlot, setSelectedSlot] = useState(null);


    const [MondayShow, setMondayShow] = useState(false);
    const [MondayData, setMondayData] = useState([]);

    const [TuesdayShow, setTuesdayShow] = useState(false);
    const [TuesdayData, setTuesdayData] = useState([]);

    const [WenesdayShow, setWenesdayShow] = useState(false);
    const [WenesdayData, setWenesdayData] = useState([]);

    const [ThursdayShow, setThursdayShow] = useState(false);
    const [ThursdayData, setThursdayData] = useState([]);

    const [FridayShow, setFridayShow] = useState(false);
    const [FridayData, setFridayData] = useState([]);

    const [SaturdayShow, setSaturdayShow] = useState(false);
    const [SaturdayData, setSaturdayData] = useState([]);

    const [SundayShow, setSundayShow] = useState(false);
    const [SundayData, setSundayData] = useState([]);

    const [EventName, setEventName] = useState("");
    const [EventNameError, setEventNameError] = useState("");
    const [From, setFrom] = useState("");
    const [FromError, setFromError] = useState("");
    const [To, setTo] = useState("");
    const [ToError, setToError] = useState("");

    const [Id, setId] = useState(0);
    const [EditID, setEditID] = useState(0);

    const [RouteTo, setRouteTo] = useState('');
    const [RouteToError, setRouteToError] = useState('');
    const [RouteValue, setRouteValue] = useState('');

    const [DestinationTo, setDestinationTo] = useState('');
    const [DestinationToError, setDestinationToError] = useState('');
    const [DestinationValue, setDestinationValue] = useState('');
    const [DestinationList, setDestinationList] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [EditOffHours, setEditOffHours] = useState(false);
    const [MoreModelVisible, setMoreModelVisible] = useState(false);
    const [IsFromEdit, setIsFromEdit] = useState(false);

    const [IsFromTimePickerShow, setIsFromTimePickerShow] = useState(false);
    const [IsToTimePickerShow, setIsToTimePickerShow] = useState(false);

    const [Day, setDay] = useState("monday");

    const RouteTobottomSheetRef = useRef(null);
    const DestinationTobottomSheetRef = useRef(null);


    const dispatch = useDispatch();

    const apiGetTimeBasedRoutingDetails = useSelector(state => state.TimeBasedRoutingRedux.apiGetTimeBasedRoutingDetails);
    const time_based_routing_details = useSelector(state => state.TimeBasedRoutingRedux.time_based_routing_details);
    const apiUpdateTimeSlot = useSelector(state => state.TimeBasedRoutingRedux.apiUpdateTimeSlot);

    const apiGetBusinessHoursTimeDetails = useSelector(state => state.TimeBasedRoutingRedux.apiGetBusinessHoursTimeDetails);
    const business_hours_time_details = useSelector(state => state.TimeBasedRoutingRedux.business_hours_time_details);
    const apiCreateTimeSlot = useSelector(state => state.TimeBasedRoutingRedux.apiCreateTimeSlot);
    const apiDeleteTimeSlot = useSelector(state => state.TimeBasedRoutingRedux.apiDeleteTimeSlot);
    const apiUpdateTimeCondition = useSelector(state => state.TimeBasedRoutingRedux.apiUpdateTimeCondition);
    const apiUpdateTimeSlotWeekly = useSelector(state => state.TimeBasedRoutingRedux.apiUpdateTimeSlotWeekly);
    const apiCopyTimeSlot = useSelector(state => state.TimeBasedRoutingRedux.apiCopyTimeSlot);

    const apiGetRouteToDestination = useSelector(
        state => state.generalRedux.apiGetRouteToDestination,
    );
    const route_by_destination_list = useSelector(
        state => state.generalRedux.route_by_destination_list,
    );

    const isLoading = useSelector(state => state.TimeBasedRoutingRedux.isLoader);
    const isError = useSelector(state => state.TimeBasedRoutingRedux.isError);
    const error_message = useSelector(state => state.TimeBasedRoutingRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const GetTimeBasedRoutingDetails = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.time_condition_uuid = route?.params?.item?.time_condition_uuid,
                dispatch(Get_Time_Based_Routing_Details(dict))
        }
    }



    const GetBusinessHoursTimeDetails = (data) => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.time_condition_data_uuid = data?.time_condition_data_uuid,

                dispatch(Get_Business_Hours_Time_Details(dict))
        }
    }

    const callAllApi = async () => {
        await GetTimeBasedRoutingDetails()
        // GetTimeSlotDetailsEvents()
    }

    useFocusEffect(
        useCallback(() => {
            if (route?.params?.isEdit == true) {
                callAllApi()
            }
            return () => {
                dispatch(resetTimeBasedRoutingApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetTimeBasedRoutingDetails :', apiGetTimeBasedRoutingDetails);
        if (apiGetTimeBasedRoutingDetails == STATUS_FULFILLED) {
            Log("time_based_routing_details :", time_based_routing_details)
            if (time_based_routing_details !== null) {
                setTimeBasedRoutingDetails(time_based_routing_details?.time_condition)
                setTimeConditionDayData(time_based_routing_details?.time_condition_data)
                setCallScheduleName(time_based_routing_details?.time_condition[0]?.time_condition_name)
            }
        } else if (apiGetTimeBasedRoutingDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetTimeBasedRoutingDetails]);




    useEffect(() => {
        Log('apiGetBusinessHoursTimeDetails :', apiGetBusinessHoursTimeDetails);
        if (apiGetBusinessHoursTimeDetails == STATUS_FULFILLED) {
            Log("business_hours_time_details :", business_hours_time_details)
            if (business_hours_time_details !== null) {
                switch (SelectedDay?.time_condition_day) {
                    case 'monday':
                        const Monday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Monday) {
                            setMondayData(business_hours_time_details)
                        }
                        break;
                    case 'tuesday':
                        const Tuesday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Tuesday) {
                            setTuesdayData(business_hours_time_details)
                        }
                        break;
                    case 'wednesday':
                        const Wenesday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Wenesday) {
                            setWenesdayData(business_hours_time_details)
                        }
                        break;
                    case 'thursday':
                        const Thursday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Thursday) {
                            setThursdayData(business_hours_time_details)
                        }
                        break;
                    case 'friday':
                        const Friday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Friday) {
                            setFridayData(business_hours_time_details)
                        }
                        break;
                    case 'saturday':
                        const Saturday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Saturday) {
                            setSaturdayData(business_hours_time_details)
                        }
                        break;
                    case 'sunday':
                        const Sunday = business_hours_time_details.find((data) => data?.time_condition_data_uuid == SelectedDay.time_condition_data_uuid)
                        if (Sunday) {
                            setSundayData(business_hours_time_details)
                        }
                        break;
                    default:

                }



            }
        } else if (apiGetBusinessHoursTimeDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetBusinessHoursTimeDetails]);

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

    //Create Time Slot
    useEffect(() => {
        Log('apiCreateTimeSlot :', apiCreateTimeSlot);
        if (apiCreateTimeSlot == STATUS_FULFILLED) {
            GetBusinessHoursTimeDetails(SelectedDay)
            setModalVisible(false)
            setFrom("")
            setTo("")
            setRouteTo("")
            setDestinationTo("")
            setEventName("")
        } else if (apiCreateTimeSlot == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateTimeSlot]);

    //Delete Time Slot

    useEffect(() => {
        Log('apiDeleteTimeSlot :', apiDeleteTimeSlot);
        if (apiDeleteTimeSlot == STATUS_FULFILLED) {
            GetBusinessHoursTimeDetails(SelectedDay)

        } else if (apiDeleteTimeSlot == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteTimeSlot])

    //update time condition name or all

    const UpdateTimeConditionName = () => {

        var dict = {
            createdby: user_data?.data?.user_uuid,
            main_user_uuid: user_data?.data?.user_uuid,
            route_to: null,
            route_type: null,
            time_condition_id: TimeBasedRoutingDetails[0]?.time_condition_id,
            time_condition_name: CallScheduleName,
            time_condition_uuid: TimeBasedRoutingDetails[0]?.time_condition_uuid,
            updated_at: null,
            updated_by: null,
            user_uuid: user_data?.data?.user_uuid,
        }
        dispatch(Update_Time_Condition(dict))
    }

    useEffect(() => {
        Log('apiUpdateTimeCondition :', apiUpdateTimeCondition);
        if (apiUpdateTimeCondition == STATUS_FULFILLED) {
            callAllApi()
        } else if (apiUpdateTimeCondition == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateTimeCondition])

    //copy time slot
    useEffect(() => {
        Log('apiCopyTimeSlot :', apiCopyTimeSlot);
        if (apiCopyTimeSlot == STATUS_FULFILLED) {
            setMoreModelVisible(false)
            Alert.alert(
                "Success",
                'Time slot has been copied successfully',
                [
                    {
                        text: 'Ok',
                    },
                ],
                { cancelable: true },
            );
            callAllApi()
        } else if (apiCopyTimeSlot == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCopyTimeSlot])

    const handleCopy = (type, message) => {
        Alert.alert(
            "Alert",
            message,
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            main_admin_uuid: user_data?.data?.main_uuid,
                            select_day_uuid: SelectedDay?.time_condition_data_uuid,
                            type: type
                        }
                        dispatch(Copy_Time_Slot(dict))
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    }


    const handleSaveTimeBlock = () => {

        if (EventName == "") {
            setEventNameError("* Please enter slot name.")
            return

        }
        if (From == "") {
            setFromError("* Please select from time.")
        }
        if (To == "") {
            setToError("* Please select to time.")
        }
        if (RouteTo == "") {
            setRouteToError("* Please select Route type.")
        }
        if (DestinationTo == "") {
            setDestinationToError("* Please select Route.")
        }
        else {

            if (IsFromEdit == true) {

            }
            else {
                var dict = {};
                dict.time_slot_name = EventName,
                    dict.createdby = user_data?.data?.user_uuid,
                    dict.main_admin_uuid = user_data?.data?.main_uuid
                dict.user_uuid = user_data?.data?.user_uuid
                dict.from_time = moment(From).format('h:mm A'),
                    dict.id = "",
                    dict.route_to = DestinationValue,
                    dict.route_type = RouteValue,
                    dict.schedule_type = "weekly",
                    dict.time_condition_data_uuid = SelectedDay?.time_condition_data_uuid,
                    dict.time_condition_uuid = SelectedDay?.time_condition_uuid,
                    dict.to_time = moment(To).format('h:mm A'),
                    dispatch(Create_Time_Slot(dict))
            }
        }

    }

    const handleUpdateTimeBlock = () => {
        if (EventName.trim() === '') {
            setEventNameError("* Please enter slot name.")
            return
        }
        if (From == "") {
            setFromError("* Please select from time.")
        }
        if (To == "") {
            setToError("* Please select to time.")
        }
        if (RouteTo == "") {
            setRouteToError("* Please select Route type.")
        }
        if (DestinationTo == "") {
            setDestinationToError("* Please select Route.")
        }
        else {
            if (IsFromEdit == true) {
                var dict = {};
                const from = moment(From, "HH:mm").format("h:mm A");
                const to = moment(To, "HH:mm").format("h:mm A");
                if (SelectedSlot?.type == "default") {
                    dict.createdby = user_data?.data?.user_uuid,
                        dict.time_slot_name = EventName,
                        dict.from_time = from,
                        dict.id = SelectedSlot?.id,
                        dict.main_admin_uuid = user_data?.data?.main_uuid,
                        dict.route_to = DestinationValue,
                        dict.route_type = RouteValue,
                        dict.schedule_type = '',
                        dict.type = SelectedSlot?.type,
                        dict.time_condition_data_uuid = SelectedSlot?.time_condition_data_uuid,
                        dict.time_condition_date = '',
                        dict.time_condition_uuid = SelectedSlot?.time_condition_uuid,
                        dict.to_time = to,
                        dict.user_uuid = user_data?.data?.user_uuid

                }
                dispatch(Update_Time_Slot(dict))

            }
        }

    }
    const handleUpdateTimeBlockOffHours = () => {
        if (RouteTo == "") {
            setRouteToError("* Please select Route type.")
        }
        if (DestinationTo == "") {
            setDestinationToError("* Please select Route.")
        }
        else {
            if (IsFromEdit == true) {
                var dict = {};
                const from = moment(From, "HH:mm").format("h:mm A");
                const to = moment(To, "HH:mm").format("h:mm A");
                if (SelectedSlot?.type == "off_hours") {
                    dict.createdby = user_data?.data?.user_uuid,
                        dict.time_slot_name = SelectedSlot?.time_slot_name,
                        dict.from_time = SelectedSlot?.from_time,
                        dict.id = SelectedSlot?.id,
                        dict.main_admin_uuid = user_data?.data?.main_uuid,
                        dict.route_to = DestinationValue,
                        dict.route_type = RouteValue,
                        dict.schedule_type = '',
                        dict.type = SelectedSlot?.type,
                        dict.time_condition_data_uuid = SelectedSlot?.time_condition_data_uuid,
                        dict.time_condition_date = '',
                        dict.time_condition_uuid = SelectedSlot?.time_condition_uuid,
                        dict.to_time = SelectedSlot?.to_time,
                        dict.user_uuid = user_data?.data?.user_uuid
                }
                dispatch(Update_Time_Slot(dict))
            }
        }

    }

    useEffect(() => {
        Log('apiUpdateTimeSlot :', apiUpdateTimeSlot);
        if (apiUpdateTimeSlot == STATUS_FULFILLED) {
            GetBusinessHoursTimeDetails(SelectedDay)
            setModalVisible(!modalVisible)
        } else if (apiUpdateTimeSlot == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateTimeSlot]);


    const DeleteTimeBlock = (item) => {

        Alert.alert(
            item?.time_slot_name,
            'Are you sure to delete this time block?',
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            time_slot_uuid: item?.id
                        }
                        dispatch(Delete_Time_Slot(dict))
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );

    }

    const EditTimeData = (item, day) => {
        setSelectedSlot(item)
        if (item?.type == "off_hours") {
            setEditOffHours(item?.type == "off_hours" ? true : false)
            const route = ROUTE?.find(data => data.route === item?.route_type)?.value || "";
            setRouteTo(route) // Extension
            setRouteValue(item?.route_type) //extension
            setDestinationTo(item?.route_to_name) //1003
            setDestinationValue(item?.route_to) // 1003 id
            setModalVisible(!modalVisible)

        }
        else {
            setEventName(item?.time_slot_name)
            setEditOffHours(item?.type == "off_hours" ? true : false)
            setFrom(item?.from_time)
            setTo(item?.to_time)
            const route = ROUTE?.find(data => data.route === item?.route_type)?.value || "";
            setRouteTo(route) // Extension
            setRouteValue(item?.route_type) //extension
            setDestinationTo(item?.route_to_name) //1003
            setDestinationValue(item?.route_to) // 1003 id
            setModalVisible(!modalVisible)
        }


    }

    const handleShowDayData = (item, isOpen) => {
        if (isOpen !== true) {

            switch (item) {
                case 'monday':
                    const Monday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Monday[0])
                    setSelectedDayName(SelectedDayName === 'monday' ? null : 'monday');
                    setMondayShow(!MondayShow)
                    GetBusinessHoursTimeDetails(Monday[0])
                    break;
                case 'tuesday':
                    const Tuesday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Tuesday[0])
                    setSelectedDayName(SelectedDayName === 'tuesday' ? null : 'tuesday');
                    setTuesdayShow(!TuesdayShow)
                    GetBusinessHoursTimeDetails(Tuesday[0])
                    break;
                case 'wednesday':
                    const Wenesday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Wenesday[0])
                    setSelectedDayName(SelectedDayName === 'wednesday' ? null : 'wednesday');
                    setWenesdayShow(!WenesdayShow)
                    GetBusinessHoursTimeDetails(Wenesday[0])
                    break;
                case 'thursday':
                    const Thursday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Thursday[0])
                    setSelectedDayName(SelectedDayName === 'thursday' ? null : 'thursday');
                    setThursdayShow(!ThursdayShow)
                    GetBusinessHoursTimeDetails(Thursday[0])
                    break;
                case 'friday':
                    const Friday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Friday[0])
                    setSelectedDayName(SelectedDayName === 'friday' ? null : 'friday');
                    setFridayShow(!FridayShow)
                    GetBusinessHoursTimeDetails(Friday[0])
                    break;
                case 'saturday':
                    const Saturday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Saturday[0])
                    setSelectedDayName(SelectedDayName === 'saturday' ? null : 'saturday');
                    setSaturdayShow(!SaturdayShow)
                    GetBusinessHoursTimeDetails(Saturday[0])
                    break;
                case 'sunday':
                    const Sunday = TimeConditionDayData.filter(data => data?.time_condition_day == item)
                    setSelectedDay(Sunday[0])
                    setSelectedDayName(SelectedDayName === 'sunday' ? null : 'sunday');
                    setSundayShow(!SundayShow)
                    GetBusinessHoursTimeDetails(Sunday[0])
                    break;
                default:
                    setSelectedDayName(null);
            }
        }
        else {
            setSelectedDay(null)
            setSelectedDayName(null);
            switch (item) {
                case 'monday':
                    setMondayShow(!MondayShow)
                    break;
                case 'tuesday':
                    setTuesdayShow(!TuesdayShow)
                    break;
                case 'wednesday':
                    setWenesdayShow(!WenesdayShow)
                    break;
                case 'thursday':
                    setThursdayShow(!ThursdayShow)
                    break;
                case 'friday':
                    setFridayShow(!FridayShow)
                    break;
                case 'saturday':
                    setSaturdayShow(!SaturdayShow)
                    break;
                case 'sunday':
                    setSundayShow(!SundayShow)
                    break;
                default:
                    setSelectedDayName(null);
                    setSelectedDay(null)

            }
        }

    }

    const routeType = (item) => {
        if (item == "ivr") {
            return "Auto Attendent";
        } else if (item == "extention") {
            return "Extention";
        } else if (item == "ring-group") {
            return "Ring Group";
        } else if (item == "did") {
            return "Inbound Number";
        } else if (item == "voicemail") {
            return "Voicemail";
        } else if (item == "time_condition") {
            return "Time Condition";
        }
    }
    const showTimePickerFrom = () => {
        setIsFromTimePickerShow(true);
    };
    const showTimePickerTo = () => {
        setIsToTimePickerShow(true)
    };

    const hideTimePickerFrom = () => {
        setIsFromTimePickerShow(false);
    };
    const hideTimePickerTo = () => {
        setIsToTimePickerShow(false)
    };

    const handleConfirmFrom = (date) => {
        setFrom(date)
        hideTimePickerFrom();
        setFromError("")
    };
    const handleConfirmTo = (date, type) => {
        setTo(date)
        hideTimePickerTo();
        setToError("")
    };
    const openRouteToBottomSheet = () => {
        if (RouteTobottomSheetRef.current) {
            RouteTobottomSheetRef.current.open();
        }
    };

    const openDestinationToBottomSheet = () => {
        if (DestinationTobottomSheetRef.current) {
            DestinationTobottomSheetRef.current.open();
        }
    };

    const AddTimeBlock = ({ onPress }) => {
        return (
            <TouchableOpacity onPress={onPress}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: greenPrimary,
                    borderWidth: 1,
                    alignSelf: "center",
                    paddingVertical: 4,
                    borderRadius: 4,
                    flex: 1
                }}>
                <Text style={{
                    fontSize: FontSize.FS_11,
                    color: greenPrimary,
                    fontFamily: SEMIBOLD,
                    textAlign: "center",
                    marginRight: 4
                }}>{"Add Time Block"}</Text>
                <Icon name={"plus"} size={18} color={greenPrimary} />
            </TouchableOpacity>
        )
    }

    const MoreBtn = ({ onPress }) => {
        return (
            <TouchableOpacity onPress={onPress}

                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                    borderColor: grey,
                    borderWidth: 1,
                    paddingVertical: 4,
                    borderRadius: 4
                }}>
                <Text style={{
                    fontSize: FontSize.FS_11,
                    color: grey,
                    fontFamily: SEMIBOLD,
                    textAlign: "center",
                    marginRight: 4

                }}>More</Text>
                <Icon name={"dots-horizontal"} size={18} color={grey} />
            </TouchableOpacity>
        )
    }
    const EditRemoveBtn = ({ onDelete, onEdit, item }) => {
        return (
            <View style={{ flex: 0.3, }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}>
                    <TouchableOpacity onPress={onEdit}
                        style={{ padding: 5 }}>
                        <Icon name={"clock-edit-outline"} size={23} color={yellow} />

                    </TouchableOpacity>
                    {item?.type !== "off_hours" &&
                        <TouchableOpacity onPress={onDelete}
                            style={{ padding: 5 }}>
                            <Icon name={"trash-can"} size={23} color={red} />

                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
    return (
        <>
            <HeaderBackView
                title={TimeBasedRoutingDetails[0]?.time_condition_name}
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <ScrollView style={{ paddingHorizontal: 20, marginBottom: 20 }}>
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
                            }}>{"Call Schedule Name"}</Text>
                            <Text style={{
                                fontSize: FontSize.FS_11,
                                color: grey,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>{CallScheduleName}</Text>
                        </View>
                        {CallScheduleNameEdit == false &&
                            <TouchableOpacity onPress={() => {
                                setCallScheduleNameEdit(!CallScheduleNameEdit)
                            }}>
                                <Icon name={"pencil"} size={22} color={black} />
                            </TouchableOpacity>
                        }
                    </View>
                    {CallScheduleNameEdit == true &&
                        <View style={{
                            marginTop: 14,
                            flexDirection: "row", alignItems: "center"
                        }}>
                            <TextInput
                                value={CallScheduleName}
                                placeholder='12345'
                                placeholderTextColor={grey01}
                                style={{
                                    borderWidth: 1,
                                    borderColor: grey01,
                                    height: 40,
                                    borderRadius: 6,
                                    paddingHorizontal: 14,
                                    flex: 1

                                }}
                                onChangeText={(txt) => {
                                    setCallScheduleName(txt)
                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                if (isEdit == true) {
                                    UpdateTimeConditionName()
                                    setCallScheduleNameEdit(false)
                                }
                                else {
                                    setCallScheduleNameEdit(false)
                                }
                            }}
                                style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                <Icon name="check" size={22} color={white} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                <Text style={{
                    fontSize: FontSize.FS_14,
                    color: black,
                    fontFamily: SEMIBOLD,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginHorizontal: -20,
                    backgroundColor: "#f0f0f0b5"
                }}>{"Weekly Schedule"}</Text>

                <View
                    style={{ marginTop: 0, marginBottom: 20 }}>
                    {/* Monday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('monday', MondayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: MondayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: MondayShow == true ? greenPrimary : white,
                                paddingHorizontal: MondayShow == true ? 20 : 0,
                                paddingVertical: MondayShow == true ? 8 : 0
                            }}>{"MONDAY"}</Text>

                            <View >
                                <Icon name={MondayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {MondayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={MondayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {item?.type !== "off_hours" &&
                                                <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            }
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "mondey")
                                                        setDay("monday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("monday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                    {/* Tuesday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('tuesday', TuesdayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: TuesdayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: TuesdayShow == true ? greenPrimary : white,
                                paddingHorizontal: TuesdayShow == true ? 20 : 0,
                                paddingVertical: TuesdayShow == true ? 8 : 0
                            }}>{"TUESDAY"}</Text>

                            <View >
                                <Icon name={TuesdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {TuesdayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={TuesdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {/* {item?.time_slot_name && */}
                                            <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            {/* } */}
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "tuesday")
                                                        setDay("tuesday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("tuesday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                    {/* Wenesday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('wednesday', WenesdayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: WenesdayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: WenesdayShow == true ? greenPrimary : white,
                                paddingHorizontal: WenesdayShow == true ? 20 : 0,
                                paddingVertical: WenesdayShow == true ? 8 : 0
                            }}>{"WENESDAY"}</Text>

                            <View >
                                <Icon name={WenesdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {WenesdayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={WenesdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {/* {item?.time_slot_name && */}
                                            <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            {/* } */}
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "wednesday")
                                                        setDay("wednesday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("wednesday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                    {/* Thursday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('thursday', ThursdayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: ThursdayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: ThursdayShow == true ? greenPrimary : white,
                                paddingHorizontal: ThursdayShow == true ? 20 : 0,
                                paddingVertical: ThursdayShow == true ? 8 : 0
                            }}>{"THURSDAY"}</Text>

                            <View >
                                <Icon name={ThursdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {ThursdayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={ThursdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {/* {item?.time_slot_name && */}
                                            <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            {/* } */}
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "thursday")
                                                        setDay("thursday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("thursday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                    {/* Friday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('friday', FridayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: FridayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: FridayShow == true ? greenPrimary : white,
                                paddingHorizontal: FridayShow == true ? 20 : 0,
                                paddingVertical: FridayShow == true ? 8 : 0
                            }}>{"FRIDAY"}</Text>

                            <View >
                                <Icon name={FridayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {FridayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={FridayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {/* {item?.time_slot_name && */}
                                            <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            {/* } */}
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "friday")
                                                        setDay("friday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("friday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                    {/* Saturday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('saturday', SaturdayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: SaturdayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: SaturdayShow == true ? greenPrimary : white,
                                paddingHorizontal: SaturdayShow == true ? 20 : 0,
                                paddingVertical: SaturdayShow == true ? 8 : 0
                            }}>{"SATURDAY"}</Text>

                            <View >
                                <Icon name={SaturdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {SaturdayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={SaturdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {/* {item?.time_slot_name && */}
                                            <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            {/* } */}
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "saturday")
                                                        setDay("saturday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("saturday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                    {/* Sunday */}
                    <View style={styles.DayRow}>
                        <TouchableOpacity onPress={() => {
                            handleShowDayData('sunday', SundayShow)
                        }}
                            style={styles.HStack}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: SundayShow == true ? white : black,
                                fontFamily: SEMIBOLD,
                                backgroundColor: SundayShow == true ? greenPrimary : white,
                                paddingHorizontal: SundayShow == true ? 20 : 0,
                                paddingVertical: SundayShow == true ? 8 : 0
                            }}>{"SUNDAY"}</Text>

                            <View >
                                <Icon name={SundayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {SundayShow == true &&
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: disableColor,
                                paddingBottom: 8,
                            }}>
                                <FlatList
                                    data={SundayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) =>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 8,
                                            flex: 1,
                                        }}>
                                            {/* {item?.time_slot_name && */}
                                            <Text style={styles.black12SemiBold}>{item?.time_slot_name}</Text>
                                            {/* } */}
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                <View style={{
                                                    flex: 0.7,
                                                    marginRight: 10
                                                }}>
                                                    <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                        {item?.type == "off_hours" ?
                                                            <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: greenPrimary, borderWidth: 0.5, borderColor: greenPrimary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 6, flex: 1, textAlign: "center" }}>{"Off Hours"}</Text>
                                                            :
                                                            <View style={styles.HStack}>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{moment(item.from_time, 'HH:mm').format('hh:mm A')}</Text>
                                                                <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textAlign: "center" }}>{"to"}</Text>
                                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {moment(item.to_time, 'HH:mm').format('hh:mm A')}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={[styles.HStack, { marginBottom: 4 }]}>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{routeType(item?.route_type)}</Text>
                                                        <Text style={{ flex: 0.2, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", textAlign: "center" }}> {"-"}</Text>
                                                        <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, textTransform: "capitalize", borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item?.route_to_name}</Text>
                                                    </View>
                                                </View>
                                                <EditRemoveBtn item={item}
                                                    onEdit={() => {
                                                        setIsFromEdit(true)
                                                        EditTimeData(item, "sunday")
                                                        setDay("sunday")
                                                    }}
                                                    onDelete={() => {
                                                        DeleteTimeBlock(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                                <View style={[styles.HStack, { marginTop: 8 }]}>
                                    <AddTimeBlock onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("sunday")
                                        setIsFromEdit(false)
                                    }} />
                                    <View style={{ flex: 0.3 }}></View>
                                    <MoreBtn onPress={() => {
                                        setMoreModelVisible(!MoreModelVisible)
                                    }} />
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <Text style={{
                    fontSize: FontSize.FS_14,
                    color: black,
                    fontFamily: SEMIBOLD,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginHorizontal: -20,
                    backgroundColor: "#f0f0f0b5"
                }}>{"Holiday & Specifics"}</Text>
                <TouchableOpacity onPress={() => {
                    navigate("HolidaySpecific", { isEdit: isEdit, item: TimeBasedRoutingDetails })
                }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                    <Text style={{
                        fontSize: FontSize.FS_12,
                        color: black,
                        fontFamily: MEDIUM,
                    }}>{"Holiday & Specifics"}</Text>
                    <Icon name={"chevron-right"} size={25} color={black} />
                </TouchableOpacity>
            </ScrollView>
            <RouteDestinationBottomSheet
                data={ROUTE}
                headerTitle={'Select Route Type'}
                currentValue={RouteValue}
                bottomSheetRef={RouteTobottomSheetRef}
                selectedValue={data => {
                    setRouteTo(data);
                    setRouteToError("")
                }}
                selectedRoute={data => {
                    setRouteValue(data)
                    setDestinationTo("")
                    setRouteToError("")
                }}
            />

            <DestinationBottomSheet
                data={DestinationList}
                headerTitle={'Select Route'}
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={[styles.HStack, { marginBottom: 24 }]}>
                            <Text style={{
                                fontSize: FontSize.FS_16,
                                color: black,
                                fontFamily: SEMIBOLD,
                                textTransform: "capitalize",
                                flex: 1,
                                textAlign: "center"
                            }}>{Day}</Text>
                            <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                                onPress={() => {
                                    setModalVisible(false)
                                    setFrom("")
                                    setFromError("")
                                    setTo("")
                                    setToError("")
                                    setRouteTo("")
                                    setRouteToError("")
                                    setDestinationTo("")
                                    setDestinationToError("")
                                    setEventName("")
                                    setEventNameError("")
                                    setModalVisible(!modalVisible)
                                }
                                }>
                                <Icon name={"close"} size={20} color={black} />
                            </TouchableOpacity>
                        </View>
                        {EditOffHours === false &&
                            <>
                                <Text style={[styles.black12SemiBold, { marginTop: 10 }]}>{"Time Block Name"}</Text>
                                <TextInput
                                    value={EventName}
                                    placeholder='Enter Slot Name'
                                    placeholderTextColor={black}
                                    style={{
                                        marginVertical: 10,
                                        fontSize: FontSize.FS_11,
                                        color: black,
                                        fontFamily: MEDIUM,
                                        borderWidth: 1,
                                        borderColor: black,
                                        height: 36,
                                        borderRadius: 4,
                                        paddingHorizontal: 14,
                                    }}
                                    onChangeText={(txt) => {
                                        setEventName(txt)
                                        setEventNameError("")
                                    }}
                                />
                                {EventNameError !== "" && <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {EventNameError}
                                </Text>
                                }
                                <Text style={[styles.black12SemiBold, { marginTop: 10 }]}>{"From Time"}</Text>
                                <TouchableOpacity onPress={() => {
                                    showTimePickerFrom()
                                }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        borderWidth: 1,
                                        borderColor: black,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        marginVertical: 8,
                                        borderRadius: 4,
                                    }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                        marginTop: 4
                                    }}>{From == "" ? "Select Time" : moment(From, 'HH:mm').format('hh:mm A')}</Text>
                                    <Icon name={"chevron-down"} size={22} color={grey} />
                                </TouchableOpacity>
                                {FromError !== "" && <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {FromError}
                                </Text>
                                }
                                <Text style={[styles.black12SemiBold, { marginTop: 10 }]}>{"To Time"}</Text>
                                <TouchableOpacity onPress={() => {
                                    showTimePickerTo()
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
                                    }}>{To == "" ? "Select Time" : moment(To, 'HH:mm').format('hh:mm A')}</Text>
                                    <Icon name={"chevron-down"} size={22} color={grey} />

                                </TouchableOpacity>
                                {ToError !== "" && <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {ToError}
                                </Text>
                                }
                            </>
                        }
                        <Text style={[styles.black12SemiBold, { marginTop: 10 }]}>{"Route Type"}</Text>
                        <TouchableOpacity onPress={() => {
                            openRouteToBottomSheet()
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
                            }}>{RouteTo == "" ? "Select Route" : RouteTo}</Text>
                            <Icon name={"chevron-down"} size={22} color={grey} />

                        </TouchableOpacity>
                        {RouteToError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                            }}>
                            {RouteToError}
                        </Text>
                        }
                        <Text style={[styles.black12SemiBold, { marginTop: 10 }]}>{"Route"}</Text>
                        <TouchableOpacity onPress={() => {
                            openDestinationToBottomSheet()
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
                            }}>{DestinationTo == "" ? "Select Desination" : DestinationTo}</Text>
                            <Icon name={"chevron-down"} size={22} color={grey} />

                        </TouchableOpacity>
                        {DestinationToError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                            }}>
                            {DestinationToError}
                        </Text>
                        }
                        <TouchableOpacity onPress={() => {
                            if (IsFromEdit == true) {
                                if (EditOffHours == true) {
                                    handleUpdateTimeBlockOffHours()
                                }
                                else {
                                    handleUpdateTimeBlock()
                                }
                            }
                            else {
                                handleSaveTimeBlock()
                            }
                        }}
                            style={{ backgroundColor: greenPrimary, height: 40, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                            <Text style={{
                                fontSize: FontSize.FS_14,
                                color: white,
                                fontFamily: MEDIUM,
                            }}>{IsFromEdit == true ? "UPDATE" : "SAVE"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={MoreModelVisible}

                onRequestClose={() => {
                    setMoreModelVisible(!MoreModelVisible);
                }}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                            onPress={() => setMoreModelVisible(false)}>
                            <Icon name={"close"} size={22} color={black} />
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => {
                                const message = 'Are you sure to Copy All weekdays?';
                                handleCopy("copy_all_weekdays", message)
                            }}
                                style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name={"content-copy"} size={22} color={grey} />
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: grey,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    marginLeft: 10,


                                }}>Copy to all weekdays</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                const message = 'Are you sure to Copy All?';
                                handleCopy("copy_to_all", message)
                            }}
                                style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name={"content-copy"} size={22} color={grey} />
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: grey,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    marginLeft: 10,
                                    marginVertical: 14

                                }}>Copy to all</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                const message = 'Are you sure to Copy To Weekends?';
                                handleCopy("copy_to_weekends", message)
                            }} style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name={"content-copy"} size={22} color={grey} />
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: grey,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    marginLeft: 10

                                }}>Copy to weekends</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
            <DateTimePickerModal
                isVisible={IsFromTimePickerShow}
                mode="time"
                onConfirm={handleConfirmFrom}
                onCancel={hideTimePickerFrom}
            />
            <DateTimePickerModal
                isVisible={IsToTimePickerShow}
                mode="time"
                onConfirm={handleConfirmTo}
                onCancel={hideTimePickerTo}
            />
            {isLoading && <LoadingView />}
        </>
    );
};

export default ManageTimebasedRouting;

const styles = StyleSheet.create({
    black12SemiBold: {
        fontFamily: SEMIBOLD,
        fontSize: FontSize.FS_12,
        color: black,
    },
    DayRow: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        marginHorizontal: -20,
    },
    HStack: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
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
        backgroundColor: paleGreen
    },
    activeButton: {
        backgroundColor: greenPrimary,
    },
    ActiveKeypadText: {
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_14,
        color: white
    },
});
