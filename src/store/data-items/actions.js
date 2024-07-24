import {
  GET_DATA_ITEMS,
  GET_DATA_ITEMS_SUCCESS,
  GET_DATA_ITEMS_FAIL
} from "./actionTypes"

export const getDataItems = () => ({
  type: GET_DATA_ITEMS,
})

export const getDataItemsSuccess = items => ({
  type: GET_DATA_ITEMS_SUCCESS,
  payload: items,
})

export const getDataItemsFail = error => ({
  type: GET_DATA_ITEMS_FAIL,
  payload: error,
})
