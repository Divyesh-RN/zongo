
import { StyleSheet, TouchableOpacity, Text, View, Modal, LayoutAnimation, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM, REGULAR } from '@constants/Fonts';
import { black05, darkGrey, disableColor, greenPrimary, grey, midGreen, red, yellow } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';
import { TextInput } from 'react-native-gesture-handler';
import LoadingView from '../../../commonComponents/LoadingView';
import { useDispatch, useSelector } from 'react-redux';
import { resetTimeBasedRoutingApiStatus } from '../../../redux/reducers/timeBasedRoutingReducer';
import { Delete_Time_Based_Routing, Get_Time_Based_Routing_List } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import DoNotAccess from '../../../commonComponents/DoNotAccess';


const ExpandableComponent = ({ item, onClickFunction, onDelete }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);
    const module_name = "time conditions";

    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        } else {
            setLayoutHeight(0);
        }
    }, [item.isExpanded]);

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
                    }}>{item?.time_condition_name}</Text>
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
                        <View style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 0.3, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 30,
                                }}>ID :</Text>

                            </View>
                            <View style={{ flex: 0.7, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                }}>{item?.time_condition_id}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.5, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>CREATED BY :</Text>

                            </View>
                            <View style={{ flex: 0.5, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{item?.first_name + " " + item?.last_name}</Text>

                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 40, marginVertical: 14 }}>
                        {edit_show !== "hidden" ? <TouchableOpacity onPress={() => {
                            navigate("ManageTimebasedRouting", { isEdit: true, item: item })
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
                        {delete_show !== "hidden" ? <TouchableOpacity onPress={() => onDelete(item, true)}
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
const TimebasedRouting = ({ navigation }) => {

    const [TimeBasedRoutingList, setTimeBasedRoutingList] = useState([]);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [NewTimebaseRoutingModel, setNewTimebaseRoutingModel] = useState(false);
    const [RouteName, setRouteName] = useState("");
    const [RouteNameError, setRouteNameError] = useState("");

    const dispatch = useDispatch();

    const apiTimeBasedRoutingList = useSelector(state => state.TimeBasedRoutingRedux.apiTimeBasedRoutingList);
    const time_based_routing_list = useSelector(state => state.TimeBasedRoutingRedux.time_based_routing_list);
    const apiDeleteTimeBasedRouting = useSelector(state => state.TimeBasedRoutingRedux.apiDeleteTimeBasedRouting);

    const isLoading = useSelector(state => state.TimeBasedRoutingRedux.isLoader);
    const isError = useSelector(state => state.TimeBasedRoutingRedux.isError);
    const error_message = useSelector(state => state.TimeBasedRoutingRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const [isPermission, setIsPermission] = useState(true);
    const module_name = "time conditions";
    const user_type = user_data.role;
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let add_per = PermissionCheck(module_name, "add", "", "", "");
    let group_uuid = "";

    const GetTimeBasedRoutingList = () => {
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
                dict.orderby = "t.time_condition_name ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.filter = "",
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Time_Based_Routing_List(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {
            GetTimeBasedRoutingList()
            return () => {
                dispatch(resetTimeBasedRoutingApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiTimeBasedRoutingList :', apiTimeBasedRoutingList);
        if (apiTimeBasedRoutingList == STATUS_FULFILLED) {
            Log("time_based_routing_list :", time_based_routing_list)
            if (time_based_routing_list !== null) {
                const initialListDataSource = time_based_routing_list.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setTimeBasedRoutingList(initialListDataSource)
            }
        } else if (apiTimeBasedRoutingList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiTimeBasedRoutingList]);

    const DeleteTimeBasedRouting = (id) => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.time_condition_uuid = id,
                dispatch(Delete_Time_Based_Routing(dict))
        }
    }

    useEffect(() => {
        Log('apiDeleteTimeBasedRouting :', apiDeleteTimeBasedRouting);
        if (apiDeleteTimeBasedRouting == STATUS_FULFILLED) {
            GetTimeBasedRoutingList()
        } else if (apiDeleteTimeBasedRouting == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteTimeBasedRouting]);
    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...TimeBasedRoutingList];
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

    const handleAdd = () => {
        if (RouteName == "") {
            setRouteNameError("*Please Enter Name");
        }
        else {
            navigate("ManageTimebasedRouting", { isEdit: false, Name: RouteName })
        }

    }
    const handleDeleteBtn = (item) => {
        Alert.alert(
            item?.time_condition_name,
            'Are you sure to delete this Time-Based Routing?',
            [
                {
                    text: 'No',
                    onPress: () => {}, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        DeleteTimeBasedRouting(item?.time_condition_uuid)
                    }
                },
            ],
            { cancelable: true },
        );
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
                        title="Business Hours"
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
                        {
                            TimeBasedRoutingList !== null &&
                            <>
                                {TimeBasedRoutingList.map((item, key) => (
                                    <ExpandableComponent
                                        key={item.time_condition_uuid}
                                        onClickFunction={() => {
                                            updateLayout(key);
                                        }}
                                        item={item}
                                        onDelete={() => {
                                            handleDeleteBtn(item)
                                        }}
                                    />
                                ))}
                            </>
                        }
                        {add_per === "yes" &&
                            <TouchableOpacity onPress={() => {
                                setNewTimebaseRoutingModel(!NewTimebaseRoutingModel);
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
                                }}>{"Add New Time Based Routing"}</Text>
                            </TouchableOpacity>
                        }
                    </>
                    :
                    <DoNotAccess />
                }
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={NewTimebaseRoutingModel}
                    onRequestClose={() => {
                        setNewTimebaseRoutingModel(!NewTimebaseRoutingModel);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                                onPress={() => setNewTimebaseRoutingModel(!NewTimebaseRoutingModel)}>
                                <Icon name={"close"} size={24} color={black} />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Name"}</Text>
                            <TextInput
                                value={RouteName}
                                placeholder='Enter Name'
                                placeholderTextColor={grey}
                                style={{
                                    borderWidth: 1,
                                    borderColor: grey,
                                    height: 44,
                                    borderRadius: 6,
                                    paddingHorizontal: 14,
                                    marginVertical: 10,
                                    fontFamily: MEDIUM,
                                    fontSize: FontSize.FS_12,
                                    color: black

                                }}
                                onChangeText={(txt) => {
                                    if (txt.length > 0) {
                                        setRouteNameError("")
                                    }
                                    setRouteName(txt)
                                }}
                            />
                            {RouteNameError !== "" && <Text style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: REGULAR,
                                marginLeft: 5,
                                marginBottom: 10
                            }}>{RouteNameError}</Text>
                            }
                            <TouchableOpacity onPress={() => {
                                handleAdd()
                            }}
                                style={{
                                    backgroundColor: greenPrimary,
                                    alignItems: "center",
                                    paddingVertical: 6,
                                    marginTop: 20,
                                    justifyContent: "center",
                                    borderRadius: 4,
                                    width: "100%"
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 10
                                }}>{"Create Time Based Routing"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default TimebasedRouting;

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
});
