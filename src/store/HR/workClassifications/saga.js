import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_WORK_CLASSIFICATIONS,
  GET_WORK_CLASSIFICATION_DELETED_VALUE,
  ADD_NEW_WORK_CLASSIFICATION,
  DELETE_WORK_CLASSIFICATION,
  UPDATE_WORK_CLASSIFICATION,
} from "./actionTypes";

import {
  getWorkClassificationsSuccess,
  getWorkClassificationsFail,
  getWorkClassificationDeletedValueSuccess,
  getWorkClassificationDeletedValueFail,
  addWorkClassificationFail,
  addWorkClassificationSuccess,
  updateWorkClassificationSuccess,
  updateWorkClassificationFail,
  deleteWorkClassificationSuccess,
  deleteWorkClassificationFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getWorkClassifications,
  getWorkClassificationDeletedValue,
  addNewWorkClassification,
  updateWorkClassification,
  deleteWorkClassification,
} from "../../../helpers/fakebackend_helper";

function* fetchWorkClassifications() {
  const get_work_classification_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobClassifications",
  };

  try {
    const response = yield call(
      getWorkClassifications,
      get_work_classification_req
    );
    console.log("dddddddddddddddddd", response);
    yield put(getWorkClassificationsSuccess(response));
  } catch (error) {
    yield put(getWorkClassificationsFail(error));
  }
}

function* onAddNewWorkClassification({ payload, workClassification }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_JobClassifications";

  try {
    const response = yield call(addNewWorkClassification, payload);
    yield put(addWorkClassificationSuccess(response[0]));
  } catch (error) {
    yield put(addWorkClassificationFail(error));
  }
}

function* onUpdateWorkClassification({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_JobClassifications";
  try {
    const response = yield call(updateWorkClassification, payload);
    yield put(updateWorkClassificationSuccess(response[0]));
  } catch (error) {
    yield put(updateWorkClassificationFail(error));
  }
}

function* onDeleteWorkClassification({ payload, workClassification }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_JobClassifications";
  try {
    const responsedelete = yield call(deleteWorkClassification, payload);
    yield put(deleteWorkClassificationSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteWorkClassificationFail(error));
  }
}

function* onGetWorkClassificationDeletedValue() {
  try {
    const response = yield call(getWorkClassificationDeletedValue);
    yield put(getWorkClassificationDeletedValueSuccess(response));
  } catch (error) {
    yield put(getWorkClassificationDeletedValueFail(error));
  }
}

function* workClassificationsSaga() {
  yield takeEvery(GET_WORK_CLASSIFICATIONS, fetchWorkClassifications);
  yield takeEvery(ADD_NEW_WORK_CLASSIFICATION, onAddNewWorkClassification);
  yield takeEvery(UPDATE_WORK_CLASSIFICATION, onUpdateWorkClassification);
  yield takeEvery(DELETE_WORK_CLASSIFICATION, onDeleteWorkClassification);
  yield takeEvery(
    GET_WORK_CLASSIFICATION_DELETED_VALUE,
    onGetWorkClassificationDeletedValue
  );
}

export default workClassificationsSaga;
