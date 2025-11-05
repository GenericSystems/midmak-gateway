import {
  GET_CERTIFICATES_SUCCESS,
  GET_CERTIFICATES_FAIL,
  ADD_CERTIFICATE_SUCCESS,
  ADD_CERTIFICATE_FAIL,
  UPDATE_CERTIFICATE_SUCCESS,
  UPDATE_CERTIFICATE_FAIL,
  DELETE_CERTIFICATE_SUCCESS,
  DELETE_CERTIFICATE_FAIL,
  GET_CERTIFICATE_DELETED_VALUE_SUCCESS,
  GET_CERTIFICATE_DELETED_VALUE_FAIL,
  GET_FILTERED_COURSES_CERTIFICATES_SUCCESS,
  GET_FILTERED_COURSES_CERTIFICATES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  certificates: [],
  filteredCoursesTrainees: [],
  error: {},
};

const certificates = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CERTIFICATES_SUCCESS:
      return {
        ...state,
        certificates: action.payload,
        deleted: {},
      };

    case GET_CERTIFICATES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CERTIFICATE_SUCCESS:
      return {
        ...state,
        certificates: [...state.certificates, action.payload],
      };

    case ADD_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CERTIFICATE_SUCCESS:
      return {
        ...state,
        certificates: state.certificates.map(certificate =>
          certificate.Id.toString() === action.payload.Id.toString()
            ? { certificate, ...action.payload }
            : certificate
        ),
      };

    case UPDATE_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CERTIFICATE_SUCCESS:
      return {
        ...state,
        certificates: state.certificates.filter(
          certificate => certificate.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CERTIFICATE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_CERTIFICATE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_COURSES_CERTIFICATES_SUCCESS:
      return {
        ...state,
        filteredCoursesTrainees: action.payload,
      };
    case GET_FILTERED_COURSES_CERTIFICATES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default certificates;
