import {
  GET_TEMP_TRAINEE_DELETED_VALUE,
  GET_TEMP_TRAINEE_DELETED_VALUE_FAIL,
  GET_TEMP_TRAINEE_DELETED_VALUE_SUCCESS,
  GET_TEMP_TRAINEES,
  GET_TEMP_TRAINEES_FAIL,
  GET_TEMP_TRAINEES_SUCCESS,
  ADD_NEW_TEMP_TRAINEE,
  ADD_TEMP_TRAINEE_SUCCESS,
  ADD_TEMP_TRAINEE_FAIL,
  UPDATE_TEMP_TRAINEE,
  UPDATE_TEMP_TRAINEE_SUCCESS,
  UPDATE_TEMP_TRAINEE_FAIL,
  DELETE_TEMP_TRAINEE,
  DELETE_TEMP_TRAINEE_SUCCESS,
  DELETE_TEMP_TRAINEE_FAIL,
  GET_REGISTER_CERTIFICATES,
  GET_REGISTER_CERTIFICATES_SUCCESS,
  GET_REGISTER_CERTIFICATES_FAIL,
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
  GENERATE_TEMP_TRAINEE,
  GENERATE_TEMP_TRAINEE_SUCCESS,
  GENERATE_TEMP_TRAINEE_FAIL,
  GET_TEMP_TRAINEE_BY_ID,
  GET_TEMP_TRAINEE_BY_ID_SUCCESS,
  GET_TEMP_TRAINEE_BY_ID_FAIL,
  GET_TEMP_TRAINEE_STATUS,
  GET_TEMP_TRAINEE_STATUS_FAIL,
  GET_TEMP_TRAINEE_STATUS_SUCCESS,
  GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS,
  GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS,
  GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_FAIL,
} from "./actionTypes";

export const getTempTrainees = tempTrainees => ({
  type: GET_TEMP_TRAINEES,
  payload: tempTrainees,
});

export const getTempTraineesSuccess = tempTrainees => ({
  type: GET_TEMP_TRAINEES_SUCCESS,
  payload: tempTrainees,
});

export const getTempTraineesFail = error => ({
  type: GET_TEMP_TRAINEES_FAIL,
  payload: error,
});

export const getTempTraineeDeletedValue = () => ({
  type: GET_TEMP_TRAINEE_DELETED_VALUE,
});

export const getTempTraineeDeletedValueSuccess = tempTraineeProfile => ({
  type: GET_TEMP_TRAINEE_DELETED_VALUE_SUCCESS,
  payload: tempTraineeProfile,
});

export const getTempTraineeDeletedValueFail = error => ({
  type: GET_TEMP_TRAINEE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTempTrainee = tempTrainee => ({
  type: ADD_NEW_TEMP_TRAINEE,
  payload: tempTrainee,
});

export const addTempTraineeSuccess = tempTrainee => ({
  type: ADD_TEMP_TRAINEE_SUCCESS,
  payload: tempTrainee,
});

export const addTempTraineeFail = error => ({
  type: ADD_TEMP_TRAINEE_FAIL,
  payload: error,
});

export const updateTempTrainee = tempTrainee => ({
  type: UPDATE_TEMP_TRAINEE,
  payload: tempTrainee,
});

export const updateTempTraineeSuccess = tempTrainee => ({
  type: UPDATE_TEMP_TRAINEE_SUCCESS,
  payload: tempTrainee,
});

export const updateTempTraineeFail = error => ({
  type: UPDATE_TEMP_TRAINEE_FAIL,
  payload: error,
});

export const deleteTempTrainee = tempTrainee => ({
  type: DELETE_TEMP_TRAINEE,
  payload: tempTrainee,
});

export const deleteTempTraineeSuccess = tempTrainee => ({
  type: DELETE_TEMP_TRAINEE_SUCCESS,
  payload: tempTrainee,
});

export const deleteTempTraineeFail = error => ({
  type: DELETE_TEMP_TRAINEE_FAIL,
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

export const addRequiredDocs = tempTrainee => ({
  type: ADD_REQUIRED_DOCS,
  payload: tempTrainee,
});

export const addRequiredDocsSuccess = tempTrainee => ({
  type: ADD_REQUIRED_DOCS_SUCCESS,
  payload: tempTrainee,
});

export const addRequiredDocsFail = error => ({
  type: ADD_REQUIRED_DOCS_FAIL,
  payload: error,
});

export const getTempTraineeById = tempTrainee => ({
  type: GET_TEMP_TRAINEE_BY_ID,
  payload: tempTrainee,
});

export const getTempTraineeByIdSuccess = tempTrainee => ({
  type: GET_TEMP_TRAINEE_BY_ID_SUCCESS,
  payload: tempTrainee,
});

export const getTempTraineeByIdFail = error => ({
  type: GET_TEMP_TRAINEE_BY_ID_FAIL,
  payload: error,
});

export const generateTempTrainee = tempTrainee => ({
  type: GENERATE_TEMP_TRAINEE,
  payload: tempTrainee,
});

export const generateTempTraineeSuccess = tempTrainee => ({
  type: GENERATE_TEMP_TRAINEE_SUCCESS,
  payload: tempTrainee,
});

export const generateTempTraineeFail = error => ({
  type: GENERATE_TEMP_TRAINEE_FAIL,
  payload: error,
});

export const getTempTraieeStatus = tempTraineeStatus => ({
  type: GET_TEMP_TRAINEE_STATUS,
  payload: tempTraineeStatus,
});

export const getTempTraineeStatusSuccess = tempTraineeStatus => ({
  type: GET_TEMP_TRAINEE_STATUS_SUCCESS,
  payload: tempTraineeStatus,
});

export const getTempTraineeStatusFail = error => ({
  type: GET_TEMP_TRAINEE_STATUS_FAIL,
  payload: error,
});

export const getTempTraineeDefaultRegReqDocs = docs => ({
  type: GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS,
  payload: docs,
});

export const getTempTraineeDefaultRegReqDocsSuccess = docs => ({
  type: GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS,
  payload: docs,
});

export const getTempTraineeDefaultRegReqDocsFail = error => ({
  type: GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_FAIL,
  payload: error,
});
