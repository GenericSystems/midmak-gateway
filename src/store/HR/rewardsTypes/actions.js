import {
  GET_REWARD_TYPE_DELETED_VALUE,
  GET_REWARD_TYPE_DELETED_VALUE_FAIL,
  GET_REWARD_TYPE_DELETED_VALUE_SUCCESS,
  GET_REWARDS_TYPES,
  GET_REWARDS_TYPES_FAIL,
  GET_REWARDS_TYPES_SUCCESS,
  ADD_NEW_REWARD_TYPE,
  ADD_REWARD_TYPE_SUCCESS,
  ADD_REWARD_TYPE_FAIL,
  UPDATE_REWARD_TYPE,
  UPDATE_REWARD_TYPE_SUCCESS,
  UPDATE_REWARD_TYPE_FAIL,
  DELETE_REWARD_TYPE,
  DELETE_REWARD_TYPE_SUCCESS,
  DELETE_REWARD_TYPE_FAIL,
} from "./actionTypes";

export const getRewardsTypes = () => ({
  type: GET_REWARDS_TYPES,
});

export const getRewardsTypesSuccess = rewardsTypes => ({
  type: GET_REWARDS_TYPES_SUCCESS,
  payload: rewardsTypes,
});

export const getRewardsTypesFail = error => ({
  type: GET_REWARDS_TYPES_FAIL,
  payload: error,
});

export const getRewardTypeDeletedValue = () => ({
  type: GET_REWARD_TYPE_DELETED_VALUE,
});

export const getRewardTypeDeletedValueSuccess = rewardType => ({
  type: GET_REWARD_TYPE_DELETED_VALUE_SUCCESS,
  payload: rewardType,
});

export const getRewardTypeDeletedValueFail = error => ({
  type: GET_REWARD_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewRewardType = rewardType => ({
  type: ADD_NEW_REWARD_TYPE,
  payload: rewardType,
});

export const addRewardTypeSuccess = rewardType => ({
  type: ADD_REWARD_TYPE_SUCCESS,
  payload: rewardType,
});

export const addRewardTypeFail = error => ({
  type: ADD_REWARD_TYPE_FAIL,
  payload: error,
});

export const updateRewardType = rewardType => {
  return {
    type: UPDATE_REWARD_TYPE,
    payload: rewardType,
  };
};

export const updateRewardTypeSuccess = rewardType => ({
  type: UPDATE_REWARD_TYPE_SUCCESS,
  payload: rewardType,
});

export const updateRewardTypeFail = error => ({
  type: UPDATE_REWARD_TYPE_FAIL,
  payload: error,
});

export const deleteRewardType = rewardType => ({
  type: DELETE_REWARD_TYPE,
  payload: rewardType,
});

export const deleteRewardTypeSuccess = rewardType => ({
  type: DELETE_REWARD_TYPE_SUCCESS,
  payload: rewardType,
});

export const deleteRewardTypeFail = error => ({
  type: DELETE_REWARD_TYPE_FAIL,
  payload: error,
});
