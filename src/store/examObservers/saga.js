import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXAM_OBSERVERS,
  GET_EXAM_OBSERVER_PROFILE,
  ADD_NEW_EXAM_OBSERVER,
  DELETE_EXAM_OBSERVER,
  UPDATE_EXAM_OBSERVER,
} from "./actionTypes";

import {
  getExamObserversSuccess,
  getExamObserversFail,
  getExamObserverProfileSuccess,
  getExamObserverProfileFail,
  addExamObserverFail,
  addExamObserverSuccess,
  updateExamObserverSuccess,
  updateExamObserverFail,
  deleteExamObserverSuccess,
  deleteExamObserverFail,
} from "./actions";

// import {
//   getStudentManagementsSuccess,
//   getStudentManagementsFail,
// } from "../studentManagements/actions";
// import { getLevelsSuccess, getLevelsFail } from "../levels/actions";
import {
  getDefineExamDatesSuccess,
  getDefineExamDatesFail,
} from "store/Exam/DefineExamDates/actions";
import { GET_DEFINE_EXAM_DATES } from "store/Exam/DefineExamDates/actionTypes";
import {
  getHallsSuccess,
  getHallsFail,
} from "../academyBuildingStructure/actions";
import { GET_HALLS } from "../academyBuildingStructure/actionTypes";

// Include Both Helper File with needed methods
import {
  getExamObservers,
  getExamObserverProfile,
  addNewExamObserver,
  updateExamObserver,
  deleteExamObserver,
  getDefineExamDates,
  getStudentManagements,
  getHalls,
  getLevels,
} from "../../helpers/fakebackend_helper";

function* fetchDefineExamDate() {
  //get faculty
  const get_defineExamDate_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_DefineExamDates",
  };
  try {
    const response = yield call(getDefineExamDates, get_defineExamDate_req);
    console.log("wwwwwwwwwwwww", response);
    yield put(getDefineExamDatesSuccess(response));
  } catch (error) {
    yield put(getDefineExamDatesFail(error));
  }

  //get course level
  // const get_Level = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Common_Floor",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getDefineExamDates, get_Level);

  //   yield put(getDefineExamDatesSuccess(response));
  // } catch (error) {
  //   yield put(getDefineExamDatesFail(error));
  // }
}

function* fetchExamObservers(obj) {
  let defineExamDate = obj.payload;

  const get_ExamObservers_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmeyBuildingStructure",
    Fields: "Id,buildingArName,hallArName,hallNum",
    // filter: ` defineExamDateId = ${defineExamDate}`,
  };
  try {
    const response = yield call(getExamObservers, get_ExamObservers_req);
    response.map(resp => {
      resp["floors"] = JSON.parse(resp["floors"]);
    });
    console.log("33333333333333", response);
    yield put(getExamObserversSuccess(response));
  } catch (error) {
    yield put(getExamObserversFail(error));
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

function* fetchExamObserverProfile() {
  try {
    const response = yield call(getExamObserverProfile);
    yield put(getExamObserverProfileSuccess(response));
  } catch (error) {
    yield put(getExamObserverProfileFail(error));
  }
}

function* onAddNewExamObserver({ payload, ExamObserver }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "mobApp_FacultiesAccessConfig";

  try {
    const response = yield call(addNewExamObserver, payload);
    yield put(addExamObserverSuccess(response[0]));
  } catch (error) {
    yield put(addExamObserverFail(error));
  }
}

function* onUpdateExamObserver({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "updateActiveStudentsAccordingFacultyAccess";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] = "mobApp_FacultiesAccessConfig";

  try {
    const respupdate = yield call(updateExamObserver, payload);
    yield put(updateExamObserverSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateExamObserverFail(error));
  }
}

function* onDeleteExamObserver({ payload, ExamObserver }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "mobApp_FacultiesAccessConfig";

  try {
    const respdelete = yield call(deleteExamObserver, payload);
    yield put(deleteExamObserverSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteExamObserverFail(error));
  }
}

function* ExamObserversSaga() {
  yield takeEvery(GET_HALLS, fetchDefineExamDate);
  yield takeEvery(GET_EXAM_OBSERVERS, fetchExamObservers);
  yield takeEvery(GET_EXAM_OBSERVER_PROFILE, fetchExamObserverProfile);
  yield takeEvery(ADD_NEW_EXAM_OBSERVER, onAddNewExamObserver);
  yield takeEvery(UPDATE_EXAM_OBSERVER, onUpdateExamObserver);
  yield takeEvery(DELETE_EXAM_OBSERVER, onDeleteExamObserver);
}

export default ExamObserversSaga;
