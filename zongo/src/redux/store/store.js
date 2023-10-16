import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../reducers/userReducer'
import { combineReducers } from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
	key: 'root',
	version: 0,
	storage : AsyncStorage,
}
let rootReducer = combineReducers({
	userRedux: userReducer,
})


let persistedReducer = persistReducer(persistConfig,rootReducer)

export default configureStore({
	reducer: persistedReducer,
	middleware:(getDefaultMiddleware)=>
	getDefaultMiddleware({
		serializableCheck: false,
	})
})