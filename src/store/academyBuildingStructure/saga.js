import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACADEMY_BUILDING_STRUCTURES,
  GET_HALL_TYPES,
  GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE,
  ADD_NEW_ACADEMY_BUILDING_STRUCTURE,
  DELETE_ACADEMY_BUILDING_STRUCTURE,
  UPDATE_ACADEMY_BUILDING_STRUCTURE,
} from "./actionTypes";

import {
  getAcademyBuildingStructuresSuccess,
  getAcademyBuildingStructuresFail,
  getHallTypesSuccess,
  getHallTypesFail,
  getAcademyBuildingStructureDeletedValueSuccess,
  getAcademyBuildingStructureDeletedValueFail,
  addAcademyBuildingStructureFail,
  addAcademyBuildingStructureSuccess,
  updateAcademyBuildingStructureSuccess,
  updateAcademyBuildingStructureFail,
  deleteAcademyBuildingStructureSuccess,
  deleteAcademyBuildingStructureFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAcademyBuildingStructures,
  getHallTypes,
  getAcademyBuildingStructureDeletedValue,
  addNewAcademyBuildingStructure,
  updateAcademyBuildingStructure,
  deleteAcademyBuildingStructure,
} from "../../helpers/fakebackend_helper";

function* fetchAcademyBuildingStructure() {
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmeyBuildingStructure",
  };

  try {
    const response = yield call(getAcademyBuildingStructures, request);
    console.log("RRRRRRRRRRRRRRRRRRRE", response);
    /* response.map(resp => {
      resp["departments"] = JSON.parse(resp["departments"]);
    }); */
    yield put(getAcademyBuildingStructuresSuccess(response));
  } catch (error) {
    yield put(getAcademyBuildingStructuresFail(error));
  }
}

function* fetchHallTypes() {
  const get_hallTypes_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getHallTypes, get_hallTypes_req);
    console.log(
      "ddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaa",
      response
    );
    /* response.map(resp => {
      resp["departments"] = JSON.parse(resp["departments"]);
    }); */
    yield put(getHallTypesSuccess(response));
  } catch (error) {
    yield put(getHallTypesFail(error));
  }
}

/* ADD */
function* onAddAcademyBuildingStructure({ payload }) {
  payload.source = "db";
  payload.procedure = "SisApp_addData";
  payload.apikey = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.queryname = "_AcadmeyBuildingStructure";

  try {
    const response = yield call(addNewAcademyBuildingStructure, payload);
    yield put(addAcademyBuildingStructureSuccess(response));
    yield call(fetchAcademyBuildingStructure);
  } catch (error) {
    yield put(addAcademyBuildingStructureFail(error));
  }
}

/* UPDATE */
function* onUpdateAcademyBuildingStructure({ payload }) {
  payload.source = "db";
  payload.procedure = "SisApp_updateData";
  payload.apikey = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(updateAcademyBuildingStructure, payload);
    yield put(updateAcademyBuildingStructureSuccess(response[0]));
    yield call(fetchAcademyBuildingStructure);
  } catch (error) {
    yield put(updateAcademyBuildingStructureFail(error));
  }
}

/* DELETE */
function* onDeleteAcademyBuildingStructure({ payload }) {
  payload.source = "db";
  payload.procedure = "SisApp_removeData";
  payload.apikey = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(deleteAcademyBuildingStructure, payload);
    yield put(deleteAcademyBuildingStructureSuccess(response[0]));
    yield call(fetchAcademyBuildingStructure);
  } catch (error) {
    yield put(deleteAcademyBuildingStructureFail(error));
  }
}

/* GET DELETED VALUE */
function* onGetAcademyBuildingStructureDeletedValue() {
  try {
    const response = yield call(getAcademyBuildingStructureDeletedValue);
    yield put(getAcademyBuildingStructureDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAcademyBuildingStructureDeletedValueFail(error));
  }
}

function* academyBuildingStructureSaga() {
  yield takeEvery(
    GET_ACADEMY_BUILDING_STRUCTURES,
    fetchAcademyBuildingStructure
  );
  yield takeEvery(GET_HALL_TYPES, fetchHallTypes);
  yield takeEvery(
    ADD_NEW_ACADEMY_BUILDING_STRUCTURE,
    onAddAcademyBuildingStructure
  );
  yield takeEvery(
    UPDATE_ACADEMY_BUILDING_STRUCTURE,
    onUpdateAcademyBuildingStructure
  );
  yield takeEvery(
    DELETE_ACADEMY_BUILDING_STRUCTURE,
    onDeleteAcademyBuildingStructure
  );
  yield takeEvery(
    GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE,
    onGetAcademyBuildingStructureDeletedValue
  );
}

export default academyBuildingStructureSaga;
