import {
  GET_DEFINE_EXAM_DATES_SUCCESS,
  GET_DEFINE_EXAM_DATES_FAIL,
  ADD_DEFINE_EXAM_DATE_SUCCESS,
  ADD_DEFINE_EXAM_DATE_FAIL,
  UPDATE_DEFINE_EXAM_DATE_SUCCESS,
  UPDATE_DEFINE_EXAM_DATE_FAIL,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE_SUCCESS,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE_FAIL,
  DELETE_DEFINE_EXAM_DATE_SUCCESS,
  DELETE_DEFINE_EXAM_DATE_FAIL,
  GET_STUDENTS_ORDER_SUCCESS,
  GET_STUDENTS_ORDER_FAIL,
  GET_DEFINE_PERIODS_SUCCESS,
  GET_DEFINE_PERIODS_FAIL,
  ADD_DEFINE_PERIOD_SUCCESS,
  ADD_DEFINE_PERIOD_FAIL,
  UPDATE_DEFINE_PERIOD_SUCCESS,
  UPDATE_DEFINE_PERIOD_FAIL,
  GET_DEFINE_PERIOD_DELETED_VALUE_SUCCESS,
  GET_DEFINE_PERIOD_DELETED_VALUE_FAIL,
  DELETE_DEFINE_PERIOD_SUCCESS,
  DELETE_DEFINE_PERIOD_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  defineExamDates: [],
  studentsOrder: [],
  definePeriods: [],
  deleted: {},
  error: {},
};

const defineExamDates = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEFINE_EXAM_DATES_SUCCESS:
      return {
        ...state,
        defineExamDates: action.payload,
        deleted: {},
      };

    case GET_DEFINE_EXAM_DATES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DEFINE_EXAM_DATE_SUCCESS:
      return {
        ...state,
        defineExamDates: [...state.defineExamDates, action.payload],
      };

    case ADD_DEFINE_EXAM_DATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DEFINE_EXAM_DATE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_DEFINE_EXAM_DATE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DEFINE_EXAM_DATE_SUCCESS:
      return {
        ...state,
        defineExamDates: state.defineExamDates.map(defineExamDate =>
          defineExamDate.Id.toString() === action.payload.Id.toString()
            ? { defineExamDate, ...action.payload }
            : defineExamDate
        ),
      };

    case UPDATE_DEFINE_EXAM_DATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DEFINE_EXAM_DATE_SUCCESS:
      return {
        ...state,
        defineExamDates: state.defineExamDates.filter(
          defineExamDate =>
            defineExamDate.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DEFINE_EXAM_DATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENTS_ORDER_SUCCESS:
      return {
        ...state,
        studentsOrder: action.payload,
        deleted: {},
      };

    case GET_STUDENTS_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DEFINE_PERIODS_SUCCESS:
      return {
        ...state,
        definePeriods: action.payload,
        deleted: {},
      };

    case GET_DEFINE_PERIODS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DEFINE_PERIOD_SUCCESS:
      return {
        ...state,
        definePeriods: [...state.definePeriods, action.payload],
      };

    case ADD_DEFINE_PERIOD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DEFINE_PERIOD_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_DEFINE_PERIOD_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DEFINE_PERIOD_SUCCESS:
      return {
        ...state,
        definePeriods: state.definePeriods.map(definePeriod =>
          definePeriod.Id.toString() === action.payload.Id.toString()
            ? { definePeriod, ...action.payload }
            : definePeriod
        ),
      };

    case UPDATE_DEFINE_PERIOD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DEFINE_PERIOD_SUCCESS:
      return {
        ...state,
        definePeriods: state.definePeriods.filter(
          definePeriod =>
            definePeriod.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DEFINE_PERIOD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default defineExamDates;
