import {
  GET_SECTOR_DELETED_VALUE,
  GET_SECTOR_DELETED_VALUE_FAIL,
  GET_SECTOR_DELETED_VALUE_SUCCESS,
  GET_SECTORS,
  GET_SECTORS_FAIL,
  GET_SECTORS_SUCCESS,
  ADD_NEW_SECTOR,
  ADD_SECTOR_SUCCESS,
  ADD_SECTOR_FAIL,
  UPDATE_SECTOR,
  UPDATE_SECTOR_SUCCESS,
  UPDATE_SECTOR_FAIL,
  DELETE_SECTOR,
  DELETE_SECTOR_SUCCESS,
  DELETE_SECTOR_FAIL,
} from "./actionTypes";

export const getSectors = sectors => ({
  type: GET_SECTORS,
  payload:sectors
});

export const getSectorsSuccess = sectors => ({
  type: GET_SECTORS_SUCCESS,
  payload: sectors,
});

export const getSectorsFail = error => ({
  type: GET_SECTORS_FAIL,
  payload: error,
});

export const getSectorDeletedValue = () => ({
  type: GET_SECTOR_DELETED_VALUE,
});

export const getSectorDeletedValueSuccess = SectorProfile => ({
  type: GET_SECTOR_DELETED_VALUE_SUCCESS,
  payload: SectorProfile,
});

export const getSectorDeletedValueFail = error => ({
  type: GET_SECTOR_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewSector = sector => ({
  type: ADD_NEW_SECTOR,
  payload: sector,
});

export const addSectorSuccess = sector => ({
  type: ADD_SECTOR_SUCCESS,
  payload: sector,
});

export const addSectorFail = error => ({
  type: ADD_SECTOR_FAIL,
  payload: error,
});

export const updateSector = sector => {
  return {
    type: UPDATE_SECTOR,
    payload: sector,
  };
};

export const updateSectorSuccess = sector => ({
  type: UPDATE_SECTOR_SUCCESS,
  payload: sector,
});

export const updateSectorFail = error => ({
  type: UPDATE_SECTOR_FAIL,
  payload: error,
});

export const deleteSector = sector => ({
  type: DELETE_SECTOR,
  payload: sector,
});

export const deleteSectorSuccess = sector => ({
  type: DELETE_SECTOR_SUCCESS,
  payload: sector,
});

export const deleteSectorFail = error => ({
  type: DELETE_SECTOR_FAIL,
  payload: error,
});
