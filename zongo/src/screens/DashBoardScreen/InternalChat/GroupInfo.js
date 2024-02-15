import { Text, TouchableOpacity, StyleSheet, View, FlatList, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Image, ImageBackground, ScrollView, StatusBar, Modal } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Delete_Group_Member, Get_Group_User_Details, Get_Internal_Chat_Log_User, Get_User_List_Chat, Update_Group, Update_Group_Name } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../../constants/ConstantKey';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { black, greenPrimary, white, grey, bgColor01, light_grey, red, grey01, grey02, paleGreen, darkgreen01, disableColor, black05 } from '../../../constants/Color';
import { BOLD, FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import { useFocusEffect } from '@react-navigation/native';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import LoadingView from '../../../commonComponents/LoadingView';
import { emojiData } from '../../../constants/DATA/output';
import EmojiPicker from './EmojiPicker';
import DocumentPicker from 'react-native-document-picker';
import { resetInternalChatStatus } from '../../../redux/reducers/internalChatReducer';
import { COMMAN_IMAGE_URL, IMAGE_URL, INTERNAL_CHAT_IMAGE_URL } from '../../../constants/ApiUrl';
import IconButton from '../../../commonComponents/IconButton';


const GroupInfo = ({ route }) => {

    const [messageText, setMessageText] = useState('');
    const [GroupDetails, setGroupDetails] = useState(null);
    const [DocumentViewOpen, setDocumentViewOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [ToName, setToName] = useState(route?.params?.item?.name || "");
    const [GroupName, setGroupName] = useState("")
    const [GroupNameEdit, setGroupNameEdit] = useState(false)
    const [GroupNameError, setGroupNameError] = useState("")
    const [UserList, setUserList] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([]);

    const dispatch = useDispatch();

    const apiGetInternalChatLogUser = useSelector(state => state.internalChatRedux.apiGetInternalChatLogUser);
    const perticular_user_chat_log = useSelector(state => state.internalChatRedux.perticular_user_chat_log);
    const apiUpdateGroup = useSelector(state => state.internalChatRedux.apiUpdateGroup);
    const apiUpdateGroupName = useSelector(state => state.internalChatRedux.apiUpdateGroupName);
    const apiDeleteGroupMember = useSelector(state => state.internalChatRedux.apiDeleteGroupMember);
    
    const apiGetGroupUserDetails = useSelector(state => state.internalChatRedux.apiGetGroupUserDetails);
    const group_user_details = useSelector(state => state.internalChatRedux.group_user_details);
    const user_list_chat = useSelector(state => state.internalChatRedux.user_list_chat);
    const apiGetUserListChat = useSelector(state => state.internalChatRedux.apiGetUserListChat);

    const isLoading = useSelector(state => state.internalChatRedux.isLoader);
    const isError = useSelector(state => state.internalChatRedux.isError);
    const error_message = useSelector(state => state.internalChatRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);


    const CallAllApi = () => {
        if (user_data !== null && route?.params?.item?.internal_chat_group_uuid !== undefined) {
            var dict = {
                createdby: user_data?.data?.user_uuid,
                group_uuid: route?.params?.item?.internal_chat_group_uuid,
                main_uuid: user_data?.data?.main_uuid,
            }
            dispatch(Get_Group_User_Details(dict))
        }
        if (user_data !== null) {
            var dict = {
                createdby: user_data?.data?.user_uuid,
                main_uuid: user_data?.data?.main_uuid,
            }
            dispatch(Get_User_List_Chat(dict))
        }

    }

    useFocusEffect(
        useCallback(() => {
            CallAllApi()
            return () => {
                dispatch(resetInternalChatStatus());
                setGroupDetails(null)
            };
        }, [])
    );

    useEffect(() => {
        Log('apiGetGroupUserDetails :', apiGetGroupUserDetails);
        if (apiGetGroupUserDetails == STATUS_FULFILLED) {
            if (group_user_details !== null) {
                setGroupDetails(group_user_details)
                setGroupName(group_user_details?.groupData?.name)
                const selectedUserUUIDs = group_user_details?.groupUserData.map(member => member.user_uuid);
                setSelectedUsers(selectedUserUUIDs);
            }
        } else if (apiGetGroupUserDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetGroupUserDetails]);

    useEffect(() => {
        Log('apiGetUserListChat :', apiGetUserListChat);
        if (apiGetUserListChat == STATUS_FULFILLED) {
            if (user_list_chat !== null) {
                setUserList(user_list_chat)

            }
        } else if (apiGetUserListChat == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetUserListChat]);

    useEffect(() => {
        Log('apiUpdateGroup :', apiUpdateGroup);
        if (apiUpdateGroup == STATUS_FULFILLED) {
            CallAllApi()
            setModalVisible(false)
        } else if (apiUpdateGroup == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateGroup]);

    useEffect(() => {
        Log('apiUpdateGroupName :', apiUpdateGroupName);
        if (apiUpdateGroupName == STATUS_FULFILLED) {
            CallAllApi()
        } else if (apiUpdateGroupName == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateGroupName]);

    useEffect(() => {
        Log('apiDeleteGroupMember :', apiDeleteGroupMember);
        if (apiDeleteGroupMember == STATUS_FULFILLED) {
            CallAllApi()
        } else if (apiDeleteGroupMember == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteGroupMember]);

    const getRandomColor = () => {
        const colors = ['#ADD8E6', '#90EE90', '#FFB6C1', '#E6E6FA'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const GetName = (name) => {
        const words = name.split(" ");

        let initials = "";

        words.forEach(word => {
            if (word.length > 0) {
                initials += word[0].toUpperCase();
            }
        });

        return initials;
    }
    const onUserDelete = (user) => {
        Alert.alert(
            user?.username,
            'Are you sure to delete this group member?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            group_delete:"member",
                            group_uuid: route?.params?.item?.internal_chat_group_uuid,
                            user_uuid: user?.user_uuid,
                        }
                        dispatch(Delete_Group_Member(dict))
                    }
                },
            ],
            { cancelable: true },
        );
    }

    const onDeleteGroup = () => {
        Alert.alert(
            GroupName,
            'Are you sure to delete this group?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            group_delete:"all",
                            group_uuid: route?.params?.item?.internal_chat_group_uuid,
                            // user_uuid: user?.user_uuid,
                        }
                        dispatch(Delete_Group_Member(dict))
                        navigate("ChatGroups")
                    }
                },
            ],
            { cancelable: true },
        );
    }

    const onEditName = (name) => {
        var dict = {
            name: GroupName,
            createdby: user_data?.data?.user_uuid,
            internal_chat_group_uuid: route?.params?.item?.internal_chat_group_uuid,
            main_uuid: user_data?.data?.main_uuid,
        }
        dispatch(Update_Group_Name(dict))
        setGroupNameEdit(false)

    }

    const toggleUserSelection = (user_uuid) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(user_uuid)) {
                // If user is already selected, remove from selected list
                return prevSelectedUsers.filter(id => id !== user_uuid);
            } else {
                // If user is not selected, add to selected list
                return [...prevSelectedUsers, user_uuid];
            }
        });
    };

    const onAddUser = () => {
        const formattedSelectedUsers = selectedUsers.map(user_uuid => {
            const user = UserList.find(user => user.user_uuid === user_uuid);
            return {
                value: user.user_uuid,
                label: `${user.first_name} ${user.last_name}`
            };
        });

        var dict = {
            assign_user_data: formattedSelectedUsers,
            createdby: user_data?.data?.user_uuid,
            group_uuid: route?.params?.item?.internal_chat_group_uuid,
            main_uuid: user_data?.data?.main_uuid,
        }
        dispatch(Update_Group(dict))

    }

    return (
        <>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View
                style={{
                    backgroundColor: darkgreen01,
                    paddingTop: 28,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => {
                            goBack()
                        }}>
                            <Icon name="arrow-left" size={25} color={white} />
                        </IconButton>
                    </View>


                </View>
                <View style={{ width: 70, height: 70, borderRadius: 100, backgroundColor: paleGreen, alignSelf: "center", alignItems: "center", justifyContent: "center", marginBottom: -35, borderWidth: 1, borderColor: greenPrimary, marginTop: 20 }}>
                    <Text style={{
                        marginVertical: 20,
                        fontFamily: SEMIBOLD,
                        fontSize: FontSize.FS_21,
                        color: greenPrimary,
                        textAlign: "center"
                    }}>{GroupName.charAt(0)}</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, marginTop: 50 }}>
                {GroupNameEdit == false ?
                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                        <Text style={{
                            fontFamily: SEMIBOLD,
                            fontSize: FontSize.FS_18,
                            color: black,
                            flex: 1,
                        }}>{GroupName}</Text>
                        <TouchableOpacity onPress={() => {
                            setGroupNameEdit(true)

                        }}
                            style={{ marginLeft: 10, }}>
                            <Icon name="pencil-outline" size={22} color={grey} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{
                        marginTop: 14,
                        flexDirection: "row", alignItems: "center"
                    }}>
                        <TextInput
                            value={GroupName}
                            placeholder='12345'
                            placeholderTextColor={grey01}
                            style={{
                                borderWidth: 1,
                                marginVertical: 4,
                                borderColor: grey01,
                                height: 36,
                                borderRadius: 6,
                                paddingHorizontal: 14,
                                flex: 1,
                                fontFamily: MEDIUM,
                                color: black
                            }}
                            onChangeText={(txt) => {
                                setGroupName(txt)
                                setGroupNameError("")
                            }}
                        />
                        <TouchableOpacity onPress={() => {
                            onEditName()
                        }}
                            style={{ backgroundColor: greenPrimary, height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                            <Icon name="check" size={22} color={white} />
                        </TouchableOpacity>
                    </View>
                }
                <Text style={{
                    fontFamily: MEDIUM,
                    fontSize: FontSize.FS_10,
                    color: black,
                    // textAlign: "center",
                    marginVertical: 4
                }}>{"Created at "}<Text style={{ fontFamily: MEDIUM }}>{GroupDetails?.groupData?.created_at}</Text></Text>
                <View style={{ marginTop: 30, marginBottom: 20 }}>
                    <Text
                        style={{
                            fontSize: FontSize.FS_10,
                            color: grey,
                            fontFamily: SEMIBOLD,
                            marginTop: 2,
                            textTransform: "uppercase"
                        }}>
                        {GroupDetails?.groupUserData?.length + " participants"}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                }}
                    style={{
                        borderBottomColor: disableColor,
                        borderBottomWidth: 0.7,
                        marginBottom: 6,
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>

                    <TouchableOpacity onPress={() => {
                        setModalVisible(!modalVisible);
                    }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ borderRadius: 14 }}>
                            <View style={{
                                backgroundColor: disableColor,
                                borderRadius: 100,
                                width: 36,
                                height: 36,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <TouchableOpacity onPress={() => { }}>
                                    <Icon name="plus" size={20} color={grey} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        <View style={{ marginLeft: 14, }}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                            }}>{"Add participants"}</Text>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
                <FlatList
                    data={GroupDetails?.groupUserData}
                    keyExtractor={item => Math.random()}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity onPress={() => {
                        }}
                            style={{
                                borderBottomColor: disableColor,
                                borderBottomWidth: 0.7,
                                marginBottom: 6,
                                paddingVertical: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ borderRadius: 14 }}>
                                    <View style={{
                                        backgroundColor: getRandomColor(),
                                        borderRadius: 100,
                                        width: 36,
                                        height: 36,
                                        justifyContent: "center",
                                        alignItems: "center",

                                    }}>
                                        <Text style={{ fontSize: 12, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item?.username)} </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                    }}>{item?.username}</Text>
                                    <TouchableOpacity onPress={() => {
                                        onUserDelete(item)
                                    }}>
                                        <Icon name="delete" size={22} color={red} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
                <TouchableOpacity onPress={() => { onDeleteGroup() }}
                    style={{
                        paddingVertical: 6, backgroundColor: red, borderRadius: 8, alignItems: "center", marginTop: 50, flexDirection: "row", justifyContent: "center"
                    }}>
                    <Text style={{
                        fontSize: FontSize.FS_12,
                        color: white,
                        fontFamily: SEMIBOLD,
                        marginRight: 4
                    }}>{"Delete Group"}</Text>
                    <Icon name="delete" size={20} color={white} />
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{
                            fontSize: FontSize.FS_16,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 6,
                            marginBottom: 20
                        }}>{"Manage group members"}</Text>
                        <FlatList
                            data={UserList}
                            keyExtractor={item => Math.random()}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => {
                                    toggleUserSelection(item.user_uuid)
                                }}
                                    style={{
                                        borderBottomColor: disableColor,
                                        borderBottomWidth: 0.7,
                                        marginBottom: 6,
                                        paddingVertical: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{ borderRadius: 14 }}>
                                            <View style={{
                                                backgroundColor: getRandomColor(),
                                                borderRadius: 100,
                                                width: 36,
                                                height: 36,
                                                justifyContent: "center",
                                                alignItems: "center",

                                            }}>
                                                <Text style={{ fontSize: 12, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item?.first_name + " " + item?.last_name)} </Text>

                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ marginLeft: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_13,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                            }}>{item?.first_name + " " + item?.last_name}</Text>

                                            <TouchableOpacity onPress={() => toggleUserSelection(item.user_uuid)}>
                                                <Icon
                                                    name={selectedUsers.includes(item.user_uuid) ? "checkbox-marked" : "checkbox-blank-outline"}
                                                    size={22}
                                                    color={grey}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                </TouchableOpacity>
                            }
                        />
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30, marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                            }}
                                style={{ backgroundColor: grey, width: "46%", alignItems: "center", paddingVertical: 8, borderRadius: 6, marginRight: "4%" }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                }}>{"Close"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                onAddUser()
                            }}
                                style={{ backgroundColor: greenPrimary, width: "46%", alignItems: "center", paddingVertical: 8, borderRadius: 6, marginLeft: "4%" }}>

                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                }}>{"Save"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {isLoading && <LoadingView />}
        </>
    );
};

export default GroupInfo;

const styles = StyleSheet.create({
    messageContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 4,
        marginHorizontal: 20,
        maxWidth: '70%',
        borderRadius: 8,
    },
    inboundMessage: {
        backgroundColor: light_grey,
        alignSelf: 'flex-start',
    },
    outboundMessage: {
        backgroundColor: paleGreen,
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: FontSize.FS_13,
        color: black,
        fontFamily: MEDIUM
    },
    timeText: {
        fontSize: 8,
        color: grey,
        fontFamily: REGULAR,
        textAlign: "right",
        marginTop: 4
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 8,
        borderRadius: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
        backgroundColor: black05
    },
    modalView: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
        width: WIDTH - 42,
        backgroundColor: white,
        alignItems: 'center',
        justifyContent: "center",
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
