import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_TRAINING_FORMATS,
  GET_TRAINING_FORMAT_DELETED_VALUE,
  ADD_NEW_TRAINING_FORMAT,
  UPDATE_TRAINING_FORMAT,
  DELETE_TRAINING_FORMAT,
} from "./actionTypes";

// Actions
import {
  getTrainingFormatsSuccess,
  getTrainingFormatsFail,
  getTrainingFormatDeletedValueSuccess,
  getTrainingFormatDeletedValueFail,
  addTrainingFormatSuccess,
  addTrainingFormatFail,
  updateTrainingFormatSuccess,
  updateTrainingFormatFail,
  deleteTrainingFormatSuccess,
  deleteTrainingFormatFail,
} from "./actions";

// Helper functions
import {
  getTrainingFormats,
  getTrainingFormatDeletedValue,
  addNewTrainingFormat,
  updateTrainingFormat,
  deleteTrainingFormat,
} from "../../helpers/fakebackend_helper";

function* fetchTrainingFormats() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_trainingFormats",
  };
  try {
    const response = yield call(getTrainingFormats, get_settings_req);
    yield put(getTrainingFormatsSuccess(response));
  } catch (error) {
    yield put(getTrainingFormatsFail(error));
  }
}

function* fetchTrainingFormatDeletedValue() {
  try {
    const response = yield call(getTrainingFormatDeletedValue);
    yield put(getTrainingFormatDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTrainingFormatDeletedValueFail(error));
  }
}

function* onAddNewTrainingFormat({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_trainingFormats";

  try {
    const response = yield call(addNewTrainingFormat, payload);
    yield put(addTrainingFormatSuccess(response[0]));
  } catch (error) {
    yield put(addTrainingFormatFail(error));
  }
}

function* onUpdateTrainingFormat({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_trainingFormats";

  try {
    const response = yield call(updateTrainingFormat, payload);
    yield put(updateTrainingFormatSuccess(response[0]));
  } catch (error) {
    yield put(updateTrainingFormatFail(error));
  }
}

function* onDeleteTrainingFormat({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_trainingFormats";

  try {
    const response = yield call(deleteTrainingFormat, payload);
    yield put(deleteTrainingFormatSuccess(response[0]));
  } catch (error) {
    yield put(deleteTrainingFormatFail(error));
  }
}

function* trainingFormatsSaga() {
  yield takeEvery(GET_TRAINING_FORMATS, fetchTrainingFormats);
  yield takeEvery(GET_TRAINING_FORMAT_DELETED_VALUE, fetchTrainingFormatDeletedValue);
  yield takeEvery(ADD_NEW_TRAINING_FORMAT, onAddNewTrainingFormat);
  yield takeEvery(UPDATE_TRAINING_FORMAT, onUpdateTrainingFormat);
  yield takeEvery(DELETE_TRAINING_FORMAT, onDeleteTrainingFormat);
}

export default trainingFormatsSaga;
