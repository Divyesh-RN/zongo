import { createSlice } from '@reduxjs/toolkit'




export const userReducer = createSlice({
	name: 'userRedux',
	initialState: {
		user_data: null,
	},
	
	reducers: {
		storeUserData: (state, action) => {
			state.user_data = action.payload
		},
		clearData: (state) => {
			state.user_data= null
		},
	},
})

// Action creators are generated for each case reducer function
export const { storeUserData,clearData } = userReducer.actions

export const user_data = (state) => state.userRedux.user_data

export default userReducer.reducer