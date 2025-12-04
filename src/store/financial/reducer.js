import { GET_FINANCIALS_SUCCESS, GET_FINANCIALS_FAIL } from "./actionTypes";

const INIT_STATE = {
  financials: [],
  deleted: {},
  error: {},
};

const trainees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FINANCIALS_SUCCESS:
      return {
        ...state,
        financials: action.payload,
      };

    case GET_FINANCIALS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default trainees;
