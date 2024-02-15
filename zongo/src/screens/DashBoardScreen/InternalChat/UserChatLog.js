import { Text, TouchableOpacity, StyleSheet, View, FlatList, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Image, ImageBackground, ScrollView, Linking } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Get_Internal_Chat_Log_User, Send_Chat_File, Send_Message } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../../constants/ConstantKey';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { black, greenPrimary, white, grey, bgColor01, light_grey, red, grey01, grey02, disableColor } from '../../../constants/Color';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import { useFocusEffect } from '@react-navigation/native';
import { goBack } from '../../../navigation/RootNavigation';
import LoadingView from '../../../commonComponents/LoadingView';
import { emojiData } from '../../../constants/DATA/output';
import EmojiPicker from './EmojiPicker';
import DocumentPicker from 'react-native-document-picker';
import { resetInternalChatStatus } from '../../../redux/reducers/internalChatReducer';
import { COMMAN_IMAGE_URL, INTERNAL_CHAT_IMAGE_URL, WEBSOCKET_URL } from '../../../constants/ApiUrl';
import Global from '../../../constants/Global';
import ImageView from "react-native-image-viewing";


const UserChatLog = ({ route }) => {

    const [messageText, setMessageText] = useState('');
    const [ChatData, setChatData] = useState(null);
    const [DocumentViewOpen, setDocumentViewOpen] = useState(false);
    const [EmojiKeyboard, setEmojiKeyboard] = useState(false);
    const [ToName, setToName] = useState(route?.params?.item?.first_name + " " + route?.params?.item?.last_name || "");
    const [SelectedImageFile, setSelectedImageFile] = useState(null)
    const [SelectedAudioFile, setSelectedAudioFile] = useState(null)
    const [SelectedDocFile, setSelectedDocFile] = useState(null)
    const [viewImgData, setViewImgData] = useState("");
    const [imgView, setImgView] = useState(false);

    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const flatListRef = useRef(null);

    const scrollToBottom = () => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      };
    const apiGetInternalChatLogUser = useSelector(state => state.internalChatRedux.apiGetInternalChatLogUser);
    const perticular_user_chat_log = useSelector(state => state.internalChatRedux.perticular_user_chat_log);

    const make_call_user_log_api = useSelector(state => state.internalChatRedux.make_call_user_log_api);
    const apiSendChatFile = useSelector(state => state.internalChatRedux.apiSendChatFile);
    const apiSendMessage = useSelector(state => state.internalChatRedux.apiSendMessage);

    const isLoading = useSelector(state => state.internalChatRedux.isLoader);
    const isError = useSelector(state => state.internalChatRedux.isError);
    const error_message = useSelector(state => state.internalChatRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const GetUserChatLog = ( ) =>{
        if (user_data !== null && route?.params?.item?.user_uuid !== undefined) {
            var dict = {
                createdby: user_data?.data?.user_uuid,
                from_uuid: user_data?.data?.user_uuid,
                group_uuid: "",
                main_uuid: user_data?.data?.main_uuid,
                tab: "user",
                to_uuid: route?.params?.item?.user_uuid
            }
            dispatch(Get_Internal_Chat_Log_User(dict))
        }
    }

    useEffect(() => {
        const ws = new WebSocket(WEBSOCKET_URL);
        ws.onopen = () => {
            Log('WebSocket connection opened user');
        };
        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (data?.type == "message" || data?.type == "file") {
                GetUserChatLog()
            }
        };
        ws.onclose = (event) => {
            Log('WebSocket connection closed:', event.reason);
        };
        return () => {
            ws.close();
        };
    }, [])

    

    useFocusEffect(
        useCallback(() => {
            GetUserChatLog()
            return () => {
                dispatch(resetInternalChatStatus());
            };
        }, [])
    );

    useEffect(() => {
        Log('apiGetInternalChatLogUser :', apiGetInternalChatLogUser);
        if (apiGetInternalChatLogUser == STATUS_FULFILLED) {
            if (perticular_user_chat_log !== null) {
                console.log("perticular_user_chat_log :", perticular_user_chat_log)
                setChatData(perticular_user_chat_log)
            }
        } else if (apiGetInternalChatLogUser == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetInternalChatLogUser]);

    useEffect(() => {
        Log('apiSendMessage :', apiSendMessage);
        if (apiSendMessage == STATUS_FULFILLED) {
            setMessageText("")
            if (make_call_user_log_api == true) {
                GetUserChatLog()
            }

        } else if (apiSendMessage == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiSendMessage]);

    useEffect(() => {
        Log("make_call_user_log_api", make_call_user_log_api)
        if (make_call_user_log_api == true) {
            GetUserChatLog()
        }
    }, [make_call_user_log_api]);

    useEffect(() => {
        Log('apiSendChatFile :', apiSendChatFile);
        if (apiSendChatFile == STATUS_FULFILLED) {
            setMessageText("")
            setSelectedAudioFile(null)
            setSelectedImageFile(null)
            setSelectedDocFile(null)
            Log("Message send done2", make_call_user_log_api)
            console.log("step file")
            if (make_call_user_log_api == true) {
                GetUserChatLog()
            }
        } else if (apiSendChatFile == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiSendChatFile]);

    useEffect(() => {
        if(ChatData?.length > 4){
            setTimeout(() => {
            scrollToBottom()
              }, 1000);
        }
    }, [ChatData]);

    const onSend = () => {
        var isFile = false
        if (SelectedAudioFile?.length > 0) {
            isFile = true
            var formData = new FormData();

            formData.append("created_at", "");
            formData.append("direction", "");
            formData.append("status", "outbound");
            formData.append("deliver_status", "");
            formData.append("message", messageText);
            formData.append("from_uuid", user_data?.data?.user_uuid);
            formData.append("to_uuid", route?.params?.item?.user_uuid);
            formData.append("tab", "user");
            formData.append("group_uuid", "");
            formData.append("createdby", user_data?.data?.main_uuid);
            formData.append("main_uuid", user_data?.data?.main_uuid);
            formData.append("user_uuid", user_data?.data?.user_uuid);
            formData.append("domain_name", user_data?.data?.domain_name);

            for (let i = 0; i < SelectedAudioFile.length; i++) {
                formData.append("file", SelectedAudioFile[i]);
            }
            console.log("Form Data for Image file ", formData)

            dispatch(Send_Chat_File(formData))
            if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
                console.log("step 0")
                const fileData = {
                    type: "file",
                    file_type: "",
                    data: "",
                    fileName: "",
                };
                Global.Socket.send(JSON.stringify(fileData));
            }
        }
        if (SelectedDocFile?.length > 0) {
            isFile = true
            var formData = new FormData();

            formData.append("created_at", "");
            formData.append("direction", "");
            formData.append("status", "outbound");
            formData.append("deliver_status", "");
            formData.append("message", messageText);
            formData.append("from_uuid", user_data?.data?.user_uuid);
            formData.append("to_uuid", route?.params?.item?.user_uuid);
            formData.append("tab", "user");
            formData.append("group_uuid", "");
            formData.append("createdby", user_data?.data?.main_uuid);
            formData.append("main_uuid", user_data?.data?.main_uuid);
            formData.append("user_uuid", user_data?.data?.user_uuid);
            formData.append("domain_name", user_data?.data?.domain_name);

            for (let i = 0; i < SelectedDocFile.length; i++) {
                formData.append("file", SelectedDocFile[i]);
            }
            console.log("Form Data for Image file ", formData)

            dispatch(Send_Chat_File(formData))
            if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
                console.log("step 0")
                const fileData = {
                    type: "file",
                    file_type: "",
                    data: "",
                    fileName: "",
                };
                Global.Socket.send(JSON.stringify(fileData));
            }
        }
        if (SelectedImageFile?.length > 0) {
            isFile = true

            var formData = new FormData();

            formData.append("created_at", "");
            formData.append("direction", "");
            formData.append("status", "outbound");
            formData.append("deliver_status", "");
            formData.append("message", messageText);
            formData.append("from_uuid", user_data?.data?.user_uuid);
            formData.append("to_uuid", route?.params?.item?.user_uuid);
            formData.append("tab", "user");
            formData.append("group_uuid", "");
            formData.append("createdby", user_data?.data?.main_uuid);
            formData.append("main_uuid", user_data?.data?.main_uuid);
            formData.append("user_uuid", user_data?.data?.user_uuid);
            formData.append("domain_name", user_data?.data?.domain_name);

            for (let i = 0; i < SelectedImageFile.length; i++) {
                formData.append("file", SelectedImageFile[i]);
            }
            console.log("Form Data for Image file ", formData)

            dispatch(Send_Chat_File(formData))
            if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
                console.log("step 0")
                const fileData = {
                    type: "file",
                    file_type: "",
                    data: "",
                    fileName: "",
                };
                Global.Socket.send(JSON.stringify(fileData));
            }

        }
        else {
            if (isFile == false && messageText.trim()?.length > 0) {
                var dict = {
                    internal_chat_uuid: "",
                    created_at: "",
                    direction: "",
                    status: "outbound",
                    deliver_status: "",
                    message: messageText,
                    from_uuid: user_data?.data?.user_uuid,
                    to_uuid: route?.params?.item?.user_uuid,
                    tab: "user",
                    group_uuid: "",
                    main_uuid: user_data?.data?.main_uuid,
                    createdby: user_data?.data?.main_uuid,
                };
                console.log("SEND DICT 2 USER", dict)
                dispatch(Send_Message(dict))
                if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
                    console.log("step 0")
                    let datad = {
                        type: "message",
                        data: dict,
                    };
                    Global.Socket.send(JSON.stringify(datad));
                }
            }
        }
    }

    const onImagePick = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true
            });
            console.log("result: ", result)
            setSelectedImageFile(result)
            setSelectedAudioFile(null)
            setSelectedDocFile(null)
            setDocumentViewOpen(false)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    }
    const onDocumentPick = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.doc],
                allowMultiSelection: true

            });
            console.log("result: ", result)
            setSelectedDocFile(result)
            setSelectedImageFile(null)
            setSelectedAudioFile(null)
            setDocumentViewOpen(false)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    }
    const onAudioPick = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
                allowMultiSelection: true

            });
            console.log("result: ", result)
            setSelectedAudioFile(result)
            setSelectedDocFile(null)
            setSelectedImageFile(null)
            setDocumentViewOpen(false)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    }

    const openKeyboard = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const onImageDelete = (index) => {
        const updatedFiles = [...SelectedImageFile];
        updatedFiles.splice(index, 1); // Remove the item at the specified index
        setSelectedImageFile(updatedFiles);
    }

    const onAudioDelete = (index) => {
        const updatedFiles = [...SelectedAudioFile];
        updatedFiles.splice(index, 1); // Remove the item at the specified index
        setSelectedAudioFile(updatedFiles);
    }
    const onDocDelete = (index) => {
        const updatedFiles = [...SelectedDocFile];
        updatedFiles.splice(index, 1); // Remove the item at the specified index
        setSelectedDocFile(updatedFiles);
    }

    return (
        <>
            <View style={{ paddingHorizontal: pixelSizeHorizontal(20), paddingTop: 22 }}>
                <HeaderBackView
                    title={ToName}
                    isBack={true}
                    isMenu={false}
                    onPressBack={() => {
                        goBack();
                    }}
                /></View>
            <FlatList
                ref={flatListRef}
                style={{ flex: 1, marginTop: 20, marginBottom: 6, }}
                data={ChatData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    const fileNames = item.original_file_name?.split(",");
                    const fileData = item.file_data?.split(",");
                    return (
                        <TouchableOpacity activeOpacity={0.9} onPress={() => {
                            setDocumentViewOpen(false)
                        }}
                            style={[
                                styles.messageContainer,
                                item.to_uuid === user_data?.data?.user_uuid ? styles.inboundMessage : styles.outboundMessage,
                            ]} >
                            <View style={{ flexDirection: item.to_uuid === user_data?.data?.user_uuid ? "row" : "row-reverse", alignItems: "center" }}>
                                <View>
                                    {item.message !== "" &&
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            marginBottom: 6,
                                            textAlign: "right"
                                        }}>
                                            {item.message}
                                        </Text>
                                    }
                                    {fileNames?.map((fileName, index) => {
                                        const fileExtension = fileName.split('.').pop();
                                        console.log("fileExtension :", fileExtension)
                                        return (
                                            <View >

                                                {(fileExtension == 'png' || fileExtension === 'jpg' || fileExtension == 'jpeg') &&
                                                    <TouchableOpacity onPress={() =>{
                                                        setImgView(true)
                                                        setViewImgData(INTERNAL_CHAT_IMAGE_URL + fileData[index])
                                                    }}>
                                                    <Image
                                                        style={{ width: 100, height: 100, resizeMode: "cover", }}
                                                        source={{ uri: INTERNAL_CHAT_IMAGE_URL + fileData[index] }}
                                                    />
                                                    </TouchableOpacity>
                                                }
                                                {fileExtension == "pdf" &&
                                                    <TouchableOpacity onPress={() =>{Linking.openURL(INTERNAL_CHAT_IMAGE_URL + fileData[index])}} style={{ borderWidth: 0.7, borderColor: grey, borderRadius: 4 }}>
                                                        <Image
                                                            style={{ width: 80, height: 80, resizeMode: "center", backgroundColor: white, borderRadius: 4 }}
                                                            source={{ uri: COMMAN_IMAGE_URL + "/pdf_demo.png" }} />
                                                    </TouchableOpacity>
                                                }
                                                {(fileExtension == "doc" || fileExtension == "docx") &&
                                                    <TouchableOpacity onPress={() =>{Linking.openURL(INTERNAL_CHAT_IMAGE_URL + fileData[index])}} style={{ borderWidth: 0.7, borderColor: grey, borderRadius: 4 }}>
                                                        <Image
                                                            style={{ width: 80, height: 80, resizeMode: "center", backgroundColor: white, borderRadius: 4 }}
                                                            source={{ uri: COMMAN_IMAGE_URL + "/doc_demo.png" }} />
                                                    </TouchableOpacity>
                                                }
                                                {(fileExtension == "csv") &&
                                                    <TouchableOpacity onPress={() =>{Linking.openURL(INTERNAL_CHAT_IMAGE_URL + fileData[index])}} style={{ borderWidth: 0.7, borderColor: grey, borderRadius: 4 }}>
                                                        <Image
                                                            style={{ width: 80, height: 80, resizeMode: "center", backgroundColor: white, borderRadius: 4 }}
                                                            source={{ uri: COMMAN_IMAGE_URL + "/csv_demo.png" }} />
                                                    </TouchableOpacity>
                                                }
                                                {fileExtension !== "csv" && fileExtension !== "doc" && fileExtension !== "docx" && fileExtension !== "pdf" && fileExtension !== "jpeg" && fileExtension !== "jpg" && fileExtension !== "png" &&
                                                    <TouchableOpacity onPress={() =>{Linking.openURL(INTERNAL_CHAT_IMAGE_URL + fileData[index])}} style={{ borderWidth: 0.7, borderColor: grey, borderRadius: 4 }}>
                                                        <Image
                                                            style={{ width: 80, height: 80, resizeMode: "center", backgroundColor: white, borderRadius: 4 }}
                                                            source={{ uri: COMMAN_IMAGE_URL + "/others_file.png" }} />
                                                    </TouchableOpacity>
                                                }

                                                <Text numberOfLines={1} adjustsFontSizeToFit={true}
                                                    style={{
                                                        fontFamily: SEMIBOLD,
                                                        color: black,
                                                        fontSize: FontSize.FS_10,
                                                        marginVertical: 10,
                                                    }}> {fileName.length > 10 ? fileName.slice(0, 10) + fileName.slice(fileName.lastIndexOf('.')) : fileName}</Text>
                                            </View>
                                        )
                                    }
                                    )}

                                </View>

                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end", }}>
                                <Text style={styles.timeText}>
                                    {item.created_at}
                                </Text>
                                {item.from_uuid == user_data?.data?.user_uuid &&
                                    <View style={{ marginHorizontal: 8, marginTop: 3 }}>
                                        <Icon name={item.status == 'read' ? "check-all" : "check"} size={12} color={item.status == 'read' ? greenPrimary : grey} />
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />


            {SelectedImageFile !== null && SelectedImageFile?.length > 0 &&
                <View style={{ marginHorizontal: 10 }}>
                    <ScrollView horizontal={true}>
                        <FlatList
                            contentContainerStyle={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1, marginVertical: 20 }}
                            style={{}}
                            data={SelectedImageFile}
                            horizontal
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ alignItems: "center", marginHorizontal: 10, alignSelf: "center" }}>

                                    <ImageBackground borderRadius={8}
                                        style={{ width: 100, height: 100, }}
                                        source={{ uri: item?.uri }}
                                    >
                                        <TouchableOpacity onPress={() => {
                                            onImageDelete(index)

                                        }} style={{ alignSelf: "flex-end", padding: 8 }}>
                                            <Icon name={"close-circle-outline"} size={22} color={white} />
                                        </TouchableOpacity>
                                    </ImageBackground>
                                    <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 4,
                                    }}>{item?.name.length > 10 ? item?.name.slice(0, 10) + item.name.slice(item.name.lastIndexOf('.')) : item?.name}</Text>
                                </View>
                            )}
                        />
                    </ScrollView>
                </View>
            }
            {SelectedAudioFile !== null && SelectedAudioFile?.length > 0 &&
                <View>
                    <ScrollView horizontal={true}>
                        <FlatList
                            contentContainerStyle={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1, marginVertical: 20 }}
                            style={{}}
                            data={SelectedAudioFile}
                            horizontal
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ alignItems: "center", marginHorizontal: 10, alignSelf: "center" }}>
                                    <View onPress={() => { onAudioPick() }}
                                        style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: "#e69545", alignItems: "center", justifyContent: "center" }}>
                                        <Icon name="headphones" size={40} color={white} />
                                        <TouchableOpacity onPress={() => {
                                            onAudioDelete(index)

                                        }} style={{ position: "absolute", top: 4, right: 4 }}>
                                            <Icon name={"close-circle-outline"} size={22} color={white} />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: black,
                                        marginTop: 8,
                                        fontFamily: SEMIBOLD
                                    }}>{item?.name.length > 10 ? item?.name.slice(0, 10) + item.name.slice(item.name.lastIndexOf('.')) : item?.name}</Text>
                                </View>
                            )}
                        />
                    </ScrollView>
                </View>
            }

            {SelectedDocFile !== null && SelectedDocFile?.length > 0 &&
                <View>
                    <ScrollView horizontal={true}>
                        <FlatList
                            contentContainerStyle={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1, marginVertical: 20 }}
                            style={{}}
                            data={SelectedDocFile}
                            horizontal
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ alignItems: "center", marginHorizontal: 10, alignSelf: "center" }}>
                                    <View onPress={() => { onAudioPick() }}
                                        style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: grey02, alignItems: "center", justifyContent: "center" }}>
                                        <Icon name="file-document" size={40} color={white} />
                                        <TouchableOpacity onPress={() => {
                                            onDocDelete(index)

                                        }} style={{ position: "absolute", top: 4, right: 4 }}>
                                            <Icon name={"close-circle-outline"} size={22} color={white} />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={{
                                        fontSize: FontSize.FS_10,
                                        color: black,
                                        marginTop: 8,
                                        fontFamily: SEMIBOLD
                                    }}>{item?.name.length > 10 ? item?.name.slice(0, 10) + item.name.slice(item.name.lastIndexOf('.')) : item?.name}</Text>
                                </View>
                            )}
                        />
                    </ScrollView>
                </View>
            }
            {DocumentViewOpen === true && <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "white", padding: 20 }}>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => { onImagePick() }}
                        style={{ width: 42, height: 42, borderRadius: 42, backgroundColor: "#9F70FD", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="image" size={20} color={white} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: FontSize.FS_10,
                        color: grey,
                        fontFamily: MEDIUM,
                        marginTop: 4
                    }}>{"Gallery"}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => { onDocumentPick() }}
                        style={{ width: 42, height: 42, borderRadius: 42, backgroundColor: "#646de8", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="file-document" size={20} color={white} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: FontSize.FS_10,
                        color: grey,
                        fontFamily: MEDIUM,
                        marginTop: 4
                    }}>{"Document"}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => { onAudioPick() }}
                        style={{ width: 42, height: 42, borderRadius: 42, backgroundColor: "#e67a10", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="headphones" size={20} color={white} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: FontSize.FS_10,
                        color: grey,
                        fontFamily: MEDIUM,
                        marginTop: 4
                    }}>{"Audio"}</Text>
                </View>
            </View>}

            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10, }}>
                <View style={{
                    backgroundColor: white, alignSelf: "center", borderRadius: 6, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", shadowColor: "#000", marginBottom: 16, borderRadius: 50, borderWidth: 1, borderColor: light_grey,
                    width: "85%",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 1,
                }}>
                    <TouchableOpacity onPress={() => {
                        setEmojiKeyboard(!EmojiKeyboard)
                        if (EmojiKeyboard == true) { openKeyboard() }
                        else { Keyboard.dismiss() }
                    }} style={{ flex: 0.10 }}>
                        <Icon name={EmojiKeyboard == false ? "emoticon-happy-outline" : "keyboard"} size={22} color={grey} />
                    </TouchableOpacity>
                    <TextInput
                        onFocus={() => {
                            setDocumentViewOpen(false)
                            setEmojiKeyboard(false)
                        }}
                        ref={inputRef}
                        multiline={true}
                        style={{ color: black, fontSize: FontSize.FS_12, fontFamily: MEDIUM, flex: 0.80, paddingVertical: 6 }}
                        placeholder="Type a message...."
                        value={messageText}
                        onChangeText={(txt) => {
                            setMessageText(txt)
                        }}
                    />
                    <TouchableOpacity onPress={() => { setDocumentViewOpen(!DocumentViewOpen) }}
                        style={{ flex: 0.10, transform: [{ rotate: '-50deg' }] }}>
                        <Icon name="paperclip" size={22} color={grey} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "2%" }}></View>
                <TouchableOpacity activeOpacity={messageText.trim()?.length > 0 ? 0.2 : 0.9} onPress={() => { onSend() }} style={{ width: "13%", backgroundColor: (messageText.trim()?.length > 0 || SelectedImageFile?.length > 0 || SelectedAudioFile?.length > 0 || SelectedDocFile?.length > 0) ? greenPrimary : grey, width: 40, height: 40, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 16, }}>
                    <Icon name="send" size={20} color={white} />
                </TouchableOpacity>
            </View>
            <ImageView
                    animationType={"fade"}
                    images={[{ uri: viewImgData }]}
                    imageIndex={0}
                    visible={imgView}
                    onRequestClose={() => setImgView(false)}
                />
            {EmojiKeyboard == true && <EmojiPicker emojiData={emojiData} text={(txt) => {
                setMessageText(prevMessageText => prevMessageText + txt);
            }} />}
            {isLoading && <LoadingView />}
        </>
    );
};

export default UserChatLog;

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
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
    },
    outboundMessage: {
        backgroundColor: '#DCF8C6',
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
});
