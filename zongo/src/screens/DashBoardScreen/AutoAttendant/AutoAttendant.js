
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
import { black05, darkGrey, disableColor, grey, midGreen, red, yellow } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { Check_Assign_Module, Delete_Auto_Attendant, Get_Auto_Attendant_List } from '../../../redux/api/Api';
import { resetAutoAttendantApiStatus } from '../../../redux/reducers/autoAttendantReducer';
import { useFocusEffect } from '@react-navigation/native';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import LoadingView from '../../../commonComponents/LoadingView';
import moment from 'moment';
import { resetGeneralApiStatus } from '../../../redux/reducers/generalReducer';


const ExpandableComponent = ({ item, onClickFunction, onDelete }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);

    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        } else {
            setLayoutHeight(0);
        }
    }, [item.isExpanded]);

    const DateFormat = (date) => {
        const dateObject = moment(date, 'MM/DD/YYYY HH:mm:ss');
        const formattedDate = dateObject.format('MM/DD/YYYY');
        return formattedDate;
    }

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
                    }}>{item?.ivr_menu_name}</Text>
                    <Text style={{
                        fontSize: FontSize.FS_13,
                        color: black,
                        fontFamily: REGULAR,
                        lineHeight: 24
                    }}>{item?.recording_filename}</Text>

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
                                }}>{item?.ivr_menu_extension}</Text>

                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                            <View style={{ flex: 0.5, alignItems: "flex-start", }}>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                }}>CREATED-AT :</Text>

                            </View>
                            <View style={{ flex: 0.5, alignItems: "flex-start" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    lineHeight: 24,
                                    textTransform: "capitalize"
                                }}>{DateFormat(item?.created_at)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 40, marginVertical: 14 }}>
                        <TouchableOpacity onPress={() => {
                            navigate("ManageAutoAttendant", { isEdit: true,item: item})
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
                    </View>
                </View>
            </View>
        </View>
    );
};
const AutoAttendant = ({ navigation }) => {

    const [AutoAttendantList, setAutoAttendantList] = useState([]);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [FilterModelVisible, setFilterModelVisible] = useState(false);
    const [SearchText, setSearchText] = useState("");
    const [FilterDescription, setFilterDescription] = useState("");
    const [FillterDestination, setFillterDestination] = useState(null);
    const [SelectedAutoAttendant, setSelectedAutoAttendant] = useState(null);
    const [AssignModuleModel, setAssignModuleModel] = useState(false);

    const dispatch = useDispatch();

    const apiAutoAttendantList = useSelector(state => state.AutoAttendantRedux.apiAutoAttendantList);
    const apiDeleteAutoAttendant = useSelector(state => state.AutoAttendantRedux.apiDeleteAutoAttendant);
    const auto_attendant_list = useSelector(state => state.AutoAttendantRedux.auto_attendant_list);

    const apiCheckAssignModule = useSelector(state => state.generalRedux.apiCheckAssignModule);
    const assign_module_data = useSelector(state => state.generalRedux.assign_module_data);


    const isLoading = useSelector(state => state.AutoAttendantRedux.isLoader);
    const isError = useSelector(state => state.AutoAttendantRedux.isError);
    const error_message = useSelector(state => state.AutoAttendantRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);


    const GetAutoAttendantList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.user_type = "admin",
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.search = "",
                dict.off_set = 0,
                dict.limits = 10,
                dict.orderby = "ivr_menu_extension ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Auto_Attendant_List(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {
            GetAutoAttendantList()
            return () => {
                dispatch(resetAutoAttendantApiStatus());
                dispatch(resetGeneralApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        console.log('apiAutoAttendantList :', apiAutoAttendantList);
        if (apiAutoAttendantList == STATUS_FULFILLED) {
            console.log("auto_attendant_list :", auto_attendant_list)
            if (auto_attendant_list !== null) {
                const initialListDataSource = auto_attendant_list.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setAutoAttendantList(initialListDataSource)
            }
        } else if (apiAutoAttendantList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiAutoAttendantList]);

    const CheckAssignModule = (item) => {
        var dict = {
            check_type: "destination",
            createdby: user_data?.data?.user_uuid,
            module_name: "ivr",
            module_uuid:item?.ivr_menu_uuid
        }
        dispatch(Check_Assign_Module(dict))
    }

    useEffect(() => {
        console.log('apiCheckAssignModule :', apiCheckAssignModule);
        if (apiCheckAssignModule == STATUS_FULFILLED) {
            console.log("assign_module_data :", assign_module_data)
            console.log("assign_module_data :",  assign_module_data?.length)
            if (assign_module_data?.length > 0) {
                setAssignModuleModel(true)
            }
            else{
               setAssignModuleModel(false)
               handleDeleteBtn()
            }
        } else if (apiCheckAssignModule == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCheckAssignModule]);

    const DeleteAutoAttendant = (item) => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
            ivr_menu_uuid:SelectedAutoAttendant?.ivr_menu_uuid
        }
        dispatch(Delete_Auto_Attendant(dict))
    }

    useEffect(() => {
        console.log('apiDeleteAutoAttendant :', apiDeleteAutoAttendant);
        if (apiDeleteAutoAttendant == STATUS_FULFILLED) {
            GetAutoAttendantList()
        } else if (apiDeleteAutoAttendant == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteAutoAttendant]);
    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...AutoAttendantList];
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

    const checkAssingModule = (item) => {
        setSelectedAutoAttendant(item)
        CheckAssignModule(item)
    }
    const handleDeleteBtn = () => {
        Alert.alert(
            //title
            SelectedAutoAttendant?.ivr_menu_name,
            //body
            'Are you sure to delete this Auto-Attendant?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'), style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        console.log('Yes Pressed')
                        DeleteAutoAttendant()
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
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
                        title="Auto-Attendant"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>

                {
                    AutoAttendantList !== null &&
                    <>
                        {AutoAttendantList.map((item, key) => (
                            <ExpandableComponent
                                key={item.ivr_menu_extension}
                                onClickFunction={() => {
                                    updateLayout(key);
                                }}
                                onDelete={() => {
                                    checkAssingModule(item)
                                }}
                                item={item}
                            />
                        ))}
                    </>
                }
                <TouchableOpacity onPress={() => {
                    navigate("ManageAutoAttendant", { isEdit: false })
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
                    }}>{"Add New Auto-Attendant"}</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={AssignModuleModel}
                    onRequestClose={() => {
                        setAssignModuleModel(!AssignModuleModel);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                                marginTop:10
                            }}>{"This auto attendant is assign to following module."}</Text>
                             <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"Please, remove from that to delete."}</Text>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:20}}>

                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginRight:5,
                            }}>{assign_module_data[0]?.module + " : "}</Text>
                              <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{assign_module_data[0]?.value}</Text>
                            </View>

                            <TouchableOpacity onPress={() => {
                                setAssignModuleModel(false)
                            }}
                                style={{ backgroundColor: grey, height: 40, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 40,alignSelf:"center" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: MEDIUM,
                                }}>{"Close"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default AutoAttendant;

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
