import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXAM_ROOMS,
  GET_EXAM_ROOM_PROFILE,
  ADD_NEW_EXAM_ROOM,
  DELETE_EXAM_ROOM,
  UPDATE_EXAM_ROOM,
  GET_SETTING_EXAM_ROOM,
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
import {
  getDefineExamDatesSuccess,
  getDefineExamDatesFail,
} from "../DefineExamDates/actions";
import { GET_DEFINE_EXAM_DATES } from "../DefineExamDates/actionTypes";
import {
  getHallsSuccess,
  getHallsFail,
} from "../../academyBuildingStructure/actions";
import { GET_HALLS } from "../../academyBuildingStructure/actionTypes";

// Include Both Helper File with needed methods
import {
  getExamRooms,
  getExamRoomProfile,
  addNewExamRoom,
  updateExamRoom,
  deleteExamRoom,
  getDefineExamDates,
  getStudentManagements,
  getHalls,
  getLevels,
} from "../../../helpers/fakebackend_helper";

function* fetchDefineExamDate() {
  //get faculty
  const get_defineExamDate_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DefineExamDates",
  };
  try {
    const response = yield call(getDefineExamDates, get_defineExamDate_req);
    console.log("wwwwwwwwwwwww", response);
    yield put(getDefineExamDatesSuccess(response));
  } catch (error) {
    yield put(getDefineExamDatesFail(error));
  }
}

function* fetchExamRooms(obj) {
  let defineExamDate = obj.payload;

  const get_ExamRooms_req = {
    source: "db",
    procedure: "getExamHalls",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DefineExamDates",
    examDateId: defineExamDate,
    // filter: ` examDateId = ${defineExamDate}`,
  };
  try {
    const response = yield call(getExamRooms, get_ExamRooms_req);
    console.log("33333333333333", response);
    yield put(getExamRoomsSuccess(response));
  } catch (error) {
    yield put(getExamRoomsFail(error));
  }
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
  payload["tablename"] = "Common_ExamHalls";
  payload["queryname"] = "_Common_ExamHalls";

  try {
    const response = yield call(addNewExamRoom, payload);
    yield put(addExamRoomSuccess(response[0]));
  } catch (error) {
    yield put(addExamRoomFail(error));
  }
}

function* onUpdateExamRoom({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamHalls";
  payload["queryname"] = "_Common_ExamHalls";

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
  yield takeEvery(GET_SETTING_EXAM_ROOM, fetchDefineExamDate);
  yield takeEvery(GET_EXAM_ROOMS, fetchExamRooms);
  yield takeEvery(GET_EXAM_ROOM_PROFILE, fetchExamRoomProfile);
  yield takeEvery(ADD_NEW_EXAM_ROOM, onAddNewExamRoom);
  yield takeEvery(UPDATE_EXAM_ROOM, onUpdateExamRoom);
  yield takeEvery(DELETE_EXAM_ROOM, onDeleteExamRoom);
}

export default ExamRoomsSaga;
