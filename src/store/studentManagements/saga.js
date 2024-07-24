import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_STUDENTMANAGEMENTS,
  GET_STUDENTMANAGEMENT_PROFILE,
  ADD_NEW_STUDENTMANAGEMENT,
  DELETE_STUDENTMANAGEMENT,
  UPDATE_STUDENTMANAGEMENT
} from "./actionTypes"
import{
  GET_SETTING,
} from "../mob-app-faculty-accs/actionTypes"
import {
  getStudentManagementsSuccess,
  getStudentManagementsFail,
  getStudentManagementProfileSuccess,
  getStudentManagementProfileFail,
  addStudentManagementFail,
  addStudentManagementSuccess,
  updateStudentManagementSuccess,
  updateStudentManagementFail,
  deleteStudentManagementSuccess,
  deleteStudentManagementFail,
} from "./actions"

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions"
//Include Both Helper File with needed methods
import {
  getStudentManagements,
  getStudentManagementProfile,
  addNewStudentManagement,
  updateStudentManagement,
  deleteStudentManagement,
  getFaculties,
} from "../../helpers/fakebackend_helper"


function* fetchStudentSetting(){
   //get faculty  // datalist has Id  and title
  const get_faculty= {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Faculty",
  };
  try {
    const response = yield call(getFaculties, get_faculty);
    
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }


}
function* fetchStudentManagements(obj) {
  let faculty = obj.payload;
  const get_studentmanagement_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_SisApp_ActiveStudents",
    filter: `facultyId = ${faculty}  `,

     } 
  try {
    const response = yield call(getStudentManagements, get_studentmanagement_req)
  
    yield put(getStudentManagementsSuccess(response))
  } catch (error) {
    yield put(getStudentManagementsFail(error))
  }
}

function* fetchStudentManagementProfile() {
  try {
    const response = yield call(getStudentManagementProfile)
    yield put(getStudentManagementProfileSuccess(response))
  } catch (error) {
    yield put(getStudentManagementProfileFail(error))
  }
}

function* onAddNewStudentManagement({ payload }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_addData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = '_SisApp_ActiveStudents';
  
  try {
    const response = yield call(addNewStudentManagement, payload)
    yield put(addStudentManagementSuccess(response[0]))
  } catch (error) {

    yield put(addStudentManagementFail(error))
  }
}

function* onUpdateStudentManagement({ payload }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_updateData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'SisApp_ActiveStudents';
  
  try {
    const response = yield call(updateStudentManagement, payload)
    yield put(updateStudentManagementSuccess(response[0]))
  } catch (error) {
    yield put(updateStudentManagementFail(error))
  }
}

function* onDeleteStudentManagement({ payload, }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = '_SisApp_ActiveStudents';
  
  try {
    const response = yield call(deleteStudentManagement, payload)
    yield put(deleteStudentManagementSuccess(response[0]))
  } catch (error) {
    yield put(deleteStudentManagementFail(error))
  }
}

function* StudentManagementSaga() {
  yield takeEvery(GET_STUDENTMANAGEMENTS, fetchStudentManagements)
  yield takeEvery(GET_STUDENTMANAGEMENT_PROFILE, fetchStudentManagementProfile)
  yield takeEvery(ADD_NEW_STUDENTMANAGEMENT, onAddNewStudentManagement)
  yield takeEvery(UPDATE_STUDENTMANAGEMENT, onUpdateStudentManagement)
  yield takeEvery(DELETE_STUDENTMANAGEMENT, onDeleteStudentManagement)
  yield takeEvery(GET_SETTING, fetchStudentSetting);
}

export default StudentManagementSaga
