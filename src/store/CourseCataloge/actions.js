import {
  GET_COURSES_CATALOGS,
  GET_COURSES_CATALOGS_SUCCESS,
  GET_COURSES_CATALOGS_FAIL,
  ADD_NEW_COURSES_CATALOGS,
  ADD_COURSES_CATALOGS_SUCCESS,
  ADD_COURSES_CATALOGS_FAIL,
  UPDATE_COURSES_CATALOGS,
  UPDATE_COURSES_CATALOGS_SUCCESS,
  UPDATE_COURSES_CATALOGS_FAIL,
  DELETE_COURSES_CATALOGS,
  DELETE_COURSES_CATALOGS_SUCCESS,
  DELETE_COURSES_CATALOGS_FAIL,
  GET_COURSES_CATALOGS_DELETED_VALUE,
  GET_COURSES_CATALOGS_DELETED_VALUE_SUCCESS,
  GET_COURSES_CATALOGS_DELETED_VALUE_FAIL,
  GET_COURSES_CATALOGS_DATALIST,
  GET_COURSES_CATALOGS_DATALIST_SUCCESS,
  GET_COURSES_CATALOGS_DATALIST_FAIL,
  GET_COURSE_CATALOGE_PREREQUISITES,
  GET_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  GET_COURSE_CATALOGE_PREREQUISITES_FAIL,
  ADD_NEW_COURSE_CATALOGE_PREREQUISITES,
  ADD_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  ADD_COURSE_CATALOGE_PREREQUISITES_FAIL,
  UPDATE_COURSE_CATALOGE_PREREQUISITES,
  UPDATE_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  UPDATE_COURSE_CATALOGE_PREREQUISITES_FAIL,
  DELETE_COURSE_CATALOGE_PREREQUISITES,
  DELETE_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  DELETE_COURSE_CATALOGE_PREREQUISITES_FAIL,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_SUCCESS,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_FAIL,
} from "./actionTypes";

export const getCoursesCatalogs = (catalogs) => ({
  type: GET_COURSES_CATALOGS,
  payload:catalogs
});

export const getCoursesCatalogsSuccess = catalogs => ({
  type: GET_COURSES_CATALOGS_SUCCESS,
  payload: catalogs,
});

export const getCoursesCatalogsFail = error => ({
  type: GET_COURSES_CATALOGS_FAIL,
  payload: error,
});

export const addNewCoursesCatalog = catalog => ({
  type: ADD_NEW_COURSES_CATALOGS,
  payload: catalog,
});

export const addCoursesCatalogSuccess = catalog => ({
  type: ADD_COURSES_CATALOGS_SUCCESS,
  payload: catalog,
});

export const addCoursesCatalogFail = error => ({
  type: ADD_COURSES_CATALOGS_FAIL,
  payload: error,
});

export const updateCoursesCatalog = catalog => ({
  type: UPDATE_COURSES_CATALOGS,
  payload: catalog,
});

export const updateCoursesCatalogSuccess = catalog => ({
  type: UPDATE_COURSES_CATALOGS_SUCCESS,
  payload: catalog,
});

export const updateCoursesCatalogFail = error => ({
  type: UPDATE_COURSES_CATALOGS_FAIL,
  payload: error,
});

export const deleteCoursesCatalog = catalog => ({
  type: DELETE_COURSES_CATALOGS,
  payload: catalog,
});

export const deleteCoursesCatalogSuccess = catalog => ({
  type: DELETE_COURSES_CATALOGS_SUCCESS,
  payload: catalog,
});

export const deleteCoursesCatalogFail = error => ({
  type: DELETE_COURSES_CATALOGS_FAIL,
  payload: error,
});

export const getCoursesCatalogDeletedValue = () => ({
  type: GET_COURSES_CATALOGS_DELETED_VALUE,
});

export const getCoursesCatalogDeletedValueSuccess = deleted => ({
  type: GET_COURSES_CATALOGS_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCoursesCatalogDeletedValueFail = error => ({
  type: GET_COURSES_CATALOGS_DELETED_VALUE_FAIL,
  payload: error,
});
export const getCoursesCatalogsDatalist = () => ({
  type: GET_COURSES_CATALOGS_DATALIST,
});

export const getCoursesCatalogsDatalistSuccess = prereqcourses => ({
  type: GET_COURSES_CATALOGS_DATALIST_SUCCESS,
  payload: prereqcourses,
});

export const getCoursesCatalogsDatalistFail = error => ({
  type: GET_COURSES_CATALOGS_DATALIST_FAIL,
  payload: error,
});

export const getCourseCatalogePrerequisites = prerequisites => ({
  type: GET_COURSE_CATALOGE_PREREQUISITES,
  payload: prerequisites,
});

export const getCourseCatalogePrerequisitesSuccess = prerequisites => ({
  type: GET_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  payload: prerequisites,
});

export const getCourseCatalogePrerequisitesFail = error => ({
  type: GET_COURSE_CATALOGE_PREREQUISITES_FAIL,
  payload: error,
});

// ADD
export const addNewCourseCatalogePrerequisite = prerequisite => ({
  type: ADD_NEW_COURSE_CATALOGE_PREREQUISITES,
  payload: prerequisite,
});

export const addCourseCatalogePrerequisiteSuccess = prerequisite => ({
  type: ADD_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  payload: prerequisite,
});

export const addCourseCatalogePrerequisiteFail = error => ({
  type: ADD_COURSE_CATALOGE_PREREQUISITES_FAIL,
  payload: error,
});

// UPDATE
export const updateCourseCatalogePrerequisite = prerequisite => ({
  type: UPDATE_COURSE_CATALOGE_PREREQUISITES,
  payload: prerequisite,
});

export const updateCourseCatalogePrerequisiteSuccess = prerequisite => ({
  type: UPDATE_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  payload: prerequisite,
});

export const updateCourseCatalogePrerequisiteFail = error => ({
  type: UPDATE_COURSE_CATALOGE_PREREQUISITES_FAIL,
  payload: error,
});

// DELETE
export const deleteCourseCatalogePrerequisite = prerequisite => ({
  type: DELETE_COURSE_CATALOGE_PREREQUISITES,
  payload: prerequisite,
});

export const deleteCourseCatalogePrerequisiteSuccess = prerequisite => ({
  type: DELETE_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  payload: prerequisite,
});

export const deleteCourseCatalogePrerequisiteFail = error => ({
  type: DELETE_COURSE_CATALOGE_PREREQUISITES_FAIL,
  payload: error,
});

// GET DELETED VALUES
export const getCourseCatalogePrerequisitesDeletedValue = () => ({
  type: GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE,
});

export const getCourseCatalogePrerequisitesDeletedValueSuccess = deleted => ({
  type: GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCourseCatalogePrerequisitesDeletedValueFail = error => ({
  type: GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_FAIL,
  payload: error,
});
