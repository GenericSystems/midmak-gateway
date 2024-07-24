import {
  GET_GRADES,
  GET_GRADES_FAIL,
  GET_GRADES_SUCCESS,
  GET_COURSE_STATISTICS,
  GET_COURSE_STATISTICS_FAIL,
  GET_COURSE_STATISTICS_SUCCESS,
  UPDATE_GRADE,
  UPDATE_GRADE_SUCCESS,
  UPDATE_GRADE_FAIL,
  GET_COURSE_CONTENTS_GRADES,
  GET_COURSE_CONTENTS_GRADES_SUCCESS,
  GET_COURSE_CONTENTS_GRADES_FAIL,
} from "./actionTypes";

export const getGrades = course => ({
  type: GET_GRADES,
  payload: course,
});

export const getGradesSuccess = course => ({
  type: GET_GRADES_SUCCESS,
  payload: course,
});

export const getGradesFail = error => ({
  type: GET_GRADES_FAIL,
  payload: error,
});

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

export const updateGrade = grade => {
  return {
    type: UPDATE_GRADE,
    payload: grade,
  };
};

export const updateGradeSuccess = grade => ({
  type: UPDATE_GRADE_SUCCESS,
  payload: grade,
});

export const updateGradeFail = error => ({
  type: UPDATE_GRADE_FAIL,
  payload: error,
});

export const getCourseContentsGrades = courseContents_grades => ({
  type: GET_COURSE_CONTENTS_GRADES,
  payload: courseContents_grades,
});

export const getCourseContentsGradesSuccess = courseContents_grades => ({
  type: GET_COURSE_CONTENTS_GRADES_SUCCESS,
  payload: courseContents_grades,
});

export const getCourseContentsGradesFail = error => ({
  type: GET_COURSE_CONTENTS_GRADES_FAIL,
  payload: error,
});
