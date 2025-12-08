import { GET_DECISIONS_SUCCESS, GET_DECISIONS_FAIL } from "./actionTypes";

const INIT_STATE = {
  decisions: [],
  deleted: {},
  error: {},
};

const decisions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DECISIONS_SUCCESS:
      return {
        ...state,
        decisions: action.payload,
      };

    case GET_DECISIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default decisions;
