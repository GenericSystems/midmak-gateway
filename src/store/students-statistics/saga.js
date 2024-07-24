import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_STUDENTS_STATISTICS,
} from "./actionTypes"

import {
getTempStudentsStatisticsSuccess,
getTempStudentsStatisticsFail,
} from "./actions"

// Include Both Helper File with needed methods
import {
getTempStudentsStatistics,
} from "../../helpers/fakebackend_helper"

function* fetchTempStudentsStatistics(obj) {
const get_studentsStatistics_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "_TempStudentsNumStatistics ",
   filter: `IsAccepted = ${obj.payload.IsAccepted}`
    }  
try {
const response = yield call(getTempStudentsStatistics,get_studentsStatistics_req)
yield put(getTempStudentsStatisticsSuccess(response))
} catch (error) {
yield put(getTempStudentsStatisticsFail(error))
}
}

function* studentsStatisticsSaga() {
yield takeEvery(GET_STUDENTS_STATISTICS, fetchTempStudentsStatistics)
}

export default studentsStatisticsSaga