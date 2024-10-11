import {createSlice} from '@reduxjs/toolkit';
import {
  STATUS_FULFILLED,
  STATUS_IDLE,
  STATUS_PENDING,
  STATUS_REJECTED,
} from '../../constants/ConstantKey';
import {Get_Did_Routing, Get_Inbound_Number_List, Get_Number, Get_Prefix, Onboarding_Buy_Did, Update_Inbound_Number, Update_Inbound_Number_Route} from '../api/Api';
import {Log} from '../../commonComponents/Log';

export const InboundReducer = createSlice({
  name: 'inboundRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    inbound_number_list:null,
    prefix_list:null,
    number_list:null,
    did_routing_data:null,
    apiGetInboundNumbersList: STATUS_IDLE,
    apiUpdateInboundNumberRoute: STATUS_IDLE,
    apiGetPrefix: STATUS_IDLE,
    apiGetDidRouting: STATUS_IDLE,
    apiUpdateInboundNumber: STATUS_IDLE,
    apiGetNumberList: STATUS_IDLE,
    apiBuyDid: STATUS_IDLE,

  },

  reducers: {
    resetInboundApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetInboundNumbersList = STATUS_IDLE);
        (state.apiUpdateInboundNumberRoute = STATUS_IDLE);
        (state.apiUpdateInboundNumber = STATUS_IDLE);
        (state.apiGetPrefix= STATUS_IDLE);
        (state.apiGetDidRouting = STATUS_IDLE);
        (state.apiGetNumberList = STATUS_IDLE);
        (state.apiBuyDid = STATUS_IDLE);
    },
    clearInboundData: state => {
      state.inbound_number_list = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Inbound_Number_List.pending, (state, action) => {
      state.apiGetInboundNumbersList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Inbound_Number_List.fulfilled, (state, action) => {
      Log('Get_Inbound_Number_List fulfilled : ', JSON.stringify(action));
      state.apiGetInboundNumbersList = STATUS_FULFILLED;
      state.isLoader = false;
      state.inbound_number_list = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Inbound_Number_List.rejected, (state, action) => {
      Log('Get_Inbound_Number_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetInboundNumbersList = STATUS_REJECTED;
    });

    builder.addCase(Update_Inbound_Number_Route.pending, (state, action) => {
        state.apiUpdateInboundNumberRoute = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Inbound_Number_Route.fulfilled, (state, action) => {
        Log('Update_Inbound_Number_Route fulfilled : ', JSON.stringify(action));
        state.apiUpdateInboundNumberRoute = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Inbound_Number_Route.rejected, (state, action) => {
        Log('Update_Inbound_Number_Route rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateInboundNumberRoute = STATUS_REJECTED;
      });

      builder.addCase(Get_Prefix.pending, (state, action) => {
        state.apiGetPrefix = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Prefix.fulfilled, (state, action) => {
        Log('Get_Prefix fulfilled : ', JSON.stringify(action));
        state.apiGetPrefix = STATUS_FULFILLED;
        state.isLoader = false;
        state.prefix_list = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Prefix.rejected, (state, action) => {
        Log('Get_Prefix rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetPrefix = STATUS_REJECTED;
      });

      builder.addCase(Get_Did_Routing.pending, (state, action) => {
        state.apiGetDidRouting = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Did_Routing.fulfilled, (state, action) => {
        Log('Get_Did_Routing fulfilled : ', JSON.stringify(action));
        state.apiGetDidRouting = STATUS_FULFILLED;
        state.isLoader = false;
        state.did_routing_data = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Did_Routing.rejected, (state, action) => {
        Log('Get_Did_Routing rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetDidRouting = STATUS_REJECTED;
      });

      builder.addCase(Update_Inbound_Number.pending, (state, action) => {
        state.apiUpdateInboundNumber = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Inbound_Number.fulfilled, (state, action) => {
        Log('Update_Inbound_Number fulfilled : ', JSON.stringify(action));
        state.apiUpdateInboundNumber = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Inbound_Number.rejected, (state, action) => {
        Log('Update_Inbound_Number rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateInboundNumber = STATUS_REJECTED;
      });

      builder.addCase(Get_Number.pending, (state, action) => {
        state.apiGetNumberList = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Number.fulfilled, (state, action) => {
        Log('Get_Number fulfilled : ', JSON.stringify(action));
        state.apiGetNumberList = STATUS_FULFILLED;
        state.isLoader = false;
        state.number_list = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Number.rejected, (state, action) => {
        Log('Get_Number rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetNumberList = STATUS_REJECTED;
      });

      builder.addCase(Onboarding_Buy_Did.pending, (state, action) => {
        state.apiBuyDid = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Onboarding_Buy_Did.fulfilled, (state, action) => {
        Log('Onboarding_Buy_Did fulfilled : ', JSON.stringify(action));
        state.apiBuyDid = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Onboarding_Buy_Did.rejected, (state, action) => {
        Log('Onboarding_Buy_Did rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiBuyDid = STATUS_REJECTED;
      });


  },
});

// Action creators are generated for each case reducer function
export const {clearInboundData, resetInboundApiStatus} = InboundReducer.actions;


export default InboundReducer.reducer;
