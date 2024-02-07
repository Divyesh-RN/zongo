
import { Alert, StyleSheet, TouchableOpacity, Text, View, LayoutAnimation, TextInput, Modal } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED } from '@constants/ConstantKey';
import { Log } from '@commonComponents/Log';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM, REGULAR } from '@constants/Fonts';
import { black05, darkGrey, disableColor, greenPrimary, grey, grey01, midGreen, red, yellow } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';
import LoadingView from '@commonComponents/LoadingView';
import { grey02 } from '../../../constants/Color';
import { Get_Destination_List, Get_Inbound_Number_List, Get_Prefix, Update_Inbound_Number_Route } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import SectionBottomSheet from '../../../commonComponents/BottomSheet/SectionBottomSheet';
import PrefixBottomSheet from './components/PrefixBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import { resetInboundApiStatus } from '../../../redux/reducers/inboundReducer';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
import DoNotAccess from '../../../commonComponents/DoNotAccess';


const ExpandableComponent = ({ item, onClickFunction, onDelete, onAction }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);

    const module_name = "did";


    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        } else {
            setLayoutHeight(0);
        }
    }, [item.isExpanded]);



    const RouteValue = (item) => {
        console.log("item: ", item?.did_action_type)
        if (item?.did_action_type == "ivr") {
            return "Auto Attendent";
        } else if (item?.did_action_type == "extention") {
            return "Extention";
        } else if (item?.did_action_type == "ringgroup") {
            return "Ring Group";
        } else if (item?.did_action_type == "did") {
            return "Inbound Number";
        } else if (item?.did_action_type == "voicemail") {
            return "Voicemail";
        } else if (item?.did_action_type == "time_condition") {
            return "Time Condition";
        }
    }
    const DestinationValue = (item) => {
        if (item?.did_action_type == "ivr") {
            return item?.ivr_menu_name;
        } else if (item?.did_action_type == "extention") {
            return item?.extension;
        } else if (item?.did_action_type == "ringgroup") {
            return item?.ring_group_extension;
        } else if (item?.did_action_type == "did") {
            return item?.did_number;
        } else if (item?.did_action_type == "voicemail") {
            return item?.voicemail_id;
        } else if (item?.did_action_type == "time_condition") {
            return item?.time_condition_name;
        }
    }
    let edit_show = PermissionCheck(
        module_name,
        "edit",
        item.group_uuid,
        item.user_created_by,
        item.created_by
    )

    let delete_show = PermissionCheck(
        module_name,
        "delete",
        item.group_uuid,
        item.user_created_by,
        item.created_by
    )

    return (
        <View style={[
            styles.expandableView,
            item?.isExpanded && styles.expandedView,
        ]}>
            <TouchableOpacity onPress={onClickFunction}
                style={{
                    // backgroundColor: white,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor
                }}>

                <View>
                    <Text style={{
                        fontSize: FontSize.FS_14,
                        color: black,
                        fontFamily: SEMIBOLD,
                        lineHeight: 24
                    }}>{item?.did_number}</Text>
                    <Text style={{
                        fontSize: FontSize.FS_13,
                        color: black,
                        fontFamily: REGULAR,
                        lineHeight: 24
                    }}>{item?.description}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Icon name={item?.isExpanded ? "chevron-down" : "chevron-right"} size={28} color={darkGrey} />
                </View>
            </TouchableOpacity>
            <View
                style={{
                    height: layoutHeight,
                    overflow: 'hidden',
                }}>
                <View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 4 }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 0.5, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 30,
                                }}>ROUTE :</Text>

                            </View>
                            <View style={{ flex: 0.6, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                }}>{RouteValue(item)}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.5, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>DESTINATION :</Text>

                            </View>
                            <View style={{ flex: 0.5, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{DestinationValue(item)}</Text>

                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 40, marginVertical: 14 }}>
                        <TouchableOpacity onPress={() => onAction(item, true)}
                            style={{ width: "30%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                            <Icon name="arrow-down-drop-circle-outline" size={22} color={grey} />
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: grey,
                                fontFamily: SEMIBOLD,
                                marginLeft: 6
                            }}>{"Action"}</Text>
                        </TouchableOpacity>
                        {edit_show !== "hidden" ?
                            <TouchableOpacity onPress={() => {
                                navigate("InBoundNumberManage", { isEdit: true, item: item })
                            }}
                                style={{ width: "30%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                <Icon name="pencil-box-outline" size={22} color={yellow} />
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: yellow,
                                    fontFamily: SEMIBOLD,
                                    marginLeft: 6
                                }}>{"Manage"}</Text>
                            </TouchableOpacity>
                            :
                            <></>
                        }
                        {delete_show !== "hidden" ?
                            <TouchableOpacity
                                onPress={() => onDelete(item, true)}
                                style={{ width: "30%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                <Icon name="trash-can" size={22} color={red} />
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: red,
                                    fontFamily: SEMIBOLD,
                                    marginLeft: 6
                                }}>{"Delete"}</Text>
                            </TouchableOpacity>
                            :
                            <></>
                        }
                    </View>
                </View>
            </View>

        </View>
    );
};
const InBoundNumbers = ({ navigation }) => {

    const [InBoundNumberList, setInBoundNumberList] = useState([]);
    const [SelectedActionNumber, setSelectedActionNumber] = useState([]);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [FilterModelVisible, setFilterModelVisible] = useState(false);
    const [SearchText, setSearchText] = useState("");
    const [FilterDescription, setFilterDescription] = useState("");
    const [FillterDestination, setFillterDestination] = useState(null);
    const [FilterPrefix, setFilterPrefix] = useState(null);
    const [DestinationList, setDestinationList] = useState([]);
    const [DestinationTo, setDestinationTo] = useState(null);
    const [DestinationToValue, setDestinationToValue] = useState(null);

    const [UpdateRouteModelVisible, setUpdateRouteModelVisible] = useState(false);
    const [UpdatedRoute, setUpdatedRoute] = useState(null);
    const [UpdatedRouteError, setUpdatedRouteError] = useState("");
    const [UpdatedRouteName, setUpdatedRouteName] = useState(null);

    const DestinationTobottomSheetRef = useRef(null);
    const PrefixbottomSheetRef = useRef(null);
    const UpdatedRoutebottomSheetRef = useRef(null);


    const dispatch = useDispatch();

    const apiGetInboundNumbersList = useSelector(state => state.inboundRedux.apiGetInboundNumbersList);
    const apiUpdateInboundNumberRoute = useSelector(state => state.inboundRedux.apiUpdateInboundNumberRoute);
    const apiGetPrefix = useSelector(state => state.inboundRedux.apiGetPrefix);
    const prefix_list = useSelector(state => state.inboundRedux.prefix_list);
    const isLoading = useSelector(state => state.inboundRedux.isLoader);
    const isError = useSelector(state => state.inboundRedux.isError);
    const error_message = useSelector(state => state.inboundRedux.error_message);
    const inbound_number_list = useSelector(state => state.inboundRedux.inbound_number_list);
    const user_data = useSelector(state => state.userRedux.user_data);

    const apiGetDestinationList = useSelector(state => state.generalRedux.apiGetDestinationList);
    const destination_list = useSelector(state => state.generalRedux.destination_list);

    const [isPermission, setIsPermission] = useState(true);
    const module_name = "did";
    const user_type = user_data.role;
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let add_per = PermissionCheck(module_name, "add", "", "", "");

    let group_uuid = "";
    const GetInboundNumberList = () => {
        if (user_data !== null) {

            if (listing_per == "none") {
                navigate("Error");
            }
            if (listing_per == "group") {
                group_uuid = user_data?.data?.group_id;
            }

            if (module_per === "" || user_type === "admin") {
                setIsPermission(true);
            } else {
                setIsPermission(false)
            }
            var dict = {};
            dict.user_type = user_type,
                dict.group_per = listing_per,
                dict.group_uuid = group_uuid,
                dict.search = "",
                dict.off_set = 0,
                dict.limits = 10,
                dict.orderby = "did_number ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.filter = "",
                dict.main_uuid = user_data?.data?.main_uuid
            if (module_per === "" || user_type === "admin") {
                dispatch(Get_Inbound_Number_List(dict))
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            GetInboundNumberList()
            GetDestinationList()
            return () => {
                dispatch(resetInboundApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetInboundNumbersList :', apiGetInboundNumbersList);
        if (apiGetInboundNumbersList == STATUS_FULFILLED) {
            Log("inbound_number_list :", inbound_number_list)
            if (inbound_number_list !== null) {
                const initialListDataSource = inbound_number_list.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setInBoundNumberList(initialListDataSource)
            }
        } else if (apiGetInboundNumbersList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetInboundNumbersList]);

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
                setDestinationList(destination_list)
            }
        } else if (apiGetDestinationList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetDestinationList]);


    const UpdateRouteInboundNumbers = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
            main_uuid: user_data?.data?.main_uuid,
            didData: {
                did_uuid: SelectedActionNumber?.uuid,
                did_number: SelectedActionNumber?.did_number,
            },
            didRoute: {
                route_name: UpdatedRoute
            },

        };
        dispatch(Update_Inbound_Number_Route(dict));
    }

    useEffect(() => {
        Log('apiUpdateInboundNumberRoute :', apiUpdateInboundNumberRoute);
        if (apiUpdateInboundNumberRoute == STATUS_FULFILLED) {
            setSelectedActionNumber([])
            GetInboundNumberList()
        } else if (apiUpdateInboundNumberRoute == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateInboundNumberRoute]);

    const GetPrefix = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
        };
        dispatch(Get_Prefix(dict));
    }

    useEffect(() => {
        Log('apiGetPrefix :', apiGetPrefix);
        if (apiGetPrefix == STATUS_FULFILLED) {
            if (prefix_list !== null) {

            }
        } else if (apiGetPrefix == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetPrefix]);

    const openDestinationToBottomSheet = () => {
        if (DestinationTobottomSheetRef.current) {
            DestinationTobottomSheetRef.current.open();
        }
    };

    const openPrefixBottomSheet = () => {
        if (PrefixbottomSheetRef.current) {
            PrefixbottomSheetRef.current.open();
        }
    };
    const openUpdatedRouteoBottomSheet = () => {
        if (UpdatedRoutebottomSheetRef.current) {
            UpdatedRoutebottomSheetRef.current.open();
        }
    };
    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...InBoundNumberList];
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

    const resetFilter = () => {
        setDestinationTo(null),
            setFilterDescription(""),
            setFilterPrefix(null)
        setFilterModelVisible(false)
        GetInboundNumberList()
    }
    const handleFilter = () => {
        if (DestinationTo == null && FilterPrefix == null && FilterDescription == "") {
            alert("Please Enter any filter value")
        }
        else {
            setFilterModelVisible(false)
            if (user_data !== null) {
                var dict = {
                    user_type: "admin",
                    group_per: "all",
                    group_uuid: "",
                    search: "",
                    off_set: 0,
                    limits: 10,
                    orderby: "did_number ASC",
                    createdby: user_data?.data?.user_uuid,
                    filter: {
                        destination_type: DestinationTo == null ? "" : DestinationTo,
                        prefix: FilterPrefix == null ? "" : FilterPrefix,
                        description: FilterDescription
                    },
                    main_uuid: user_data?.data?.main_uuid,
                };

                dispatch(Get_Inbound_Number_List(dict))
            }
        }

    }
    const handleSave = () => {
        if (UpdatedRoute !== null) {
            setUpdateRouteModelVisible(!UpdateRouteModelVisible)
            UpdateRouteInboundNumbers()

        } else {
            setUpdatedRouteError("* Please select a route")
        }

    }
    const handleAction = async (item) => {
        await setSelectedActionNumber(item)
        if (item?.did_action_type == "ivr") {
            setUpdatedRouteName(item?.ivr_menu_name);
        } else if (item?.did_action_type == "extention") {
            setUpdatedRouteName(item?.extension);
        } else if (item?.did_action_type == "ringgroup") {
            setUpdatedRouteName(item?.ring_group_extension);
        } else if (item?.did_action_type == "did") {
            setUpdatedRouteName(item?.did_number);
        } else if (item?.did_action_type == "voicemail") {
            setUpdatedRouteName(item?.voicemail_id);
        } else if (item?.did_action_type == "time_condition") {
            setUpdatedRouteName(item?.time_condition_name);
        }
        setUpdateRouteModelVisible(!UpdateRouteModelVisible)
    }
    const DESTINATION = [
        {
            id: 1,
            value: "IVR",
        },
        {
            id: 2,
            value: "EXTENSION",
        },
        {
            id: 3,
            value: "Did",
        },
        {
            id: 4,
            value: "Voicemail",
        },
        {
            id: 5,
            value: "TIme Condition",
        },
    ];


    const handleDeleteBtn = (item) => {
        Alert.alert(
            //title
            item?.did_number,
            //body
            'Are you sure to delete this inbound number?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'), style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        console.log('Yes Pressed')
                        // DeleteBtn(item)
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    }
    const handleSearchText = (search) => {

        let text = String(search).toLowerCase().replace("?", "")
        let items = listDataSource
        let filteredItems = items.filter((item) => {
            return String(item.did_number).toLowerCase().match(text) || String(item.description).toLowerCase().match(text)
        })
        console.log("filteredItems :", filteredItems)
        if (!text || text === '') {
            setInBoundNumberList(listDataSource)
        } else if (!Array.isArray(filteredItems) && !filteredItems.length) {
            setInBoundNumberList([])
        } else if (Array.isArray(filteredItems)) {
            setInBoundNumberList(filteredItems)
        }

        setSearchText(search)
    }
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
                        title="Inbound Numbers"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>

                {isPermission == true ?
                    <>
                        <View style={{ marginHorizontal: 20, marginVertical: 22 }}>
                            <View style={{
                                flexDirection: "row", alignItems: "center", borderWidth: 1,
                                borderColor: grey,
                                height: 38,
                                borderRadius: 4,
                            }}>
                                <TouchableOpacity style={{ paddingLeft: 14 }}>
                                    <Icon name="magnify" size={25} color={grey} />
                                </TouchableOpacity>
                                <TextInput
                                    value={SearchText}
                                    placeholder='Search Here...'
                                    placeholderTextColor={grey01}
                                    style={{
                                        fontFamily: MEDIUM,
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        flex: 1,
                                        paddingHorizontal: 14,

                                    }}
                                    onChangeText={(txt) => {
                                        handleSearchText(txt)
                                    }}
                                />
                                {SearchText?.length > 0 &&
                                    <TouchableOpacity onPress={() => {
                                        setInBoundNumberList(listDataSource)
                                        setSearchText("")
                                    }}
                                        style={{ paddingRight: 14 }}>
                                        <Icon name="close" size={20} color={grey} />
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={() => {
                                    GetPrefix()
                                    setFilterModelVisible(!FilterModelVisible);
                                }}
                                    style={{ backgroundColor: grey02, height: 38, width: 38, alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="filter-variant" size={24} color={white} />

                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            InBoundNumberList.length > 0 ?
                                <>
                                    {InBoundNumberList.map((item, key) => (
                                        <ExpandableComponent
                                            key={item.uuid}
                                            onClickFunction={() => {
                                                updateLayout(key);
                                            }}
                                            onDelete={() => {
                                                handleDeleteBtn(item)
                                            }}
                                            onAction={() => {
                                                handleAction(item)
                                            }}
                                            item={item}
                                        />
                                    ))}
                                </>
                                :
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",

                                }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        color: black,
                                        fontFamily: MEDIUM,
                                        textAlign: "center",
                                        alignItems: "center",
                                    }}>{isLoading == false ? "No Data Found" : ""}</Text>
                                </View>

                        }
                    
                {add_per === "yes" ? (
                    <TouchableOpacity onPress={() => {
                        navigate("AddNewInboundNumber")
                    }}
                        style={{
                            backgroundColor: midGreen,
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 20,
                            justifyContent: "center",
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                        }}>
                        <Icon name="plus" size={25} color={white} />
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: white,
                            fontFamily: SEMIBOLD,
                            lineHeight: 24,
                            marginLeft: 10
                        }}>{"Add New Phone Numbers"}</Text>
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
                </>
                    :
                    <DoNotAccess />
                }
                <RouteDestinationBottomSheet
                    data={ROUTE}
                    headerTitle={'Select Ring Strategy'}
                    currentValue={DestinationToValue}
                    bottomSheetRef={DestinationTobottomSheetRef}
                    selectedValue={data => {
                        setDestinationTo(data)
                    }}
                    selectedRoute={data => {
                        setDestinationToValue(data)
                    }}
                />
                <PrefixBottomSheet Name={prefix_list} bottomSheetRef={PrefixbottomSheetRef} selectedValue={(data) => {
                    setFilterPrefix(data)
                }} />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={FilterModelVisible}
                    onRequestClose={() => {
                        setFilterModelVisible(!FilterModelVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_16,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    flex: 1
                                }}>{"Filter"}</Text>
                                <TouchableOpacity style={{}}
                                    onPress={() => resetFilter()}>
                                    <Icon name={"close"} size={24} color={black} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Destination Type"}</Text>
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
                                }}>{DestinationTo == null ? "Select Desination type" : DestinationTo}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Prefix"}</Text>
                            <TouchableOpacity onPress={() => {
                                openPrefixBottomSheet()
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
                                }}>{FilterPrefix == null ? "Select Prifix" : FilterPrefix?.prefix}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Description contains word"}</Text>
                            <TextInput
                                value={FilterDescription}
                                placeholder='Enter description...'
                                placeholderTextColor={grey}
                                style={{
                                    borderWidth: 1,
                                    borderColor: black,
                                    height: 38,
                                    borderRadius: 4,
                                    paddingHorizontal: 14,
                                    marginVertical: 10,
                                    fontFamily: MEDIUM,
                                    fontSize: FontSize.FS_12,
                                    color: black
                                }}
                                onChangeText={(txt) => {
                                    setFilterDescription(txt)
                                }}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                                <TouchableOpacity onPress={() => {
                                    resetFilter()
                                }}
                                    style={{ backgroundColor: grey, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: white,
                                        fontFamily: MEDIUM,
                                    }}>{"Reset"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    handleFilter()
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: white,
                                        fontFamily: MEDIUM,
                                    }}>{"Apply Filter"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={UpdateRouteModelVisible}
                    onRequestClose={() => {
                        setUpdateRouteModelVisible(!UpdateRouteModelVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_16,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    flex: 1
                                }}>{"Update Route"}</Text>
                                <TouchableOpacity style={{}}
                                    onPress={() => setUpdateRouteModelVisible(!UpdateRouteModelVisible)}>
                                    <Icon name={"close"} size={24} color={black} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Select Route"}</Text>
                            <TouchableOpacity onPress={() => {
                                openUpdatedRouteoBottomSheet()
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
                                }}>{UpdatedRouteName == null ? "Select Route" : UpdatedRouteName}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            {UpdatedRouteError !== "" && <Text style={[styles.errorText, { marginTop: -3 }]}>{UpdatedRouteError}</Text>}

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                                <TouchableOpacity onPress={() => {
                                    setUpdateRouteModelVisible(false)
                                }}
                                    style={{ backgroundColor: grey, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: white,
                                        fontFamily: MEDIUM,
                                    }}>{"Close"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    handleSave()
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: white,
                                        fontFamily: MEDIUM,
                                    }}>{"Save"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {destination_list !== null && <SectionBottomSheet
                    data={destination_list}
                    headerTitle={'Update Route'}
                    currentValue={SelectedActionNumber?.did_action_type + "_" + SelectedActionNumber?.did_action_uuid}
                    bottomSheetRef={UpdatedRoutebottomSheetRef}
                    selectedValue={data => {
                        setUpdatedRouteName(data)
                    }}
                    selectedRoute={data => {
                        setUpdatedRouteError("")
                        setUpdatedRoute(data)
                    }}
                    selectedRouteType={data => { }}
                />
                }
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default InBoundNumbers;

const styles = StyleSheet.create({
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
    errorText: {
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_09,
        marginTop: 4,
        color: red,
    },
});
