import {
    GET_GENERATE_SIDS,
    GET_GENERATE_SIDS_FAIL,
    GET_GENERATE_SIDS_SUCCESS,
    GET_GENERATE_SID_PROFILE,
    GET_GENERATE_SID_PROFILE_FAIL,
    GET_GENERATE_SID_PROFILE_SUCCESS,
    ADD_NEW_GENERATE_SID,
    ADD_GENERATE_SID_SUCCESS,
    ADD_GENERATE_SID_FAIL,
    UPDATE_GENERATE_SID,
    UPDATE_GENERATE_SID_SUCCESS,
    UPDATE_GENERATE_SID_FAIL,
    DELETE_GENERATE_SID,
    DELETE_GENERATE_SID_SUCCESS,
    DELETE_GENERATE_SID_FAIL,
    GET_TEMPSTUDENTS,
    GET_TEMPSTUDENTS_FAIL,
    GET_TEMPSTUDENTS_SUCCESS,
    GET_TEMPSTD
  } from "./actionTypes"
  
  export const getGenerateSIDs = () => ({
    type: GET_GENERATE_SIDS,
  })
  
  export const getGenerateSIDsSuccess = generateSIDs => ({
    type: GET_GENERATE_SIDS_SUCCESS,
    payload: generateSIDs,
  })
  
  export const getGenerateSIDsFail = error => ({
    type: GET_GENERATE_SIDS_FAIL,
    payload: error,
  })
  
  export const getGenerateSIDProfile = generateSIDId => ({
    type: GET_GENERATE_SID_PROFILE,
    generateSIDId,
  })
  
  export const getGenerateSIDProfileSuccess = generateSIDProfiles => ({
    type: GET_GENERATE_SID_PROFILE_SUCCESS,
    payload: generateSIDProfiles,
  })
  
  export const getGenerateSIDProfileFail = error => ({
    type: GET_GENERATE_SID_PROFILE_FAIL,
    payload: error,
  })
  
  export const addNewGenerateSID = generateSID => ({
    type: ADD_NEW_GENERATE_SID,
    payload: generateSID,
  })
  
  export const addGenerateSIDSuccess = generateSID => ({
    type: ADD_GENERATE_SID_SUCCESS,
    payload: generateSID,
  })
  
  export const addGenerateSIDFail = error => ({
    type: ADD_GENERATE_SID_FAIL,
    payload: error,
  })
  
  export const updateGenerateSID = generateSID => ({
    type: UPDATE_GENERATE_SID,
    payload: generateSID,
  })
  
  export const updateGenerateSIDSuccess = generateSID => ({
    type: UPDATE_GENERATE_SID_SUCCESS,
    payload: generateSID,
  })
  
  export const updateGenerateSIDFail = error => ({
    type: UPDATE_GENERATE_SID_FAIL,
    payload: error,
  })
  
  export const deleteGenerateSID = generateSID => ({
    type: DELETE_GENERATE_SID,
    payload: generateSID,
  })
  
  export const deleteGenerateSIDSuccess = generateSID => ({
    type: DELETE_GENERATE_SID_SUCCESS,
    payload: generateSID,
  })
  
  export const deleteGenerateSIDFail = error => ({
    type: DELETE_GENERATE_SID_FAIL,
    payload: error,
  })



  export const getTempStudents = () => ({
    type: GET_TEMPSTUDENTS,
  });
  
  export const getTempStudentsSuccess = TempStudents => ({
    type: GET_TEMPSTUDENTS_SUCCESS,
    payload: TempStudents,
  });
  
  export const getTempStudentsFail = error => ({
    type: GET_TEMPSTUDENTS_FAIL,
    payload: error,
  });
  
  export const fetchTempStudents = () => ({
    type: GET_TEMPSTD,
  });
  

