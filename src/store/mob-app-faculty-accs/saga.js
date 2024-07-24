import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MOB_APP_FACULTY_ACCS,
  GET_FACULTIES,
  GET_MOB_APP_FACULTY_ACC_PROFILE,
  ADD_NEW_MOB_APP_FACULTY_ACC,
  DELETE_MOB_APP_FACULTY_ACC,
  UPDATE_MOB_APP_FACULTY_ACC,
  GET_SETTING,
  UPDATE_FACULTY,
} from "./actionTypes";

import {
  getMobAppFacultyAccsSuccess,
  getMobAppFacultyAccsFail,
  getMobAppFacultyAccProfileSuccess,
  getMobAppFacultyAccProfileFail,
  addMobAppFacultyAccFail,
  addMobAppFacultyAccSuccess,
  updateMobAppFacultyAccSuccess,
  updateMobAppFacultyAccFail,
  deleteMobAppFacultyAccSuccess,
  deleteMobAppFacultyAccFail,
  getFacultiesSuccess,
  getFacultiesFail,
  updateFacultySuccess,
  updateFacultyFail,
} from "./actions";

import {
  getStudentManagementsSuccess,
  getStudentManagementsFail,
} from "../studentManagements/actions";
import { getLevelsSuccess, getLevelsFail } from "../levels/actions";

// Include Both Helper File with needed methods
import {
  getMobAppFacultyAccs,
  getMobAppFacultyAccProfile,
  addNewMobAppFacultyAcc,
  updateMobAppFacultyAcc,
  deleteMobAppFacultyAcc,
  getStudentManagements,
  getLevels,
  getFaculties,
  updateFaculty,
} from "../../helpers/fakebackend_helper";

function* fetchSetting() {
  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Faculty",
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
}

function* fetchMobAppFacultyAccs(obj) {
  let faculty = obj.payload;

  const get_mobAppFacultyAccs_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "mobApp_FacultiesAccessConfig",
    filter: `facultyId = ${faculty}  `,
  };
  try {
    const response = yield call(
      getMobAppFacultyAccs,
      get_mobAppFacultyAccs_req
    );
    yield put(getMobAppFacultyAccsSuccess(response));
  } catch (error) {
    yield put(getMobAppFacultyAccsFail(error));
  }

  // const get_studentManagement_opt = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_SisApp_ActiveStudents",
  // };
  // try {
  //   const response = yield call(
  //     getStudentManagements,
  //     get_studentManagement_opt
  //   );
  //   yield put(getStudentManagementsSuccess(response));
  // } catch (error) {
  //   yield put(getStudentManagementsFail(error));
  // }
}

function* fetchMobAppFacultyAccProfile() {
  try {
    const response = yield call(getMobAppFacultyAccProfile);
    yield put(getMobAppFacultyAccProfileSuccess(response));
  } catch (error) {
    yield put(getMobAppFacultyAccProfileFail(error));
  }
}

function* onAddNewMobAppFacultyAcc({ payload, mobAppFacultyAcc }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "mobApp_FacultiesAccessConfig";

  try {
    const response = yield call(addNewMobAppFacultyAcc, payload);
    yield put(addMobAppFacultyAccSuccess(response[0]));
  } catch (error) {
    yield put(addMobAppFacultyAccFail(error));
  }
}

function* onUpdateMobAppFacultyAcc({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "updateActiveStudentsAccordingFacultyAccess";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] = "mobApp_FacultiesAccessConfig";

  try {
    const respupdate = yield call(updateMobAppFacultyAcc, payload);
    yield put(updateMobAppFacultyAccSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateMobAppFacultyAccFail(error));
  }
}

function* onDeleteMobAppFacultyAcc({ payload, mobAppFacultyAcc }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "mobApp_FacultiesAccessConfig";

  try {
    const respdelete = yield call(deleteMobAppFacultyAcc, payload);
    yield put(deleteMobAppFacultyAccSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteMobAppFacultyAccFail(error));
  }
}

function* onUpdateFaculty({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Faculty";

  try {
    const respupdate = yield call(updateFaculty, payload);
    yield put(updateFacultySuccess(respupdate[0]));
  } catch (error) {
    yield put(updateFacultyFail(error));
  }
}
function* mobAppFacultyAccsSaga() {
  yield takeEvery(UPDATE_FACULTY, onUpdateFaculty);
  yield takeEvery(GET_SETTING, fetchSetting);
  yield takeEvery(GET_MOB_APP_FACULTY_ACCS, fetchMobAppFacultyAccs);
  yield takeEvery(
    GET_MOB_APP_FACULTY_ACC_PROFILE,
    fetchMobAppFacultyAccProfile
  );
  yield takeEvery(ADD_NEW_MOB_APP_FACULTY_ACC, onAddNewMobAppFacultyAcc);
  yield takeEvery(UPDATE_MOB_APP_FACULTY_ACC, onUpdateMobAppFacultyAcc);
  yield takeEvery(DELETE_MOB_APP_FACULTY_ACC, onDeleteMobAppFacultyAcc);
}

export default mobAppFacultyAccsSaga;
