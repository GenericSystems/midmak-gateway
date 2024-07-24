import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_LETTER_GRADES,
  ADD_NEW_LETTER_GRADE,
  UPDATE_LETTER_GRADE,
  DELETE_LETTER_GRADE,
  GET_LETTER_GRADE_DETAILS,
  ADD_NEW_LETTER_GRADE_DETAIL,
  UPDATE_LETTER_GRADE_DETAIL,
  DELETE_LETTER_GRADE_DETAIL,
  GET_LETTER_GRADE_DELETED_VALUE,
  GET_LETTER_GRADE_DETAILS_DELETED_VALUE
} from "./actionTypes";

import {
  getLetterGradesSuccess,
  getLetterGradesFail,
  addLetterGradeSuccess,
  addLetterGradeFail,
  updateLetterGradeSuccess,
  updateLetterGradeFail,
  deleteLetterGradeSuccess,
  deleteLetterGradeFail,
  getLetterGradeDetailsSuccess,
  getLetterGradeDetailsFail,
  addLetterGradeDetailSuccess,
  addLetterGradeDetailFail,
  updateLetterGradeDetailSuccess,
  updateLetterGradeDetailFail,
  deleteLetterGradeDetailSuccess,
  deleteLetterGradeDetailFail,
  getLetterGradeDeletedValueSuccess,
  getLetterGradeDeletedValueFail,
  getLetterGradeDetailsDeletedValueSuccess,
  getLetterGradeDetailsDeletedValueFail,
} from "./actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";

import { getEstimatesSuccess, getEstimatesFail } from "../estimates/actions";
import {
  getLetterGrades,
  addNewLetterGrade,
  updateLetterGrade,
  deleteLetterGrade,
  getYears,
  getEstimates,
  getLetterGradeDetails,
  addNewLetterGradeDetail,
  updateLetterGradeDetail,
  deleteLetterGradeDetail,
  getLetterGradeDeletedValue,
  getLetterGradeDetailsDeletedValue
} from "../../helpers/fakebackend_helper";

function* fetchLetterGrades() {
  const get_letterGrades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_LetterGradesDecision",
  };
  try {
    const response = yield call(getLetterGrades, get_letterGrades_req);
    yield put(getLetterGradesSuccess(response));
  } catch (error) {
    yield put(getLetterGradesFail(error));
  }

  const get_YearsOptions_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_YearsOptions_req);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }

  const get_EstimateOptions_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_estimate",
    fields: "Id,arEstimate",
  };
  try {
    const response = yield call(getEstimates, get_EstimateOptions_req);
    yield put(getEstimatesSuccess(response));
  } catch (error) {
    yield put(getEstimatesFail(error));
  }
}

function* onAddNewLetterGrade({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "decision_add";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LetterGradesDecision";
  payload["title"] = `${payload.title}`;
  payload["fromYearId"] = `${payload.fromYearId}`;
  payload["toYearId"] = `${payload.toYearId}`;

  try {
    const response = yield call(addNewLetterGrade, payload);
    yield put(addLetterGradeSuccess(response[0]));
  } catch (error) {
    yield put(addLetterGradeFail(error));
  }
}

function* onUpdateLetterGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LetterGradesDecision";

  try {
    const respupdate = yield call(updateLetterGrade, payload);
    yield put(updateLetterGradeSuccess(respupdate[0]));
    yield fetchLetterGrades();
  } catch (error) {
    yield put(updateLetterGradeFail(error));
  }
}

function* onDeleteLetterGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LetterGradesDecision";

  try {
    const respdelete = yield call(deleteLetterGrade, payload);
    yield put(deleteLetterGradeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteLetterGradeFail(error));
  }
}

//LETTERGRADEDETAILS
function* fetchLetterGradeDetails(obj) {
  let letterId = obj.payload;
  const get_letterGradeDetails_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_LetterGradesDetails",
    filter: `LetterGradesDecisionId = ${letterId}  `,
  };
  try {
    const response = yield call(
      getLetterGradeDetails,
      get_letterGradeDetails_req
    );
    yield put(getLetterGradeDetailsSuccess(response));
  } catch (error) {
    yield put(getLetterGradeDetailsFail(error));
  }
}

function* onAddNewLetterGradeDetail({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LetterGradesDetails";

  try {
    const response = yield call(addNewLetterGradeDetail, payload);
    yield put(addLetterGradeDetailSuccess(response[0]));
  } catch (error) {
    yield put(addLetterGradeDetailFail(error));
  }
}

function* onUpdateLetterGradeDetail({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LetterGradesDetails";

  try {
    const respupdate = yield call(updateLetterGradeDetail, payload);
    yield put(updateLetterGradeDetailSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateLetterGradeDetailFail(error));
  }
}

function* onDeleteLetterGradeDetail({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LetterGradesDetails";

  try {
    const respdelete = yield call(deleteLetterGradeDetail, payload);
    yield put(deleteLetterGradeDetailSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteLetterGradeDetailFail(error));
  }
}

function* onGetLetterGradeDeletedValue() {
  try {
    const response = yield call(getLetterGradeDeletedValue)
    yield put(getLetterGradeDeletedValueSuccess(response))
  } catch (error) {
    yield put(getLetterGradeDeletedValueFail(error))
  }
  
}
function* onGetLetterGradeDetailsDeletedValue() {
  try {
    const response = yield call(getLetterGradeDetailsDeletedValue)
    yield put(getLetterGradeDetailsDeletedValueSuccess(response))
  } catch (error) {
    yield put(getLetterGradeDetailsDeletedValueFail(error))
  }
  
}
function* letterGradesSaga() {
  yield takeEvery(GET_LETTER_GRADES, fetchLetterGrades);
  yield takeEvery(ADD_NEW_LETTER_GRADE, onAddNewLetterGrade);
  yield takeEvery(UPDATE_LETTER_GRADE, onUpdateLetterGrade);
  yield takeEvery(DELETE_LETTER_GRADE, onDeleteLetterGrade);
  yield takeEvery(GET_LETTER_GRADE_DETAILS, fetchLetterGradeDetails);
  yield takeEvery(ADD_NEW_LETTER_GRADE_DETAIL, onAddNewLetterGradeDetail);
  yield takeEvery(UPDATE_LETTER_GRADE_DETAIL, onUpdateLetterGradeDetail);
  yield takeEvery(DELETE_LETTER_GRADE_DETAIL, onDeleteLetterGradeDetail);
  yield takeEvery(GET_LETTER_GRADE_DELETED_VALUE, onGetLetterGradeDeletedValue);
  yield takeEvery(GET_LETTER_GRADE_DETAILS_DELETED_VALUE, onGetLetterGradeDetailsDeletedValue);
}

export default letterGradesSaga;
