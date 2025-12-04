import {
  GET_TRAINEES_SUCCESS,
  GET_TRAINEES_FAIL,
  GET_SOCIAL_STATUS_SUCCESS,
  GET_SOCIAL_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  trainees: [],
  socialStatus: [],
  deleted: {},
  error: {},
};

const trainees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEES_SUCCESS:
      return {
        ...state,
        trainees: action.payload,
      };

    case GET_TRAINEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SOCIAL_STATUS_SUCCESS:
      return {
        ...state,
        socialStatus: action.payload,
      };

    case GET_SOCIAL_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default trainees;
