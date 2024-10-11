import { View, StyleSheet, StatusBar, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { goBack } from '../../../navigation/RootNavigation';
import { black, darkgreen01, disableColor, greenPrimary, grey, grey01, offWhite, paleGreen, red, transparent, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BOLD, FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { REACT_APP_GOOGLE_API_KEY, STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Get_User_Details, Update_Admin_Company_Info } from '../../../redux/api/Api';
import { resetUserModuleApiStatus } from '../../../redux/reducers/userModuleReducer';
import { useFocusEffect } from '@react-navigation/native';
import { Log } from '../../../commonComponents/Log';
import { IMAGE_URL, INTERNAL_CHAT_IMAGE_URL } from '../../../constants/ApiUrl';
import LoadingView from '../../../commonComponents/LoadingView';
import { resetAuthApiStatus } from '../../../redux/reducers/userReducer';
import ImageView from "react-native-image-viewing";

const CompanyProfile = ({ navigation }) => {

    const [ProfileImURI, setProfileImgURI] = useState("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
    const [ProfileImg, setProfileImg] = useState(null);
    const [viewImgData, setViewImgData] = useState("");
    const [imgView, setImgView] = useState(false);
    const [CompanyName, setCompanyName] = useState('');
    const [CompanyNameError, setCompanyNameError] = useState('');
    const [Email, setEmail] = useState('');
    const [EmailError, setEmailError] = useState('');
    const [MobileNumber, setMobileNumber] = useState('');
    const [MobileNumberError, setMobileNumberError] = useState('');
    const [CallerIdNumber, setCallerIdNumber] = useState('');
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
    const user_data = useSelector(state => state.userRedux.user_data);
    const apiUpdateAdminComapnyInfo = useSelector(state => state.userRedux.apiUpdateAdminComapnyInfo);
    const apiGetUserDetails = useSelector(state => state.userModuleRedux.apiGetUserDetails);
    const isLoading = useSelector(state => state.userModuleRedux.isLoader);
    const isLoading2 = useSelector(state => state.userRedux.isLoader);


    const user_details = useSelector(state => state.userModuleRedux.user_details);


    const callAllApi = async () => {
        GetUserDetails()
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
    // get user Detsils
    useEffect(() => {
        Log('apiGetUserDetails :', apiGetUserDetails);
        if (apiGetUserDetails == STATUS_FULFILLED) {
            if (user_details !== null) {
                Log("user_details :", user_details)
                setCompanyName(user_details?.company_data?.company_name)
                setEmail(user_details?.company_data?.company_email)
                setMobileNumber(user_details?.company_data?.company_phone_number)
                setCompanyAddress(user_details?.company_data?.company_address+ " " +user_details?.company_data?.company_address2)
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

     //update company profile
     useEffect(() => {
        Log('apiUpdateAdminComapnyInfo :', apiUpdateAdminComapnyInfo);
        if (apiUpdateAdminComapnyInfo == STATUS_FULFILLED) {
            goBack()
        } else if (apiUpdateAdminComapnyInfo == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateAdminComapnyInfo]);
    const handleProfile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: false
            });
            const maxSize = 10 * 1024 * 1024;
            console.log("result: ", result)
            setProfileImg(result)
            setProfileImgURI(result[0]?.uri)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    }
    
    const onCompanyProfileUpdate = () => {
        const errors = {};
        // if (CompanyName.trim() == "") {
        //     errors.companyNameError = "* Please enter a company name ";
        // }

        if (Email.trim() == "") {
            errors.emailError = "* Please enter a email address";
        }


        if (MobileNumber.trim() == "") {
            errors.phoneNumberError = "* Please enter a phone number";
        }
        if (CompanyAddress === null) {
          errors.companyAddressError = "* Please enter a address";
        }
        // if (Apartment === "") {
        //     errors.apartment = "* Please enter a suite/apt";
        //   }
        //   if (StreetName === "") {
        //     errors.streetName = "* Please enter a streetName";
        //   }
        if (City === "") {
          errors.cityError = "* Please enter a City";
        }
    
        if (State === '') {
          errors.stateError = '* Please enter a State';
        }
        if (Object.keys(errors).length > 0) {
          setCompanyNameError(errors.companyNameError || "");
          setEmailError(errors.emailError || "");
          setMobileNumberError(errors.phoneNumberError || "");
          setCompanyAddressError(errors.companyAddressError || "");
        //   setApartmentError(errors.apartment || "");
        //   setStreetNameError(errors.streetName || "");
          setCityError(errors.cityError || "");
          setStateError(errors.stateError || "");
          console.log("error: " , errors)
        } else {
            let body = new FormData();
            body.append('company_uuid', user_details?.company_data?.company_uuid)
            body.append('company_profile',user_details?.company_data?.company_logo )
            body.append('locality', "")
            body.append('company_phone_number', MobileNumber)
            body.append('company_address', CompanyAddress)
            body.append('company_address2', "")
            body.append('city', City)
            body.append('state', State)
            body.append('postal_code', PostalCode)
            body.append('createdby', user_data?.data?.user_uuid)
            body.append('main_uuid', user_data?.data?.main_uuid)
            body.append('user_uuid', user_data?.data?.user_uuid)
            body.append('company_email', Email)
            if (ProfileImg !== null) {
                for (let i = 0; i < ProfileImg.length; i++) {
                    body.append('file', ProfileImg[i]);
                }
                body.append('fileName', ProfileImg[0]?.name)
            }
            else {

                body.append('file', "")
                body.append('fileName', "")
            }
            dispatch(Update_Admin_Company_Info(body))
            console.log(body)
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
                        <Text style={styles.ProfileHeaderText}>{"Company Profile"}</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                    <TouchableOpacity onPress={() =>{
                         setImgView(true)
                         setViewImgData(ProfileImURI)
                    }} style={{
                        padding: 2, borderRadius: 100, borderWidth: 1, borderColor: greenPrimary, backgroundColor: paleGreen,
                        alignSelf: "center", marginTop: 14, marginBottom: 8, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.20,
                        shadowRadius: 1.41,

                        elevation: 2,
                    }}>
                        <Image
                            style={{ width: 75, height: 75, borderRadius: 100 }}
                            source={{ uri: ProfileImURI }}
                        />
                        <TouchableOpacity onPress={() => { handleProfile() }}
                            style={{
                                backgroundColor: paleGreen,
                                padding: 4, borderRadius: 100, position: "absolute", bottom: -4, right: -2, shadowColor: greenPrimary,
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,

                                elevation: 2,
                            }}>
                            <Icon name={"camera"} size={20} color={greenPrimary} />

                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.textInputLabel}>{"Company Name"}</Text>
                        <TextInput
                            editable={false}
                            value={CompanyName}
                            placeholder='Company Name'
                            placeholderTextColor={grey01}
                            style={styles.textInputStyle}
                            onChangeText={(txt) => {
                                setCompanyName(txt)
                                if (txt.length > 0) {
                                    setCompanyNameError("")
                                }
                            }}
                        />
                        {CompanyNameError !== "" && <Text style={styles.errorText}>{CompanyNameError}</Text>}
                    </View>
                    <View>
                        <Text style={styles.textInputLabel}>{"Email"}</Text>
                        <TextInput
                            value={Email}
                            placeholder='Email Address'
                            placeholderTextColor={grey01}
                            style={styles.textInputStyle}
                            onChangeText={(txt) => {
                                setEmail(txt)
                                if (txt.length > 0) {
                                    setEmailError("")
                                }
                            }}
                        />
                        {EmailError !== "" && <Text style={styles.errorText}>{EmailError}</Text>}
                    </View>
                    <View>
                        <Text style={styles.textInputLabel}>{"Phone Number"}</Text>
                        <TextInput
                            keyboardType='decimal-pad'
                            value={MobileNumber}
                            placeholder='Phone Number'
                            placeholderTextColor={grey01}
                            style={styles.textInputStyle}
                            onChangeText={(txt) => {
                                setMobileNumber(txt)
                                if (txt.length > 7 && txt.length < 12) {
                                    setMobileNumberError("");
                                }
                                else {
                                    setMobileNumberError("* Please enter a valid phone number");

                                }
                            }}
                        />
                        {MobileNumberError !== "" && <Text style={styles.errorText}>{MobileNumberError}</Text>}
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20, }}>

                    <Text style={{
                        fontSize: FontSize.FS_12,
                        color: black,
                        fontFamily: SEMIBOLD,
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
                    {/* <View>
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
                    </View> */}
                    {/* <View>
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
                    </View> */}
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
                <TouchableOpacity onPress={() => {
                    onCompanyProfileUpdate()
                }}
                    style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 30, marginHorizontal: 20 }}>
                    <Text style={{
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: SEMIBOLD
                    }}>{"Update Comapny Profile"}</Text>
                </TouchableOpacity>
                <ImageView
                    animationType={"fade"}
                    images={[{ uri: viewImgData }]}
                    imageIndex={0}
                    visible={imgView}
                    onRequestClose={() => setImgView(false)}
                />
            </ScrollView>
                           {(isLoading || isLoading2) && <LoadingView />}


        </SafeAreaView>
    );
};

export default CompanyProfile;

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
    textInputLabel: {
        fontSize: FontSize.FS_13,
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
    errorText: {
        fontFamily: REGULAR,
        fontSize: FontSize.FS_10,
        color: red,
        marginTop:2
      },
});
