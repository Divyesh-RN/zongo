// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// import { ic_dashboard } from '../../../constants/Images';
// import { greenPrimary, white } from '../../../constants/Color';
// import Icon from "react-native-vector-icons/MaterialCommunityIcons"


// const PhoneDialer = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [showHistory, setShowHistory] = useState(false);

//   const handleDial = () => {
//     // Perform dialing action with the phone number
//     // Actual calling functionalities might not be achievable directly in React Native.
//   };

//   const appendNumber = (num) => {
//     setPhoneNumber(phoneNumber + num);
//   };

//   const toggleHistory = () => {
//     setShowHistory(!showHistory);
//   };

//   return (
//     <View style={{flex:1}}>
//     {showHistory && (
//         <View style={styles.callHistory}>
//           <Text>Call History</Text>
//           <TouchableOpacity style={styles.showDialerIcon} onPress={toggleHistory}>
//           <Icon name="dialpad" size={40} color={white} />
//           </TouchableOpacity>
//         </View>
//       )}
//     <View style={styles.container}>
//       <PanGestureHandler 
//     //   onGestureEvent={() => setShowHistory(!showHistory)}
//     onGestureEvent={({ nativeEvent }) => {
//         if (nativeEvent.translationY > 100) {
//           setShowHistory(true);
//         } else if (nativeEvent.translationY < -100) {
//           setShowHistory(false);
//         }
//       }}
//       >
//         <View style={styles.container}>
//           <View style={styles.display}>
//             <TextInput
//               style={styles.displayText}
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//               value={phoneNumber}
//               onChangeText={(text) => setPhoneNumber(text)}
//             />
//           </View>
//           <View style={styles.dialer}>
//             <View style={styles.dialerRow}>
//               {[1, 2, 3].map((num) => (
//                 <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
//                   <Text style={styles.dialerButtonText}>{num}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.dialerRow}>
//               {[4, 5, 6].map((num) => (
//                 <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
//                   <Text style={styles.dialerButtonText}>{num}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.dialerRow}>
//               {[7, 8, 9].map((num) => (
//                 <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
//                   <Text style={styles.dialerButtonText}>{num}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.dialerRow}>
//               <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('*')}>
//                 <Text style={styles.dialerButtonText}>*</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('0')}>
//                 <Text style={styles.dialerButtonText}>0</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('#')}>
//                 <Text style={styles.dialerButtonText}>#</Text>
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity style={styles.callButton} onPress={handleDial}>
//               <Text style={styles.callButtonText}>Dial</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </PanGestureHandler>

//     </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//     backgroundColor: 'red',
//     width:"100%",

//     // height:200,
//     position:"absolute",
//     bottom:0
//   },
//   display: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   displayText: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: "red",
//     padding: 10,
//     backgroundColor: 'white',
//   },
//   dialer: {
//     width: '100%',
//   },
//   dialerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   dialerButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#009688',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dialerButtonText: {
//     color: 'white',
//     fontSize: 24,
//   },
//   callButton: {
//     width: 150,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#FF9800',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   callButtonText: {
//     color: 'white',
//     fontSize: 20,
//   },
//   callHistory: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'lightgray',
//     zIndex: 10,
//   },
//   showDialerIcon: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor:greenPrimary,
//     width:65,height:65,
//     borderRadius:50,
//     alignItems:"center",
//     justifyContent:"center",
//   },
//   dialerIcon: {
//     width: 50,
//     height: 50,
//   },
// });

// export default PhoneDialer;
import { View, StyleSheet, StatusBar, TouchableOpacity, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HEIGHT, WIDTH } from '../../../constants/ConstantKey';
import { bgColor01, black, greenPrimary, grey, midGreen, paleGreen, white } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Log } from '../../../commonComponents/Log';
const CustomBottomSheet = ({ onPress = {}, bottomSheetRef = "", }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const handleDial = () => {
        Log(`Dialing ${phoneNumber}`);
    };

    const appendNumber = (num) => {
        setPhoneNumber(phoneNumber + num);
    };


    const removeLastNumber = () => {
        setPhoneNumber(prev => prev.slice(0, -1));
    };
    // const closeBottomSheet = () => {
    //     // bottomSheetRef.current.close();
    //   };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <RBSheet
                animationType={"slide"}
                ref={bottomSheetRef}
                //   minClosingHeight={200}
                height={HEIGHT / 1.9}
                // duration={100}
                closeOnDragDown={true}
                // closeOnPressMask={true}
                // onClose={closeBottomSheet}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    container: {
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        backgroundColor: bgColor01,
                        // marginBottom: 60
                        position:"absolute",
                        bottom:58
                    },
                    draggableIcon: {
                        backgroundColor: bgColor01
                    }
                }}
            >
                {/* Content of the bottom sheet */}
                <View style={{
                    marginTop: 20, marginHorizontal: 25, marginBottom: 40,
                    backgroundColor:bgColor01 ,
                    justifyContent:"center",
                    alignItems:"center"
                    }}>
                    <View
                        style={styles.display}>
                        <Text
                            style={styles.displayText}
                        >{phoneNumber}</Text>
                        <TouchableOpacity onLongPress={()=>{
                            setPhoneNumber('')
                        }}
                         style={{padding:10,backgroundColor:white}} onPress={() => {
                            removeLastNumber()
                        }}>
                            <Icon name="backspace-outline" size={25} color={grey} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dialer}>
                        <View style={styles.dialerRow}>
                            {[1, 2, 3].map((num) => (
                                <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
                                    <Text style={styles.dialerButtonText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.dialerRow}>
                            {[4, 5, 6].map((num) => (
                                <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
                                    <Text style={styles.dialerButtonText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.dialerRow}>
                            {[7, 8, 9].map((num) => (
                                <TouchableOpacity key={num} style={styles.dialerButton} onPress={() => appendNumber(num)}>
                                    <Text style={styles.dialerButtonText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.dialerRow}>
                            <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('*')}>
                                <Text style={styles.dialerButtonText}>*</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('0')}>
                                <Text style={styles.dialerButtonText}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dialerButton} onPress={() => appendNumber('#')}>
                                <Text style={styles.dialerButtonText}>#</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.callButton} onPress={handleDial}>
                        <Icon name="phone" size={30} color={white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
        </View>
    )
}
const styles = StyleSheet.create({

    dialer: {
        width: WIDTH - 80,
        alignSelf: "center",
    },
    dialerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: 10,
    },
    dialerButton: {
        width: 60,
        height: 60,
        borderRadius: 35,
        backgroundColor: paleGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialerButtonText: {
        color: midGreen,
        fontSize: FontSize.FS_22,
        fontFamily: SEMIBOLD,
    },
    display: {
        width: '100%',
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    displayText: {
        height: 50,
        padding: 10,
        backgroundColor: white,
        fontSize: FontSize.FS_22,
        color: black,
        fontFamily: MEDIUM,
        textAlign: "center",
        pointerEvents: "none",
        flex: 1
    },
    callButton: {
        width: 100,
        height: 50,
        borderRadius: 25,
        backgroundColor: greenPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 40,
    },
});
export default CustomBottomSheet
