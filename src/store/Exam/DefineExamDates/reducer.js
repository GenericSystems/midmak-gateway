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
} from "./actionTypes";

const INIT_STATE = {
  defineExamDates: [],
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

    default:
      return state;
  }
};

export default defineExamDates;
