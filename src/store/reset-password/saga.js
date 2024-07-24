import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_STUDENTS_OPTIONS,
  UPDATE_PASSWORD
} from "./actionTypes"

import {
  getStudentsOptionsSuccess,
  getStudentsOptionsFail,
  updatePasswordSuccess,
  updatePasswordFail,
} from "./actions"

//Include Both Helper File with needed methods
import {
  getStudentsOptions,
  updatePassword,
} from "../../helpers/fakebackend_helper"

function* onGetStudentsOptions() {
  const get_students_options = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Students",
  };
try {
    const response = yield call(getStudentsOptions, get_students_options)
    yield put(getStudentsOptionsSuccess(response))
  } catch (error) {
    yield put(getStudentsOptionsFail(error))
  }
}

function* onUpdatePassword({payload}) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'SisApp_User';
payload["queryname"] = '_Students';
try {
    const response = yield call(updatePassword, payload)
    yield put(updatePasswordSuccess(response[0]))
  } catch (error) {
    yield put(updatePasswordFail(error))
  }
}


function* passwordsSaga() {
  yield takeEvery(GET_STUDENTS_OPTIONS, onGetStudentsOptions)
  yield takeEvery(UPDATE_PASSWORD, onUpdatePassword)
}

export default passwordsSaga
