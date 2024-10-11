import React, { useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { black, greenPrimary, offWhite } from '@constants/Color';
import { resetScreen } from '@navigation/RootNavigation';
import { BOLD, FontSize, MEDIUM } from '@constants/Fonts';
import { getData, storeData } from '@commonComponents/AsyncManager';
import { SplashImg } from '@constants/Images';
import { useSelector, useDispatch } from 'react-redux';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@commonComponents/ResponsiveScreen';
import { USER_DATA } from '@constants/ConstantKey';
import { storeUserData } from '@redux/reducers/userReducer';
import { Log } from '../../commonComponents/Log';
import { changeIncomingAlertState } from '../../redux/reducers/userReducer';
import { navigate } from '../../navigation/RootNavigation';

const Splash = props => {

  const userData = useSelector(state => state.userRedux.user_data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeIncomingAlertState(false));

    setTimeout(() => {
      GetUserData();
    }, 2000);
  }, []);

  const GetUserData = () => {
    getData(USER_DATA, data => {
      Log('user_data splash: ' + JSON.stringify(data));
      if (data == null) {
        resetScreen('Login');

      } else {
        // storeData(USER_DATA, data, () => {
        //   dispatch(storeUserData(data));
        //   resetScreen('Home');
        // });

        if (data?.data?.role == "superadmin" || data?.data?.role == "admin") {
          storeData(USER_DATA, data, () => {
            dispatch(storeUserData(data));
            resetScreen('Home');
          });
        }
        else {
          if (data?.data?.is_did_done == "YES" &&
            data?.data?.is_e911_done == "YES" &&
            data?.data?.is_email_config_done == "YES" &&
            data?.data?.is_password_done == "YES") {
            storeData(USER_DATA, data, () => {
              dispatch(storeUserData(data));
              resetScreen('Home');
            });
          }
          else {
            storeData(USER_DATA, data, () => {
              dispatch(storeUserData(data));
            });
            var dict = {
              is_did_done: data?.data?.is_did_done,
              is_e911_done: data?.data?.is_e911_done,
              is_email_config_done: data?.data?.is_email_config_done,
              is_password_done: data?.data?.is_password_done
            }
            // navigate("UserOnBoarding", { onboarding_data: dict })
            resetScreen('Login');
          }
        }

      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={offWhite} />
      <View
        style={{
          flex: 1,
          backgroundColor: offWhite,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
        tintColor={greenPrimary}
          source={SplashImg}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: offWhite,
  },
  textView: {
    position: 'absolute',
    bottom: pixelSizeVertical(53),
    alignContent: 'flex-end',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  textName: {
    fontFamily: MEDIUM,
    fontSize: FontSize.FS_18,
    color: black,
    marginHorizontal: pixelSizeHorizontal(20),
  },
  txtWebsite: {
    color: greenPrimary,
    fontFamily: BOLD,
    marginTop: pixelSizeHorizontal(20),
    marginHorizontal: pixelSizeHorizontal(20),
    fontSize: FontSize.FS_18,
  },
});

export default Splash;
