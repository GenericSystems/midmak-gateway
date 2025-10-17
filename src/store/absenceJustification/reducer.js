import {
  GET_ABSENCES_JUSTIFICATIONS_SUCCESS,
  GET_ABSENCES_JUSTIFICATIONS_FAIL,
  ADD_ABSENCE_JUSTIFICATION_SUCCESS,
  ADD_ABSENCE_JUSTIFICATION_FAIL,
  UPDATE_ABSENCE_JUSTIFICATION_SUCCESS,
  UPDATE_ABSENCE_JUSTIFICATION_FAIL,
  DELETE_ABSENCE_JUSTIFICATION_SUCCESS,
  DELETE_ABSENCE_JUSTIFICATION_FAIL,
  GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_SUCCESS,
  GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  absencesJustifications: [],
  deleted: {},
  error: {},
};

const absencesJustifications = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ABSENCES_JUSTIFICATIONS_SUCCESS:
      return {
        ...state,
        absencesJustifications: action.payload,
      };

    case GET_ABSENCES_JUSTIFICATIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ABSENCE_JUSTIFICATION_SUCCESS:
      return {
        ...state,
        absencesJustifications: [...state.absencesJustifications, action.payload],
      };

    case ADD_ABSENCE_JUSTIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_ABSENCE_JUSTIFICATION_SUCCESS:
      return {
        ...state,
        absencesJustifications: state.absencesJustifications.map(absenceJustification =>
          absenceJustification.Id.toString() === action.payload.Id.toString()
            ? { absenceJustification, ...action.payload }
            : absenceJustification
        ),
      };

    case UPDATE_ABSENCE_JUSTIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ABSENCE_JUSTIFICATION_SUCCESS:
      return {
        ...state,
        absencesJustifications: state.absencesJustifications.filter(
          absenceJustification =>
            absenceJustification.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ABSENCE_JUSTIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default absencesJustifications;
