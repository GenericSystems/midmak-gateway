import { GET_LECTURES_SUCCESS, GET_LECTURES_FAIL } from "./actionTypes";

const INIT_STATE = {
  lectures: [],
  deleted: {},
  error: {},
};

const lectures = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LECTURES_SUCCESS:
      return {
        ...state,
        lectures: action.payload,
      };

    case GET_LECTURES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default lectures;
