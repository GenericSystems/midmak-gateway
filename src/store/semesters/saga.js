import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_SEMESTERS,
GET_CURRENT_SEMESTER,
GET_SEMESTER_DELETED_VALUE,
ADD_NEW_SEMESTER,
DELETE_SEMESTER,
UPDATE_SEMESTER
} from "./actionTypes"

import {
getSemestersSuccess,
getSemestersFail,
getCurrentSemesterSuccess,
getCurrentSemesterFail,
addSemesterFail,
addSemesterSuccess,
updateSemesterSuccess,
updateSemesterFail,
deleteSemesterSuccess,
deleteSemesterFail,
getSemesterDeletedValueSuccess,
getSemesterDeletedValueFail,
} from "./actions"

// Include Both Helper File with needed methods
import {
getSemesters,
getCurrentSemester,
addNewSemester,
updateSemester,
getSemesterDeletedValue,
deleteSemester
} from "../../helpers/fakebackend_helper"

function* fetchSemesters() {
const get_semesters_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "settings_Semesters"
    }  
try {
const response = yield call(getSemesters,get_semesters_req)
yield put(getSemestersSuccess(response))
} catch (error) {
yield put(getSemestersFail(error))
}
}

function* fetchCurrentSemester() {
  const get_current_semester = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_SystemCurrentSemester",
   filter: "facultyNum = 0 or facultyNum is null",
     }  
try {
const response = yield call(getCurrentSemester,get_current_semester)
yield put(getCurrentSemesterSuccess(response[0]))
} catch (error) {
yield put(getCurrentSemesterFail(error))
}
}

function* onAddNewSemester({ payload, semester }) {
    delete payload["id"];
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_addData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_Semesters';
    
try {
  const response = yield call(addNewSemester, payload)
   yield put(addSemesterSuccess(response[0]))
} catch (error) {
   yield put(addSemesterFail(error))
}
}

function* onUpdateSemester({ payload }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_Semesters';

try {
    const respupdate = yield call(updateSemester, payload)
    yield put(updateSemesterSuccess(respupdate[0]))
} catch (error) {
yield put(updateSemesterFail(error))
}
}

function* onDeleteSemester({ payload, semester }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_removeData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_Semesters';
    
try {
  const respdelete = yield call(deleteSemester, payload)
  yield put(deleteSemesterSuccess(respdelete[0]))
} catch (error) {
yield put(deleteSemesterFail(error))
}
}

function* onGetSemesterDeletedValue() {
  try {
    const response = yield call(getSemesterDeletedValue)
    yield put(getSemesterDeletedValueSuccess(response))
  } catch (error) {
    yield put(getSemesterDeletedValueFail(error))
  }
  
}

function* semestersSaga() {
yield takeEvery(GET_SEMESTERS, fetchSemesters)
yield takeEvery(GET_CURRENT_SEMESTER, fetchCurrentSemester)
yield takeEvery(ADD_NEW_SEMESTER, onAddNewSemester)
yield takeEvery(UPDATE_SEMESTER, onUpdateSemester)
yield takeEvery(DELETE_SEMESTER, onDeleteSemester)
yield takeEvery(GET_SEMESTER_DELETED_VALUE, onGetSemesterDeletedValue);
}

export default semestersSaga