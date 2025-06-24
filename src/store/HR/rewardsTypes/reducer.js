import {
  GET_REWARDS_TYPES_SUCCESS,
  GET_REWARDS_TYPES_FAIL,
  ADD_REWARD_TYPE_SUCCESS,
  ADD_REWARD_TYPE_FAIL,
  UPDATE_REWARD_TYPE_SUCCESS,
  UPDATE_REWARD_TYPE_FAIL,
  DELETE_REWARD_TYPE_SUCCESS,
  DELETE_REWARD_TYPE_FAIL,
  GET_REWARD_TYPE_DELETED_VALUE_SUCCESS,
  GET_REWARD_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  rewardsTypes: [],
  deleted: {},
  error: {},
};

const rewardsTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REWARDS_TYPES_SUCCESS:
      return {
        ...state,
        rewardsTypes: action.payload,
      };

    case GET_REWARDS_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_REWARD_TYPE_SUCCESS:
      return {
        ...state,
        rewardsTypes: [...state.rewardsTypes, action.payload],
      };

    case ADD_REWARD_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REWARD_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_REWARD_TYPE_SUCCESS:
      return {
        ...state,
        rewardsTypes: state.rewardsTypes.map(rewardType =>
          rewardType.Id.toString() === action.payload.Id.toString()
            ? { rewardType, ...action.payload }
            : rewardType
        ),
      };

    case UPDATE_REWARD_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_REWARD_TYPE_SUCCESS:
      return {
        ...state,
        rewardsTypes: state.rewardsTypes.filter(
          rewardType =>
            rewardType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_REWARD_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REWARD_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default rewardsTypes;
