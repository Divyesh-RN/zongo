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
    black, greenPrimary, grey, grey01, grey02, light_grey, midGreen, paleGreen, red, transparent, white
  } from '../../constants/Color';
  import { BOLD, FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
  import * as Yup from 'yup';
  import Icon from "react-native-vector-icons/MaterialCommunityIcons";
  import { Log } from '../../commonComponents/Log';
  import { useDispatch, useSelector } from 'react-redux';
  import { QUARTELY, STATUS_FULFILLED, STATUS_REJECTED, ANNUAL, REACT_APP_GOOGLE_API_KEY } from '../../constants/ConstantKey';
  import { useFocusEffect } from '@react-navigation/native';
  import { resetGeneralApiStatus } from '../../redux/reducers/generalReducer';
  import { Check_User_Email, Get_Plan_List } from '../../redux/api/Api';
  import LoadingView from '../../commonComponents/LoadingView';
  import ProgressSteps from '../../commonComponents/ProgressStep/ProgressSteps';
  import ProgressStep from '../../commonComponents/ProgressStep/ProgressStep';
  import { Dropdown } from 'react-native-element-dropdown';
  import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
  
  const WIDTH = Dimensions.get('window').width
  const ContactInformation = ({ route }) => {
  
    // second step
    const [FirstName, setFirstName] = useState('t');
    const [FirstNameError, setFirstNameError] = useState('');
    const [LastName, setLastName] = useState('t');
    const [LastNameError, setLastNameError] = useState('');
    const [Email, setEmail] = useState('rnjcg124@gmail.com');
    const [EmailError, setEmailError] = useState('');
    const [Mobile, setMobile] = useState('12345678');
    const [MobileError, setMobileError] = useState('');
    const [JobTitle, setJobTitle] = useState('a');
    const [JobTitleError, setJobTitleError] = useState('');
    const [Department, setDepartment] = useState("Sles");
    const [DepartmentError, setDepartmentError] = useState("");
    const [ValidSecondStep, setValidSecondStep] = useState(false);
  
    // third step
    const [CompanyName, setCompanyName] = useState('zongo');
    const [CompanyNameError, setCompanyNameError] = useState('');
    const [Industry, setIndustry] = useState('it');
    const [IndustryError, setIndustryError] = useState('');
    const [CompanyType, setCompanyType] = useState('llc');
    const [CompanyTypeError, setCompanyTypeError] = useState('');
    const [CompanyAddressManual, setCompanyAddressManual] = useState(false);
    const [CompanyAddress, setCompanyAddress] = useState(null);
    const [CompanyAddressError, setCompanyAddressError] = useState('');
    const [Apartment, setApartment] = useState('apt');
    const [ApartmentError, setApartmentError] = useState('');
    const [City, setCity] = useState('amd');
    const [CityError, setCityError] = useState('');
    const [State, setState] = useState('');
    const [StateError, setStateError] = useState('');
    const [PostalCode, setPostalCode] = useState('362030');
    const [PostalCodeError, setPostalCodeError] = useState('');
  
  
    const [ValidThirdStep, setValidThirdStep] = useState(false);
  
  
  
  
    const [Index, setIndex] = useState(0);
    const [PlanType, setPlanType] = useState("");
    const [TotalUser, setTotalUser] = useState(1);
    const ref = useRef(null);
    const LoginSchema = Yup.object().shape({
      EMAIL: Yup.string()
        .email('* Please enter a valid email')
        .required('* Please enter an email'),
  
      PASSWORD: Yup.string()
        .min(6, '* Password must be at least 6 characters')
        .required('* Please enter a password'),
    });
  
    const dispatch = useDispatch();
    const apiCheckUserEmail = useSelector(state => state.userRedux.apiCheckUserEmail);
    const plan_list = useSelector(state => state.generalRedux.plan_list);
  
    const isLoading = useSelector(state => state.userRedux.isLoader);
    const isError = useSelector(state => state.userRedux.isError);
    const error_message = useSelector(state => state.userRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);
  
  
    useFocusEffect(
      useCallback(() => {
        WhichPLan(route?.params?.plan_type)
        return () => {
          dispatch(resetGeneralApiStatus())
        };
      }, [])
    );
  
    const WhichPLan = (plan) => {
      if (plan == 0) {
        setPlanType("Core")
      }
      else if (plan == 1) {
        setPlanType("Advance")
      }
      else {
        setPlanType("Ultra")
      }
    }
  
    const PerUserPrice = () => {
      if (PlanType == "Core") {
        return plan_list?.[0]?.final_price
      }
      else if (PlanType == "Advance") {
        return plan_list?.[1]?.final_price
      }
      else {
        return plan_list?.[2]?.final_price
      }
  
    }
  
    useEffect(() => {
      Log('apiCheckUserEmail :', apiCheckUserEmail);
      if (apiCheckUserEmail == STATUS_FULFILLED) {
        setValidSecondStep(false)
      } else if (apiCheckUserEmail == STATUS_REJECTED) {
        if (isError) {
          Alert.alert('Alert', error_message);
        }
      }
    }, [apiCheckUserEmail]);
  
    const data = [
      { label: 'Executive', value: 'Executive' },
      { label: 'Sales', value: 'Sales' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'HR', value: 'HR' },
      { label: 'Development', value: 'Development' },
      { label: 'Support', value: 'Support' },
      { label: 'Other', value: 'Other' },
    ];
  
    const company_type = [
      { label: 'Corporation', value: 'corporation' },
      { label: 'LLC', value: 'llc' },
      { label: 'Non-Profit', value: 'non_profit' },
      { label: 'Sole Prop', value: 'sole_prop' },
    ];
  
    const renderNumber = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value == Number && (
            <Icon name="check" size={18} color={black} />
          )}
        </View>
      );
    };
  
  
    const onNextStepTwo = () => {
      const errors = {};
  
      if (FirstName === "") {
        errors.firstNameError = "*Please enter a first name";
      }
  
      if (LastName === "") {
        errors.lastNameError = "*Please enter a last name";
      }
  
      if (Email === "") {
        errors.emailError = "*Please enter an email address";
      }
  
      if (Mobile === "") {
        errors.mobileError = "*Please enter a phone number";
      }
  
      if (JobTitle === "") {
        errors.jobTitleError = "*Please enter a job title";
      }
  
      if (Department === "") {
        errors.departmentError = "*Please select a department";
      }
  
      if (Object.keys(errors).length > 0) {
        console.log("Validation errors:", errors);
        setFirstNameError(errors.firstNameError || "");
        setLastNameError(errors.lastNameError || "");
        setEmailError(errors.emailError || "");
        setMobileError(errors.mobileError || "");
        setJobTitleError(errors.jobTitleError || "");
        setDepartmentError(errors.departmentError || "");
        setValidSecondStep(true);
      } else {
        var dict = {
          department: Department,
          email: Email,
          first_name: FirstName,
          job_title: JobTitle,
          last_name: LastName,
          phone: Mobile,
        };
  
        dispatch(Check_User_Email(dict));
        setValidSecondStep(false);
      }
    };
  
  
    const onNextStepThird = () => {
      const errors = {};
  
      if (CompanyName === "") {
        errors.companyNameError = "*Please enter a company name";
      }
  
      if (Industry === "") {
        errors.industryError = "*Please enter an industry name";
      }
  
      if (CompanyType === "") {
        errors.companyTypeError = "*Please select a company type";
      }
  
      if (CompanyAddress === null) {
        errors.companyAddressError = "*Please enter an address";
      }
  
      if (Apartment === "") {
        errors.apartmentError = "*Please enter a Suite/Apt";
      }
  
      if (City === "") {
        errors.cityError = "*Please enter a City";
      }
  
      if (State === '') {
        errors.stateError = '*Please enter a State';
      }
  
      if (PostalCode === "") {
        errors.postalCodeError = "*Please enter a Postal Code";
      }
  
      if (Object.keys(errors).length > 0) {
        console.log("Validation errors:", errors);
        setCompanyNameError(errors.companyNameError || "");
        setIndustryError(errors.industryError || "");
        setCompanyTypeError(errors.companyTypeError || "");
        setCompanyAddressError(errors.companyAddressError || "");
        setApartmentError(errors.apartmentError || "");
        setCityError(errors.cityError || "");
        setStateError(errors.stateError || "");
        setPostalCodeError(errors.postalCodeError || "");
        setValidThirdStep(true);
      } else {
        console.log("ok company information", CompanyAddress);
        console.log("ok company information", typeof CompanyAddress);
        setValidThirdStep(false);
      }
    };
  
  
  
    return (
      <>
        <StatusBar
          translucent={true}
          barStyle={'light-content'}
          backgroundColor={transparent}
        />
        <ScrollView
          style={styles.container}
         contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.safeAreaView}> 
            <View style={{ alignItems: 'center', marginTop: '8%', }}>
              <View style={{ flex: 1 }}>
                <ProgressSteps>
                  <ProgressStep label="">
                    <View style={{ alignItems: 'center', }}>
                      <View >
                        <Text style={{
                          fontSize: FontSize.FS_13,
                          color: black,
                          fontFamily: SEMIBOLD,
                          marginLeft: 20,
                          marginBottom: 12
                        }}>{"How Many Users Do You Need?"}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}>
                          <TouchableOpacity onPress={() => {
                            if (TotalUser == 1) {
  
                            }
                            else {
                              setTotalUser(TotalUser - 1)
                            }
                          }}
                            style={{ width: 34, height: 34, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: TotalUser == 1 ? grey : midGreen, borderColor: paleGreen, borderRadius: 50 }}>
                            <Icon name="minus" size={20} color={white} />
                          </TouchableOpacity>
                          <Text style={{
                            backgroundColor: midGreen,
                            paddingHorizontal: 40,
                            fontSize: FontSize.FS_14,
                            paddingVertical: 6,
                            borderRadius: 40,
                            color: white,
                            fontFamily: SEMIBOLD,
                            textAlign: "center",
                            marginHorizontal: 14
                          }}>{TotalUser}</Text>
                          <TouchableOpacity onPress={() => {
                            if (TotalUser == 100) {
  
                            }
                            else {
                              setTotalUser(TotalUser + 1)
                            }
                          }}
                            style={{ width: 34, height: 34, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: midGreen, borderColor: paleGreen, borderRadius: 50 }}>
                            <Icon name="plus" size={20} color={white} />
                          </TouchableOpacity>
  
                        </View>
                        <View style={{ backgroundColor: light_grey, borderWidth: 1, borderColor: grey02, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 20, margin: 20, width: WIDTH - 50 }}>
                          <Text style={{
                            fontSize: FontSize.FS_18,
                            color: black,
                            fontFamily: SEMIBOLD,
                            textAlign: "center",
                          }}>{PlanType}</Text>
                          <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: MEDIUM,
                            textAlign: "center",
                          }}>{"$ " + Math.floor(PerUserPrice()) + " /user/mont"}</Text>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                            <TouchableOpacity onPress={() => setIndex(0)}
                              style={{ backgroundColor: Index == 0 ? midGreen : transparent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                              <Text style={{
                                fontSize: FontSize.FS_12,
                                color: Index == 0 ? white : black,
                                fontFamily: SEMIBOLD,
                              }}>{"Quarterly"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIndex(1)}
                              style={{ backgroundColor: Index == 1 ? midGreen : transparent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                              <Text style={{
                                fontSize: FontSize.FS_12,
                                color: Index == 1 ? white : black,
                                fontFamily: SEMIBOLD,
                              }}>{"Annual"}</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, }}>
  
                            <View style={{ flexDirection: "row", alignItems: "center", }}>
                              <Text style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: MEDIUM,
                              }}>{TotalUser + (" user(s)")}</Text>
                              <View style={{ marginHorizontal: 6 }}>
                                <Icon name="close" size={16} color={black} />
                              </View>
                              <Text style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: MEDIUM,
                              }}>{"$ " + Math.floor(PerUserPrice())}</Text>
                            </View>
                            <Text style={{
                              fontSize: FontSize.FS_14,
                              color: black,
                              fontFamily: SEMIBOLD,
                              lineHeight: 24,
                            }}>{"$" + (PerUserPrice() * TotalUser).toFixed(2)}</Text>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
  
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Text style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: MEDIUM,
                              }}>{"$ " + (PerUserPrice() * TotalUser).toFixed(2)}</Text>
                              <View style={{ marginHorizontal: 6 }}>
                                <Icon name="close" size={16} color={black} />
                              </View>
                              <Text style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: MEDIUM,
                              }}>{(Index == 0 ? QUARTELY : ANNUAL) + " month(s)"}</Text>
                            </View>
                            <Text style={{
                              fontSize: FontSize.FS_14,
                              color: black,
                              fontFamily: SEMIBOLD,
                            }}>{"$ " + (PerUserPrice() * TotalUser).toFixed(2) * (Index == 0 ? QUARTELY : ANNUAL)}</Text>
                          </View>
                          <View style={{ height: 1, backgroundColor: grey, width: "100%", marginTop: 25 }}></View>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, marginBottom: 40 }}>
                            <Text style={{
                              fontSize: FontSize.FS_15,
                              color: black,
                              fontFamily: SEMIBOLD,
                            }}>{"Grand Total (USD)"}</Text>
                            <Text style={{
                              fontSize: FontSize.FS_15,
                              color: black,
                              fontFamily: BOLD,
                              lineHeight: 24,
                            }}>{"$ " + (PerUserPrice() * TotalUser).toFixed(2) * (Index == 0 ? QUARTELY : ANNUAL)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ProgressStep>
                  <ProgressStep onNext={() => onNextStepTwo()} errors={ValidSecondStep} label="">
                    <View style={{ marginHorizontal: 20 }}>
                      <Text style={styles.welcomeTextLogin}>
                        {"Contact Information"}
                      </Text>
                      <View style={{ marginTop: 20 }}>
                        <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"First Name"}</Text>
                          <TextInput
                            value={FirstName}
                            placeholder='Enter First Name'
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
                              setFirstName(txt)
                              if (txt.length > 0) {
                                setFirstNameError("")
                              }
                            }}
                          />
                          {FirstNameError !== "" && <Text style={styles.errorText}>{FirstNameError}</Text>}
                        </View>
                        <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Last Name"}</Text>
                          <TextInput
                            value={LastName}
                            placeholder='Enter Last Name'
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
                              setLastName(txt)
                              if (txt.length > 0) {
                                setLastNameError("")
                              }
                            }}
                          />
                          {LastNameError !== "" && <Text style={styles.errorText}>{LastNameError}</Text>}
                        </View>
                        <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Email"}</Text>
                          <TextInput
                            value={Email}
                            placeholder='Enter Email Address'
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
                              setEmail(txt)
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
                              if (txt.length > 0 && !emailRegex.test(txt)) {
                                setEmailError("* Please Enter a valid email address");
                              } else {
                                setEmailError("");
                              }
                            }}
                          />
                          {EmailError !== "" && <Text style={styles.errorText}>{EmailError}</Text>}
                        </View>
                        <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Phone Number"}</Text>
                          <TextInput
                            value={Mobile}
                            placeholder='Enter Phone Number'
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
                              setMobile(txt)
                              if (txt.length < 8 || txt.length > 12) {
                                setMobileError("* Please Enter a valid mobile number with 8 to 12 digits")
                              } else {
                                setMobileError("");
                              }
  
                            }}
                          />
                          {MobileError !== "" && <Text style={styles.errorText}>{MobileError}</Text>}
                        </View>
                        <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Job Title"}</Text>
                          <TextInput
                            value={JobTitle}
                            placeholder='Enter Job Title'
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
                              setJobTitle(txt)
                              if (txt.length > 0) {
                                setJobTitleError("")
                              }
                            }}
                          />
                          {JobTitleError !== "" && <Text style={styles.errorText}>{JobTitleError}</Text>}
                        </View>
                        <View style={{ marginBottom: 40 }}>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Department"}</Text>
  
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={data}
                            ref={ref}
                            maxHeight={100}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Department"
                            value={Department}
                            onChange={item => {
                              setDepartment(item?.value);
                              setDepartmentError("")
                            }}
                            renderItem={renderNumber}
                          />
  
                          {DepartmentError !== "" && <Text style={styles.errorText}>{DepartmentError}</Text>}
                        </View>
                      </View>
                    </View>
                  </ProgressStep>
                  <ProgressStep onNext={() => onNextStepThird()} errors={ValidThirdStep} label="">
                    <View style={{ marginHorizontal: 20 }}>
                      <Text style={styles.welcomeTextLogin}>
                        {"Business Information"}
                      </Text>
                      <View style={{ marginTop: 20 }}>
                        {/* <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Company Name"}</Text>
                          <TextInput
                            value={CompanyName}
                            placeholder='Enter Company Name'
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
                              setCompanyName(txt)
                              if (txt.length > 0) {
                                setCompanyNameError("")
                              }
                            }}
                          />
                          {CompanyNameError !== "" && <Text style={styles.errorText}>{CompanyNameError}</Text>}
                        </View>
                        <View>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Industry"}</Text>
                          <TextInput
                            value={Industry}
                            placeholder='Enter Industry Name'
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
                              setIndustry(txt)
                              if (txt.length > 0) {
                                setIndustryError("")
                              }
                            }}
                          />
                          {IndustryError !== "" && <Text style={styles.errorText}>{IndustryError}</Text>}
                        </View> */}
                        {/* <View style={{}}>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Company Type"}</Text>
  
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={company_type}
                            ref={ref}
                            maxHeight={100}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Company Type"
                            value={CompanyType}
                            onChange={item => {
                              setCompanyType(item?.value);
                              setCompanyTypeError("")
                            }}
                            renderItem={renderNumber}
                          />
  
                          {CompanyTypeError !== "" && <Text style={styles.errorText}>{CompanyTypeError}</Text>}
                        </View> */}
                        <View style={{ marginTop: 4,flexGrow:1 }}>
                          {/* <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12,
                          }}>{"Company Addess"}</Text> */}
                          {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 10 }}>
                            <Text style={{
                              fontSize: FontSize.FS_11,
                              color: grey,
                              fontFamily: MEDIUM,
  
                            }}>{"Enter manually"}</Text>
                            <TouchableOpacity onPress={() => { setCompanyAddressManual(!CompanyAddressManual) }}>
                              <Icon name={CompanyAddressManual == true ? "checkbox-marked" : "checkbox-blank-outline"} size={18} color={CompanyAddressManual == true ? greenPrimary : grey} />
                            </TouchableOpacity>
                          </View> */}
                          {CompanyAddressManual == false ? 
                          <GooglePlacesAutocomplete
                          // keyboardShouldPersistTaps='always'
                            fetchDetails={true}
                            placeholder='Enter Address'
                            getAddressText={(txt) => console.log("2", txt)}
                            setAddressText={(txt) => console.log("1", txt)}
                            onPress={(data, details = null) => {
                              // 'details' is provided when fetchDetails = true
                              console.log("s :", details);
                              console.log("d :", data);
                            }}
                            onFail={error => console.log(error)}
                            onNotFound={() => console.log('no results')}
                            query={{
                              key: REACT_APP_GOOGLE_API_KEY,
                              language: 'en',
                            }}
                            // predefinedPlaces={[
                            //   {
                            //     type: 'favorite',
                            //     description: 'Dominos Pizza',
                            //     geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
                            //   },
                            //   {
                            //     type: 'favorite',
                            //     description: 'Chicken Republic',
                            //     geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
                            //   },
                            // ]}
                            // listEmptyComponent={() => (
                            //   <View style={{flex: 1}}>
                            //     <Text>No results were found</Text>
                            //   </View>
                            // )}
                            // listViewDisplayed={false}
                            keepResultsAfterBlur={true}
                            styles={{
                              textInputContainer: {
                                backgroundColor: white,
  
                                // height: 38,
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
                              predefinedPlacesDescription: {
                                color: '#1faadb',
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
                        </View> */}
                        {/* <View style={{ marginBottom: 40 }}>
                          <Text style={{
                            fontSize: FontSize.FS_12,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 12, marginBottom: 8
                          }}>{"Postal code"}</Text>
                          <TextInput
                            value={PostalCode}
                            placeholder='Postal Code'
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
                              const requiredLength = 6;
                              if (txt.length > 0 && txt.length !== requiredLength) {
                                setPostalCodeError(`* Please enter a valid postal code with ${requiredLength} digits`);
                              } else {
                                setPostalCodeError(""); // Clear the error if the postal code is valid
                              }
                            }}
                          />
                          {PostalCodeError !== "" && <Text style={styles.errorText}>{PostalCodeError}</Text>}
                        </View> */}
                      </View>
                    </View>
                  </ProgressStep>
                  <ProgressStep label="">
                    <View style={{ alignItems: 'center' }}>
                      <Text>This is the content within step 3!</Text>
                    </View>
                  </ProgressStep>
                </ProgressSteps>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
        {isLoading && <LoadingView />}
      </>
    );
  };
  const styles = StyleSheet.create({
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
      height: 38,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: grey01,
      borderRadius: 6,
      padding: 12,
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
      fontFamily: MEDIUM
    },
    placeholderStyle: {
      fontSize: FontSize.FS_13,
      fontFamily: MEDIUM,
      color: grey01
    },
    selectedTextStyle: {
      fontSize: FontSize.FS_13,
      color: black,
      fontFamily: MEDIUM
  
    },
    iconStyle: {
      width: 18,
      height: 18,
      tintColor: grey01
    },
  });
  
  export default ContactInformation;
  