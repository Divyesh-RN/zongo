import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Create_Dnc_List, Delete_Dnc_List, Delete_Multiple_Dnc_List, Get_Dnc_Csv_Maping_fields, Get_Dnc_List, Import_Dnc__Csv, Insert_Dnc_Csv_Data } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const dncListReducer = createSlice({
    name: 'dncListRedux',
    initialState: {
        isLoader: false,
        isError: false,
        error_message: '',

        dnc_list: null,
        dnc_csv_file: null,
        dnc_csv_file_map_fields: null,
        apiGetDncList: STATUS_IDLE,
        apiCreateDncList: STATUS_IDLE,
        apiImportDncCsv: STATUS_IDLE,
        apiDncCsvMappingFields: STATUS_IDLE,
        apiInsertDncCsvData: STATUS_IDLE,
        apiDeleteDncList: STATUS_IDLE,
        apiDeleteMultipleDncList: STATUS_IDLE,

    },

    reducers: {
        resetDncListApiStatus: (state, action) => {
            (state.isLoader = false),
                (state.isError = false),
                (state.error_message = ''),
                (state.apiGetDncList = STATUS_IDLE);
            (state.apiCreateDncList = STATUS_IDLE);
            (state.apiImportDncCsv = STATUS_IDLE);
            (state.apiDncCsvMappingFields = STATUS_IDLE);
            (state.apiInsertDncCsvData = STATUS_IDLE);
            (state.apiDeleteDncList = STATUS_IDLE);
            (state.apiDeleteMultipleDncList = STATUS_IDLE);
        },
        storeCallsData: (state, action) => {
            state.dnc_list = action.payload;
        },
        clearData: state => {
            state.dnc_list = null;
        },
    },
    extraReducers: builder => {
        builder.addCase(Get_Dnc_List.pending, (state, action) => {
            state.apiGetDncList = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_Dnc_List.fulfilled, (state, action) => {
            Log('Get_Dnc_List fulfilled : ', JSON.stringify(action));
            state.apiGetDncList = STATUS_FULFILLED;
            state.isLoader = false;
            state.dnc_list = action.payload?.data?.data;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_Dnc_List.rejected, (state, action) => {
            Log('Get_Dnc_List rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiGetDncList = STATUS_REJECTED;
        });

        builder.addCase(Create_Dnc_List.pending, (state, action) => {
            state.apiCreateDncList = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Create_Dnc_List.fulfilled, (state, action) => {
            Log('Create_Dnc_List fulfilled : ', JSON.stringify(action));
            state.apiCreateDncList = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Create_Dnc_List.rejected, (state, action) => {
            Log('Create_Dnc_List rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiCreateDncList = STATUS_REJECTED;
        });

        builder.addCase(Import_Dnc__Csv.pending, (state, action) => {
            state.apiImportDncCsv = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Import_Dnc__Csv.fulfilled, (state, action) => {
            Log('Import_Dnc__Csv fulfilled : ', JSON.stringify(action));
            state.apiImportDncCsv = STATUS_FULFILLED;
            state.isLoader = false;
            state.dnc_csv_file = action.payload?.data;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Import_Dnc__Csv.rejected, (state, action) => {
            Log('Import_Dnc__Csv rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiImportDncCsv = STATUS_REJECTED;
        });

        builder.addCase(Get_Dnc_Csv_Maping_fields.pending, (state, action) => {
            state.apiDncCsvMappingFields = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_Dnc_Csv_Maping_fields.fulfilled, (state, action) => {
            Log('Get_Dnc_Csv_Maping_fields fulfilled : ', JSON.stringify(action));
            state.apiDncCsvMappingFields = STATUS_FULFILLED;
            state.isLoader = false;
            state.dnc_csv_file_map_fields = action.payload?.data;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_Dnc_Csv_Maping_fields.rejected, (state, action) => {
            Log('Get_Dnc_Csv_Maping_fields rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiDncCsvMappingFields = STATUS_REJECTED;
        });

        builder.addCase(Insert_Dnc_Csv_Data.pending, (state, action) => {
            state.apiInsertDncCsvData = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Insert_Dnc_Csv_Data.fulfilled, (state, action) => {
            Log('Insert_Dnc_Csv_Data fulfilled : ', JSON.stringify(action));
            state.apiInsertDncCsvData = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Insert_Dnc_Csv_Data.rejected, (state, action) => {
            Log('Insert_Dnc_Csv_Data rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiInsertDncCsvData = STATUS_REJECTED;
        });

        builder.addCase(Delete_Dnc_List.pending, (state, action) => {
            state.apiDeleteDncList = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_Dnc_List.fulfilled, (state, action) => {
            Log('Delete_Dnc_List fulfilled : ', JSON.stringify(action));
            state.apiDeleteDncList = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_Dnc_List.rejected, (state, action) => {
            Log('Delete_Dnc_List rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiDeleteDncList = STATUS_REJECTED;
        });

        builder.addCase(Delete_Multiple_Dnc_List.pending, (state, action) => {
            state.apiDeleteMultipleDncList = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_Multiple_Dnc_List.fulfilled, (state, action) => {
            Log('Delete_Multiple_Dnc_List fulfilled : ', JSON.stringify(action));
            state.apiDeleteMultipleDncList = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_Multiple_Dnc_List.rejected, (state, action) => {
            Log('Delete_Multiple_Dnc_List rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiDeleteMultipleDncList = STATUS_REJECTED;
        });


    },
});

// Action creators are generated for each case reducer function
export const { storeCallsData, clearData, resetDncListApiStatus } = dncListReducer.actions;


export default dncListReducer.reducer;
