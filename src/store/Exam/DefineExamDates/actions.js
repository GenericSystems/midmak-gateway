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
  GET_STUDENTS_ORDER,
  GET_STUDENTS_ORDER_FAIL,
  GET_STUDENTS_ORDER_SUCCESS,
  GET_DEFINE_PERIODS,
  GET_DEFINE_PERIODS_FAIL,
  GET_DEFINE_PERIODS_SUCCESS,
  ADD_NEW_DEFINE_PERIOD,
  ADD_DEFINE_PERIOD_SUCCESS,
  ADD_DEFINE_PERIOD_FAIL,
  UPDATE_DEFINE_PERIOD,
  UPDATE_DEFINE_PERIOD_SUCCESS,
  UPDATE_DEFINE_PERIOD_FAIL,
  GET_DEFINE_PERIOD_DELETED_VALUE,
  GET_DEFINE_PERIOD_DELETED_VALUE_SUCCESS,
  GET_DEFINE_PERIOD_DELETED_VALUE_FAIL,
  DELETE_DEFINE_PERIOD,
  DELETE_DEFINE_PERIOD_SUCCESS,
  DELETE_DEFINE_PERIOD_FAIL,
} from "./actionTypes";

export const getDefineExamDates = defineExamDates => ({
  type: GET_DEFINE_EXAM_DATES,
  payload: defineExamDates,
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

export const getStudentsOrder = () => ({
  type: GET_STUDENTS_ORDER,
});

export const getStudentsOrderSuccess = studentsOrder => ({
  type: GET_STUDENTS_ORDER_SUCCESS,
  payload: studentsOrder,
});

export const getStudentsOrderFail = error => ({
  type: GET_STUDENTS_ORDER_FAIL,
  payload: error,
});

export const getDefinePeriods = defineExamDates => ({
  type: GET_DEFINE_PERIODS,
  payload: defineExamDates,
});

export const getDefinePeriodsSuccess = definePeriods => ({
  type: GET_DEFINE_PERIODS_SUCCESS,
  payload: definePeriods,
});

export const getDefinePeriodsFail = error => ({
  type: GET_DEFINE_PERIODS_FAIL,
  payload: error,
});

export const getDefinePeriodDeletedValue = () => ({
  type: GET_DEFINE_PERIOD_DELETED_VALUE,
});

export const getDefinePeriodDeletedValueSuccess = definePeriod => ({
  type: GET_DEFINE_PERIOD_DELETED_VALUE_SUCCESS,
  payload: definePeriod,
});

export const getDefinePeriodDeletedValueFail = error => ({
  type: GET_DEFINE_PERIOD_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDefinePeriod = definePeriod => ({
  type: ADD_NEW_DEFINE_PERIOD,
  payload: definePeriod,
});

export const addDefinePeriodSuccess = definePeriod => ({
  type: ADD_DEFINE_PERIOD_SUCCESS,
  payload: definePeriod,
});

export const addDefinePeriodFail = error => ({
  type: ADD_DEFINE_PERIOD_FAIL,
  payload: error,
});

export const updateDefinePeriod = definePeriod => {
  return {
    type: UPDATE_DEFINE_PERIOD,
    payload: definePeriod,
  };
};

export const updateDefinePeriodSuccess = definePeriod => ({
  type: UPDATE_DEFINE_PERIOD_SUCCESS,
  payload: definePeriod,
});

export const updateDefinePeriodFail = error => ({
  type: UPDATE_DEFINE_PERIOD_FAIL,
  payload: error,
});

export const deleteDefinePeriod = definePeriod => ({
  type: DELETE_DEFINE_PERIOD,
  payload: definePeriod,
});

export const deleteDefinePeriodSuccess = definePeriod => ({
  type: DELETE_DEFINE_PERIOD_SUCCESS,
  payload: definePeriod,
});

export const deleteDefinePeriodFail = error => ({
  type: DELETE_DEFINE_PERIOD_FAIL,
  payload: error,
});
