import {
  GET_GENDERS,
  GET_GENDERS_SUCCESS,
  GET_GENDERS_FAIL,
  ADD_NEW_GENDER,
  ADD_GENDER_SUCCESS,
  ADD_GENDER_FAIL,
  UPDATE_GENDER,
  UPDATE_GENDER_SUCCESS,
  UPDATE_GENDER_FAIL,
  DELETE_GENDER,
  DELETE_GENDER_SUCCESS,
  DELETE_GENDER_FAIL,
  GET_GENDER_DELETED_VALUE,
  GET_GENDER_DELETED_VALUE_FAIL,
  GET_GENDER_DELETED_VALUE_SUCCESS,
} from "./actionTypes";
export const getGenders = () => ({
  type: GET_GENDERS,
});

export const getGendersSuccess = genders => ({
  type: GET_GENDERS_SUCCESS,
  payload: genders,
});

export const getGendersFail = error => ({
  type: GET_GENDERS_FAIL,
  payload: error,
});
export const addNewGender = gender => ({
  type: ADD_NEW_GENDER,
  payload: gender,
});
export const addGenderSuccess = gender => ({
  type: ADD_GENDER_SUCCESS,
  payload: gender,
});

export const addGenderFail = error => ({
  type: ADD_GENDER_FAIL,
  payload: error,
});
export const updateGender = gender => {
  return {
    type: UPDATE_GENDER,
    payload: gender,
  };
};

export const updateGenderSuccess = gender => ({
  type: UPDATE_GENDER_SUCCESS,
  payload: gender,
});

export const updateGenderFail = error => ({
  type: UPDATE_GENDER_FAIL,
  payload: error,
});
export const deleteGender = gender => ({
  type: DELETE_GENDER,
  payload: gender,
});
export const deleteGenderSuccess = gender => ({
  type: DELETE_GENDER_SUCCESS,
  payload: gender,
});
export const deleteGenderFail = error => ({
  type: DELETE_GENDER_FAIL,
  payload: error,
});

export const getGenderDeletedValue = () => ({
  type: GET_GENDER_DELETED_VALUE,
});

export const getGenderDeletedValueSuccess = deleted => ({
  type: GET_GENDER_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getGenderDeletedValueFail = error => ({
  type: GET_GENDER_DELETED_VALUE_FAIL,
  payload: error,
});

