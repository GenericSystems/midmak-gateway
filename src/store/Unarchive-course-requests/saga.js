import { call, put, takeEvery } from "redux-saga/effects";
import {
  UNARCHIVE_COURSE_REQUESTS,
  ADD_UNARCHIVE_COURSE_REQUEST,
  UPDATE_UNARCHIVE_COURSE_REQUEST,
  DELETE_UNARCHIVE_COURSE_REQUEST,
  GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE,
} from "./actionTypes";

import { GET_DECISION_STATUS } from "../decisions/actionTypes";

import {
  getUnarchiveCourseRequestsSuccess,
  getUnarchiveCourseRequestsFail,
  addUnarchiveCourseRequestSuccess,
  addUnarchiveCourseRequestFail,
  updateUnarchiveCourseRequestSuccess,
  updateUnarchiveCourseRequestFail,
  deleteUnarchiveCourseRequestSuccess,
  deleteUnarchiveCourseRequestFail,
  getUnarchiveCourseRequestDeletedValueSuccess,
  getUnarchiveCourseRequestDeletedValueFail,
} from "./actions";

import {
  getDecisionStatusFail,
  getDecisionStatusSuccess,
} from "../decisions/actions";

import {
  getUnarchiveCourseRequests,
  addUnarchiveCourseRequest,
  updateUnarchiveCourseRequest,
  deleteUnarchiveCourseRequest,
  getUnarchiveCourseRequestDeletedValue,
  getDecisionStatus,
} from "../../helpers/fakebackend_helper";

// Fetch
function* fetchUnarchiveCourseRequests() {
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_UnarchiveCourseRequest",
  };

  try {
    const response = yield call(getUnarchiveCourseRequests, request);
    yield put(getUnarchiveCourseRequestsSuccess(response));
  } catch (error) {
    yield put(getUnarchiveCourseRequestsFail(error));
  }
}

function* fetchDecisionStatus() {
  const get_decisionStatus_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecisionStatus",
  };
  try {
    const response = yield call(getDecisionStatus, get_decisionStatus_req);
    yield put(getDecisionStatusSuccess(response));
  } catch (error) {
    yield put(getDecisionStatusFail(error));
  }
}

// Add
function* onAddUnarchiveCourseRequest({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_UnarchiveCourseRequest";

  try {
    const response = yield call(addUnarchiveCourseRequest, payload);
    yield put(addUnarchiveCourseRequestSuccess(response[0]));
  } catch (error) {
    yield put(addUnarchiveCourseRequestFail(error));
  }
}

// Update
function* onUpdateUnarchiveCourseRequest({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_UnarchiveCourseRequest";

  try {
    const response = yield call(updateUnarchiveCourseRequest, payload);
    yield put(updateUnarchiveCourseRequestSuccess(response[0]));
  } catch (error) {
    yield put(updateUnarchiveCourseRequestFail(error));
  }
}

// Delete
function* onDeleteUnarchiveCourseRequest({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_UnarchiveCourseRequest";

  try {
    const response = yield call(deleteUnarchiveCourseRequest, payload);
    yield put(deleteUnarchiveCourseRequestSuccess(response[0]));
  } catch (error) {
    yield put(deleteUnarchiveCourseRequestFail(error));
  }
}

// Get Deleted
function* onGetUnarchiveCourseRequestDeletedValue() {
  try {
    const response = yield call(getUnarchiveCourseRequestDeletedValue);
    yield put(getUnarchiveCourseRequestDeletedValueSuccess(response));
  } catch (error) {
    yield put(getUnarchiveCourseRequestDeletedValueFail(error));
  }
}

// Watcher Saga
function* UnarchiveCourseRequestsSaga() {
  yield takeEvery(UNARCHIVE_COURSE_REQUESTS, fetchUnarchiveCourseRequests);
  yield takeEvery(ADD_UNARCHIVE_COURSE_REQUEST, onAddUnarchiveCourseRequest);
  yield takeEvery(
    UPDATE_UNARCHIVE_COURSE_REQUEST,
    onUpdateUnarchiveCourseRequest
  );
  yield takeEvery(
    DELETE_UNARCHIVE_COURSE_REQUEST,
    onDeleteUnarchiveCourseRequest
  );
  yield takeEvery(
    GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE,
    onGetUnarchiveCourseRequestDeletedValue
  );
  yield takeEvery(GET_DECISION_STATUS, fetchDecisionStatus);
}

export default UnarchiveCourseRequestsSaga;
