import {
  GET_UNIVERSITYINFO,
  GET_UNIVERSITYINFO_SUCCESS,
  GET_UNIVERSITYINFO_FAIL,
  UPDATE_UNIVERSITYINFO,
  UPDATE_UNIVERSITYINFO_SUCCESS,
  UPDATE_UNIVERSITYINFO_FAIL,
  ADD_UNIVERSITYINFO,
  ADD_UNIVERSITYINFO_SUCCESS,
  ADD_UNIVERSITYINFO_FAIL,
} from "./actionTypes";

export const getUniversityInfo = () => ({
  type: GET_UNIVERSITYINFO,
});
export const getUniversityInfoSuccess = universityInfo => ({
  type: GET_UNIVERSITYINFO_SUCCESS,
  payload: universityInfo,
});

export const getUniversityInfoFail = error => ({
  type: GET_UNIVERSITYINFO_FAIL,
  payload: error,
});

export const updateUniversityInfo = universityInfo => {
  return {
    type: UPDATE_UNIVERSITYINFO,
    payload: universityInfo,
  };
};

export const updateUniversityInfoSuccess = universityInfo => ({
  type: UPDATE_UNIVERSITYINFO_SUCCESS,
  payload: universityInfo,
});

export const updateUniversityInfoFail = error => ({
  type: UPDATE_UNIVERSITYINFO_FAIL,
  payload: error,
});

export const addUniversityInfo = universityInfo => ({
  type: ADD_UNIVERSITYINFO,
  payload: universityInfo,
});

export const addUniversityInfoSuccess = universityInfo => ({
  type: ADD_UNIVERSITYINFO_SUCCESS,
  payload: universityInfo,
});

export const addUniversityInfoFail = error => ({
  type: ADD_UNIVERSITYINFO_FAIL,
  payload: error,
});
