import {
  GET_MISMATCHED_GRADES_SUCCESS,
  GET_MISMATCHED_GRADES_FAIL,
  ADD_MISMATCHED_GRADE_SUCCESS,
  ADD_MISMATCHED_GRADE_FAIL,
  UPDATE_MISMATCHED_GRADE_SUCCESS,
  UPDATE_MISMATCHED_GRADE_FAIL,
  DELETE_MISMATCHED_GRADE_SUCCESS,
  DELETE_MISMATCHED_GRADE_FAIL,
  GET_MISMATCHED_GRADE_DELETED_VALUE_SUCCESS,
  GET_MISMATCHED_GRADE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  mismatchedGrades: [],
  deleted: {},
  error: {},
};

const mismatchedGrades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MISMATCHED_GRADES_SUCCESS:
      return {
        ...state,
        mismatchedGrades: action.payload,
      };
    case GET_MISMATCHED_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_MISMATCHED_GRADE_SUCCESS:
      return {
        ...state,
        mismatchedGrades: [...state.mismatchedGrades, action.payload],
      };

    case ADD_MISMATCHED_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MISMATCHED_GRADE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_MISMATCHED_GRADE_SUCCESS:
      return {
        ...state,
        mismatchedGrades: state.mismatchedGrades.map(mismatchedGrade =>
          mismatchedGrade.Id.toString() === action.payload.Id.toString()
            ? { mismatchedGrade, ...action.payload }
            : mismatchedGrade
        ),
      };

    case UPDATE_MISMATCHED_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_MISMATCHED_GRADE_SUCCESS:
      return {
        ...state,
        mismatchedGrades: state.mismatchedGrades.filter(
          mismatchedGrade =>
            mismatchedGrade.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_MISMATCHED_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MISMATCHED_GRADE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default mismatchedGrades;
