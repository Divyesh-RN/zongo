import { View, Text } from 'react-native'
import React, { useState } from 'react'
import HeaderView from '../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../commonComponents/ResponsiveScreen';
import LoadingView from '../../commonComponents/LoadingView';

const Email = () => {
  const [UserData, setUserData] = useState(null);
console.log("UserData",UserData)
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
      
      </HeaderView>
      {/* {isLoading && <LoadingView />} */}

    </>
  )
}

export default Email
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import BackgroundTimer from 'react-native-background-timer';

// const Email = () => {
//   const [isCheckedIn, setIsCheckedIn] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);

//   useEffect(() => {
//     return () => {
//       if (intervalId) {
//         BackgroundTimer.clearInterval(intervalId);
//       }
//     };
//   }, [intervalId]);

//   const handleCheckInOut = () => {
//     if (isCheckedIn) {
//       // Check out
//       BackgroundTimer.clearInterval(intervalId);
//       setIntervalId(null);
//     } else {
//       // Check in
//       const newIntervalId = BackgroundTimer.setInterval(() => {
//         setTimer((prevTimer) => prevTimer + 1);
//       }, 1000);
//       setIntervalId(newIntervalId);
//     }
//     setIsCheckedIn(!isCheckedIn);
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.timerText}>{formatTime(timer)}</Text>
//       <TouchableOpacity onPress={handleCheckInOut} style={styles.button}>
//         <Icon name={isCheckedIn ? 'logout' : 'login'} size={30} color="#fff" />
//         <Text style={styles.buttonText}>{isCheckedIn ? 'Check Out' : 'Check In'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timerText: {
//     fontSize: 48,
//     marginBottom: 20,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     marginLeft: 10,
//   },
// });

// export default Email;
