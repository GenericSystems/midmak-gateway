import {
    GET_STUDENTS_REQUESTS,
    GET_STUDENTS_REQUESTS_FAIL,
    GET_STUDENTS_REQUESTS_SUCCESS,
    ADD_NEW_STUDENT_REQUEST,
    ADD_STUDENT_REQUEST_SUCCESS,
    ADD_STUDENT_REQUEST_FAIL,
    UPDATE_STUDENT_REQUEST,
    UPDATE_STUDENT_REQUEST_SUCCESS,
    UPDATE_STUDENT_REQUEST_FAIL,
    DELETE_STUDENT_REQUEST,
    DELETE_STUDENT_REQUEST_SUCCESS,
    DELETE_STUDENT_REQUEST_FAIL,
    GET_PREV_UNI_COURSES,
    GET_PREV_UNI_COURSES_SUCCESS,
    GET_PREV_UNI_COURSES_FAIL,
    ADD_NEW_PREV_UNI_COURSE,
    ADD_PREV_UNI_COURSE_SUCCESS,
    ADD_PREV_UNI_COURSE_FAIL,
    UPDATE_PREV_UNI_COURSE,
    UPDATE_PREV_UNI_COURSE_SUCCESS,
    UPDATE_PREV_UNI_COURSE_FAIL,
    DELETE_PREV_UNI_COURSE,
    DELETE_PREV_UNI_COURSE_SUCCESS,
    DELETE_PREV_UNI_COURSE_FAIL,
    GET_TRANSFER_COURSES,
    GET_TRANSFER_COURSES_SUCCESS,
    GET_TRANSFER_COURSES_FAIL,
    ADD_NEW_TRANSFER_COURSE,
    ADD_TRANSFER_COURSE_SUCCESS,
    ADD_TRANSFER_COURSE_FAIL,
    UPDATE_TRANSFER_COURSE,
    UPDATE_TRANSFER_COURSE_SUCCESS,
    UPDATE_TRANSFER_COURSE_FAIL,
    DELETE_TRANSFER_COURSE,
    DELETE_TRANSFER_COURSE_SUCCESS,
    DELETE_TRANSFER_COURSE_FAIL,
    UPDATE_TRANSFER_COURSE_STATE,
    UPDATE_TRANSFER_COURSE_STATE_SUCCESS,
    UPDATE_TRANSFER_COURSE_STATE_FAIL,
    GET_LAST_REQUEST_NUM,
    GET_LAST_REQUEST_NUM_FAIL,
    GET_LAST_REQUEST_NUM_SUCCESS,
    GET_REQUEST_DETAILS,
    GET_REQUEST_DETAILS_SUCCESS,
    GET_REQUEST_DETAILS_FAIL
  } from "./actionTypes";

  export const getStudentsRequests = faculty => ({
    type: GET_STUDENTS_REQUESTS,
    payload: faculty,
  });
  
  export const getStudentsRequestsSuccess = StudentsRequests => ({
    type: GET_STUDENTS_REQUESTS_SUCCESS,
    payload: StudentsRequests,
  });
  
  export const getStudentsRequestsFail = error => ({
    type: GET_STUDENTS_REQUESTS_FAIL,
    payload: error,
  });
  
  export const addNewStudentRequest = StudentRequest => ({
    type: ADD_NEW_STUDENT_REQUEST,
    payload: StudentRequest,
  });
  
  export const addStudentRequestSuccess = StudentRequest => ({
    type: ADD_STUDENT_REQUEST_SUCCESS,
    payload: StudentRequest,
  });
  
  export const addStudentRequestFail = error => ({
    type: ADD_STUDENT_REQUEST_FAIL,
    payload: error,
  });
  
  export const updateStudentRequest = StudentRequest => {
    return {
      type: UPDATE_STUDENT_REQUEST,
      payload: StudentRequest,
    };
  };
  
  export const updateStudentRequestSuccess = StudentRequest => ({
    type: UPDATE_STUDENT_REQUEST_SUCCESS,
    payload: StudentRequest,
  });
  
  export const updateStudentRequestFail = error => ({
    type: UPDATE_STUDENT_REQUEST_FAIL,
    payload: error,
  });
  
  export const deleteStudentRequest = StudentRequest => ({
    type: DELETE_STUDENT_REQUEST,
    payload: StudentRequest,
  });
  
  export const deleteStudentRequestSuccess = StudentRequest => ({
    type: DELETE_STUDENT_REQUEST_SUCCESS,
    payload: StudentRequest,
  });
  
  export const deleteStudentRequestFail = error => ({
    type: DELETE_STUDENT_REQUEST_FAIL,
    payload: error,
  });

  export const getPrevUnivCourses = faculty => ({
    type: GET_PREV_UNI_COURSES,
    payload: faculty,
  });
  
  export const getPrevUnivCoursesSuccess = PrevUnivCourses => ({
    type: GET_PREV_UNI_COURSES_SUCCESS,
    payload: PrevUnivCourses,
  });
  
  export const getPrevUnivCoursesFail = error => ({
    type: GET_PREV_UNI_COURSES_FAIL,
    payload: error,
  });
  
export const addNewPrevUnivCourse = course => ({
  type: ADD_NEW_PREV_UNI_COURSE,
  payload: course,
});

export const addPrevUnivCourseSuccess = course => ({
  type: ADD_PREV_UNI_COURSE_SUCCESS,
  payload: course,
});

export const addPrevUnivCourseFail = error => ({
  type: ADD_PREV_UNI_COURSE_FAIL,
  payload: error,
});

export const updatePrevUnivCourse = course => {
  return {
    type: UPDATE_PREV_UNI_COURSE,
    payload: course,
  };
};

export const updatePrevUnivCourseSuccess = course => ({
  type: UPDATE_PREV_UNI_COURSE_SUCCESS,
  payload: course,
});

export const updatePrevUnivCourseFail = error => ({
  type: UPDATE_PREV_UNI_COURSE_FAIL,
  payload: error,
});

export const deletePrevUnivCourse = course => ({
  type: DELETE_PREV_UNI_COURSE,
  payload: course,
});

export const deletePrevUnivCourseSuccess = course => ({
  type: DELETE_PREV_UNI_COURSE_SUCCESS,
  payload: course,
});

export const deletePrevUnivCourseFail = error => ({
  type: DELETE_PREV_UNI_COURSE_FAIL,
  payload: error,
});

export const getTransferCourses = faculty => ({
  type: GET_TRANSFER_COURSES,
  payload: faculty,
});

export const getTransferCoursesSuccess = TransferCourses => ({
  type: GET_TRANSFER_COURSES_SUCCESS,
  payload: TransferCourses,
});

export const getTransferCoursesFail = error => ({
  type: GET_TRANSFER_COURSES_FAIL,
  payload: error,
});

export const addNewTransferCourse = reqCourse => ({
  type: ADD_NEW_TRANSFER_COURSE,
  payload: reqCourse,
});

export const addTransferCourseSuccess = reqCourse => ({
  type: ADD_TRANSFER_COURSE_SUCCESS,
  payload: reqCourse,
});

export const addTransferCourseFail = error => ({
  type: ADD_TRANSFER_COURSE_FAIL,
  payload: error,
});

export const updateTransferCourse = reqCourse => {
  return {
    type: UPDATE_TRANSFER_COURSE,
    payload: reqCourse,
  };
};

export const updateTransferCourseSuccess = reqCourse => ({
  type: UPDATE_TRANSFER_COURSE_SUCCESS,
  payload: reqCourse,
});

export const updateTransferCourseFail = error => ({
  type: UPDATE_TRANSFER_COURSE_FAIL,
  payload: error,
});

export const deleteTransferCourse = reqCourse => ({
  type: DELETE_TRANSFER_COURSE,
  payload: reqCourse,
});

export const deleteTransferCourseSuccess = reqCourse => ({
  type: DELETE_TRANSFER_COURSE_SUCCESS,
  payload: reqCourse,
});

export const deleteTransferCourseFail = error => ({
  type: DELETE_TRANSFER_COURSE_FAIL,
  payload: error,
});

export const updateTransferCourseState = reqCourse => {
  return {
    type: UPDATE_TRANSFER_COURSE_STATE,
    payload: reqCourse,
  };
};

export const updateTransferCourseStateSuccess = reqCourse => ({
  type: UPDATE_TRANSFER_COURSE_STATE_SUCCESS,
  payload: reqCourse,
});

export const updateTransferCourseStateFail = error => ({
  type: UPDATE_TRANSFER_COURSE_STATE_FAIL,
  payload: error,
});

export const getLastReqNum = reqId => ({
  type: GET_LAST_REQUEST_NUM,
  payload: reqId,
});

export const getLastReqNumSuccess = LastReqNum => ({
  type: GET_LAST_REQUEST_NUM_SUCCESS,
  payload: LastReqNum,
});

export const getLastReqNumFail = error => ({
  type: GET_LAST_REQUEST_NUM_FAIL,
  payload: error,
});

export const getRequestDetails = () => ({
  type: GET_REQUEST_DETAILS,
});

export const getRequestDetailsSuccess = details => ({
  type: GET_REQUEST_DETAILS_SUCCESS,
  payload: details,
});

export const getRequestDetailsFail = error => ({
  type: GET_REQUEST_DETAILS_FAIL,
  payload: error,
});

