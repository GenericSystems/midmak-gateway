import {
  GET_ENTERED_GRADES_SUCCESS,
  GET_ENTERED_GRADES_FAIL,
  GET_COURSE_STATISTICS_FAIL,
  GET_COURSE_STATISTICS_SUCCESS,
  UPDATE_ENTERED_GRADE_SUCCESS,
  UPDATE_ENTERED_GRADE_FAIL,
  GET_COURSE_CONTENTS_ENTERED_GRADES_SUCCESS,
  GET_COURSE_CONTENTS_ENTERED_GRADES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  enteredGrades: [],
  courseContentsEnteredGrades: [],
  courseStatistics: [],
  error: {},
};

const enteredGrades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ENTERED_GRADES_SUCCESS:
      return {
        ...state,
        enteredGrades: action.payload,
      };
    case GET_ENTERED_GRADES_FAIL:
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

    case UPDATE_ENTERED_GRADE_SUCCESS:
      return {
        ...state,
        enteredGrades: state.enteredGrades.map(grade =>
          grade.Id.toString() === action.payload.Id.toString()
            ? { ...grade, ...action.payload }
            : grade
        ),
      };

    case UPDATE_ENTERED_GRADE_FAIL:
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

    default:
      return state;
  }
};

export default enteredGrades;
