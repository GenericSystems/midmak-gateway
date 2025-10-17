import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_YEARS,
  GET_YEAR_DELETED_VALUE,
  ADD_NEW_YEAR,
  DELETE_YEAR,
  UPDATE_YEAR,
} from "./actionTypes";

import {
  getYearsSuccess,
  getYearsFail,
  getYearDeletedValueSuccess,
  getYearDeletedValueFail,
  addYearFail,
  addYearSuccess,
  updateYearSuccess,
  updateYearFail,
  deleteYearSuccess,
  deleteYearFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getYears,
  getYearDeletedValue,
  addNewYear,
  updateYear,
  deleteYear,
} from "../../helpers/fakebackend_helper";

function* fetchYears() {
  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }
}

function* onGetYearDeletedvalue() {
  try {
    const response = yield call(getYearDeletedValue);
    yield put(getYearDeletedValueSuccess(response));
  } catch (error) {
    yield put(getYearDeletedValueFail(error));
  }
}

function* onAddNewYear({ payload, year }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Years";

  try {
    const response = yield call(addNewYear, payload);
    yield put(addYearSuccess(response[0]));
  } catch (error) {
    yield put(addYearFail(error));
  }
}

function* onUpdateYear({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Years";

  try {
    const respupdate = yield call(updateYear, payload);
    yield put(updateYearSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateYearFail(error));
  }
}

function* onDeleteYear({ payload, year }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Years";

  try {
    const respdelete = yield call(deleteYear, payload);
    yield put(deleteYearSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteYearFail(error));
  }
}

function* yearsSaga() {
  yield takeEvery(GET_YEARS, fetchYears);
  yield takeEvery(GET_YEAR_DELETED_VALUE, onGetYearDeletedvalue);
  yield takeEvery(ADD_NEW_YEAR, onAddNewYear);
  yield takeEvery(UPDATE_YEAR, onUpdateYear);
  yield takeEvery(DELETE_YEAR, onDeleteYear);
}

export default yearsSaga;
