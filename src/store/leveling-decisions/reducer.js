import {
  GET_LEVELING_DECISIONS_SUCCESS,
  GET_LEVELING_DECISIONS_FAIL,
  ADD_LEVELING_DECISION_SUCCESS,
  ADD_LEVELING_DECISION_FAIL,
  UPDATE_LEVELING_DECISION_SUCCESS,
  UPDATE_LEVELING_DECISION_FAIL,
  DELETE_LEVELING_DECISION_SUCCESS,
  DELETE_LEVELING_DECISION_FAIL,
  GET_LEVELING_DECISION_DETAILS_SUCCESS,
  GET_LEVELING_DECISION_DETAILS_FAIL,
  ADD_LEVELING_DECISION_DETAIL_SUCCESS,
  ADD_LEVELING_DECISION_DETAIL_FAIL,
  UPDATE_LEVELING_DECISION_DETAIL_SUCCESS,
  UPDATE_LEVELING_DECISION_DETAIL_FAIL,
  DELETE_LEVELING_DECISION_DETAIL_SUCCESS,
  DELETE_LEVELING_DECISION_DETAIL_FAIL,
  GET_LEVELING_DECISION_DELETED_VALUE_SUCCESS,
  GET_LEVELING_DECISION_DELETED_VALUE_FAIL,
  COPY_FACULTY_SUCCESS,
  COPY_FACULTY_FAIL,
  GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_SUCCESS,
GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  levelingDecisions: [],
  levelingDecisionDetails: [],
  deletedDetail:null,
  error: {},
};

const levelingDecisions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LEVELING_DECISIONS_SUCCESS:
      return {
        ...state,
        levelingDecisions: action.payload,
      };

    case GET_LEVELING_DECISIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_LEVELING_DECISION_SUCCESS:
      return {
        ...state,
        levelingDecisions: [...state.levelingDecisions, action.payload],
      };

    case ADD_LEVELING_DECISION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LEVELING_DECISION_SUCCESS:
      return {
        ...state,
        levelingDecisions: state.levelingDecisions.map(levelingDecision =>
          levelingDecision.Id.toString() === action.payload.Id.toString()
            ? { levelingDecision, ...action.payload }
            : levelingDecision
        ),
      };

    case UPDATE_LEVELING_DECISION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_LEVELING_DECISION_SUCCESS:
      return {
        ...state,
        levelingDecisions: state.levelingDecisions.filter(
          levelingDecision =>
            levelingDecision.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_LEVELING_DECISION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_LEVELING_DECISION_DETAILS_SUCCESS:
      return {
        ...state,
        levelingDecisionDetails: action.payload,
      };

    case GET_LEVELING_DECISION_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_LEVELING_DECISION_DETAIL_SUCCESS:
      return {
        ...state,
        levelingDecisionDetails: [
          ...state.levelingDecisionDetails,
          action.payload,
        ],
      };

    case ADD_LEVELING_DECISION_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LEVELING_DECISION_DETAIL_SUCCESS:
      return {
        ...state,
        levelingDecisionDetails: state.levelingDecisionDetails.map(
          levelingDecisionDetail =>
            levelingDecisionDetail.Id.toString() ===
            action.payload.Id.toString()
              ? { levelingDecisionDetail, ...action.payload }
              : levelingDecisionDetail
        ),
      };

    case UPDATE_LEVELING_DECISION_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_LEVELING_DECISION_DETAIL_SUCCESS:
      return {
        ...state,
        levelingDecisionDetails: state.levelingDecisionDetails.filter(
          levelingDecisionDetail =>
            levelingDecisionDetail.Id.toString() !==
            action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_LEVELING_DECISION_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case COPY_FACULTY_SUCCESS:
      return {
        ...state,
        levelingDecisionDetails: action.payload,
      };

    case COPY_FACULTY_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LEVELING_DECISION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_LEVELING_DECISION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deletedDetail: action.payload.deleted,
        }  

      case GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }
    default:
      return state;
  }
};

export default levelingDecisions;
