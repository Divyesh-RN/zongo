import { createSlice } from '@reduxjs/toolkit';
import { Copy_Time_Slot, Create_Time_Slot, Delete_Time_Based_Routing, Delete_Time_Slot, Delete_Time_Slot_Event, Get_Business_Hours_Time_Details, Get_Time_Based_Routing_Details, Get_Time_Based_Routing_List, Get_Time_Slot_Details_Events, Get_Time_Slot_Events_Perticular, Update_Time_Condition, Update_Time_Slot, Update_Time_Slot_Weekly } from '../api/Api';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Log } from '../../commonComponents/Log';

export const timeBasedRoutingReducer = createSlice({
  name: 'TimeBasedRoutingRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    time_based_routing_list: null,
    time_based_routing_details: null,
    time_slot_details_events: null,
    business_hours_time_details: null,
    time_slot_details_events_particular: null,
    apiTimeBasedRoutingList: STATUS_IDLE,
    apiDeleteTimeBasedRouting: STATUS_IDLE,
    apiGetTimeBasedRoutingDetails: STATUS_IDLE,
    apiGetTimeSlotDetailsEvents: STATUS_IDLE,
    apiGetBusinessHoursTimeDetails: STATUS_IDLE,
    apiCreateTimeSlot: STATUS_IDLE,
    apiDeleteTimeSlot: STATUS_IDLE,
    apiUpdateTimeCondition: STATUS_IDLE,
    apiUpdateTimeSlotWeekly: STATUS_IDLE,
    apiGetTimeSlotEventsPerticular: STATUS_IDLE,
    apiUpdateTimeSlot: STATUS_IDLE,
    apiDeleteTimeSlotEvent: STATUS_IDLE,
    apiCopyTimeSlot: STATUS_IDLE

  },

  reducers: {
    resetTimeBasedRoutingApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiTimeBasedRoutingList = STATUS_IDLE),
        (state.apiDeleteTimeBasedRouting = STATUS_IDLE),
        (state.apiGetTimeBasedRoutingDetails = STATUS_IDLE),
        (state.apiGetTimeSlotDetailsEvents = STATUS_IDLE),
        (state.apiGetBusinessHoursTimeDetails = STATUS_IDLE),
        (state.apiCreateTimeSlot = STATUS_IDLE),
        (state.apiDeleteTimeSlot = STATUS_IDLE),
        (state.apiDeleteTimeSlotEvent = STATUS_IDLE),
        (state.apiUpdateTimeCondition = STATUS_IDLE),
        (state.apiUpdateTimeSlotWeekly = STATUS_IDLE),
        (state.apiGetTimeSlotEventsPerticular = STATUS_IDLE),
        (state.apiUpdateTimeSlot = STATUS_IDLE),
        (state.apiCopyTimeSlot = STATUS_IDLE)
        
    },
    clearTimeBasedRoutingData: state => {
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Time_Based_Routing_List.pending, (state, action) => {
      state.apiTimeBasedRoutingList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Based_Routing_List.fulfilled, (state, action) => {
      // Log('Get_Time_Based_Routing_List fulfilled : ', JSON.stringify(action));
      state.apiTimeBasedRoutingList = STATUS_FULFILLED;
      state.isLoader = false;
      state.time_based_routing_list = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Based_Routing_List.rejected, (state, action) => {
      Log('Get_Time_Based_Routing_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiTimeBasedRoutingList = STATUS_REJECTED;
    });

    builder.addCase(Delete_Time_Based_Routing.pending, (state, action) => {
      state.apiDeleteTimeBasedRouting = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Time_Based_Routing.fulfilled, (state, action) => {
      // Log('Delete_Time_Based_Routing fulfilled : ', JSON.stringify(action));
      state.apiDeleteTimeBasedRouting = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Time_Based_Routing.rejected, (state, action) => {
      Log('Delete_Time_Based_Routing rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteTimeBasedRouting = STATUS_REJECTED;
    });

    builder.addCase(Get_Time_Based_Routing_Details.pending, (state, action) => {
      state.apiGetTimeBasedRoutingDetails = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Based_Routing_Details.fulfilled, (state, action) => {
      // Log('Get_Time_Based_Routing_Details fulfilled : ', JSON.stringify(action));
      state.apiGetTimeBasedRoutingDetails = STATUS_FULFILLED;
      state.isLoader = false;
      state.time_based_routing_details = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Based_Routing_Details.rejected, (state, action) => {
      Log('Get_Time_Based_Routing_Details rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetTimeBasedRoutingDetails = STATUS_REJECTED;
    });

    builder.addCase(Get_Time_Slot_Details_Events.pending, (state, action) => {
      state.apiGetTimeSlotDetailsEvents = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Slot_Details_Events.fulfilled, (state, action) => {
      // Log('Get_Time_Slot_Details_Events fulfilled : ', JSON.stringify(action));
      state.apiGetTimeSlotDetailsEvents = STATUS_FULFILLED;
      state.isLoader = false;
      state.time_slot_details_events = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Slot_Details_Events.rejected, (state, action) => {
      Log('Get_Time_Slot_Details_Events rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetTimeSlotDetailsEvents = STATUS_REJECTED;
    });

    builder.addCase(Get_Business_Hours_Time_Details.pending, (state, action) => {
      state.apiGetBusinessHoursTimeDetails = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Business_Hours_Time_Details.fulfilled, (state, action) => {
      // Log('Get_Business_Hours_Time_Details fulfilled : ', JSON.stringify(action));
      state.apiGetBusinessHoursTimeDetails = STATUS_FULFILLED;
      state.isLoader = false;
      state.business_hours_time_details = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Business_Hours_Time_Details.rejected, (state, action) => {
      Log('Get_Business_Hours_Time_Details rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetBusinessHoursTimeDetails = STATUS_REJECTED;
    });

    builder.addCase(Create_Time_Slot.pending, (state, action) => {
      state.apiCreateTimeSlot = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Time_Slot.fulfilled, (state, action) => {
      // Log('Create_Time_Slot fulfilled : ', JSON.stringify(action));
      state.apiCreateTimeSlot = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Time_Slot.rejected, (state, action) => {
      Log('Create_Time_Slot rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiCreateTimeSlot = STATUS_REJECTED;
    });

    builder.addCase(Delete_Time_Slot.pending, (state, action) => {
      state.apiDeleteTimeSlot = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Time_Slot.fulfilled, (state, action) => {
      // Log('Delete_Time_Slot fulfilled : ', JSON.stringify(action));
      state.apiDeleteTimeSlot = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Time_Slot.rejected, (state, action) => {
      Log('Delete_Time_Slot rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteTimeSlot = STATUS_REJECTED;
    });

    builder.addCase(Update_Time_Condition.pending, (state, action) => {
      state.apiUpdateTimeCondition = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Time_Condition.fulfilled, (state, action) => {
      // Log('Update_Time_Condition fulfilled : ', JSON.stringify(action));
      state.apiUpdateTimeCondition = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Time_Condition.rejected, (state, action) => {
      Log('Update_Time_Condition rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateTimeCondition = STATUS_REJECTED;
    });

    builder.addCase(Update_Time_Slot_Weekly.pending, (state, action) => {
      state.apiUpdateTimeSlotWeekly = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Time_Slot_Weekly.fulfilled, (state, action) => {
      // Log('Update_Time_Slot_Weekly fulfilled : ', JSON.stringify(action));
      state.apiUpdateTimeSlotWeekly = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Time_Slot_Weekly.rejected, (state, action) => {
      Log('Update_Time_Slot_Weekly rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateTimeSlotWeekly = STATUS_REJECTED;
    });

    builder.addCase(Get_Time_Slot_Events_Perticular.pending, (state, action) => {
      state.apiGetTimeSlotEventsPerticular = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Slot_Events_Perticular.fulfilled, (state, action) => {
      // Log('Get_Time_Slot_Events_Perticular fulfilled : ', JSON.stringify(action));
      state.apiGetTimeSlotEventsPerticular = STATUS_FULFILLED;
      state.isLoader = false;
      state.time_slot_details_events_particular = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Time_Slot_Events_Perticular.rejected, (state, action) => {
      Log('Get_Time_Slot_Events_Perticular rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetTimeSlotEventsPerticular = STATUS_REJECTED;
    });

    builder.addCase(Update_Time_Slot.pending, (state, action) => {
      state.apiUpdateTimeSlot = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Time_Slot.fulfilled, (state, action) => {
      // Log('Update_Time_Slot fulfilled : ', JSON.stringify(action));
      state.apiUpdateTimeSlot = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Time_Slot.rejected, (state, action) => {
      Log('Update_Time_Slot rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateTimeSlot = STATUS_REJECTED;
    });

    builder.addCase(Delete_Time_Slot_Event.pending, (state, action) => {
      state.apiDeleteTimeSlotEvent = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Time_Slot_Event.fulfilled, (state, action) => {
      // Log('Delete_Time_Slot_Event fulfilled : ', JSON.stringify(action));
      state.apiDeleteTimeSlotEvent = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Time_Slot_Event.rejected, (state, action) => {
      Log('Delete_Time_Slot_Event rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteTimeSlotEvent = STATUS_REJECTED;
    });

    builder.addCase(Copy_Time_Slot.pending, (state, action) => {
      state.apiCopyTimeSlot = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Copy_Time_Slot.fulfilled, (state, action) => {
      // Log('Copy_Time_Slot fulfilled : ', JSON.stringify(action));
      state.apiCopyTimeSlot = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Copy_Time_Slot.rejected, (state, action) => {
      Log('Copy_Time_Slot rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiCopyTimeSlot = STATUS_REJECTED;
    });

  },
});

// Action creators are generated for each case reducer function
export const { clearTimeBasedRoutingData, resetTimeBasedRoutingApiStatus } = timeBasedRoutingReducer.actions;


export default timeBasedRoutingReducer.reducer;
