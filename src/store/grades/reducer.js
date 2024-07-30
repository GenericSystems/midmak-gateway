import {
  GET_GRADES_SUCCESS,
  GET_GRADES_FAIL,
  GET_FILTERED_GRADES_SUCCESS,
  GET_FILTERED_GRADES_FAIL,
  ADD_GRADE_SUCCESS,
  ADD_GRADE_FAIL,
  UPDATE_GRADE_SUCCESS,
  UPDATE_GRADE_FAIL,
  DELETE_GRADE_SUCCESS,
  DELETE_GRADE_FAIL,
  GET_GRADE_DELETED_VALUE_SUCCESS,
  GET_GRADE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  grades: [],
  filteredGrades: [],
  error: {},
  deleted: {},
};

const grades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GRADES_SUCCESS:
      return {
        ...state,
        grades: action.payload,
        deleted: {},
      };

    case GET_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_GRADES_SUCCESS:
      return {
        ...state,
        filteredGrades: action.payload,
        deleted: {},
      };

    case GET_FILTERED_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_GRADE_SUCCESS:
      return {
        ...state,
        grades: [...state.grades, action.payload],
      };

    case ADD_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_GRADE_SUCCESS:
      return {
        ...state,
        grades: state.grades.map(grade =>
          grade.Id.toString() === action.payload.Id.toString()
            ? { grade, ...action.payload }
            : grade
        ),
      };

    case UPDATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_GRADE_SUCCESS:
      return {
        ...state,
        grades: state.grades.filter(grade => grade.Id !== action.payload.Id),
        deleted: action.payload.deleted,
      };

    case DELETE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRADE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_GRADE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default grades;
