import {
GET_TRAINING_MEMBERS,
GET_TRAINING_MEMBERS_FAIL,
GET_TRAINING_MEMBERS_SUCCESS,
ADD_NEW_TRAINING_MEMBER,
ADD_TRAINING_MEMBER_FAIL,
ADD_TRAINING_MEMBER_SUCCESS,
UPDATE_TRAINING_MEMBER,
UPDATE_TRAINING_MEMBER_FAIL,
UPDATE_TRAINING_MEMBER_SUCCESS,
DELETE_TRAINING_MEMBER,
DELETE_TRAINING_MEMBER_SUCCESS,
DELETE_TRAINING_MEMBER_FAIL,
GET_TRAINING_MEMBER_DELETED_VALUE,
GET_TRAINING_MEMBER_DELETED_VALUE_FAIL,
GET_TRAINING_MEMBER_DELETED_VALUE_SUCCESS,
  } from "./actionTypes";
  
  export const getTrainingMembers = () => ({
    type: GET_TRAINING_MEMBERS,
  });
  
  export const getTrainingMembersSuccess = warnings => ({
    type: GET_TRAINING_MEMBERS_SUCCESS,
    payload: warnings,
  });
  
  export const getTrainingMembersFail = error => ({
    type: GET_TRAINING_MEMBERS_FAIL,
    payload: error,
  });
  
  
  export const addNewTrainingMember = warning => ({
    type: ADD_NEW_TRAINING_MEMBER,
    payload: warning,
  });
  
  export const addTrainingMemberSuccess = warning => ({
    type: ADD_TRAINING_MEMBER_SUCCESS,
    payload: warning,
  });
  
  export const addTrainingMemberFail = error => ({
    type: ADD_TRAINING_MEMBER_FAIL,
    payload: error,
  });
  
  export const updateTrainingMember = warning => {
    return {
      type: UPDATE_TRAINING_MEMBER,
      payload: warning,
    };
  };
  
  export const updateTrainingMemberSuccess = warning => ({
    type: UPDATE_TRAINING_MEMBER_SUCCESS,
    payload: warning,
  });
  
  export const updateTrainingMemberFail = error => ({
    type: UPDATE_TRAINING_MEMBER_FAIL,
    payload: error,
  });
  
  export const deleteTrainingMember = warning => ({
    type: DELETE_TRAINING_MEMBER,
    payload: warning,
  });
  
  export const deleteTrainingMemberSuccess = warning => ({
    type: DELETE_TRAINING_MEMBER_SUCCESS,
    payload: warning,
  });
  
  export const deleteTrainingMemberFail = error => ({
    type: DELETE_TRAINING_MEMBER_FAIL,
    payload: error,
  });
  
  
export const getTrainingMemberDeletedValue = () => ({
  type: GET_TRAINING_MEMBER_DELETED_VALUE,
});

export const getTrainingMemberDeletedValueSuccess = deleted => ({
  type: GET_TRAINING_MEMBER_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getTrainingMemberDeletedValueFail = error => ({
  type: GET_TRAINING_MEMBER_DELETED_VALUE_FAIL,
  payload: error,
});