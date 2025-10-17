import {
  GET_ABSENCES_TYPES_SUCCESS,
  GET_ABSENCES_TYPES_FAIL,
  ADD_ABSENCE_TYPE_SUCCESS,
  ADD_ABSENCE_TYPE_FAIL,
  UPDATE_ABSENCE_TYPE_SUCCESS,
  UPDATE_ABSENCE_TYPE_FAIL,
  DELETE_ABSENCE_TYPE_SUCCESS,
  DELETE_ABSENCE_TYPE_FAIL,
  GET_ABSENCE_TYPE_DELETED_VALUE_SUCCESS,
  GET_ABSENCE_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  absencesTypes: [],
  deleted: {},
  error: {},
};

const absencesTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ABSENCES_TYPES_SUCCESS:
      return {
        ...state,
        absencesTypes: action.payload,
      };

    case GET_ABSENCES_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ABSENCE_TYPE_SUCCESS:
      return {
        ...state,
        absencesTypes: [...state.absencesTypes, action.payload],
      };

    case ADD_ABSENCE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ABSENCE_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_ABSENCE_TYPE_SUCCESS:
      return {
        ...state,
        absencesTypes: state.absencesTypes.map(absenceType =>
          absenceType.Id.toString() === action.payload.Id.toString()
            ? { absenceType, ...action.payload }
            : absenceType
        ),
      };

    case UPDATE_ABSENCE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ABSENCE_TYPE_SUCCESS:
      return {
        ...state,
        absencesTypes: state.absencesTypes.filter(
          absenceType =>
            absenceType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ABSENCE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ABSENCE_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default absencesTypes;
