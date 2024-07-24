import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_REQUESTS_FEES,
  GET_REQUEST_FEES_DELETED_VALUE,
  ADD_NEW_REQUEST_FEES,
  DELETE_REQUEST_FEES,
  UPDATE_REQUEST_FEES,
  GET_REQUEST_CRITERIA,
  COPY_REQUEST_FEES,
  GET_YEAR_CONTENTS

} from "./actionTypes";

import {GET_FILTERED_PERIODS }  from "../periods/actionTypes";
import {
  getRequestsFeesSuccess,
  getRequestsFeesFail,
  getRequestFeesDeletedValueSuccess,
  getRequestFeesDeletedValueFail,
  addRequestFeesFail,
  addRequestFeesSuccess,
  updateRequestFeesSuccess,
  updateRequestFeesFail,
  deleteRequestFeesSuccess,
  deleteRequestFeesFail,
  copyRequestFeesSuccess,
  copyRequestFeesFail,
  getYearContentsSuccess,
  getYearContentsFail
} from "./actions";

import {
  getYearSemestersSuccess,
  getYearSemestersFail,
} from "../general-management/actions";

import { getSemestersSuccess, getSemestersFail } from "../semesters/actions";

import { getCurrenciesSuccess, getCurrenciesFail } from "../currencies/actions";

import { getRequestsSuccess, getRequestsFail } from "../requests/actions";

import {
  getFiscalYearContentsSuccess,
  getFiscalYearContentsFail,
  getFilteredPeriodsSuccess,
  getFilteredPeriodsFail,
} from "../periods/actions";


//Include Both Helper File with needed methods
import {
  getRequestsFees,
  getRequestFeesDeletedValue,
  addNewRequestFees,
  updateRequestFees,
  deleteRequestFees,
  getYearSemesters,
  getSemesters,
  copyRequestFees,
  getCurrencies,
  getFiscalYearContents,
  getFilteredPeriods,
  getRequests,
  getYearContents

} from "helpers/fakebackend_helper";

function* fetchRequestsFees(obj) {
  const requestFees = obj.payload
  const get_periods = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_requestPrice",
    filter: `currencyId = ${requestFees.currencyId} and (periodId = ${requestFees.periodId} or periodId is null ) `,

  };

  try {
    const response = yield call(getRequestsFees, get_periods);
    yield put(getRequestsFeesSuccess(response));
  } catch (error) {
    yield put(getRequestsFeesFail(error));
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


}


function* fetchRequestFeesDeletedValue({ periodId }) {
  try {
    const response = yield call(getRequestFeesDeletedValue, periodId);
    yield put(getRequestFeesDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRequestFeesDeletedValueFail(error));
  }
}

function* onUpdateRequestFees({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_updateData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "finance_requestPrice";
  
    const response = yield call(updateRequestFees, payload);
    yield put(updateRequestFeesSuccess(response[0]));
  } catch (error) {
    yield put(updateRequestFeesFail(error));
  }
}

function* onDeleteRequestFees({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_requestPrice";

  try {
    const response = yield call(deleteRequestFees, payload);
    yield put(deleteRequestFeesSuccess(response[0]));
  } catch (error) {
    yield put(deleteRequestFeesFail(error));
  }
}

function* onAddNewRequestFees({ payload, period }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_requestPrice";


  try {
    const response = yield call(addNewRequestFees, payload);
    yield put(addRequestFeesSuccess(response[0]));
  } catch (error) {
    yield put(addRequestFeesFail(error));
  }
}

function* fetchRequestCriteria() {

  //currencies
  const get_currencies = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_currencies",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCurrencies, get_currencies);
    yield put(getCurrenciesSuccess(response));
  } catch (error) {
    yield put(getCurrenciesFail(error));
  }

  //semester
  const get_semesters_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Semesters",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getSemesters, get_semesters_req);
    yield put(getSemestersSuccess(response));
  } catch (error) {
    yield put(getSemestersFail(error));
  }

  // year content
  const get_fiscalYears = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_FiscalYearContents",
    filter: "contentTypeId = 2",
    fields: "Id,arTitle",

  };

  try {
    const response = yield call(getYearContents, get_fiscalYears);
    yield put(getYearContentsSuccess(response));
  } catch (error) {
    yield put(getYearContentsFail(error));
  }

  //get request
  const get_request_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_requests",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getRequests, get_request_opt);
    yield put(getRequestsSuccess(response));
  } catch (error) {
    yield put(getRequestsFail(error));
  }
}

function* onCopyRequestFees({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "copyRequestFeesition";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const response = yield call(copyRequestFees, payload);
    yield put(copyRequestFeesSuccess(response));
  } catch (error) {
    yield put(copyRequestFeesFail(error));
  }
}

function* onGetFilteredPeriods(content) {
    const get_filtered_details = {
      source: "db",
      procedure: "Generic_getOptions",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "_finance_FiscalYearPeriod",
      filter: `contentId  = ${content.payload.contentId}`,
      fields: "Id,arTitle",

    };
  
    try {
      const response = yield call(getFilteredPeriods, get_filtered_details);
      yield put(getFilteredPeriodsSuccess(response));
    } catch (error) {
      yield put(getFilteredPeriodsFail(error));
    }
  }

function* periodsSaga() {
  yield takeEvery(GET_REQUESTS_FEES, fetchRequestsFees);
  yield takeEvery(GET_REQUEST_FEES_DELETED_VALUE, fetchRequestFeesDeletedValue);
  yield takeEvery(ADD_NEW_REQUEST_FEES, onAddNewRequestFees);
  yield takeEvery(UPDATE_REQUEST_FEES, onUpdateRequestFees);
  yield takeEvery(DELETE_REQUEST_FEES, onDeleteRequestFees);
  yield takeEvery(GET_REQUEST_CRITERIA, fetchRequestCriteria);
  yield takeEvery(COPY_REQUEST_FEES, onCopyRequestFees);
  yield takeEvery(GET_FILTERED_PERIODS, onGetFilteredPeriods);


}

export default periodsSaga;
