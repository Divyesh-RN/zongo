import { View, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { PhoneImg } from '../constants/Images'
import { pixelSizeHorizontal, widthPixel } from './ResponsiveScreen'
import { FontSize, MEDIUM, REGULAR } from '../constants/Fonts'
import { black, disableColor, greenPrimary, grey01, grey02, seprator, warmGrey } from '../constants/Color'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { WIDTH } from '../constants/ConstantKey'

const TextInputView = ({ value = "",imageSource, onChangeText, placeholder = "", editable = true, multiline ,containerStyle={},additionalStyle={}, ...props }) => {

    const [isFocused, setIsFocused] = useState(false)


    const onFocus = () => {
        setIsFocused(true)
        props?.onFocusEffect && props?.onFocusEffect()
    }

    const onBlur = () => {
        setIsFocused(false)
        props?.onBlurEffect && props?.onBlurEffect()
    }

    return (
        <View style={[{ 
            flexDirection: 'row',
             alignItems: 'center',
             borderWidth:1,
             borderColor:grey01,
             backgroundColor:"white",
             width:WIDTH-50,
             justifyContent:"space-between",
             paddingHorizontal: pixelSizeHorizontal(15),
             borderRadius:6,
             marginBottom:6,
             marginTop:20
              },{...containerStyle}]}>

            <TextInput
             placeholderTextColor={grey02}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                editable={editable}
                multiline={multiline}
                onFocus={onFocus}
                onBlur={onBlur}
                style={[{
                 fontFamily: REGULAR, fontSize: FontSize.FS_14, color: editable ? black : warmGrey,
                    paddingVertical: pixelSizeHorizontal(10),flex:1,marginRight:10
                },{...additionalStyle}]}
                {...props}
            />
 {imageSource &&
            <Icon  name={imageSource} size={26} color={grey01} /> }
        </View>
        
    )
}

export default TextInputView