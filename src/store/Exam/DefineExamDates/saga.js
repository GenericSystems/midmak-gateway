import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DEFINE_EXAM_DATES,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE,
  ADD_NEW_DEFINE_EXAM_DATE,
  UPDATE_DEFINE_EXAM_DATE,
  DELETE_DEFINE_EXAM_DATE,
  GET_STUDENTS_ORDER,
  GET_DEFINE_PERIODS,
  GET_DEFINE_PERIOD_DELETED_VALUE,
  ADD_NEW_DEFINE_PERIOD,
  UPDATE_DEFINE_PERIOD,
  DELETE_DEFINE_PERIOD,
} from "./actionTypes";

import {
  getDefineExamDatesSuccess,
  getDefineExamDatesFail,
  getDefineExamDateDeletedValueSuccess,
  getDefineExamDateDeletedValueFail,
  addDefineExamDateFail,
  addDefineExamDateSuccess,
  updateDefineExamDateSuccess,
  updateDefineExamDateFail,
  deleteDefineExamDateSuccess,
  deleteDefineExamDateFail,
  getStudentsOrderSuccess,
  getStudentsOrderFail,
  getDefinePeriodsSuccess,
  getDefinePeriodsFail,
  getDefinePeriodDeletedValueSuccess,
  getDefinePeriodDeletedValueFail,
  addDefinePeriodFail,
  addDefinePeriodSuccess,
  updateDefinePeriodSuccess,
  updateDefinePeriodFail,
  deleteDefinePeriodSuccess,
  deleteDefinePeriodFail,
} from "./actions";

import {
  getGradeTypesSuccess,
  getGradeTypesFail,
} from "../../grade-types/actions";

//Include Both Helper File with needed methods
import {
  getDefineExamDates,
  getDefineExamDateDeletedValue,
  addNewDefineExamDate,
  updateDefineExamDate,
  deleteDefineExamDate,
  getGradeTypes,
  getStudentsOrder,
  getDefinePeriods,
  getDefinePeriodDeletedValue,
  addNewDefinePeriod,
  updateDefinePeriod,
  deleteDefinePeriod,
} from "../../../helpers/fakebackend_helper";

function* fetchDefineExamDates(selectedpayload) {
  let lang = selectedpayload.payload;
  // const titleField = lang === "en" ? "enTitle" : "arTitle";
  const get_defineExamDate_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DefineExamDates",
  };
  try {
    const response = yield call(getDefineExamDates, get_defineExamDate_req);
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", response);
    yield put(getDefineExamDatesSuccess(response));
  } catch (error) {
    yield put(getDefineExamDatesFail(error));
  }

  const request = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_GradeType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getGradeTypes, request);
    console.log("123123123", response);
    yield put(getGradeTypesSuccess(response));
  } catch (error) {
    yield put(getGradeTypesFail(error));
  }
}

function* fetchStudentsOrder() {
  const get_studentsOrder_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_StudentsOrder",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getStudentsOrder, get_studentsOrder_req);
    console.log("aaaaaaaaaaaaaaaaaaaaaaa", response);
    yield put(getStudentsOrderSuccess(response));
  } catch (error) {
    yield put(getStudentsOrderFail(error));
  }
}

function* getDefineExamDateProfile() {
  try {
    const response = yield call(getDefineExamDateDeletedValue);
    yield put(getDefineExamDateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDefineExamDateDeletedValueFail(error));
  }
}

function* onAddNewDefineExamDate({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DefineExamDates";
  // payload["queryname"] = "_Common_DefineExamDate";

  try {
    const response = yield call(addNewDefineExamDate, payload);
    console.log("اااااااااااااااااااااااااااااااا", response);
    // response.map(resp => {
    //   resp["allDays"] = JSON.parse(resp["allDays"]);
    // });
    yield put(addDefineExamDateSuccess(response[0]));
  } catch (error) {
    yield put(addDefineExamDateFail(error));
  }
}

function* onDeleteDefineExamDate({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DefineExamDates";

  try {
    const response = yield call(deleteDefineExamDate, payload);
    yield put(deleteDefineExamDateSuccess(response[0]));
  } catch (error) {
    yield put(deleteDefineExamDateFail(error));
  }
}

function* onUpdateDefineExamDate({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DefineExamDates";
  // payload["queryname"] = "_Common_DefineExamDate";
  try {
    const respupdate = yield call(updateDefineExamDate, payload);
    console.log("UpdateDefineExamDate", respupdate);
    yield put(updateDefineExamDateSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDefineExamDateFail(error));
  }
}

function* onGetDefineExamDateDeletedValue() {
  try {
    const response = yield call(getDefineExamDateDeletedValue);
    yield put(getDefineExamDateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDefineExamDateDeletedValueFail(error));
  }
}

function* fetchDefinePeriods(obj) {
  let ExamId = obj.payload;
  console.log("objaaaaaaaaaaaaaaaaaaaaaaaaaaaa", obj);
  const get_definePeriods_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_ExamPeriods",
    filter: `ExamId = ${ExamId}`,
  };
  try {
    const response = yield call(getDefinePeriods, get_definePeriods_req);
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnn", response);
    yield put(getDefinePeriodsSuccess(response));
  } catch (error) {
    yield put(getDefinePeriodsFail(error));
  }
}

function* onAddNewDefinePeriod({ payload }) {
  console.log("payloadpayload", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamPeriods";

  try {
    const response = yield call(addNewDefinePeriod, payload);

    yield put(addDefinePeriodSuccess(response[0]));
  } catch (error) {
    yield put(addDefinePeriodFail(error));
  }
}

function* onDeleteDefinePeriod({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamPeriods";

  try {
    const response = yield call(deleteDefinePeriod, payload);
    yield put(deleteDefinePeriodSuccess(response[0]));
  } catch (error) {
    yield put(deleteDefinePeriodFail(error));
  }
}

function* onUpdateDefinePeriod({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamPeriods";
  try {
    const respupdate = yield call(updateDefinePeriod, payload);
    console.log("UpdateDefinePeriod", respupdate);
    yield put(updateDefinePeriodSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDefinePeriodFail(error));
  }
}

function* onGetDefinePeriodDeletedValue() {
  try {
    const response = yield call(getDefinePeriodDeletedValue);
    yield put(getDefinePeriodDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDefinePeriodDeletedValueFail(error));
  }
}

function* DefineExamDatesSaga() {
  yield takeEvery(GET_DEFINE_EXAM_DATES, fetchDefineExamDates);
  yield takeEvery(
    GET_DEFINE_EXAM_DATE_DELETED_VALUE,
    onGetDefineExamDateDeletedValue
  );
  yield takeEvery(GET_DEFINE_EXAM_DATE_DELETED_VALUE, getDefineExamDateProfile);
  yield takeEvery(ADD_NEW_DEFINE_EXAM_DATE, onAddNewDefineExamDate);
  yield takeEvery(UPDATE_DEFINE_EXAM_DATE, onUpdateDefineExamDate);
  yield takeEvery(DELETE_DEFINE_EXAM_DATE, onDeleteDefineExamDate);
  yield takeEvery(GET_STUDENTS_ORDER, fetchStudentsOrder);
  yield takeEvery(GET_DEFINE_PERIODS, fetchDefinePeriods);
  yield takeEvery(
    GET_DEFINE_PERIOD_DELETED_VALUE,
    onGetDefinePeriodDeletedValue
  );
  yield takeEvery(ADD_NEW_DEFINE_PERIOD, onAddNewDefinePeriod);
  yield takeEvery(UPDATE_DEFINE_PERIOD, onUpdateDefinePeriod);
  yield takeEvery(DELETE_DEFINE_PERIOD, onDeleteDefinePeriod);
}

export default DefineExamDatesSaga;
