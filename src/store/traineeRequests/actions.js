import {
  GET_TRAINEE_REQUESTS,
  GET_TRAINEE_REQUESTS_FAIL,
  GET_TRAINEE_REQUESTS_SUCCESS,
  ADD_NEW_TRAINEE_REQUEST,
  ADD_TRAINEE_REQUEST_SUCCESS,
  ADD_TRAINEE_REQUEST_FAIL,
  UPDATE_TRAINEE_REQUEST,
  UPDATE_TRAINEE_REQUEST_SUCCESS,
  UPDATE_TRAINEE_REQUEST_FAIL,
  DELETE_TRAINEE_REQUEST,
  DELETE_TRAINEE_REQUEST_SUCCESS,
  DELETE_TRAINEE_REQUEST_FAIL,
  GET_GRADE_TYPES,
  GET_GRADE_TYPES_SUCCESS,
  GET_GRADE_TYPES_FAIL,
  GET_FILTERED_COURSES_OBJECTION,
  GET_FILTERED_COURSES_OBJECTION_FAIL,
  GET_FILTERED_COURSES_OBJECTION_SUCCESS,
} from "./actionTypes";

export const getTraineeRequests = (lng, traineeId) => ({
  type: GET_TRAINEE_REQUESTS,
  payload: { lng, traineeId },
});

export const getTraineeRequestsSuccess = traineeRequests => ({
  type: GET_TRAINEE_REQUESTS_SUCCESS,
  payload: traineeRequests,
});

export const getTraineeRequestsFail = error => ({
  type: GET_TRAINEE_REQUESTS_FAIL,
  payload: error,
});

export const addNewTraineeRequest = TraineeRequest => ({
  type: ADD_NEW_TRAINEE_REQUEST,
  payload: TraineeRequest,
});

export const addTraineeRequestSuccess = TraineeRequest => ({
  type: ADD_TRAINEE_REQUEST_SUCCESS,
  payload: TraineeRequest,
});

export const addTraineeRequestFail = error => ({
  type: ADD_TRAINEE_REQUEST_FAIL,
  payload: error,
});

export const updateTraineeRequest = TraineeRequest => {
  return {
    type: UPDATE_TRAINEE_REQUEST,
    payload: TraineeRequest,
  };
};

export const updateTraineeRequestSuccess = TraineeRequest => ({
  type: UPDATE_TRAINEE_REQUEST_SUCCESS,
  payload: TraineeRequest,
});

export const updateTraineeRequestFail = error => ({
  type: UPDATE_TRAINEE_REQUEST_FAIL,
  payload: error,
});

export const deleteTraineeRequest = TraineeRequest => ({
  type: DELETE_TRAINEE_REQUEST,
  payload: TraineeRequest,
});

export const deleteTraineeRequestSuccess = TraineeRequest => ({
  type: DELETE_TRAINEE_REQUEST_SUCCESS,
  payload: TraineeRequest,
});

export const deleteTraineeRequestFail = error => ({
  type: DELETE_TRAINEE_REQUEST_FAIL,
  payload: error,
});

export const getGradeTypes = () => ({
  type: GET_GRADE_TYPES,
});

export const getGradeTypesSuccess = gradeTypes => ({
  type: GET_GRADE_TYPES_SUCCESS,
  payload: gradeTypes,
});

export const getGradeTypesFail = error => ({
  type: GET_GRADE_TYPES_FAIL,
  payload: error,
});

export const getFilteredCoursesObjection = marksObjection => ({
  type: GET_FILTERED_COURSES_OBJECTION,
  payload: marksObjection,
});

export const getFilteredCoursesObjectionSuccess = marksObjection => ({
  type: GET_FILTERED_COURSES_OBJECTION_SUCCESS,
  payload: marksObjection,
});

export const getFilteredCoursesObjectionFail = error => ({
  type: GET_FILTERED_COURSES_OBJECTION_FAIL,
  payload: error,
});
