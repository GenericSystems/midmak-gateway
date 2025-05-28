import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";
import { FormName } from "redux-form";
import { GET_DATA_ITEMS } from "./url_helper";

//pass new generated access token here
const token = accessToken;

//apply base url for axios
const API_URL = "https://www.keyinhands.com:5555";

const axiosApi = axios.create({
  baseURL: "",
});
const axiosApi_2 = axios.create({
  baseURL: API_URL,
});
axiosApi.defaults.headers.common["Authorization"] = token;
axiosApi_2.defaults.headers.common["Authorization"] = token;

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

axiosApi_2.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

async function getDataFromDb(url, config) {
  if (url == "/certificates1") {
    const data = {
      operation: "getData",
      tablename: "settings_certificates",
      fields: "*",
      limit: "1000",
      sorting: "artitle",
      filter: "",
      apikey: "test",
    };
    const fromNet = await axiosApi_2
      .post("/getData", { ...data }, { ...config })
      .then(response => response.data);
    // const fromNet = await axiosApi_2.get(url, { ...config }).then(response => response.data);
    console.log(fromNet);
    return fromNet;
  }
  return null;
}

async function getDataFromProcedure(url, dataconf, config = {}) {
  console.log("getting data from procedure ...");

  const fromNet = await axiosApi_2
    .post("/execProc", { ...dataconf }, { ...config })
    .then(response => response.data);
  return fromNet;
}

export async function get(url, config = {}) {
  console.log(url);
  if (url == "/orders1") {
    const data = {
      operation: "getData",
      tablename: "v_studentcourses",
      fields: "studentid, code",
      limit: "1000",
      sorting: "studentId",
      filter: "studentid = ''121010001''",
      apikey: "test",
    };
    const fromNet = await axiosApi_2
      .post("/getData", { ...data }, { ...config })
      .then(response => response.data);
    // const fromNet = await axiosApi_2.get(url, { ...config }).then(response => response.data);
    console.log(fromNet);
    return fromNet;
  }
  // fromNet = await getDataFromDb(url, config);
  //if (fromNet != null)
  //  return FormElements;
  //console.log(url,fromNet)
  const fromMock = await axiosApi
    .get(url, { ...config })
    .then(response => response.data);
  console.log("fromMock", fromMock);
  return fromMock;
}

export async function post(url, data, config = {}) {
  console.log("getting post ", url, data, config);
  if (data)
    if (data.source == "db") {
      const resp = getDataFromProcedure(url, data);
      console.log(resp);
      return resp;
    }
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data);
}

export { axiosApi, axiosApi_2, getDataFromProcedure };
