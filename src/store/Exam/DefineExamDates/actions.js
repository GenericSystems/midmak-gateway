import { nationalities } from "common/data";
import {
  GET_DEFINE_EXAM_DATES,
  GET_DEFINE_EXAM_DATES_FAIL,
  GET_DEFINE_EXAM_DATES_SUCCESS,
  ADD_NEW_DEFINE_EXAM_DATE,
  ADD_DEFINE_EXAM_DATE_SUCCESS,
  ADD_DEFINE_EXAM_DATE_FAIL,
  UPDATE_DEFINE_EXAM_DATE,
  UPDATE_DEFINE_EXAM_DATE_SUCCESS,
  UPDATE_DEFINE_EXAM_DATE_FAIL,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE_SUCCESS,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE_FAIL,
  DELETE_DEFINE_EXAM_DATE,
  DELETE_DEFINE_EXAM_DATE_SUCCESS,
  DELETE_DEFINE_EXAM_DATE_FAIL,
} from "./actionTypes";

export const getDefineExamDates = () => ({
  type: GET_DEFINE_EXAM_DATES,
});

export const getDefineExamDatesSuccess = defineExamDates => ({
  type: GET_DEFINE_EXAM_DATES_SUCCESS,
  payload: defineExamDates,
});

export const getDefineExamDatesFail = error => ({
  type: GET_DEFINE_EXAM_DATES_FAIL,
  payload: error,
});

export const getDefineExamDateDeletedValue = () => ({
  type: GET_DEFINE_EXAM_DATE_DELETED_VALUE,
});

export const getDefineExamDateDeletedValueSuccess = defineExamDate => ({
  type: GET_DEFINE_EXAM_DATE_DELETED_VALUE_SUCCESS,
  payload: defineExamDate,
});

export const getDefineExamDateDeletedValueFail = error => ({
  type: GET_DEFINE_EXAM_DATE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDefineExamDate = defineExamDates => ({
  type: ADD_NEW_DEFINE_EXAM_DATE,
  payload: defineExamDates,
});

export const addDefineExamDateSuccess = defineExamDates => ({
  type: ADD_DEFINE_EXAM_DATE_SUCCESS,
  payload: defineExamDates,
});

export const addDefineExamDateFail = error => ({
  type: ADD_DEFINE_EXAM_DATE_FAIL,
  payload: error,
});

export const updateDefineExamDate = defineExamDates => {
  return {
    type: UPDATE_DEFINE_EXAM_DATE,
    payload: defineExamDates,
  };
};

export const updateDefineExamDateSuccess = defineExamDates => ({
  type: UPDATE_DEFINE_EXAM_DATE_SUCCESS,
  payload: defineExamDates,
});

export const updateDefineExamDateFail = error => ({
  type: UPDATE_DEFINE_EXAM_DATE_FAIL,
  payload: error,
});

export const deleteDefineExamDate = defineExamDates => ({
  type: DELETE_DEFINE_EXAM_DATE,
  payload: defineExamDates,
});

export const deleteDefineExamDateSuccess = defineExamDates => ({
  type: DELETE_DEFINE_EXAM_DATE_SUCCESS,
  payload: defineExamDates,
});

export const deleteDefineExamDateFail = error => ({
  type: DELETE_DEFINE_EXAM_DATE_FAIL,
  payload: error,
});
