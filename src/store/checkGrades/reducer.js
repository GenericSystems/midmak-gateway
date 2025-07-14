import {
  GET_CHECKED_GRADES_SUCCESS,
  GET_CHECKED_GRADES_FAIL,
  UPDATE_CHECKED_GRADE_SUCCESS,
  UPDATE_CHECKED_GRADE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  checked_grades: [],
  error: {},
};

const checked_grades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CHECKED_GRADES_SUCCESS:
      return {
        ...state,
        checked_grades: action.payload,
      };
    case GET_CHECKED_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CHECKED_GRADE_SUCCESS:
      return {
        ...state,
        checked_grades: state.checked_grades.map(grade =>
          grade.Id === action.payload.Id
            ? { grade, ...action.payload }
            : grade
        ),
      };

    case UPDATE_CHECKED_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default checked_grades;
