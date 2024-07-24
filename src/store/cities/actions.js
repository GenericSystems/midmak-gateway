import {
  GET_CITIES,
  GET_CITIES_SUCCESS,
  GET_CITIES_FAIL,
  ADD_NEW_CITY,
  ADD_CITY_SUCCESS,
  ADD_CITY_FAIL,
  UPDATE_CITY,
  UPDATE_CITY_SUCCESS,
  UPDATE_CITY_FAIL,
  DELETE_CITY,
  DELETE_CITY_SUCCESS,
  DELETE_CITY_FAIL,
  GET_CITY_DELETED_VALUE,
  GET_CITY_DELETED_VALUE_FAIL,
  GET_CITY_DELETED_VALUE_SUCCESS,
  IMPORT_CITIES,
  IMPORT_CITIES_SUCCESS,
  IMPORT_CITIES_FAIL
} from "./actionTypes";
export const getCities = () => ({
  type: GET_CITIES,
});

export const getCitiesSuccess = cities => ({
  type: GET_CITIES_SUCCESS,
  payload: cities,
});

export const getCitiesFail = error => ({
  type: GET_CITIES_FAIL,
  payload: error,
});

export const addNewCity = city => ({
  type: ADD_NEW_CITY,
  payload: city,
});

export const addCitySuccess = city => ({
  type: ADD_CITY_SUCCESS,
  payload: city,
});

export const addCityFail = error => ({
  type: ADD_CITY_FAIL,
  payload: error,
});

export const importCities = nationality => ({
  type: IMPORT_CITIES,
  payload: nationality,
})

export const importCitiesSuccess = nationality => ({
  type: IMPORT_CITIES_SUCCESS,
  payload: nationality,
})

export const importCitiesFail = error => ({
  type: IMPORT_CITIES_FAIL,
  payload: error,
})


export const updateCity = city => {
  return {
    type: UPDATE_CITY,
    payload: city,
  };
};
export const updateCitySuccess = city => ({
  type: UPDATE_CITY_SUCCESS,
  payload: city,
});

export const updateCityFail = error => ({
  type: UPDATE_CITY_FAIL,
  payload: error,
});

export const deleteCity = city => ({
  type: DELETE_CITY,
  payload: city,
});

export const deleteCitySuccess = city => ({
  type: DELETE_CITY_SUCCESS,
  payload: city,
});

export const deleteCityFail = error => ({
  type: DELETE_CITY_FAIL,
  payload: error,
});

export const getCityDeletedValue = () => ({
  type: GET_CITY_DELETED_VALUE,
});


export const getCityDeletedValueSuccess = deleted => ({
  type: GET_CITY_DELETED_VALUE_SUCCESS,
  payload: deleted,
});


export const getCityDeletedValueFail = error => ({
  type: GET_CITY_DELETED_VALUE_FAIL,
  payload: error,
});

