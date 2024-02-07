import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Platform, Dimensions, TouchableOpacity, ImageBackground, Alert
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  bgColor01,
  black,
  black03,
  black05,
  darkGrey,
  disableColor,
  greenPrimary,
  grey, grey01, grey02, light_grey, midGreen, paleGreen, paleGreen01, transparent, white, yellow
} from '../../constants/Color';
import { ic_call_bg, ic_call_bg_sm, ic_ellipse_big, ic_ellipse_small } from '../../constants/Images';
import Translate from '../../translation/Translate';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import * as Yup from 'yup';
import PrimaryButton from '../../commonComponents/PrimaryButton';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { navigate } from '../../navigation/RootNavigation';
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { useFocusEffect } from '@react-navigation/native';
import { resetGeneralApiStatus } from '../../redux/reducers/generalReducer';
import { Get_Plan_List } from '../../redux/api/Api';
import LoadingView from '../../commonComponents/LoadingView';

const WIDTH = Dimensions.get('window').width

const Register = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [PlanList, setPlanList] = useState([]);
  const [Index, setIndex] = useState(0);
  const [SelectPlan, setSelectPlan] = useState(0);

  const LoginSchema = Yup.object().shape({
    EMAIL: Yup.string()
      .email('* Please enter a valid email')
      .required('* Please enter an email'),

    PASSWORD: Yup.string()
      .min(6, '* Password must be at least 6 characters')
      .required('* Please enter a password'),
  });

  const dispatch = useDispatch();
  const apiGetAllPlanList = useSelector(state => state.generalRedux.apiGetAllPlanList);
  const plan_list = useSelector(state => state.generalRedux.plan_list);

  const isLoading = useSelector(state => state.generalRedux.isLoader);
  const isError = useSelector(state => state.generalRedux.isError);
  const error_message = useSelector(state => state.generalRedux.error_message);
  const user_data = useSelector(state => state.userRedux.user_data);

  const GetPlanList = () => {
    dispatch(Get_Plan_List())
  }

  useFocusEffect(
    useCallback(() => {

      GetPlanList()
      return () => {
        dispatch(resetGeneralApiStatus())
      };
    }, [])
  );


  useEffect(() => {
    Log('apiGetAllPlanList :', apiGetAllPlanList);
    if (apiGetAllPlanList == STATUS_FULFILLED) {
      setPlanList(plan_list)
    } else if (apiGetAllPlanList == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiGetAllPlanList]);

  const quarterlyPlans = {
    0: [
      "Google, Microsoft apps, and access to APIs",
      "Unlimited domestic calling*",
      "SMS and MMS",
      "IVR",
      "Single sign-on",
      "Analytics for IT administrations"
    ],
    1: [
      "Unlimited domestic calling*",
      "IVR",
      "SMS and MMS",
      "Google, Microsoft apps, and access to APIs",
      "Single sign-on",
      "Analytics for IT administrations"
    ],
    2: [
      "Unlimited domestic calling*",
      "SMS and MMS",
      "IVR",
      "Google, Microsoft apps, and access to APIs",
      "Analytics for IT administrations",
      "Single sign-on",

    ],
    // Add additional quarterly plans as needed
  };

  const annualPlans = {
    0: [
      "Unlimited domestic calling*",
      "IVR",
      "SMS and MMS",
      "Google, Microsoft apps, and access to APIs",
      "Single sign-on",
      "Analytics for IT administrations"
    ],
    1: [
      "Unlimited domestic calling*",
      "SMS and MMS",
      "IVR",
      "Google, Microsoft apps, and access to APIs",
      "Analytics for IT administrations",
      "Single sign-on",
    ],
    2: [
      "Unlimited domestic calling*",
      "IVR",
      "Google, Microsoft apps, and access to APIs",
      "Single sign-on",
      "SMS and MMS",
      "Analytics for IT administrations"
    ],
    // Add additional annual plans as needed
  };


  const renderBenefits = (benefits) => {
    return benefits.map((benefit, index) => (

      <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="check-circle" size={14} color={black} />
        <Text style={styles.planBenifitText}>{benefit}</Text>
      </View>
    ));
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

          <View style={styles.ellipsesContainer}>
            <Image source={ic_ellipse_big} style={styles.ellipseBig} />
          </View>
          <View style={styles.ellipsesContainer}>
            <Image source={ic_ellipse_small} style={styles.ellipseSmall} />
          </View>
          <View style={{ alignItems: 'center', marginTop: Platform.OS == 'android' ? WIDTH / 1.8 : '45%', }}>
            <Text style={styles.welcomeTextLogin}>
              {"Sign up your account"}
            </Text>
            {/* {plan_list !== null && */}
              <ImageBackground resizeMode='contain' source={ic_call_bg_sm} style={{ flex: 1, }} borderRadius={8}>
                <View style={{ borderWidth: 1, borderColor: greenPrimary, width: WIDTH - 40, borderRadius: 8, paddingBottom: 14, marginTop: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", borderRadius: 8, borderWidth: 1, borderColor: black, marginHorizontal: 8, marginVertical: 10, justifyContent: "center", padding: 3 }}>
                    <TouchableOpacity onPress={() => { setIndex(0) }} style={{ backgroundColor: Index == 0 ? black : white, paddingVertical: 6, borderRadius: 8, width: "49%", alignItems: "center" }}>
                      <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_11, color: Index == 0 ? white : black }}>{"QUARTERLY"}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1.5, height: 24, backgroundColor: black, marginHorizontal: 2 }}></View>
                    <TouchableOpacity onPress={() => { setIndex(1) }} style={{ backgroundColor: Index == 1 ? black : white, paddingVertical: 6, borderRadius: 8, width: "49%", alignItems: "center" }}>
                      <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_11, color: Index == 1 ? white : black }}>{"ANNUAL"}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 8, marginVertical: 10 }}>

                    <TouchableOpacity onPress={() => { setSelectPlan(0) }}
                      style={{ borderWidth: 1, borderColor: SelectPlan == 0 ? greenPrimary : grey, borderRadius: 8, padding: 4, flex: 1, paddingBottom: 20 }}>

                      <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_11, color: white, backgroundColor: SelectPlan == 0 ? greenPrimary : grey, paddingVertical: 7, paddingHorizontal: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8, textAlign: "center" }}>{"Core"}</Text>
                    {PlanList.length > 0 &&  <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_15, color: black, textAlign: "center", marginTop: 10 }}>{"$ " + PlanList[0]?.final_price * (Index == 0 ? 3 : 11) + ".00"}</Text> }
                      <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_09, color: black, textAlign: "center", marginTop: 10 }}>{"user/month - \npaid/quarterly"}</Text>
                      <View style={{ marginTop: 10, marginHorizontal: 2 }}>
                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_09, color: white, backgroundColor: transparent, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, textAlign: "center" }}>{""}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setSelectPlan(1) }}
                      style={{ borderWidth: 1, borderColor: SelectPlan == 1 ? greenPrimary : grey, borderRadius: 8, padding: 4, flex: 1, marginHorizontal: 8, paddingBottom: 20 }}>


                      <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_11, color: white, backgroundColor: SelectPlan == 1 ? greenPrimary : grey, paddingVertical: 7, paddingHorizontal: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8, textAlign: "center" }}>{"Advance"}</Text>
                      {PlanList.length > 0 &&   <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_15, color: black, textAlign: "center", marginTop: 10 }}>{"$ " + PlanList[1]?.final_price * (Index == 0 ? 3 : 11) + ".00"}</Text>}
                      <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_10, color: black, textAlign: "center", marginTop: 10 }}>{"user/month - \npaid/quarterly"}</Text>
                      <View style={{ marginTop: 10, marginHorizontal: 2 }}>
                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_09, color: white, backgroundColor: yellow, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, textAlign: "center" }}>{"Most Popular"}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setSelectPlan(2) }}
                      style={{ borderWidth: 1, borderColor: SelectPlan == 2 ? greenPrimary : grey, borderRadius: 8, padding: 4, flex: 1, paddingBottom: 20 }}>

                      <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_11, color: white, backgroundColor: SelectPlan == 2 ? greenPrimary : grey, paddingVertical: 7, paddingHorizontal: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8, textAlign: "center" }}>{"Ultra"}</Text>
                      {PlanList.length > 0 &&   <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_15, color: black, textAlign: "center", marginTop: 10 }}>{"$ " + PlanList[2]?.final_price * (Index == 0 ? 3 : 11) + ".00"}</Text>}
                      <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_10, color: black, textAlign: "center", marginTop: 10 }}>{"user/month - \npaid/quarterly"}</Text>
                      <View style={{ marginTop: 10, marginHorizontal: 2 }}>
                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_09, color: white, backgroundColor: midGreen, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, textAlign: "center" }}>{"Best Value"}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Index == 0 ? black : white, marginRight: 4 }}></View>
                    <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Index == 1 ? black : white }}></View>
                  </View>
                  <View style={{ alignSelf: "flex-start", margin: 20 }}>


                    {Index === 0 && renderBenefits(quarterlyPlans[SelectPlan])}
                    {Index === 1 && renderBenefits(annualPlans[SelectPlan])}
                  </View>
                </View>

              </ImageBackground>
            {/* } */}
            <View style={{ marginTop: 20, width: WIDTH - 40 }}>
              <PrimaryButton onPress={() => { navigate("ContactInformation", { plan_type: SelectPlan }) }} text="next" />
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.doNotHaveText}>{Translate.t("already_account")}
                <Text onPress={() => {
                  navigate("Login")
                }} style={styles.registerNowText}>{Translate.t("sign_in_small")}</Text></Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      {isLoading && <LoadingView />}
    </>
  );
};
const styles = StyleSheet.create({
  planBenifitText: {
    marginLeft: 6,
    marginTop: 2,
    fontFamily: MEDIUM,
    fontSize: FontSize.FS_12,
    color: black,
  },
  Hstack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14
  },
  appleSquare: {
    backgroundColor: white,
    borderWidth: 1,
    width: 60,
    height: 60,
    borderColor: grey,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goggleSquare: {
    backgroundColor: white,
    borderWidth: 1,
    width: 60,
    height: 60,
    borderColor: greenPrimary,
    borderRadius: 6,
    marginHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbSquare: {
    backgroundColor: white,
    borderWidth: 1,
    width: 60,
    height: 60,
    borderColor: '#068cf1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orContainer: {
    width: 40,
    height: 40,
    backgroundColor: white,
    borderWidth: 1,
    borderColor: disableColor,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: bgColor01,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: bgColor01,
  },
  ellipsesContainer: {
    position: 'absolute',
  },
  ellipseBig: {
    width: WIDTH - 145,
    height: Platform.OS == 'ios' ? WIDTH - 180 : WIDTH - 195,
    resizeMode: 'contain',
  },
  ellipseSmall: {
    width: WIDTH,
    height: WIDTH / 2.4,
    resizeMode: 'contain',
    marginLeft: '15%',
  },
  welcomeTextLogin: {
    fontSize: FontSize.FS_16,
    color: black,
    fontFamily: SEMIBOLD,
    textTransform: "uppercase"
  },
  errorText: {
    fontFamily: REGULAR,
    fontSize: FontSize.FS_10,
    color: 'red',
  },
  Termtext: {
    color: darkGrey,
    fontSize: FontSize.FS_14,
    fontFamily: REGULAR,
    textAlign: 'left',
    marginLeft: 6
  },
  or: {
    color: darkGrey,
    fontSize: FontSize.FS_14,
    fontFamily: MEDIUM,
  },
  doNotHaveText: {
    color: darkGrey,
    fontSize: FontSize.FS_16,
    fontFamily: REGULAR,
  },
  registerNowText: {
    color: midGreen,
    fontSize: FontSize.FS_16,
    fontFamily: SEMIBOLD,
  }
});

export default Register;
