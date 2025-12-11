import {
  GET_GRADES,
  GET_GRADES_SUCCESS,
  GET_GRADES_FAIL,
  UPDATE_GRADE,
  UPDATE_GRADE_SUCCESS,
  UPDATE_GRADE_FAIL,
  GET_COURSE_CONTENTS_ENTERED_GRADES,
  GET_COURSE_CONTENTS_ENTERED_GRADES_SUCCESS,
  GET_COURSE_CONTENTS_ENTERED_GRADES_FAIL,
  GET_COURSES_OPT,
  GET_COURSES_OPT_FAIL,
  GET_COURSES_OPT_SUCCESS,
} from "./actionTypes";

export const getGrades = grades => ({
  type: GET_GRADES,
  payload: grades,
});

export const getGradesSuccess = grades => ({
  type: GET_GRADES_SUCCESS,
  payload: grades,
});

export const getGradesFail = error => ({
  type: GET_GRADES_FAIL,
  payload: error,
});

export const updateGrade = grade => ({
  type: UPDATE_GRADE,
  payload: grade,
});

export const updateGradeSuccess = grade => ({
  type: UPDATE_GRADE_SUCCESS,
  payload: grade,
});

export const updateGradeFail = error => ({
  type: UPDATE_GRADE_FAIL,
  payload: error,
});

export const getCourseContentsEnteredGrades = courseContentsEnteredGrades => ({
  type: GET_COURSE_CONTENTS_ENTERED_GRADES,
  payload: courseContentsEnteredGrades,
});

export const getCourseContentsEnteredGradesSuccess =
  courseContentsEnteredGrades => ({
    type: GET_COURSE_CONTENTS_ENTERED_GRADES_SUCCESS,
    payload: courseContentsEnteredGrades,
  });

export const getCourseContentsEnteredGradesFail = error => ({
  type: GET_COURSE_CONTENTS_ENTERED_GRADES_FAIL,
  payload: error,
});

export const getCoursesOpt = () => ({
  type: GET_COURSES_OPT,
});

export const getCoursesOptSuccess = coursesOpt => ({
  type: GET_COURSES_OPT_SUCCESS,
  payload: coursesOpt,
});

export const getCoursesOptFail = error => ({
  type: GET_COURSES_OPT_FAIL,
  payload: error,
});
