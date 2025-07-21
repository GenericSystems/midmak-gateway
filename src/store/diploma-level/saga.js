import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_DIPLOMALEVELS,
  GET_DIPLOMALEVEL_DELETED_VALUE,
  ADD_NEW_DIPLOMALEVEL,
  UPDATE_DIPLOMALEVEL,
  DELETE_DIPLOMALEVEL,
} from "./actionTypes";

// Actions
import {
  getDiplomaLevelsSuccess,
  getDiplomaLevelsFail,
  getDiplomaLevelDeletedValueSuccess,
  getDiplomaLevelDeletedValueFail,
  addDiplomaLevelSuccess,
  addDiplomaLevelFail,
  updateDiplomaLevelSuccess,
  updateDiplomaLevelFail,
  deleteDiplomaLevelSuccess,
  deleteDiplomaLevelFail,
} from "./actions";

// API Helpers
import {
  getDiplomaLevels,
  getDiplomaLevelDeletedValue,
  addNewDiplomaLevel,
  updateDiplomaLevel,
  deleteDiplomaLevel,
} from "../../helpers/fakebackend_helper";

function* fetchDiplomaLevels() {
  const get_diplomaLevel_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DiplomaLevels",
  };
  try {
    const response = yield call(getDiplomaLevels, get_diplomaLevel_req);
    yield put(getDiplomaLevelsSuccess(response));
  } catch (error) {
    yield put(getDiplomaLevelsFail(error));
  }
}

function* fetchDiplomaLevelDeletedValue() {
  try {
    const response = yield call(getDiplomaLevelDeletedValue);
    yield put(getDiplomaLevelDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDiplomaLevelDeletedValueFail(error));
  }
}

function* onAddNewDiplomaLevel({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_DiplomaLevels";

  try {
    const response = yield call(addNewDiplomaLevel, payload);
    yield put(addDiplomaLevelSuccess(response[0]));
  } catch (error) {
    yield put(addDiplomaLevelFail(error));
  }
}

function* onUpdateDiplomaLevel({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_DiplomaLevels";

  try {
    const response = yield call(updateDiplomaLevel, payload);
    yield put(updateDiplomaLevelSuccess(response[0]));
  } catch (error) {
    yield put(updateDiplomaLevelFail(error));
  }
}

function* onDeleteDiplomaLevel({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_DiplomaLevels";

  try {
    const response = yield call(deleteDiplomaLevel, payload);
    yield put(deleteDiplomaLevelSuccess(response[0]));
  } catch (error) {
    yield put(deleteDiplomaLevelFail(error));
  }
}

function* DiplomaLevelSaga() {
  yield takeEvery(GET_DIPLOMALEVELS, fetchDiplomaLevels);
  yield takeEvery(
    GET_DIPLOMALEVEL_DELETED_VALUE,
    fetchDiplomaLevelDeletedValue
  );
  yield takeEvery(ADD_NEW_DIPLOMALEVEL, onAddNewDiplomaLevel);
  yield takeEvery(UPDATE_DIPLOMALEVEL, onUpdateDiplomaLevel);
  yield takeEvery(DELETE_DIPLOMALEVEL, onDeleteDiplomaLevel);
}

export default DiplomaLevelSaga;
