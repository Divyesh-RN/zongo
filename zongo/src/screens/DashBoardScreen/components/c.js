// // Example of Expandable ListView in React Native
// // https://aboutreact.com/expandable-list-view/

// // Import React
// import React, { useEffect, useState } from 'react';
// // Import required components
// import {
//   SafeAreaView,
//   LayoutAnimation,
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   UIManager,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';

// const ExpandableComponent = ({ item, onClickFunction }) => {
//   //Custom Component for the Expandable List
//   const [layoutHeight, setLayoutHeight] = useState(0);

//   useEffect(() => {
//     if (item.isExpanded) {
//       setLayoutHeight(null);
//     } else {
//       setLayoutHeight(0);
//     }
//   }, [item.isExpanded]);

//   return (
//     <View>
//       {/*Header of the Expandable List Item*/}
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={onClickFunction}
//         style={styles.header}>
//         <Text style={styles.headerText}>{item.category_name}</Text>
//       </TouchableOpacity>
//       <View
//         style={{
//           height: layoutHeight,
//           overflow: 'hidden',
//         }}>
//         {/*Content under the header of the Expandable List Item*/}
//         {item.subcategory.map((item, key) => (
//           <TouchableOpacity
//             key={key}
//             style={styles.content}
//             onPress={() => alert('Id: ' + item.id + ' val: ' + item.val)}>
//             <Text style={styles.text}>
//               {key}. {item.val}
//             </Text>
//             <View style={styles.separator} />
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// const App = () => {
//   const [listDataSource, setListDataSource] = useState(CONTENT);
//   const [multiSelect, setMultiSelect] = useState(false);

//   if (Platform.OS === 'android') {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }

//   const updateLayout = (index) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     const array = [...listDataSource];
//     if (multiSelect) {
//       // If multiple select is enabled
//       array[index]['isExpanded'] = !array[index]['isExpanded'];
//     } else {
//       // If single select is enabled
//       array.map((value, placeindex) =>
//         placeindex === index
//           ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
//           : (array[placeindex]['isExpanded'] = false)
//       );
//     }
//     setListDataSource(array);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <View style={{ flexDirection: 'row', padding: 10 }}>
//           <Text style={styles.titleText}>Expandable List View</Text>
//           <TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
//             <Text
//               style={{
//                 textAlign: 'center',
//                 justifyContent: 'center',
//               }}>
//               {multiSelect
//                 ? 'Enable Single \n Expand'
//                 : 'Enalble Multiple \n Expand'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <ScrollView>
//           {listDataSource.map((item, key) => (
//             <ExpandableComponent
//               key={item.category_name}
//               onClickFunction={() => {
//                 updateLayout(key);
//               }}
//               item={item}
//             />
//           ))}
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   titleText: {
//     flex: 1,
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   header: {
//     backgroundColor: '#F5FCFF',
//     padding: 20,
//   },
//   headerText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   separator: {
//     height: 0.5,
//     backgroundColor: '#808080',
//     width: '95%',
//     marginLeft: 16,
//     marginRight: 16,
//   },
//   text: {
//     fontSize: 16,
//     color: '#606070',
//     padding: 10,
//   },
//   content: {
//     paddingLeft: 10,
//     paddingRight: 10,
//     backgroundColor: '#fff',
//   },
// });

// //Dummy content to show
// //You can also use dynamic data by calling webservice
// const CONTENT = [
//   {
//     isExpanded: false,
//     category_name: 'Item 1',
//     subcategory: [
//       { id: 1, val: 'Sub Cat 1' },
//       { id: 3, val: 'Sub Cat 3' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 2',
//     subcategory: [
//       { id: 4, val: 'Sub Cat 4' },
//       { id: 5, val: 'Sub Cat 5' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 3',
//     subcategory: [
//       { id: 7, val: 'Sub Cat 7' },
//       { id: 9, val: 'Sub Cat 9' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 4',
//     subcategory: [
//       { id: 10, val: 'Sub Cat 10' },
//       { id: 12, val: 'Sub Cat 2' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 5',
//     subcategory: [
//       { id: 13, val: 'Sub Cat 13' },
//       { id: 15, val: 'Sub Cat 5' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 6',
//     subcategory: [
//       { id: 17, val: 'Sub Cat 17' },
//       { id: 18, val: 'Sub Cat 8' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 7',
//     subcategory: [{ id: 20, val: 'Sub Cat 20' }],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 8',
//     subcategory: [{ id: 22, val: 'Sub Cat 22' }],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 9',
//     subcategory: [
//       { id: 26, val: 'Sub Cat 26' },
//       { id: 27, val: 'Sub Cat 7' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 10',
//     subcategory: [
//       { id: 28, val: 'Sub Cat 28' },
//       { id: 30, val: 'Sub Cat 0' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 11',
//     subcategory: [{ id: 31, val: 'Sub Cat 31' }],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 12',
//     subcategory: [{ id: 34, val: 'Sub Cat 34' }],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 13',
//     subcategory: [
//       { id: 38, val: 'Sub Cat 38' },
//       { id: 39, val: 'Sub Cat 9' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 14',
//     subcategory: [
//       { id: 40, val: 'Sub Cat 40' },
//       { id: 42, val: 'Sub Cat 2' },
//     ],
//   },
//   {
//     isExpanded: false,
//     category_name: 'Item 15',
//     subcategory: [
//       { id: 43, val: 'Sub Cat 43' },
//       { id: 44, val: 'Sub Cat 44' },
//     ],
//   },
// ];


// import { useEffect, useState } from 'react';
// import {
//     Text,
//     View,
//     Platform,
//     StatusBar,
//     ScrollView,
//     StyleSheet,
//     Dimensions,
//     SafeAreaView,
//     NativeModules,
//     useColorScheme,
//     TouchableOpacity,
//     NativeEventEmitter,
//     PermissionsAndroid,
//     FlatList,
// } from 'react-native';
// import BleManager from 'react-native-ble-manager';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
// const BleManagerModule = NativeModules.BleManager;
// const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const Cat = ({blutoothData}) => {
//     const [isScanning, setIsScanning] = useState(false);
//     const peripherals = new Map()
//     const [connectedDevices, setConnectedDevices] = useState([]);

//     const isDarkMode = useColorScheme() === 'dark';
//     const backgroundStyle = {
//         backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//     };
//  useEffect(() => {
//         // start bluetooth manager
//         BleManager.start({ showAlert: false }).then(() => {
//             console.log('BleManager initialized');
//             handleGetConnectedDevices();
//         });
//     }, []);
//     useEffect(() => {
//         let stopListener = BleManagerEmitter.addListener(
//             'BleManagerStopScan',
//             () => {
//                 setIsScanning(false);
//                 console.log('Scan is stopped');
//             },
//         );
//     }, []);

   
//     useEffect(() => {
//         // turn on bluetooth if it is not on
//         // BleManager.enableBluetooth().then(() => {
//         //     console.log('Bluetooth is turned on!');
//         // });

//         if (Platform.OS === 'android' && Platform.Version >= 23) {
//             PermissionsAndroid.check(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             ).then(result => {
//                 if (result) {
//                     console.log('Permission is OK');
//                 } else {
//                     PermissionsAndroid.requestMultiple(
//                        [ PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
//                     ).then(result => {
//                         if (result) {
//                             console.log('User accept');
//                         } else {
//                             console.log('User refuse');
//                         }
//                     });
//                 }
//             });
//         }

//     }, []);
//     //   const handleGetConnectedDevices = () => {
//     //     BleManager.getConnectedPeripherals([]).then(results => {
//     //       if (results.length === 0) {
//     //         console.log('No connected bluetooth devices');
//     //       } else {
//     //         for (let i = 0; i < results.length; i++) {
//     //           let peripheral = results[i];
//     //           peripheral.connected = true;
//     //           peripherals.set(peripheral.id, peripheral);
//     //           setConnectedDevices(Array.from(peripherals.values()));
//     //         }
//     //       }
//     //     });
//     //   };

    
//     const handleGetConnectedDevices = () => {
//         console.log("Handle getConnectedDevices Android Only")
//         BleManager.getBondedPeripherals([]).then(results => {
//             blutoothData(results)
//             if (results.length === 0) {
//                 console.log('No connected bluetooth devices');
//             } else {
//                 for (let i = 0; i < results.length; i++) {
//                     let peripheral = results[i];
//                     peripheral.connected = true;
//                     peripherals.set(peripheral.id, peripheral);
//                     setConnectedDevices(Array.from(peripherals.values()));
//                 }
//             }
//         });
//     };

//     const startScan = () => {
//         if (!isScanning) {
//             BleManager.scan([], 5, true)
//                 .then(() => {
//                     console.log('Scanning...');
//                     setIsScanning(true);
//                 })
//                 .catch(error => {
//                     console.error(error);
//                 });
//         }
//     };

//     const RenderItem = ({ peripheral }) => {
//         const { name, rssi, connected } = peripheral;
//         return (
//             <>
//                 {name && (
//                     <View
//                         style={{
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                             marginBottom: 10,
//                         }}>
//                         <View style={styles.deviceItem}>
//                             <Text style={styles.deviceName}>{name}</Text>
//                             <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
//                         </View>
//                         <TouchableOpacity
//                             onPress={() =>
//                                 connected
//                                     ? disconnectFromPeripheral(peripheral)
//                                     : connectToPeripheral(peripheral)
//                             }
//                             style={styles.deviceButton}>
//                             <Text
//                                 style={[
//                                     styles.scanButtonText,
//                                     { fontWeight: 'bold', fontSize: 16 },
//                                 ]}>
//                                 {connected ? 'Disconnect' : 'Connect'}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 )}
//             </>
//         );
//     };
//     return (
//         <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
//             <StatusBar
//                 barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//                 backgroundColor={backgroundStyle.backgroundColor}
//             />
//             <ScrollView
//                 style={backgroundStyle}
//                 contentContainerStyle={styles.mainBody}
//                 contentInsetAdjustmentBehavior="automatic">
//                 <View
//                     style={{
//                         backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//                         marginBottom: 40,
//                     }}>
//                     <TouchableOpacity
//                         activeOpacity={0.5}
//                         style={styles.buttonStyle}
//                         onPress={startScan}>
//                         <Text style={styles.buttonTextStyle}>
//                             {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
//                         </Text>
//                     </TouchableOpacity>
//                     {connectedDevices.length > 0 ? (
//                         <FlatList
//                             data={connectedDevices}
//                             renderItem={({ item }) => <RenderItem peripheral={item} />}
//                             keyExtractor={item => item.id}
//                         />
//                     ) : (
//                         <Text style={styles.noDevicesText}>No connected devices</Text>
//                     )}
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };
// const windowHeight = Dimensions.get('window').height;
// const styles = StyleSheet.create({
//     mainBody: {
//         flex: 1,
//         justifyContent: 'center',
//         height: windowHeight,
//         marginHorizontal: 40
//     },
//     buttonStyle: {
//         backgroundColor: '#307ecc',
//         borderWidth: 0,
//         color: '#FFFFFF',
//         borderColor: '#307ecc',
//         height: 40,
//         alignItems: 'center',
//         borderRadius: 30,
//         marginLeft: 35,
//         marginRight: 35,
//         marginTop: 15,
//     },
//     buttonTextStyle: {
//         color: '#FFFFFF',
//         paddingVertical: 10,
//         fontSize: 16,
//     },
//     container: {
//         flex: 1,
//         height: windowHeight,
//         paddingHorizontal: 10,
//     },
//     scrollContainer: {
//         padding: 16,
//     },
//     title: {
//         fontSize: 30,
//         textAlign: 'center',
//         marginBottom: 20,
//         marginTop: 40,
//     },
//     subtitle: {
//         fontSize: 24,
//         marginBottom: 10,
//         marginTop: 20,
//     },
//     scanButton: {
//         backgroundColor: '#2196F3',
//         padding: 10,
//         borderRadius: 5,
//         marginBottom: 20,
//     },
//     scanButtonText: {
//         color: 'white',
//         textAlign: 'center',
//     },
//     noDevicesText: {
//         textAlign: 'center',
//         marginTop: 10,
//         fontStyle: 'italic',
//     },
//     deviceContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     deviceItem: {
//         marginBottom: 10,
//     },
//     deviceName: {
//         fontSize: 22,
//         fontWeight: 'bold',
//     },
//     deviceInfo: {
//         fontSize: 14,
//     },
//     deviceButton: {
//         backgroundColor: '#2196F3',
//         padding: 8,
//         borderRadius: 5,
//         marginBottom: 20,
//         paddingHorizontal: 20,
//         margin: 20,
//     },
// });
// export default Cat;