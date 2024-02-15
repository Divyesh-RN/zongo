import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { black, black05, disableColor, greenPrimary, grey, grey01, offWhite, red, white } from '../../../constants/Color'
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Create_Group, Get_Group_List_Chat } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../../constants/ConstantKey';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';

import FloatingBtn from '../../../commonComponents/FloatingBtn'
import { resetInternalChatStatus } from '../../../redux/reducers/internalChatReducer';
import { navigate } from '../../../navigation/RootNavigation';
import LoadingView from '../../../commonComponents/LoadingView';

const ChatGroups = () => {
    const [GroupList, setGroupList] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [UserList, setUserList] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [GroupName, setGroupName] = useState("")
    const [GroupNameEdit, setGroupNameEdit] = useState(false)
    const [GroupNameError, setGroupNameError] = useState("")

    const dispatch = useDispatch();
    const group_list_chat = useSelector(state => state.internalChatRedux.group_list_chat);
    const apiGetGroupListChat = useSelector(state => state.internalChatRedux.apiGetGroupListChat);
    const user_list_chat = useSelector(state => state.internalChatRedux.user_list_chat);
    const apiGetUserListChat = useSelector(state => state.internalChatRedux.apiGetUserListChat);
    const apiCreateGroup = useSelector(state => state.internalChatRedux.apiCreateGroup);
    const apiDeleteGroupMember = useSelector(state => state.internalChatRedux.apiDeleteGroupMember);
    const user_data = useSelector(state => state.userRedux.user_data);
    const isLoading = useSelector(state => state.internalChatRedux.isLoader);
    const isError = useSelector(state => state.internalChatRedux.isError);
    const error_message = useSelector(state => state.internalChatRedux.error_message);

    useFocusEffect(
        useCallback(() => {
            if (user_data !== null) {
                var dict = {
                    createdby: user_data?.data?.user_uuid,
                    main_uuid: user_data?.data?.main_uuid,
                }
                dispatch(Get_Group_List_Chat(dict))
            }
            return () => {
                dispatch(resetInternalChatStatus());
            };
        }, [])
    );

    useEffect(() => {
        Log('apiGetGroupListChat :', apiGetGroupListChat);
        if (apiGetGroupListChat == STATUS_FULFILLED) {
            if (group_list_chat !== null) {
                // console.log("group_list_chat :", group_list_chat)
                setGroupList(group_list_chat)
            }
        } else if (apiGetGroupListChat == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetGroupListChat]);

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
        Log('apiCreateGroup :', apiCreateGroup);
        if (apiCreateGroup == STATUS_FULFILLED) {
            if (user_data !== null) {
                var dict = {
                    createdby: user_data?.data?.user_uuid,
                    main_uuid: user_data?.data?.main_uuid,
                }
                dispatch(Get_Group_List_Chat(dict))
            }
        } else if (apiCreateGroup == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateGroup]);

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

    const getRandomColor = () => {
        const colors = ['#ADD8E6', '#90EE90', '#FFB6C1', '#E6E6FA'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

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
        if (GroupName == "") {
            setGroupNameError("* Please enter group name.")
        }
        if (selectedUsers.length == 0 ){
            alert("Please select at least one user.")
        }
        else{
            const formattedSelectedUsers = selectedUsers.map(user_uuid => {
                const user = UserList.find(user => user.user_uuid === user_uuid);
                return {
                    value: user.user_uuid,
                    label: `${user.first_name} ${user.last_name}`
                };
            });
            console.log("formattedSelectedUsers user", formattedSelectedUsers)
    
            var dict = {
                assign_user_data: formattedSelectedUsers,
                createdby: user_data?.data?.user_uuid,
                name: GroupName,
                main_uuid: user_data?.data?.main_uuid,
            }
            dispatch(Create_Group(dict))
            setModalVisible(false)
        }
       

    }
    return (
        <View style={styles.container}>
            <FlatList
                data={GroupList}
                keyExtractor={item => Math.random()}
                renderItem={({ item, index }) =>

                    <TouchableOpacity onPress={() => {
                        navigate("GroupChatLog", { item: item })
                    }}
                        style={{
                            backgroundColor: white,
                            marginBottom: 6,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 1.41,

                            elevation: 1,
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
                                    <Text style={{ fontSize: 12, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item?.name)} </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ marginLeft: 14, }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                }}>{item?.name}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', }}>
                            {/* <Text style={{
                        fontSize: FontSize.FS_10,
                        color: grey,
                        fontFamily: REGULAR,
                    }}>11:20 AM</Text> */}
                            {/* <Icon name="check" size={20} color={greenPrimary} /> */}
                            {item?.message_count > 0 && <View style={{
                                width: 20, height: 20, borderRadius: 10, backgroundColor: "#52b1411f", alignItems: "center", justifyContent: "center", marginTop: 4
                            }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: greenPrimary,
                                    fontFamily: REGULAR,
                                }}>{item?.message_count}</Text>
                            </View>
                            }
                        </View>
                    </TouchableOpacity>
                }
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
                        <Text style={{
                            fontSize: FontSize.FS_16,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 6,
                            marginBottom: 20,
                            textAlign: "center",
                        }}>{"Create Group"}</Text>

                        <Text style={{
                            textAlign: "left",
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginVertical: 6,
                        }}>{"Group Name"}</Text>
                        <TextInput
                            value={GroupName}
                            placeholder='Enter group name'
                            placeholderTextColor={grey}
                            style={{
                                width: "100%",
                                borderWidth: 1,
                                marginVertical: 4,
                                borderColor: grey01,
                                height: 36,
                                borderRadius: 6,
                                paddingHorizontal: 14,
                                fontFamily: MEDIUM,
                                color: black,
                                fontSize: FontSize.FS_12
                            }}
                            onChangeText={(txt) => {
                                setGroupName(txt)
                                setGroupNameError("")
                            }}
                        />
                        {GroupNameError !== "" && <Text style={{
                            textAlign: "left",
                            fontSize: FontSize.FS_10,
                            color: red,
                            fontFamily: MEDIUM,
                        }}>{GroupNameError}</Text>}
                        <FlatList
                            style={{ marginTop: 30 }}
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
                                }}>{"Create"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <FloatingBtn onPress={() => {
                setModalVisible(true)
            }} iconName={"account-plus-outline"} />
            {isLoading && <LoadingView />}
        </View>
    )
}

export default ChatGroups

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: offWhite
        ,
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
        // alignItems: 'center',
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
})  