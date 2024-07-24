import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_REQUESTS,
  GET_REQUEST_DELETED_VALUE,
  ADD_NEW_REQUEST,
  DELETE_REQUEST,
  UPDATE_REQUEST,
} from "./actionTypes";

import {
  getRequestsSuccess,
  getRequestsFail,
  getRequestDeletedValueSuccess,
  getRequestDeletedValueFail,
  addRequestFail,
  addRequestSuccess,
  updateRequestSuccess,
  updateRequestFail,
  deleteRequestSuccess,
  deleteRequestFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getRequests,
  getRequestDeletedValue,
  addNewRequest,
  updateRequest,
  deleteRequest,
} from "../../helpers/fakebackend_helper";

function* fetchRequests() {
  const get_requests_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_requests",
  };

  try {
    const response = yield call(getRequests, get_requests_req);
    yield put(getRequestsSuccess(response));
  } catch (error) {
    yield put(getRequestsFail(error));
  }
}

function* onAddNewRequest({ payload, request }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_requests";

  try {
    const response = yield call(addNewRequest, payload);
    yield put(addRequestSuccess(response[0]));
  } catch (error) {
    yield put(addRequestFail(error));
  }
}

function* onUpdateRequest({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_requests";
  try {
    const response = yield call(updateRequest, payload);
    yield put(updateRequestSuccess(response[0]));
  } catch (error) {
    yield put(updateRequestFail(error));
  }
}

function* onDeleteRequest({ payload, request }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_requests";
  try {
    const responsedelete = yield call(deleteRequest, payload);
    yield put(deleteRequestSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteRequestFail(error));
  }
}

function* onGetRequestDeletedValue() {
  try {
    const response = yield call(getRequestDeletedValue);
    yield put(getRequestDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRequestDeletedValueFail(error));
  }
}

function* requestsSaga() {
  yield takeEvery(GET_REQUESTS, fetchRequests);
  yield takeEvery(ADD_NEW_REQUEST, onAddNewRequest);
  yield takeEvery(UPDATE_REQUEST, onUpdateRequest);
  yield takeEvery(DELETE_REQUEST, onDeleteRequest);
  yield takeEvery(GET_REQUEST_DELETED_VALUE, onGetRequestDeletedValue);
}

export default requestsSaga;
