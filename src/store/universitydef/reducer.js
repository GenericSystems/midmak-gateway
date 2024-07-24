import {
  GET_UNIVERSITYINFO_SUCCESS,
  GET_UNIVERSITYINFO_FAIL,
  UPDATE_UNIVERSITYINFO_FAIL,
  UPDATE_UNIVERSITYINFO_SUCCESS,
  ADD_UNIVERSITYINFO_FAIL,
  ADD_UNIVERSITYINFO_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  universityInfo: [],
  error: {},
};

const universityInfo = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_UNIVERSITYINFO_SUCCESS:
      return {
        ...state,
        universityInfo: action.payload,
      };
    case GET_UNIVERSITYINFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_UNIVERSITYINFO_SUCCESS:
      return {
      ...state,
      universityInfo: state.universityInfo.map(uni =>
          uni.Id.toString() === action.payload.Id.toString()
              ? { uni, ...action.payload }
              : uni
      ),
  };
    case UPDATE_UNIVERSITYINFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_UNIVERSITYINFO_SUCCESS:
      return {
        ...state,
        universityInfo: [...state.universityInfo, action.payload],
      };

    case ADD_UNIVERSITYINFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default universityInfo;
