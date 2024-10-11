import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    StatusBar, Dimensions, TouchableOpacity, Alert, TextInput
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    black, black05, greenPrimary, grey, grey01, grey02, light_grey, midGreen, paleGreen, red, transparent, white, yellow
} from '../../constants/Color';
import { BOLD, FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import * as Yup from 'yup';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import { QUARTELY, STATUS_FULFILLED, STATUS_REJECTED, ANNUAL, REACT_APP_GOOGLE_API_KEY } from '../../constants/ConstantKey';
import { useFocusEffect } from '@react-navigation/native';
import { resetGeneralApiStatus } from '../../redux/reducers/generalReducer';
import { Change_Password, Check_Email_Config, Check_User_Email, Create_Extension, Save_E911_Data } from '../../redux/api/Api';
import LoadingView from '../../commonComponents/LoadingView';
import ProgressSteps from '../../commonComponents/ProgressStep/ProgressSteps';
import ProgressStep from '../../commonComponents/ProgressStep/ProgressStep';
import { Dropdown } from 'react-native-element-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { resetAuthApiStatus } from '../../redux/reducers/userReducer';
import { resetApiStatus } from '../../redux/reducers/callReducer';
import AddNewInboundNumber from '../DashBoardScreen/InboundNumbers/AddNewInBoundNumber';
import BuyDid from './BuyDid';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { resetScreen } from '../../navigation/RootNavigation';

const WIDTH = Dimensions.get('window').width
const UserOnBoarding = ({ route }) => {
    const [currentStep, setCurrentStep] = useState(3);
    //first step
    const [IsFirstStepError, setIsFirstStepError] = useState(false);
    const [OldPassword, setOldPassword] = useState(''); //Test@123
    const [OldPasswordError, setOldPasswordError] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [NewPasswordError, setNewPasswordError] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [ConfirmPasswordError, setConfirmPasswordError] = useState('');

    // second step

    const [SelectedDid, setSelectedDid] = useState(null);
    const [IsSecondStepError, setIsSecondStepError] = useState(false);

    // third step
    const [Email, setEmail] = useState('');
    const [EmailError, setEmailError] = useState('');
    const [Password, setPassword] = useState('');
    const [PasswordError, setPasswordError] = useState('');
    const [Host, setHost] = useState("");
    const [HostError, setHostError] = useState('');
    const [Port, setPort] = useState("");
    const [PortError, setPortError] = useState("");

    const [SmtpHost, setSmtpHost] = useState("");
    const [SmtpHostError, setSmtpHostError] = useState("");
    const [SmtpPort, setSmtpPort] = useState("");
    const [SmtpPortError, setSmtpPortError] = useState("");
    const [SmptpEncryption, setSmptpEncryption] = useState("");
    const [SmptpEncryptionError, setSmptpEncryptionError] = useState("");

    const [IsThirdStepError, setIsThirdStepError] = useState(false);

    // forth step 
    const [IsFourthStepError, setIsFourthStepError] = useState(false);

    const [CallerIdName, setCallerIdName] = useState('');
    const [CallerIdNameError, setCallerIdNameError] = useState('');
    const [StreetName, setStreetName] = useState('');
    const [StreetNameError, setStreetNameError] = useState('');
    const [CompanyType, setCompanyType] = useState('');
    const [CompanyTypeError, setCompanyTypeError] = useState('');
    const [CompanyAddressManual, setCompanyAddressManual] = useState(false);
    const [CompanyAddress, setCompanyAddress] = useState(null);
    const [CompanyAddressError, setCompanyAddressError] = useState('');
    const [Apartment, setApartment] = useState('');
    const [ApartmentError, setApartmentError] = useState('');
    const [City, setCity] = useState('');
    const [CityError, setCityError] = useState('');
    const [State, setState] = useState('');
    const [StateError, setStateError] = useState('');
    const [PostalCode, setPostalCode] = useState('');
    const [PostalCodeError, setPostalCodeError] = useState('');

    const ref = useRef(null);

    const dispatch = useDispatch();

    const data = [
        { label: 'SSL', value: 'ssl' },
        { label: 'TLS', value: 'tls' },
    ];
    const apiChangePassword = useSelector(state => state.userRedux.apiChangePassword);
    const apiCheckEmailConfig = useSelector(state => state.userRedux.apiCheckEmailConfig);
    const email_config_data = useSelector(state => state.userRedux.email_config_data);
    const apiSaveE911Data = useSelector(state => state.userRedux.apiSaveE911Data);
    const apiCreateExtesnion = useSelector(
        state => state.callRedux.apiCreateExtesnion,
    );
    const create_extension_data = useSelector(
        state => state.callRedux.create_extension_data,
    );

    const isLoading = useSelector(state => state.userRedux.isLoader);
    const isLoadingInbound = useSelector(state => state.inboundRedux.isLoader);
    const isError = useSelector(state => state.userRedux.isError);
    const error_message = useSelector(state => state.userRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    useFocusEffect(
        useCallback(() => {
            var onboarding_data = route?.params?.onboarding_data

            if (onboarding_data) {
                if (onboarding_data.is_password_done === "NO") {
                    setCurrentStep(0);
                } else if (onboarding_data.is_did_done === "NO") {
                    setCurrentStep(1);
                } else if (onboarding_data.is_email_config_done === "NO") {
                    setCurrentStep(2);
                } else if (onboarding_data.is_e911_done === "NO") {
                    setCurrentStep(3);
                }
            }

            return () => {
                dispatch(resetApiStatus())
                dispatch(resetAuthApiStatus())
            };
        }, [route?.params?.onboarding_data])
    );

    useEffect(() => {
        Log('apiChangePassword :', apiChangePassword);
        if (apiChangePassword == STATUS_FULFILLED) {
            console.log("step 2")
            const ext_pass = Math.floor(1000000 + Math.random() * 9000000);
            const dict = {
                extension: "1000",
                extension_password: ext_pass.toString(),
                voicemail_password: ext_pass.toString(),
                voicemail_enabled: "NO",
                call_waiting_enabled: "YES",
                call_waiting_timeout: "20",
                max_registrations: "1",
                dnd_enabled: "NO",
                initial_extension_ringtime: "15",
                limit_max: "1",
                limit_destination: "",
                voicemail_mail_to: "",
                voicemail_file: "",
                call_timeout: "20",
                call_screen_enabled: "",
                description: "",
                when_create: "login",
                user: user_data.data?.user_uuid,
                createdby: user_data.data?.user_uuid,
                main_admin_uuid: user_data.data?.main_uuid,
                user_uuid: user_data.data?.user_uuid,
            };
            dispatch(Create_Extension(dict));
        } else if (apiChangePassword == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiChangePassword]);

    useEffect(() => {
        Log('apiCheckEmailConfig :', apiCheckEmailConfig);
        if (apiCheckEmailConfig == STATUS_FULFILLED) {
            console.log("email_config_data :", email_config_data)
            // setIsThirdStepError(true);
            // setCurrentStep(3)
            if (email_config_data?.imap_status == "YES" && email_config_data?.smtp_status == "YES") {
                setIsThirdStepError(true);
                setCurrentStep(3)
            }
            else {
                alert(error_message)
            }

        } else if (apiCheckEmailConfig == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCheckEmailConfig]);


    useEffect(() => {
        Log('apiSaveE911Data :', apiSaveE911Data);
        if (apiSaveE911Data == STATUS_FULFILLED) {
            resetScreen("Home")

        } else if (apiSaveE911Data == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiSaveE911Data]);


    useEffect(() => {
        Log('apiCreateExtesnion :', apiCreateExtesnion);
        if (apiCreateExtesnion == STATUS_FULFILLED) {
            console.log("Extension Created & Move Second Step")
            setIsFirstStepError(false);
            setCurrentStep(1)
        } else if (apiCreateExtesnion == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateExtesnion]);

    const onFirstStepNext = () => {

        const errors = {};
        const passwordRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$`);
        if (OldPassword.trim() == "") {
            errors.oldPasswordError = "* Please enter a old password";
        }

        if (NewPassword.trim() == "") {
            errors.newPasswordError = "* Please enter a new password";
        }


        if (passwordRegex.test(NewPassword) == false) {
            errors.newPasswordError = "* Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
        }

        if (ConfirmPassword.trim() == "") {
            errors.confirmPasswordError = "* Please enter a confirm password";
        }
        if (NewPassword !== ConfirmPassword) {
            errors.confirmPasswordError = "* Password does not match";
        }
        // if (passwordRegex.test(ConfirmPassword) == false) {
        //     errors.confirmPasswordError = "* Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
        // }

        if (Object.keys(errors).length > 0) {
            setOldPasswordError(errors.oldPasswordError || "");
            setNewPasswordError(errors.newPasswordError || "");
            setConfirmPasswordError(errors.confirmPasswordError || "");
            setIsFirstStepError(true);
        } else {
            setIsFirstStepError(true);
            console.log("step 1")
            var dict = {
                old_password: OldPassword,
                new_password: NewPassword,
                uuid: user_data?.data?.user_uuid,
                createdby: user_data?.data?.user_uuid,
                type: "onboarding",
            };
            console.log("dict: ", dict);
            dispatch(Change_Password(dict));

        }
    };

    const onSecondStepNext = () => {
        if (SelectedDid !== null && SelectedDid?.length > 0) {
            setIsSecondStepError(false);
            setCurrentStep(1)
        }
        else {
            setIsSecondStepError(true);
            alert("Please selecte at least on DID")
        }

    };


    const onThirdStepNext = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors = {};
        if (emailRegex.test(Email) == false) {
            errors.emailaddressError = 'Please enter a valid email address';
            // setEmail(txt);
        }
        if (Password.trim() == "") {
            errors.passwordError = 'Please enter a password';
        }
        if (Host.trim() == "") {
            errors.hostError = 'Please enter a incoming host'
        }
        if (Port.trim() == "") {
            errors.portError = 'Please enter a incoming port'
        }
        if (SmtpHost.trim() == "") {
            errors.smptHostError = 'Please enter a SMTP host'
        }
        if (SmtpPort.trim() == "") {
            errors.smptPortError = 'Please enter a SMTP port'
        }
        if (SmptpEncryption.trim() == "") {
            errors.smtpEncryptionError = 'Please select SMTP Encryption'
        }
        if (Object.keys(errors).length > 0) {
            setEmailError(errors.emailaddressError || "");
            setPasswordError(errors.passwordError || "");
            setHostError(errors.hostError || "");
            setPortError(errors.portError || "");
            setSmtpPortError(errors.smptPortError || "");
            setSmtpHostError(errors.smptHostError || "");
            setSmptpEncryptionError(errors.smtpEncryptionError || "");
            setIsThirdStepError(true);
        }
        else {
            setIsThirdStepError(true);
            console.log("step 1")

            var dict = {
                createdby: user_data?.data?.user_uuid,
                email: Email,
                incoming_host: Host,
                incoming_port: Port,
                main_admin_uuid: user_data?.data?.main_uuid,
                password: Password,
                smtp_encryption: SmptpEncryption,
                smtp_host: SmtpHost,
                smtp_port: SmtpPort,
                user_type: 'sub_user',
                user_uuid: user_data?.data?.user_uuid,
            };
            console.log("dict: ", dict);
            // setIsThirdStepError(true);
            // setCurrentStep(3)
            dispatch(Check_Email_Config(dict));

        }
    };

    const onFourthStepNext = () => {
        console.log("1")
        const errors = {};
        if (CallerIdName === "") {
            errors.callerIdName = "* Please enter a Caller ID name";
        }
        if (CompanyAddress === null) {
            errors.companyAddressError = "* Please enter an address";
        }
        if (StreetName === "") {
            errors.streetError = "* Please enter a street name";
        }
        if (City === "") {
            errors.cityError = "* Please enter a City";
        }


        if (State === '') {
            errors.stateError = '* Please enter a State';
        }
        if (Object.keys(errors).length > 0) {
            console.log("error", errors)
            setCallerIdNameError(errors.callerIdName || "");
            setCompanyAddressError(errors.companyAddressError || "");
            setCityError(errors.cityError || "");
            setStateError(errors.stateError || "");
            setStreetNameError(errors.streetError || "");
            setIsFourthStepError(true);
        } else {
            setIsFourthStepError(true);
            console.log("step 4")

            var dict = {
                createdby: user_data?.data?.user_uuid,
                address_1: CompanyAddress,
                address_2: "",
                caller_id_name: CallerIdName,
                city: City,
                house_number: Apartment,
                state: State,
                street_name: StreetName,
                zip: PostalCode,
                user_type: 'sub_user',
                user_uuid: user_data?.data?.user_uuid,
                main_admin_uuid: user_data?.data?.main_uuid,
            };
            console.log("dict: ", dict);
            // setIsThirdStepError(true);
            // setCurrentStep(3)
            dispatch(Save_E911_Data(dict));
        }
    }



    return (
        <>
            <StatusBar
                translucent={true}
                barStyle={'light-content'}
                backgroundColor={transparent}
            />
            <ScrollView
                style={styles.container}
                bounces={true}
                keyboardShouldPersistTaps="handled"
            >
                <SafeAreaView style={styles.safeAreaView}>
                    <View style={{ alignItems: 'center', marginTop: '8%', }}>
                        <Text style={{
                            fontSize: FontSize.FS_15,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginLeft: 8,
                            marginTop: 2,
                            textTransform: 'uppercase',
                        }}>
                            {"Onboarding user"}
                        </Text>
                        <View style={{ flex: 1 }}>
                            <ProgressSteps activeStep={currentStep}  >
                                <ProgressStep onNext={() => onFirstStepNext()} errors={IsFirstStepError} label="Set Password">
                                    <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_15,
                                            color: black,
                                            fontFamily: BOLD,
                                            textAlign: "center",
                                            textDecorationLine: "underline"
                                        }}>{"SET PASSWORD"}</Text>
                                        <View style={{ marginTop: 20 }}>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"Old Password"}</Text>
                                                <TextInput
                                                    value={OldPassword}
                                                    placeholder='Old Password'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setOldPassword(txt)
                                                        if (txt.length > 0) {
                                                            setOldPasswordError("")
                                                        }
                                                    }}
                                                />
                                                {OldPasswordError !== "" && <Text style={styles.errorText}>{OldPasswordError}</Text>}
                                            </View>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"New Password"}</Text>
                                                <TextInput
                                                    value={NewPassword}
                                                    placeholder='New Password'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setNewPassword(txt)
                                                        const passwordRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$`);
                                                        if (passwordRegex.test(txt)) {
                                                            setNewPasswordError("")
                                                        }
                                                        else {
                                                            setNewPasswordError("* Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.")
                                                        }
                                                    }}
                                                />
                                                {NewPasswordError !== "" && <Text style={styles.errorText}>{NewPasswordError}</Text>}
                                            </View>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"Confirm Password"}</Text>
                                                <TextInput
                                                    value={ConfirmPassword}
                                                    placeholder='Confirm Password'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setConfirmPassword(txt)
                                                        console.log("okko", ConfirmPassword == NewPassword)
                                                        if (txt == NewPassword) {
                                                            setConfirmPasswordError("")
                                                        }
                                                        else {
                                                            setConfirmPasswordError("* Password does not match")
                                                        }
                                                    }}
                                                />
                                                {ConfirmPasswordError !== "" && <Text style={styles.errorText}>{ConfirmPasswordError}</Text>}
                                            </View>


                                        </View>
                                    </View>
                                </ProgressStep>
                                <ProgressStep previousBtnTextStyle={{ width: 0, height: 0, }} previousBtnText={""} previousBtnDisabled={true} onNext={() => onSecondStepNext()} errors={IsSecondStepError} disabled={currentStep < 0} label="Select did">
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_15,
                                            color: black,
                                            fontFamily: BOLD,
                                            textAlign: "center",
                                            textDecorationLine: "underline"
                                        }}>{"SELECT DID"}</Text>

                                        <View style={{ marginTop: 20, }}>

                                            <BuyDid selected_did={(data) => {
                                                setSelectedDid(data)
                                            }} />
                                        </View>
                                    </View>
                                </ProgressStep>
                                <ProgressStep previousBtnTextStyle={{ width: 0, height: 0, }} previousBtnText={""} previousBtnDisabled={false} onNext={() => onThirdStepNext()} errors={IsThirdStepError} disabled={currentStep < 1} label="Email Config">
                                    <View style={{ marginHorizontal: 20 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_15,
                                                color: black,
                                                fontFamily: BOLD,
                                                textAlign: "center",
                                                textDecorationLine: "underline",
                                                flex: 1
                                            }}>{"EMAIL CONFIG"}</Text>
                                            <TouchableOpacity onPress={() => {
                                                setIsThirdStepError(true);
                                                setCurrentStep(3)
                                            }}>
                                                <Text style={{
                                                    fontSize: FontSize.FS_12,
                                                    color: black,
                                                    fontFamily: SEMIBOLD,
                                                    textAlign: "center",
                                                    textDecorationLine: "underline"
                                                }}>{"skip"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_14,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                textAlign: "left",
                                                textDecorationLine: "underline"
                                            }}>{"Incoming Configuration"}</Text>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"Email"}</Text>
                                                <TextInput
                                                    value={Email}
                                                    placeholder='Enter email'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setEmail(txt)
                                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                        if (emailRegex.test(txt)) {
                                                            setEmailError('');
                                                            // setEmail(txt);
                                                        } else {
                                                            setEmailError('Please enter a valid email');
                                                        }
                                                    }}
                                                />
                                                {EmailError !== "" && <Text style={styles.errorText}>{EmailError}</Text>}
                                            </View>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"Password"}</Text>
                                                <TextInput
                                                    value={Password}
                                                    placeholder='Enter password'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setPassword(txt)
                                                        if (txt.length > 0) {
                                                            setPasswordError("")
                                                        }
                                                    }}
                                                />
                                                {PasswordError !== "" && <Text style={styles.errorText}>{PasswordError}</Text>}
                                            </View>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"Incoming Host"}</Text>
                                                <TextInput
                                                    value={Host}
                                                    placeholder='Incoming host'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setHost(txt)
                                                        if (txt.length > 0) {
                                                            setHostError("")
                                                        }
                                                    }}
                                                />
                                                {HostError !== "" && <Text style={styles.errorText}>{HostError}</Text>}
                                            </View>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"Incoming Port"}</Text>
                                                <TextInput
                                                    keyboardType='decimal-pad'
                                                    value={Port}
                                                    placeholder='Incoming port'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setPort(txt)
                                                        if (txt.length > 0) {
                                                            setPortError("")
                                                        }
                                                    }}
                                                />
                                                {PortError !== "" && <Text style={styles.errorText}>{PortError}</Text>}
                                            </View>
                                            <Text style={{
                                                fontSize: FontSize.FS_14,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                textAlign: "left",
                                                textDecorationLine: "underline",
                                                marginTop: 33
                                            }}>{"Incoming Configuration"}</Text>
                                            <View >
                                                <Text style={styles.textInputLabel}>{"SMTP Host"}</Text>
                                                <TextInput
                                                    value={SmtpHost}
                                                    placeholder='SMTP host'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setSmtpHost(txt)
                                                        if (txt.length > 0) {
                                                            setSmtpHostError("")
                                                        }
                                                    }}
                                                />
                                                {SmtpHostError !== "" && <Text style={styles.errorText}>{SmtpHostError}</Text>}
                                            </View>
                                            <View>
                                                <Text style={styles.textInputLabel}>{"SMTP Port"}</Text>
                                                <TextInput
                                                    keyboardType='decimal-pad'
                                                    value={SmtpPort}
                                                    placeholder='SMTP port'
                                                    placeholderTextColor={grey01}
                                                    style={styles.textInputStyle}
                                                    onChangeText={(txt) => {
                                                        setSmtpPort(txt)
                                                        if (txt.length > 0) {
                                                            setSmtpPortError("")
                                                        }
                                                    }}
                                                />
                                                {SmtpPortError !== "" && <Text style={styles.errorText}>{SmtpPortError}</Text>}
                                            </View>
                                            <View style={{ marginBottom: 40 }}>
                                                <Text style={styles.textInputLabel}>{"SMTP Encryption"}</Text>
                                                <Dropdown
                                                    itemTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                                    itemContainerStyle={{ marginVertical: -5 }}
                                                    ref={ref}
                                                    style={styles.dropdown}
                                                    containerStyle={styles.containerStyle}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    iconStyle={styles.iconStyle}
                                                    data={data}
                                                    maxHeight={200}
                                                    labelField="label"
                                                    valueField="value"
                                                    value={SmptpEncryption}
                                                    onChange={(item) => {
                                                        setSmptpEncryption(item.value);
                                                        setSmptpEncryptionError("")
                                                    }}
                                                    onChangeText={() => { }} // Keep search keyword
                                                />
                                                {SmptpEncryptionError !== "" && <Text style={styles.errorText}>{SmptpEncryptionError}</Text>}
                                            </View>
                                        </View>
                                    </View>
                                </ProgressStep>
                                <ProgressStep previousBtnTextStyle={{ width: 0, height: 0, }} previousBtnText={""} previousBtnDisabled={false} finishBtnText={"Save"} label="E911" errors={IsFourthStepError} onSubmit={() => onFourthStepNext()} disabled={currentStep < 3} >
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_15,
                                            color: black,
                                            fontFamily: BOLD,
                                            textAlign: "center",
                                            textDecorationLine: "underline"
                                        }}>{"E911 Caller ID and Address"}</Text>
                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ marginHorizontal: 0 }}>

                                                <View style={{ marginTop: 0 }}>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12, marginBottom: 8
                                                        }}>{"Caller ID Name"}</Text>
                                                        <TextInput
                                                            value={CallerIdName}
                                                            placeholder='Enter Caller ID Name'
                                                            placeholderTextColor={grey01}
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: grey01,
                                                                height: 38,
                                                                borderRadius: 6,
                                                                paddingHorizontal: 14,
                                                                fontSize: FontSize.FS_12,
                                                                color: black,
                                                                fontFamily: MEDIUM,
                                                            }}
                                                            onChangeText={(txt) => {
                                                                setCallerIdName(txt)
                                                                if (txt.length > 0) {
                                                                    setCallerIdNameError("")
                                                                }
                                                            }}
                                                        />
                                                        {CallerIdNameError !== "" && <Text style={styles.errorText}>{CallerIdNameError}</Text>}
                                                    </View>

                                                    <View style={{ marginTop: 4, flex: 1 }}>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12,
                                                        }}>{"Addess"}</Text>
                                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 10 }}>
                                                            <Text style={{
                                                                fontSize: FontSize.FS_11,
                                                                color: grey,
                                                                fontFamily: MEDIUM,

                                                            }}>{"Enter manually"}</Text>
                                                            <TouchableOpacity onPress={() => { setCompanyAddressManual(!CompanyAddressManual) }}>
                                                                <Icon name={CompanyAddressManual == true ? "checkbox-marked" : "checkbox-blank-outline"} size={18} color={CompanyAddressManual == true ? greenPrimary : grey} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        {CompanyAddressManual == false ?
                                                            <GooglePlacesAutocomplete
                                                                debounce={200}
                                                                fetchDetails={true}
                                                                placeholder='Enter Address'
                                                                getAddressText={(txt) => { }}
                                                                setAddressText={(txt) => { }}
                                                                
                                                                isFocused={() => {console.log("FOCUS")}}
                                                                onPress={(data, details = null) => {

                                                                    const addressComponents = details?.address_components || [];
                                                                    addressComponents.forEach((add, index) => {

                                                                        if (add.types.find((element) => element == "subpremise") == "subpremise") {
                                                                            setApartment(add.long_name)
                                                                            setApartmentError("")
                                                                        }

                                                                        if (add.types.find((element) => element == "premise") == "premise") {
                                                                            setApartment(add.long_name)
                                                                            setApartmentError("")
                                                                        }


                                                                        if (add.types.find((element) => element == "postal_code") == "postal_code") {
                                                                            setPostalCode(add.long_name)
                                                                            setPostalCodeError("")
                                                                        }

                                                                        if (add.types.find((element) => element == "administrative_area_level_1") == "administrative_area_level_1") {
                                                                            setState(add.long_name)
                                                                            setStateError("")
                                                                        }

                                                                        if (add.types.find((element) => element == "administrative_area_level_2") == "administrative_area_level_2") {
                                                                            setCity(add.long_name)
                                                                            setCityError("")
                                                                        } else {
                                                                            if (add.types.find((element) => element == "administrative_area_level_3") == "administrative_area_level_3") {
                                                                                setCity(add.long_name)
                                                                                setCityError("")
                                                                            }
                                                                        }
                                                                    })
                                                                    setCompanyAddress(details?.formatted_address)
                                                                    setCompanyAddressError("")
                                                                }}
                                                                onFail={error => { }}
                                                                onNotFound={() => { }}
                                                                query={{
                                                                    key: REACT_APP_GOOGLE_API_KEY,
                                                                    language: 'en',
                                                                }}
                                                                autoFocus={false}
                                                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                                                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                                                listViewDisplayed={false}
                                                                keepResultsAfterBlur={true}
                                                                styles={{
                                                                    container: {
                                                                        backfaceVisibility: 'visible'
                                                                    },
                                                                    textInputContainer: {
                                                                        backgroundColor: white,
                                                                    },
                                                                    description: {
                                                                        fontSize: FontSize.FS_13,
                                                                        color: black,
                                                                        fontFamily: MEDIUM,
                                                                    },
                                                                    textInput: {
                                                                        borderRadius: 6,
                                                                        borderWidth: 1,
                                                                        borderColor: grey01,
                                                                        height: 38,
                                                                        fontSize: FontSize.FS_12,
                                                                        color: black,
                                                                        fontFamily: MEDIUM,
                                                                    },
                                                                }}
                                                            />
                                                            :
                                                            <TextInput
                                                                value={CompanyAddress}
                                                                placeholder='Enter Address'
                                                                placeholderTextColor={grey01}
                                                                multiline={CompanyAddressManual}
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: grey01,
                                                                    height: CompanyAddressManual == true ? 100 : 38,
                                                                    borderRadius: 6,
                                                                    paddingHorizontal: 14,
                                                                    fontSize: FontSize.FS_12,
                                                                    color: black,
                                                                    fontFamily: MEDIUM,
                                                                }}
                                                                onChangeText={(txt) => {
                                                                    setCompanyAddress(txt)
                                                                    if (txt.length > 0) {
                                                                        setCompanyAddressError("")
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                        {CompanyAddressError !== "" && <Text style={styles.errorText}>{CompanyAddressError}</Text>}
                                                    </View>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12, marginBottom: 8
                                                        }}>{"Suite/Apt"}</Text>
                                                        <TextInput
                                                            value={Apartment}
                                                            placeholder='Suite/Apt'
                                                            placeholderTextColor={grey01}
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: grey01,
                                                                height: 38,
                                                                borderRadius: 6,
                                                                paddingHorizontal: 14,
                                                                fontSize: FontSize.FS_12,
                                                                color: black,
                                                                fontFamily: MEDIUM,
                                                            }}
                                                            onChangeText={(txt) => {
                                                                setApartment(txt)
                                                                // if (txt.length > 0) {
                                                                //   setApartmentError("")
                                                                // }
                                                            }}
                                                        />
                                                        {ApartmentError !== "" && <Text style={styles.errorText}>{ApartmentError}</Text>}
                                                    </View>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12, marginBottom: 8
                                                        }}>{"Street Name"}</Text>
                                                        <TextInput
                                                            value={StreetName}
                                                            placeholder='Enter Street Name'
                                                            placeholderTextColor={grey01}
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: grey01,
                                                                height: 38,
                                                                borderRadius: 6,
                                                                paddingHorizontal: 14,
                                                                fontSize: FontSize.FS_12,
                                                                color: black,
                                                                fontFamily: MEDIUM,
                                                            }}
                                                            onChangeText={(txt) => {
                                                                setStreetName(txt)
                                                                if (txt.length > 0) {
                                                                    setStreetNameError("")
                                                                }
                                                            }}
                                                        />
                                                        {StreetNameError !== "" && <Text style={styles.errorText}>{StreetNameError}</Text>}
                                                    </View>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12, marginBottom: 8
                                                        }}>{"City"}</Text>
                                                        <TextInput
                                                            value={City}
                                                            placeholder='City'
                                                            placeholderTextColor={grey01}
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: grey01,
                                                                height: 38,
                                                                borderRadius: 6,
                                                                paddingHorizontal: 14,
                                                                fontSize: FontSize.FS_12,
                                                                color: black,
                                                                fontFamily: MEDIUM,
                                                            }}
                                                            onChangeText={(txt) => {
                                                                setCity(txt)
                                                                if (txt.length > 0) {
                                                                    setCityError("")
                                                                }
                                                            }}
                                                        />
                                                        {CityError !== "" && <Text style={styles.errorText}>{CityError}</Text>}
                                                    </View>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12, marginBottom: 8
                                                        }}>{"State"}</Text>
                                                        <TextInput
                                                            value={State}
                                                            placeholder='State'
                                                            placeholderTextColor={grey01}
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: grey01,
                                                                height: 38,
                                                                borderRadius: 6,
                                                                paddingHorizontal: 14,
                                                                fontSize: FontSize.FS_12,
                                                                color: black,
                                                                fontFamily: MEDIUM,
                                                            }}
                                                            onChangeText={(txt) => {
                                                                setState(txt)
                                                                if (txt.length > 0) {
                                                                    setStateError("")
                                                                }
                                                            }}
                                                        />
                                                        {StateError !== "" && <Text style={styles.errorText}>{StateError}</Text>}
                                                    </View>
                                                    <View style={{ marginBottom: 40 }}>
                                                        <Text style={{
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: SEMIBOLD,
                                                            marginTop: 12, marginBottom: 8
                                                        }}>{"ZIP code"}</Text>
                                                        <TextInput
                                                            value={PostalCode}
                                                            placeholder='ZIP Code'
                                                            placeholderTextColor={grey01}
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: grey01,
                                                                height: 38,
                                                                borderRadius: 6,
                                                                paddingHorizontal: 14,
                                                                fontSize: FontSize.FS_12,
                                                                color: black,
                                                                fontFamily: MEDIUM,
                                                            }}
                                                            onChangeText={(txt) => {
                                                                setPostalCode(txt)
                                                            }}
                                                        />
                                                        {PostalCodeError !== "" && <Text style={styles.errorText}>{PostalCodeError}</Text>}
                                                    </View>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </ProgressStep>
                            </ProgressSteps>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
            {isLoading || isLoadingInbound && <LoadingView />}
        </>
    );
};
const styles = StyleSheet.create({
    textInputLabel: {
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: SEMIBOLD,
        marginTop: 24,
        marginBottom: 8
        ,
    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: grey01,
        height: 38,
        borderRadius: 6,
        paddingHorizontal: 14,
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
    },
    container: {
        flex: 1,
        backgroundColor: white,
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: white,
    },
    errorText: {
        fontFamily: REGULAR,
        fontSize: FontSize.FS_10,
        color: red,
        marginTop: 4
    },
    welcomeTextLogin: {
        fontSize: FontSize.FS_16,
        color: black,
        fontFamily: SEMIBOLD,
        textTransform: "uppercase",
    },
    dropdown: {
        flex: 1,
        marginVertical: 4,
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 12,
        borderWidth: 1,
        borderColor: grey01,
        height: 38,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: FontSize.FS_13,
        fontFamily: MEDIUM,
        color: black
    },
    placeholderStyle: {
        fontSize: FontSize.FS_13,
        fontFamily: MEDIUM,
        color: grey01
    },
    selectedTextStyle: {
        fontSize: FontSize.FS_12,
        color: red,
        fontFamily: MEDIUM,

    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: FontSize.FS_14,
    },
    iconStyle: {
        width: 18,
        height: 18,
    },

});

export default UserOnBoarding;
