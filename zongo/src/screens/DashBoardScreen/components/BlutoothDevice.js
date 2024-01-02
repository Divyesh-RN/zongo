

import { useEffect, useState } from 'react';
import {
    Text,
    View,
    Platform,
    StatusBar,
    ScrollView,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    NativeModules,
    useColorScheme,
    TouchableOpacity,
    NativeEventEmitter,
    PermissionsAndroid,
    FlatList,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BlutoothDevice = ({ blutoothData }) => {
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map()
    const [connectedDevices, setConnectedDevices] = useState([]);

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    useEffect(() => {
        // start bluetooth manager
        BleManager.start({ showAlert: false }).then(() => {
            console.log('BleManager initialized');
            handleGetConnectedDevices();
        });
    }, []);
    useEffect(() => {
        let stopListener = BleManagerEmitter.addListener(
            'BleManagerStopScan',
            () => {
                setIsScanning(false);
                console.log('Scan is stopped');
            },
        );
    }, []);


    useEffect(() => {
        // turn on bluetooth if it is not on
        // BleManager.enableBluetooth().then(() => {
        //     console.log('Bluetooth is turned on!');
        // });
        // requestPermissions()


    }, []);

    // const requestPermissions = ()=>{

    //     if (Platform.OS === 'android' && Platform.Version >= 23) {
    //         const permissions = [
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    //             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    //         ];

    //         PermissionsAndroid.requestMultiple(permissions)
    //             .then(granted => {
    //                 console.log("granted",granted)
    //                 if (
    //                     granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
    //                     granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
    //                     granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED
    //                 ) {
    //                     console.log('User accepted all permissions');
    //                     // You can perform actions that require these permissions here
    //                 } else {
    //                     console.log('One or more permissions were denied');
    //                     // Handle the scenario where permissions were denied
    //                 }
    //             })
    //             .catch(err => {
    //                 console.warn('Error in requesting permissions:', err);
    //             });
    //         }
    // }
    // Android/iOS
    const handleGetConnectedDevices = () => {
        if (Platform.OS === 'android') {
            console.log("ANDROID")
            BleManager.getBondedPeripherals([]).then(results => {
                blutoothData(results)
            });
        }
        else {
            console.log("IOS")
            BleManager.getConnectedPeripherals([]).then(results => {
                blutoothData(results)
                if (results.length === 0) {
                    console.log('No connected bluetooth devices');
                } else {
                    for (let i = 0; i < results.length; i++) {
                        let peripheral = results[i];
                        peripheral.connected = true;
                        peripherals.set(peripheral.id, peripheral);
                        setConnectedDevices(Array.from(peripherals.values()));
                    }
                }
            });
        }

    };

    //Android Only 
    // const handleGetConnectedDevices = () => {
    //     console.log("Handle getConnectedDevices Android Only")
    //     BleManager.getBondedPeripherals([]).then(results => {
    //         blutoothData(results)
    // if (results.length === 0) {
    //     console.log('No connected bluetooth devices');
    // } else {
    //     for (let i = 0; i < results.length; i++) {
    //         let peripheral = results[i];
    //         peripheral.connected = true;
    //         peripherals.set(peripheral.id, peripheral);
    //         setConnectedDevices(Array.from(peripherals.values()));
    //     }
    // }
    //     });
    // };

    // const startScan = () => {
    //     if (!isScanning) {
    //         BleManager.scan([], 5, true)
    //             .then(() => {
    //                 console.log('Scanning...');
    //                 setIsScanning(true);
    //             })
    //             .catch(error => {
    //                 console.error(error);
    //             });
    //     }
    // };

    // const RenderItem = ({ peripheral }) => {
    //     const { name, rssi, connected } = peripheral;
    //     return (
    //         <>
    //             {name && (
    //                 <View
    //                     style={{
    //                         flexDirection: 'row',
    //                         justifyContent: 'space-between',
    //                         marginBottom: 10,
    //                     }}>
    //                     <View style={styles.deviceItem}>
    //                         <Text style={styles.deviceName}>{name}</Text>
    //                         <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
    //                     </View>
    //                     <TouchableOpacity
    //                         onPress={() =>
    //                             connected
    //                                 ? disconnectFromPeripheral(peripheral)
    //                                 : connectToPeripheral(peripheral)
    //                         }
    //                         style={styles.deviceButton}>
    //                         <Text
    //                             style={[
    //                                 styles.scanButtonText,
    //                                 { fontWeight: 'bold', fontSize: 16 },
    //                             ]}>
    //                             {connected ? 'Disconnect' : 'Connect'}
    //                         </Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             )}
    //         </>
    //     );
    // };
    // return (
    //     // <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
    //     //     <StatusBar
    //     //         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     //         backgroundColor={backgroundStyle.backgroundColor}
    //     //     />
    //     //     <ScrollView
    //     //         style={backgroundStyle}
    //     //         contentContainerStyle={styles.mainBody}
    //     //         contentInsetAdjustmentBehavior="automatic">
    //     //         <View
    //     //             style={{
    //     //                 backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    //     //                 marginBottom: 40,
    //     //             }}>
    //     //             <TouchableOpacity
    //     //                 activeOpacity={0.5}
    //     //                 style={styles.buttonStyle}
    //     //                 onPress={startScan}>
    //     //                 <Text style={styles.buttonTextStyle}>
    //     //                     {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
    //     //                 </Text>
    //     //             </TouchableOpacity>
    //     //             {connectedDevices.length > 0 ? (
    //     //                 <FlatList
    //     //                     data={connectedDevices}
    //     //                     renderItem={({ item }) => <RenderItem peripheral={item} />}
    //     //                     keyExtractor={item => item.id}
    //     //                 />
    //     //             ) : (
    //     //                 <Text style={styles.noDevicesText}>No connected devices</Text>
    //     //             )}
    //     //         </View>
    //     //     </ScrollView>
    //     // </SafeAreaView>
    // );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        height: windowHeight,
        marginHorizontal: 40
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    container: {
        flex: 1,
        height: windowHeight,
        paddingHorizontal: 10,
    },
    scrollContainer: {
        padding: 16,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    subtitle: {
        fontSize: 24,
        marginBottom: 10,
        marginTop: 20,
    },
    scanButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    scanButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    noDevicesText: {
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    deviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    deviceItem: {
        marginBottom: 10,
    },
    deviceName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    deviceInfo: {
        fontSize: 14,
    },
    deviceButton: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 20,
        margin: 20,
    },
});
export default BlutoothDevice;