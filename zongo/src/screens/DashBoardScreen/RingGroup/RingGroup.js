
import { Alert, StyleSheet, TouchableOpacity, Text, View, LayoutAnimation } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { Delete_Ring_Group, Get_Ring_Group_List } from '../../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM, REGULAR } from '../../../constants/Fonts';
import { darkGrey, disableColor, midGreen, red, yellow } from '../../../constants/Color';
import { navigate } from '../../../navigation/RootNavigation';
import LoadingView from '../../../commonComponents/LoadingView';
import { useFocusEffect } from '@react-navigation/native';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
import DoNotAccess from '../../../commonComponents/DoNotAccess';


const ExpandableComponent = ({ item, onClickFunction, onDelete, btnEditShow }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);
    const module_name = "ring group";

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
                    }}>{item?.ring_group_name}</Text>
                    <Text style={{
                        fontSize: FontSize.FS_13,
                        color: black,
                        fontFamily: REGULAR,
                        lineHeight: 24
                    }}>{item?.ring_group_extension}</Text>

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
                            <View style={{ flex: 0.6, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 30,
                                }}>EXTENSIONS :</Text>

                            </View>
                            <View style={{ flex: 0.4, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                }}>{item?.extensions}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.4, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>STRATEGY :</Text>

                            </View>
                            <View style={{ flex: 0.6, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{item?.ring_group_strategy.split('_').join(' ')}</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 4 }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 0.6, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 30,
                                }}>FAILOVER :</Text>

                            </View>
                            <View style={{ flex: 0.4, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{item?.ring_group_fail_destination_type}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.4, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>ID :</Text>

                            </View>
                            <View style={{ flex: 0.6, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{item?.ring_group_extension}</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 40, marginVertical: 14 }}>
                        {edit_show !== "hidden" ?
                            <TouchableOpacity onPress={() => {
                                navigate("RingGroupManage", { isEdit: true, item: item })
                            }}
                                style={{ width: "40%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
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
                            <TouchableOpacity onPress={() => onDelete(item, true)}
                                style={{ width: "40%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
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
const RingGroup = ({ navigation }) => {

    const [RingGroupList, setRingGroupList] = useState(null);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [isPermission, setIsPermission] = useState(true);


    const dispatch = useDispatch();

    const apiRingGroupList = useSelector(state => state.ringGroupRedux.apiRingGroupList);
    const apiDeleteRingGroup = useSelector(state => state.ringGroupRedux.apiDeleteRingGroup);
    const isLoading = useSelector(state => state.ringGroupRedux.isLoader);
    const isError = useSelector(state => state.ringGroupRedux.isError);
    const error_message = useSelector(state => state.ringGroupRedux.error_message);
    const ring_group_list = useSelector(state => state.ringGroupRedux.ring_group_list);
    const user_data = useSelector(state => state.userRedux.user_data);


    const user_type = user_data?.data?.role;
    const module_name = "ring group";
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let group_uuid = "";
    let add_per = PermissionCheck(module_name, "add", "", "", "");

    const GetRingGroupList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.user_type = user_type,
                dict.group_per = listing_per,
                dict.group_uuid = group_uuid,
                dict.search = "",
                dict.off_set = 0,
                dict.limits = 10,
                dict.orderby = "ring_group_name ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Ring_Group_List(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {

            if (listing_per == "none") {
                navigate("Error");
            }
            else if (listing_per === "group") {
                group_uuid = user_data.data?.group_id;
            }

            if (module_per === "" || user_type === "admin") {
                setIsPermission(true);
            } else {
                setIsPermission(false)
            }
            GetRingGroupList()
        }, [])
    )

    useEffect(() => {
        Log('apiRingGroupList :', apiRingGroupList);
        if (apiRingGroupList == STATUS_FULFILLED) {
            Log("ring_group_list :", ring_group_list)
            if (ring_group_list !== null) {
                const initialListDataSource = ring_group_list.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setRingGroupList(initialListDataSource)
            }
        } else if (apiRingGroupList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiRingGroupList]);

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

    const DeleteBtn = (item) => {

        if (item?.ring_group_uuid !== "") {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.ring_group_uuid = item?.ring_group_uuid
            dispatch(Delete_Ring_Group(dict));
        }

    }

    useEffect(() => {
        Log('apiDeleteRingGroup :', apiDeleteRingGroup);
        if (apiDeleteRingGroup == STATUS_FULFILLED) {
            GetRingGroupList()
        } else if (apiDeleteRingGroup == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteRingGroup]);

    const handleDeleteBtn = (item) => {

        Alert.alert(
            //title
            item?.ring_group_name,
            //body
            'Are you sure to delete this ring group?',
            [
                {
                    text: 'No',
                    onPress: () => {}, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        DeleteBtn(item)
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    }

    return (

        <>

           
                    <HeaderBackView
                        title="Ring Group"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                {isPermission == true ?
                    <>
                        {
                            listDataSource !== null && isPermission == true &&
                            <>
                                {listDataSource.map((item, key) => (
                                    <ExpandableComponent
                                        key={item.uuid}
                                        onClickFunction={() => {
                                            updateLayout(key);
                                        }}
                                        onDelete={() => {
                                            handleDeleteBtn(item)
                                        }}
                                        item={item}
                                    />
                                ))}
                            </>
                        }
                        {add_per == "yes" ?
                            <TouchableOpacity onPress={() => {
                                navigate("RingGroupManage", { isEdit: false })
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
                                }}>{"Add New Ring Group"}</Text>
                            </TouchableOpacity>
                            :
                            <></>
                        }
                    </>
                    :
                    <DoNotAccess />
                }
            {isLoading && <LoadingView />}
        </>
    );
};

export default RingGroup;

const styles = StyleSheet.create({

});
