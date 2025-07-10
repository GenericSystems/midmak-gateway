import {
  GET_ENTERED_GRADES,
  GET_ENTERED_GRADES_FAIL,
  GET_ENTERED_GRADES_SUCCESS,
  GET_COURSE_STATISTICS,
  GET_COURSE_STATISTICS_FAIL,
  GET_COURSE_STATISTICS_SUCCESS,
  UPDATE_ENTERED_GRADE,
  UPDATE_ENTERED_GRADE_SUCCESS,
  UPDATE_ENTERED_GRADE_FAIL,
  GET_COURSE_CONTENTS_ENTERED_GRADES,
  GET_COURSE_CONTENTS_ENTERED_GRADES_SUCCESS,
  GET_COURSE_CONTENTS_ENTERED_GRADES_FAIL,
} from "./actionTypes";

// Get all entered grades for a course
export const getEnteredGrades = course => ({
  type: GET_ENTERED_GRADES,
  payload: course,
});

export const getEnteredGradesSuccess = course => ({
  type: GET_ENTERED_GRADES_SUCCESS,
  payload: course,
});

export const getEnteredGradesFail = error => ({
  type: GET_ENTERED_GRADES_FAIL,
  payload: error,
});

// Course statistics actions
export const getCourseStatistics = course => ({
  type: GET_COURSE_STATISTICS,
  payload: course,
});

export const getCourseStatisticsSuccess = course => ({
  type: GET_COURSE_STATISTICS_SUCCESS,
  payload: course,
});

export const getCourseStatisticsFail = error => ({
  type: GET_COURSE_STATISTICS_FAIL,
  payload: error,
});

// Update an entered grade
export const updateEnteredGrade = grade => ({
  type: UPDATE_ENTERED_GRADE,
  payload: grade,
});

export const updateEnteredGradeSuccess = grade => ({
  type: UPDATE_ENTERED_GRADE_SUCCESS,
  payload: grade,
});

export const updateEnteredGradeFail = error => ({
  type: UPDATE_ENTERED_GRADE_FAIL,
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
