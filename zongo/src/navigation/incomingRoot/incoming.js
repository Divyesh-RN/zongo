// Incoming.js

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IncomingCall from './IncomingCall';
import { WIDTH } from '../../constants/ConstantKey';
import { transparent } from '../../constants/Color';
import global from '../../constants/Global';
import { navigate } from '../RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { incomingAlert } from '../../commonComponents/commonMethod';
import { changeIncomingAlertState } from '../../redux/reducers/userReducer';

const Incoming = () => {

    const incoming_call_alert = useSelector(state => state.userRedux.incoming_call_alert);
    const dispatch = useDispatch()

    const handleDismiss = () => {
        if(global.session !== null){
            global.session.terminate();
            dispatch(changeIncomingAlertState(false));
        }
        else{
            dispatch(changeIncomingAlertState(false));
        }
    };

    const handleAnswer = () => {
        console.log("global.session :", global.session)
        if (global.session !== null) {
            const options = {
                mediaConstraints: {
                    audio: true,
                    video: false,
                },
            };
            global.session.answer(options);
              navigate("InComingCallScreen", { item: null, from: "INCOMING" })
            dispatch(changeIncomingAlertState(false));
        }
        else{
            dispatch(changeIncomingAlertState(false));
        }
    };

    return (

        <>
            {incoming_call_alert == true &&
                <TouchableOpacity
                    style={{ backgroundColor: transparent, width: WIDTH, height: 200, position: "absolute" }}
                >


                    <IncomingCall
                        callerName={global.session?._remote_identity?._display_name}
                        callerNumber={global.session?._remote_identity?._uri?._user}
                        onDismiss={handleDismiss}
                        onAnswer={handleAnswer}
                    />
                </TouchableOpacity>
            }

        </>
    );
};

export default Incoming;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 4,
        position: "absolute",
        width: WIDTH,
        height: 200
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#3498db',
        borderRadius: 4,
        alignItems: 'center',
    },
});

