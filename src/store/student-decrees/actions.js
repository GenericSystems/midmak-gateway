import {
  GET_STUDENTS_DECREES,
  GET_STUDENTS_DECREES_SUCCESS,
  GET_STUDENTS_DECREES_FAIL,
  ADD_NEW_STUDENTS_DECREES,
  ADD_STUDENTS_DECREES_SUCCESS,
  ADD_STUDENTS_DECREES_FAIL,
  UPDATE_STUDENTS_DECREES,
  UPDATE_STUDENTS_DECREES_SUCCESS,
  UPDATE_STUDENTS_DECREES_FAIL,
  DELETE_STUDENTS_DECREES,
  DELETE_STUDENTS_DECREES_SUCCESS,
  DELETE_STUDENTS_DECREES_FAIL,
  GET_STUDENTS_DECREES_DELETED_VALUE,
  GET_STUDENTS_DECREES_DELETED_VALUE_FAIL,
  GET_STUDENTS_DECREES_DELETED_VALUE_SUCCESS,
  GET_FILTERED_COURSES_PLANS,
  GET_FILTERED_COURSES_PLANS_SUCCESS,
GET_FILTERED_COURSES_PLANS_FAIL,
GET_UNIVERSITY_STUDENTS_DECREE,
GET_UNIVERSITY_STUDENTS_DECREE_SUCCESS,
GET_UNIVERSITY_STUDENTS_DECREE_FAIL,
GET_COURSES_DECREES,
GET_COURSES_DECREES_FAIL,
GET_COURSES_DECREES_SUCCESS,
GET_DECREE_STATUS,
GET_DECREE_STATUS_SUCCESS,
GET_DECREE_STATUS_FAIL,
GET_STUDENT_DECREES_DISMISS,
GET_STUDENT_DECREES_DISMISS_SUCCESS,
GET_STUDENT_DECREES_DISMISS_FAIL,
} from "./actionTypes";

export const getStudentsDecrees = () => ({
  type: GET_STUDENTS_DECREES,
});

export const getStudentsDecreesSuccess = studentsDecrees => ({
  type: GET_STUDENTS_DECREES_SUCCESS,
  payload: studentsDecrees,
});

export const getStudentsDecreesFail = error => ({
  type: GET_STUDENTS_DECREES_FAIL,
  payload: error,
});

export const addNewStudentsDecree = studentsDecree => ({
  type: ADD_NEW_STUDENTS_DECREES,
  payload: studentsDecree,
});

export const addStudentsDecreeSuccess = studentsDecree => ({
  type: ADD_STUDENTS_DECREES_SUCCESS,
  payload: studentsDecree,
});

export const addStudentsDecreeFail = error => ({
  type: ADD_STUDENTS_DECREES_FAIL,
  payload: error,
});
export const updateStudentsDecree = studentsDecree => {
  return {
    type: UPDATE_STUDENTS_DECREES,
    payload: studentsDecree,
  };
};

export const updateStudentsDecreeSuccess = studentsDecree => ({
  type: UPDATE_STUDENTS_DECREES_SUCCESS,
  payload: studentsDecree,
});

export const updateStudentsDecreeFail = error => ({
  type: UPDATE_STUDENTS_DECREES_FAIL,
  payload: error,
});
export const deleteStudentsDecree = studentsDecree => ({
  type: DELETE_STUDENTS_DECREES,
  payload: studentsDecree,
});
export const deleteStudentsDecreeSuccess = studentsDecree => ({
  type: DELETE_STUDENTS_DECREES_SUCCESS,
  payload: studentsDecree,
});
export const deleteStudentsDecreeFail = error => ({
  type: DELETE_STUDENTS_DECREES_FAIL,
  payload: error,
});

export const getStudentsDecreeDeletedValue = () => ({
  type: GET_STUDENTS_DECREES_DELETED_VALUE,
});

export const getStudentsDecreeDeletedValueSuccess = deleted => ({
  type: GET_STUDENTS_DECREES_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getStudentsDecreeDeletedValueFail = error => ({
  type: GET_STUDENTS_DECREES_DELETED_VALUE_FAIL,
  payload: error,
});

export const getFilteredCoursesPlans = plan => ({
  type: GET_FILTERED_COURSES_PLANS,
  payload:plan
});

export const getFilteredCoursesPlansSuccess = coursesPlan => ({
  type: GET_FILTERED_COURSES_PLANS_SUCCESS,
  payload: coursesPlan,
});

export const getFilteredCoursesPlansFail = error => ({
  type: GET_FILTERED_COURSES_PLANS_FAIL,
  payload: error,
});

export const getUniversityStudentsDecrees = () => ({
  type: GET_UNIVERSITY_STUDENTS_DECREE,
});

export const getUniversityStudentsDecreesSuccess = students => ({
  type: GET_UNIVERSITY_STUDENTS_DECREE_SUCCESS,
  payload: students,
});

export const getUniversityStudentsDecreesFail = error => ({
  type: GET_UNIVERSITY_STUDENTS_DECREE_FAIL,
  payload: error,
});



export const getCoursesDecrees = plan => ({
  type: GET_COURSES_DECREES,
  payload:plan
});

export const getCoursesDecreesSuccess = coursesPlan => ({
  type: GET_COURSES_DECREES_SUCCESS,
  payload: coursesPlan,
});

export const getCoursesDecreesFail = error => ({
  type: GET_COURSES_DECREES_FAIL,
  payload: error,
});

export const getDecreeStatus = () => ({
  type: GET_DECREE_STATUS,
});

export const getDecreeStatusSuccess = studentsDecrees => ({
  type: GET_DECREE_STATUS_SUCCESS,
  payload: studentsDecrees,
});

export const getDecreeStatusFail = error => ({
  type: GET_DECREE_STATUS_FAIL,
  payload: error,
});

export const getStudentDecreesDismiss = studentDecreesDismiss => ({
  type: GET_STUDENT_DECREES_DISMISS,
  payload: studentDecreesDismiss,

});

export const getStudentDecreesDismissSuccess = studentDecreesDismiss => ({
  type: GET_STUDENT_DECREES_DISMISS_SUCCESS,
  payload: studentDecreesDismiss,
});

export const getStudentDecreesDismissFail = error => ({
  type: GET_STUDENT_DECREES_DISMISS_FAIL,
  payload: error,
});