import {
  GET_ARCHIVED_GRADES_SUCCESS,
  GET_ARCHIVED_GRADES_FAIL,
  UPDATE_ARCHIVED_GRADE_SUCCESS,
  UPDATE_ARCHIVED_GRADE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  archived_grades: [],
  error: {},
};

const archived_grades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ARCHIVED_GRADES_SUCCESS:
      return {
        ...state,
        archived_grades: action.payload,
      };
    case GET_ARCHIVED_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ARCHIVED_GRADE_SUCCESS:
      return {
        ...state,
        archived_grades: state.archived_grades.map(grade =>
          grade.Id === action.payload.Id
            ? { grade, ...action.payload }
            : grade
        ),
      };

    case UPDATE_ARCHIVED_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default archived_grades;
