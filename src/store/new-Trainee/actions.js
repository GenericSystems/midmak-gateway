import {
  GET_TRAINEE_DELETED_VALUE,
  GET_TRAINEE_DELETED_VALUE_FAIL,
  GET_TRAINEE_DELETED_VALUE_SUCCESS,
  GET_TRAINEES,
  GET_TRAINEES_FAIL,
  GET_TRAINEES_SUCCESS,
  ADD_NEW_TRAINEE,
  ADD_TRAINEE_SUCCESS,
  ADD_TRAINEE_FAIL,
  UPDATE_TRAINEE,
  UPDATE_TRAINEE_SUCCESS,
  UPDATE_TRAINEE_FAIL,
  DELETE_TRAINEE,
  DELETE_TRAINEE_SUCCESS,
  DELETE_TRAINEE_FAIL,
  GET_TEMP_RELATIVES,
  GET_TEMP_RELATIVES_SUCCESS,
  GET_TEMP_RELATIVES_FAIL,
  GET_REGISTER_CERTIFICATES,
  GET_REGISTER_CERTIFICATES_SUCCESS,
  GET_REGISTER_CERTIFICATES_FAIL,
  GET_TRAINEE_DEFAULT_REGREQDOCS,
  GET_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS,
  GET_TRAINEE_DEFAULT_REGREQDOCS_FAIL,
  GET_SOCIAL_STATUS,
  GET_SOCIAL_STATUS_FAIL,
  GET_SOCIAL_STATUS_SUCCESS,
} from "./actionTypes";

export const getTrainees = trainees => ({
  type: GET_TRAINEES,
  payload: trainees,
});

export const getTraineesSuccess = trainees => ({
  type: GET_TRAINEES_SUCCESS,
  payload: trainees,
});

export const getTraineesFail = error => ({
  type: GET_TRAINEES_FAIL,
  payload: error,
});

export const getTraineeDeletedValue = () => ({
  type: GET_TRAINEE_DELETED_VALUE,
});

export const getTraineeDeletedValueSuccess = traineeProfile => ({
  type: GET_TRAINEE_DELETED_VALUE_SUCCESS,
  payload: traineeProfile,
});

export const getTraineeDeletedValueFail = error => ({
  type: GET_TRAINEE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTrainee = trainee => ({
  type: ADD_NEW_TRAINEE,
  payload: trainee,
});

export const addTraineeSuccess = trainee => ({
  type: ADD_TRAINEE_SUCCESS,
  payload: trainee,
});

export const addTraineeFail = error => ({
  type: ADD_TRAINEE_FAIL,
  payload: error,
});

export const updateTrainee = trainee => ({
  type: UPDATE_TRAINEE,
  payload: trainee,
});

export const updateTraineeSuccess = trainee => ({
  type: UPDATE_TRAINEE_SUCCESS,
  payload: trainee,
});

export const updateTraineeFail = error => ({
  type: UPDATE_TRAINEE_FAIL,
  payload: error,
});

export const deleteTrainee = trainee => ({
  type: DELETE_TRAINEE,
  payload: trainee,
});

export const deleteTraineeSuccess = trainee => ({
  type: DELETE_TRAINEE_SUCCESS,
  payload: trainee,
});

export const deleteTraineeFail = error => ({
  type: DELETE_TRAINEE_FAIL,
  payload: error,
});
export const getTraineeDefaultRegReqDocs = () => ({
  type: GET_TRAINEE_DEFAULT_REGREQDOCS,
});

export const getTraineeDefaultRegReqDocsSuccess = docs => ({
  type: GET_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS,
  payload: docs,
});

export const getTraineeDefaultRegReqDocsFail = error => ({
  type: GET_TRAINEE_DEFAULT_REGREQDOCS_FAIL,
  payload: error,
});
export const getTraineeTempRelatives = () => ({
  type: GET_TEMP_RELATIVES,
});
export const getTraineeTempRelativesSuccess = relatives => ({
  type: GET_TEMP_RELATIVES_SUCCESS,
  payload: relatives,
});
export const getTraineeTempRelativesFail = error => ({
  type: GET_TEMP_RELATIVES_FAIL,
  payload: error,
});

export const getRegisterCertificates = () => ({
  type: GET_REGISTER_CERTIFICATES,
});
export const getRegisterCertificatesSuccess = regcertificates => ({
  type: GET_REGISTER_CERTIFICATES_SUCCESS,
  payload: regcertificates,
});
export const getRegisterCertificatesFail = error => ({
  type: GET_REGISTER_CERTIFICATES_FAIL,
  payload: error,
});

export const getSocialStatus = socialStatus => ({
  type: GET_SOCIAL_STATUS,
  payload: socialStatus,
});

export const getSocialStatusSuccess = socialStatus => ({
  type: GET_SOCIAL_STATUS_SUCCESS,
  payload: socialStatus,
});

export const getSocialStatusFail = error => ({
  type: GET_SOCIAL_STATUS_FAIL,
  payload: error,
});
