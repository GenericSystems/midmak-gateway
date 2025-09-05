import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_ACADEMY_ORG_STRUCTURES,
  ADD_NEW_ACADEMY_ORG_STRUCTURE,
  UPDATE_ACADEMY_ORG_STRUCTURE,
  DELETE_ACADEMY_ORG_STRUCTURE,
  GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE,
} from "./actionTypes";

// Action Creators
import {
  getAcademyOrgStructureSuccess,
  getAcademyOrgStructureFail,
  addNewAcademyOrgStructureSuccess,
  addNewAcademyOrgStructureFail,
  updateAcademyOrgStructureSuccess,
  updateAcademyOrgStructureFail,
  deleteAcademyOrgStructureSuccess,
  deleteAcademyOrgStructureFail,
  getAcademyOrgStructureDeletedValueSuccess,
  getAcademyOrgStructureDeletedValueFail,
} from "./actions";

import {
  getAcademyInfoSuccess,
  getAcademyInfoFail,
} from "../academydef/actions";

// API Helpers
import {
  getAcademyOrgStructure,
  addNewAcademyOrgStructure,
  updateAcademyOrgStructure,
  deleteAcademyOrgStructure,
  getAcademyOrgStructureDeletedValue,
  getAcademyInfo,
} from "../../helpers/fakebackend_helper";

// Constants

/* FETCH */
function* fetchAcademyOrgStructure(selectedpayload) {
  let lang = selectedpayload.payload;
  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", lang);

  const titleField = lang === "en" ? "enTitle" : "arTitle";
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmeyOrgStructure",
  };

  try {
    const response = yield call(getAcademyOrgStructure, request);
    /* response.map(resp => {
      resp["departments"] = JSON.parse(resp["departments"]);
    }); */
    yield put(getAcademyOrgStructureSuccess(response));
  } catch (error) {
    yield put(getAcademyOrgStructureFail(error));
  }
  const get_academyInfo_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcademyInfo",
    // fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(getAcademyInfo, get_academyInfo_req);
    yield put(getAcademyInfoSuccess(response[0]));
  } catch (error) {
    yield put(getAcademyInfoFail(error));
  }
}

/* ADD */
function* onAddAcademyOrgStructure({ payload }) {
  payload.source = "db";
  payload.procedure = "SisApp_addData";
  payload.apikey = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.queryname = "_AcadmeyOrgStructure";

  try {
    const response = yield call(addNewAcademyOrgStructure, payload);
    yield put(addNewAcademyOrgStructureSuccess(response));
    yield call(fetchAcademyOrgStructure);
  } catch (error) {
    yield put(addNewAcademyOrgStructureFail(error));
  }
}

/* UPDATE */
function* onUpdateAcademyOrgStructure({ payload }) {
  payload.source = "db";
  payload.procedure = "SisApp_updateData";
  payload.apikey = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(updateAcademyOrgStructure, payload);
    yield put(updateAcademyOrgStructureSuccess(response[0]));
    yield call(fetchAcademyOrgStructure);
  } catch (error) {
    yield put(updateAcademyOrgStructureFail(error));
  }
}

/* DELETE */
function* onDeleteAcademyOrgStructure({ payload }) {
  payload.source = "db";
  payload.procedure = "SisApp_removeData";
  payload.apikey = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(deleteAcademyOrgStructure, payload);
    yield put(deleteAcademyOrgStructureSuccess(response[0]));
    yield call(fetchAcademyOrgStructure);
  } catch (error) {
    yield put(deleteAcademyOrgStructureFail(error));
  }
}

/* GET DELETED VALUE */
function* onGetAcademyOrgStructureDeletedValue() {
  try {
    const response = yield call(getAcademyOrgStructureDeletedValue);
    yield put(getAcademyOrgStructureDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAcademyOrgStructureDeletedValueFail(error));
  }
}

function* academyOrgStructureSaga() {
  yield takeEvery(GET_ACADEMY_ORG_STRUCTURES, fetchAcademyOrgStructure);
  yield takeEvery(ADD_NEW_ACADEMY_ORG_STRUCTURE, onAddAcademyOrgStructure);
  yield takeEvery(UPDATE_ACADEMY_ORG_STRUCTURE, onUpdateAcademyOrgStructure);
  yield takeEvery(DELETE_ACADEMY_ORG_STRUCTURE, onDeleteAcademyOrgStructure);
  yield takeEvery(
    GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE,
    onGetAcademyOrgStructureDeletedValue
  );
}

export default academyOrgStructureSaga;
