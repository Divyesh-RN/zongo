/**  Third Party  */
import { showMessage, hideMessage } from "react-native-flash-message";

/**  Constants  */
import { FontSize, REGULAR } from "../constants/Fonts";
import {black, grey, light_grey, white} from "../constants/Color";

export function DisplayMessage({title, description, type, onPress}) {

	showMessage({
		// statusBarHeight:50,
		message: title,
		description: description,
		type: type, // success, warning, info and danger
		duration : 10000,
		icon : type,
		
		style:{marginTop:50,paddingVertical:5},
		textStyle : {fontFamily : REGULAR, fontSize : FontSize.FS_14,color:black},
		titleStyle : {fontSize : FontSize.FS_18, fontFamily : REGULAR, color:black,lineHeight:23},
		backgroundColor:light_grey,
		
		onPress : () => {
			onPress()
		}
	  });
}



export function HideMessage() {
	hideMessage()
}