import { nationalities } from "common/data";
import {
  GET_MARKS_OBJECTIONS,
  GET_MARKS_OBJECTIONS_FAIL,
  GET_MARKS_OBJECTIONS_SUCCESS,
  ADD_NEW_MARK_OBJECTION,
  ADD_MARK_OBJECTION_SUCCESS,
  ADD_MARK_OBJECTION_FAIL,
  UPDATE_MARK_OBJECTION,
  UPDATE_MARK_OBJECTION_SUCCESS,
  UPDATE_MARK_OBJECTION_FAIL,
  GET_MARK_OBJECTION_DELETED_VALUE,
  GET_MARK_OBJECTION_DELETED_VALUE_SUCCESS,
  GET_MARK_OBJECTION_DELETED_VALUE_FAIL,
  DELETE_MARK_OBJECTION,
  DELETE_MARK_OBJECTION_SUCCESS,
  DELETE_MARK_OBJECTION_FAIL,
  GET_REQUEST_STATUS,
  GET_REQUEST_STATUS_FAIL,
  GET_REQUEST_STATUS_SUCCESS,
} from "./actionTypes";

export const getMarksObjections = () => ({
  type: GET_MARKS_OBJECTIONS,
});

export const getMarksObjectionsSuccess = contracts => ({
  type: GET_MARKS_OBJECTIONS_SUCCESS,
  payload: contracts,
});

export const getMarksObjectionsFail = error => ({
  type: GET_MARKS_OBJECTIONS_FAIL,
  payload: error,
});

export const getMarkObjectionDeletedValue = () => ({
  type: GET_MARK_OBJECTION_DELETED_VALUE,
});

export const getMarkObjectionDeletedValueSuccess = contract => ({
  type: GET_MARK_OBJECTION_DELETED_VALUE_SUCCESS,
  payload: contract,
});

export const getMarkObjectionDeletedValueFail = error => ({
  type: GET_MARK_OBJECTION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewMarkObjection = contract => ({
  type: ADD_NEW_MARK_OBJECTION,
  payload: contract,
});

export const addMarkObjectionSuccess = contract => ({
  type: ADD_MARK_OBJECTION_SUCCESS,
  payload: contract,
});

export const addMarkObjectionFail = error => ({
  type: ADD_MARK_OBJECTION_FAIL,
  payload: error,
});

export const updateMarkObjection = contract => {
  return {
    type: UPDATE_MARK_OBJECTION,
    payload: contract,
  };
};

export const updateMarkObjectionSuccess = contract => ({
  type: UPDATE_MARK_OBJECTION_SUCCESS,
  payload: contract,
});

export const updateMarkObjectionFail = error => ({
  type: UPDATE_MARK_OBJECTION_FAIL,
  payload: error,
});

export const deleteMarkObjection = contract => ({
  type: DELETE_MARK_OBJECTION,
  payload: contract,
});

export const deleteMarkObjectionSuccess = contract => ({
  type: DELETE_MARK_OBJECTION_SUCCESS,
  payload: contract,
});

export const deleteMarkObjectionFail = error => ({
  type: DELETE_MARK_OBJECTION_FAIL,
  payload: error,
});

export const getRequestStatus = () => ({
  type: GET_REQUEST_STATUS,
});

export const getRequestStatusSuccess = contracts => ({
  type: GET_REQUEST_STATUS_SUCCESS,
  payload: contracts,
});

export const getRequestStatusFail = error => ({
  type: GET_REQUEST_STATUS_FAIL,
  payload: error,
});
