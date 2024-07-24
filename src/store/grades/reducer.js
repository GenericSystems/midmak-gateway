import {
  GET_GRADES_SUCCESS,
  GET_GRADES_FAIL,
  GET_COURSE_STATISTICS_FAIL,
  GET_COURSE_STATISTICS_SUCCESS,
  UPDATE_GRADE_SUCCESS,
  UPDATE_GRADE_FAIL,
  GET_COURSE_CONTENTS_GRADES_SUCCESS,
  GET_COURSE_CONTENTS_GRADES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  grades: [],
  courseContents_grades: [],
  courseStatistics: [],
  error: {},
};

const grades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GRADES_SUCCESS:
      return {
        ...state,
        grades: action.payload,
      };
    case GET_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSE_STATISTICS_SUCCESS:
      return {
        ...state,
        courseStatistics: action.payload,
      };
    case GET_COURSE_STATISTICS_FAIL:
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

    case GET_COURSE_CONTENTS_GRADES_SUCCESS:
      return {
        ...state,
        courseContents_grades: action.payload,
      };
    case GET_COURSE_CONTENTS_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default grades;
