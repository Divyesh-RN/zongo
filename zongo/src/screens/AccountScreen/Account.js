import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { navigate, resetScreen } from '../../navigation/RootNavigation';
import { red, white, grey, black, disableColor, offWhite } from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontSize, MEDIUM, SEMIBOLD } from '../../constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { storeData } from '../../commonComponents/AsyncManager';
import { USER_DATA } from '../../constants/ConstantKey';
import { storeUserData } from '../../redux/reducers/userReducer';

const Account = () => {
  const [UserData, setUserData] = useState(null);
  const dispatch = useDispatch()
  const [Role, setRole] = useState("");
  const user_data = useSelector(state => state.userRedux.user_data);

  useEffect(() => {
    if (user_data !== null) {
      setRole(user_data?.data?.role)
    }
  }, [user_data])


  const hadnleLogout = (item) => {
    Alert.alert(
        //title
        "Alert",
        //body
        'Are you sure want to logout?',
        [
            {
                text: 'No',
                onPress: () => {}, style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: () => {
                    storeData(USER_DATA, null, () => {
                        dispatch(storeUserData(null));
                        resetScreen('Login');
                    });
                }
            },
        ],
        { cancelable: true },
        //clicking out side of alert will not cancel
    );
}
  return (
    <>
      <HeaderView
        title={UserData?.data?.first_name + ' ' + UserData?.data?.last_name}
        isProfilePic={true}
        imgUri={
          'https://www.shareicon.net/data/512x512/2016/05/24/770137_man_512x512.png'
        }
        onPressProfile={() => {
          Log('Profile');
        }}
        onPressSearch={() => {

        }}
        containerStyle={{
          paddingHorizontal: pixelSizeHorizontal(20),
        }}>
        <View style={{  marginTop: 10 }}>
          <TouchableOpacity onPress={() => {
            navigate("UserProfile")
          }} style={styles.rowContainer}>
            <View style={styles.row}>
              <View style={styles.rowRoundIcon}>
                <Icon name="account" size={18} color={white} />
              </View>
              <View>
                <Text style={styles.rowTitleText}>{'User Profile'}</Text>
                <Text style={styles.rowSubTitleText}>{'• Edit user profile'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigate("ChangePassword")
          }} style={styles.rowContainer}>
            <View style={styles.row}>
              <View style={[styles.rowRoundIcon, { backgroundColor: "#3876BF", }]}>
                <Icon name="lock-outline" size={18} color={white} />
              </View>
              <View>
                <Text style={styles.rowTitleText}>{'Change Password'}</Text>
                <Text style={styles.rowSubTitleText}>{'• Password Change'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigate("E911User")
          }} style={styles.rowContainer}>
            <View style={styles.row}>
              <View style={[styles.rowRoundIcon, { backgroundColor: "#DF826C", }]}>
                <Icon name="map-marker-account-outline" size={18} color={white} />
              </View>
              <View>
                <Text style={styles.rowTitleText}>{'E911'}</Text>
                <Text style={styles.rowSubTitleText}>{'• E911 address'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {Role == "admin" && <TouchableOpacity onPress={() => {
            navigate("CompanyProfile")
          }} style={styles.rowContainer}>
            <View style={styles.row}>
              <View style={[styles.rowRoundIcon, { backgroundColor: "#7BD3EA", }]}>
                <Icon name="domain" size={18} color={white} />
              </View>
              <View>
                <Text style={styles.rowTitleText}>{'Company Profile'}</Text>
                <Text style={styles.rowSubTitleText}>{'• Edit company profile'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          }
          {Role == "admin" && <TouchableOpacity onPress={() => {
                    navigate("CompanySignatature")
                }} style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={[styles.rowRoundIcon, { backgroundColor: "#265073", }]}>
                            <Icon name="draw-pen" size={18} color={white} />
                        </View>
                        <View>
                            <Text style={styles.rowTitleText}>{'Company Signature'}</Text>
                            <Text style={styles.rowSubTitleText}>{'• Edit company signature'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                }

        </View>

        <TouchableOpacity onPress={() => {
          hadnleLogout()
        }}
          style={styles.logoutRowCOntainer}>
          <MaterialIcons name="logout" size={18} color={red} />
          <Text style={styles.logoutText}>{"Logout"} </Text>
        </TouchableOpacity>
      </HeaderView>
      {/* {isLoading && <LoadingView />} */}

    </>
  )
}

export default Account

const styles = StyleSheet.create({
  logoutRowCOntainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 12,
  },
  logoutText: {
    fontSize: FontSize.FS_12,
    color: red,
    fontFamily: MEDIUM,
    marginHorizontal: 10,
  },
  rowSubTitleText: {
    fontSize: FontSize.FS_10,
    color: grey,
    fontFamily: MEDIUM,
    marginLeft: 10
    ,
  },
  rowTitleText: {
    fontSize: FontSize.FS_14,
    color: black,
    fontFamily: MEDIUM,
    marginLeft: 10
    ,
  },
  rowRoundIcon: {
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: "#ADBC9F",
    alignItems: "center",
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    marginHorizontal: -20,
    borderBottomWidth: 0.5,
    borderBottomColor: disableColor
    ,
  },
  ProfileHeaderText: {
    fontSize: FontSize.FS_17,
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
  container: {
    backgroundColor: offWhite,
    flex: 1
    ,
  },

});
