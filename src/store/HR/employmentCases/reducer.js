import {
  GET_EMPLOYMENT_CASES_SUCCESS,
  GET_EMPLOYMENT_CASES_FAIL,
  ADD_EMPLOYMENT_CASE_SUCCESS,
  ADD_EMPLOYMENT_CASE_FAIL,
  UPDATE_EMPLOYMENT_CASE_SUCCESS,
  UPDATE_EMPLOYMENT_CASE_FAIL,
  DELETE_EMPLOYMENT_CASE_SUCCESS,
  DELETE_EMPLOYMENT_CASE_FAIL,
  GET_EMPLOYMENT_CASE_DELETED_VALUE_SUCCESS,
  GET_EMPLOYMENT_CASE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  employmentCases: [],
  deleted: {},
  error: {},
};

const employmentCases = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYMENT_CASES_SUCCESS:
      return {
        ...state,
        employmentCases: action.payload,
      };

    case GET_EMPLOYMENT_CASES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_EMPLOYMENT_CASE_SUCCESS:
      return {
        ...state,
        employmentCases: [...state.employmentCases, action.payload],
      };

    case ADD_EMPLOYMENT_CASE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EMPLOYMENT_CASE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_EMPLOYMENT_CASE_SUCCESS:
      return {
        ...state,
        employmentCases: state.employmentCases.map(employmentCase =>
          employmentCase.Id.toString() === action.payload.Id.toString()
            ? { employmentCase, ...action.payload }
            : employmentCase
        ),
      };

    case UPDATE_EMPLOYMENT_CASE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EMPLOYMENT_CASE_SUCCESS:
      return {
        ...state,
        employmentCases: state.employmentCases.filter(
          employmentCase =>
            employmentCase.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_EMPLOYMENT_CASE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EMPLOYMENT_CASE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default employmentCases;
