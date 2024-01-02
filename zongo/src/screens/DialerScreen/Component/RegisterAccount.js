import React, { useEffect } from 'react';
import {
  SafeAreaView
} from 'react-native';
import JsSIP from 'jssip';
import { useDispatch } from 'react-redux';
import { storeUseStatus } from '../../../redux/reducers/userReducer';
import global from '../../../constants/Global';
let userAgent = null;
let session = null;

const RegisterAccount = ({ toggleLoading, registerData }) => {
console.log("registerData",registerData)
  const dispatch = useDispatch()

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


  const registerAccount = data => {


    JsSIP.debug.enable('JsSIP:*');

    var socket = new JsSIP.WebSocketInterface(data?.WebsoketUrl
      // , {
    //   eventHandlers: {
    //     connected: () => {
    //       console.log('WebSocket connected');
    //     },
    //     disconnected: () => {
    //       console.log('WebSocket disconnected');
    //     },
    //   },
    //   requestOptions: {
    //     rejectUnauthorized: false,
    //   },
    // }
    );
    //     if (typeof TextDecoder === 'undefined') {
    //   global.TextDecoder = class {
    //     constructor() {
    //       this.decoder = new TextDecoder('utf-8', { fatal: true });
    //     }

    //     decode(data) {
    //       return this.decoder.decode(data);
    //     }
    //   };
    // }

    console.log('WebSocket connection:', socket);
    console.log("WebSocket", data?.WebsoketUrl)
    // const config = {
    //   uri: data?.PublicIdentity,
    //   authorization_user: data?.PrivateIdentity,
    //   password: data?.Password,
    //   display_name: data?.DisplayName,
    //   transportOptions: {
    //     wsServers: [data?.WebsoketUrl],
    //   },
    //   sockets: [socket],
    //   realm: data?.Realm,
    //   session_timers: true,
    //   session_timers_refresh_method: 'UPDATE',
    //   session_timers_expires: 120,
    //   register: true,
    //   traceSip: true, // Enable SIP logging
    //   use_preloaded_route: true,
    //   with_react_native: true,
    //   contact_uri: 'sip:' + data?.PrivateIdentity + '@' + data?.Realm, // Set your desired contact URI

    // };
   const  url = data?.Realm + ":7443"
   console.log("url :",url)
       const config = {
      uri: data?.PublicIdentity,
      authorizationUser: data?.PrivateIdentity,
      password: data?.Password,
      // transportOptions: {
      //   wsServers: [data?.WebsoketUrl],
      // },
      // wsServers: [url],
      sockets: [socket],

      displayName: "Test",

      // realm: data?.Realm,
      // session_timers: true,
      // session_timers_refresh_method: 'UPDATE',
      // session_timers_expires: 120,
      // hackIpInContact: true,
      // hackWssInTransport: true,
      // register: true,
      // traceSip: true, // Enable SIP logging
      // use_preloaded_route: true,
      // with_react_native: true,
      // contact_uri: 'sip:' + data?.PrivateIdentity + '@' + data?.Realm, // Set your desired contact URI
      // rtcpMuxPolicy: "negotiate",
      // rel100: "none",

    };
    userAgent = new JsSIP.UA(config);
    console.log('User Agent', userAgent);
    global.userAgent = userAgent

    userAgent.on("newRTCSession", (e) => {
      console.log("================== E  ================:", e)
      console.log("================== data.originator  ================:", data?.originator)
      if (data.originator === 'remote') {
      }
      const session = e.session;
      console.log("================== session 11  ================:", session)
      console.log("================== session 1  ================:", session.direction)
      if (session.direction === 'incoming') {
        // Display some UI to the user to accept or reject the call
        // For demonstration purposes, let's automatically answer
        session.answer();

        session.on('accepted', () => {
          // Here, you can show the RTCView and render the remote stream
          let remoteStream = session.connection.getRemoteStreams()[0];
          // ... render remoteStream using RTCView
        });

        session.on('ended', () => {
          // Handle call termination
        })
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
    userAgent.on('sipEvent', (e) => {
      console.log("DATA : ", e)
      if (e.name === 'sipEvent::unauthorized') {
        const response = e.response;

        const authenticateHeader = response.headers['www-authenticate'];

        // Retrieve the authentication credentials (username and password) from configuration
        const username = data.PrivateIdentity;
        const password = data.Password;
        // Generate the authorization header using the authenticateHeader and credentials
        const authorizationHeader = JsSIP.Utils.createAuthorizationHeader({
          method: 'REGISTER',
          uri: data.PublicIdentity,
          username,
          password,
          cnonce: JsSIP.Utils.createRandomToken(12),
          nc: '00000001',
          realm: authenticateHeader.realm,
          nonce: authenticateHeader.nonce,
          qop: authenticateHeader.qop,
          algorithm: authenticateHeader.algorithm,
        });

        // Set the authorization header and resend the request
        const request = userAgent.createRequest('REGISTER', true);
        request.setHeader('Authorization', authorizationHeader);
        userAgent.sendRequest(request);
      }
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

  const answerCall = () => {
    if (session) {
      const options = {
        mediaConstraints: {
          audio: true, // Adjust media constraints as needed
        },
      };

      session.answer(options);
    }
  };
  return (
    <SafeAreaView style={{}}>
    </SafeAreaView>
  );
};

export default RegisterAccount;