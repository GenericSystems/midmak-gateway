import {
  GET_ACADEMYINFO,
  GET_ACADEMYINFO_SUCCESS,
  GET_ACADEMYINFO_FAIL,
  UPDATE_ACADEMYINFO,
  UPDATE_ACADEMYINFO_SUCCESS,
  UPDATE_ACADEMYINFO_FAIL,
  ADD_ACADEMYINFO,
  ADD_ACADEMYINFO_SUCCESS,
  ADD_ACADEMYINFO_FAIL,
} from "./actionTypes";

export const getAcademyInfo = () => ({
  type: GET_ACADEMYINFO,
});
export const getAcademyInfoSuccess = academyInfo => ({
  type: GET_ACADEMYINFO_SUCCESS,
  payload: academyInfo,
});

export const getAcademyInfoFail = error => ({
  type: GET_ACADEMYINFO_FAIL,
  payload: error,
});

export const updateAcademyInfo = academyInfo => {
  return {
    type: UPDATE_ACADEMYINFO,
    payload: academyInfo,
  };
};

export const updateAcademyInfoSuccess = academyInfo => ({
  type: UPDATE_ACADEMYINFO_SUCCESS,
  payload: academyInfo,
});

export const updateAcademyInfoFail = error => ({
  type: UPDATE_ACADEMYINFO_FAIL,
  payload: error,
});

export const addAcademyInfo = academyInfo => ({
  type: ADD_ACADEMYINFO,
  payload: academyInfo,
});

export const addAcademyInfoSuccess = academyInfo => ({
  type: ADD_ACADEMYINFO_SUCCESS,
  payload: academyInfo,
});

export const addAcademyInfoFail = error => ({
  type: ADD_ACADEMYINFO_FAIL,
  payload: error,
});
