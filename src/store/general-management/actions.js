import {
    GET_GENERAL_MANAGEMENTS,
    GET_GENERAL_MANAGEMENTS_FAIL,
    GET_GENERAL_MANAGEMENTS_SUCCESS,
    GET_GENERAL_MANAGEMENT_PROFILE,
    GET_GENERAL_MANAGEMENT_PROFILE_FAIL,
    GET_GENERAL_MANAGEMENT_PROFILE_SUCCESS,
    ADD_NEW_GENERAL_MANAGEMENT,
    ADD_GENERAL_MANAGEMENT_SUCCESS,
    ADD_GENERAL_MANAGEMENT_FAIL,
    UPDATE_GENERAL_MANAGEMENT,
    UPDATE_GENERAL_MANAGEMENT_SUCCESS,
    UPDATE_GENERAL_MANAGEMENT_FAIL,
    DELETE_GENERAL_MANAGEMENT,
    DELETE_GENERAL_MANAGEMENT_SUCCESS,
    DELETE_GENERAL_MANAGEMENT_FAIL,
    GET_YEAR_SEMESTERS,
    GET_YEAR_SEMESTERS_FAIL,
    GET_YEAR_SEMESTERS_SUCCESS,
    GET_YEAR_SEM
  } from "./actionTypes"
  
  export const getGeneralManagements = () => ({
    type: GET_GENERAL_MANAGEMENTS,
  })
  
  export const getGeneralManagementsSuccess = generalManagements => ({
    type: GET_GENERAL_MANAGEMENTS_SUCCESS,
    payload: generalManagements,
  })
  
  export const getGeneralManagementsFail = error => ({
    type: GET_GENERAL_MANAGEMENTS_FAIL,
    payload: error,
  })
  
  export const getGeneralManagementProfile = generalManagementId => ({
    type: GET_GENERAL_MANAGEMENT_PROFILE,
    generalManagementId,
  })
  
  export const getGeneralManagementProfileSuccess = generalManagementProfiles => ({
    type: GET_GENERAL_MANAGEMENT_PROFILE_SUCCESS,
    payload: generalManagementProfiles,
  })
  
  export const getGeneralManagementProfileFail = error => ({
    type: GET_GENERAL_MANAGEMENT_PROFILE_FAIL,
    payload: error,
  })
  
  export const addNewGeneralManagement = generalManagement => ({
    type: ADD_NEW_GENERAL_MANAGEMENT,
    payload: generalManagement,
  })
  
  export const addGeneralManagementSuccess = generalManagement => ({
    type: ADD_GENERAL_MANAGEMENT_SUCCESS,
    payload: generalManagement,
  })
  
  export const addGeneralManagementFail = error => ({
    type: ADD_GENERAL_MANAGEMENT_FAIL,
    payload: error,
  })
  
  export const updateGeneralManagement = generalManagement => ({
    type: UPDATE_GENERAL_MANAGEMENT,
    payload: generalManagement,
  })
  
  export const updateGeneralManagementSuccess = generalManagement => ({
    type: UPDATE_GENERAL_MANAGEMENT_SUCCESS,
    payload: generalManagement,
  })
  
  export const updateGeneralManagementFail = error => ({
    type: UPDATE_GENERAL_MANAGEMENT_FAIL,
    payload: error,
  })
  
  export const deleteGeneralManagement = generalManagement => ({
    type: DELETE_GENERAL_MANAGEMENT,
    payload: generalManagement,
  })
  
  export const deleteGeneralManagementSuccess = generalManagement => ({
    type: DELETE_GENERAL_MANAGEMENT_SUCCESS,
    payload: generalManagement,
  })
  
  export const deleteGeneralManagementFail = error => ({
    type: DELETE_GENERAL_MANAGEMENT_FAIL,
    payload: error,
  })

  export const getYearSemesters = () => ({
    type: GET_YEAR_SEMESTERS,
  });
  
  export const getYearSemestersSuccess = YearSemesters => ({
    type: GET_YEAR_SEMESTERS_SUCCESS,
    payload: YearSemesters,
  });
  
  export const getYearSemestersFail = error => ({
    type: GET_YEAR_SEMESTERS_FAIL,
    payload: error,
  });
  
  export const fetchYearsSemesters = () => ({
    type: GET_YEAR_SEM,
  });