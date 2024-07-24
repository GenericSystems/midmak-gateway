import {
  GET_DATA_ITEMS_SUCCESS,
  GET_DATA_ITEMS_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  dataconfig:{},
  dataitems: [],
  details:{},
  error: {},
}

const dataitems = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DATA_ITEMS_SUCCESS:
      return {
        ...state,
        dataitems: action.payload,
      }

    case GET_DATA_ITEMS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export default dataitems
