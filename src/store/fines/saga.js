import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_FINES,
  GET_FINE_DELETED_VALUE,
  ADD_NEW_FINE,
  DELETE_FINE,
  UPDATE_FINE,
} from "./actionTypes";

import {
  getFinesSuccess,
  getFinesFail,
  getFineDeletedValueSuccess,
  getFineDeletedValueFail,
  addFineFail,
  addFineSuccess,
  updateFineSuccess,
  updateFineFail,
  deleteFineSuccess,
  deleteFineFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getFines,
  getFineDeletedValue,
  addNewFine,
  updateFine,
  deleteFine,
} from "../../helpers/fakebackend_helper";

function* fetchFines() {
  const get_fines_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_fines",
  };

  try {
    const response = yield call(getFines, get_fines_req);
    yield put(getFinesSuccess(response));
  } catch (error) {
    yield put(getFinesFail(error));
  }
}

function* onAddNewFine({ payload, fine }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_fines";

  try {
    const response = yield call(addNewFine, payload);
    yield put(addFineSuccess(response[0]));
  } catch (error) {
    yield put(addFineFail(error));
  }
}

function* onUpdateFine({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_fines";
  try {
    const response = yield call(updateFine, payload);
    yield put(updateFineSuccess(response[0]));
  } catch (error) {
    yield put(updateFineFail(error));
  }
}

function* onDeleteFine({ payload, fine }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_fines";
  try {
    const responsedelete = yield call(deleteFine, payload);
    yield put(deleteFineSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteFineFail(error));
  }
}

function* onGetFineDeletedValue() {
  try {
    const response = yield call(getFineDeletedValue);
    yield put(getFineDeletedValueSuccess(response));
  } catch (error) {
    yield put(getFineDeletedValueFail(error));
  }
}

function* finesSaga() {
  yield takeEvery(GET_FINES, fetchFines);
  yield takeEvery(ADD_NEW_FINE, onAddNewFine);
  yield takeEvery(UPDATE_FINE, onUpdateFine);
  yield takeEvery(DELETE_FINE, onDeleteFine);
  yield takeEvery(GET_FINE_DELETED_VALUE, onGetFineDeletedValue);
}

export default finesSaga;
