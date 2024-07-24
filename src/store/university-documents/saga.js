import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_UNI_DOCUMENTS,
  GET_UNI_DOCUMENT_DELETED_VALUE,
  ADD_NEW_UNI_DOCUMENT,
  DELETE_UNI_DOCUMENT,
  UPDATE_UNI_DOCUMENT,
} from "./actionTypes";

import {
  getUniDocumentsSuccess,
  getUniDocumentsFail,
  getUniDocumentDeletedValueSuccess,
  getUniDocumentDeletedValueFail,
  addUniDocumentFail,
  addUniDocumentSuccess,
  updateUniDocumentSuccess,
  updateUniDocumentFail,
  deleteUniDocumentSuccess,
  deleteUniDocumentFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getUniDocuments,
  getUniDocumentDeletedValue,
  addNewUniDocument,
  updateUniDocument,
  deleteUniDocument,
} from "../../helpers/fakebackend_helper";

function* fetchUniDocuments() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "setting_universityDocType",
  };
  try {
    const response = yield call(getUniDocuments, get_settings_req);
    yield put(getUniDocumentsSuccess(response));
  } catch (error) {
    yield put(getUniDocumentsFail(error));
  }
}

function* onGetUniDocumentDeletedValue() {
  try {
    const response = yield call(getUniDocumentDeletedValue);
    yield put(getUniDocumentDeletedValueSuccess(response));
  } catch (error) {
    yield put(getUniDocumentDeletedValueFail(error));
  }
}

function* onAddNewUniDocument({ payload, document }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "setting_universityDocType";
  try {
    const response = yield call(addNewUniDocument, payload);
    yield put(addUniDocumentSuccess(response[0]));
  } catch (error) {
    yield put(addUniDocumentFail(error));
  }
}

function* onUpdateUniDocument({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "setting_universityDocType";
  try {
    const respupdate = yield call(updateUniDocument, payload);
    yield put(updateUniDocumentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateUniDocumentFail(error));
  }
}

function* onDeleteUniDocument({ payload, document }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "setting_universityDocType";
  try {
    const respdelete = yield call(deleteUniDocument, payload);
    yield put(deleteUniDocumentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteUniDocumentFail(error));
  }
}

function* uniDocumentsSaga() {
  yield takeEvery(GET_UNI_DOCUMENTS, fetchUniDocuments);
  yield takeEvery(GET_UNI_DOCUMENT_DELETED_VALUE, onGetUniDocumentDeletedValue);
  yield takeEvery(ADD_NEW_UNI_DOCUMENT, onAddNewUniDocument);
  yield takeEvery(UPDATE_UNI_DOCUMENT, onUpdateUniDocument);
  yield takeEvery(DELETE_UNI_DOCUMENT, onDeleteUniDocument);
}

export default uniDocumentsSaga;
