import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_MAJORS_TYPES,
ADD_NEW_MAJOR_TYPE,
DELETE_MAJOR_TYPE,
UPDATE_MAJOR_TYPE,
GET_MAJOR_TYPE_DELETED_VALUE,
} from "./actionTypes"

import {
getMajorsTypesSuccess,
getMajorsTypesFail,
addMajorTypeFail,
addMajorTypeSuccess,
updateMajorTypeSuccess,
updateMajorTypeFail,
deleteMajorTypeSuccess,
deleteMajorTypeFail,
getMajorTypeDeletedValueSuccess,
getMajorTypeDeletedValueFail,
} from "./actions"

import {
getMajorsTypes,
addNewMajorType,
updateMajorType,
deleteMajorType,
getMajorTypeDeletedValue,
} from "../../helpers/fakebackend_helper"

function* fetchMajorTypes() {

   

  const get_MajorTypes_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_majorsTypes"
    } ;  
  try {
  const response = yield call(getMajorsTypes, get_MajorTypes_req)

  yield put(getMajorsTypesSuccess(response))
  } catch (error) {
  yield put(getMajorsTypesFail(error))
  }
 
}

function* onAddNewMajorType({ payload, }) {
delete payload["id"];
payload["source"] = 'db';
payload["procedure"] = 'SisApp_addData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_majorsTypes';
try {
        const response = yield call(addNewMajorType, payload)
        yield put(addMajorTypeSuccess(response[0]))
    } catch (error) {
        yield put(addMajorTypeFail(error))
    }
}

function* onUpdateMajorType({ payload }) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_updateData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_majorsTypes';
    try {
        const respupdate = yield call(updateMajorType, payload)
        yield put(updateMajorTypeSuccess(respupdate[0]))
    } catch (error) {
        yield put(updateMajorTypeFail(error))
    }
}

function* onDeleteMajorType({ payload}) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_removeData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_majorsTypes';
    try {
        const respdelete = yield call(deleteMajorType, payload)
        yield put(deleteMajorTypeSuccess(respdelete[0]))
    } catch (error) {
        yield put(deleteMajorTypeFail(error))
    }
}

function* onGetMajorTypeDeletedValue() {
  try {
    const response = yield call(getMajorTypeDeletedValue)
    yield put(getMajorTypeDeletedValueSuccess(response))
  } catch (error) {
    yield put(getMajorTypeDeletedValueFail(error))
  }
  
}

function* MajorsTypesSaga() {
yield takeEvery(GET_MAJORS_TYPES, fetchMajorTypes)
yield takeEvery(ADD_NEW_MAJOR_TYPE, onAddNewMajorType)
yield takeEvery(UPDATE_MAJOR_TYPE, onUpdateMajorType)
yield takeEvery(DELETE_MAJOR_TYPE, onDeleteMajorType)
yield takeEvery(GET_MAJOR_TYPE_DELETED_VALUE, onGetMajorTypeDeletedValue);
}

export default MajorsTypesSaga