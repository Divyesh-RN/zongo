import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { black, black03, greenPrimary, grey, paleGreen, red, white } from '../../../constants/Color';
import { HEIGHT, WIDTH } from '../../../constants/ConstantKey';
import { ic_call_bg } from '../../../constants/Images';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { goBack } from '../../../navigation/RootNavigation';
import { useSelector } from 'react-redux';
import global from '../../../constants/Global';
import { Log } from '../../../commonComponents/Log';
import { mediaDevices } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import DeviceInfo from 'react-native-device-info';
import BlutoothDevice from '../components/BlutoothDevice';

let session = null;
var interval = null;
let startTime = null;
let endTime = null;


const CallScreen = ({ route }) => {

  const peripherals = new Map()
  const [isMuted, setMuted] = useState(false);
  const [isHold, setHold] = useState(false);
  const [isSpecker, setSpecker] = useState(false);
  const [Connected, setConnected] = useState(false);
  const [CallStatus, setCallStatus] = useState('');
  const [isDialpadVisible, setDialpadVisible] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [TotalTime, setTotalTime] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [User, setUserData] = useState(route?.params?.item || '');
  const [IsFrom, setIsFrom] = useState(false);
  const [DomainName, setDomainName] = useState("");
  const [ShowAudioTypeModel, setShowAudioTypeModel] = useState(false);
  const [ShowTransferModel, setShowTransferModel] = useState(false);
  const [ShowTransfer, setShowTransfer] = useState("");
  const [TransferCallText, setTransferCallText] = useState("");
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [connectedDeviceName, setConnectedDeviceName] = useState("");
  const [AudioTypeIcon, setAudioTypeIcon] = useState(null);
  const [AudioTypeName, setAudioTypeName] = useState(null);
  const [ShowBlutoothName, setShowBlutoothName] = useState(false);

  const user_extension_data = useSelector(state => state.userRedux.user_extension_data);

  useEffect(() => {

    Log("GET USER FROM SCREEN", route?.params?.from)

    mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => { })
      .catch((error) => {
        console.error("Error accessing the microphone: " + error);
      });

    var domainName = user_extension_data?.data[0]?.domain_name
    setDomainName(domainName)

    if (route?.params?.from !== "DIALER") {
      var number = route?.params?.item?.work_contact_number
      var extension = route?.params?.item?.extension
      var from = route?.params?.from
      setIsFrom(from)

      if (route?.params?.from == "CALLS") {
        inviteCall(extension, from, domainName)
      }
      else {
        inviteCall(number, from, domainName)
      }
    }
    else {
      var dial_number = route?.params?.number;
      var from = route?.params?.from;
      setIsFrom(from)
      inviteCall(dial_number, from, domainName)
    }
    return () => {
      InCallManager.stop();
      clearInterval(interval);
    }
  }, [])

  const updateCallDuration = () => {
    setCallDuration(prevDuration => prevDuration + 1);
  };

  const formatCallDuration = () => {
    if (Connected == true) {
      const hours = Math.floor(callDuration / 3600);
      const minutes = Math.floor((callDuration % 3600) / 60);
      const seconds = callDuration % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const handleMute = () => {
    if (isMuted == true) {
      if (session) {
        session.unmute();
        setMuted(false);
      }
    }
    else {
      if (session) {
        session.mute();
        setMuted(true);
      }
    }
  };

  const handleHold = () => {
    if (isHold == true) {
      console.log("session", session)
      if (session) {
        session.unhold();
        setHold(false)
      }
    }
    else {
      session.hold();
      setHold(true)
    }
  };

  const handleNumberPress = (number) => {
    setPhoneNumber(phoneNumber + number);
  };

  useEffect(() => {
    if (session !== null) {
      toggleSpeaker()
    }
    return () => {
    }
  }, [isSpecker])

  const toggleSpeaker = () => {
    console.log("isSpecker",isSpecker)
    if (isSpecker == true) {
      InCallManager.setSpeakerphoneOn(true);
    }
    else {
      InCallManager.setSpeakerphoneOn(false);
    }
  };

  const inviteCall = (User, from, domainName) => {
    Log("=== Outgoing User  === ", User)
    Log("=== Outgoing from  === ", from)
    Log("=== Outgoing domainName  === ", domainName)
    const options = {
      mediaConstraints: {
        audio: {
          optional: [{ minptime: '10' }, { useinbandfec: '1' }],
          mandatory: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
            echoCancellation: true,
            noiseSuppression: true,
            googEchoCancellation: true,
          },
        },
        video: false,
      },
      rtcOfferConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      },
      sessionTimersExpires: 120,
      pcConfig: {
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302',
            ],
          },
        ],
      },
    };

    if (from == "CALLS") {
      session = global.userAgent.call(`sip:8${User}@${domainName}`, options);
    }
    else if (from == "DIALER") {
      if (User?.length == 4) {
        console.log("step 4")
        session = global.userAgent.call(`sip:${User}@${domainName}`, options);
        // session = global.userAgent.call(`sip:8${User}@${domainName}`, options);
      }
      else {
        console.log("step 3")
        // session = global.userAgent.call(`sip:9${User}@default`, options);
        session = global.userAgent.call(`sip:${User}@${domainName}`, options);
      }
    }
    else {
      session = global.userAgent.call(`sip:9${User}@default`, options);
    }

    session.on('connecting', () => {
      setCallStatus('Connecting');
      console.log('Session connecting');
    });

    session.on('progress', response => {
      console.log('Call is in progress');
      setCallStatus('Ringing');
    });

    session.on('confirmed', response => {
      console.log('Call is established', response)
      setCallStatus('Connected')
      InCallManager.start({ media: 'audio', auto: true });
      setConnected(true)
      interval = setInterval(() => {
        updateCallDuration();
      }, 1000);
      startTime = new Date();
    });

    session.on('ended', (res) => {
      console.log('Call ended', res);
      setCallStatus('Ended');
    });

    session.on('failed', response => {
      console.log('Call failed with response: ', response);
      ToastAndroid.show(response?.cause, ToastAndroid.SHORT);
      setCallStatus('Call Failed');
      setTimeout(() => {
        goBack()
      }, 1000);
    });
    session.on('bye', response => {
      console.log('Call failed with response: ', response);
      ToastAndroid.show(response?.cause, ToastAndroid.SHORT);
      setCallStatus('Call Failed');
      setTimeout(() => {
        goBack()
      }, 1000);
    });

    session.on('newRefer', (referRequest) => {
      console.log("referRequest", referRequest)
    })

    session.on('accepted', () => {
      console.log('Session accepted');
    });

    session.on('ended', (res) => {
      setCallStatus('Ended');
      setConnected(false)
      endTime = new Date();
      const callDurationSeconds = Math.floor((endTime - startTime) / 1000);
      const hours = Math.floor(callDurationSeconds / 3600);
      const remainingSeconds = callDurationSeconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const formattedDuration = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')}`;
      setTotalTime(formattedDuration);
      goBack()
    });
  };

  const handleEndCall = () => {
    if (session) {
      console.log("terminate")
      session.terminate();
    }
  };

  const handleSelectType = async (item) => {
    if (item == "Phone") {
      InCallManager.chooseAudioRoute('EARPIECE');
      setAudioTypeIcon("phone-in-talk")
      setAudioTypeName("Phone")
      setShowBlutoothName(false)
      setSpecker(false)
    }
    else if (item == "Speaker") {
      InCallManager.chooseAudioRoute('SPEAKER');
      setAudioTypeIcon("volume-high")
      setAudioTypeName("Speaker")
      setShowBlutoothName(false)
      setSpecker(true)
    }

    else {
      InCallManager.chooseAudioRoute('BLUETOOTH');
      setAudioTypeIcon("bluetooth-audio")
      setShowBlutoothName(true)
      setAudioTypeName(connectedDeviceName)
      setSpecker(false)
    }
    // setSelectedItem(item);
    setShowAudioTypeModel(!ShowAudioTypeModel)

  };

  const handleBlutooth = () => {
    console.log("connectedDevices", connectedDevices)
    if (connectedDevices.length !== 0) {
      setShowAudioTypeModel(!ShowAudioTypeModel)
    }
  }

  const handleTransferCall = () => {
    setShowTransferModel(false)
    setShowTransfer("Transfering...")
    var newTarget = null;
    if (IsFrom == "CALLS") {
      newTarget = `sip:${TransferCallText}@${DomainName}`;
    }
    else if (IsFrom == "DIALER") {
      if (TransferCallText?.length == 4) {
        newTarget = `sip:${TransferCallText}@${DomainName}`;
      }
      else {
        newTarget = `sip:9${TransferCallText}@default`
      }
    }
    else {
      newTarget = `sip:9${TransferCallText}@default`
    }
    session.refer(newTarget, {});
  }

  const upgradeToVideoCall = () => {
    return
    const options = {
      mediaConstraints: {
        audio: true,
        video: true, // Set video to true for video call
      },
    };
    session.renegotiate(options)
      .then(() => {
        console.log('Call upgraded to video');
      })
      .catch((error) => {
        console.error('Error upgrading to video call:', error);
      });
  };

  return (
    <>
        <ImageBackground  source={ic_call_bg} style={styles.imageBg}>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View>
                <View style={{ alignItems: 'center', marginTop: "20%", flex: 1, height: HEIGHT }}>
                  {Connected == true ?
                    <Text style={styles.callDurationText}> {formatCallDuration()}</Text>
                    : <Text style={styles.callStatusText}>{CallStatus}</Text>
                  }
                  <View style={{ marginTop: "6%", alignItems: "center", }}>
                    {User?.first_name !== undefined ? <Text style={styles.black30Medium}>{User?.first_name}</Text>
                      : <Text style={styles.black30Medium}>{route?.params?.number} </Text>
                    }
                    <Text style={styles.black14Medium}>
                      {
                        route?.params?.from == "CALLS"
                          ? "Extension " + route?.params?.item?.extension
                          : route?.params?.from == "DIALER"
                            ? route?.params?.number
                            : "Mobile " + User?.work_contact_number
                      }
                    </Text>
                  </View>
                  <View style={{
                    width: WIDTH - 80,
                    paddingVertical: 40,
                    backgroundColor: "#e5f3e16e",
                    borderRadius: 10,
                    position: "absolute",
                    bottom: Platform.OS == "android" ? "26%" : "30%",
                  }}>
                    {isDialpadVisible == true ? (
                      <>
                        <View style={styles.display}>
                          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                        </View>
                        <View style={styles.dialPad}>
                          <View style={styles.row}>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('1')}>
                              <Text style={styles.digit}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('2')}>
                              <Text style={styles.digit}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('3')}>
                              <Text style={styles.digit}>3</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.row}>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('4')}>
                              <Text style={styles.digit}>4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('5')}>
                              <Text style={styles.digit}>5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('6')}>
                              <Text style={styles.digit}>6</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.row}>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('7')}>
                              <Text style={styles.digit}>7</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('8')}>
                              <Text style={styles.digit}>8</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('9')}>
                              <Text style={styles.digit}>9</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.row}>
                            <TouchableOpacity style={styles.button} >
                              <Text style={[styles.digit, { fontSize: FontSize.FS_35 }]}>*</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('0')}>
                              <Text style={styles.digit}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('0')}>
                              <Text style={styles.digit}>#</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    ) :
                      <>
                        {ShowAudioTypeModel == true &&
                          <View style={{
                            margin: 20,
                            marginBottom: 40,
                            marginTop: -20,
                          }}>
                            <TouchableOpacity onPress={() => handleSelectType('Phone')}
                              style={{
                                flexDirection: "row", alignItems: "center",
                                justifyContent: "space-between",
                                paddingVertical: 8
                              }}>
                              <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <Icon name="phone-in-talk" size={20} color={black} />
                                <Text style={styles.phoneText}>{"Phone"}</Text>
                              </View>
                              {AudioTypeName === 'Phone' && <Icon name="check" size={20} color={black} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSelectType('Bluetooth')}
                              style={{
                                flexDirection: "row", alignItems: "center",
                                justifyContent: "space-between",
                                paddingVertical: 8
                              }}>
                              <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <Icon name="bluetooth-audio" size={20} color={black} />
                                <Text style={styles.blutoothText}>{"Blutooth "}<Text style={styles.blutoothText}>{`( ${connectedDeviceName} )`}</Text></Text>
                              </View>
                              {AudioTypeName === 'Bluetooth' && <Icon name="check" size={20} color={black} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSelectType('Speaker')}
                              style={{
                                flexDirection: "row", alignItems: "center",
                                justifyContent: "space-between",
                                paddingVertical: 8

                              }}>
                              <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <Icon name="volume-high" size={20} color={black} />
                                <Text style={styles.speakerText}>{"Speaker"}</Text>
                              </View>
                              {AudioTypeName === 'Speaker' && <Icon name="check" size={20} color={black} />}
                            </TouchableOpacity>
                          </View>
                        }
                        {ShowTransferModel == true &&
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginBottom: 30 }}>
                            <TextInput
                              style={{ color: black, fontSize: FontSize.FS_14, fontFamily: MEDIUM, backgroundColor: white, flex: 1, paddingHorizontal: 15, borderRadius: 6, height: 44 }}
                              placeholder="Type a number...."
                              value={TransferCallText}
                              onChangeText={(text) => { setTransferCallText(text) }}
                            />
                            <TouchableOpacity onPress={() => {
                              if (TransferCallText !== "") {
                                handleTransferCall()
                              }
                              else {
                                alert("Please enter a number")
                              }
                            }}
                              style={{ marginLeft: 10, backgroundColor: greenPrimary, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 6 }}>
                              <Text style={{ color: white, fontSize: FontSize.FS_14, fontFamily: MEDIUM, }}>Call</Text>
                            </TouchableOpacity>
                          </View>
                        }
                        {ShowTransfer !== "" &&
                          <Text style={{ color: black, fontSize: FontSize.FS_14, fontFamily: SEMIBOLD, textAlign: "center", marginBottom: 30 }}>{ShowTransfer}</Text>
                        }
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginBottom: 25, }}>
                          <TouchableOpacity style={{ alignItems: "center", flex: 1 }}>
                            <Icon name="plus" size={35} color={black} />
                            <Text style={styles.addCallText}>{"Add call"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            if (Connected) {
                              handleHold()
                            }
                          }}
                            style={{ alignItems: "center", flex: 1 }}>
                            <Icon name="pause-circle-outline" size={35} color={Connected ? isHold ? greenPrimary : black : black03} />
                            <Text style={[styles.holdText, { color: Connected ? isHold ? greenPrimary : black : black03, }]}>{"Hold"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { upgradeToVideoCall() }}
                            style={{ alignItems: "center", flex: 1 }}>
                            <Icon name="video-outline" size={35} color={black} />
                            <Text style={styles.videoCallText}>{"Video call"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleBlutooth()}
                            style={{ alignItems: "center", flex: 1 }}>
                            <Icon name={AudioTypeIcon} size={30} color={AudioTypeName == "Phone" ? black03 : greenPrimary} />
                            <Text style={{
                              fontSize: FontSize.FS_10,
                              color: AudioTypeName == "Phone" ? black03 : greenPrimary,
                              fontFamily: REGULAR,
                              marginTop: 12
                            }}>
                              {ShowBlutoothName == false ? AudioTypeName : connectedDeviceName}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    }
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, }}>
                      <TouchableOpacity onPress={() => {
                        setSpecker(!isSpecker)
                      }}
                        style={{ alignItems: "center", flex: 1 }}>
                        <Icon name="volume-high" size={35} color={isSpecker ? greenPrimary : black} />
                        <Text style={[styles.speakerText, { color: isSpecker ? greenPrimary : black, }]}>{"Speaker"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if (Connected) {
                          setShowTransferModel(!ShowTransferModel)
                        }
                      }}
                        style={{ alignItems: "center", flex: 1 }}>
                        <Icon name="swap-horizontal" size={35} color={Connected ? ShowTransferModel ? greenPrimary : black : black03} />
                        <Text style={[styles.transferText, { color: Connected ? ShowTransferModel ? greenPrimary : black : black03, }]}> {"Transfer"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if (Connected) {
                          handleMute()
                        }
                      }}
                        style={{ alignItems: "center", flex: 1 }}>
                        <Icon name={isMuted ? "microphone-outline" : "microphone-outline"} size={35} color={Connected ? isMuted ? greenPrimary : black : black03} />
                        <Text style={[styles.muteText, { color: Connected ? isMuted ? greenPrimary : black : black03, }]}>{"Mute"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setDialpadVisible(!isDialpadVisible); }}
                        style={{ alignItems: "center", flex: 1 }}>
                        <Icon name="dialpad" size={33} color={isDialpadVisible ? greenPrimary : black} />
                        <Text style={[styles.keypadText, { color: isDialpadVisible ? greenPrimary : black, }]}>{"Keypad"}</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (session !== null) {
                        handleEndCall()
                      }
                      else {
                        goBack()
                      }
                    }}
                    style={styles.hangupBtn}>
                    <Icon name="phone-hangup" size={40} color={white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      <BlutoothDevice blutoothData={(results) => {
        DeviceInfo.isHeadphonesConnected().then((enabled) => {
          if (enabled == true && results.length !== 0) {
            const names = results.map(item => item.name);
            const firstObjectName = results[0].name;
            setConnectedDeviceName(firstObjectName)
            setShowBlutoothName(true)
            setAudioTypeName("Bluetooth")
            setAudioTypeIcon("bluetooth-audio")
            for (let i = 0; i < results.length; i++) {
              let peripheral = results[i];
              peripheral.connected = true;
              peripherals.set(peripheral.id, peripheral);
              setConnectedDevices(Array.from(peripherals.values()));
            }
          }
          else {
            Log('No connected bluetooth devices');
            setConnectedDevices([])
            setConnectedDeviceName("")
            setAudioTypeName("Phone")
            setAudioTypeIcon("phone-in-talk")
            setShowBlutoothName(false)
          }
        });
      }} />
    </>
  );
};
const styles = StyleSheet.create({
  black14Medium: {fontSize: FontSize.FS_14,
                           color: black,
                           fontFamily: MEDIUM,  },
  black30Medium: {
    fontSize: FontSize.FS_30,
    color: black,
    fontFamily: MEDIUM,
  },
  imageBg: { flex: 1, },
  callDurationText: {
    fontSize: FontSize.FS_14,
    color: black,
    fontFamily: MEDIUM,
    marginTop: 20
    ,
  },
  callStatusText: {
    fontSize: FontSize.FS_14,
    color: black,
    fontFamily: MEDIUM,
    marginTop: 20
    ,
  },
  phoneText: {
    fontSize: FontSize.FS_12,
    color: black,
    fontFamily: MEDIUM,
    marginLeft: 10
    ,
  },
  blutoothText: {
    fontSize: FontSize.FS_12,
    color: grey,
    fontFamily: REGULAR,
    marginLeft: 10
    ,
  },
  speakerText: {
    fontSize: FontSize.FS_12,
    color: black,
    fontFamily: MEDIUM,
    marginLeft: 10
    ,
  },
  addCallText: {
    fontSize: FontSize.FS_10,
    color: black,
    fontFamily: REGULAR,
    marginTop: 6
    ,
  },
  holdText: {
    fontSize: FontSize.FS_10,
    fontFamily: REGULAR,
    marginTop: 6
    ,
  },
  videoCallText: {
    fontSize: FontSize.FS_10,
    color: black,
    fontFamily: REGULAR,
    marginTop: 6
    ,
  },
  speakerText: {
    fontSize: FontSize.FS_10,
    fontFamily: REGULAR,
    marginTop: 6
    ,
  },
  transferText: {
    fontSize: FontSize.FS_10,
    fontFamily: REGULAR,
    marginTop: 6
    ,
  },
  muteText: {
    fontSize: FontSize.FS_10,
    fontFamily: REGULAR,
    marginTop: 6,
  },
  keypadText: {
    fontSize: FontSize.FS_10,
    fontFamily: REGULAR,
    marginTop: 6
    ,
  },
  hangupBtn: {
    width: 60,
    height: 60,
    backgroundColor: red,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: Platform.OS == "android" ? "12%" : "20%",
  },
  container: {
  },
  display: {
    alignItems: 'center',
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: FontSize.FS_18,
    color: black,
    fontFamily: MEDIUM,
  },
  digit: {
    fontSize: FontSize.FS_24,
    color: black,
    fontFamily: MEDIUM,
  },
  dialPad: {
    width: '70%',
    alignSelf: "center"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
});
export default CallScreen;
