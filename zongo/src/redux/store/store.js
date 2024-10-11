import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';
import { combineReducers } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messageReducer from '../reducers/messageReducer';
import contactReducer from '../reducers/contactReducer';
import callsReducer from '../reducers/callReducer';
import ringGroupReducer from '../reducers/ringGroupReducer';
import audioReducer from '../reducers/audioReducer';
import generalReducer from '../reducers/generalReducer';
import inboundReducer from '../reducers/inboundReducer';
import autoAttendantReducer from '../reducers/autoAttendantReducer';
import timeBasedRoutingReducer from '../reducers/timeBasedRoutingReducer';
import blockNumberReducer from '../reducers/blockNumberReducer';
import dncListReducer from '../reducers/DncListReducer';
import callCampaignReducer from '../reducers/callCampaignReducer';
import userModuleReducer from '../reducers/userModuleReducer';
import InternalChatReducer from '../reducers/internalChatReducer';
import  eventsReducer  from '../reducers/EventsReducer';

const persistConfig = {
	key: 'root',
	version: 0,
	storage: AsyncStorage,
}
let rootReducer = combineReducers({
	userRedux: userReducer,
	messageRedux: messageReducer,
	contactRedux: contactReducer,
	callRedux: callsReducer,
	ringGroupRedux: ringGroupReducer,
	audioRedux: audioReducer,
	generalRedux: generalReducer,
	inboundRedux: inboundReducer,
	AutoAttendantRedux: autoAttendantReducer,
	TimeBasedRoutingRedux: timeBasedRoutingReducer,
	blockNumberRedux: blockNumberReducer,
	dncListRedux: dncListReducer,
	callCampaignRedux: callCampaignReducer,
	userModuleRedux: userModuleReducer,
	internalChatRedux: InternalChatReducer,
	eventsRedux: eventsReducer
})


let persistedReducer = persistReducer(persistConfig, rootReducer)

export default configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}),
	devTools: process.env.NODE_ENV !== 'production'
})