
import { Alert, StyleSheet, TouchableOpacity, Text, View, LayoutAnimation } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { Delete_Sms_Template, Sms_Template_List } from '../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Log } from '../../commonComponents/Log';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM, REGULAR } from '../../constants/Fonts';
import { navigate } from '../../navigation/RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import CheckModulePermisson from '../../commonComponents/RolePermission/CheckModulePermisson';
import PermissionCheck from '../../commonComponents/RolePermission/PermissionCheck';
import DoNotAccess from '../../commonComponents/DoNotAccess';
import LoadingView from '../../commonComponents/LoadingView';
import { yellow, darkGrey, disableColor, midGreen, red } from '../../constants/Color';


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
                    }}>{item?.name}</Text>
                    <Text style={{
                        fontSize: FontSize.FS_13,
                        color: black,
                        fontFamily: REGULAR,
                        lineHeight: 24
                    }}>{item?.message}</Text>

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
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: black,
                            fontFamily: SEMIBOLD,
                            lineHeight: 24,
                            marginLeft: 30,
                        }}>TYPE :</Text>

                        <Text style={{
                            fontSize: FontSize.FS_10,
                            color: black,
                            fontFamily: MEDIUM,
                            lineHeight: 24,
                            marginLeft: 20
                        }}>{item?.message_type}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 4 }}>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: black,
                            fontFamily: SEMIBOLD,
                            lineHeight: 24,
                            marginLeft: 30,
                        }}>CREATED BY :</Text>

                        <Text style={{
                            fontSize: FontSize.FS_10,
                            color: black,
                            fontFamily: MEDIUM,
                            lineHeight: 24,
                            marginLeft: 20
                        }}>{item?.created_by_name}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 40, marginVertical: 14 }}>
                        {edit_show !== "hidden" ?
                            <TouchableOpacity onPress={() => {
                                navigate("SmsTemplateManage", { isEdit: true, item: item })
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
const SmsTemplate = ({ navigation }) => {

    const [SmsTemplateList, setSmsTemplateList] = useState(null);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [isPermission, setIsPermission] = useState(true);


    const dispatch = useDispatch();

    const apiSmsTemplateList = useSelector(state => state.messageRedux.apiSmsTemplateList);
    const sms_template_list_module = useSelector(state => state.messageRedux.sms_template_list_module);
    const isLoading = useSelector(state => state.messageRedux.isLoader);
    const isError = useSelector(state => state.messageRedux.isError);
    const error_message = useSelector(state => state.messageRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);
    const apiDeleteSmsTemplate = useSelector(state => state.messageRedux.apiDeleteSmsTemplate);


    const user_type = user_data?.data?.role;
    const module_name = "ring group";
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let group_uuid = "";
    let add_per = PermissionCheck(module_name, "add", "", "", "");

    const GetSmsTemplateList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.user_type = user_type,
                // dict.group_per = listing_per,
                dict.group_per = "all",
                // dict.group_uuid = group_uuid,
                dict.group_uuid = "",
                dict.search = "",
                dict.off_set = 0,
                dict.limits = 10,
                dict.orderby = "created_at ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.status = "ACTIVE"
            dispatch(Sms_Template_List(dict))
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
            GetSmsTemplateList()
        }, [])
    )

    useEffect(() => {
        Log('apiSmsTemplateList :', apiSmsTemplateList);
        if (apiSmsTemplateList == STATUS_FULFILLED) {
            Log("sms_template_list_module :", sms_template_list_module)
            if (sms_template_list_module !== null) {
                const initialListDataSource = sms_template_list_module.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setSmsTemplateList(initialListDataSource)
            }
        } else if (apiSmsTemplateList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiSmsTemplateList]);


    useEffect(() => {
        Log('apiDeleteSmsTemplate :', apiDeleteSmsTemplate);
        if (apiDeleteSmsTemplate == STATUS_FULFILLED) {
            GetSmsTemplateList()
        } else if (apiDeleteSmsTemplate == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteSmsTemplate]);


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

        if (item?.sms_temp_uuid !== "") {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.sms_temp_uuid = item?.sms_temp_uuid
            dispatch(Delete_Sms_Template(dict));
        }

    }



    const handleDeleteBtn = (item) => {

        Alert.alert(
            //title
            item?.name,
            //body
            'Are you sure to delete this sms template?',
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
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
                title="SMS Templates"
                isBack={true}
                isMenu={false}
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
                                    key={item.sms_temp_uuid}
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
                            navigate("SmsTemplateManage", { isEdit: false })
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
                            }}>{"Add New SMS Template"}</Text>
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

export default SmsTemplate;

const styles = StyleSheet.create({

});
