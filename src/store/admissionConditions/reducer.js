import {
  GET_ADMISSION_CONDITIONS_SUCCESS,
  GET_ADMISSION_CONDITIONS_FAIL,
  ADD_ADMISSION_CONDITION_SUCCESS,
  ADD_ADMISSION_CONDITION_FAIL,
  UPDATE_ADMISSION_CONDITION_SUCCESS,
  UPDATE_ADMISSION_CONDITION_FAIL,
  DELETE_ADMISSION_CONDITION_SUCCESS,
  DELETE_ADMISSION_CONDITION_FAIL,
  GET_FILTERED_FACULTIES_SUCCESS,
  GET_FILTERED_FACULTIES_FAIL,
  GET_ADMISSION_CONDITION_DELETED_VALUE_SUCCESS,
  GET_ADMISSION_CONDITION_DELETED_VALUE_FAIL,
  COPY_ADMISSION_COND_SUCCESS,
  COPY_ADMISSION_COND_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  admissionConditions: [],
  filteredFaculties: [],
  deleted: {},
  error: {},
};

const admissionConditions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADMISSION_CONDITIONS_SUCCESS:
      return {
        ...state,
        admissionConditions: action.payload,
      };

    case GET_ADMISSION_CONDITIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ADMISSION_CONDITION_SUCCESS:
      return {
        ...state,
        admissionConditions: [...state.admissionConditions, action.payload],
      };

    case ADD_ADMISSION_CONDITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ADMISSION_CONDITION_SUCCESS:
      return {
        ...state,
        admissionConditions: state.admissionConditions.map(admissionCondition =>
          admissionCondition.Id.toString() === action.payload.Id.toString()
            ? { admissionCondition, ...action.payload }
            : admissionCondition
        ),
      };

    case UPDATE_ADMISSION_CONDITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ADMISSION_CONDITION_SUCCESS:
      return {
        ...state,
        admissionConditions: state.admissionConditions.filter(
          admissionCondition =>
            admissionCondition.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ADMISSION_CONDITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_FACULTIES_SUCCESS:
      return {
        ...state,
        filteredFaculties: action.payload,
      };
    case GET_FILTERED_FACULTIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ADMISSION_CONDITION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_ADMISSION_CONDITION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case COPY_ADMISSION_COND_SUCCESS:
      return {
        ...state,
        admissionConditions: action.payload,
      };

    case COPY_ADMISSION_COND_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default admissionConditions;
