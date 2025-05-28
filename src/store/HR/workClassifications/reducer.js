import {
  GET_WORK_CLASSIFICATIONS_SUCCESS,
  GET_WORK_CLASSIFICATIONS_FAIL,
  ADD_WORK_CLASSIFICATION_SUCCESS,
  ADD_WORK_CLASSIFICATION_FAIL,
  UPDATE_WORK_CLASSIFICATION_SUCCESS,
  UPDATE_WORK_CLASSIFICATION_FAIL,
  DELETE_WORK_CLASSIFICATION_SUCCESS,
  DELETE_WORK_CLASSIFICATION_FAIL,
  GET_WORK_CLASSIFICATION_DELETED_VALUE_SUCCESS,
  GET_WORK_CLASSIFICATION_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  workClassifications: [],
  deleted: {},
  error: {},
};

const workClassifications = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WORK_CLASSIFICATIONS_SUCCESS:
      return {
        ...state,
        workClassifications: action.payload,
      };

    case GET_WORK_CLASSIFICATIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_WORK_CLASSIFICATION_SUCCESS:
      return {
        ...state,
        workClassifications: [...state.workClassifications, action.payload],
      };

    case ADD_WORK_CLASSIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WORK_CLASSIFICATION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case UPDATE_WORK_CLASSIFICATION_SUCCESS:
      return {
        ...state,
        workClassifications: state.workClassifications.map(workClassification =>
          workClassification.Id.toString() === action.payload.Id.toString()
            ? { workClassification, ...action.payload }
            : workClassification
        ),
      };

    case UPDATE_WORK_CLASSIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_WORK_CLASSIFICATION_SUCCESS:
      return {
        ...state,
        workClassifications: state.workClassifications.filter(
          workClassification =>
            workClassification.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_WORK_CLASSIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WORK_CLASSIFICATION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default workClassifications;
