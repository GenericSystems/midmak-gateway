import {
  GET_ACADEMY_ORG_STRUCTURES,
  GET_ACADEMY_ORG_STRUCTURE_SUCCESS,
  GET_ACADEMY_ORG_STRUCTURE_FAIL,
  ADD_NEW_ACADEMY_ORG_STRUCTURE,
  ADD_ACADEMY_ORG_STRUCTURE_SUCCESS,
  ADD_ACADEMY_ORG_STRUCTURE_FAIL,
  DELETE_ACADEMY_ORG_STRUCTURE,
  DELETE_ACADEMY_ORG_STRUCTURE_SUCCESS,
  DELETE_ACADEMY_ORG_STRUCTURE_FAIL,
  UPDATE_ACADEMY_ORG_STRUCTURE,
  UPDATE_ACADEMY_ORG_STRUCTURE_SUCCESS,
  UPDATE_ACADEMY_ORG_STRUCTURE_FAIL,
  GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE,
  GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS,
  GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_FAIL,
} from "./actionTypes";

/* GET */
export const getAcademyOrgStructure = academyOrgStructures => ({
  type: GET_ACADEMY_ORG_STRUCTURES,
  payload: academyOrgStructures,
});

export const getAcademyOrgStructureSuccess = academyOrgStructures => ({
  type: GET_ACADEMY_ORG_STRUCTURE_SUCCESS,
  payload: academyOrgStructures,
});

export const getAcademyOrgStructureFail = error => ({
  type: GET_ACADEMY_ORG_STRUCTURE_FAIL,
  payload: error,
});

/* ADD */
export const addNewAcademyOrgStructure = academyOrgStructure => ({
  type: ADD_NEW_ACADEMY_ORG_STRUCTURE,
  payload: academyOrgStructure,
});

export const addNewAcademyOrgStructureSuccess = academyOrgStructure => ({
  type: ADD_ACADEMY_ORG_STRUCTURE_SUCCESS,
  payload: academyOrgStructure,
});

export const addNewAcademyOrgStructureFail = error => ({
  type: ADD_ACADEMY_ORG_STRUCTURE_FAIL,
  payload: error,
});

/* UPDATE */
export const updateAcademyOrgStructure = academyOrgStructure => ({
  type: UPDATE_ACADEMY_ORG_STRUCTURE,
  payload: academyOrgStructure,
});

export const updateAcademyOrgStructureSuccess = academyOrgStructure => ({
  type: UPDATE_ACADEMY_ORG_STRUCTURE_SUCCESS,
  payload: academyOrgStructure,
});

export const updateAcademyOrgStructureFail = error => ({
  type: UPDATE_ACADEMY_ORG_STRUCTURE_FAIL,
  payload: error,
});

/* DELETE */
export const deleteAcademyOrgStructure = academyOrgStructure => ({
  type: DELETE_ACADEMY_ORG_STRUCTURE,
  payload: academyOrgStructure,
});

export const deleteAcademyOrgStructureSuccess = academyOrgStructure => ({
  type: DELETE_ACADEMY_ORG_STRUCTURE_SUCCESS,
  payload: academyOrgStructure,
});

export const deleteAcademyOrgStructureFail = error => ({
  type: DELETE_ACADEMY_ORG_STRUCTURE_FAIL,
  payload: error,
});

/* GET DELETED VALUE */
export const getAcademyOrgStructureDeletedValue = () => ({
  type: GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE,
});

export const getAcademyOrgStructureDeletedValueSuccess = deleted => ({
  type: GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getAcademyOrgStructureDeletedValueFail = error => ({
  type: GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_FAIL,
  payload: error,
});
