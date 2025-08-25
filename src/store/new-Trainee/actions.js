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
  ADD_NEW_PROFESSIONAL_EXPERIENCE,
  ADD_PROFESSIONAL_EXPERIENCE_SUCCESS,
  ADD_PROFESSIONAL_EXPERIENCE_FAIL,
  UPDATE_PROFESSIONAL_EXPERIENCE,
  UPDATE_PROFESSIONAL_EXPERIENCE_SUCCESS,
  UPDATE_PROFESSIONAL_EXPERIENCE_FAIL,
  DELETE_PROFESSIONAL_EXPERIENCE,
  DELETE_PROFESSIONAL_EXPERIENCE_SUCCESS,
  DELETE_PROFESSIONAL_EXPERIENCE_FAIL,
  ADD_REQUIRED_DOCS,
  ADD_REQUIRED_DOCS_FAIL,
  ADD_REQUIRED_DOCS_SUCCESS,
  GENERATE_TRAINEE,
  GENERATE_TRAINEE_SUCCESS,
  GENERATE_TRAINEE_FAIL,
  GET_TRAINEE_BY_ID,
  GET_TRAINEE_BY_ID_SUCCESS,
  GET_TRAINEE_BY_ID_FAIL,
  GET_TRAINEE_STATUS,
  GET_TRAINEE_STATUS_FAIL,
  GET_TRAINEE_STATUS_SUCCESS,
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
export const getTraineeDefaultRegReqDocs = docs => ({
  type: GET_TRAINEE_DEFAULT_REGREQDOCS,
  payload: docs,
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

export const addNewProfessionalExperience = profExper => ({
  type: ADD_NEW_PROFESSIONAL_EXPERIENCE,
  payload: profExper,
});

export const addProfessionalExperienceSuccess = profExper => ({
  type: ADD_PROFESSIONAL_EXPERIENCE_SUCCESS,
  payload: profExper,
});

export const addProfessionalExperienceFail = error => ({
  type: ADD_PROFESSIONAL_EXPERIENCE_FAIL,
  payload: error,
});

export const updateProfessionalExperience = profExper => ({
  type: UPDATE_PROFESSIONAL_EXPERIENCE,
  payload: profExper,
});

export const updateProfessionalExperienceSuccess = profExper => ({
  type: UPDATE_PROFESSIONAL_EXPERIENCE_SUCCESS,
  payload: profExper,
});

export const updateProfessionalExperienceFail = error => ({
  type: UPDATE_PROFESSIONAL_EXPERIENCE_FAIL,
  payload: error,
});

export const deleteProfessionalExperience = profExper => ({
  type: DELETE_PROFESSIONAL_EXPERIENCE,
  payload: profExper,
});

export const deleteProfessionalExperienceSuccess = profExper => ({
  type: DELETE_PROFESSIONAL_EXPERIENCE_SUCCESS,
  payload: profExper,
});

export const deleteProfessionalExperienceFail = error => ({
  type: DELETE_PROFESSIONAL_EXPERIENCE_FAIL,
  payload: error,
});

export const addRequiredDocs = trainee => ({
  type: ADD_REQUIRED_DOCS,
  payload: trainee,
});

export const addRequiredDocsSuccess = trainee => ({
  type: ADD_REQUIRED_DOCS_SUCCESS,
  payload: trainee,
});

export const addRequiredDocsFail = error => ({
  type: ADD_REQUIRED_DOCS_FAIL,
  payload: error,
});

export const getTraineeById = tempTrainee => ({
  type: GET_TRAINEE_BY_ID,
  payload: tempTrainee,
});

export const getTraineeByIdSuccess = tempTrainee => ({
  type: GET_TRAINEE_BY_ID_SUCCESS,
  payload: tempTrainee,
});

export const getTraineeByIdFail = error => ({
  type: GET_TRAINEE_BY_ID_FAIL,
  payload: error,
});

export const generateTrainee = trainee => ({
  type: GENERATE_TRAINEE,
  payload: trainee,
});

export const generateTraineeSuccess = trainee => ({
  type: GENERATE_TRAINEE_SUCCESS,
  payload: trainee,
});

export const generateTraineeFail = error => ({
  type: GENERATE_TRAINEE_FAIL,
  payload: error,
});

export const getTraieeStatus = traineeStatus => ({
  type: GET_TRAINEE_STATUS,
  payload: traineeStatus,
});

export const getTraieeStatusSuccess = traineeStatus => ({
  type: GET_TRAINEE_STATUS_SUCCESS,
  payload: traineeStatus,
});

export const getTraieeStatusFail = error => ({
  type: GET_TRAINEE_STATUS_FAIL,
  payload: error,
});
