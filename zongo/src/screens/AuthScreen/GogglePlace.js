import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { REACT_APP_GOOGLE_API_KEY } from '../../constants/ConstantKey';
import { black, grey01, white } from '../../constants/Color';
import { FontSize, MEDIUM } from '../../constants/Fonts';

const GogglePlace = ({dataa}) => {
  return (
    <GooglePlacesAutocomplete
    fetchDetails={true}
    placeholder='Enter Address'
    getAddressText={(txt) => console.log("2", txt)}
    setAddressText={(txt) => console.log("1", txt)}
    onPress={(data, details = null) => {
      // 'details' is provided when fetchDetails = true
      console.log("s :", details);
      dataa(data)
      console.log("d :", data);
    }}
    onFail={error => console.log(error)}
    onNotFound={() => console.log('no results')}
    query={{
      key: REACT_APP_GOOGLE_API_KEY,
      language: 'en',
    }}
    // predefinedPlaces={[
    //   {
    //     type: 'favorite',
    //     description: 'Dominos Pizza',
    //     geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
    //   },
    //   {
    //     type: 'favorite',
    //     description: 'Chicken Republic',
    //     geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
    //   },
    // ]}
    // listEmptyComponent={() => (
    //   <View style={{flex: 1}}>
    //     <Text>No results were found</Text>
    //   </View>
    // )}
    // listViewDisplayed={false}
    keepResultsAfterBlur={true}
    styles={{
      textInputContainer: {
        backgroundColor: white,

        // height: 38,
      },
      textInput: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: grey01,
        height: 38,
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
      },
      predefinedPlacesDescription: {
        color: '#1faadb',
      },
    }}
  />
  )
}

export default GogglePlace

const styles = StyleSheet.create({})