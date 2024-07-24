import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_LEVELS,
GET_LEVEL_DELETED_VALUE,
ADD_NEW_LEVEL,
DELETE_LEVEL,
UPDATE_LEVEL
} from "./actionTypes"

import {
getLevelsSuccess,
getLevelsFail,
getLevelDeletedValueSuccess,
getLevelDeletedValueFail,
addLevelFail,
addLevelSuccess,
updateLevelSuccess,
updateLevelFail,
deleteLevelSuccess,
deleteLevelFail,
} from "./actions"

// Include Both Helper File with needed methods
import {
getLevels,
getLevelDeletedValue,
addNewLevel,
updateLevel,
deleteLevel
} from "../../helpers/fakebackend_helper"

function* fetchLevels() {
const get_levels_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "settings_Levels"
    }  
try {
const response = yield call(getLevels,get_levels_req)
yield put(getLevelsSuccess(response))
} catch (error) {
yield put(getLevelsFail(error))
}
}

function* onGetLevelDeletedValue() {
try {
const response = yield call(getLevelDeletedValue)
yield put(getLevelDeletedValueSuccess(response))
} catch (error) {
yield put(getLevelDeletedValueFail(error))
}
}

function* onAddNewLevel({ payload, level }) {
    delete payload["id"];
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_addData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_Levels';
    
try {
  const response = yield call(addNewLevel, payload)
   yield put(addLevelSuccess(response[0]))
} catch (error) {
   yield put(addLevelFail(error))
}
}

function* onUpdateLevel({ payload }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_Levels';

try {
    const respupdate = yield call(updateLevel, payload)
    yield put(updateLevelSuccess(respupdate[0]))
} catch (error) {
yield put(updateLevelFail(error))
}
}

function* onDeleteLevel({ payload, level }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_removeData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_Levels';
    
try {
  const respdelete = yield call(deleteLevel, payload)
  yield put(deleteLevelSuccess(respdelete[0]))
} catch (error) {
yield put(deleteLevelFail(error))
}
}

function* levelsSaga() {
yield takeEvery(GET_LEVELS, fetchLevels)
yield takeEvery(GET_LEVEL_DELETED_VALUE, onGetLevelDeletedValue)
yield takeEvery(ADD_NEW_LEVEL, onAddNewLevel)
yield takeEvery(UPDATE_LEVEL, onUpdateLevel)
yield takeEvery(DELETE_LEVEL, onDeleteLevel)
}

export default levelsSaga