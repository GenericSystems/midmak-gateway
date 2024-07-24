import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_STUDENTS_REQUESTS,
  ADD_NEW_STUDENT_REQUEST,
  DELETE_STUDENT_REQUEST,
  UPDATE_STUDENT_REQUEST,
  GET_PREV_UNI_COURSES,
  ADD_NEW_PREV_UNI_COURSE,
  DELETE_PREV_UNI_COURSE,
  UPDATE_PREV_UNI_COURSE,
  GET_TRANSFER_COURSES,
  ADD_NEW_TRANSFER_COURSE,
  DELETE_TRANSFER_COURSE,
  UPDATE_TRANSFER_COURSE,
  UPDATE_TRANSFER_COURSE_STATE,
  GET_LAST_REQUEST_NUM,
  GET_REQUEST_DETAILS
} from "./actionTypes"
import {
  getStudentsRequestsSuccess,
  getStudentsRequestsFail,
  addStudentRequestFail,
  addStudentRequestSuccess,
  updateStudentRequestSuccess,
  updateStudentRequestFail,
  deleteStudentRequestSuccess,
  deleteStudentRequestFail,
  getPrevUnivCoursesSuccess,
  getPrevUnivCoursesFail,
  addPrevUnivCourseFail,
  addPrevUnivCourseSuccess,
  updatePrevUnivCourseSuccess,
  updatePrevUnivCourseFail,
  deletePrevUnivCourseSuccess,
  deletePrevUnivCourseFail,
  getTransferCoursesSuccess,
  getTransferCoursesFail,
  addTransferCourseFail,
  addTransferCourseSuccess,
  updateTransferCourseSuccess,
  updateTransferCourseFail,
  updateTransferCourseStateSuccess,
  updateTransferCourseStateFail,
  deleteTransferCourseSuccess,
  deleteTransferCourseFail,
  getLastReqNumSuccess,
  getLastReqNumFail,
  getRequestDetailsSuccess,
  getRequestDetailsFail
} from "./actions"

import {
  getRequestsSuccess,
  getRequestsFail,
} from "../requests/actions"

import {
  getDecreeStatusSuccess,
  getDecreeStatusFail,
} from "../student-decrees/actions"


import {
  getCoursesOptSuccess,
  getCoursesOptFail,
} from "../courses/actions"

import { getAcademicCertificatesSuccess, getAcademicCertificatesFail } from "../academicvertificates/actions";


import {
  getStudentsRequests,
  addNewStudentRequest,
  updateStudentRequest,
  deleteStudentRequest,
  getRequests,
  getDecreeStatus,
  getPrevUnivCourses,
  addNewPrevUnivCourse,
  updatePrevUnivCourse,
  deletePrevUnivCourse,
  getTransferCourses,
  addNewTransferCourse,
  updateTransferCourse,
  deleteTransferCourse,
  updateTransferCourseState,
  getCoursesOpt,
  getLastReqNum,
  getAcademicCertificates,
  getRequestDetails
} from "../../helpers/fakebackend_helper"


function* fetchRequestDetails() {
    //get requests
    const get_requests_opt = {
      source: "db",
      procedure: "Generic_Optiondatalist",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "financeSetting_requests",
      fields: "Id,arTitle"
    };
    try {
      const response = yield call(getRequests, get_requests_opt);
      yield put(getRequestsSuccess(response));
    } catch (error) {
      yield put(getRequestsFail(error));
    }
  
    // get status
    const get_decreeStatus_req = {
      source: "db",
      procedure: "SisApp_getData",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "settings_DecreeStatus",
    };
    try {
      const response = yield call(getDecreeStatus, get_decreeStatus_req);
      yield put(getDecreeStatusSuccess(response));
    } catch (error) {
      yield put(getDecreeStatusFail(error));
    }
  
      //get rquired course options
      const get_preReqCourse_opt = {
        source: "db",
        procedure: "SisApp_getData",
        apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
        tablename: "Common_Course",
        fields: "code,arCourseName,Id,nbHours",
      };
      try {
        const response = yield call(getCoursesOpt, get_preReqCourse_opt);
        yield put(getCoursesOptSuccess(response));
      } catch (error) {
        yield put(getCoursesOptFail(error));
      }
    

          //get academicCertif
    const get_academicCertif_opt = {
      source: "db",
      procedure: "Generic_getOptions",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "settings_AcadmicCertificates",
      fields: "Id,arTitle,facultyId",
    };
    try {
      const response = yield call(getAcademicCertificates, get_academicCertif_opt);
      yield put(getAcademicCertificatesSuccess(response));
    } catch (error) {
      yield put(getAcademicCertificatesFail(error));
    }
  
}

function* fetchStudentsRequests(obj) {
  let payload = obj.payload;

  let filter = `yearSemesterId = ${payload.yearSemesterId}`;

  if (payload.requestId !== undefined) {
    filter += ` and requestId = ${payload.requestId}`;
  }
  if (payload.stateId !== undefined) {
    filter += ` and stateId = ${payload.stateId}`;
  }

  const get_studentmanagement_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_StudentsRequests",
    filter: filter,

     }  
  try {
    const response = yield call(getStudentsRequests, get_studentmanagement_req)
    response.map(resp => {
      resp["studentRequests"] = JSON.parse(resp["studentRequests"]);
    });
    response.map(resp => {
      resp["prevUnivCourses"] = JSON.parse(resp["prevUnivCourses"]);
    });
    response.map(resp => {
      resp["transferCourses"] = JSON.parse(resp["transferCourses"]);
    });

    yield put(getStudentsRequestsSuccess(response))
  } catch (error) {
    yield put(getStudentsRequestsFail(error))
  }

  
 
}





function* onAddNewStudentRequest({ payload }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_addData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Common_StudentsRequests';
  payload["queryname"] = '_Common_StudentsRequests';
  
  try {
    const response = yield call(addNewStudentRequest, payload)
    response.map(resp => {
      resp["studentRequests"] = JSON.parse(resp["studentRequests"]);
    });
    yield put(addStudentRequestSuccess(response[0]))
  } catch (error) {

    yield put(addStudentRequestFail(error))
  }
}

function* onUpdateStudentRequest({ payload }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_updateData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Common_StudentsRequests';
  payload["queryname"] = '_Common_StudentsRequests';
  
  try {
    const response = yield call(updateStudentRequest, payload)
    response.map(resp => {
      resp["studentRequests"] = JSON.parse(resp["studentRequests"]);
    });
    response.map(resp => {
      resp["prevUnivCourses"] = JSON.parse(resp["prevUnivCourses"]);
    });
    response.map(resp => {
      resp["transferCourses"] = JSON.parse(resp["transferCourses"]);
    });
    yield put(updateStudentRequestSuccess(response[0]))
  } catch (error) {
    yield put(updateStudentRequestFail(error))
  }
}

function* onDeleteStudentRequest({ payload, }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Common_StudentsRequests';
  
  try {
    const response = yield call(deleteStudentRequest, payload)
    yield put(deleteStudentRequestSuccess(response[0]))
  } catch (error) {
    yield put(deleteStudentRequestFail(error))
  }
}

function* onAddNewPrevUnivCourse({ payload, course }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdPrevUnivCourses";

  

  try {
    const response = yield call(addNewPrevUnivCourse, payload);
    yield put(addPrevUnivCourseSuccess(response[0]));
  } catch (error) {
    yield put(addPrevUnivCourseFail(error));
  }
}

function* onUpdatePrevUnivCourse({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdPrevUnivCourses";

  

  try {
    const respupdate = yield call(updatePrevUnivCourse, payload);
    yield put(updatePrevUnivCourseSuccess(respupdate[0]));
  } catch (error) {
    yield put(updatePrevUnivCourseFail(error));
  }
}

function* onDeletePrevUnivCourse({ payload, course }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdPrevUnivCourses";

  try {
    const respdelete = yield call(deletePrevUnivCourse, payload);
    yield put(deletePrevUnivCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deletePrevUnivCourseFail(error));
  }
}


function* onAddNewTransferCourse({ payload, reqCourse }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";

  try {
    const response = yield call(addNewTransferCourse, payload);
    yield put(addTransferCourseSuccess(response[0]));
  } catch (error) {
    yield put(addTransferCourseFail(error));
  }
}

function* onUpdateTransferCourse({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";
  try {
    const respupdate = yield call(updateTransferCourse, payload);
    yield put(updateTransferCourseSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTransferCourseFail(error));
  }
}

function* onUpdateTransferCourseState({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "StdTransferedCourses_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";
  payload["studentRequestId"] = `${payload.studentRequestId}`;
  payload["stateId"] = `${payload.stateId}`;
  try {
    const respupdate = yield call(updateTransferCourseState, payload);
    yield put(updateTransferCourseStateSuccess(respupdate));
  } catch (error) {
    yield put(updateTransferCourseStateFail(error));
  }
}


function* onDeleteTransferCourse({ payload, reqCourse }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";

  try {
    const respdelete = yield call(deleteTransferCourse, payload);
    yield put(deleteTransferCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTransferCourseFail(error));
  }
}

function* fetchCoursesInfo(obj) {
  let payload = obj.payload;

  // transfer courses
  const get_TransferedCourses = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StdTransferedCourses",
     filter : `studentRequestId = ${payload.studentRequestId} `

     }  
  try {
    const response = yield call(getTransferCourses, get_TransferedCourses)
    yield put(getTransferCoursesSuccess(response))
  } catch (error) {
    yield put(getTransferCoursesFail(error))
  }

  // PREV courses
  const get_PrevUnivCourses = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StdPrevUnivCourses",
     filter : `studentRequestId = ${payload.studentRequestId} `

     }  
  try {
    const response = yield call(getPrevUnivCourses, get_PrevUnivCourses)
    yield put(getPrevUnivCoursesSuccess(response))
  } catch (error) {
    yield put(getPrevUnivCoursesFail(error))
  }
}

function* fetchLastRequestNum(obj) {
  let payload = obj.payload;

  const get_lastReqNum = {
    source: 'db',
    procedure: "add_lastRequest",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    requestId: `${payload.requestId}`,


     }  
  try {
    const response = yield call(getLastReqNum, get_lastReqNum)
    
    yield put(getLastReqNumSuccess(response[0]))
  } catch (error) {
    yield put(getLastReqNumFail(error))
  }}


function* StudentRequestSaga() {
  yield takeEvery(GET_STUDENTS_REQUESTS, fetchStudentsRequests)
  yield takeEvery(ADD_NEW_STUDENT_REQUEST, onAddNewStudentRequest)
  yield takeEvery(UPDATE_STUDENT_REQUEST, onUpdateStudentRequest)
  yield takeEvery(DELETE_STUDENT_REQUEST, onDeleteStudentRequest)
  yield takeEvery(ADD_NEW_PREV_UNI_COURSE, onAddNewPrevUnivCourse);
  yield takeEvery(UPDATE_PREV_UNI_COURSE, onUpdatePrevUnivCourse);
  yield takeEvery(DELETE_PREV_UNI_COURSE, onDeletePrevUnivCourse);
  yield takeEvery(ADD_NEW_TRANSFER_COURSE, onAddNewTransferCourse);
  yield takeEvery(UPDATE_TRANSFER_COURSE, onUpdateTransferCourse);
  yield takeEvery(UPDATE_TRANSFER_COURSE_STATE, onUpdateTransferCourseState);
  yield takeEvery(DELETE_TRANSFER_COURSE, onDeleteTransferCourse);
  yield takeEvery(GET_TRANSFER_COURSES, fetchCoursesInfo);
  yield takeEvery(GET_LAST_REQUEST_NUM, fetchLastRequestNum);
  yield takeEvery(GET_REQUEST_DETAILS, fetchRequestDetails);

}

export default StudentRequestSaga
