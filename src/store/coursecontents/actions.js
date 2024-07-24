import {
  GET_COURSE_CONTENTS,
  GET_COURSE_CONTENTS_FAIL,
  GET_COURSE_CONTENTS_SUCCESS,
  ADD_NEW_COURSE_CONTENT,
  ADD_COURSE_CONTENT_SUCCESS,
  ADD_COURSE_CONTENT_FAIL,
  UPDATE_COURSE_CONTENT,
  UPDATE_COURSE_CONTENT_SUCCESS,
  UPDATE_COURSE_CONTENT_FAIL,
  DELETE_COURSE_CONTENT,
  DELETE_COURSE_CONTENT_SUCCESS,
  DELETE_COURSE_CONTENT_FAIL,
  GET_DEFAULTVALUES,
  GET_DEFAULTVALUES_FAIL,
  GET_DEFAULTVALUES_SUCCESS,
  GET_COURSE_CONTENT_DELETED_VALUE,
  GET_COURSE_CONTENT_DELETED_VALUE_FAIL,
  GET_COURSE_CONTENT_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getCourseContents = () => ({
  type: GET_COURSE_CONTENTS,
});

export const getCourseContentsSuccess = covernorates => ({
  type: GET_COURSE_CONTENTS_SUCCESS,
  payload: covernorates,
});

export const getCourseContentsFail = error => ({
  type: GET_COURSE_CONTENTS_FAIL,
  payload: error,
});

export const addNewCourseContent = courseContent => ({
  type: ADD_NEW_COURSE_CONTENT,
  payload: courseContent,
});

export const addCourseContentSuccess = courseContent => ({
  type: ADD_COURSE_CONTENT_SUCCESS,
  payload: courseContent,
});

export const addCourseContentFail = error => ({
  type: ADD_COURSE_CONTENT_FAIL,
  payload: error,
});

export const updateCourseContent = courseContent => {
  return {
    type: UPDATE_COURSE_CONTENT,
    payload: courseContent,
  };
};

export const updateCourseContentSuccess = courseContent => ({
  type: UPDATE_COURSE_CONTENT_SUCCESS,
  payload: courseContent,
});

export const updateCourseContentFail = error => ({
  type: UPDATE_COURSE_CONTENT_FAIL,
  payload: error,
});

export const deleteCourseContent = courseContent => ({
  type: DELETE_COURSE_CONTENT,
  payload: courseContent,
});

export const deleteCourseContentSuccess = courseContent => ({
  type: DELETE_COURSE_CONTENT_SUCCESS,
  payload: courseContent,
});

export const deleteCourseContentFail = error => ({
  type: DELETE_COURSE_CONTENT_FAIL,
  payload: error,
});

export const getDefaultValues = () => ({
  type: GET_DEFAULTVALUES,
});

export const getDefaultValuseSuccess = defaultValue => ({
  type: GET_DEFAULTVALUES_SUCCESS,
  payload: defaultValue,
});

export const getDefaultValuesFail = error => ({
  type: GET_DEFAULTVALUES_FAIL,
  payload: error,
});

export const getCourseContentDeletedValue = () => ({
  type: GET_COURSE_CONTENT_DELETED_VALUE,
});

export const getCourseContentDeletedValueSuccess = deleted => ({
  type: GET_COURSE_CONTENT_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCourseContentDeletedValueFail = error => ({
  type: GET_COURSE_CONTENT_DELETED_VALUE_FAIL,
  payload: error,
});
