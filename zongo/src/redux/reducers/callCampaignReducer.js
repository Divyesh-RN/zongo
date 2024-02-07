import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Get_Call_Campaign_List } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const callCampaignReducer = createSlice({
  name: 'callCampaignRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    call_campaign_list: null,
    apiGetCallCampaignList: STATUS_IDLE,
  },

  reducers: {
    resetCallCampaignApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetCallCampaignList = STATUS_IDLE);
    },
    storeCallsData: (state, action) => {
      state.call_campaign_list = action.payload;
    },
    clearData: state => {
      state.call_campaign_list = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Call_Campaign_List.pending, (state, action) => {
      state.apiGetCallCampaignList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Call_Campaign_List.fulfilled, (state, action) => {
      Log('Get_Call_Campaign_List fulfilled : ', JSON.stringify(action));
      state.apiGetCallCampaignList = STATUS_FULFILLED;
      state.isLoader = false;
      state.call_campaign_list = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Call_Campaign_List.rejected, (state, action) => {
      Log('Get_Call_Campaign_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetCallCampaignList = STATUS_REJECTED;
    });


  
  },
});

// Action creators are generated for each case reducer function
export const {storeCallsData, clearData, resetCallCampaignApiStatus} = callCampaignReducer.actions;


export default callCampaignReducer.reducer;
