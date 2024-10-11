import { View, StyleSheet, StatusBar, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { goBack } from '../../../navigation/RootNavigation';
import { black, darkgreen01, disableColor, greenPrimary, grey, grey01, offWhite, red, transparent, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BOLD, FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { REACT_APP_GOOGLE_API_KEY, STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Get_Number_List_Dropdown, Get_User_Details, Update_E911_Data } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { resetUserModuleApiStatus } from '../../../redux/reducers/userModuleReducer';
import { Log } from '../../../commonComponents/Log';
import LoadingView from '../../../commonComponents/LoadingView';
import { Dropdown } from 'react-native-element-dropdown';
import { resetAuthApiStatus } from '../../../redux/reducers/userReducer';

const E911User = ({ navigation }) => {
    const [IsFourthStepError, setIsFourthStepError] = useState(false);

    const [CallerIdNumber, setCallerIdNumber] = useState(null);
    const [CallerIdNumberError, setCallerIdNumberError] = useState('');
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
    const dispatch = useDispatch()
    const ref = useRef();
    const user_data = useSelector(state => state.userRedux.user_data);
    const apiUpdateE911Data = useSelector(state => state.userRedux.apiUpdateE911Data);
    const isLoading = useSelector(state => state.userModuleRedux.isLoader);
    const apiGetUserDetails = useSelector(state => state.userModuleRedux.apiGetUserDetails);
    const user_details = useSelector(state => state.userModuleRedux.user_details);
    const apiGetNumberList = useSelector(state => state.userModuleRedux.apiGetNumberList);
    const number_list = useSelector(state => state.userModuleRedux.number_list);

    const callAllApi = async () => {
        GetUserDetails()
        GetCalledIdList()
    }


    const GetUserDetails = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.useruuid = user_data?.data?.user_uuid,
                dispatch(Get_User_Details(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {
            callAllApi()
            return () => {
                dispatch(resetUserModuleApiStatus());
                dispatch(resetAuthApiStatus());
            };
        }, [])
    )
    useEffect(() => {
        Log('apiGetNumberList :', apiGetNumberList);
        if (apiGetNumberList == STATUS_FULFILLED) {
            if (number_list !== null) {
                Log("number_list :", number_list)

            }
        } else if (apiGetNumberList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetNumberList]);
    //update e911
    useEffect(() => {
        Log('apiUpdateE911Data :', apiUpdateE911Data);
        if (apiUpdateE911Data == STATUS_FULFILLED) {
            goBack()
        } else if (apiUpdateE911Data == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateE911Data]);
    // get user Detsils
    useEffect(() => {
        Log('apiGetUserDetails :', apiGetUserDetails);
        if (apiGetUserDetails == STATUS_FULFILLED) {
            if (user_details !== null) {
                Log("user_details :", user_details)
                setCallerIdName(user_details?.user_e911?.caller_id_name)
                setCompanyAddress(user_details?.user_e911?.address_1 + ' ' + user_details?.user_e911?.address_2)
                setApartment(user_details?.user_e911?.house_number)
                setStreetName(user_details?.user_e911?.street_name)
                setCity(user_details?.user_e911?.city)
                setState(user_details?.user_e911?.state)
                setPostalCode(user_details?.user_e911?.zip)
                if (user_details?.user_e911?.caller_id_number !== null && user_details?.user_e911?.caller_id_number_uuid !== null) {
                    var calledId = {};
                    calledId.label = user_details?.user_e911?.caller_id_number
                    calledId.value = user_details?.user_e911?.caller_id_number_uuid
                    setCallerIdNumber(calledId)
                }
                return
                setCompanyName(user_details?.company_data?.company_name)
                setEmail(user_details?.company_data?.company_email)
                setMobileNumber(user_details?.company_data?.company_phone_number)
                setCompanyAddress(user_details?.company_data?.company_address + " " + user_details?.company_data?.company_address2)
                setCity(user_details?.company_data?.city)
                setPostalCode(user_details?.company_data?.postal_code)
                setState(user_details?.company_data?.state)
                if (user_details?.company_data?.company_logo !== "") {
                    setProfileImgURI(IMAGE_URL + user_details?.company_data?.company_logo)
                }
                return

                setFirstName(user_details?.user?.first_name)
                setLastName(user_details?.user?.last_name)
                setMobileNumber(user_details?.user?.phone)
                if (user_details?.user?.time_zone !== null && user_details?.user?.timezone_name !== null) {
                    var timezone = {};
                    timezone.time_zone_uuid = user_details?.user?.time_zone
                    timezone.timezone_name = user_details?.user?.timezone_name
                    setTimeZone(timezone)
                }

                if (user_details?.user?.profile_image !== null) {
                    setProfileImgURI(IMAGE_URL + user_details?.user?.profile_image)
                }
                return

                var calledrId = {};
                calledrId.value = user_details?.user?.outbound_caller_id_uuid,
                    calledrId.label = user_details?.user?.did_number
                if (user_details?.user?.outbound_caller_id_uuid !== null && user_details?.user?.outbound_caller_id !== null) {
                    setCallerId(calledrId)
                }
                var extension = {};
                extension.extension_uuid = user_details?.user?.assign_extension
                extension.extension = user_details?.user?.extension
                if (user_details?.user?.assign_extension !== null && user_details?.user?.extension !== null) {
                    setExtension(extension)
                }

                setJobTitle(user_details?.user?.job_title)
                if (user_details?.user?.time_zone !== null && user_details?.user?.timezone_name !== null) {
                    var timezone = {};
                    timezone.time_zone_uuid = user_details?.user?.time_zone
                    timezone.timezone_name = user_details?.user?.timezone_name
                    setTimeZone(timezone)
                }
                if (user_details?.user?.role_uuid !== null && user_details?.user?.role !== null) {
                    var role = {};
                    role.role_uuid = user_details?.user?.role_uuid
                    role.role_name = user_details?.user?.role
                    setRole(role)
                }
                if (user_details?.user?.group_name !== null) {
                    var userGroup = {};
                    userGroup.name = user_details?.user?.group_name
                    setGroup(userGroup)
                }
                if (user_details?.user?.language !== null) {
                    var language = {};
                    language.language = user_details?.user?.language
                    setLanguage(language)
                }

            }
        } else if (apiGetUserDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetUserDetails]);

    const GetCalledIdList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.action = "update",
                dict.assign_number = user_data?.data?.user_uuid,
                dict.createdby = user_data?.data?.user_uuid,
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.user_type = "admin"
            console.log("Get_Number_List_Dropdown :", dict);
            dispatch(Get_Number_List_Dropdown(dict))
        }
    }


    const onUpdateE911 = () => {
        const errors = {};

        if (CallerIdName === "") {
            errors.callerIdName = "* Please enter a caller ID name";
        }

        if (CallerIdNumber == null) {
            errors.callerIdNumber = "* Please select a caller ID number";
        }
        if (CompanyAddress === null) {
            errors.companyAddressError = "* Please enter a address";
        }
        if (Apartment === "") {
            errors.apartment = "* Please enter a suite/apt";
        }
        if (StreetName === "") {
            errors.streetName = "* Please enter a streetName";
        }
        if (City === "") {
            errors.cityError = "* Please enter a City";
        }

        if (State === '') {
            errors.stateError = '* Please enter a State';
        }
        if (Object.keys(errors).length > 0) {

            setCallerIdNameError(errors.callerIdName || "");
            setCallerIdNumberError(errors.callerIdNumber || "");
            setCompanyAddressError(errors.companyAddressError || "");
            setApartmentError(errors.apartment || "");
            setStreetNameError(errors.streetName || "");
            setCityError(errors.cityError || "");
            setStateError(errors.stateError || "");
            console.log("error: ", errors)
        } else {

            var dict = {
                address_1: CompanyAddress,
                address_2: "",
                caller_id_name: CallerIdName,
                caller_id_number: CallerIdNumber?.label,
                caller_id_number_uuid: CallerIdNumber?.value,
                city: City,
                createdby: user_data?.data?.user_uuid,
                house_number: Apartment,
                main_uuid: user_data?.data?.main_uuid,
                state: State,
                street_name: StreetName,
                user_e911_uuid: user_details?.user_e911?.user_e911_uuid,
                user_type: "admin",
                user_uuid: user_data?.data?.user_uuid,
                zip: PostalCode,


            }
            console.log("dict", dict)
            dispatch(Update_E911_Data(dict))
            // goBack()

        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View style={styles.headerContainer}>
                <View style={styles.HStack}>
                    <View style={styles.row}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => { goBack() }}>
                            <Icon name="arrow-left" size={24} color={white} />
                        </IconButton>
                        <Text style={styles.ProfileHeaderText}>{"E911"}</Text>
                    </View>
                </View>
            </View>
            <ScrollView>

                <View style={{ marginHorizontal: 20 }}>
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
                    <View>
                        <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                        }}>{"Caller ID Number"}</Text>
                       {number_list && <Dropdown
                            itemTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                            itemContainerStyle={{ marginVertical: -5 }}
                            ref={ref}
                            style={styles.dropdown}
                            containerStyle={styles.containerStyle}
                            placeholderStyle={styles.placeholderStyle}
                            iconStyle={styles.iconStyle}
                            data={number_list}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            value={CallerIdNumber}
                            onChange={(item) => {
                                setCallerIdNumber(item);
                                setCallerIdNumberError("")
                            }}
                            onChangeText={() => { }} // Keep search keyword
                        />}
                        {/* <TextInput
                        value={CallerIdNumber}
                        placeholder='Enter Caller ID Number'
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
                            setCallerIdNumber(txt)
                            if (txt.length > 0) {
                                setCallerIdNumberError("")
                            }
                        }}
                    /> */}
                        {CallerIdNumberError !== "" && <Text style={styles.errorText}>{CallerIdNumberError}</Text>}
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20, paddingBottom: 0, paddingTop: 10, }}>

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
                            // debounce={200}
                            fetchDetails={true}
                            placeholder={CompanyAddress}
                            getAddressText={(txt) => { }}
                            setAddressText={(txt) => { }}

                            isFocused={() => { console.log("FOCUS") }}
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
                            onFail={(error) => console.error("Google Places Autocomplete Error:", error)}
                            onNotFound={() => console.log("Place not found")}
                            query={{
                                key: REACT_APP_GOOGLE_API_KEY,
                                language: 'en',
                            }}
                            autoFocus={false}
                            returnKeyType={'search'}
                            keyboardAppearance={'light'}
                            listViewDisplayed={false}
                            keepResultsAfterBlur={true}
                            styles={{
                                container: {
                                    backfaceVisibility: 'visible',
                                },
                                description: {
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: MEDIUM,
                                },
                                listView: {
                                    backgroundColor: transparent,
                                },
                                separator: {
                                    height: 0.5,
                                    backgroundColor: '#c8c7cc',
                                },
                                poweredContainer: {
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    borderBottomRightRadius: 5,
                                    borderBottomLeftRadius: 5,
                                    borderColor: '#c8c7cc',
                                    borderTopWidth: 0.5,
                                },
                                textInput: {
                                    borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: grey01,
                                    height: 38,
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    backgroundColor: transparent
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
                <View style={{ marginHorizontal: 20, marginTop: 0 }}>
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
                                if (txt.length > 0) {
                                    setApartmentError("")
                                }
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

                <TouchableOpacity onPress={() => { onUpdateE911() }}
                    style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 50, marginHorizontal: 20, }}>
                    <Text style={{
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: SEMIBOLD
                    }}>{"Update E911"}</Text>
                </TouchableOpacity>

            </ScrollView>
            {isLoading && <LoadingView />}

        </SafeAreaView>
    );
};

export default E911User;

const styles = StyleSheet.create({

    ProfileHeaderText: {
        fontSize: FontSize.FS_15,
        color: white,
        fontFamily: SEMIBOLD,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    HStack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    headerContainer: {
        backgroundColor: darkgreen01,
        paddingTop: 20,
    },
    container: {
        backgroundColor: offWhite,
        flex: 1
        ,
    },
    errorText: {
        fontFamily: REGULAR,
        fontSize: FontSize.FS_10,
        color: red,
        marginTop: 2
    },
    dropdown: {
        flex: 1,
        marginVertical: 4,
        backgroundColor: transparent,
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
        fontSize: FontSize.FS_12,
        fontFamily: MEDIUM,
        color: black
    },
    placeholderStyle: {
        fontSize: FontSize.FS_12,
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
        fontSize: FontSize.FS_12,
    },
    iconStyle: {
        width: 18,
        height: 18,
    },
});
