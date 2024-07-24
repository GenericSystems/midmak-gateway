import {
  GET_COURSES,
  GET_COURSES_FAIL,
  GET_COURSES_SUCCESS,
  ADD_NEW_COURSE,
  ADD_COURSE_SUCCESS,
  ADD_COURSE_FAIL,
  UPDATE_COURSE,
  UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_FAIL,
  DELETE_COURSE,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAIL,
  GET_COURSE_REQUIRED_COURSES,
  GET_COURSE_REQUIRED_COURSES_FAIL,
  GET_COURSE_REQUIRED_COURSES_SUCCESS,
  ADD_NEW_COURSE_REQUIRED_COURSE,
  ADD_COURSE_REQUIRED_COURSE_SUCCESS,
  ADD_COURSE_REQUIRED_COURSE_FAIL,
  UPDATE_COURSE_REQUIRED_COURSE,
  UPDATE_COURSE_REQUIRED_COURSE_SUCCESS,
  UPDATE_COURSE_REQUIRED_COURSE_FAIL,
  DELETE_COURSE_REQUIRED_COURSE,
  DELETE_COURSE_REQUIRED_COURSE_SUCCESS,
  DELETE_COURSE_REQUIRED_COURSE_FAIL,
  GET_COURSES_OPT,
  GET_COURSES_OPT_FAIL,
  GET_COURSES_OPT_SUCCESS,
  GET_COURSE_DELETED_VALUE,
  GET_COURSE_DELETED_VALUE_FAIL,
  GET_COURSE_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getCourses = () => ({
  type: GET_COURSES,
});

export const getCoursesSuccess = courses => ({
  type: GET_COURSES_SUCCESS,
  payload: courses,
});

export const getCoursesFail = error => ({
  type: GET_COURSES_FAIL,
  payload: error,
});

export const addNewCourse = course => ({
  type: ADD_NEW_COURSE,
  payload: course,
});

export const addCourseSuccess = course => ({
  type: ADD_COURSE_SUCCESS,
  payload: course,
});

export const addCourseFail = error => ({
  type: ADD_COURSE_FAIL,
  payload: error,
});

export const updateCourse = course => {
  return {
    type: UPDATE_COURSE,
    payload: course,
  };
};

export const updateCourseSuccess = course => ({
  type: UPDATE_COURSE_SUCCESS,
  payload: course,
});

export const updateCourseFail = error => ({
  type: UPDATE_COURSE_FAIL,
  payload: error,
});

export const deleteCourse = course => ({
  type: DELETE_COURSE,
  payload: course,
});

export const deleteCourseSuccess = course => ({
  type: DELETE_COURSE_SUCCESS,
  payload: course,
});

export const deleteCourseFail = error => ({
  type: DELETE_COURSE_FAIL,
  payload: error,
});

export const getCourseRequiredCourses = course => ({
  type: GET_COURSE_REQUIRED_COURSES,
  payload: course,
});

export const getCourseRequiredCoursesSuccess = reqCourses => ({
  type: GET_COURSE_REQUIRED_COURSES_SUCCESS,
  payload: reqCourses,
});

export const getCourseRequiredCoursesFail = error => ({
  type: GET_COURSE_REQUIRED_COURSES_FAIL,
  payload: error,
});

export const addNewCourseRequiredCourse = reqCourse => ({
  type: ADD_NEW_COURSE_REQUIRED_COURSE,
  payload: reqCourse,
});

export const addCourseRequiredCourseSuccess = reqCourse => ({
  type: ADD_COURSE_REQUIRED_COURSE_SUCCESS,
  payload: reqCourse,
});

export const addCourseRequiredCourseFail = error => ({
  type: ADD_COURSE_REQUIRED_COURSE_FAIL,
  payload: error,
});

export const updateCourseRequiredCourse = reqCourse => {
  return {
    type: UPDATE_COURSE_REQUIRED_COURSE,
    payload: reqCourse,
  };
};

export const updateCourseRequiredCourseSuccess = reqCourse => ({
  type: UPDATE_COURSE_REQUIRED_COURSE_SUCCESS,
  payload: reqCourse,
});

export const updateCourseRequiredCourseFail = error => ({
  type: UPDATE_COURSE_REQUIRED_COURSE_FAIL,
  payload: error,
});

export const deleteCourseRequiredCourse = reqCourse => ({
  type: DELETE_COURSE_REQUIRED_COURSE,
  payload: reqCourse,
});

export const deleteCourseRequiredCourseSuccess = reqCourse => ({
  type: DELETE_COURSE_REQUIRED_COURSE_SUCCESS,
  payload: reqCourse,
});

export const deleteCourseRequiredCourseFail = error => ({
  type: DELETE_COURSE_REQUIRED_COURSE_FAIL,
  payload: error,
});

export const getCoursesOpt = () => ({
  type: GET_COURSES_OPT,
});

export const getCoursesOptSuccess = coursesOpt => ({
  type: GET_COURSES_OPT_SUCCESS,
  payload: coursesOpt,
});

export const getCoursesOptFail = error => ({
  type: GET_COURSES_OPT_FAIL,
  payload: error,
});

export const getCourseDeletedValue = () => ({
  type: GET_COURSE_DELETED_VALUE,
});

export const getCourseDeletedValueSuccess = deleted => ({
  type: GET_COURSE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCourseDeletedValueFail = error => ({
  type: GET_COURSE_DELETED_VALUE_FAIL,
  payload: error,
});
