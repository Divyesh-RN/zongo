import React, { useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  NativeModules,
  SafeAreaView
} from 'react-native';
import JsSIP from 'jssip';
import { useDispatch, useSelector } from 'react-redux';
import { changeIncomingAlertState, storeUseAgent, storeUserSession, storeUseStatus } from '../../../redux/reducers/userReducer';
import global from '../../../constants/Global';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';
import NetInfo from '@react-native-community/netinfo';
import Heartbeat from '../../../../Heartbeat';
import RNCallKeep from 'react-native-callkeep';
import { mediaDevices } from 'react-native-webrtc';

let userAgent = null;
let session = null
const RegisterAccount = ({ toggleLoading, registerData }) => {
  const dispatch = useDispatch()

  const user_extension_data = useSelector(state => state.userRedux.user_extension_data);
  const user_session = useSelector(state => state.userRedux.user_session);
  
  useEffect(() => {
    
    
    const onAnswerCall =async ({ callUUID }) => {
      console.log("onAnswerCall - callUUID : ",callUUID)
      if (session) {
        RNCallKeep.answerIncomingCall(callUUID); // Use dynamic callUUID
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
        session.answer(options);

      }
    };
  
    const onEndCall = ({ callUUID }) => {
      console.log("onEndCall - callUUID : ",callUUID)
      if (session) {
        session.terminate();
        RNCallKeep.endCall(callUUID); // Use dynamic callUUID
      }
    };
  
    RNCallKeep.addEventListener('answerCall', onAnswerCall);
    RNCallKeep.addEventListener('endCall', onEndCall);
  
    return () => {
      // RNCallKeep.removeEventListener('answerCall', onAnswerCall);
      // RNCallKeep.removeEventListener('endCall', onEndCall);
    };
  }, [session]);
  

  // useEffect(() => {
  //   RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
  //     if (session) {
  //       RNCallKeep.answerIncomingCall("call-uuid")
  //       console.log("Answer from CALL-KEEP",session)
  //       const options = {
  //         mediaConstraints: {
  //           audio: {
  //             optional: [{ minptime: '10' }, { useinbandfec: '1' }],
  //             mandatory: {
  //               offerToReceiveAudio: true,
  //               offerToReceiveVideo: false,
  //               echoCancellation: true,
  //               noiseSuppression: true,
  //               googEchoCancellation: true,
  //             },
  //           },
  //           video: false,
  //         },
  //         rtcOfferConstraints: {
  //           offerToReceiveAudio: true,
  //           offerToReceiveVideo: false,
  //         },
  //         sessionTimersExpires: 120,
  //         pcConfig: {
  //           iceServers: [
  //             {
  //               urls: [
  //                 'stun:stun.l.google.com:19302',
  //                 'stun:stun1.l.google.com:19302',
  //               ],
  //             },
  //           ],
  //         },
  //       };
  //       session.answer(options);
  //     }
  //   });
    
  //   // End call
  //   RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
  //     if (user_session) {
  //       console.log("endCall from CALL-KEEP",session)
  //       if (session) {
  //         session.terminate();
  //       }
  //       RNCallKeep.endCall("call-uuid");

  //     }
  //   });
    
  //   return () => { };
  // }, []);

 
  useEffect(() => {
    if (userAgent == null) {
      dispatch(storeUseStatus(false));
    }
    return () => { };
  }, [userAgent]);

  useEffect(() => {
    if (registerData !== undefined && registerData !== null && registerData !== "") {
      registerAccount(registerData)
    }
  }, [registerData])

  // useEffect(() => {
  //   // Subscribe to network changes
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     console.log("ConnectionType",state.type)
  //     console.log("IsConnected",state.isConnected)
  //   });

  //   // Unsubscribe when component unmounts
  //   return () => unsubscribe();
  // }, []);


  const registerAccount = data => {

    // JsSIP.debug.enable('JsSIP:*');

    var socket = new JsSIP.WebSocketInterface(data?.WebsoketUrl);

    const url = data?.Realm
    const config = {
      uri: data?.PublicIdentity,
      authorization_user: data?.PrivateIdentity,
      password: data?.Password,
      display_name: data?.displayName,
      transportOptions: {
        wsServers: [data?.WebsoketUrl],
      },
      sockets: [socket],
      realm: data?.Realm,
      session_timers: true,
      session_timers_refresh_method: 'UPDATE',
      session_timers_expires: 120,
      register: true,
      traceSip: true, // Enable SIP logging
      use_preloaded_route: true,
      with_react_native: true,
      // contact_uri: 'sip:' + data?.PrivateIdentity + '@' + data?.Realm,

    };
    userAgent = new JsSIP.UA(config);
    dispatch(storeUseAgent(userAgent));

    const options = {
      title: user_extension_data.data[0]?.extension,
      text: `Register extension ${user_extension_data.data[0]?.extension}`
    };
    Heartbeat.startService(options)
    // global.userAgent = userAgent

    userAgent.on("newRTCSession", (e) => {
      console.log("================== E  ================:", e)
      console.log("================== data.originator  ================:", data?.originator)
      if (data.originator === 'remote') {
      }
       session = e.session;
      console.log("================== DISPLAY NAME   ================:", session?._remote_identity?._display_name)
      console.log("================== USER_NAME   ================:", session?._remote_identity?._uri?._user)
      console.log("================== DIRECTION  ================:", session.direction)
      // user_session = session
      dispatch(storeUserSession(session));
      if (session.direction === 'incoming') {
        // dispatch(changeIncomingAlertState(true));
        const callerId = session.remote_identity.uri.user;
        const displayName = session.remote_identity.display_name || callerId; RNCallKeep.displayIncomingCall(
          'call-uuid', // a unique identifier for this call
          callerId,    // SIP username
          displayName, // caller's display name
          'generic',   // call type ('generic', 'video')
          false         // whether it's video call
        );
        RNCallKeep.setMutedCall('call-uuid', false);


        session.on('accepted', () => {
          // Here, you can show the RTCView and render the remote stream
          console.log("session - accepted")
          let remoteStream = session.connection.getRemoteStreams()[0];
          console.log("remoteStream",remoteStream)
          RNCallKeep.setMutedCall('call-uuid', false);

          // ... render remoteStream using RTCView
        });

        session.on('ended', () => {
          console.log("session - ended")
          RNCallKeep.endCall('call-uuid')
          // Handle call termination
        })

        session.on('failed', response => {
          console.log('Call failed with response: ', response);
          RNCallKeep.endCall('call-uuid')
        });
        session.on('bye', response => {
          console.log('Call failed with response: ', response);
          RNCallKeep.endCall('call-uuid')
        });
      }

    })
    userAgent.on('sending', function (e) {
      console.log('Sending SIP REGISTER request:', e.request);
    });
    userAgent.on('connecting', data => {
      toggleLoading(true);
      console.log('Connecting to SIP server...', data);
    });

    userAgent.on('connected', data => {
      console.log('Connected to SIP server.', data);
      toggleLoading(false);
    });

    userAgent.on('disconnected', data => {
      console.log('Disconnected from SIP server.', data);
      dispatch(storeUseStatus(false));
      toggleLoading(false);
    });

    userAgent.on('registered', () => {
      dispatch(storeUseStatus(true));
      toggleLoading(false);

      console.log('Registered successfully.');
    });


    userAgent.on('unregistered', () => {
      console.log('Unregistered.');
      dispatch(storeUseStatus(false));
      toggleLoading(false);
    });

    userAgent.on('registrationFailed', data => {
      console.error('SIP registration failed:', data);
      dispatch(storeUseStatus(false));
      toggleLoading(false);
    });
    try {
      userAgent.start();
    } catch (error) {
      console.error('Error creating UA:', error);
    }
  };

  const unregisterAccount = () => {
    toggleLoading(true);
    if (userAgent) {
      userAgent.on('unregistered', () => {
        dispatch(storeUseStatus(false));
        toggleLoading(false);
        console.log('Unregistered.');
      });

      userAgent.on('registrationFailed', data => {
        console.error('SIP unregistration failed:', data);
        toggleLoading(false);
      });

      userAgent.unregister();

      userAgent.stop();
      userAgent = null;
    }
  };
  return (
    <SafeAreaView style={{}}>
    </SafeAreaView>
  );
};

export default RegisterAccount;