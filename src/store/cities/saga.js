import { call, put, takeEvery } from "redux-saga/effects";
import {
GET_CITIES,
ADD_NEW_CITY,
DELETE_CITY,
UPDATE_CITY,
GET_CITY_DELETED_VALUE,
IMPORT_CITIES
} from "./actionTypes";
import {
getCitiesSuccess,
getCitiesFail,
addCityFail,
addCitySuccess,
updateCitySuccess,
updateCityFail,
deleteCitySuccess,
deleteCityFail,
getCityDeletedValueSuccess,
getCityDeletedValueFail,
importCitiesSuccess,
importCitiesFail,
} from "./actions";
import {
getCities,
addNewCity,
updateCity,
deleteCity,
importCities
} from "../../helpers/fakebackend_helper";
function* fetchCities() {
  const get_cities_req = {
      source: 'db',
      procedure: "SisApp_getData",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "settings_City"
      }  
  try {
    const response = yield call(getCities,get_cities_req)
      yield put(getCitiesSuccess(response))
      } catch (error) {
      yield put(getCitiesFail(error))
    }
  }
  
  function* onAddNewcity({ payload, city }) {
      delete payload["id"];
      payload["source"] = 'db';
      payload["procedure"] = 'SisApp_addData';
      payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
      payload["tablename"] = 'settings_City';
  try {
    const response = yield call(addNewCity, payload)
      yield put(addCitySuccess(response[0]))
  } catch (error) {
      yield put(addCityFail(error))
  }
  }

  function* onImportCities({ payload, nationality }) {
    delete payload["id"];
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_importFile';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_City';
    payload["field"] = "arTitle,enTitle";
  
    
    try {
      const response = yield call(importCities, payload)
      console.log("import resp",response)
      console.log("payload",payload)
      yield put(importCitiesSuccess(response))
    } catch (error) {
  
      yield put(importCitiesFail(error))
    }
  }

  function* onUpdateCity({ payload }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_updateData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_City';
  try {
      const respupdate = yield call(updateCity, payload)
      yield put(updateCitySuccess(respupdate[0]))
  } catch (error) {
  yield put(updateCityFail(error))
  }
  }
  function* onDeleteCity({ payload, city }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_City';
  try {
    const respdelete = yield call(deleteCity, payload)
    yield put(deleteCitySuccess(respdelete[0]))
  } catch (error) {
  yield put(deleteCityFail(error))
  }
  }

  function* onGetCityDeletedValue() {
    try {
      const response = yield call(getCityDeletedValue)
      yield put(getCityDeletedValueSuccess(response))
    } catch (error) {
      yield put(getCityDeletedValueFail(error))
    }
    
  }
  function* citiesSaga() {
  yield takeEvery(GET_CITIES, fetchCities)
  yield takeEvery(ADD_NEW_CITY, onAddNewcity)
  yield takeEvery(IMPORT_CITIES, onImportCities)
  yield takeEvery(UPDATE_CITY, onUpdateCity)
  yield takeEvery(DELETE_CITY, onDeleteCity)
  yield takeEvery(GET_CITY_DELETED_VALUE, onGetCityDeletedValue);
  }
  export default citiesSaga