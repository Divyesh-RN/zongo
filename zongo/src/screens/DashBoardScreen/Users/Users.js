
import { StyleSheet, TouchableOpacity, Text, View, Modal, LayoutAnimation, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { Cretae_User, Delete_Time_Based_Routing, Get_Role_List_Dp, Get_Time_Based_Routing_List, Get_User_List, User_Delete } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { grey01, grey02 } from '../../../constants/Color';
import BottomSheet from '../../../commonComponents/BottomSheet/BottomSheet';
import { USERSTATUS } from '../../../constants/DATA/Status';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
import DoNotAccess from '../../../commonComponents/DoNotAccess';
import { WEBSOCKET_URL } from '../../../constants/ApiUrl';
import Global from '../../../constants/Global';


const ExpandableComponent = ({ item, onClickFunction, onDelete }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);
    const module_name = "users";
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
                    }}>{item?.first_name + " " + item?.last_name}</Text>
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
                        <View style={{ flex: 0.2, alignItems: "flex-start", }}>
                            <Text style={{
                                fontSize: FontSize.FS_11,
                                color: black,
                                fontFamily: SEMIBOLD,
                                lineHeight: 24,
                                marginLeft: 30,
                            }}>EMAIL :</Text>

                        </View>
                        <View style={{ flex: 0.8, alignItems: "flex-start" }}>
                            <Text style={{
                                fontSize: FontSize.FS_10,
                                color: black,
                                fontFamily: MEDIUM,
                                lineHeight: 24,
                            }}>{item?.email}</Text>

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
                                }}>EXTENSION :</Text>

                            </View>
                            <View style={{ flex: 0.4, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                }}>{item?.extension}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.3, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>ROLE :</Text>

                            </View>
                            <View style={{ flex: 0.7, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{item?.role_name}</Text>

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
                                }}>CREATED BY :</Text>

                            </View>
                            <View style={{ flex: 0.4, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                }}>{item?.created_by_name}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.3, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>STATUS :</Text>

                            </View>
                            <View style={{ flex: 0.7, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: item?.status == "ACTIVE" ? greenPrimary : red,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                }}>{item?.status}</Text>

                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 40, marginVertical: 14 }}>
                        {edit_show !== "hidden" ?
                            <TouchableOpacity onPress={() => {
                                navigate("ManageUser", { item: item })
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
                            <TouchableOpacity onPress={() => onDelete(item, true)}
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
const Users = ({ navigation }) => {

    const [UserList, setUserList] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);

    const [AddNewUserModal, setAddNewUserModal] = useState(false);
    const [AddFirstName, setAddFirstName] = useState("");
    const [AddFirstNameError, setAddFirstNameError] = useState("");
    const [AddLastName, setAddLastName] = useState("");
    const [AddLastNameError, setAddLastNameError] = useState("");
    const [AddEmail, setAddEmail] = useState("");
    const [AddEmailError, setAddEmailError] = useState("");
    const [AddJobTitle, setAddJobTitle] = useState("");
    const [AddJobTitleError, setAddJobTitleError] = useState("");
    const [AddRole, setAddRole] = useState(null);
    const [AddRoleError, setAddRoleError] = useState("");

    const [FilterModal, setFilterModal] = useState(false);
    const [FilterName, setFilterName] = useState("");
    const [FilterEmail, setFilterEmail] = useState("");
    const [FilterRole, setFilterRole] = useState(null);
    const [FilterStatus, setFilterStatus] = useState(null);
    const [SearchText, setSearchText] = useState("");
    const [isPermission, setIsPermission] = useState(true);


    const [UserUuid, setUserUuid] = useState("");
    // const [Socket, setSocket] = useState(null);


    const dispatch = useDispatch();

    const apiGetUserList = useSelector(state => state.userModuleRedux.apiGetUserList);
    const user_list = useSelector(state => state.userModuleRedux.user_list);

    const apiGetRoleDp = useSelector(state => state.userModuleRedux.apiGetRoleDp);
    const role_list = useSelector(state => state.userModuleRedux.role_list);

    const apiUserDelete = useSelector(state => state.userModuleRedux.apiUserDelete);

    const apiCreateUser = useSelector(state => state.userModuleRedux.apiCreateUser);

    const isLoading = useSelector(state => state.userModuleRedux.isLoader);
    const isError = useSelector(state => state.userModuleRedux.isError);
    const error_message = useSelector(state => state.userModuleRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const module_name = "users";
    var user_type = user_data?.data?.role;
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let group_uuid = "";
    let add_per = PermissionCheck(module_name, "add", "", "", "");
console.log("add per user",add_per)
    const GetUserList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.user_type = user_type,
                dict.group_per = listing_per,
                dict.group_uuid = group_uuid,
                dict.search = "",
                dict.off_set = 0,
                dict.limits = 100,
                dict.orderby = "first_name ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.searchData = { user_name: "", email: "", role: "", status: "" },
                dict.status = "ACTIVE",
                dict.filter = "",
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_User_List(dict))
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
            if (module_per == "" || user_type == "admin") {
                GetUserList()
            }
            return () => {
                dispatch(resetTimeBasedRoutingApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetUserList :', apiGetUserList);
        if (apiGetUserList == STATUS_FULFILLED) {
            Log("user_list :", user_list)
            if (user_list !== null) {
                const initialListDataSource = user_list?.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setUserList(initialListDataSource)
            }
        } else if (apiGetUserList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetUserList]);


    useEffect(() => {
        // const ws = new WebSocket(WEBSOCKET_URL);
        // ws.onopen = () => {
        //     console.log("WebSocket connection opened");
        // };
        // ws.onclose = () => {
        //     console.log("WebSocket connection closed");
        // };
        // setSocket(ws);
        // return () => {
        //     ws.close();
        // };
    }, []);

    const DeleteUser = (id) => {
        
        setUserUuid(id)
        const fileData = {
            type: "user_delete",
            file_type: "", // You can replace this with the actual username
            data: id,
            fileName: "",
        };

        if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
            Global.Socket.send(JSON.stringify(fileData));
        }
        return
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.user_uuid = id,
                dispatch(User_Delete(dict))
        }
    }

    useEffect(() => {
        Log('apiUserDelete :', apiUserDelete);
        if (apiUserDelete == STATUS_FULFILLED) {
            GetUserList()

            const fileData = {
                type: "user_delete",
                file_type: "", // You can replace this with the actual username
                data: UserUuid,
                fileName: "",
            };

            if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
                Global.Socket.send(JSON.stringify(fileData));
            }

        } else if (apiUserDelete == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUserDelete]);

    const GetRoleList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Role_List_Dp(dict))
        }
    }

    useEffect(() => {
        Log('apiGetRoleDp :', apiGetRoleDp);
        if (apiGetRoleDp == STATUS_FULFILLED) {
            if (role_list !== null) {
                console.log("role_list :", role_list)
            }
        } else if (apiGetRoleDp == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetRoleDp]);

    const CreateUser = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.email = AddEmail,
                dict.first_name = AddFirstName,
                dict.job_title = AddJobTitle,
                dict.last_name = AddLastName,
                dict.role_uuid = AddRole?.role_uuid
            dict.main_user_uuid = user_data?.data?.main_uuid
            console.log("CREATE USER DICT :", dict);
            dispatch(Cretae_User(dict))
        }
    }

    useEffect(() => {
        Log('apiCreateUser :', apiCreateUser);
        if (apiCreateUser == STATUS_FULFILLED) {
            GetUserList()
            resetAddNewModal()
        } else if (apiCreateUser == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateUser]);

    const resetAddNewModal = () => {
        setAddNewUserModal(false)
        setAddEmail("")
        setAddFirstName("")
        setAddLastName("")
        setAddJobTitle("")
        setAddRole(null)
    }

    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...UserList];
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
        if (AddFirstName == "") {
            setAddFirstNameError("*Please Enter First Name");
        }
        if (AddLastName == "") {
            setAddLastNameError("*Please Enter Last Name");
        }
        if (AddEmail == "") {
            setAddEmailError("*Please Enter Email");
        }
        if (AddRole == null) {
            setAddRoleError("*Please Select Role");
        }
        if (AddJobTitle == "") {
            setAddJobTitleError("*Please Enter Job Title");
        }
        else {
            CreateUser()
        }

    }
    const handleDeleteBtn = (item) => {
        Alert.alert(
            item?.first_name + " " + item?.last_name,
            'Are you sure to delete this Time-Based Routing?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'), style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        console.log('Yes Pressed')
                        DeleteUser(item?.uuid)
                    }
                },
            ],
            { cancelable: true },
        );
    }
    const handleSearchText = (search) => {

        let text = String(search).toLowerCase().replace("?", "")
        let items = listDataSource
        let filteredItems = items.filter((item) => {
            return String(item.first_name).toLowerCase().match(text) || String(item.last_name).toLowerCase().match(text) || String(item.email).toLowerCase().match(text) || String(item.extension).toLowerCase().match(text)
        })
        console.log("filteredItems :", filteredItems)
        if (!text || text === '') {
            setUserList(listDataSource)
        } else if (!Array.isArray(filteredItems) && !filteredItems.length) {
            setUserList([])
        } else if (Array.isArray(filteredItems)) {
            setUserList(filteredItems)
        }

        setSearchText(search)
    }
    const resetFilter = () => {
        setFilterModal(false)
        setFilterEmail("")
        setFilterName("")
        setFilterRole(null)
        setFilterStatus(null)
        GetUserList()
    }
    const RolebottomSheetRef = useRef(null);
    const openRoleBottomSheet = () => {
        if (RolebottomSheetRef.current) {
            RolebottomSheetRef.current.open();
        }
    };

    const StatusbottomSheetRef = useRef(null);
    const openStatusBottomSheet = () => {
        if (StatusbottomSheetRef.current) {
            StatusbottomSheetRef.current.open();
        }
    };
    const handleFilter = () => {
        if (FilterName == "" && FilterEmail == "" && FilterRole == null && FilterStatus == null) {
            alert("Please Enter any filter value")
        }
        else {
            setFilterModal(false)
            if (user_data !== null) {
                var dict = {};
                dict.user_type = "admin",
                    dict.group_per = "all",
                    dict.group_uuid = "",
                    dict.search = "",
                    dict.off_set = 0,
                    dict.limits = 20,
                    dict.orderby = "first_name ASC",
                    dict.createdby = user_data?.data?.user_uuid,
                    dict.searchData = {
                        user_name: FilterName !== "" ? FilterName : "",
                        email: FilterEmail !== "" ? FilterEmail : "",
                        role: FilterRole !== null ? FilterRole?.role_uuid : "",
                        status: FilterStatus !== null ? FilterStatus?.status : "",
                        type: "search"
                    },
                    dict.status = "ACTIVE",
                    dict.filter = "",
                    dict.main_uuid = user_data?.data?.main_uuid,
                    dispatch(Get_User_List(dict))
            }
        }

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
                    paddingBottom: 100
                }}>
                <View style={{ marginHorizontal: 20 }}>
                    <HeaderBackView
                        title="Users"
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
                                        setUserList(listDataSource)
                                        setSearchText("")
                                    }}
                                        style={{ paddingRight: 14 }}>
                                        <Icon name="close" size={20} color={grey} />
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={() => {
                                    // GetPrefix()
                                    setFilterModal(!FilterModal);
                                    GetRoleList()
                                }}
                                    style={{ backgroundColor: grey02, height: 38, width: 38, alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="filter-variant" size={24} color={white} />

                                </TouchableOpacity>
                            </View>
                        </View>

                        {
                            UserList !== null && isPermission == true &&
                            <>
                                {UserList.map((item, key) => (
                                    <ExpandableComponent
                                        key={item.uuid}
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

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={AddNewUserModal}
                            onRequestClose={() => {
                                setAddNewUserModal(!AddNewUserModal);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                                        onPress={() => resetAddNewModal()}>
                                        <Icon name={"close"} size={24} color={black} />
                                    </TouchableOpacity>
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"First Name"}</Text>
                                    <TextInput
                                        value={AddFirstName}
                                        placeholder='Enter First Name'
                                        placeholderTextColor={grey}
                                        style={styles.textInputModal}
                                        onChangeText={(txt) => {
                                            if (txt.length > 0) {
                                                setAddFirstNameError("")
                                            }
                                            setAddFirstName(txt)
                                        }}
                                    />
                                    {AddFirstNameError !== "" && <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: REGULAR,
                                    }}>{AddFirstNameError}</Text>
                                    }
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Last Name"}</Text>
                                    <TextInput
                                        value={AddLastName}
                                        placeholder='Enter Last Name'
                                        placeholderTextColor={grey}
                                        style={styles.textInputModal}
                                        onChangeText={(txt) => {
                                            if (txt.length > 0) {
                                                setAddLastNameError("")
                                            }
                                            setAddLastName(txt)
                                        }}
                                    />
                                    {AddLastNameError !== "" && <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: REGULAR,
                                    }}>{AddLastNameError}</Text>
                                    }
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Email"}</Text>
                                    <TextInput
                                        value={AddEmail}
                                        placeholder='Enter Email'
                                        placeholderTextColor={grey}
                                        style={styles.textInputModal}
                                        onChangeText={(txt) => {
                                            if (txt.length > 0) {
                                                setAddEmailError("")
                                            }
                                            setAddEmail(txt)
                                        }}
                                    />
                                    {AddEmailError !== "" && <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: REGULAR,
                                    }}>{AddEmailError}</Text>
                                    }
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Role"}</Text>
                                    <TouchableOpacity onPress={() => {
                                        openRoleBottomSheet()
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
                                        }}>{AddRole == null ? "Select Role" : AddRole?.role_name}</Text>
                                        <Icon name={"chevron-down"} size={22} color={grey} />

                                    </TouchableOpacity>
                                    {AddRoleError !== "" && <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: REGULAR,
                                    }}>{AddRoleError}</Text>}
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Job Title"}</Text>
                                    <TextInput
                                        value={AddJobTitle}
                                        placeholder='Enter Job Title'
                                        placeholderTextColor={grey}
                                        style={styles.textInputModal}
                                        onChangeText={(txt) => {
                                            if (txt.length > 0) {
                                                setAddJobTitleError("")
                                            }
                                            setAddJobTitle(txt)
                                        }}
                                    />
                                    {AddJobTitleError !== "" && <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: REGULAR,
                                    }}>{AddJobTitleError}</Text>}
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
                                        }}>{"Create"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={FilterModal}
                            onRequestClose={() => {
                                setFilterModal(!FilterModal);
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
                                            onPress={() => setFilterModal(false)}>
                                            <Icon name={"close"} size={24} color={black} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Name"}</Text>
                                    <TextInput
                                        value={FilterName}
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
                                            setFilterName(txt)
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Email"}</Text>
                                    <TextInput
                                        value={FilterEmail}
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
                                            setFilterEmail(txt)
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Role"}</Text>
                                    <TouchableOpacity onPress={() => {
                                        openRoleBottomSheet()
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
                                        }}>{FilterRole == null ? "Select Role" : FilterRole?.role_name}</Text>
                                        <Icon name={"chevron-down"} size={22} color={grey} />

                                    </TouchableOpacity>
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10
                                    }}>{"Status"}</Text>
                                    <TouchableOpacity onPress={() => {
                                        openStatusBottomSheet()
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
                                        }}>{FilterStatus == null ? "Select Status" : FilterStatus?.status}</Text>
                                        <Icon name={"chevron-down"} size={22} color={grey} />

                                    </TouchableOpacity>
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
                        <BottomSheet
                            headerTitle={"Select Role"}
                            Data={role_list}
                            titleValue={"role_name"}
                            bottomSheetRef={RolebottomSheetRef}
                            selectedValue={(data) => {
                                if (AddNewUserModal == true) {
                                    setAddRole(data)
                                    setAddRoleError("")
                                }
                                else {
                                    setFilterRole(data)
                                }
                            }} />

                        <BottomSheet
                            headerTitle={"Select Status"}
                            Data={USERSTATUS}
                            titleValue={"status"}
                            bottomSheetRef={StatusbottomSheetRef}
                            selectedValue={(data) => {
                                setFilterStatus(data)
                            }} />
                    </>
                    :
                    <DoNotAccess />
                }
            </HeaderView>
            {add_per === "yes" &&
                <TouchableOpacity onPress={() => {
                    setAddNewUserModal(!AddNewUserModal);
                    GetRoleList()
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
                    }}>{"Add New User"}</Text>
                </TouchableOpacity>
            }
            {isLoading && <LoadingView />}
        </>
    );
};

export default Users;

const styles = StyleSheet.create({
    textInputModal: {
        borderWidth: 1,
        borderColor: grey,
        height: 40,
        borderRadius: 4,
        paddingHorizontal: 14,
        marginVertical: 6,
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_12,
        color: black

        ,
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
});
