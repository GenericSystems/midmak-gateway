import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_LEVELING_DECISIONS,
  ADD_NEW_LEVELING_DECISION,
  UPDATE_LEVELING_DECISION,
  DELETE_LEVELING_DECISION,
  GET_LEVELING_DECISION_DETAILS,
  ADD_NEW_LEVELING_DECISION_DETAIL,
  UPDATE_LEVELING_DECISION_DETAIL,
  DELETE_LEVELING_DECISION_DETAIL,
  GET_LEVELING_DECISION_DELETED_VALUE,
  COPY_FACULTY,
  COPY_FACULTY_SUCCESS,
  COPY_FACULTY_FAIL,
  GET_LEVELING_DECISION_DETAILS_DELETED_VALUE
} from "./actionTypes";

import {
  getLevelingDecisionsSuccess,
  getLevelingDecisionsFail,
  addLevelingDecisionSuccess,
  addLevelingDecisionFail,
  updateLevelingDecisionSuccess,
  updateLevelingDecisionFail,
  deleteLevelingDecisionSuccess,
  deleteLevelingDecisionFail,
  getLevelingDecisionDetailsSuccess,
  getLevelingDecisionDetailsFail,
  addLevelingDecisionDetailSuccess,
  addLevelingDecisionDetailFail,
  updateLevelingDecisionDetailSuccess,
  updateLevelingDecisionDetailFail,
  deleteLevelingDecisionDetailSuccess,
  deleteLevelingDecisionDetailFail,
  getLevelingDecisionDeletedValueSuccess,
  getLevelingDecisionDeletedValueFail,
  copyFacultySuccess,
  copyFacultyFail,
  getLevelingDecisionDetailsDeletedValueFail,
} from "./actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import { getLevelsSuccess, getLevelsFail } from "../levels/actions";

import { getEstimatesSuccess, getEstimatesFail } from "../estimates/actions";
import {
  getLevelingDecisions,
  addNewLevelingDecision,
  updateLevelingDecision,
  deleteLevelingDecision,
  getYears,
  getEstimates,
  getLevelingDecisionDetails,
  addNewLevelingDecisionDetail,
  updateLevelingDecisionDetail,
  deleteLevelingDecisionDetail,
  getLevelingDecisionDeletedValue,
  getFaculties,
  getLevels,
  copyFaculty,
  getLevelingDecisionDetailsDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchLevelingDecisions() {
  const get_levelingDecisions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_LevelDecision",
  };
  try {
    const response = yield call(
      getLevelingDecisions,
      get_levelingDecisions_req
    );
    yield put(getLevelingDecisionsSuccess(response));
  } catch (error) {
    yield put(getLevelingDecisionsFail(error));
  }

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
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
  //get course level
  const get_Level = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Levels",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getLevels, get_Level);

    yield put(getLevelsSuccess(response));
  } catch (error) {
    yield put(getLevelsFail(error));
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

function* onAddNewLevelingDecision({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "decision_add";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LevelDecision";
  payload["title"] = `${payload.title}`;
  payload["fromYearId"] = `${payload.fromYearId}`;
  payload["toYearId"] = `${payload.toYearId}`;
  try {
    const response = yield call(addNewLevelingDecision, payload);
    yield put(addLevelingDecisionSuccess(response[0]));
  } catch (error) {
    yield put(addLevelingDecisionFail(error));
  }
}

function* onUpdateLevelingDecision({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LevelDecision";

  try {
    const respupdate = yield call(updateLevelingDecision, payload);
    yield put(updateLevelingDecisionSuccess(respupdate[0]));
    yield fetchLevelingDecisions();
  } catch (error) {
    yield put(updateLevelingDecisionFail(error));
  }
}

function* onDeleteLevelingDecision({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LevelDecision";

  try {
    const respdelete = yield call(deleteLevelingDecision, payload);
    yield put(deleteLevelingDecisionSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteLevelingDecisionFail(error));
  }
}

//LETTERGRADEDETAILS
function* fetchLevelingDecisionDetails(obj) {
  let decisionId = obj.payload.decisionId;
  let facultyId = obj.payload.facultyId;
  const get_levelingDecisionDetails_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_LevelYearsDetails",
    filter: `levelDecisionId = ${decisionId} AND facultyId= ${facultyId} `,
  };
  try {
    const response = yield call(
      getLevelingDecisionDetails,
      get_levelingDecisionDetails_req
    );
    yield put(getLevelingDecisionDetailsSuccess(response));
  } catch (error) {
    yield put(getLevelingDecisionDetailsFail(error));
  }
}

function* onAddNewLevelingDecisionDetail({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LevelYearsDetails";

  try {
    const response = yield call(addNewLevelingDecisionDetail, payload);
    yield put(addLevelingDecisionDetailSuccess(response[0]));
  } catch (error) {
    yield put(addLevelingDecisionDetailFail(error));
  }
}

function* onUpdateLevelingDecisionDetail({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LevelYearsDetails";

  try {
    const respupdate = yield call(updateLevelingDecisionDetail, payload);
    yield put(updateLevelingDecisionDetailSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateLevelingDecisionDetailFail(error));
  }
}

function* onDeleteLevelingDecisionDetail({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_LevelYearsDetails";

  try {
    const respdelete = yield call(deleteLevelingDecisionDetail, payload);
    yield put(deleteLevelingDecisionDetailSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteLevelingDecisionDetailFail(error));
  }
}

function* CopyFaculty({ payload }) {

  payload["source"] = "db";
  payload["procedure"] = "copyLevelDetails";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(copyFaculty, payload);
    yield put(getLevelingDecisionDetailsSuccess(response));
  } catch (error) {
    yield put(getLevelingDecisionDetailsFail(error));
  }
}

function* onGetLevelingDecisionDeletedValue() {
  try {
    const response = yield call(getLevelingDecisionDeletedValue)
    yield put(getLevelingDecisionDeletedValueSuccess(response))
  } catch (error) {
    yield put(getLevelingDecisionDeletedValueFail(error))
  }
  
}


function* onGetLevelingDecisionDetailsDeletedValue() {
  try {
    const response = yield call(getLevelingDecisionDetailsDeletedValue)
    yield put(getLevelingDecisionDetailsDeletedValueSuccess(response))
  } catch (error) {
    yield put(getLevelingDecisionDetailsDeletedValueFail(error))
  }
  
}
function* levelingDecisionsSaga() {
  yield takeEvery(COPY_FACULTY, CopyFaculty);
  yield takeEvery(GET_LEVELING_DECISIONS, fetchLevelingDecisions);
  yield takeEvery(ADD_NEW_LEVELING_DECISION, onAddNewLevelingDecision);
  yield takeEvery(UPDATE_LEVELING_DECISION, onUpdateLevelingDecision);
  yield takeEvery(DELETE_LEVELING_DECISION, onDeleteLevelingDecision);
  yield takeEvery(GET_LEVELING_DECISION_DETAILS, fetchLevelingDecisionDetails);
  yield takeEvery(GET_LEVELING_DECISION_DELETED_VALUE, onGetLevelingDecisionDeletedValue);
  yield takeEvery(
    ADD_NEW_LEVELING_DECISION_DETAIL,
    onAddNewLevelingDecisionDetail
  );
  yield takeEvery(
    UPDATE_LEVELING_DECISION_DETAIL,
    onUpdateLevelingDecisionDetail
  );
  yield takeEvery(
    DELETE_LEVELING_DECISION_DETAIL,
    onDeleteLevelingDecisionDetail
  );
  yield takeEvery(GET_LEVELING_DECISION_DETAILS_DELETED_VALUE, onGetLevelingDecisionDetailsDeletedValue);
}

export default levelingDecisionsSaga;
