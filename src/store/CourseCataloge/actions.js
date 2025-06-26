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
} from "./actionTypes";

export const getCoursesCatalogs = () => ({
  type: GET_COURSES_CATALOGS,
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
