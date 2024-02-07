
import { StyleSheet, TouchableOpacity, Text, View, LayoutAnimation, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { REGULAR } from '@constants/Fonts';
import { black05, darkGrey, disableColor, midGreen, red, yellow } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Delete_Audio_File, Get_Audio_List_By_Type } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { resetAudioApiStatus } from '../../../redux/reducers/audioReducer';
import { useFocusEffect } from '@react-navigation/native';
import LoadingView from '../../../commonComponents/LoadingView';
import { MEDIUM } from '../../../constants/Fonts';
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import DoNotAccess from '../../../commonComponents/DoNotAccess';


const ExpandableComponent = ({ item, onClickFunction, route, onDelete }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);
    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        } else {
            setLayoutHeight(0);
        }
    }, [item.isExpanded]);

    const Totalfile = (data) => {
        return data?.moh_file?.length
    }
    const module_name = "audio files";

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
                    }}>{item?.recording_name}</Text>
                    {item?.type == "moh" ?
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: MEDIUM,
                            lineHeight: 24
                        }}>{"Total File : " + Totalfile(item)}</Text>

                        : <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: REGULAR,
                            lineHeight: 24
                        }}>{item?.recording_filename}</Text>
                    }

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

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 40, marginVertical: 14 }}>
                        {edit_show !== "hidden" ? <TouchableOpacity onPress={() => {
                            navigate("ManageAudioFiles", { isEdit: true, item: item, type: route?.params?.type })
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
const AudioFiles = ({ navigation, route }) => {

    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [AudioFileList, setAudioFileList] = useState([]);

    const dispatch = useDispatch();

    const apiAudioListByType = useSelector(
        state => state.audioRedux.apiAudioListByType,
    );
    const apiDeleteRecording = useSelector(
        state => state.audioRedux.apiDeleteRecording,
    );
    const audio_file_list_by_type = useSelector(
        state => state.audioRedux.audio_file_list_by_type,
    );
    const isLoading = useSelector(state => state.audioRedux.isLoader);
    const isError = useSelector(state => state.audioRedux.isError);
    const error_message = useSelector(state => state.audioRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const module_name = "audio files";
    const [isPermission, setIsPermission] = useState(true);
    const user_type = user_data.role;
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let add_per = PermissionCheck(module_name, "add", "", "", "");
    let group_uuid = "";

    useEffect(() => {

    }, []);

    useFocusEffect(
        useCallback(() => {

            CallAudioApi()
            return () => {
                dispatch(resetAudioApiStatus())
            };
        }, [route?.params?.type])
    );

    const CallAudioApi = () => {
        if (route?.params?.type !== "") {
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

            dict.createdby = user_data?.data?.user_uuid,
                dict.group_per = listing_per,
                dict.group_uuid = group_uuid,
                dict.limits = 10,
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.off_set = 0,
                dict.orderby = "r.created_at DESC",
                dict.search = "",
                dict.type = route?.params?.type,
                dict.user_type = user_type
            dispatch(Get_Audio_List_By_Type(dict));
        }
    }

    useEffect(() => {
        Log('apiAudioListByType :', apiAudioListByType);
        if (apiAudioListByType == STATUS_FULFILLED) {
            if (audio_file_list_by_type !== null) {
                const initialListDataSource = audio_file_list_by_type.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setAudioFileList(initialListDataSource)
                setListDataSource(initialListDataSource)
            }
        } else if (apiAudioListByType == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiAudioListByType]);

    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...AudioFileList];
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

        if (item?.recording_uuid !== "") {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.recording_uuid = item?.recording_uuid
            dispatch(Delete_Audio_File(dict));
        }

    }

    useEffect(() => {
        Log('apiDeleteRecording :', apiDeleteRecording);
        if (apiDeleteRecording == STATUS_FULFILLED) {
            CallAudioApi()
        } else if (apiDeleteRecording == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteRecording]);

    const handleDeleteBtn = (item) => {
        Alert.alert(
            //title
            item?.recording_name,
            //body
            'Are you sure to delete this file?',
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
                        title="Audio Files"
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
                            AudioFileList !== null &&
                            <>
                                {AudioFileList.map((item, key) => (
                                    <ExpandableComponent
                                        key={item.recording_uuid}
                                        onClickFunction={() => {
                                            updateLayout(key);
                                        }}
                                        onDelete={() => {
                                            handleDeleteBtn(item)
                                        }}
                                        route={route}
                                        item={item}
                                    />
                                ))}
                            </>
                        }
                        {add_per === "yes" &&
                            <TouchableOpacity onPress={() => {
                                navigate("ManageAudioFiles", { isEdit: false, type: route?.params?.type })
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
                                }}>{"Upload New File"}</Text>
                            </TouchableOpacity>
                        }
                    </>
                    :
                    <DoNotAccess />
                }
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default AudioFiles;

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
