import {
  GET_CERTIFICATES,
  GET_CERTIFICATES_FAIL,
  GET_CERTIFICATES_SUCCESS,
  ADD_NEW_CERTIFICATE,
  ADD_CERTIFICATE_SUCCESS,
  ADD_CERTIFICATE_FAIL,
  UPDATE_CERTIFICATE,
  UPDATE_CERTIFICATE_SUCCESS,
  UPDATE_CERTIFICATE_FAIL,
  DELETE_CERTIFICATE,
  DELETE_CERTIFICATE_SUCCESS,
  DELETE_CERTIFICATE_FAIL,
  GET_CERTIFICATE_DELETED_VALUE,
  GET_CERTIFICATE_DELETED_VALUE_FAIL,
  GET_CERTIFICATE_DELETED_VALUE_SUCCESS,
  GET_FILTERED_COURSES_CERTIFICATES,
  GET_FILTERED_COURSES_CERTIFICATES_SUCCESS,
  GET_FILTERED_COURSES_CERTIFICATES_FAIL,
} from "./actionTypes";

export const getCertificates = certificates => ({
  type: GET_CERTIFICATES,
  payload: certificates,
});

export const getCertificatesSuccess = certificates => ({
  type: GET_CERTIFICATES_SUCCESS,
  payload: certificates,
});

export const getCertificatesFail = error => ({
  type: GET_CERTIFICATES_FAIL,
  payload: error,
});

export const addNewCertificate = certificate => ({
  type: ADD_NEW_CERTIFICATE,
  payload: certificate,
});

export const addCertificateSuccess = certificate => ({
  type: ADD_CERTIFICATE_SUCCESS,
  payload: certificate,
});

export const addCertificateFail = error => ({
  type: ADD_CERTIFICATE_FAIL,
  payload: error,
});

export const updateCertificate = certificate => {
  return {
    type: UPDATE_CERTIFICATE,
    payload: certificate,
  };
};

export const updateCertificateSuccess = certificate => ({
  type: UPDATE_CERTIFICATE_SUCCESS,
  payload: certificate,
});

export const updateCertificateFail = error => ({
  type: UPDATE_CERTIFICATE_FAIL,
  payload: error,
});

export const deleteCertificate = certificate => ({
  type: DELETE_CERTIFICATE,
  payload: certificate,
});

export const deleteCertificateSuccess = certificate => ({
  type: DELETE_CERTIFICATE_SUCCESS,
  payload: certificate,
});

export const deleteCertificateFail = error => ({
  type: DELETE_CERTIFICATE_FAIL,
  payload: error,
});

export const getCertificateDeletedValue = () => ({
  type: GET_CERTIFICATE_DELETED_VALUE,
});

export const getCertificateDeletedValueSuccess = deleted => ({
  type: GET_CERTIFICATE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCertificateDeletedValueFail = error => ({
  type: GET_CERTIFICATE_DELETED_VALUE_FAIL,
  payload: error,
});

export const getFilteredCoursesCertificates = traineeId => ({
  type: GET_FILTERED_COURSES_CERTIFICATES,
  payload: traineeId,
});

export const getFilteredCoursesCertificatesSuccess = trainee => ({
  type: GET_FILTERED_COURSES_CERTIFICATES_SUCCESS,
  payload: trainee,
});

export const getFilteredCoursesCertificatesFail = error => ({
  type: GET_FILTERED_COURSES_CERTIFICATES_FAIL,
  payload: error,
});
