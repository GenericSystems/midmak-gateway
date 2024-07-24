import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_FINES_DEFINITION,
  GET_FINE_DEFINITION_DELETED_VALUE,
  ADD_NEW_FINE_DEFINITION,
  DELETE_FINE_DEFINITION,
  UPDATE_FINE_DEFINITION,
  GET_CRITERIA,
  COPY_FINE,
} from "./actionTypes";

import {
  getFinesDefinitionSuccess,
  getFinesDefinitionFail,
  getFineDefinitionDeletedValueSuccess,
  getFineDefinitionDeletedValueFail,
  addFineDefinitionFail,
  addFineDefinitionSuccess,
  updateFineDefinitionSuccess,
  updateFineDefinitionFail,
  deleteFineDefinitionSuccess,
  deleteFineDefinitionFail,
  getCriteriaSuccess,
  getCriteriaFail,
  copyFineSuccess,
  copyFineFail,
} from "./actions";

import { getCurrenciesSuccess, getCurrenciesFail } from "../currencies/actions";
import { getSemestersSuccess, getSemestersFail } from "../semesters/actions";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";
import { getFinesSuccess, getFinesFail } from "../fines/actions";
import { getYearSemestersSuccess, getYearSemestersFail } from "../general-management/actions";

//Include Both Helper File with needed methods
import {
  getFinesDefinition,
  getFineDefinitionDeletedValue,
  addNewFineDefinition,
  updateFineDefinition,
  deleteFineDefinition,
  getCriteria,
  getCurrencies,
  getSemesters,
  getFaculties,
  copyFine,
  getFines,
  getYearSemesters
} from "../../helpers/fakebackend_helper";

function* fetchFinesDefinition(obj) {
  const fine = obj.payload
  const get_finesDefinition_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_finance_finesFess",
    filter: `currencyId = ${fine.currencyId} and (facultyId = ${fine.facultyId} or facultyId is null ) and yearSemesterId = ${fine.yearSemesterId}`,
  };

  try {
    const response = yield call(getFinesDefinition, get_finesDefinition_req);
    yield put(getFinesDefinitionSuccess(response));
  } catch (error) {
    yield put(getFinesDefinitionFail(error));
  }
}

function* onAddNewFineDefinition({ payload, fineDefinition }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_finesFess";

  try {
    const response = yield call(addNewFineDefinition, payload);
    yield put(addFineDefinitionSuccess(response[0]));
  } catch (error) {
    yield put(addFineDefinitionFail(error));
  }
}

function* onUpdateFineDefinition({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_finesFess";
  try {
    const response = yield call(updateFineDefinition, payload);
    yield put(updateFineDefinitionSuccess(response[0]));
  } catch (error) {
    yield put(updateFineDefinitionFail(error));
  }
}

function* onDeleteFineDefinition({ payload, fineDefinition }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_finesFess";
  try {
    const responsedelete = yield call(deleteFineDefinition, payload);
    yield put(deleteFineDefinitionSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteFineDefinitionFail(error));
  }
}

function* onGetFineDefinitionDeletedValue() {
  try {
    const response = yield call(getFineDefinitionDeletedValue);
    yield put(getFineDefinitionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getFineDefinitionDeletedValueFail(error));
  }
}

function* fetchCriteria() {
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
    procedure: "Generic_getOptions",
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

  // years semester
  const get_year_sem = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_YearsSemesters",
    fields: "key,value",

  };
  try {
    const response = yield call(getYearSemesters, get_year_sem);
    yield put(getYearSemestersSuccess(response));
  } catch (error) {
    yield put(getYearSemestersFail(error));
  }

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  //fines
  const get_fines_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_fines",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getFines, get_fines_req);
    yield put(getFinesSuccess(response));
  } catch (error) {
    yield put(getFinesFail(error));
  }

  /* try {
    const response = yield call(getCriteria);
    yield put(getCriteriaSuccess(response));
  } catch (error) {
    yield put(getCriteriaFail(error));
  } */
}

function* onCopyFine({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "copyFineition";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const response = yield call(copyFine, payload);
    yield put(copyFineSuccess(response));
  } catch (error) {
    yield put(copyFineFail(error));
  }
}

function* finesDefinitionSaga() {
  yield takeEvery(GET_FINES_DEFINITION, fetchFinesDefinition);
  yield takeEvery(ADD_NEW_FINE_DEFINITION, onAddNewFineDefinition);
  yield takeEvery(UPDATE_FINE_DEFINITION, onUpdateFineDefinition);
  yield takeEvery(DELETE_FINE_DEFINITION, onDeleteFineDefinition);
  yield takeEvery(
    GET_FINE_DEFINITION_DELETED_VALUE,
    onGetFineDefinitionDeletedValue
  );
  yield takeEvery(GET_CRITERIA, fetchCriteria);
  yield takeEvery(COPY_FINE, onCopyFine);
}

export default finesDefinitionSaga;
