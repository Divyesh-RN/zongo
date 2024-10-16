import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputView from '../../commonComponents/TextInputView';
import {
  bgColor01,
  black,
  darkGrey,
  disableColor,
  greenPrimary,
  grey,
  midGreen,
  transparent,
  white,
} from '../../constants/Color';
import {
  ic_ellipse_big,
  ic_ellipse_small,
  ic_facebook,
  ic_google,
} from '../../constants/Images';
import Translate from '../../translation/Translate';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PrimaryButton from '../../commonComponents/PrimaryButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate, resetScreen } from '../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuthApiStatus, storeUserData } from '../../redux/reducers/userReducer';
import {
  STATUS_FULFILLED,
  STATUS_REJECTED,
  TOKEN,
  USER_DATA,
} from '../../constants/ConstantKey';
import { Log } from '../../commonComponents/Log';
import { AuthLogin } from '../../redux/api/Api';
import LoadingView from '../../commonComponents/LoadingView';
import { storeData } from '../../commonComponents/AsyncManager';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const WIDTH = Dimensions.get('window').width;

const Login = () => {

  // const [Email, setEmail] = useState('ipnfullfullstack@gmail.com');
  // const [Password, setPassword] = useState('123456');

  // const [Email, setEmail] = useState('divyeshgajera1111@gmail.com');
  // const [Password, setPassword] = useState('Test@123');

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');


  const dispatch = useDispatch();

  const apiLoginStatus = useSelector(state => state.userRedux.apiLoginStatus);
  const isLoading = useSelector(state => state.userRedux.isLoader);
  const isError = useSelector(state => state.userRedux.isError);
  const error_message = useSelector(state => state.userRedux.error_message);
  const user_data = useSelector(state => state.userRedux.user_data);

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return () => {
      dispatch(resetAuthApiStatus());
    };
  }, []);

  useEffect(() => {
    Log('apiLoginStatus :', apiLoginStatus);
    if (apiLoginStatus == STATUS_FULFILLED) {
      console.log("error_message :", error_message)
      if (user_data?.status == 200) {
        if (user_data !== null) {
          console.log("user_data :", user_data?.data?.data)
          if (user_data?.data?.data?.role == "superadmin" || user_data?.data?.data?.role == "admin") {
            storeData(USER_DATA, user_data?.data, () => {
              dispatch(storeUserData(user_data?.data));
              resetScreen('Home');
            });
            storeData(TOKEN, user_data?.data?.token)
          }
          else {
            if (user_data?.data?.data?.is_did_done == "YES" &&
              user_data?.data?.data?.is_e911_done == "YES" &&
              user_data?.data?.data?.is_email_config_done == "YES" &&
              user_data?.data?.data?.is_password_done == "YES") {
              storeData(USER_DATA, user_data?.data, () => {
                dispatch(storeUserData(user_data?.data));
                resetScreen('Home');
              });
              storeData(TOKEN, user_data?.data?.token)
            }
            else {
              storeData(USER_DATA, user_data?.data, () => {
                dispatch(storeUserData(user_data?.data));
                // resetScreen('Home');
              });
              storeData(TOKEN, user_data?.data?.token)
              var dict = {
                is_did_done: user_data?.data?.data?.is_did_done,
                is_e911_done: user_data?.data?.data?.is_e911_done,
                is_email_config_done: user_data?.data?.data?.is_email_config_done,
                is_password_done: user_data?.data?.data?.is_password_done
              }
              var onboarding_data = {
                "is_did_done": "NO",
                "is_e911_done": "NO",
                "is_email_config_done": "NO",
                "is_password_done": "NO",
              }
              navigate("UserOnBoarding", { onboarding_data: dict })
            }

          }
        }


      }
      else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: Translate.t('alert'),
          textBody: user_data?.message,
          button: 'Ok',
          })
      }
    } else if (apiLoginStatus == STATUS_REJECTED) {
      if (isError) {
        Alert.alert('Alert', error_message);
      }
    }
  }, [apiLoginStatus]);

  const onLoginBtn = value => {
    //     var onboarding_data = {
    //       "is_did_done": "NO",
    //       "is_e911_done": "NO",
    //       "is_email_config_done": "NO",
    //       "is_password_done": "NO",
    //   }
    //     navigate("UserOnBoarding", { onboarding_data: onboarding_data })
    // return
    if (value !== '' && value !== undefined && value !== null) {
      if (
        (value?.EMAIL !== '' &&
          value?.EMAIL !== undefined &&
          value?.EMAIL !== null) ||
        (value?.PASSWORD !== '' &&
          value?.PASSWORD !== undefined &&
          value?.PASSWORD !== null)
      ) {
        var dict = {};
        (dict.email = value?.EMAIL), (dict.password = value?.PASSWORD);
        Log('LOGIN DICT', dict);

        dispatch(AuthLogin(dict));
      }
    }
  };

  

  const LoginSchema = Yup.object().shape({
    EMAIL: Yup.string()
      .email('* Please enter a valid email')
      .required('* Please enter an email'),

    PASSWORD: Yup.string()
      .min(6, '* Password must be at least 6 characters')
      .required('* Please enter a password'),
  });

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
        keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.ellipsesContainer}>
            <Image tintColor={greenPrimary} source={ic_ellipse_big} style={styles.ellipseBig} />
          </View>
          <View style={styles.ellipsesContainer}>
            <Image tintColor={greenPrimary} source={ic_ellipse_small} style={styles.ellipseSmall} />
          </View>
          <View
            style={{
              alignItems: 'center',
              marginTop: Platform.OS == 'android' ? WIDTH / 1.5 : '45%',
            }}>
            <Text style={styles.welcomeTextLogin}>
              {Translate.t('login_welcome_text')}
            </Text>
            <Formik
              enableReinitialize
              initialValues={{
                EMAIL: Email,
                PASSWORD: Password,
              }}
              validationSchema={LoginSchema}
              onSubmit={values => {
                onLoginBtn(values);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={{ marginTop: 20 }}>
                  <TextInputView
                    imageSource={'email'}
                    onChangeText={handleChange('EMAIL')}
                    onBlur={handleBlur('EMAIL')}
                    value={values.EMAIL}
                    placeholder={'Email Address'}
                    keyboardType={'email-address'}
                  />
                  {errors.EMAIL && touched.EMAIL && (
                    <Text style={styles.errorText}>{errors.EMAIL}</Text>
                  )}
                  <TextInputView
                    imageSource={'eye'}
                    onChangeText={handleChange('PASSWORD')}
                    onBlur={handleBlur('PASSWORD')}
                    value={values.PASSWORD}
                    placeholder={'Password'}
                    keyboardType={'default'}
                  />
                  {errors.PASSWORD && touched.PASSWORD && (
                    <Text style={styles.errorText}>{errors.PASSWORD}</Text>
                  )}
                  <Text
                    onPress={() => {
                      navigate('ForgetPassword');
                    }}
                    style={styles.forgetPasswordText}>
                    {Translate.t('forget_password')}
                  </Text>

                  <PrimaryButton onPress={handleSubmit} text="sign_in" />
                  {/* <PrimaryButton onPress={()=>{
                       navigate("Register")
                    }} text="sign_in" /> */}
                </View>
              )}
            </Formik>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 25,
                marginVertical: 15,
              }}>
              <View
                style={{
                  height: 1,
                  backgroundColor: disableColor,
                  flex: 1,
                }}></View>
              <View style={styles.orContainer}>
                <Text style={styles.or}>or</Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: disableColor,
                  flex: 1,
                }}></View>
            </View>
            <View style={styles.Hstack}>
              <View style={styles.fbSquare}>
                <Image
                  style={{ width: 33, height: 33 }}
                  resizeMode="contain"
                  source={ic_facebook}
                />
              </View>
              <View style={styles.goggleSquare}>
                <Image
                  style={{ width: 33, height: 33 }}
                  resizeMode="contain"
                  source={ic_google}
                />
              </View>
              <View style={styles.appleSquare}>
                <Icon name={'apple'} size={38} color={black} />
              </View>
            </View>
            <View style={{ marginVertical: 50 }}>
              <Text style={styles.doNotHaveText}>
                {Translate.t('dont_have_account')}
                <Text
                  onPress={() => {
                    navigate('Register');
                  }}
                  style={styles.registerNowText}>
                  {Translate.t('register_now')}
                </Text>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      {isLoading && <LoadingView />}
    </>
  );
};
const styles = StyleSheet.create({
  Hstack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
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
    top:-20
  },
  ellipseBig: {
    width: WIDTH - 145,
    height: Platform.OS == 'ios' ? WIDTH - 170 : WIDTH - 190,
    resizeMode: 'contain',
  },
  ellipseSmall: {
    width: WIDTH,
    height: WIDTH / 2.4,
    resizeMode: 'contain',
    marginLeft: '15%',
  },
  welcomeTextLogin: {
    fontSize: FontSize.FS_17,
    color: darkGrey,
    fontFamily: SEMIBOLD,
  },
  errorText: {
    fontFamily: REGULAR,
    fontSize: FontSize.FS_10,
    color: 'red',
  },
  forgetPasswordText: {
    color: darkGrey,
    fontSize: FontSize.FS_14,
    fontFamily: REGULAR,
    textAlign: 'right',
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
  },
});

export default Login;
