import {
  GET_TRAINING_MEMBERS_SUCCESS,
  GET_TRAINING_MEMBERS_FAIL,
  GET_FILTERED_MEMBERS_SUCCESS,
  GET_FILTERED_MEMBERS_FAIL,
  ADD_TRAINING_MEMBER_SUCCESS,
  ADD_TRAINING_MEMBER_FAIL,
  UPDATE_TRAINING_MEMBER_SUCCESS,
  UPDATE_TRAINING_MEMBER_FAIL,
  DELETE_TRAINING_MEMBER_SUCCESS,
  DELETE_TRAINING_MEMBER_FAIL,
  GET_TRAINING_MEMBER_DELETED_VALUE_SUCCESS,
  GET_TRAINING_MEMBER_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  trainingMembers: [],
  filteredMembers: [],
  deleted: {},
  error: {},
};

const trainingMembers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINING_MEMBERS_SUCCESS:
      return {
        ...state,
        trainingMembers: action.payload,
      };
    case GET_TRAINING_MEMBERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_FILTERED_MEMBERS_SUCCESS:
      return {
        ...state,
        filteredMembers: action.payload,
      };
    case GET_FILTERED_MEMBERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINING_MEMBER_SUCCESS:
      return {
        ...state,
        trainingMembers: [...state.trainingMembers, action.payload],
      };

    case ADD_TRAINING_MEMBER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINING_MEMBER_SUCCESS:
      return {
        ...state,
        trainingMembers: state.trainingMembers.map(trainer =>
          trainer.Id.toString() === action.payload.Id.toString()
            ? { trainer, ...action.payload }
            : trainer
        ),
      };

    case UPDATE_TRAINING_MEMBER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINING_MEMBER_SUCCESS:
      return {
        ...state,
        trainingMembers: state.trainingMembers.filter(
          trainer => trainer.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINING_MEMBER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINING_MEMBER_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_TRAINING_MEMBER_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default trainingMembers;
