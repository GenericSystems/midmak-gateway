import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_PREREQS,
GET_PREREQ_DELETED_VALUE,
ADD_NEW_PREREQ,
DELETE_PREREQ,
UPDATE_PREREQ
} from "./actionTypes"

import {
getPrereqsSuccess,
getPrereqsFail,
getPrereqDeletedValueSuccess,
getPrereqDeletedValueFail,
addPrereqFail,
addPrereqSuccess,
updatePrereqSuccess,
updatePrereqFail,
deletePrereqSuccess,
deletePrereqFail,
} from "./actions"

// Include Both Helper File with needed methods
import {
getPrereqs,
getPrereqDeletedValue,
addNewPrereq,
updatePrereq,
deletePrereq
} from "../../helpers/fakebackend_helper"

function* fetchprereqs() {
const get_prereqs_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "settings_prerequisitesConditions"
    }  
try {
const response = yield call(getPrereqs,get_prereqs_req)
yield put(getPrereqsSuccess(response))
} catch (error) {
yield put(getPrereqsFail(error))
}
}

function* onGetPrereqDeletedValue() {
try {
const response = yield call(getPrereqDeletedValue)
yield put(getPrereqDeletedValueSuccess(response))
} catch (error) {
yield put(getPrereqDeletedValueFail(error))
}
}

function* onAddNewPrereq({ payload, prereq }) {
    delete payload["id"];
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_addData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_prerequisitesConditions';
    
try {
  const response = yield call(addNewPrereq, payload)
   yield put(addPrereqSuccess(response[0]))
} catch (error) {
   yield put(addPrereqFail(error))
}
}

function* onUpdatePrereq({ payload }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_prerequisitesConditions';

try {
    const respupdate = yield call(updatePrereq, payload)
    yield put(updatePrereqSuccess(respupdate[0]))
} catch (error) {
yield put(updatePrereqFail(error))
}
}

function* onDeletePrereq({ payload, prereq }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_removeData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_prerequisitesConditions';
    
try {
  const respdelete = yield call(deletePrereq, payload)
  yield put(deletePrereqSuccess(respdelete[0]))
} catch (error) {
yield put(deletePrereqFail(error))
}
}

function* prereqsSaga() {
yield takeEvery(GET_PREREQS, fetchprereqs)
yield takeEvery(GET_PREREQ_DELETED_VALUE, onGetPrereqDeletedValue)
yield takeEvery(ADD_NEW_PREREQ, onAddNewPrereq)
yield takeEvery(UPDATE_PREREQ, onUpdatePrereq)
yield takeEvery(DELETE_PREREQ, onDeletePrereq)
}

export default prereqsSaga