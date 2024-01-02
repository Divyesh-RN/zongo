import React, { Component } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';

/*  Constant Files */
import { black, white, black03, primary, greenPrimary } from '../constants/Color';
import { FontSize, REGULAR } from '../constants/Fonts';

const LoadingView = (props) => {

	return (
		<View style={styles.container}>
			<View style={styles.indicatorView}>

				<ActivityIndicator size={'large'} color={greenPrimary} />
				{props.text !== '' && props.text !== undefined ?
					<Text style={styles.text} numberOfLines={2}>
						{props.text}
					</Text>
					: null}
			</View>
		</View>

	);
}


const styles = StyleSheet.create({
	container: {
		left : 0, right : 0, bottom : 0, top : 0, backgroundColor: black03, alignItems: 'center', justifyContent: 'center', position: 'absolute'
	},
	indicatorView: {
		borderRadius: 10, shadowColor: black03, backgroundColor: white,
		justifyContent: 'center', alignItems: 'center', padding: FontSize.FS_25,
		shadowOffset: { width: 0, height: 2 }, maxWidth: 150, maxHeight: 150,
		shadowOpacity: 0.4,
		shadowRadius: 4,
		elevation: 5
	},
	text: {
		margin: 5, fontSize: FontSize.FS_14, color: black, fontFamily: REGULAR
	}
})

export default LoadingView