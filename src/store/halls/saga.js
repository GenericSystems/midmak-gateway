import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_HALLS,
  GET_HALL_DELETED_VALUE,
  ADD_NEW_HALL,
  DELETE_HALL,
  UPDATE_HALL,
} from "./actionTypes";

import {
  getHallsSuccess,
  getHallsFail,
  getHallDeletedValueSuccess,
  getHallDeletedValueFail,
  addHallFail,
  addHallSuccess,
  updateHallSuccess,
  updateHallFail,
  deleteHallSuccess,
  deleteHallFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getHalls,
  getHallDeletedValue,
  addNewHall,
  updateHall,
  deleteHall,
  getFaculties,
} from "../../helpers/fakebackend_helper";

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

function* fetchHalls(obj) {

  const payload= obj.payload

  const get_halls_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_halls",
    filter : `facultyId= ${payload.facultyId}`

  };

  try {
    const response = yield call(getHalls, get_halls_req);
    yield put(getHallsSuccess(response));
  } catch (error) {
    yield put(getHallsFail(error));
  }
}

function* onAddNewHall({ payload, hall }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_halls";

  try {
    const response = yield call(addNewHall, payload);
    yield put(addHallSuccess(response[0]));
  } catch (error) {
    yield put(addHallFail(error));
  }
}

function* onUpdateHall({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_halls";
  try {
    const response = yield call(updateHall, payload);
    yield put(updateHallSuccess(response[0]));
  } catch (error) {
    yield put(updateHallFail(error));
  }
}

function* onDeleteHall({ payload, hall }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_halls";
  try {
    const responsedelete = yield call(deleteHall, payload);
    yield put(deleteHallSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteHallFail(error));
  }
}

function* onGetHallDeletedValue() {
  try {
    const response = yield call(getHallDeletedValue)
    yield put(getHallDeletedValueSuccess(response))
  } catch (error) {
    yield put(getHallDeletedValueFail(error))
  }
  
}


function* hallsSaga() {
  yield takeEvery(GET_HALLS, fetchHalls);
  yield takeEvery(ADD_NEW_HALL, onAddNewHall);
  yield takeEvery(UPDATE_HALL, onUpdateHall);
  yield takeEvery(DELETE_HALL, onDeleteHall);
  yield takeEvery(GET_HALL_DELETED_VALUE, onGetHallDeletedValue);
}

export default hallsSaga;
