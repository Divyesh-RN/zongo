import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Blocked_Numbers_List, Create_Blocked_Numbers, Delete_Blocked_Numbers, Delete_Multiple_Blocked_Numbers, Get_Blocked_Numbers_Settings, Get_Export_Blocked_Numbers, Get_Number_Map_Fields, Import_Numbers_Csv, Update_Blocked_Numbers, Update_Blocked_Numbers_Settings } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const blockNumberReducer = createSlice({
  name: 'blockNumberRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    blocked_numbers: null,
    blocked_numbers_setting: null,
    export_blocked_numbers: null,
    map_blocked_numbers: null,
    apiBlockNumbersList: STATUS_IDLE,
    apiGetBlockedNumbersSetting: STATUS_IDLE,
    apiUpdateBlockedNumbersSetting: STATUS_IDLE,
    apiCreateBlockedNumber: STATUS_IDLE,
    apiDeleteBlockedNumber: STATUS_IDLE,
    apiUpdateBlockedNumber: STATUS_IDLE,
    apiDeleteMultipleBlockedNumber: STATUS_IDLE,
    apiGetExportBlockedNumbers: STATUS_IDLE,
    apiBlockNumbersCsv: STATUS_IDLE,
    apiGetNumbersMapFields: STATUS_IDLE,

  },

  reducers: {
    resetBlockNumbersApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiBlockNumbersList = STATUS_IDLE);
        (state.apiGetBlockedNumbersSetting = STATUS_IDLE);
        (state.apiUpdateBlockedNumbersSetting = STATUS_IDLE);
        (state.apiCreateBlockedNumber = STATUS_IDLE);
        (state.apiDeleteBlockedNumber = STATUS_IDLE);
        (state.apiUpdateBlockedNumber = STATUS_IDLE);
        (state.apiDeleteMultipleBlockedNumber = STATUS_IDLE);
        (state.apiGetExportBlockedNumbers = STATUS_IDLE);
        (state.apiBlockNumbersCsv = STATUS_IDLE);
        (state.apiGetNumbersMapFields = STATUS_IDLE);
    },
    clearBlockNumbersData: state => {
      state.blocked_numbers = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Blocked_Numbers_List.pending, (state, action) => {
      state.apiBlockNumbersList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Blocked_Numbers_List.fulfilled, (state, action) => {
      Log('Blocked_Numbers_List fulfilled : ', JSON.stringify(action));
      state.apiBlockNumbersList = STATUS_FULFILLED;
      state.isLoader = false;
      state.blocked_numbers = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Blocked_Numbers_List.rejected, (state, action) => {
      Log('Blocked_Numbers_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiBlockNumbersList = STATUS_REJECTED;
    });

    builder.addCase(Get_Blocked_Numbers_Settings.pending, (state, action) => {
        state.apiGetBlockedNumbersSetting = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Blocked_Numbers_Settings.fulfilled, (state, action) => {
        Log('Get_Blocked_Numbers_Settings fulfilled : ', JSON.stringify(action));
        state.apiGetBlockedNumbersSetting = STATUS_FULFILLED;
        state.isLoader = false;
        state.blocked_numbers_setting = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Blocked_Numbers_Settings.rejected, (state, action) => {
        Log('Get_Blocked_Numbers_Settings rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetBlockedNumbersSetting = STATUS_REJECTED;
      });

      builder.addCase(Update_Blocked_Numbers_Settings.pending, (state, action) => {
        state.apiUpdateBlockedNumbersSetting = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Blocked_Numbers_Settings.fulfilled, (state, action) => {
        Log('Update_Blocked_Numbers_Settings fulfilled : ', JSON.stringify(action));
        state.apiUpdateBlockedNumbersSetting = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Blocked_Numbers_Settings.rejected, (state, action) => {
        Log('Update_Blocked_Numbers_Settings rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateBlockedNumbersSetting = STATUS_REJECTED;
      });

      builder.addCase(Create_Blocked_Numbers.pending, (state, action) => {
        state.apiCreateBlockedNumber = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Create_Blocked_Numbers.fulfilled, (state, action) => {
        Log('Create_Blocked_Numbers fulfilled : ', JSON.stringify(action));
        state.apiCreateBlockedNumber = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Create_Blocked_Numbers.rejected, (state, action) => {
        Log('Create_Blocked_Numbers rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiCreateBlockedNumber = STATUS_REJECTED;
      });

      builder.addCase(Delete_Blocked_Numbers.pending, (state, action) => {
        state.apiDeleteBlockedNumber = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Blocked_Numbers.fulfilled, (state, action) => {
        Log('Delete_Blocked_Numbers fulfilled : ', JSON.stringify(action));
        state.apiDeleteBlockedNumber = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Blocked_Numbers.rejected, (state, action) => {
        Log('Delete_Blocked_Numbers rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiDeleteBlockedNumber = STATUS_REJECTED;
      });

      builder.addCase(Update_Blocked_Numbers.pending, (state, action) => {
        state.apiUpdateBlockedNumber = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Blocked_Numbers.fulfilled, (state, action) => {
        Log('Update_Blocked_Numbers fulfilled : ', JSON.stringify(action));
        state.apiUpdateBlockedNumber = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Blocked_Numbers.rejected, (state, action) => {
        Log('Update_Blocked_Numbers rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateBlockedNumber = STATUS_REJECTED;
      });

      builder.addCase(Delete_Multiple_Blocked_Numbers.pending, (state, action) => {
        state.apiDeleteMultipleBlockedNumber = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Multiple_Blocked_Numbers.fulfilled, (state, action) => {
        Log('Delete_Multiple_Blocked_Numbers fulfilled : ', JSON.stringify(action));
        state.apiDeleteMultipleBlockedNumber = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Multiple_Blocked_Numbers.rejected, (state, action) => {
        Log('Delete_Multiple_Blocked_Numbers rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiDeleteMultipleBlockedNumber = STATUS_REJECTED;
      });

      builder.addCase(Get_Export_Blocked_Numbers.pending, (state, action) => {
        state.apiGetExportBlockedNumbers = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Export_Blocked_Numbers.fulfilled, (state, action) => {
        Log('Get_Export_Blocked_Numbers fulfilled : ', JSON.stringify(action));
        state.apiGetExportBlockedNumbers = STATUS_FULFILLED;
        state.isLoader = false;
        state.export_blocked_numbers = action.payload?.data?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Export_Blocked_Numbers.rejected, (state, action) => {
        Log('Get_Export_Blocked_Numbers rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetExportBlockedNumbers = STATUS_REJECTED;
      });

      builder.addCase(Import_Numbers_Csv.pending, (state, action) => {
        state.apiBlockNumbersCsv = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Import_Numbers_Csv.fulfilled, (state, action) => {
        Log('Import_Numbers_Csv fulfilled : ', JSON.stringify(action));
        state.apiBlockNumbersCsv = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Import_Numbers_Csv.rejected, (state, action) => {
        Log('Import_Numbers_Csv rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiBlockNumbersCsv = STATUS_REJECTED;
      });

      builder.addCase(Get_Number_Map_Fields.pending, (state, action) => {
        state.apiGetNumbersMapFields = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Number_Map_Fields.fulfilled, (state, action) => {
        Log('Get_Number_Map_Fields fulfilled : ', JSON.stringify(action));
        state.apiGetNumbersMapFields = STATUS_FULFILLED;
        state.isLoader = false;
        state.map_blocked_numbers = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Number_Map_Fields.rejected, (state, action) => {
        Log('Get_Number_Map_Fields rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetNumbersMapFields = STATUS_REJECTED;
      });
  },
});

// Action creators are generated for each case reducer function
export const {clearBlockNumbersData, resetBlockNumbersApiStatus} = blockNumberReducer.actions;


export default blockNumberReducer.reducer;
