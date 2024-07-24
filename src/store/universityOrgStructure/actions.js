import {
 GET_UNIVERSITY_ORG_STRUCTURES,
 GET_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
 GET_UNIVERSITY_ORG_STRUCTURE_FAIL,
 ADD_NEW_UNIVERSITY_ORG_STRUCTURE,
 ADD_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
 ADD_UNIVERSITY_ORG_STRUCTURE_FAIL,
 DELETE_UNIVERSITY_ORG_STRUCTURE,
 DELETE_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
 DELETE_UNIVERSITY_ORG_STRUCTURE_FAIL,
 UPDATE_UNIVERSITY_ORG_STRUCTURE,
 UPDATE_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
 UPDATE_UNIVERSITY_ORG_STRUCTURE_FAIL,
 GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE,
 GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_FAIL,
 GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS,
 
}

from "./actionTypes";

export const getUniversityOrgStructure = () => ({
type: GET_UNIVERSITY_ORG_STRUCTURES,

});
export const getUniversityOrgStructureSuccess = universityOrgStructures => ({
type: GET_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
payload: universityOrgStructures,
});


export const getUniversityOrgStructureFail = error=> ({
type: GET_UNIVERSITY_ORG_STRUCTURE_FAIL,
payload: error,
});

export const addNewUniversityOrgStructure = universityOrgStructure => ({
type: ADD_NEW_UNIVERSITY_ORG_STRUCTURE,
payload:universityOrgStructure,
});

export const addNewUniversityOrgStructureSuccess = universityOrgStructure => ({
  type: ADD_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  payload: universityOrgStructure
});

export const addNewUniversityOrgStructureFail = error => ({
  type:ADD_UNIVERSITY_ORG_STRUCTURE_FAIL,
  payload: error,
});

export const updateUniversityOrgStructure = universityOrgStructure => {
  return {
    type: UPDATE_UNIVERSITY_ORG_STRUCTURE,
    payload: universityOrgStructure,
  };
  };

export const updateUniversityOrgStructureSuccess = universityOrgStructure => ({
  type: UPDATE_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  payload: universityOrgStructure,
});

export const updateUniversityOrgStructureFail = error => ({
  type: UPDATE_UNIVERSITY_ORG_STRUCTURE_FAIL,
  payload: error,
});

export const deleteUniversityOrgStructure = universityOrgStructure => ({
  type: DELETE_UNIVERSITY_ORG_STRUCTURE,
  payload: universityOrgStructure,
});

export const deleteUniversityOrgStructureSuccess = universityOrgStructure => ({
  type: DELETE_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  payload: universityOrgStructure,
});

export const deleteUniversityOrgStructureFail = error => ({
  type: DELETE_UNIVERSITY_ORG_STRUCTURE_FAIL,
  payload: error,
});

export const getUniversityOrgStructureDeletedValue = () => ({
  type: GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE,
});



export const getUniversityOrgStructureDeletedValueSuccess = deleted => ({
  type: GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getUniversityOrgStructureDeletedValueFail = error => ({
  type: GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_FAIL,
  payload: error,
});



 