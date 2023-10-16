import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import Translate from '../translation/Translate'
import { FontSize, SEMIBOLD } from '../constants/Fonts'
import { midGreen, white } from '../constants/Color'

const PrimaryButton = ({text,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}
     style={{
        backgroundColor:midGreen,
        paddingVertical:10,
        borderRadius:6,
        alignItems:"center",
        marginVertical:28
      }}>
      <Text style={{
        color:white,
        fontSize:FontSize.FS_20,
        fontFamily:SEMIBOLD,
      }}>{Translate.t(text)}</Text>
      </TouchableOpacity>
  )
}

export default PrimaryButton