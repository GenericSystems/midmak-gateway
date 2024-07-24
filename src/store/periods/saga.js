import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PERIODS,
  GET_PERIOD_DELETED_VALUE,
  ADD_NEW_PERIOD,
  DELETE_PERIOD,
  UPDATE_PERIOD,
  GET_FISCAL_YEAR_CONTENTS,
} from "./actionTypes";
import {
  getPeriodsSuccess,
  getPeriodsFail,
  getPeriodDeletedValueSuccess,
  getPeriodDeletedValueFail,
  addPeriodFail,
  addPeriodSuccess,
  updatePeriodSuccess,
  updatePeriodFail,
  deletePeriodSuccess,
  deletePeriodFail,
  getFiscalYearContentsSuccess,
  getFiscalYearContentsFail,
  getFiscalYearsSuccess,
  getFiscalYearsFail,
} from "./actions";

import {
  getYearSemestersSuccess,
  getYearSemestersFail,
} from "../general-management/actions";

//Include Both Helper File with needed methods
import {
  getPeriods,
  getPeriodDeletedValue,
  addNewPeriod,
  updatePeriod,
  deletePeriod,
  getYearSemesters,
  getFiscalYearContents,
  getFiscalYears,
} from "helpers/fakebackend_helper";

function* fetchPeriods() {
  const get_periods = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_finance_FiscalYearPeriod",
    filter : "isDefault = 0"
  };

  try {
    const response = yield call(getPeriods, get_periods);
    yield put(getPeriodsSuccess(response));
  } catch (error) {
    yield put(getPeriodsFail(error));
  }

  //get semester
  const get_semester_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_YearsSemesters",
  };
  try {
    const response = yield call(getYearSemesters, get_semester_opt);
    yield put(getYearSemestersSuccess(response));
  } catch (error) {
    yield put(getYearSemestersFail(error));
  }

  // year
  const get_fiscalYears = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_FiscalYear",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getFiscalYears, get_fiscalYears);
    yield put(getFiscalYearsSuccess(response));
  } catch (error) {
    yield put(getFiscalYearsFail(error));
  }
}

function* fetchFiscalYearContent(fiscalYear) {
  const get_fiscalYearContents = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_FiscalYearContents",
    fields: "Id,arTitle",
    filter: `fiscalYearId = ${fiscalYear.payload.fiscalYearId}`,
  };

  try {
    const response = yield call(getFiscalYearContents, get_fiscalYearContents);
    yield put(getFiscalYearContentsSuccess(response));
  } catch (error) {
    yield put(getFiscalYearContentsFail(error));
  }
}

function* fetchPeriodDeletedValue({ periodId }) {
  try {
    const response = yield call(getPeriodDeletedValue, periodId);
    yield put(getPeriodDeletedValueSuccess(response));
  } catch (error) {
    yield put(getPeriodDeletedValueFail(error));
  }
}

function* onUpdatePeriod({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_updateData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "finance_FiscalYearPeriod";
    payload["queryname"] = "_finance_FiscalYearPeriod"
  
    const response = yield call(updatePeriod, payload);
    yield put(updatePeriodSuccess(response[0]));
  } catch (error) {
    yield put(updatePeriodFail(error));
  }
}

function* onDeletePeriod({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_FiscalYearPeriod";

  try {
    const response = yield call(deletePeriod, payload);
    yield put(deletePeriodSuccess(response[0]));
  } catch (error) {
    yield put(deletePeriodFail(error));
  }
}

function* onAddNewPeriod({ payload, period }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_FiscalYearPeriod";
  payload["queryname"] = "_finance_FiscalYearPeriod"


  try {
    const response = yield call(addNewPeriod, payload);
    yield put(addPeriodSuccess(response[0]));
  } catch (error) {
    yield put(addPeriodFail(error));
  }
}

function* periodsSaga() {
  yield takeEvery(GET_PERIODS, fetchPeriods);
  yield takeEvery(GET_PERIOD_DELETED_VALUE, fetchPeriodDeletedValue);
  yield takeEvery(ADD_NEW_PERIOD, onAddNewPeriod);
  yield takeEvery(UPDATE_PERIOD, onUpdatePeriod);
  yield takeEvery(DELETE_PERIOD, onDeletePeriod);
  yield takeEvery(GET_FISCAL_YEAR_CONTENTS, fetchFiscalYearContent);
}

export default periodsSaga;
