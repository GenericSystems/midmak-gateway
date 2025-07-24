import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXAM_ROOMS,
  GET_EXAM_ROOM_PROFILE,
  ADD_NEW_EXAM_ROOM,
  DELETE_EXAM_ROOM,
  UPDATE_EXAM_ROOM,
} from "./actionTypes";

import {
  getExamRoomsSuccess,
  getExamRoomsFail,
  getExamRoomProfileSuccess,
  getExamRoomProfileFail,
  addExamRoomFail,
  addExamRoomSuccess,
  updateExamRoomSuccess,
  updateExamRoomFail,
  deleteExamRoomSuccess,
  deleteExamRoomFail,
} from "./actions";

// import {
//   getStudentManagementsSuccess,
//   getStudentManagementsFail,
// } from "../studentManagements/actions";
// import { getLevelsSuccess, getLevelsFail } from "../levels/actions";

// Include Both Helper File with needed methods
import {
  getExamRooms,
  getExamRoomProfile,
  addNewExamRoom,
  updateExamRoom,
  deleteExamRoom,
  getStudentManagements,
  getLevels,
} from "../../../helpers/fakebackend_helper";

// function* fetchSetting() {
//   //get faculty
//   const get_faculty_opt = {
//     source: "db",
//     procedure: "SisApp_getData",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "_Common_Faculty",
//   };
//   try {
//     const response = yield call(getFaculties, get_faculty_opt);
//     yield put(getFacultiesSuccess(response));
//   } catch (error) {
//     yield put(getFacultiesFail(error));
//   }

//   //get course level
//   const get_Level = {
//     source: "db",
//     procedure: "Generic_getOptions",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "settings_Levels",
//     fields: "Id,arTitle",
//   };
//   try {
//     const response = yield call(getLevels, get_Level);

//     yield put(getLevelsSuccess(response));
//   } catch (error) {
//     yield put(getLevelsFail(error));
//   }
// }

function* fetchExamRooms(obj) {
  let faculty = obj.payload;

  const get_ExamRooms_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "mobApp_FacultiesAccessConfig",
    filter: `facultyId = ${faculty}  `,
  };
  try {
    const response = yield call(getExamRooms, get_ExamRooms_req);
    yield put(getExamRoomsSuccess(response));
  } catch (error) {
    yield put(getExamRoomsFail(error));
  }

  const get_defineExamDate_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Contract",
  };
  try {
    const response = yield call(getDefineExamDates, get_defineExamDate_req);
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", response);
    yield put(getDefineExamDatesSuccess(response));
  } catch (error) {
    yield put(getDefineExamDatesFail(error));
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

function* fetchExamRoomProfile() {
  try {
    const response = yield call(getExamRoomProfile);
    yield put(getExamRoomProfileSuccess(response));
  } catch (error) {
    yield put(getExamRoomProfileFail(error));
  }
}

function* onAddNewExamRoom({ payload, ExamRoom }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "mobApp_FacultiesAccessConfig";

  try {
    const response = yield call(addNewExamRoom, payload);
    yield put(addExamRoomSuccess(response[0]));
  } catch (error) {
    yield put(addExamRoomFail(error));
  }
}

function* onUpdateExamRoom({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "updateActiveStudentsAccordingFacultyAccess";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] = "mobApp_FacultiesAccessConfig";

  try {
    const respupdate = yield call(updateExamRoom, payload);
    yield put(updateExamRoomSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateExamRoomFail(error));
  }
}

function* onDeleteExamRoom({ payload, ExamRoom }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "mobApp_FacultiesAccessConfig";

  try {
    const respdelete = yield call(deleteExamRoom, payload);
    yield put(deleteExamRoomSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteExamRoomFail(error));
  }
}

function* ExamRoomsSaga() {
  // yield takeEvery(GET_SETTING, fetchSetting);
  yield takeEvery(GET_EXAM_ROOMS, fetchExamRooms);
  yield takeEvery(GET_EXAM_ROOM_PROFILE, fetchExamRoomProfile);
  yield takeEvery(ADD_NEW_EXAM_ROOM, onAddNewExamRoom);
  yield takeEvery(UPDATE_EXAM_ROOM, onUpdateExamRoom);
  yield takeEvery(DELETE_EXAM_ROOM, onDeleteExamRoom);
}

export default ExamRoomsSaga;
