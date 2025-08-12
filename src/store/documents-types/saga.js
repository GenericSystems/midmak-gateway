import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DOCUMENTS,
  GET_DOCUMENT_DELETED_VALUE,
  ADD_NEW_DOCUMENT,
  DELETE_DOCUMENT,
  UPDATE_DOCUMENT,
} from "./actionTypes";

import {
  getDocumentsSuccess,
  getDocumentsFail,
  getDocumentDeletedValueSuccess,
  getDocumentDeletedValueFail,
  addDocumentFail,
  addDocumentSuccess,
  updateDocumentSuccess,
  updateDocumentFail,
  deleteDocumentSuccess,
  deleteDocumentFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getDocuments,
  getDocumentDeletedValue,
  addNewDocument,
  updateDocument,
  deleteDocument,
} from "../../helpers/fakebackend_helper";

function* fetchDocuments() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_RegDocType",
  };
  try {
    const response = yield call(getDocuments, get_settings_req);
    console.log("responseresponse",response);
    yield put(getDocumentsSuccess(response));
  } catch (error) {
    yield put(getDocumentsFail(error));
  }
}

function* onGetDocumentDeletedValue() {
  try {
    const response = yield call(getDocumentDeletedValue);
    yield put(getDocumentDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDocumentDeletedValueFail(error));
  }
}

function* onAddNewDocument({ payload, document }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_RegDocType";
  try {
    const response = yield call(addNewDocument, payload);
    yield put(addDocumentSuccess(response[0]));
  } catch (error) {
    yield put(addDocumentFail(error));
  }
}

function* onUpdateDocument({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_RegDocType";
  try {
    const respupdate = yield call(updateDocument, payload);
    yield put(updateDocumentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDocumentFail(error));
  }
}

function* onDeleteDocument({ payload, document }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_RegDocType";
  try {
    const respdelete = yield call(deleteDocument, payload);
    yield put(deleteDocumentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDocumentFail(error));
  }
}

function* documentsSaga() {
  yield takeEvery(GET_DOCUMENTS, fetchDocuments);
  yield takeEvery(GET_DOCUMENT_DELETED_VALUE, onGetDocumentDeletedValue);
  yield takeEvery(ADD_NEW_DOCUMENT, onAddNewDocument);
  yield takeEvery(UPDATE_DOCUMENT, onUpdateDocument);
  yield takeEvery(DELETE_DOCUMENT, onDeleteDocument);
}

export default documentsSaga;
