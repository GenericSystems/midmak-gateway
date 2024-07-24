import {
    GET_GRANT_SPONSOR_PROFILE,
    GET_GRANT_SPONSOR_PROFILE_FAIL,
    GET_GRANT_SPONSOR_PROFILE_SUCCESS,
    GET_GRANT_SPONSORS,
    GET_GRANT_SPONSORS_FAIL,
    GET_GRANT_SPONSORS_SUCCESS,
    ADD_NEW_GRANT_SPONSOR,
    ADD_GRANT_SPONSOR_SUCCESS,
    ADD_GRANT_SPONSOR_FAIL,
    UPDATE_GRANT_SPONSOR,
    UPDATE_GRANT_SPONSOR_SUCCESS,
    UPDATE_GRANT_SPONSOR_FAIL,
    DELETE_GRANT_SPONSOR,
    DELETE_GRANT_SPONSOR_SUCCESS,
    DELETE_GRANT_SPONSOR_FAIL,
    GET_GRANT_SPONSOR_DELETED_VALUE,
GET_GRANT_SPONSOR_DELETED_VALUE_SUCCESS,
GET_GRANT_SPONSOR_DELETED_VALUE_FAIL
    } from "./actionTypes"
    
    export const getGrantSponsors = () => ({
    type: GET_GRANT_SPONSORS,
    })
    
    export const getGrantSponsorsSuccess = grantSponsors => ({
    type: GET_GRANT_SPONSORS_SUCCESS,
    payload: grantSponsors,
    })
    
    export const getGrantSponsorsFail = error => ({
    type: GET_GRANT_SPONSORS_FAIL,
    payload: error,
    })
    
    export const getGrantSponsorProfile = () => ({
    type: GET_GRANT_SPONSOR_PROFILE,
    })
    
    export const getGrantSponsorProfileSuccess = grantProfile => ({
    type: GET_GRANT_SPONSOR_PROFILE_SUCCESS,
    payload: grantProfile,
    })
    
    export const getGrantSponsorProfileFail = error => ({
    type: GET_GRANT_SPONSOR_PROFILE_FAIL,
    payload: error,
    })
    
    export const addNewGrantSponsor = grant => ({
    type: ADD_NEW_GRANT_SPONSOR,
    payload: grant,
    })
    
    export const addGrantSponsorSuccess = grant => ({
    type: ADD_GRANT_SPONSOR_SUCCESS,
    payload: grant,
    })
    
    export const addGrantSponsorFail = error => ({
    type: ADD_GRANT_SPONSOR_FAIL,
    payload: error,
    })
    
    export const updateGrantSponsor = grant => {
    return ({
    type: UPDATE_GRANT_SPONSOR,
    payload: grant,
    })
    }
    
    export const updateGrantSponsorSuccess = grant => ({
    type: UPDATE_GRANT_SPONSOR_SUCCESS,
    payload: grant,
    })
    
    export const updateGrantSponsorFail = error => ({
    type: UPDATE_GRANT_SPONSOR_FAIL,
    payload: error,
    })
    
    export const deleteGrantSponsor = grant => ({
    type: DELETE_GRANT_SPONSOR,
    payload: grant,
    })
    
    export const deleteGrantSponsorSuccess = grant => ({
    type: DELETE_GRANT_SPONSOR_SUCCESS,
    payload: grant,
    })
    
    export const deleteGrantSponsorFail = error => ({
    type: DELETE_GRANT_SPONSOR_FAIL,
    payload: error,
    })


    export const getGrantSponsorDeletedValue = () => ({
        type: GET_GRANT_SPONSOR_DELETED_VALUE,
      });
      
      export const getGrantSponsorDeletedValueSuccess = deleted => ({
        type: GET_GRANT_SPONSOR_DELETED_VALUE_SUCCESS,
        payload: deleted,
      });
      
      export const getGrantSponsorDeletedValueFail = error => ({
        type: GET_GRANT_SPONSOR_DELETED_VALUE_FAIL,
        payload: error,
      });
      
      