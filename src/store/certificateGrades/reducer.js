import {
  GET_CERTIFICATE_GRADES_SUCCESS,
  GET_CERTIFICATE_GRADES_FAIL,
  GET_FILTERED_CERTIFICATE_GRADES_SUCCESS,
  GET_FILTERED_CERTIFICATE_GRADES_FAIL,
  ADD_CERTIFICATE_GRADE_SUCCESS,
  ADD_CERTIFICATE_GRADE_FAIL,
  UPDATE_CERTIFICATE_GRADE_SUCCESS,
  UPDATE_CERTIFICATE_GRADE_FAIL,
  DELETE_CERTIFICATE_GRADE_SUCCESS,
  DELETE_CERTIFICATE_GRADE_FAIL,
  GET_CERTIFICATE_GRADE_DELETED_VALUE_SUCCESS,
  GET_CERTIFICATE_GRADE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  certificateGrades: [],
  filteredCertificateGrades: [],
  error: {},
  deleted: {},
};

const certificateGrades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CERTIFICATE_GRADES_SUCCESS:
      return {
        ...state,
        certificateGrades: action.payload,
        deleted: {},
      };

    case GET_CERTIFICATE_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_CERTIFICATE_GRADES_SUCCESS:
      return {
        ...state,
        filteredCertificateGrades: action.payload,
        deleted: {},
      };

    case GET_FILTERED_CERTIFICATE_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CERTIFICATE_GRADE_SUCCESS:
      return {
        ...state,
        certificateGrades: [...state.certificateGrades, action.payload],
      };

    case ADD_CERTIFICATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CERTIFICATE_GRADE_SUCCESS:
      return {
        ...state,
        certificateGrades: state.certificateGrades.map(grade =>
          grade.Id.toString() === action.payload.Id.toString()
            ? { ...grade, ...action.payload }
            : grade
        ),
      };

    case UPDATE_CERTIFICATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CERTIFICATE_GRADE_SUCCESS:
      return {
        ...state,
        certificateGrades: state.certificateGrades.filter(
          grade => grade.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_CERTIFICATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CERTIFICATE_GRADE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_CERTIFICATE_GRADE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default certificateGrades;
