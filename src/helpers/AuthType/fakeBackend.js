import { axiosApi } from "../api_helper";
import MockAdapter from "axios-mock-adapter";
import * as url from "../url_helper";
import accessToken from "../jwt-token-access/accessToken";
import {
  calenderDefaultCategories,
  cartData,
  chats,
  comments,
  contacts,
  lecturePeriods,
  coursesRegistration,
  generateSIDs,
  mobAppFacultyAccs,
  admissionConditions,
  Sectors,
  prereqs,
  studyPlans,
  preReqTypes,
  nationalities,
  cryptoOrders,
  customerData,
  events,
  groups,
  invoiceList,
  messages,
  orders,
  productsData,
  projects,
  recentProducts,
  shops,
  tasks,
  deleted,
  returnMessage,
  userProfile,
  inboxmails,
  starredmails,
  importantmails,
  draftmails,
  sentmails,
  trashmails,
  users as members,
  file,
  wallet,
  yearData,
  monthData,
  weekData,
  janTopSellingData,
  decTopSellingData,
  novTopSellingData,
  octTopSellingData,
  janEarningData,
  decEarningData,
  novEarningData,
  octEarningData,
  certificates,
  trainersGrades,
  certificatelevels,
  studentManagements,
  countries,
  grades,
  checked_grades,
  governorates,
  structures,
  currencies,
  documentsTypes,
  uniDocuments,
  regReqDocuments,
  AcademicCertificate,
  Course,
  estimates,
  admissionRequirements,
  coursecontents,
  courseTypes,
  levels,
  departments,
  grantSponsors,
  weekDays,
  timeLines,
} from "../../common/data";

let users = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "123456",
    email: "admin@keyinhands.com",
  },
];

const fakeBackend = () => {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axiosApi, { onNoMatch: "passthrough" });

  mock.onPost("/post-fake-register").reply(config => {
    const user = JSON.parse(config["data"]);
    users.push(user);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost("/post-db-login").reply(config => {
    const user = JSON.parse(config["data"]);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          resolve([200, validUser[0]]);
        } else {
          reject([
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });

  mock.onPost("/fake-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."]);
      });
    });
  });

  mock.onPost("/post-jwt-register").reply(config => {
    const user = JSON.parse(config["data"]);
    users.push(user);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost("/post-jwt-login").reply(config => {
    const user = JSON.parse(config["data"]);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;

          // JWT AccessToken
          const tokenObj = { accessToken: token }; // Token Obj
          const validUserObj = { ...validUser[0], ...tokenObj }; // validUser Obj

          resolve([200, validUserObj]);
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });

  mock.onPost("/post-jwt-profile").reply(config => {
    const user = JSON.parse(config["data"]);

    const one = config.headers;

    let finalToken = one.Authorization;

    const validUser = users.filter(usr => usr.uid === user.idx);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser["length"] === 1) {
            let objIndex;

            //Find index of specific object using findIndex method.
            objIndex = users.findIndex(obj => obj.uid === user.idx);

            //Update object's name property.
            users[objIndex].username = user.username;

            // Assign a value to locastorage
            localStorage.removeItem("authUser");
            localStorage.setItem("authUser", JSON.stringify(users[objIndex]));

            resolve([200, "Profile Updated successfully"]);
          } else {
            reject([400, "Something wrong for edit profile"]);
          }
        } else {
          reject([400, "Invalid Token !!"]);
        }
      });
    });
  });

  mock.onPost("/post-fake-profile").reply(config => {
    const user = JSON.parse(config["data"]);

    const validUser = users.filter(usr => usr.uid === user.idx);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          let objIndex;

          //Find index of specific object using findIndex method.
          objIndex = users.findIndex(obj => obj.uid === user.idx);

          //Update object's name property.
          users[objIndex].username = user.username;

          // Assign a value to locastorage
          localStorage.removeItem("authUser");
          localStorage.setItem("authUser", JSON.stringify(users[objIndex]));

          resolve([200, "Profile Updated successfully"]);
        } else {
          reject([400, "Something wrong for edit profile"]);
        }
      });
    });
  });

  mock.onPost("/jwt-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."]);
      });
    });
  });

  mock.onPost("/social-login").reply(config => {
    const user = JSON.parse(config["data"]);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.token) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;

          // JWT AccessToken
          const tokenObj = { accessToken: token }; // Token Obj
          const validUserObj = { ...user[0], ...tokenObj }; // validUser Obj

          resolve([200, validUserObj]);
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });


  mock.onGet(url.GET_USER_ID).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_PRODUCTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (productsData) {
          // Passing fake JSON data as response
          resolve([200, productsData]);
        } else {
          reject([400, "Cannot get products"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_PRODUCTS_DETAIL}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (productsData) {
          // Passing fake JSON data as response
          const { params } = config;
          const product = productsData.find(
            product => product.id.toString() === params.id
          );
          resolve([200, { ...product, recentProducts, comments }]);
        } else {
          reject([400, "Cannot get product detail"]);
        }
      });
    });
  });

  mock.onGet(url.GET_EVENTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (events) {
          // Passing fake JSON data as response
          resolve([200, events]);
        } else {
          reject([400, "Cannot get events"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_EVENT).reply(event => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        } else {
          reject([400, "Cannot add event"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_USER).reply(user => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.data) {
          // Passing fake JSON data as response
          resolve([200, user.data]);
        } else {
          reject([400, "Cannot add user"]);
        }
      });
    });
  });

  mock.onGet(url.GET_COUNTRY_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_FEES_DEFINITION_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_SCHEDULE_MSG_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (returnMessage) {
          // Passing fake JSON data as response
          resolve([200, returnMessage]);
        } else {
          reject([400, "Cannot get returnMessage"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_CERTIFICATE).reply(certificate => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (certificate && certificate.data) {
          // Passing fake JSON data as response
          resolve([200, certificate.data]);
        } else {
          reject([400, "Cannot add certificate"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_NATIONALITY).reply(nationality => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nationality && nationality.data) {
          // Passing fake JSON data as response
          resolve([200, nationality.data]);
        } else {
          reject([400, "Cannot add nationality"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_USER).reply(user => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.data) {
          // Passing fake JSON data as response
          resolve([200, user.data]);
        } else {
          reject([400, "Cannot update user"]);
        }
      });
    });
  });

  // Country
  mock.onGet(url.GET_COUNTRIES).reply(() => {
    console.log("Calling mock get countries");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (countries) {
          // Passing fake JSON data as response
          resolve([200, countries]);
        } else {
          reject([400, "Cannot get countries"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_COUNTRY).reply(country => {
    console.log("in mock onPut reply updating ...", country);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated country");
        if (country && country.data) {
          // Passing fake JSON data as response
          resolve([200, country.data]);
        } else {
          reject([400, "Cannot update country"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_COUNTRY).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted country");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.country]);
        } else {
          reject([400, "Cannot delete country"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_COUNTRY).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added country");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Cities
  mock.onGet(url.GET_CITIES).reply(() => {
    console.log("Calling mock get cities");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cities) {
          // Passing fake JSON data as response
          resolve([200, cities]);
        } else {
          reject([400, "Cannot get cities"]);
        }
      });
    });
  });
  mock.onPut(url.UPDATE_CITY).reply(city => {
    console.log("in mock onPut reply updating ...", city);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated city");
        if (city && city.data) {
          // Passing fake JSON data as response
          resolve([200, city.data]);
        } else {
          reject([400, "Cannot update city"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_CITY).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted city");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.city]);
        } else {
          reject([400, "Cannot delete city"]);
        }
      });
    });
  });
  mock.onPost(url.ADD_NEW_CITY).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added city");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });
  // Genders

  mock.onGet(url.GET_GENDERS).reply(() => {
    console.log("Calling mock get genders");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (genders) {
          // Passing fake JSON data as response
          resolve([200, genders]);
        } else {
          reject([400, "Cannot get genders"]);
        }
      });
    });
  });
  mock.onPut(url.UPDATE_GENDER).reply(gender => {
    console.log("in mock onPut reply updating ...", gender);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated gender");
        if (gender && gender.data) {
          // Passing fake JSON data as response
          resolve([200, gender.data]);
        } else {
          reject([400, "Cannot update gender"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_GENDER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted gender");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.gender]);
        } else {
          reject([400, "Cannot delete gender"]);
        }
      });
    });
  });
  mock.onPost(url.ADD_NEW_GENDER).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added gender");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Prerequisites
  mock.onGet(url.GET_PREREQS).reply(() => {
    console.log("Calling mock get prereqs");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (prereqs) {
          // Passing fake JSON data as response
          resolve([200, prereqs]);
        } else {
          reject([400, "Cannot get prereqs"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_PREREQ).reply(prereq => {
    console.log("in mock onPut reply updating ...", prereq);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated prereq");
        if (prereq && prereq.data) {
          // Passing fake JSON data as response
          resolve([200, prereq.data]);
        } else {
          reject([400, "Cannot update prereq"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_PREREQ).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted prereq");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.prereq]);
        } else {
          reject([400, "Cannot delete prereq"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_PREREQ).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added prereq");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Governorate
  mock.onGet(url.GET_GOVERNORATES).reply(() => {
    console.log("Calling mock get governorates");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (governorates) {
          // Passing fake JSON data as response
          resolve([200, governorates]);
        } else {
          reject([400, "Cannot get governorates"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_GOVERNORATE).reply(governorate => {
    console.log("in mock onPut reply updating ...", governorate);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated governorate");
        if (governorate && governorate.data) {
          // Passing fake JSON data as response
          resolve([200, governorate.data]);
        } else {
          reject([400, "Cannot update governorate"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_GOVERNORATE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted governorate");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.governorate]);
        } else {
          reject([400, "Cannot delete governorate"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_GOVERNORATE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added governorate");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Structure
  mock.onGet(url.GET_STRUCTURES).reply(() => {
    console.log("Calling mock get structures");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (structures) {
          // Passing fake JSON data as response
          resolve([200, structures]);
        } else {
          reject([400, "Cannot get structures"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_STRUCTURE).reply(structure => {
    console.log("in mock onPut reply updating ...", structure);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated structure");
        if (structure && structure.data) {
          // Passing fake JSON data as response
          resolve([200, structure.data]);
        } else {
          reject([400, "Cannot update structure"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_STRUCTURE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted structure");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.structure]);
        } else {
          reject([400, "Cannot delete structure"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_STRUCTURE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added structure");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Currency
  mock.onGet(url.GET_CURRENCIES).reply(() => {
    console.log("Calling mock get currencies");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currencies) {
          // Passing fake JSON data as response
          resolve([200, currencies]);
        } else {
          reject([400, "Cannot get currencies"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_CURRENCY).reply(currency => {
    console.log("in mock onPut reply updating ...", currency);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated currency");
        if (currency && currency.data) {
          // Passing fake JSON data as response
          resolve([200, currency.data]);
        } else {
          reject([400, "Cannot update currency"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_CURRENCY).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted currency");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.currency]);
        } else {
          reject([400, "Cannot delete currency"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_CURRENCY).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added currency");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Certificate
  mock.onGet(url.GET_CERTIFICATES).reply(() => {
    console.log("Calling mock get certificates");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (certificates) {
          // Passing fake JSON data as response
          resolve([200, certificates]);
        } else {
          reject([400, "Cannot get certificates"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_CERTIFICATE).reply(certificate => {
    console.log("in mock onPut reply updating ...", certificate);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated certificate");
        if (certificate && certificate.data) {
          // Passing fake JSON data as response
          resolve([200, certificate.data]);
        } else {
          reject([400, "Cannot update certificate"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_CERTIFICATE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted certificate");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.certificate]);
        } else {
          reject([400, "Cannot delete certificate"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_CERTIFICATE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added certificate");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // LecturePeriod
  mock.onGet(url.GET_LECTURE_PERIODS).reply(() => {
    console.log("Calling mock get lecturePeriods");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lecturePeriods) {
          // Passing fake JSON data as response
          resolve([200, lecturePeriods]);
        } else {
          reject([400, "Cannot get lecturePeriods"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_LECTURE_PERIOD).reply(lecturePeriod => {
    console.log("in mock onPut reply updating ...", lecturePeriod);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated lecturePeriod");
        if (lecturePeriod && lecturePeriod.data) {
          // Passing fake JSON data as response
          resolve([200, lecturePeriod.data]);
        } else {
          reject([400, "Cannot update lecturePeriod"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_LECTURE_PERIOD).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted lecturePeriod");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.lecturePeriod]);
        } else {
          reject([400, "Cannot delete lecturePeriod"]);
        }
      });
    });
  });

  // CoursesRegistration
  mock.onGet(url.GET_COURSES_REGISTRATIONS).reply(() => {
    console.log("Calling mock get coursesRegistration");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (coursesRegistration) {
          // Passing fake JSON data as response
          resolve([200, coursesRegistration]);
        } else {
          reject([400, "Cannot get coursesRegistration"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_COURSES_REGISTRATION).reply(coursesRegistration => {
    console.log("in mock onPut reply updating ...", coursesRegistration);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated coursesRegistration");
        if (coursesRegistration && coursesRegistration.data) {
          // Passing fake JSON data as response
          resolve([200, coursesRegistration.data]);
        } else {
          reject([400, "Cannot update coursesRegistration"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_COURSES_REGISTRATION).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted coursesRegistration");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.coursesRegistration]);
        } else {
          reject([400, "Cannot delete coursesRegistration"]);
        }
      });
    });
  });

  // GenerateSID
  mock.onGet(url.GET_GENERATE_SIDS).reply(() => {
    console.log("Calling mock get generateSIDs");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (generateSIDs) {
          // Passing fake JSON data as response
          resolve([200, generateSIDs]);
        } else {
          reject([400, "Cannot get generateSIDs"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_GENERATE_SID).reply(generateSID => {
    console.log("in mock onPut reply updating ...", generateSID);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated generateSID");
        if (generateSID && generateSID.data) {
          // Passing fake JSON data as response
          resolve([200, generateSID.data]);
        } else {
          reject([400, "Cannot update generateSID"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_GENERATE_SID).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted generateSID");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.generateSID]);
        } else {
          reject([400, "Cannot delete generateSID"]);
        }
      });
    });
  });

  // General Management
  mock.onGet(url.GET_GENERAL_MANAGEMENTS).reply(() => {
    console.log("Calling mock get generalManagements");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (generalManagements) {
          // Passing fake JSON data as response
          resolve([200, generalManagements]);
        } else {
          reject([400, "Cannot get generalManagements"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_GENERAL_MANAGEMENT).reply(generalManagement => {
    console.log("in mock onPut reply updating ...", generalManagement);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated generalManagement");
        if (generalManagement && generalManagement.data) {
          // Passing fake JSON data as response
          resolve([200, generalManagement.data]);
        } else {
          reject([400, "Cannot update generalManagement"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_GENERAL_MANAGEMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted generalManagement");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.generalManagement]);
        } else {
          reject([400, "Cannot delete generalManagement"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_GENERAL_MANAGEMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added generalManagement");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_LECTURE_PERIOD).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added lecturePeriod");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // departments
  mock.onGet(url.GET_DEPARTMENTS).reply(() => {
    console.log("Calling mock get departments");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (departments) {
          // Passing fake JSON data as response
          resolve([200, departments]);
        } else {
          reject([400, "Cannot get departments"]);
        }
      });
    });
  });

  // faculties
  mock.onGet(url.GET_FACULTIES).reply(() => {
    console.log("Calling mock get faculties");
    return new Promise((resolve, reject) => {});
  });
  // mobAppFacultyAcc
  mock.onGet(url.GET_MOB_APP_FACULTY_ACCS).reply(() => {
    console.log("Calling mock get mobAppFacultyAccs");
    return new Promise((resolve, reject) => {});
  });

  mock.onPut(url.UPDATE_MOB_APP_FACULTY_ACC).reply(mobAppFacultyAcc => {
    console.log("in mock onPut reply updating ...", mobAppFacultyAcc);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated mobAppFacultyAcc");
        if (mobAppFacultyAcc && mobAppFacultyAcc.data) {
          // Passing fake JSON data as response
          resolve([200, mobAppFacultyAcc.data]);
        } else {
          reject([400, "Cannot update mobAppFacultyAcc"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_MOB_APP_FACULTY_ACC).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted mobAppFacultyAcc");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.mobAppFacultyAcc]);
        } else {
          reject([400, "Cannot delete mobAppFacultyAcc"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_MOB_APP_FACULTY_ACC).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added mobAppFacultyAcc");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // admissionCondition
  mock.onGet(url.GET_ADMISSION_CONDITIONS).reply(() => {
    console.log("Calling mock get admissionConditions");
    return new Promise((resolve, reject) => {});
  });

  mock.onPut(url.UPDATE_ADMISSION_CONDITION).reply(admissionCondition => {
    console.log("in mock onPut reply updating ...", admissionCondition);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated admissionCondition");
        if (admissionCondition && admissionCondition.data) {
          // Passing fake JSON data as response
          resolve([200, admissionCondition.data]);
        } else {
          reject([400, "Cannot update admissionCondition"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_ADMISSION_CONDITION).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted admissionCondition");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.admissionCondition]);
        } else {
          reject([400, "Cannot delete admissionCondition"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ADMISSION_CONDITION).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added admissionCondition");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Sector
  mock.onGet(url.GET_SECTORS).reply(() => {
    console.log("Calling mock get sectors");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sectors) {
          // Passing fake JSON data as response
          resolve([200, sectors]);
        } else {
          reject([400, "Cannot get sectors"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_SECTOR).reply(sector => {
    console.log("in mock onPut reply updating ...", sector);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated sector");
        if (sector && sector.data) {
          // Passing fake JSON data as response
          resolve([200, sector.data]);
        } else {
          reject([400, "Cannot update sector"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_SECTOR).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted sector");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.sector]);
        } else {
          reject([400, "Cannot delete sector"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SECTOR).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added sector");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // PreReqType
  mock.onGet(url.GET_REQUIREMENT_TYPES).reply(() => {
    console.log("Calling mock get preReqTypes");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (preReqTypes) {
          // Passing fake JSON data as response
          resolve([200, preReqTypes]);
        } else {
          reject([400, "Cannot get preReqTypes"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_REQUIREMENT_TYPE).reply(preReqType => {
    console.log("in mock onPut reply updating ...", preReqType);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated preReqType");
        if (preReqType && preReqType.data) {
          // Passing fake JSON data as response
          resolve([200, preReqType.data]);
        } else {
          reject([400, "Cannot update preReqType"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_REQUIREMENT_TYPE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted preReqType");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.preReqType]);
        } else {
          reject([400, "Cannot delete preReqType"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_REQUIREMENT_TYPE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added preReqType");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });


  mock.onPut(url.UPDATE_STUDY_PLAN).reply(studyPlan => {
    console.log("in mock onPut reply updating ...", studyPlan);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated studyPlan");
        if (studyPlan && studyPlan.data) {
          // Passing fake JSON data as response
          resolve([200, studyPlan.data]);
        } else {
          reject([400, "Cannot update studyPlan"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_STUDY_PLAN).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted studyPlan");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.studyPlan]);
        } else {
          reject([400, "Cannot delete studyPlan"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_STUDY_PLAN).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added studyPlan");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // PreReqType
  mock.onGet(url.GET_REQUIREMENT_TYPES).reply(() => {
    console.log("Calling mock get preReqTypes");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (preReqTypes) {
          // Passing fake JSON data as response
          resolve([200, preReqTypes]);
        } else {
          reject([400, "Cannot get preReqTypes"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_REQUIREMENT_TYPE).reply(preReqType => {
    console.log("in mock onPut reply updating ...", preReqType);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated preReqType");
        if (preReqType && preReqType.data) {
          // Passing fake JSON data as response
          resolve([200, preReqType.data]);
        } else {
          reject([400, "Cannot update preReqType"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_REQUIREMENT_TYPE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted preReqType");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.preReqType]);
        } else {
          reject([400, "Cannot delete preReqType"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_REQUIREMENT_TYPE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added preReqType");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // DOCUMENT
  mock.onGet(url.GET_DOCUMENTS).reply(() => {
    console.log("Calling mock get documents");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (documentsTypes) {
          // Passing fake JSON data as response
          resolve([200, documentsTypes]);
        } else {
          reject([400, "Cannot get documents"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_DOCUMENT).reply(document => {
    console.log("in mock onPut reply updating ...", document);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated document");
        if (document && document.data) {
          // Passing fake JSON data as response
          resolve([200, document.data]);
        } else {
          reject([400, "Cannot update document"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_DOCUMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted document");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.document]);
        } else {
          reject([400, "Cannot delete document"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_DOCUMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added document");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // UNI_DOCUMENT
  mock.onGet(url.GET_UNI_DOCUMENTS).reply(() => {
    console.log("Calling mock get documents");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (uniDocuments) {
          // Passing fake JSON data as response
          resolve([200, uniDocuments]);
        } else {
          reject([400, "Cannot get documents"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_UNI_DOCUMENT).reply(document => {
    console.log("in mock onPut reply updating ...", document);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated document");
        if (document && document.data) {
          // Passing fake JSON data as response
          resolve([200, document.data]);
        } else {
          reject([400, "Cannot update document"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_UNI_DOCUMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted document");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.document]);
        } else {
          reject([400, "Cannot delete document"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_UNI_DOCUMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added document");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  //REG REQ DOCUMENT
  mock.onGet(url.GET_REG_REQ_DOCUMENTS).reply(() => {
    console.log("Calling mock get documents");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (regReqDocuments) {
          // Passing fake JSON data as response
          resolve([200, regReqDocuments]);
        } else {
          reject([400, "Cannot get documents"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_REG_REQ_DOCUMENT).reply(regReqdocument => {
    console.log("in mock onPut reply updating ...", regReqdocument);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated document");
        if (regReqdocument && regReqdocument.data) {
          // Passing fake JSON data as response
          resolve([200, regReqdocument.data]);
        } else {
          reject([400, "Cannot update regReqdocument"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_REG_REQ_DOCUMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted regReqdocument");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.regReqdocument]);
        } else {
          reject([400, "Cannot delete regReqdocument"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_REG_REQ_DOCUMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added regReqdocument");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // CourseContents
  mock.onGet(url.GET_COURSE_CONTENTS).reply(() => {
    console.log("Calling mock get CourseContent");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (coursecontents) {
          // Passing fake JSON data as response
          resolve([200, coursecontents]);
        } else {
          reject([400, "Cannot get CourseContent"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_COURSE_CONTENT).reply(courseContent => {
    console.log("in mock onPut reply updating ...", courseContent);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated courseContent");
        if (courseContent && courseContent.data) {
          // Passing fake JSON data as response
          resolve([200, courseContent.data]);
        } else {
          reject([400, "Cannot update courseContent"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_COURSE_CONTENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted courseContent");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.courseContent]);
        } else {
          reject([400, "Cannot delete courseContent"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_COURSE_CONTENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added courseContent");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_COURSE_CONTENT).reply(courseContent => {
    console.log("MOCK: add new courseContent ...:", courseContent);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (courseContent && courseContent.data) {
          // Passing fake JSON data as response
          courseContent.push(courseContent.data);
          resolve([200, courseContent.data]);
        } else {
          reject([400, "Cannot add courseContent"]);
        }
      });
    });
  });

  // UNI_DOCUMENT
  mock.onGet(url.GET_UNI_DOCUMENTS).reply(() => {
    console.log("Calling mock get documents");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (uniDocuments) {
          // Passing fake JSON data as response
          resolve([200, uniDocuments]);
        } else {
          reject([400, "Cannot get documents"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_UNI_DOCUMENT).reply(document => {
    console.log("in mock onPut reply updating ...", document);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated document");
        if (document && document.data) {
          // Passing fake JSON data as response
          resolve([200, document.data]);
        } else {
          reject([400, "Cannot update document"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_UNI_DOCUMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted document");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.document]);
        } else {
          reject([400, "Cannot delete document"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_UNI_DOCUMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added document");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Academiccertificate
  mock.onGet(url.GET_ACADEMICCERTIFICATES).reply(() => {
    console.log("Calling mock get AcademicCertificate");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (AcademicCertificate) {
          // Passing fake JSON data as response
          resolve([200, AcademicCertificate]);
        } else {
          reject([400, "Cannot get AcademicCertificate"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_ACADEMICCERTIFICATE).reply(academiccertificate => {
    console.log("in mock onPut reply updating ...", academiccertificate);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated academiccertificate");
        if (academiccertificate && academiccertificate.data) {
          // Passing fake JSON data as response
          resolve([200, academiccertificate.data]);
        } else {
          reject([400, "Cannot update academiccertificate"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_ACADEMICCERTIFICATE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted academiccertificate");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.academiccertificate]);
        } else {
          reject([400, "Cannot delete academiccertificate"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ACADEMICCERTIFICATE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added academiccertificate");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ACADEMICCERTIFICATE).reply(academiccertificate => {
    console.log("MOCK: add new academiccertificate ...:", academiccertificate);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (academiccertificate && academiccertificate.data) {
          // Passing fake JSON data as response
          AcademicCertificate.push(academiccertificate.data);
          resolve([200, academiccertificate.data]);
        } else {
          reject([400, "Cannot add academiccertificate"]);
        }
      });
    });
  });

  //courses
  mock.onGet(url.GET_COURSES).reply(() => {
    console.log("Calling mock get Course");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Course) {
          // Passing fake JSON data as response
          resolve([200, Course]);
        } else {
          reject([400, "Cannot get Course"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_COURSE).reply(Course => {
    console.log("in mock onPut reply updating ...", Course);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated COURSE");
        if (Course && Course.data) {
          // Passing fake JSON data as response
          resolve([200, Course.data]);
        } else {
          reject([400, "Cannot update Course"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_COURSE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted Course");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.Course]);
        } else {
          reject([400, "Cannot delete Course"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_COURSE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added Course");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // Estimates
  mock.onGet(url.GET_ESTIMATES).reply(() => {
    console.log("Calling mock get Estimate");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (estimates) {
          // Passing fake JSON data as response
          resolve([200, estimates]);
        } else {
          reject([400, "Cannot get Estimate"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_ESTIMATE).reply(estimate => {
    console.log("in mock onPut reply updating ...", estimate);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated estimate");
        if (estimate && estimate.data) {
          // Passing fake JSON data as response
          resolve([200, estimate.data]);
        } else {
          reject([400, "Cannot update estimate"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_ESTIMATE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted estimate");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.estimate]);
        } else {
          reject([400, "Cannot delete estimate"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ESTIMATE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added estimate");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ESTIMATE).reply(estimate => {
    console.log("MOCK: add new estimate ...:", estimate);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (estimate && estimate.data) {
          // Passing fake JSON data as response
          estimate.push(estimate.data);
          resolve([200, estimate.data]);
        } else {
          reject([400, "Cannot add estimate"]);
        }
      });
    });
  });

  // Levels
  mock.onGet(url.GET_LEVELS).reply(() => {
    console.log("Calling mock get Level");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (levels) {
          // Passing fake JSON data as response
          resolve([200, levels]);
        } else {
          reject([400, "Cannot get Level"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_LEVEL).reply(level => {
    console.log("in mock onPut reply updating ...", level);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated level");
        if (level && level.data) {
          // Passing fake JSON data as response
          resolve([200, level.data]);
        } else {
          reject([400, "Cannot update level"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_LEVEL).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted level");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.level]);
        } else {
          reject([400, "Cannot delete level"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_LEVEL).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added level");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_LEVEL).reply(level => {
    console.log("MOCK: add new level ...:", level);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (level && level.data) {
          // Passing fake JSON data as response
          level.push(level.data);
          resolve([200, level.data]);
        } else {
          reject([400, "Cannot add level"]);
        }
      });
    });
  });

  // SchedulingLectures
  mock.onGet(url.GET_SCHEDULING_LECTURES).reply(() => {
    console.log("Calling mock get SchedulingLecture");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (schedulingLectures) {
          // Passing fake JSON data as response
          resolve([200, schedulingLectures]);
        } else {
          reject([400, "Cannot get SchedulingLecture"]);
        }
      });
    });
  });

  mock.onGet(url.GET_ALL_SCHEDULING_LECTURES).reply(() => {
    console.log("Calling mock get SchedulingLecture");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (schedulingLectures) {
          // Passing fake JSON data as response
          resolve([200, schedulingLectures]);
        } else {
          reject([400, "Cannot get SchedulingLecture"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_SCHEDULING_LECTURE).reply(schedulingLecture => {
    console.log("in mock onPut reply updating ...", schedulingLecture);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated schedulingLecture");
        if (schedulingLecture && schedulingLecture.data) {
          // Passing fake JSON data as response
          resolve([200, schedulingLecture.data]);
        } else {
          reject([400, "Cannot update schedulingLecture"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_SCHEDULING_LECTURE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted schedulingLecture");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.schedulingLecture]);
        } else {
          reject([400, "Cannot delete schedulingLecture"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SCHEDULING_LECTURE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added schedulingLecture");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SCHEDULING_LECTURE).reply(schedulingLecture => {
    console.log("MOCK: add new schedulingLecture ...:", schedulingLecture);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (schedulingLecture && schedulingLecture.data) {
          // Passing fake JSON data as response
          schedulingLecture.push(schedulingLecture.data);
          resolve([200, schedulingLecture.data]);
        } else {
          reject([400, "Cannot add schedulingLecture"]);
        }
      });
    });
  });
  // SectionLabs
  mock.onGet(url.GET_SECTION_LABS).reply(() => {
    console.log("Calling mock get SectionLab");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sectionLabs) {
          // Passing fake JSON data as response
          resolve([200, sectionLabs]);
        } else {
          reject([400, "Cannot get SectionLab"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_SECTION_LAB).reply(sectionLab => {
    console.log("in mock onPut reply updating ...", sectionLab);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated sectionLab");
        if (sectionLab && sectionLab.data) {
          // Passing fake JSON data as response
          resolve([200, sectionLab.data]);
        } else {
          reject([400, "Cannot update sectionLab"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_SECTION_LAB).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted sectionLab");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.sectionLab]);
        } else {
          reject([400, "Cannot delete sectionLab"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SECTION_LAB).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added sectionLab");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SECTION_LAB).reply(sectionLab => {
    console.log("MOCK: add new sectionLab ...:", sectionLab);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sectionLab && sectionLab.data) {
          // Passing fake JSON data as response
          sectionLab.push(sectionLab.data);
          resolve([200, sectionLab.data]);
        } else {
          reject([400, "Cannot add sectionLab"]);
        }
      });
    });
  });
  // Schedules
  mock.onGet(url.GET_SCHEDULES).reply(() => {
    console.log("Calling mock get Schedule");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (schedules) {
          // Passing fake JSON data as response
          resolve([200, schedules]);
        } else {
          reject([400, "Cannot get Schedule"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_SCHEDULE).reply(schedule => {
    console.log("in mock onPut reply updating ...", schedule);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated schedule");
        if (schedule && schedule.data) {
          // Passing fake JSON data as response
          resolve([200, schedule.data]);
        } else {
          reject([400, "Cannot update schedule"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_SCHEDULE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted schedule");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.schedule]);
        } else {
          reject([400, "Cannot delete schedule"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SCHEDULE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added schedule");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SCHEDULE).reply(schedule => {
    console.log("MOCK: add new schedule ...:", schedule);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (schedule && schedule.data) {
          // Passing fake JSON data as response
          schedule.push(schedule.data);
          resolve([200, schedule.data]);
        } else {
          reject([400, "Cannot add schedule"]);
        }
      });
    });
  });

  // TimeLines
  mock.onGet(url.GET_TIMELINES).reply(() => {
    console.log("Calling mock get TimeLine");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (timeLines) {
          // Passing fake JSON data as response
          resolve([200, timeLines]);
        } else {
          reject([400, "Cannot get TimeLine"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_TIMELINE).reply(timeLine => {
    console.log("in mock onPut reply updating ...", timeLine);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated timeLine");
        if (timeLine && timeLine.data) {
          // Passing fake JSON data as response
          resolve([200, timeLine.data]);
        } else {
          reject([400, "Cannot update timeLine"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_TIMELINE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted timeLine");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.timeLine]);
        } else {
          reject([400, "Cannot delete timeLine"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_TIMELINE).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added timeLine");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_TIMELINE).reply(timeLine => {
    console.log("MOCK: add new timeLine ...:", timeLine);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (timeLine && timeLine.data) {
          // Passing fake JSON data as response
          timeLine.push(timeLine.data);
          resolve([200, timeLine.data]);
        } else {
          reject([400, "Cannot add timeLine"]);
        }
      });
    });
  });

  // WeekDays
  mock.onGet(url.GET_WEEKDAYS).reply(() => {
    console.log("Calling mock get WeekDay");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (weekDays) {
          // Passing fake JSON data as response
          resolve([200, weekDays]);
        } else {
          reject([400, "Cannot get WeekDay"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_WEEKDAY).reply(weekDay => {
    console.log("in mock onPut reply updating ...", weekDay);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated weekDay");
        if (weekDay && weekDay.data) {
          // Passing fake JSON data as response
          resolve([200, weekDay.data]);
        } else {
          reject([400, "Cannot update weekDay"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_WEEKDAY).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted weekDay");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.weekDay]);
        } else {
          reject([400, "Cannot delete weekDay"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_WEEKDAY).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added weekDay");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_WEEKDAY).reply(weekDay => {
    console.log("MOCK: add new weekDay ...:", weekDay);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (weekDay && weekDay.data) {
          // Passing fake JSON data as response
          weekDay.push(weekDay.data);
          resolve([200, weekDay.data]);
        } else {
          reject([400, "Cannot add weekDay"]);
        }
      });
    });
  });

  // Semesters
  mock.onGet(url.GET_SEMESTERS).reply(() => {
    console.log("Calling mock get Semester");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (semesters) {
          // Passing fake JSON data as response
          resolve([200, semesters]);
        } else {
          reject([400, "Cannot get Semester"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_SEMESTER).reply(semester => {
    console.log("in mock onPut reply updating ...", semester);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated semester");
        if (semester && semester.data) {
          // Passing fake JSON data as response
          resolve([200, semester.data]);
        } else {
          reject([400, "Cannot update semester"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_SEMESTER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted semester");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.semester]);
        } else {
          reject([400, "Cannot delete semester"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SEMESTER).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added semester");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_SEMESTER).reply(semester => {
    console.log("MOCK: add new semester ...:", semester);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (semester && semester.data) {
          // Passing fake JSON data as response
          semester.push(semester.data);
          resolve([200, semester.data]);
        } else {
          reject([400, "Cannot add semester"]);
        }
      });
    });
  });

  // Years
  mock.onGet(url.GET_YEARS).reply(() => {
    console.log("Calling mock get Year");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (years) {
          // Passing fake JSON data as response
          resolve([200, years]);
        } else {
          reject([400, "Cannot get Year"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_YEAR).reply(year => {
    console.log("in mock onPut reply updating ...", year);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated year");
        if (year && year.data) {
          // Passing fake JSON data as response
          resolve([200, year.data]);
        } else {
          reject([400, "Cannot update year"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_YEAR).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted year");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.year]);
        } else {
          reject([400, "Cannot delete year"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_YEAR).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added year");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // UniversityStudents
  mock.onGet(url.GET_UNIVERSITY_STUDENTS).reply(() => {
    console.log("Calling mock get UniversityStudent");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (universityStudents) {
          // Passing fake JSON data as response
          resolve([200, universityStudents]);
        } else {
          reject([400, "Cannot get UniversityStudent"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_UNIVERSITY_STUDENT).reply(universityStudent => {
    console.log("in mock onPut reply updating ...", universityStudent);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated universityStudent");
        if (universityStudent && universityStudent.data) {
          // Passing fake JSON data as response
          resolve([200, universityStudent.data]);
        } else {
          reject([400, "Cannot update universityStudent"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_UNIVERSITY_STUDENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted universityStudent");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.universityStudent]);
        } else {
          reject([400, "Cannot delete universityStudent"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_UNIVERSITY_STUDENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added universityStudent");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  // GrantSponsors
  mock.onGet(url.GET_GRANT_SPONSORS).reply(() => {
    console.log("Calling mock get GrantSponsor");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (grantSponsors) {
          // Passing fake JSON data as response
          resolve([200, grantSponsors]);
        } else {
          reject([400, "Cannot get GrantSponsor"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_GRANT_SPONSOR).reply(grant => {
    console.log("in mock onPut reply updating ...", grant);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated grant");
        if (grant && grant.data) {
          // Passing fake JSON data as response
          resolve([200, grant.data]);
        } else {
          reject([400, "Cannot update grant"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_GRANT_SPONSOR).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted grant");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.grant]);
        } else {
          reject([400, "Cannot delete grant"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_GRANT_SPONSOR).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added grant");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_GRANT_SPONSOR).reply(grant => {
    console.log("MOCK: add new grant ...:", grant);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (grant && grant.data) {
          // Passing fake JSON data as response
          grant.push(grant.data);
          resolve([200, grant.data]);
        } else {
          reject([400, "Cannot add grant"]);
        }
      });
    });
  });

  // AdmissionRequirements
  mock.onGet(url.GET_ADMISSIONREQUIREMENTS).reply(() => {
    console.log("Calling mock get AdmissionRequirement");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (admissionRequirements) {
          // Passing fake JSON data as response
          resolve([200, admissionRequirements]);
        } else {
          reject([400, "Cannot get AdmissionRequirement"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_ADMISSIONREQUIREMENT).reply(admissionrequirement => {
    console.log("in mock onPut reply updating ...", admissionrequirement);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated admissionrequirement");
        if (admissionrequirement && admissionrequirement.data) {
          // Passing fake JSON data as response
          resolve([200, admissionrequirement.data]);
        } else {
          reject([400, "Cannot update admissionrequirement"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_ADMISSIONREQUIREMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted admissionrequirement");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.admissionrequirement]);
        } else {
          reject([400, "Cannot delete admissionrequirement"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ADMISSIONREQUIREMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added admissionrequirement");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ADMISSIONREQUIREMENT).reply(admissionrequirement => {
    console.log(
      "MOCK: add new admissionrequirement ...:",
      admissionrequirement
    );
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (admissionrequirement && admissionrequirement.data) {
          // Passing fake JSON data as response
          admissionrequirement.push(admissionrequirement.data);
          resolve([200, admissionrequirement.data]);
        } else {
          reject([400, "Cannot add admissionrequirement"]);
        }
      });
    });
  });

  // universityrequirement
  mock.onGet(url.GET_UNIVERSITYREQUIREMENTS).reply(() => {
    console.log("Calling mock get universityrequirements");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (universityrequirements) {
          // Passing fake JSON data as response
          resolve([200, universityrequirements]);
        } else {
          reject([400, "Cannot get universityrequirements"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_UNIVERSITYREQUIREMENTS).reply(universityrequirement => {
    console.log("in mock onPut reply updating ...", universityrequirement);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated universityrequirement");
        if (universityrequirement && universityrequirement.data) {
          // Passing fake JSON data as response
          resolve([200, universityrequirement.data]);
        } else {
          reject([400, "Cannot update universityrequirement"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_UNIVERSITYREQUIREMENTS).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted universityrequirement");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.universityrequirement]);
        } else {
          reject([400, "Cannot delete universityrequirement"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_UNIVERSITYREQUIREMENTS).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added universityrequirement");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  //CERTIFICATELEVELS
  mock.onPost(url.ADD_NEW_CERTIFICATELEVEL).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added certificateLevel");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_CERTIFICATELEVEL).reply(certificateLevel => {
    console.log("in mock onPut reply updating ...", certificateLevel);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated certificateLevel");
        if (certificateLevel && certificateLevel.data) {
          // Passing fake JSON data as response
          resolve([200, certificateLevel.data]);
        } else {
          reject([400, "Cannot update certificateLevel"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_CERTIFICATELEVEL).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted certificateLevel");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.certificateLevelData]);
        } else {
          reject([400, "Cannot delete certificateLevel"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CERTIFICATESLEVELS).reply(() => {
    console.log("Calling mock get certificateLevel");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (certificatelevels) {
          // Passing fake JSON data as response
          resolve([200, certificatelevels]);
        } else {
          reject([400, "Cannot get certificateLevel"]);
        }
      });
    });
  });
  //studentManagements
  mock.onPost(url.ADD_NEW_STUDENTMANAGEMENT).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("added studentManagement");
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_STUDENTMANAGEMENT).reply(studentManagement => {
    console.log("in mock onPut reply updating ...", studentManagement);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updated studentManagement");
        if (studentManagement && studentManagement.data) {
          // Passing fake JSON data as response
          resolve([200, studentManagement.data]);
        } else {
          reject([400, "Cannot update studentManagement"]);
        }
      });
    });
  });
  mock.onDelete(url.DELETE_STUDENTMANAGEMENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("deleted studentManagement");
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.studentManagementData]);
        } else {
          reject([400, "Cannot delete studentManagement"]);
        }
      });
    });
  });

  mock.onGet(url.GET_STUDENTMANAGEMENTS).reply(() => {
    console.log("Calling mock get studentManagement");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (studentManagements) {
          // Passing fake JSON data as response
          resolve([200, studentManagements]);
        } else {
          reject([400, "Cannot get studentManagement"]);
        }
      });
    });
  });
  //
  mock.onPut(url.UPDATE_NATIONALITY).reply(nationality => {
    console.log("in mock onPut reply updating ...", nationality);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nationality && nationality.data) {
          // Passing fake JSON data as response
          resolve([200, nationality.data]);
        } else {
          reject([400, "Cannot update nationality"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_NATIONALITY).reply(nationality => {
    console.log("in mock onPut reply updating ...", nationality);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nationality && nationality.data) {
          // Passing fake JSON data as response
          resolve([200, nationality.data]);
        } else {
          reject([400, "Cannot update nationality"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_USER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.user]);
        } else {
          reject([400, "Cannot delete user"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_NATIONALITY).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.nationality]);
        } else {
          reject([400, "Cannot delete nationality"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_EVENT).reply(event => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        } else {
          reject([400, "Cannot update event"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_EVENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.event]);
        } else {
          reject([400, "Cannot delete event"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CATEGORIES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (calenderDefaultCategories) {
          // Passing fake JSON data as response
          resolve([200, calenderDefaultCategories]);
        } else {
          reject([400, "Cannot get categories"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CHATS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (chats) {
          // Passing fake JSON data as response
          resolve([200, chats]);
        } else {
          reject([400, "Cannot get chats"]);
        }
      });
    });
  });

  mock.onGet(url.GET_GROUPS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (groups) {
          // Passing fake JSON data as response
          resolve([200, groups]);
        } else {
          reject([400, "Cannot get groups"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CONTACTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (contacts) {
          // Passing fake JSON data as response
          resolve([200, contacts]);
        } else {
          reject([400, "Cannot get contacts"]);
        }
      });
    });
  });

  mock.onGet(url.GET_NATIONALITIES).reply(() => {
    console.log("Calling mock get nationalities");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nationalities) {
          // Passing fake JSON data as response
          resolve([200, nationalities]);
        } else {
          reject([400, "Cannot get nationalities"]);
        }
      });
    });
  });
  mock.onGet(new RegExp(`${url.GET_MESSAGES}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (messages) {
          // Passing fake JSON data as response
          const { params } = config;
          const filteredMessages = messages.filter(
            returnMessage => returnMessage.roomId === params.roomId
          );
          resolve([200, filteredMessages]);
        } else {
          reject([400, "Cannot get messages"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_MESSAGE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.data) {
          // Passing fake JSON data as response
          resolve([200, config.data]);
        } else {
          reject([400, "Cannot add message"]);
        }
      });
    });
  });

  mock.onGet(url.GET_ORDERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (orders) {
          // Passing fake JSON data as response
          resolve([200, orders]);
        } else {
          reject([400, "Cannot get orders"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ORDER).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add order"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_ORDER).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot update order"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_ORDER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.order]);
        } else {
          reject([400, "Cannot delete order"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CART_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cartData) {
          // Passing fake JSON data as response
          resolve([200, cartData]);
        } else {
          reject([400, "Cannot get cart data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CUSTOMERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (customerData) {
          // Passing fake JSON data as response
          resolve([200, customerData]);
        } else {
          reject([400, "Cannot get customers data"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_CUSTOMER).reply(customer => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (customer && customer.data) {
          // Passing fake JSON data as response
          resolve([200, customer.data]);
        } else {
          reject([400, "Cannot add customer"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_NATIONALITY).reply(nationality => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nationality && nationality.data) {
          // Passing fake JSON data as response
          resolve([200, nationality.data]);
        } else {
          reject([400, "Cannot add nationality"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_REQUEST).reply(request => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (request && request.data) {
          // Passing fake JSON data as response
          resolve([200, request.data]);
        } else {
          reject([400, "Cannot add request"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_CUSTOMER).reply(customer => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (customer && customer.data) {
          // Passing fake JSON data as response
          resolve([200, customer.data]);
        } else {
          reject([400, "Cannot update customer"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_CUSTOMER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.customer]);
        } else {
          reject([400, "Cannot delete customer"]);
        }
      });
    });
  });

  mock.onGet(url.GET_SHOPS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shops) {
          // Passing fake JSON data as response
          resolve([200, shops]);
        } else {
          reject([400, "Cannot get shops data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_WALLET).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (wallet) {
          // Passing fake JSON data as response
          resolve([200, wallet]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CRYPTO_ORDERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cryptoOrders) {
          // Passing fake JSON data as response
          resolve([200, cryptoOrders]);
        } else {
          reject([400, "Cannot get orders"]);
        }
      });
    });
  });

  mock.onGet(url.GET_INVOICES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoiceList) {
          // Passing fake JSON data as response
          resolve([200, invoiceList]);
        } else {
          reject([400, "Cannot get invoices"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_INVOICE_DETAIL}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoiceList) {
          // Passing fake JSON data as response
          const { params } = config;
          const invoice = invoiceList.find(
            invoice => invoice.id.toString() === params.id.toString()
          );
          resolve([200, invoice]);
        } else {
          reject([400, "Cannot get invoice"]);
        }
      });
    });
  });

  mock.onGet(url.GET_PROJECTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (projects) {
          // Passing fake JSON data as response
          resolve([200, projects]);
        } else {
          reject([400, "Cannot get projects"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_PROJECT).reply(project => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (project && project.data) {
          // Passing fake JSON data as response
          resolve([200, project.data]);
        } else {
          reject([400, "Cannot add project"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_PROJECT).reply(project => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (project && project.data) {
          // Passing fake JSON data as response
          resolve([200, project.data]);
        } else {
          reject([400, "Cannot update project"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_PROJECT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.project]);
        } else {
          reject([400, "Cannot delete project"]);
        }
      });
    });
  });

  mock.onGet(url.GET_STARRED_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (starredmails) {
          // Passing fake JSON data as response
          resolve([200, starredmails]);
        } else {
          reject([400, "Cannot get starredmails"]);
        }
      });
    });
  });

  mock.onGet(url.GET_IMPORTANT_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (importantmails) {
          // Passing fake JSON data as response
          resolve([200, importantmails]);
        } else {
          reject([400, "Cannot get importantmails"]);
        }
      });
    });
  });
  mock.onGet(url.GET_TRASH_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (trashmails) {
          // Passing fake JSON data as response
          resolve([200, trashmails]);
        } else {
          reject([400, "Cannot get trashmails"]);
        }
      });
    });
  });
  mock.onGet(url.GET_DRAFT_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (draftmails) {
          // Passing fake JSON data as response
          resolve([200, draftmails]);
        } else {
          reject([400, "Cannot get draftmails"]);
        }
      });
    });
  });
  mock.onGet(url.GET_SENT_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sentmails) {
          // Passing fake JSON data as response
          resolve([200, sentmails]);
        } else {
          reject([400, "Cannot get sentmails"]);
        }
      });
    });
  });

  mock.onGet(url.GET_INBOX_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (inboxmails) {
          // Passing fake JSON data as response
          resolve([200, inboxmails]);
        } else {
          reject([400, "Cannot get inboxmails"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_INBOX_MAIL).reply(inboxmail => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (inboxmail && inboxmail.data) {
          // Passing fake JSON data as response
          resolve([200, inboxmail.data]);
        } else {
          reject([400, "Cannot add project"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_INBOX_MAIL).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.inboxmail]);
        } else {
          reject([400, "Cannot delete inboxmail"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_PROJECT_DETAIL}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (projects) {
          // Passing fake JSON data as response
          const { params } = config;
          const project = projects.find(
            project => project.id.toString() === params.id.toString()
          );
          resolve([200, project]);
        } else {
          reject([400, "Cannot get project detail"]);
        }
      });
    });
  });

  mock.onGet(url.GET_TASKS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (tasks) {
          // Passing fake JSON data as response
          resolve([200, tasks]);
        } else {
          reject([400, "Cannot get tasks"]);
        }
      });
    });
  });

  mock.onGet(url.GET_COUNTRY_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_MAJOR_TYPE_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });


  mock.onGet(url.GET_REQUEST_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_SERVICE_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_GENDER_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_NATIONALITY_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_YEAR_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_FINE_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_FINE_DEFINITION_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_FEES_DEFINITION_DELETED_VALUE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleted) {
          // Passing fake JSON data as response
          resolve([200, deleted]);
        } else {
          reject([400, "Cannot get deleted"]);
        }
      });
    });
  });

  mock.onGet(url.GET_FILE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file) {
          // Passing fake JSON data as response
          resolve([200, file]);
        } else {
          reject([400, "Cannot get file"]);
        }
      });
    });
  });


  mock.onGet(url.GET_USERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (members) {
          // Passing fake JSON data as response
          resolve([200, members]);
        } else {
          reject([400, "Cannot get users"]);
        }
      });
    });
  });

  mock.onGet(url.GET_USER_PROFILE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userProfile) {
          // Passing fake JSON data as response
          resolve([200, userProfile]);
        } else {
          reject([400, "Cannot get user profile"]);
        }
      });
    });
  });

  mock.onGet(url.GET_WEEKLY_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (weekData) {
          // Passing fake JSON data as response
          resolve([200, weekData]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_YEARLY_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (yearData) {
          // Passing fake JSON data as response
          resolve([200, yearData]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_MONTHLY_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (monthData) {
          // Passing fake JSON data as response
          resolve([200, monthData]);
        } else {
          reject([400, "Cannot get wallet data"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.TOP_SELLING_DATA}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config;
      setTimeout(() => {
        if (params && params.month) {
          // Passing fake JSON data as response

          var data = [];
          if (params.month === "jan") {
            data = janTopSellingData;
          } else if (params.month === "dec") {
            data = decTopSellingData;
          } else if (params.month === "nov") {
            data = novTopSellingData;
          } else if (params.month === "oct") {
            data = octTopSellingData;
          }
          resolve([200, data]);
        } else {
          reject([400, "Cannot get selling data"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_EARNING_DATA}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config;
      setTimeout(() => {
        if (params && params.month) {
          // Passing fake JSON data as response
          const { params } = config;
          var data = [];
          if (params.month === "jan") {
            data = janEarningData;
          } else if (params.month === "dec") {
            data = decEarningData;
          } else if (params.month === "nov") {
            data = novEarningData;
          } else if (params.month === "oct") {
            data = octEarningData;
          }
          resolve([200, data]);
        } else {
          reject([400, "Cannot get earning data"]);
        }
      });
    });
  });

  mock.onPut(url.GET_STUDENTS_OPTIONS).reply(student => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (student && student.data) {
          // Passing fake JSON data as response
          resolve([200, student.data]);
        } else {
          reject([400, "Cannot update student"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_PASSWORD).reply(studentInfo => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (studentInfo && studentInfo.data) {
          // Passing fake JSON data as response
          resolve([200, studentInfo.data]);
        } else {
          reject([400, "Cannot update studentInfo"]);
        }
      });
    });
  });
};

export default fakeBackend;
