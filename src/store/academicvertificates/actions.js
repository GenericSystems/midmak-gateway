import {
  GET_ACADEMICCERTIFICATE_DELETED_VALUE,
  GET_ACADEMICCERTIFICATE_DELETED_VALUE_FAIL,
  GET_ACADEMICCERTIFICATE_DELETED_VALUE_SUCCESS,
  GET_ACADEMICCERTIFICATES,
  GET_ACADEMICCERTIFICATES_FAIL,
  GET_ACADEMICCERTIFICATES_SUCCESS,
  ADD_NEW_ACADEMICCERTIFICATES,
  ADD_ACADEMICCERTIFICATES_SUCCESS,
  ADD_ACADEMICCERTIFICATES_FAIL,
  UPDATE_ACADEMICCERTIFICATE,
  UPDATE_ACADEMICCERTIFICATE_SUCCESS,
  UPDATE_ACADEMICCERTIFICATE_FAIL,
  DELETE_ACADEMICCERTIFICATES,
  DELETE_ACADEMICCERTIFICATES_SUCCESS,
  DELETE_ACADEMICCERTIFICATES_FAIL,
  GET_FILTERED_ACADEMIC_CERTIFICATES,
  GET_FILTERED_ACADEMIC_CERTIFICATES_SUCCESS,
  GET_FILTERED_ACADEMIC_CERTIFICATES_FAIL,
} from "./actionTypes";

export const getAcademicCertificates = () => ({
  type: GET_ACADEMICCERTIFICATES,
});

export const getAcademicCertificatesSuccess = academiccertificate => ({
  type: GET_ACADEMICCERTIFICATES_SUCCESS,
  payload: academiccertificate,
});

export const getAcademicCertificatesFail = error => ({
  type: GET_ACADEMICCERTIFICATES_FAIL,
  payload: error,
});

export const getAcademicCertificateDeletedValue = () => ({
  type: GET_ACADEMICCERTIFICATE_DELETED_VALUE,
});



export const getAcademicCertificateDeletedValueSuccess =
  academiccertificateProfile => ({
    type: GET_ACADEMICCERTIFICATE_DELETED_VALUE_SUCCESS,
    payload: academiccertificateProfile,
  });

export const getAcademicCertificateDeletedValueFail = error => ({
  type: GET_ACADEMICCERTIFICATE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewAcademicCertificate = academiccertificate => ({
  type: ADD_NEW_ACADEMICCERTIFICATES,
  payload: academiccertificate,
});

export const addAcademicCertificateSuccess = academiccertificate => ({
  type: ADD_ACADEMICCERTIFICATES_SUCCESS,
  payload: academiccertificate,
});

export const addAcademicCertificateFail = error => ({
  type: ADD_ACADEMICCERTIFICATES_FAIL,
  payload: error,
});

export const updateAcademicCertificate = academiccertificate => {
  return {
    type: UPDATE_ACADEMICCERTIFICATE,
    payload: academiccertificate,
  };
};

export const updateAcademicCertificateSuccess = academiccertificate => ({
  type: UPDATE_ACADEMICCERTIFICATE_SUCCESS,
  payload: academiccertificate,
});

export const updateAcademicCertificateFail = error => ({
  type: UPDATE_ACADEMICCERTIFICATE_FAIL,
  payload: error,
});

export const deleteAcademicCertificate = academiccertificate => ({
  type: DELETE_ACADEMICCERTIFICATES,
  payload: academiccertificate,
});

export const deleteAcademicCertificateSuccess = academiccertificate => ({
  type: DELETE_ACADEMICCERTIFICATES_SUCCESS,
  payload: academiccertificate,
});

export const deleteAcademicCertificateFail = error => ({
  type: DELETE_ACADEMICCERTIFICATES_FAIL,
  payload: error,
});

export const getFilteredAcademicCertificates = academicCer => ({ 
  type: GET_FILTERED_ACADEMIC_CERTIFICATES,
  payload: academicCer,
});

export const getFilteredAcademicCertificatesSuccess = academicCer => ({
  type: GET_FILTERED_ACADEMIC_CERTIFICATES_SUCCESS,
  payload: academicCer,
});

export const getFilteredAcademicCertificatesFail = error => ({
  type: GET_FILTERED_ACADEMIC_CERTIFICATES_FAIL,
  payload: error,
});