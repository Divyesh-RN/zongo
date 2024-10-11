// IncomingCall.js

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BOLD, FontSize, MEDIUM, SEMIBOLD } from '../../constants/Fonts';
import { black, greenPrimary, grey, white } from '../../constants/Color';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { mediaDevices } from 'react-native-webrtc';

const IncomingCall = ({ callerName,callerNumber, onDismiss, onAnswer }) => {

  useEffect(() =>{
    mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => { })
    .catch((error) => {
      console.error("Error accessing the microphone: " + error);
    });
  },[])

 
  return (
    <View style={styles.container}>
        <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:20}}>
        <View style={{width:30,height:30,backgroundColor:grey,borderRadius:50,alignItems:"center",justifyContent:"center"}}>
        <Icon name="phone-in-talk" size={18} color={white} />
        </View>
        <View style={{marginLeft:10}}>
      <Text style={{
            fontSize:FontSize.FS_12,
            fontFamily:MEDIUM,
            color:black,
        }}>{callerName} is calling...</Text>
         <Text style={{
            fontSize:FontSize.FS_12,
            fontFamily:MEDIUM,
            color:black,
        }}>{"incoming via " + callerNumber}</Text>
        </View>
        </View>

      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
      <TouchableOpacity style={styles.button} onPress={onDismiss}>
        <Text style={{
            fontSize:FontSize.FS_13,
            fontFamily:BOLD,
            color:black
        }}>Dismiss</Text>
      </TouchableOpacity>
      <View style={{width:1.5,height:15,backgroundColor:grey}}></View>

      <TouchableOpacity style={styles.button} onPress={onAnswer}>
        <Text style={{
            fontSize:FontSize.FS_13,
            fontFamily:BOLD,
            color:black
        }}>Answer</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    marginTop:"6%",
    paddingVertical: 16,
    paddingVertical: 16,
    backgroundColor: white,
    borderRadius: 8,
    elevation: 4,
  },
  button: {
    flex:1,
    marginBottom: 8,
    marginTop:20,
    paddingVertical: 12,
    // backgroundColor: '#3498db',
    borderRadius: 4,
    alignItems: 'center',
  },
});

export default IncomingCall;
