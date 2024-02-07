
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, Linking, Alert, ScrollView, FlatList, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black05 } from '@constants/Color';
import { black, disableColor, greenPrimary, grey, grey01, white, light_grey, paleGreen, red, black03 } from '../../../constants/Color';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import { AudioPlayer } from 'react-native-simple-audio-player';
import { AUDIO_URL } from '../../../constants/ApiUrl';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import LoadingView from '../../../commonComponents/LoadingView';
import { Delete_Moh_File, Update_Audio_File, Update_Moh_File, Upload_Audio_File } from '../../../redux/api/Api';
import { resetAudioApiStatus } from '../../../redux/reducers/audioReducer';

const ManageAudioFiles = ({ navigation, route }) => {


    const [isEdit, setIsEdit] = useState(route?.params?.isEdit ? true : false);
    const [AudioFileName, setAudioFileName] = useState(route?.params?.isEdit ? route?.params?.item?.recording_name : "");
    const [AudioFileNameEdit, setAudioFileNameEdit] = useState(route?.params?.isEdit ? true : true);

    const [SelectedAudioFileName, setSelectedAudioFileName] = useState('');
    const [SelectedAudioFile, setSelectedAudioFile] = useState(null);
    const [AudioFileNameError, setAudioFileNameError] = useState("");
    const [SelectedAudioFileError, setSelectedAudioFileError] = useState("");
    const [IsNewFile, setIsNewFile] = useState(false);
    const [MohList, setMohList] = useState(route?.params?.item?.moh_file || null);
    const [modalVisible, setModalVisible] = useState(false);
    const [AudioUrl, setAudioUrl] = useState("");


    const dispatch = useDispatch();

    const apiUploadRecording = useSelector(
        state => state.audioRedux.apiUploadRecording,
    );
    const apiUpdateRecording = useSelector(
        state => state.audioRedux.apiUpdateRecording,
    );
    const isLoading = useSelector(state => state.audioRedux.isLoader);
    const apiDeleteMohFile = useSelector(state => state.audioRedux.apiDeleteMohFile);
    const apiUploadRecordingStatus = useSelector(state => state.audioRedux.apiUploadRecordingStatus);
    const apiUpdateRecordingStatus = useSelector(state => state.audioRedux.apiUpdateRecordingStatus);
    const moh_list = useSelector(state => state.audioRedux.moh_list);
    const apiUpdateMoh = useSelector(state => state.audioRedux.apiUpdateMoh);
    const isError = useSelector(state => state.audioRedux.isError);
    const error_message = useSelector(state => state.audioRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const UploadMusinOnHold = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
                allowMultiSelection: true
            });
            const maxSize = 10 * 1024 * 1024;
            if (result[0].size < maxSize) {
                setSelectedAudioFile(result);
                setIsNewFile(true)
                setSelectedAudioFileName(result[0]?.name);
                setSelectedAudioFileError("")
            }
            else {
                setSelectedAudioFileError("  * Please select file size less than 10 MB")
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    };


    useEffect(() => {
        return () => {
            dispatch(resetAudioApiStatus());
        }
    }, [])


    const HandleUploadAudio = () => {
        if (route?.params?.type !== "") {
            if (SelectedAudioFile == null) {
                setSelectedAudioFileError("  * Please Upload Recording File")
            }
            else if (AudioFileName == "") {
                setAudioFileNameError("  * Please Enter Recording Name")
            }
            else {
                let body = new FormData();

                body.append('recording_name', AudioFileName)
                body.append('recording_type', route?.params?.type)
                body.append('createdby', user_data?.data?.user_uuid)
                body.append('main_admin_uuid', user_data?.data?.main_uuid)
                body.append('user_uuid', user_data?.data?.user_uuid)
                if (route?.params?.type == "moh") {
                    for (let i = 0; i < SelectedAudioFile.length; i++) {
                        body.append('file', SelectedAudioFile[i]);
                    }
                    body.append('fileName', SelectedAudioFileName)
                }
                else {

                    body.append('file', SelectedAudioFile[0])
                    body.append('fileName', SelectedAudioFileName)
                }
                dispatch(Upload_Audio_File(body));
            }
        }
    }

    useEffect(() => {
        Log('apiUploadRecording :', apiUploadRecording);
        if (apiUploadRecording == STATUS_FULFILLED) {
            if (apiUploadRecordingStatus?.status == 406) {
                setAudioFileNameError(" * " + apiUploadRecordingStatus?.message)
            }
            else {
                goBack()
            }
        } else if (apiUploadRecording == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUploadRecording]);

    const HandleUpdateAudio = () => {
        if (route?.params?.type !== "" && route?.params?.item?.recording_uuid !== "") {
            // if (SelectedAudioFile == null) {
            //     setSelectedAudioFileError("  * Please Upload Recrding File")
            // }
            // else
            if (AudioFileName == "") {
                setAudioFileNameError("  * Please Enter Recording Name")
            }
            else {
                let body = new FormData();

                body.append('recording_name', AudioFileName)
                body.append('recording_uuid', route?.params?.item?.recording_uuid)
                body.append('recording_type', route?.params?.type)
                body.append('createdby', user_data?.data?.user_uuid)
                body.append('main_admin_uuid', user_data?.data?.main_uuid)
                body.append('user_uuid', user_data?.data?.user_uuid)

                if (SelectedAudioFile !== null) {
                    if (route?.params?.type == "moh") {
                        for (let i = 0; i < SelectedAudioFile.length; i++) {
                            body.append('file', SelectedAudioFile[i]);
                        }
                        body.append('fileName', SelectedAudioFileName)
                    }
                    else {
                        body.append('file', SelectedAudioFile[0])
                        body.append('fileName', SelectedAudioFileName)
                    }
                } 
                dispatch(Update_Audio_File(body));
            }
        }
    }

    useEffect(() => {
        Log('apiUpdateRecording :', apiUpdateRecording);
        if (apiUpdateRecording == STATUS_FULFILLED) {
            if (apiUpdateRecordingStatus?.status == 406) {
                setAudioFileNameError(" * " + apiUpdateRecordingStatus?.message)
            }
            else {
                goBack()
            }
        } else if (apiUpdateRecording == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateRecording]);

    // delete moh file

    const onDelete = (item) => {


        Alert.alert(
            //title
            item?.recording_filename,
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
                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            music_on_hold_files_uuid: item?.music_on_hold_files_uuid
                        }
                        dispatch(Delete_Moh_File(dict))
                    }
                },
            ],
            { cancelable: true },
        );
    }



    useEffect(() => {
        Log('apiDeleteMohFile :', apiDeleteMohFile);
        if (apiDeleteMohFile == STATUS_FULFILLED) {
            if (moh_list !== null) {
                setMohList(moh_list)
            }
        } else if (apiDeleteMohFile == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteMohFile]);

    const updateMohOrderFile = async (item, moveDown, currentIndex) => {
        const updatedList = [...MohList];
        const newIndex = moveDown ? currentIndex + 1 : currentIndex - 1;

        // Swap the items in the array
        [updatedList[currentIndex], updatedList[newIndex]] = [
            updatedList[newIndex],
            updatedList[currentIndex],
        ];

        var dict = {
            createdby: user_data?.data?.user_uuid,
            music_on_hold_files: updatedList
        }
        dispatch(Update_Moh_File(dict));

    }

    useEffect(() => {
        Log('apiUpdateMoh :', apiUpdateMoh);
        if (apiUpdateMoh == STATUS_FULFILLED) {
            if (moh_list !== null) {
                setMohList(moh_list)
            }
        } else if (apiUpdateMoh == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateMoh]);

    const openAudioModal = (url) => {
        setModalVisible(true)
        setAudioUrl(url)
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
                        title="Manage Audio File"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                    <View style={{ marginTop: 0, marginBottom: 40 }}>
                        <View style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>

                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <View>

                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>{"Recording Name"}</Text>
                                    {AudioFileName && <Text style={{
                                        fontSize: FontSize.FS_11,
                                        color: grey,
                                        fontFamily: MEDIUM,
                                        marginTop: 4
                                    }}>{AudioFileName}</Text>}
                                </View>
                                {AudioFileNameEdit == false &&
                                    <TouchableOpacity onPress={() => {
                                        setAudioFileNameEdit(!AudioFileNameEdit)
                                    }}>
                                        <Icon name={"pencil"} size={22} color={black} />
                                    </TouchableOpacity>
                                }
                            </View>
                            {AudioFileNameEdit == true &&
                                <View style={{
                                    marginTop: 14,
                                    flexDirection: "row", alignItems: "center"
                                }}>
                                    <TextInput
                                        value={AudioFileName}
                                        placeholder='Enter Recording Name ...'
                                        placeholderTextColor={grey01}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: grey01,
                                            height: 40,
                                            borderRadius: 6,
                                            paddingHorizontal: 14,
                                            flex: 1

                                        }}
                                        onChangeText={(txt) => {
                                            setAudioFileName(txt)
                                            if (txt.length > 0) {
                                                setAudioFileNameError("")
                                            }
                                        }}
                                    />
                                    <TouchableOpacity onPress={() => {
                                        setAudioFileNameEdit(false)
                                    }}
                                        style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                        <Icon name="check" size={22} color={white} />
                                    </TouchableOpacity>
                                </View>
                            }
                            {AudioFileNameError !== "" && <Text
                                style={{
                                    fontSize: FontSize.FS_10,
                                    color: red,
                                    fontFamily: MEDIUM,
                                    marginTop: 8

                                }}>
                                {AudioFileNameError}
                            </Text>
                            }
                        </View>
                        {route?.params?.type == "moh" ?
                            <>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: grey,
                                        fontFamily: REGULAR,
                                        marginVertical: 10
                                    }}>
                                    {" * Note : Allow only mp3, wav, m4a file and file size shoud be \n   less then 10 MB."}
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: light_grey,
                                        borderRadius: 4,
                                        marginTop: 10,
                                        padding: 14
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            UploadMusinOnHold();
                                        }}
                                        style={{ alignItems: 'center', }}>
                                        <Icon name="cloud-upload-outline" size={22} color={grey} />
                                        <Text
                                            style={{
                                                fontSize: FontSize.FS_12,
                                                color: grey,
                                                fontFamily: SEMIBOLD,
                                            }}>
                                            {route?.params?.isEdit == true ? "Upload New File" : 'Upload'}
                                        </Text>
                                    </TouchableOpacity>
                                    {SelectedAudioFile !== null &&
                                        <View style={{ marginVertical: 24 }}>
                                            <Text
                                                style={{
                                                    fontSize: FontSize.FS_12,
                                                    color: grey,
                                                    fontFamily: SEMIBOLD,
                                                    textAlign: 'center',

                                                }}>
                                                {SelectedAudioFile[0]?.uri}
                                            </Text>
                                        </View>
                                    }
                                </View>
                                {SelectedAudioFileError !== "" && <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: MEDIUM,
                                        marginTop: 8

                                    }}>
                                    {SelectedAudioFileError}
                                </Text>
                                }
                                <ScrollView style={{ marginHorizontal: -20, marginVertical: 14 }} horizontal={true}>
                                    <View >
                                        {MohList?.length > 0 &&
                                            <View style={[
                                                styles.rowItem,
                                                {
                                                    backgroundColor: greenPrimary,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 6,
                                                    marginTop: 5,
                                                },
                                            ]}>
                                                <View style={{ flexDirection: 'column', width: 40, alignItems: "center", }}>
                                                    <Icon name="chevron-up" size={20} color={white} />
                                                    <Icon name="chevron-down" size={20} color={white} />
                                                </View>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 70, textAlign: "center",
                                                }]}>SEQ.</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 220, textAlign: "center",
                                                }]}>RECORDING FILE</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 90, textAlign: "center",
                                                }]}>FILE TYPE</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 115, textAlign: "center",
                                                }]}>PLAY</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 100, textAlign: "center",
                                                }]}>ACTION</Text>
                                                {/* <View style={{ width: 60, alignItems: "center" }}></View> */}

                                            </View>
                                        }
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                style={{ width: '100%', backgroundColor: white, }}
                                                data={MohList}
                                                keyExtractor={(item) => item?.music_on_hold_files_uuid}
                                                renderItem={({ item, drag, isActive, index }) => {
                                                    const isFirstRow = index === 0;
                                                    const isLastRow = index === MohList.length - 1;
                                                    return (
                                                        <View
                                                            style={[
                                                                styles.rowItem,
                                                                {
                                                                    backgroundColor: paleGreen,
                                                                    flexDirection: "row", alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    padding: 6,
                                                                    marginVertical: 2,
                                                                },
                                                            ]}
                                                        >
                                                            <View style={{
                                                                width: 40,
                                                                alignItems: "center",
                                                            }}>
                                                                {isFirstRow ? null : (
                                                                    <TouchableOpacity
                                                                        style={{
                                                                            borderRadius: 4,
                                                                        }}
                                                                        onPress={() => {
                                                                            updateMohOrderFile(item, false, index);
                                                                        }}
                                                                    >
                                                                        <Icon name="chevron-up" size={20} color={greenPrimary} />
                                                                    </TouchableOpacity>
                                                                )}
                                                                {isLastRow ? null : (
                                                                    <TouchableOpacity
                                                                        style={{
                                                                            borderRadius: 4,
                                                                        }}
                                                                        onPress={() => {
                                                                            updateMohOrderFile(item, true, index);
                                                                        }}
                                                                    >
                                                                        <Icon name="chevron-down" size={20} color={greenPrimary} />
                                                                    </TouchableOpacity>
                                                                )}
                                                            </View>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 70, textAlign: "center",
                                                            }]}>{item.file_order}</Text>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 220, textAlign: "center",
                                                            }]}>{item.recording_filename}</Text>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 90, textAlign: "center",
                                                            }]}>{item.recording_file_type}</Text>
                                                            <View style={{ width: 115, alignItems: "center" }}>
                                                                <TouchableOpacity style={{
                                                                    height: 30,
                                                                    width: 30,
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}
                                                                    onPress={() => {
                                                                        openAudioModal(AUDIO_URL + route.params.item.type + "/" + item?.recording_filename)
                                                                    }}>
                                                                    <Icon name="play-circle-outline" size={26} color={greenPrimary} />

                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ width: 100, alignItems: "center" }}>
                                                                <TouchableOpacity
                                                                    style={{
                                                                        height: 30,
                                                                        width: 30,
                                                                        alignItems: "center",
                                                                        justifyContent: "center"
                                                                    }}
                                                                    onPress={() => {
                                                                        onDelete(item)
                                                                    }}>
                                                                    <Icon name="trash-can" size={25} color={red} />

                                                                </TouchableOpacity>
                                                            </View>

                                                        </View>
                                                    );
                                                }}

                                            />
                                        </View>
                                    </View>
                                </ScrollView>
                            </>

                            :
                            <View
                                style={{
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: disableColor,
                                    marginHorizontal: -20,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_12,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {'Recording File'}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(AUDIO_URL + route.params.item.type + "/" + route?.params?.item?.recording_filename)
                                        }}
                                        style={{ alignItems: 'center', backgroundColor: grey, padding: 6, borderRadius: 4 }}>
                                        <Icon name={"arrow-down"} size={22} color={white} />
                                    </TouchableOpacity>

                                </View>
                                {route?.params?.isEdit == true && IsNewFile == false &&
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: grey,
                                            justifyContent: 'center',
                                            marginTop: 20,
                                            paddingTop: 20,
                                            borderRadius: 4
                                        }}>
                                        <AudioPlayer
                                            url={AUDIO_URL + route.params.item.type + "/" + route?.params?.item?.recording_filename}
                                        />
                                    </View>
                                }
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: grey,
                                        fontFamily: REGULAR,
                                        marginVertical: 10
                                    }}>
                                    {" * Note : Allow only mp3, wav, m4a file and file size shoud be \n   less then 10 MB."}
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: light_grey,
                                        borderRadius: 4,
                                        marginTop: 10,
                                        padding: 14
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            UploadMusinOnHold();
                                        }}
                                        style={{ alignItems: 'center', }}>
                                        <Icon name="cloud-upload-outline" size={22} color={grey} />
                                        <Text
                                            style={{
                                                fontSize: FontSize.FS_12,
                                                color: grey,
                                                fontFamily: SEMIBOLD,
                                            }}>
                                            {route?.params?.isEdit == true ? "Upload New File" : 'Upload'}
                                        </Text>
                                    </TouchableOpacity>
                                    {SelectedAudioFile !== null &&
                                        <View style={{ marginVertical: 24 }}>
                                            <Text
                                                style={{
                                                    fontSize: FontSize.FS_12,
                                                    color: grey,
                                                    fontFamily: SEMIBOLD,
                                                    textAlign: 'center',

                                                }}>
                                                {SelectedAudioFile[0]?.uri}
                                            </Text>
                                        </View>
                                    }
                                </View>
                                {SelectedAudioFileError !== "" && <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: MEDIUM,
                                        marginTop: 8

                                    }}>
                                    {SelectedAudioFileError}
                                </Text>
                                }
                            </View>}
                        <TouchableOpacity onPress={() => {
                            if (route?.params?.isEdit == true) {
                                HandleUpdateAudio()
                            }
                            else {
                                HandleUploadAudio()

                            }
                        }}
                            style={{
                                backgroundColor: greenPrimary,
                                alignItems: "center",
                                paddingVertical: 10,
                                marginVertical: 40,
                                justifyContent: "center",
                                borderRadius: 4,
                                width: "100%"
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_14,
                                color: white,
                                fontFamily: SEMIBOLD,
                                lineHeight: 24,
                                marginLeft: 10
                            }}>{isEdit ? "Update" : "Upload"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <View
                                style={{
                                    backgroundColor: grey,
                                    // marginVertical: 20,
                                    paddingTop: 20,
                                    margin: 0,
                                    marginHorizontal: -1.5
                                    // borderRadius:8,
                                }}>
                                <TouchableOpacity style={{
                                    alignSelf: "flex-end",
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                }}
                                    onPress={() => {
                                        setModalVisible(false)
                                        setAudioUrl("")
                                    }
                                    }>
                                    <Icon name={"close"} size={24} color={white} />
                                </TouchableOpacity>
                                <View style={{ marginTop: 40 }}>
                                    <AudioPlayer
                                        url={AudioUrl}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default ManageAudioFiles;

const styles = StyleSheet.create({
    TableHaderText: {
        fontSize: FontSize.FS_12,
        color: white,
        fontFamily: SEMIBOLD,
    },
    TableRowText: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: MEDIUM,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
        backgroundColor: black05
    },
    modalView: {
        width: WIDTH - 42,
        backgroundColor: grey,
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
