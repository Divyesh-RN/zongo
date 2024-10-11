
import { Alert, StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import {
    Create_Sms_Template,
    Get_Conatact_Field_List,
    Get_Sms_Template_Details,
    Update_Sms_Template,
} from '../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Log } from '../../commonComponents/Log';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM, REGULAR } from '../../constants/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import CheckModulePermisson from '../../commonComponents/RolePermission/CheckModulePermisson';
import PermissionCheck from '../../commonComponents/RolePermission/PermissionCheck';
import LoadingView from '../../commonComponents/LoadingView';
import { red, grey, greenPrimary, light_grey } from '../../constants/Color';
import BottomSheet from '../../commonComponents/BottomSheet/BottomSheet';
import { resetGeneralApiStatus } from '../../redux/reducers/generalReducer';

import DocumentPicker from 'react-native-document-picker';
import { resetApiStatus } from '../../redux/reducers/messageReducer';

const SmsTemplateManage = ({ navigation, route }) => {
    const [IsEdit, setIsEdit] = useState(route?.params?.isEdit || false);
    const [variableList, setvariableList] = useState(null);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [isPermission, setIsPermission] = useState(true);
    const [Name, setName] = useState("");
    const [NameError, setNameError] = useState("");
    const [Message, setMessage] = useState("");
    const [MessageError, setMessageError] = useState("");
    const [Type, setType] = useState("");
    const [TypeError, setTypeError] = useState("");
    const [Variable, setVariable] = useState("");
    const [VariableError, setVariableError] = useState("");
    const [SelectedAudioFileName, setSelectedAudioFileName] = useState('');
    const [SelectedAudioFile, setSelectedAudioFile] = useState(null);
    const [AudioFileNameError, setAudioFileNameError] = useState("");
    const [SelectedAudioFileError, setSelectedAudioFileError] = useState("");
    const [IsNewFile, setIsNewFile] = useState(false);
    const dispatch = useDispatch();
    const type = useRef();
    const variable = useRef();
    const apiSmsTemplateList = useSelector(state => state.messageRedux.apiSmsTemplateList);
    const sms_template_list_module = useSelector(state => state.messageRedux.sms_template_list_module);
    const apiContactFieldList = useSelector(state => state.generalRedux.apiContactFieldList);
    const contact_field_list = useSelector(state => state.generalRedux.contact_field_list);
    const isLoading = useSelector(state => state.messageRedux.isLoader);
    const isError = useSelector(state => state.messageRedux.isError);
    const error_message = useSelector(state => state.messageRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);
    const apiGetSmsTemplateDetails = useSelector(state => state.messageRedux.apiGetSmsTemplateDetails);
    const sms_template_details = useSelector(state => state.messageRedux.sms_template_details);
    const apiUpdateSmsTemplate = useSelector(state => state.messageRedux.apiUpdateSmsTemplate);
    const apiCreateSmsTemplate = useSelector(state => state.messageRedux.apiCreateSmsTemplate);

    const user_type = user_data?.data?.role;
    const module_name = "ring group";
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let group_uuid = "";
    let add_per = PermissionCheck(module_name, "add", "", "", "");

    const GetContactFieldList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dispatch(Get_Conatact_Field_List(dict))
        }
    }

    const GetSmsTemplateDetails = () => {
        if (route?.params?.isEdit == true) {
            var dict = {
                sms_temp_uuid: route?.params?.item?.sms_temp_uuid,
                createdby: user_data?.data?.user_uuid
            }
            console.log("Sms Details DIct", dict)
            dispatch(Get_Sms_Template_Details(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {
            GetContactFieldList()
            if (route?.params?.isEdit) {
                GetSmsTemplateDetails()
            }
            return () => {
                dispatch(resetGeneralApiStatus());
                dispatch(resetApiStatus());
            };
        }, [])
    )



    useEffect(() => {
        Log('apiContactFieldList :', apiContactFieldList);
        if (apiContactFieldList == STATUS_FULFILLED) {
            // Log("contact_field_list :", contact_field_list)
            if (contact_field_list !== null) {
                const transformedData = contact_field_list.map(item => ({ var: item }));
                setvariableList(transformedData)
            }
        } else if (apiContactFieldList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiContactFieldList]);

    useEffect(() => {
        Log('apiGetSmsTemplateDetails :', apiGetSmsTemplateDetails);
        if (apiGetSmsTemplateDetails == STATUS_FULFILLED) {
            if (sms_template_details !== null) {
                Log("sms_template_details ", sms_template_details)
                setMessage(sms_template_details?.message)
                setType(sms_template_details?.message_type)
                setName(sms_template_details?.name)

            }
        } else if (apiGetSmsTemplateDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetSmsTemplateDetails]);

    useEffect(() => {
        Log('apiUpdateSmsTemplate :', apiUpdateSmsTemplate);
        if (apiUpdateSmsTemplate == STATUS_FULFILLED) {
            goBack()
        } else if (apiUpdateSmsTemplate == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateSmsTemplate]);

    useEffect(() => {
        Log('apiCreateSmsTemplate :', apiCreateSmsTemplate);
        if (apiCreateSmsTemplate == STATUS_FULFILLED) {
            goBack()
        } else if (apiCreateSmsTemplate == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateSmsTemplate]);

    const openTypeBottomSheet = () => {
        if (type.current) {
            type.current.open();
        }
    };
    const openVariableBottomSheet = () => {
        if (variable.current) {
            variable.current.open();
        }
    };

    const UploadFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: false
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

    const onUpdate = async () => {
        if (Name == "") {
            setNameError("* Please enter a name")
        }
        if (Message == "") {
            setMessageError("* Please enter a message")
        }
        if (Type == "") {
            setTypeError("* Please select a type")
        }
        if (Type == "mms" && SelectedAudioFile == null) {
            setSelectedAudioFileError("* Please select a file")
        }
        else {

            var formData = new FormData();
            let file_name = "";
            if (Type === "sms") {
                file_name = "";
            } else {
                if (SelectedAudioFile === null) {
                    file_name = "";
                    formData.append("old_file_name", sms_template_details.file_name);
                } else {
                    file_name = SelectedAudioFileName;
                    formData.append("old_file_name", sms_template_details.file_name);
                }
            }

            formData.append("sms_temp_uuid", sms_template_details.sms_temp_uuid);
            formData.append("file", SelectedAudioFile);
            formData.append("file_name", SelectedAudioFileName);
            formData.append("name", Name);
            formData.append("message_type", Type);
            formData.append("message", Message);
            formData.append("createdby", user_data?.data?.user_uuid);
            formData.append("main_admin_uuid", user_data?.data?.main_uuid);
            formData.append("user_uuid", user_data?.data?.user_uuid);
            console.log("Update sms Template ", formData)
            dispatch(Update_Sms_Template(formData));
        }

    }
    const onCreate = async () => {
        const errors = {};
        if (Name == "") {
            errors.name = "* Please enter a name"
        }
        if (Message == "") {
            errors.message = "* Please enter a message"
        }
        if (Type == "") {
            errors.type = "* Please select a type"
        }
        if (Type == "mms" && SelectedAudioFile == null) {
            errors.file = "* Please select a file"
        }
        if (Object.keys(errors).length > 0) {
            console.log("error", errors)
            setNameError(errors.name || "");
            setMessageError(errors.message || "");
            setTypeError(errors.type || "");
            setSelectedAudioFileError(errors.file || "");
        }
        else {

            var formData = new FormData();
            let file_name = "";
            if (Type === "sms") {
                file_name = "";
            } else {
                if (SelectedAudioFile === null) {
                    file_name = "";
                    formData.append("old_file_name", sms_template_details.file_name);
                } else {
                    file_name = SelectedAudioFileName;
                    formData.append("old_file_name", sms_template_details.file_name);
                }
            }

            formData.append("sms_temp_uuid", sms_template_details.sms_temp_uuid);
            formData.append("file", SelectedAudioFile);
            formData.append("file_name", SelectedAudioFileName);
            formData.append("name", Name);
            formData.append("message_type", Type);
            formData.append("message", Message);
            formData.append("createdby", user_data?.data?.user_uuid);
            formData.append("main_admin_uuid", user_data?.data?.main_uuid);
            formData.append("user_uuid", user_data?.data?.user_uuid);
            console.log("Create sms Template ", formData)
            console.log("Dict :", formData)
            dispatch(Create_Sms_Template(formData));
        }

    }


    return (

        <>
            <HeaderBackView
                title={IsEdit == true ? "Manage SMS Templates" : "Create SMS Templates"}
                isBack={true}
                isMenu={false}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <View style={{ marginHorizontal: 20 }}>
                <Text style={{
                    color: black,
                    fontFamily: SEMIBOLD,
                    fontSize: FontSize.FS_13,
                    marginTop: 4,
                }}>{"Name"}</Text>
                <TextInput

                    style={{
                        color: black, fontSize: FontSize.FS_12, fontFamily: MEDIUM, paddingVertical: 6, borderWidth: 1,
                        borderColor: black,
                        paddingVertical: 4,
                        paddingHorizontal: 12,
                        marginVertical: 10,
                        borderRadius: 4,

                    }}
                    placeholder="Enter a name"
                    value={Name}
                    onChangeText={(txt) => {
                        setName(txt)
                        setNameError("")
                    }}
                />
                {NameError !== "" && <Text style={styles.errorText}>{NameError}</Text>}
                <Text style={{
                    color: black,
                    fontFamily: SEMIBOLD,
                    fontSize: FontSize.FS_13,
                    marginTop: 4,
                }}>{"Variable"}</Text>
                <TouchableOpacity onPress={() => {
                    openVariableBottomSheet()
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
                        marginTop: 4,
                        textTransform: "uppercase"
                    }}>{Variable == "" ? "Select Variable" : Variable}</Text>
                    <Icon name={"chevron-down"} size={22} color={grey} />

                </TouchableOpacity>
                {VariableError !== "" && <Text style={styles.errorText}>{VariableError}</Text>}
                <Text style={{
                    color: black,
                    fontFamily: SEMIBOLD,
                    fontSize: FontSize.FS_13,
                    marginTop: 4,
                }}>{"Message Type"}</Text>
                <TouchableOpacity onPress={() => {
                    openTypeBottomSheet()
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
                        marginTop: 4,
                        textTransform: "uppercase"
                    }}>{Type == "" ? "Select Message Type" : Type}</Text>
                    <Icon name={"chevron-down"} size={22} color={grey} />

                </TouchableOpacity>
                {TypeError !== "" && <Text style={styles.errorText}>{TypeError}</Text>}

                {Type == "mms" &&
                    <View>
                        <Text style={{
                            color: black,
                            fontFamily: SEMIBOLD,
                            fontSize: FontSize.FS_13,
                            marginTop: 4,
                        }}>{"Choose File"}</Text>
                        <View
                            style={{
                                borderWidth: 0.5,
                                backgroundColor: light_grey,
                                borderRadius: 4,
                                marginVertical: 10,
                                padding: 14
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    UploadFile();
                                }}
                                style={{ alignItems: 'center', }}>
                                <Icon name="cloud-upload-outline" size={22} color={grey} />
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: grey,
                                        fontFamily: SEMIBOLD,
                                    }}>
                                    {"Choose File"}
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
                    </View>
                }
                {SelectedAudioFileError !== "" && <Text style={styles.errorText}>{SelectedAudioFileError}</Text>}
                <Text style={{
                    color: black,
                    fontFamily: SEMIBOLD,
                    fontSize: FontSize.FS_13,
                    marginTop: 4,
                }}>{"Message"}</Text>
                <TextInput

                    multiline={true}
                    style={{
                        color: black, fontSize: FontSize.FS_12, fontFamily: MEDIUM, paddingVertical: 6, borderWidth: 1,
                        borderColor: black,
                        paddingVertical: 20,
                        paddingHorizontal: 12,
                        marginVertical: 10,
                        borderRadius: 4,

                    }}
                    placeholder="Type a message...."
                    value={Message}
                    onChangeText={(txt) => {
                        setMessage(txt)
                        setMessageError("")
                    }}
                />
                {MessageError !== "" && <Text style={styles.errorText}>{MessageError}</Text>}

                <TouchableOpacity onPress={() => {

                    if (IsEdit == true) {
                        onUpdate()
                    }
                    else {
                        onCreate()
                    }
                }}
                    style={{ backgroundColor: greenPrimary, alignItems: "center", justifyContent: "center", paddingVertical: 6, borderRadius: 4, marginTop: 30 }}>
                    <Text style={{
                        color: white,
                        fontFamily: SEMIBOLD,
                        fontSize: FontSize.FS_14,
                        marginTop: 4,
                    }}>{IsEdit == true ? "Update SMS Template" : "Create SMS Template"}</Text>
                </TouchableOpacity>
            </View>


            <BottomSheet
                headerTitle={"Message Type"}
                Data={[
                    { type: "sms" }, { type: "mms" }
                ]}
                titleValue={"type"}
                bottomSheetRef={type}
                selectedValue={(data) => {
                    console.log("data: ", data)
                    setType(data?.type)
                    setTypeError("")
                    if (data?.type == "sms") {
                        setSelectedAudioFile(null)
                        setSelectedAudioFileError("")
                    }
                }} />

            <BottomSheet
                headerTitle={"Select Variable"}
                Data={variableList}
                titleValue={"var"}
                bottomSheetRef={variable}
                selectedValue={(data) => {
                    console.log("data: ", data)
                    setVariable(data?.var)
                    setVariableError("")
                    let msg_val = Message + " " + "{" + data.var + "}";
                    setMessage(msg_val);
                }} />

            {isLoading && <LoadingView />}
        </>
    );
};

export default SmsTemplateManage;

const styles = StyleSheet.create({
    errorText: {
        fontFamily: REGULAR,
        fontSize: FontSize.FS_10,
        color: red,
        marginBottom: 4
    },
});
