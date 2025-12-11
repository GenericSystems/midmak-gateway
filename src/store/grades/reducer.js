import {
  GET_GRADES_SUCCESS,
  GET_GRADES_FAIL,
  UPDATE_GRADE_SUCCESS,
  UPDATE_GRADE_FAIL,
  GET_COURSE_CONTENTS_ENTERED_GRADES_SUCCESS,
  GET_COURSE_CONTENTS_ENTERED_GRADES_FAIL,
  GET_COURSES_OPT_SUCCESS,
  GET_COURSES_OPT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  grades: [],
  courseContentsEnteredGrades: [],
  coursesOpt: [],
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

    case UPDATE_GRADE_SUCCESS:
      return {
        ...state,
        grades: state.grades.map(grade =>
          grade.Id === action.payload.Id ? { grade, ...action.payload } : grade
        ),
      };

    case UPDATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSE_CONTENTS_ENTERED_GRADES_SUCCESS:
      return {
        ...state,
        courseContentsEnteredGrades: action.payload,
      };
    case GET_COURSE_CONTENTS_ENTERED_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSES_OPT_SUCCESS:
      return {
        ...state,
        coursesOpt: action.payload,
      };
    case GET_COURSES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default grades;
