import {
  GET_COURSE_DISTRIBUTIONS,
  GET_COURSE_DISTRIBUTIONS_SUCCESS,
  GET_COURSE_DISTRIBUTIONS_FAIL,
  GET_COURSE_DISTRIBUTION_DELETED_VALUE,
  GET_COURSE_DISTRIBUTION_DELETED_VALUE_SUCCESS,
  GET_COURSE_DISTRIBUTION_DELETED_VALUE_FAIL,
  ADD_NEW_COURSE_DISTRIBUTION,
  ADD_COURSE_DISTRIBUTION_SUCCESS,
  ADD_COURSE_DISTRIBUTION_FAIL,
  UPDATE_COURSE_DISTRIBUTION,
  UPDATE_COURSE_DISTRIBUTION_SUCCESS,
  UPDATE_COURSE_DISTRIBUTION_FAIL,
  DELETE_COURSE_DISTRIBUTION,
  DELETE_COURSE_DISTRIBUTION_SUCCESS,
  DELETE_COURSE_DISTRIBUTION_FAIL,
  COPY_COURSE_DISTRIBUTIONS,
  COPY_COURSE_DISTRIBUTIONS_SUCCESS,
  COPY_COURSE_DISTRIBUTIONS_FAIL,
} from "./actionTypes";

// Get All Course Distributions
export const getCourseDistributions = () => ({
  type: GET_COURSE_DISTRIBUTIONS,
});

export const getCourseDistributionsSuccess = courseDistributions => ({
  type: GET_COURSE_DISTRIBUTIONS_SUCCESS,
  payload: courseDistributions,
});

export const getCourseDistributionsFail = error => ({
  type: GET_COURSE_DISTRIBUTIONS_FAIL,
  payload: error,
});

// Get Deleted Course Distribution Value
export const getCourseDistributionDeletedValue = () => ({
  type: GET_COURSE_DISTRIBUTION_DELETED_VALUE,
});

export const getCourseDistributionDeletedValueSuccess =
  courseDistributionProfile => ({
    type: GET_COURSE_DISTRIBUTION_DELETED_VALUE_SUCCESS,
    payload: courseDistributionProfile,
  });

export const getCourseDistributionDeletedValueFail = error => ({
  type: GET_COURSE_DISTRIBUTION_DELETED_VALUE_FAIL,
  payload: error,
});

// Add New Course Distribution
export const addNewCourseDistribution = courseDistribution => ({
  type: ADD_NEW_COURSE_DISTRIBUTION,
  payload: courseDistribution,
});

export const addCourseDistributionSuccess = courseDistribution => ({
  type: ADD_COURSE_DISTRIBUTION_SUCCESS,
  payload: courseDistribution,
});

export const addCourseDistributionFail = error => ({
  type: ADD_COURSE_DISTRIBUTION_FAIL,
  payload: error,
});

// Update Course Distribution
export const updateCourseDistribution = courseDistribution => ({
  type: UPDATE_COURSE_DISTRIBUTION,
  payload: courseDistribution,
});

export const updateCourseDistributionSuccess = courseDistribution => ({
  type: UPDATE_COURSE_DISTRIBUTION_SUCCESS,
  payload: courseDistribution,
});

export const updateCourseDistributionFail = error => ({
  type: UPDATE_COURSE_DISTRIBUTION_FAIL,
  payload: error,
});

// Delete Course Distribution
export const deleteCourseDistribution = courseDistribution => ({
  type: DELETE_COURSE_DISTRIBUTION,
  payload: courseDistribution,
});

export const deleteCourseDistributionSuccess = courseDistribution => ({
  type: DELETE_COURSE_DISTRIBUTION_SUCCESS,
  payload: courseDistribution,
});

export const deleteCourseDistributionFail = error => ({
  type: DELETE_COURSE_DISTRIBUTION_FAIL,
  payload: error,
});

export const copyCourseDistributions = () => ({
  type: COPY_COURSE_DISTRIBUTIONS,
});

export const copyCourseDistributionsSuccess = distributingCoursesMethod => ({
  type: COPY_COURSE_DISTRIBUTIONS_SUCCESS,
  payload: distributingCoursesMethod,
});

export const copyCourseDistributionsFail = error => ({
  type: COPY_COURSE_DISTRIBUTIONS_FAIL,
  payload: error,
});
