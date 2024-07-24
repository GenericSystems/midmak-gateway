import {
  GET_COUNTRY_DELETED_VALUE,
  GET_COUNTRY_DELETED_VALUE_FAIL,
  GET_COUNTRY_DELETED_VALUE_SUCCESS,
  GET_COUNTRIES,
  GET_COUNTRIES_FAIL,
  GET_COUNTRIES_SUCCESS,
  ADD_NEW_COUNTRY,
  ADD_COUNTRY_SUCCESS,
  ADD_COUNTRY_FAIL,
  UPDATE_COUNTRY,
  UPDATE_COUNTRY_SUCCESS,
  UPDATE_COUNTRY_FAIL,
  DELETE_COUNTRY,
  DELETE_COUNTRY_SUCCESS,
  DELETE_COUNTRY_FAIL,
  IMPORT_COUNTRIES,
  IMPORT_COUNTRIES_SUCCESS,
  IMPORT_COUNTRIES_FAIL
} from "./actionTypes";

export const getCountries = () => ({
  type: GET_COUNTRIES,
});

export const getCountriesSuccess = countries => ({
  type: GET_COUNTRIES_SUCCESS,
  payload: countries,
});

export const getCountriesFail = error => ({
  type: GET_COUNTRIES_FAIL,
  payload: error,
});

export const getCountryDeletedValue = () => ({
  type: GET_COUNTRY_DELETED_VALUE,
});

export const getCountryDeletedValueSuccess = deleted => ({
  type: GET_COUNTRY_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCountryDeletedValueFail = error => ({
  type: GET_COUNTRY_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewCountry = country => ({
  type: ADD_NEW_COUNTRY,
  payload: country,
});

export const addCountrySuccess = country => ({
  type: ADD_COUNTRY_SUCCESS,
  payload: country,
});

export const addCountryFail = error => ({
  type: ADD_COUNTRY_FAIL,
  payload: error,
});

export const importCountries = nationality => ({
  type: IMPORT_COUNTRIES,
  payload: nationality,
})

export const importCountriesSuccess = nationality => ({
  type: IMPORT_COUNTRIES_SUCCESS,
  payload: nationality,
})

export const importCountriesFail = error => ({
  type: IMPORT_COUNTRIES_FAIL,
  payload: error,
})

export const updateCountry = country => {
  return {
    type: UPDATE_COUNTRY,
    payload: country,
  };
};

export const updateCountrySuccess = country => ({
  type: UPDATE_COUNTRY_SUCCESS,
  payload: country,
});

export const updateCountryFail = error => ({
  type: UPDATE_COUNTRY_FAIL,
  payload: error,
});

export const deleteCountry = country => ({
  type: DELETE_COUNTRY,
  payload: country,
});

export const deleteCountrySuccess = country => ({
  type: DELETE_COUNTRY_SUCCESS,
  payload: country,
});

export const deleteCountryFail = error => ({
  type: DELETE_COUNTRY_FAIL,
  payload: error,
});
