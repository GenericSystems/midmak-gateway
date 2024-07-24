import {
  GET_CURR_SEM_MANS,
  GET_CURR_SEM_MANS_FAIL,
  GET_CURR_SEM_MANS_SUCCESS,
  ADD_NEW_CURR_SEM_MAN,
  ADD_CURR_SEM_MAN_SUCCESS,
  ADD_CURR_SEM_MAN_FAIL,
  UPDATE_CURR_SEM_MAN,
  UPDATE_CURR_SEM_MAN_SUCCESS,
  UPDATE_CURR_SEM_MAN_FAIL,
  DELETE_CURR_SEM_MAN,
  DELETE_CURR_SEM_MAN_SUCCESS,
  DELETE_CURR_SEM_MAN_FAIL,
} from "./actionTypes"

export const getCurrSemMans = () => ({
  type: GET_CURR_SEM_MANS,
})

export const getCurrSemMansSuccess = currSemMans => ({
  type: GET_CURR_SEM_MANS_SUCCESS,
  payload: currSemMans,
})

export const getCurrSemMansFail = error => ({
  type: GET_CURR_SEM_MANS_FAIL,
  payload: error,
})


export const addNewCurrSemMan = currSemMan => ({
  type: ADD_NEW_CURR_SEM_MAN,
  payload: currSemMan,
})

export const addCurrSemManSuccess = currSemMan => ({
  type: ADD_CURR_SEM_MAN_SUCCESS,
  payload: currSemMan,
})

export const addCurrSemManFail = error => ({
  type: ADD_CURR_SEM_MAN_FAIL,
  payload: error,
})

export const updateCurrSemMan = currSemMan => ({
  type: UPDATE_CURR_SEM_MAN,
  payload: currSemMan,
})

export const updateCurrSemManSuccess = currSemMan => ({
  type: UPDATE_CURR_SEM_MAN_SUCCESS,
  payload: currSemMan,
})

export const updateCurrSemManFail = error => ({
  type: UPDATE_CURR_SEM_MAN_FAIL,
  payload: error,
})

export const deleteCurrSemMan = currSemMan => ({
  type: DELETE_CURR_SEM_MAN,
  payload: currSemMan,
})

export const deleteCurrSemManSuccess = currSemMan => ({
  type: DELETE_CURR_SEM_MAN_SUCCESS,
  payload: currSemMan,
})

export const deleteCurrSemManFail = error => ({
  type: DELETE_CURR_SEM_MAN_FAIL,
  payload: error,
})