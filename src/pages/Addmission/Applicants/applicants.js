import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Alert,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  InputGroup,
  Input,
  FormGroup,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Form,
} from "reactstrap";
import * as moment from "moment";
import Select from "react-select";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import images from "assets/images";

import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

//i18n
import { withTranslation } from "react-i18next";

import {
  getTempTrainees,
  addNewTempTrainee,
  updateTempTrainee,
  deleteTempTrainee,
  getTempTraineeById,
  generateTempTrainee,
  getRegisterCertificates,
  getTempTraineeDefaultRegReqDocs,
  updateProfessionalExperience,
  addNewProfessionalExperience,
  deleteProfessionalExperience,
  addRequiredDocs,
} from "store/new-Trainee/actions";

// import { getFilteredFaculties } from "store/admissionConditions/actions";
// import { getFilteredAcademicCertificates } from "store/academicvertificates/actions";

import { isEmpty, size, map } from "lodash";

import Accordion from "react-bootstrap/Accordion";

import Dropdown from "react-bootstrap/Dropdown";

import classnames from "classnames";

import InputMask from "react-input-mask";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
// import uniDocuments from "pages/Setting/UniAdmission/uni-documents";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
  getPageFromMenu,
} from "../../../utils/menuUtils";
import { ChevronDoubleLeftIcon, ConsoleIcon } from "@icons/material";
import { is } from "date-fns/locale";
// import { departments } from "common/data";
// import certificateLevel from "pages/Certificateslevels/certificate-level";
class ApplicantsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      tempTrainee: "",
      years: [],
      tempTraineeLocal: "",
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      hasError: false,
      isOpen: false,
      modal: false,
      deleteModal: false,
      generateModal: false,
      averageValue: "",
      selectedDiploma: "",
      IsSpecial: false,
      grantCond: 0,
      selecetdDiplomaId: "",
      selectedFacultyId: 0,
      selectedStudyPlanId: 0,
      selectedYear: null,
      currentYearObj: {},
      facultyName: "",
      studyPlanName: "",
      socialStatusName: "",
      estimateName: "",
      selectedRegistrationCertLevelId: "",
      selectedStudyPattern: "",
      selectedExaminationSession: "",
      IsTransferTempTraineeCheck: false,
      transferUniName: "",
      selectedTransferUnivCountry: "",
      selectedUnivCountry: "",
      selectedRegistrationDate: new Date().toISOString().split("T")[0],
      selectedNationalityId: 0,
      nationalityName: "",
      grantName: "",
      selectedCountry: "",
      selectedSemester: "",
      selectedGovernorate: "",
      genderName: "",
      diplomaTypeName: "",
      governorateName: "",
      selectedSocialStatus: "",
      selectedBirthDate: "",
      selectedRegistrationDiplomaDate: "",
      selectedEmissionDate: "",
      selectedIdentityIssueDate: "",
      selectedPassportGrantDate: "",
      selectedPassportExpirationDate: "",
      selectedPassportIssueDate: "",
      selectedPassportExpiryDate: "",
      selectedDiplomaDate: "",
      selectedDiplomaVerificationDate: "",
      values: "",
      firstNameError: false,
      lastNameError: false,
      fatherNameError: false,
      grandFatherNameError: false,
      motherNameError: false,
      birthLocError: false,
      birthdateError: false,
      nationalityError: false,
      genderError: false,
      facultyError: false,
      diplomaError: false,
      diplomaIdError: false,
      diplomaNumberError: false,
      averageError: false,
      stdTotalGradeError: false,
      gradeError: false,
      nationalNoError: false,
      identityNoError: false,
      examinationSessionError: false,
      plan_studyError: false,
      errorMessage: null,
      errorMessage1: null,
      successMessage: null,
      successMessage1: null,
      showAlert: null,
      HasBrotherCheck: false,
      showGenerateButton: false,
      totalGradeValue: "",
      traineeGrade: "",
      studentGrade: "",
      attestatedValue: 0,
      rows: [],
      bloodTypeName: "",
      duplicateRelativeError: null,
      duplicateError: null,
      duplicateErrorSibling: null,
      lastUsedId: 0,
      stdDocsArray: [],
      profExperiencesArray: [],
      lastUsedExperienceId: 0,
      trnProfExperiences: {},
      trnProfExperience: "",
      showSiblingsSelect: false,
      siblingsArray: [],
      deleteBroModal: false,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      tempTrainees: {},
      selectedParentNationality: null,
      selectedInstituteCountry: "",
      selectedTempTraineeStatus: "",
      languageState: "",
      selectedHightStudyTypeId: "",
      selectedEstimateId: "",
      selectedRegUniDate: "",
      selectedRowId: null,
      isTempTraineeSaved: false,
      selectedTempTraineeId: 0,
      isAdd: false,
    };

    this.handleEditempTrainee = this.handleEditempTrainee.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.handleTempTraineeClicks = this.handleTempTraineeClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleTabVertical = this.toggleTabVertical.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleIsTransferTempTraineeChange =
      this.handleIsTransferTempTraineeChange.bind(this);
    this.handleCheckboxEdit = this.handleCheckboxEdit.bind(this);
    this.handleButtonEdit = this.handleButtonEdit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      tempTraineeStatus,
      last_created_trainee,
      tempTrainees,
      tempTrainee_regReqDocs,
      onGetTempTrainees,
      generated_tempTrainee,
      diplomalevels,
      nationalities,
      relatives,
      faculties,
      countries,
      cities,
      yearSemesters,
      currentSemester,
      governorates,
      regReqDocuments,
      genders,
      certificatelevels,
      admissionConditions,
      academiccertificates,
      filteredFaculties,
      filteredAcademicCertificates,
      deleted,
      grants,
      tempTraineeBrothers,
      user_menu,
      onGetTempTraineesRegCertificates,
      trnProfExperiences,
      tempTraineesDocuments,
      generated_student,
      //onGetTempRelatives,
      regcertificates,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.getAllObject(this.props.user_menu, this.props.location.pathname);
    onGetTempTrainees(lang);
    onGetTempTraineesRegCertificates();
    this.setState({ trnProfExperiences, tempTraineeStatus });
    this.setState({ tempTraineesDocuments });
    this.setState({ nationalities, regcertificates });
    this.setState({ last_created_trainee, diplomalevels });
    this.setState({ tempTrainees });
    this.setState({ tempTrainee_regReqDocs });
    this.setState({ relatives });
    this.setState({ faculties });
    this.setState({ countries });
    this.setState({ yearSemesters });
    this.setState({ currentSemester });
    this.setState({ cities });
    this.setState({ governorates });
    this.setState({ regReqDocuments });
    this.setState({ genders });
    this.setState({ certificatelevels });
    this.setState({ admissionConditions });
    this.setState({ academiccertificates });
    this.setState({ filteredFaculties });
    this.setState({ filteredAcademicCertificates });
    this.setState({ generated_tempTrainee });
    this.setState({ deleted });
    this.setState({ grants });
    this.setState({ tempTraineeBrothers });

    let curentueardata = localStorage.getItem("authUser");
    if (curentueardata) {
      try {
        const parsed = JSON.parse(curentueardata);
        const firstYear = parsed[0];
        const selectedYear = {
          value: firstYear.currentYearId,
          label: firstYear.currentYearName,
        };
        this.setState({
          selectedYear,
          currentYearObj: {
            currentYearId: firstYear.currentYearId,
            currentYearName: firstYear.currentYearName,
          },
        });
      } catch (error) {
        console.error("Error parsing authUser:", error);
      }
    }
    this.setState({ languageState: lang });

    i18n.on("languageChanged", this.handleLanguageChange);
    console.log(this.state.currentYearObj, "gggg");
  }
  handleLanguageChange = lng => {
    const { onGetTempTrainees } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetTempTrainees(lng);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowAddButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowDeleteButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowEditButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.getAllObject(this.props.user_menu, this.props.location.pathname);
    }
  }
  getAllObject = (menu, pathname) => {
    const menuObject = getPageFromMenu(menu, pathname);
    this.setState({ menuObject });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  collapse = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.props.onGetTempTrainees();
  }
  handleSelectYear = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    // const { onGetTempTrainees  } = this.props;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
    // onGetTempTrainees ();
  };
  // handleTempTraineeClicks = () => {
  //   const { tempTrainees } = this.props;
  //   const emptyTempTrainee = {};
  //   Object.keys(tempTrainees).forEach(key => {
  //     emptyTempTrainee[key] = "";
  //   });

  //   const { currentSemester } = this.props;

  //   const { selectedBirthDate } = this.state;
  //   this.setState({
  //     selectedNationalityId: "",
  //     nationalityName: "",
  //     selectedGender: "",
  //     selectedDiploma: "",
  //     averageValue: "",
  //     selectedFacultyId: "",
  //     facultyName: "",
  //     socialStatusName: "",
  //     selectedStudyPlanId: "",
  //     studyPlanName: "",
  //     selectedCountry: "",
  //     selectedGovernorate: "",
  //     selectedExaminationSession: "",
  //     selectedBirthDate: "",
  //     selectedRegistrationDiplomaDate: "",
  //   });

  //   this.setState({
  //     emptyTempTrainee,
  //     isEdit: false,
  //     showGenerateButton: false,
  //     errorMessage: null,
  //     successMessage: null,
  //   });
  //   this.toggle();
  // };

  // handleSave = values => {
  //   const {
  //     selectedBirthDate,
  //     selectedRegistrationDiplomaDate,
  //     selectedNationalityId,
  //     selectedRegistrationCertLevelId,
  //     selectedFacultyId,
  //     selectedGender,
  //     selectedStudyPlanId,
  //     isEdit,
  //     selectedExaminationSession,
  //     selectedSocialStatus,
  //     selectedDiplomaId,
  //     selectedHightStudyTypeId,
  //     selectedEstimateId,
  //     selectedRegUniDate,
  //   } = this.state;
  //   console.log("values in save", values);
  //   values["socialStatusId"] = selectedSocialStatus;
  //   if (
  //     values.FirstName === "" ||
  //     values.LastName === "" ||
  //     values.FatherName === "" ||
  //     values.grandFatherName === "" ||
  //     values.MotherName === "" ||
  //     values.diplomaId === "" ||
  //     values.BirthLocation === "" ||
  //     values.birthdate === "" ||
  //     // values.plan_study === "" ||
  //     (values.NationalityId === "" && selectedNationalityId === "") ||
  //     (values.GenderId === "" && selectedGender === "") ||
  //     (values.registrationCertLevelId === "" &&
  //       selectedRegistrationCertLevelId === "")
  //   ) {
  //     if (values.FirstName.trim() === "") {
  //       this.setState({ firstNameError: true, saveError: true });
  //     }

  //     if (values.LastName.trim() === "") {
  //       this.setState({ lastNameError: true, saveError: true });
  //     }

  //     if (values.FatherName.trim() === "") {
  //       this.setState({ fatherNameError: true, saveError: true });
  //     }
  //     if (values.diplomaId.trim() === "") {
  //       this.setState({ diplomaIdError: true, saveError: true });
  //     }

  //     if (values.grandFatherName.trim() === "") {
  //       this.setState({ grandFatherNameError: true, saveError: true });
  //     }
  //     if (values.MotherName.trim() === "") {
  //       this.setState({ motherNameError: true, saveError: true });
  //     }

  //     if (values.BirthLocation.trim() === "") {
  //       this.setState({ birthLocError: true, saveError: true });
  //     }

  //     // if (values.plan_study.trim() === "") {
  //     //   this.setState({ plan_studyError: true, saveError: true });
  //     // }

  //     if (values.birthdate === "" && selectedBirthDate === "") {
  //       this.setState({ birthdateError: true, saveError: true });
  //     }

  //     if (values.NationalityId === "" && selectedNationalityId === "") {
  //       this.setState({ nationalityError: true, saveError: true });
  //     }
  //     if (values.GenderId === "" && selectedGender === "") {
  //       this.setState({ genderError: true, saveError: true });
  //     }

  //     // if (values.FacultyId === "" && selectedFacultyId === "") {
  //     //   this.setState({ facultyError: true, saveError: true });
  //     // }

  //     if (values.nationalNo === "") {
  //       this.setState({ nationalNoError: true, saveError: true });
  //     }
  //     if (values.identityNo === "") {
  //       this.setState({ identityNoError: true, saveError: true });
  //     }
  //     const errorSaveTempTraineeMessage = this.props.t(
  //       "Fill the Required Fields to Save TempTrainee"
  //     );
  //     this.setState({ errorMessage: errorSaveTempTraineeMessage }, () => {
  //       window.scrollTo(0, 0);
  //     });
  //   } else {
  //     this.setState({ firstNameError: false, saveError: false });
  //     this.setState({ lastNameError: false, saveError: false });
  //     this.setState({ fatherNameError: false, saveError: false });
  //     this.setState({ motherNameError: false, saveError: false });
  //     this.setState({ birthLocError: false, saveError: false });
  //     this.setState({ birthdateError: false, saveError: false });
  //     this.setState({ nationalityError: false, saveError: false });
  //     this.setState({ genderError: false, saveError: false });
  //     // this.setState({ facultyError: false, saveError: false });
  //     this.setState({ grandFatherNameError: false, saveError: false });
  //     this.setState({ diplomaIdError: false, saveError: false });
  //     this.setState({ stdTotalGradeError: false, saveError: false });
  //     let traineeinfo = {};
  //     Object.keys(values).forEach(function (key) {
  //       if (
  //         values[key] != undefined &&
  //         (values[key].length > 0 || values[key] != "")
  //       )
  //         traineeinfo[key] = values[key];
  //     });
  //     const {
  //       tempTrainee,
  //       selectedExaminationSession,
  //       selectedStudyPattern,
  //       selectedBirthDate,
  //       selectedIdentityIssueDate,
  //       selectedPassportIssueDate,
  //       selectedPassportExpiryDate,
  //       selectedDiplomaDate,
  //       selectedDiplomaVerificationDate,
  //       selectedRegistrationDate,
  //       selectedGender,
  //       selectedSocialStatus,
  //       relativesArray,
  //       averageValue,
  //       stdDocsArray,
  //       siblingsArray,
  //       trnProfExperiences,
  //       selectedDiplomaId,
  //       isEdit,
  //     } = this.state;

  //     const { onUpdateTempTrainee, onAddNewTempTrainee, tempTrainee } = this.props;
  //     const {
  //       cities,
  //       countries,
  //       diplomalevels,
  //       currentSemester,
  //       governorates,
  //     } = this.props;

  //     if (values.diplomaId) {
  //       const diplomaObject = diplomalevels.find(
  //         certificate => certificate.value === values.diplomaId
  //       );
  //       traineeinfo["diplomaId"] = diplomaObject.key;
  //     }

  //     // if (values.diplomaId) {
  //     //   const diplomaObject = diplomalevels.find(
  //     //     certificate => certificate.value === values.diplomaId
  //     //   );
  //     //   traineeinfo["diplomaId"] = diplomaObject.key;
  //     // }

  //     if (values.DiplomaCountryId) {
  //       const countryObject = countries.find(
  //         country => country.value === values.DiplomaCountryId
  //       );
  //       traineeinfo["DiplomaCountryId"] = countryObject.key;
  //     }
  //     console.log(
  //       "DiplomaGovernorateIdDiplomaGovernorateId",
  //       values.DiplomaGovernorateId
  //     );
  //     if (values.DiplomaGovernorateId) {
  //       const governorateObject = governorates.find(
  //         governorate => governorate.value === values.DiplomaGovernorateId
  //       );
  //       traineeinfo["DiplomaGovernorateId"] = governorateObject.key;
  //     }

  //     /*  if (values.DiplomaCityId) {
  //       const cityObject = cities.find(
  //         city => city.value === values.DiplomaCityId
  //       );
  //       traineeinfo["DiplomaCityId"] = cityObject.key;
  //     } */

  //     if (values.UnivCountryId) {
  //       const univCountryObject = countries.find(
  //         country => country.value === values.UnivCountryId
  //       );
  //       traineeinfo["UnivCountryId"] = univCountryObject.key;
  //     }

  //     if (values.InstituteCountryId) {
  //       const InstirCountryObject = countries.find(
  //         country => country.value === values.InstituteCountryId
  //       );
  //       traineeinfo["InstituteCountryId"] = InstirCountryObject.key;
  //     }

  //     if (selectedGender) {
  //       traineeinfo["GenderId"] = parseInt(selectedGender);
  //     }

  //     if (selectedNationalityId) {
  //       traineeinfo["NationalityId"] = selectedNationalityId;
  //     } else {
  //       traineeinfo["NationalityId"] = tempTrainee.NationalityId;
  //     }

  //     if (selectedExaminationSession) {
  //       traineeinfo["ExaminationSession"] = selectedExaminationSession;
  //     }
  //     if (selectedSocialStatus) {
  //       traineeinfo["socialStatusId"] = selectedSocialStatus;
  //     }

  //     if (selectedStudyPattern) {
  //       traineeinfo["studyPattern"] = selectedStudyPattern;
  //     }

  //     if (selectedRegistrationCertLevelId) {
  //       traineeinfo["registrationCertLevelId"] =
  //         selectedRegistrationCertLevelId;
  //     }

  //     if (selectedBirthDate != "") {
  //       traineeinfo["birthdate"] = selectedBirthDate;
  //     }

  //     if (selectedIdentityIssueDate) {
  //       traineeinfo["identityIssueDate"] = selectedIdentityIssueDate;
  //     }

  //     if (selectedPassportIssueDate) {
  //       traineeinfo["passportIssueDate"] = selectedPassportIssueDate;
  //     }

  //     if (selectedPassportExpiryDate) {
  //       traineeinfo["passportExpiryDate"] = selectedPassportExpiryDate;
  //     }

  //     if (selectedDiplomaDate) {
  //       traineeinfo["diplomaDate"] = selectedDiplomaDate;
  //     }

  //     if (selectedDiplomaVerificationDate) {
  //       traineeinfo["diplomaVerificationDate"] =
  //         selectedDiplomaVerificationDate;
  //     }

  //     if (selectedRegistrationDate) {
  //       traineeinfo["RegistrationDate"] = selectedRegistrationDate;
  //     }

  //     if (selectedRegistrationDiplomaDate != "") {
  //       traineeinfo["registrationDiplomaDate"] =
  //         selectedRegistrationDiplomaDate;
  //     }

  //     //hhhhh

  //     if (selectedRegUniDate != "") {
  //       traineeinfo["RegUniDate"] = selectedRegUniDate;
  //     }

  //     if (averageValue) {
  //       traineeinfo["Average"] = averageValue;
  //     }

  //     if (isEdit) {
  //       traineeinfo["Id"] = tempTrainee.Id;
  //       onUpdateTempTrainee(traineeinfo);
  //       const updateTraineMessage = this.props.t("Traine updated successfully");
  //       this.setState({ successMessage: updateTraineMessage });
  //     } else {
  //       const response = onAddNewTempTrainee(traineeinfo);
  //       if (response?.Id) {
  //         this.setState({ tempTraineeId: response.Id });
  //       }
  //       const saveTempTraineeMessage = this.props.t("TempTrainee saved successfully");
  //       this.setState({
  //         successMessage: saveTempTraineeMessage,
  //         isTempTraineeSaved: true,
  //       });
  //     }
  //   }
  // };
  handleSave = values => {
    const {
      selectedBirthDate,
      selectedRegistrationDiplomaDate,
      selectedNationalityId,
      selectedRegistrationCertLevelId,
      selectedFacultyId,
      selectedGender,
      selectedStudyPlanId,
      isEdit,
      selectedExaminationSession,
      selectedSocialStatus,
      selectedDiplomaId,
      selectedHightStudyTypeId,
      selectedEstimateId,
      selectedRegUniDate,
      selectedTempTraineeStatus,
    } = this.state;
    console.log("values in save", values);
    values["socialStatusId"] = selectedSocialStatus;
    values.statusId = isEdit ? selectedTempTraineeStatus : 1;

    if (
      values.FirstName === "" ||
      values.LastName === "" ||
      values.FatherName === "" ||
      values.grandFatherName === "" ||
      values.MotherName === "" ||
      values.diplomaId === "" ||
      values.BirthLocation === "" ||
      values.birthdate === "" ||
      // values.plan_study === "" ||
      (values.NationalityId === "" && selectedNationalityId === "") ||
      (values.GenderId === "" && selectedGender === "") ||
      (values.registrationCertLevelId === "" &&
        selectedRegistrationCertLevelId === "")
    ) {
      if (values.FirstName.trim() === "") {
        this.setState({ firstNameError: true, saveError: true });
      }

      if (values.LastName.trim() === "") {
        this.setState({ lastNameError: true, saveError: true });
      }

      if (values.FatherName.trim() === "") {
        this.setState({ fatherNameError: true, saveError: true });
      }
      if (values.diplomaId.trim() === "") {
        this.setState({ diplomaIdError: true, saveError: true });
      }

      if (values.grandFatherName.trim() === "") {
        this.setState({ grandFatherNameError: true, saveError: true });
      }
      if (values.MotherName.trim() === "") {
        this.setState({ motherNameError: true, saveError: true });
      }

      if (values.BirthLocation.trim() === "") {
        this.setState({ birthLocError: true, saveError: true });
      }

      // if (values.plan_study.trim() === "") {
      //   this.setState({ plan_studyError: true, saveError: true });
      // }

      if (values.birthdate === "" && selectedBirthDate === "") {
        this.setState({ birthdateError: true, saveError: true });
      }

      if (values.NationalityId === "" && selectedNationalityId === "") {
        this.setState({ nationalityError: true, saveError: true });
      }
      if (values.GenderId === "" && selectedGender === "") {
        this.setState({ genderError: true, saveError: true });
      }

      // if (values.FacultyId === "" && selectedFacultyId === "") {
      //   this.setState({ facultyError: true, saveError: true });
      // }

      if (values.nationalNo === "") {
        this.setState({ nationalNoError: true, saveError: true });
      }
      if (values.identityNo === "") {
        this.setState({ identityNoError: true, saveError: true });
      }
      const errorSaveTempTraineeMessage = this.props.t(
        "Fill the Required Fields to Save TempTrainee"
      );
      this.setState({ errorMessage: errorSaveTempTraineeMessage }, () => {
        window.scrollTo(0, 0);
      });
    } else {
      this.setState({ firstNameError: false, saveError: false });
      this.setState({ lastNameError: false, saveError: false });
      this.setState({ fatherNameError: false, saveError: false });
      this.setState({ motherNameError: false, saveError: false });
      this.setState({ birthLocError: false, saveError: false });
      this.setState({ birthdateError: false, saveError: false });
      this.setState({ nationalityError: false, saveError: false });
      this.setState({ genderError: false, saveError: false });
      // this.setState({ facultyError: false, saveError: false });
      this.setState({ grandFatherNameError: false, saveError: false });
      this.setState({ diplomaIdError: false, saveError: false });
      this.setState({ stdTotalGradeError: false, saveError: false });
      let traineeinfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          traineeinfo[key] = values[key];
      });
      const {
        tempTrainee,
        selectedExaminationSession,
        selectedStudyPattern,
        selectedBirthDate,
        selectedIdentityIssueDate,
        selectedPassportIssueDate,
        selectedPassportExpiryDate,
        selectedDiplomaDate,
        selectedDiplomaVerificationDate,
        selectedRegistrationDate,
        selectedGender,
        selectedSocialStatus,
        relativesArray,
        averageValue,
        stdDocsArray,
        siblingsArray,
        trnProfExperiences,
        selectedDiplomaId,
        isEdit,
      } = this.state;

      const { onUpdateTempTrainee, onAddNewTempTrainee } = this.props;
      const {
        cities,
        countries,
        diplomalevels,
        currentSemester,
        governorates,
      } = this.props;

      if (values.diplomaId) {
        const diplomaObject = diplomalevels.find(
          certificate => certificate.value === values.diplomaId
        );
        if (diplomaObject === undefined) {
          traineeinfo["diplomaId"] = tempTrainee.diplomaId;
        }
      }

      if (values.DiplomaCountryId) {
        const countryObject = countries.find(
          country => country.value === values.DiplomaCountryId
        );
        if (countryObject === undefined) {
          traineeinfo["DiplomaCountryId"] = tempTrainee.DiplomaCountryId;
        }
      }

      if (values.DiplomaGovernorateId) {
        const governorateObject = governorates.find(
          governorate => governorate.value === values.DiplomaGovernorateId
        );
        if (governorateObject === undefined) {
          traineeinfo["DiplomaGovernorateId"] =
            tempTrainee.DiplomaGovernorateId;
        }
      }

      if (values.UnivCountryId) {
        const univCountryObject = countries.find(
          country => country.value === values.UnivCountryId
        );
        if (univCountryObject === undefined) {
          traineeinfo["UnivCountryId"] = tempTrainee.UnivCountryId;
        }
      }

      if (values.InstituteCountryId) {
        const instCountryObject = countries.find(
          country => country.value === values.InstituteCountryId
        );
        if (instCountryObject === undefined) {
          traineeinfo["InstituteCountryId"] = tempTrainee.InstituteCountryId;
        }
      }
      if (values.birthdate) {
        traineeinfo["birthdate"] =
          values && values.birthdate
            ? new Date(values.birthdate).toISOString().split("T")[0]
            : selectedBirthDate;
      }

      if (selectedGender) {
        traineeinfo["GenderId"] = parseInt(selectedGender);
      }

      if (selectedNationalityId) {
        traineeinfo["NationalityId"] = tempTrainee.NationalityId;
      }

      if (selectedExaminationSession) {
        traineeinfo["ExaminationSession"] = tempTrainee.ExaminationSession;
      }
      if (selectedSocialStatus) {
        traineeinfo["socialStatusId"] = selectedSocialStatus;
      }

      if (selectedStudyPattern) {
        traineeinfo["studyPattern"] = selectedStudyPattern;
      }

      if (selectedRegistrationCertLevelId) {
        traineeinfo["registrationCertLevelId"] =
          selectedRegistrationCertLevelId;
      }

      if (selectedBirthDate != "") {
        traineeinfo["birthdate"] = selectedBirthDate;
      }

      if (selectedIdentityIssueDate) {
        traineeinfo["identityIssueDate"] = selectedIdentityIssueDate;
      }

      if (selectedPassportIssueDate) {
        traineeinfo["passportIssueDate"] = selectedPassportIssueDate;
      }

      if (selectedPassportExpiryDate) {
        traineeinfo["passportExpiryDate"] = selectedPassportExpiryDate;
      }

      if (selectedDiplomaDate) {
        traineeinfo["diplomaDate"] = selectedDiplomaDate;
      }

      if (selectedDiplomaVerificationDate) {
        traineeinfo["diplomaVerificationDate"] =
          selectedDiplomaVerificationDate;
      }

      if (selectedRegistrationDate) {
        traineeinfo["RegistrationDate"] = selectedRegistrationDate;
      }

      if (selectedRegistrationDiplomaDate != "") {
        traineeinfo["registrationDiplomaDate"] =
          selectedRegistrationDiplomaDate;
      }

      //hhhhh

      if (selectedRegUniDate != "") {
        traineeinfo["RegUniDate"] = selectedRegUniDate;
      }

      if (averageValue) {
        traineeinfo["Average"] = averageValue;
      }

      // traineeinfo["Id"] = values.Id;
      // console.log("traineeinfotraineeinfo", traineeinfo["Id"]);
      if (isEdit) {
        console.log("rrrrrrrrrrrrrrr", traineeinfo);
        onUpdateTempTrainee(traineeinfo);
      } else if (isAdd) {
        onAddNewTempTrainee(traineeinfo);
      }
      const saveTempTraineeMessage = this.props.t("Trainee saved successfully");
      this.setState({
        successMessage: saveTempTraineeMessage,
      });
    }
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleDelete = () => {
    const { onDeleteProfessionalExperience } = this.props;
    const { selectedRowId } = this.state;
    console.log("deeeeeeeeeeeelete222222222", selectedRowId);
    if (selectedRowId !== null) {
      onDeleteProfessionalExperience({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleEditempTrainee = arg => {
    console.log("arg", arg);
    // const {
    //   tempTrainees,
    //   onGetempTraineeById,
    //   diplomalevels,
    //   onGetempTraineesDocuments,
    // } = this.props;
    // const { stdDocsArray, profExperiencesArray } = this.state;

    // const filteredTempTrainee = tempTrainees.filter(tempTrainee => tempTrainee.key != arg.Id);
    // console.log("BEFORE tempTrainee", tempTrainee);
    // console.log("BEFORE tempTrainee", tempTrainee);
    // onGetempTraineeById(tempTrainee);
    // console.log("aFTER Btrainee", tempTrainee.Id);
    // console.log("aFTER Btrainee", tempTrainee.ProfessionalExperiences);
    this.setState({
      //   showGenerateButton: true,
      //   // tempTrainee: {
      //   // Id: tempTrainee.Id,
      tempTrainee: arg,
      selectedTempTraineeId: arg.Id,
      nationalityName: arg.nationality || "",
      selectedNationalityId: arg.NationalityId || null,
      //   //selectedRegistrationDate: arg.RegistrationDate || null,
      selectedGender: arg.GenderId || null,
      genderName: arg.gender || "",
      selectedDiploma: arg.diplomaId || null,
      diplomaTypeName: arg.diplomaTypeName || null,
      averageValue: arg.Average || null,
      selectedCountry: arg.DiplomaCountryId || null,
      facultyName: arg.facultyName || "",
      selectedFacultyId: arg.FacultyId || null,
      studyPlanName: arg.plan_study || "",
      selectedGovernorate: arg.DiplomaGovernorateId || null,
      selectedExaminationSession: arg.ExaminationSession || "",
      selectedRegistrationCertLevelId: arg.registrationCertLevelId || "",
      // selectedSocialStatus: arg.socialStatusId || "",
      socialStatusName: arg.socialStatusName || null,
      selectedRegistrationDiplomaDate: arg.registrationDiplomaDate || "",
      //   // },
      //   tempTraineeId: arg.Id,
      profExperiencesArray:
        arg &&
        arg.ProfessionalExperiences !== undefined &&
        arg.ProfessionalExperiences !== null
          ? arg.ProfessionalExperiences
          : [],
      stdDocsArray:
        arg &&
        arg.RegReqDocTempTrainee !== undefined &&
        arg.RegReqDocTempTrainee !== null
          ? arg.RegReqDocTempTrainee
          : [],
      isEdit: true,
    });
    // console.log("traaaaaaaaaaaineeeerrrrr", tempTraineeId);
    this.toggle();
  };

  state = {
    photoURL: "https://picsum.photos/300/200", // Default photo URL
  };

  handlePhotoChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        photoURL: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  toggleTab(tab) {
    if (tab === 5 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    if (tab === 4 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    const {
      tempTrainee,
      isEdit,
      siblingsArray,
      trnProfExperiences,
      stdDocsArray,
      profExperiencesArray,
    } = this.state;
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
        if (isEdit) {
          this.setState({
            stdDocsArray: tempTrainee.RegReqDocTempTrainee || [],
            profExperiencesArray: tempTrainee.ProfessionalExperiences || [],
          });
        }
      }
      if (tab == 4 && isEdit == false) {
        const { trnProfExperiences } = this.props;
        this.setState({
          profExperiencesArray: trnProfExperiences,
        });
      }

      if (tab == 5 && isEdit == false) {
        const { tempTraineesDocuments } = this.props;
        this.setState({
          stdDocsArray: tempTraineesDocuments,
        });
      }
    }
  }

  toggleTabVertical(tab) {
    if (this.state.activesTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        var modifiedSteps = [...this.state.passedStepsVertical, tab];
        this.setState({
          activeTabVartical: tab,
          passedStepsVertical: modifiedSteps,
        });
      }
    }
  }

  handleIsTransferTempTraineeChange = event => {
    const { name, checked } = event.target;
    this.setState({
      IsTransferTempTraineeCheck: checked,
    });
  };

  handleCheckboxEdit = (Id, fieldName) => {
    this.setState(prevState => ({
      reqDocuments: prevState.reqDocuments.map(document =>
        document.Id === Id
          ? { ...document, [fieldName]: document[fieldName] ? 0 : 1 }
          : document
      ),
    }));
  };

  handleButtonEdit = (Id, fieldName, newValue) => {
    this.setState(prevState => ({
      reqDocuments: prevState.reqDocuments.map(document =>
        document.Id === Id ? { ...document, [fieldName]: newValue } : document
      ),
    }));
  };

  handleGenderChange = (fieldName, selectedValue) => {
    const { genders } = this.props;
    if (fieldName === "GenderId") {
      const gender = genders.find(gender => gender.value == selectedValue);

      this.setState({
        selectedGender: selectedValue,
        genderName: gender.label,
      });
    }
  };

  handleDateChange = (fieldName, newDate) => {
    if (fieldName == "birthdate") {
      this.setState({
        selectedBirthDate: newDate,
      });
    }

    if (fieldName == "EmissionDate") {
      this.setState({
        selectedEmissionDate: newDate,
      });
    }

    if (fieldName == "passportGrantDate") {
      this.setState({
        selectedPassportGrantDate: newDate,
      });
    }

    if (fieldName == "passportExpirationDate") {
      this.setState({
        selectedPassportExpirationDate: newDate,
      });
    }

    if (fieldName == "diplomaDate") {
      this.setState({
        selectedDiplomaDate: newDate,
      });
    }

    if (fieldName == "diplomaVerificationDate") {
      this.setState({
        selectedDiplomaVerificationDate: newDate,
      });
    }

    if (fieldName == "registrationDiplomaDate") {
      this.setState({
        selectedRegistrationDiplomaDate: newDate,
      });
    }
  };

  handleRegReqDocDataChange = (rowId, fieldName, fieldValue) => {
    this.setState(prevState => {
      const updatedRegReqDocs = prevState.stdDocsArray.map(document => {
        if (document.Id === rowId) {
          return {
            ...document,
            [fieldName]: fieldValue,
          };
        }
        return document;
      });

      return {
        stdDocsArray: updatedRegReqDocs,
      };
    });
  };

  // handleIsSpecial = event => {
  //   const { averageValue, selectedDiplomaId } = this.state;
  //   const { currentSemester, onGetFilteredFaculties } = this.props;
  //   const { name, checked } = event.target;

  //   this.setState({
  //     IsSpecial: checked,
  //     grantCond: checked ? 1 : 0,
  //   });
  //   const grantValue = checked ? 1 : 0;

  //   if (averageValue != "" && selectedDiplomaId != undefined) {
  //     let obj = {
  //       diplomaId: selectedDiplomaId,
  //       Average: averageValue,
  //       isGrantCond: grantValue,
  //       YearId: currentSemester.cuYearId,
  //     };

  //     onGetFilteredFaculties(obj);
  //   }
  // };

  handleInputFocus = fieldName => {
    const {
      selectedDiploma,
      selectedCountry,
      selectedGovernorate,
      selectedCity,
      selectedBrother,
      selectedTransferUnivCountry,
      selectedSemester,
    } = this.state;

    if (fieldName == "diplomaId") {
      this.setState({ selectedDiploma });
    }

    if (fieldName == "DiplomaCountryId") {
      this.setState({ selectedCountry });
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState({ selectedGovernorate });
    }

    if (fieldName == "DiplomaCityId") {
      this.setState({ selectedCity });
    }

    if (fieldName == "TransferUnivCountryId") {
      this.setState({ selectedTransferUnivCountry });
    }

    if (fieldName == "registerYearSemesterId") {
      this.setState({ selectedSemester });
    }

    if (fieldName == "traineeNum") {
      this.setState({ selectedBrother });
    }
  };

  handleInputBlur = fieldName => {
    const {
      selectedDiploma,
      selectedCountry,
      selectedGovernorate,
      selectedCity,
      selectedTransferUnivCountry,
      selectedSemester,
      selectedBrother,
    } = this.state;

    if (fieldName == "diplomaId") {
      this.setState({ selectedDiploma });
    }

    if (fieldName == "DiplomaCountryId") {
      this.setState({ selectedCountry });
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState({ selectedGovernorate });
    }

    if (fieldName == "DiplomaCityId") {
      this.setState({ selectedCity });
    }

    if (fieldName == "TransferUnivCountryId") {
      this.setState({ selectedTransferUnivCountry });
    }

    if (fieldName == "registerYearSemesterId") {
      this.setState({ selectedSemester });
    }

    if (fieldName == "traineeSID") {
      this.setState({ selectedBrother });
    }
  };

  handleSelectChange = (fieldName, selectedValue, values) => {
    const { nationalities, faculties } = this.props;
    console.log("values before setState", values);
    // if (fieldName == "FacultyId") {
    //   const name = faculties.find(faculty => faculty.value === selectedValue);
    //   console.log("naaaaamefac", name);
    //   this.setState({
    //     selectedFacultyId: selectedValue,
    //     facultyName: name.label,
    //   });
    // }
    if (fieldName == "NationalityId") {
      // const name = nationalities.find(
      //   nationality => nationality.value === selectedValue
      // );
      console.log("naaaaamenac", name);

      this.setState({
        selectedNationalityId: selectedValue,
        // nationalityName: name.label,
        tempTrainee: values,
      });
    }

    console.log("values after setState", values);
  };

  handleGenderChange = (fieldName, selectedValue, values) => {
    const { genders } = this.props;

    if (fieldName === "GenderId") {
      const gender = genders.find(gender => gender.value == selectedValue);
      this.setState({
        selectedGender: selectedValue,
        genderName: gender.label,
        tempTrainee: values,
      });
    }
  };

  handleSelect = (fieldName, selectedValue, values) => {
    const { socialStatus, tempTraineeStatus } = this.props;
    if (fieldName == "socialStatusId") {
      const name = socialStatus.find(
        socialStat => socialStat.value === selectedValue
      );
      console.log("naaaaamesooo", name);

      this.setState({
        selectedSocialStatus: selectedValue,
        socialStatusName: name.label,
        tempTrainee: values,
      });
    }
    if (fieldName == "statusId") {
      const name = tempTraineeStatus.find(
        traineeStatu => traineeStatu.value === selectedValue
      );
      console.log("naaaaamesooo", name);

      this.setState({
        selectedTempTraineeStatus: selectedValue,
        socialStatusName: name.label,
        tempTrainee: values,
      });
    }
    if (fieldName == "EstimateId") {
      const name = estimates.find(estimate => estimate.value === selectedValue);
      console.log("naaaaamesooo", name);

      this.setState({
        selectedEstimateId: selectedValue,
        estimateNamee: name.label,
        tempTrainee: values,
      });
    }
  };

  handleGenerateTempTrainee = tempId => {
    const { onGenerateTempTrainee } = this.props;

    const { isEdit } = this.state;
    if (isEdit) {
      onGenerateTempTrainee(tempId);
    }

    this.setState({ generateModal: true });
  };

  toggleGenerateModal = () => {
    this.setState(prevState => ({
      generate: !prevState.generate,
    }));
  };

  onCloseGenerateModal = () => {
    const { onGetTempTrainees } = this.props;
    this.setState({ generateModal: false });
    onGetTempTrainees();
  };
  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };
  handleExpSuccessClose = () => {
    this.setState({ successMessage1: null, showAlert: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleExpErrorClose = () => {
    this.setState({ errorMessage1: null, showAlert: null });
  };
  handleDeletedSuccessClose = () => {
    this.setState({ successMessage: null, showAlert: null });
    // const { onGetempTraineeDeletedValue } = this.props;
    // this.setState({ showAlert: null });
    // onGetempTraineeDeletedValue();
  };

  handleDeletedErrorClose = () => {
    this.setState({ errorMessage: null, showAlert: null });
    // const { onGetempTraineeDeletedValue } = this.props;
    // this.setState({ showAlert: null });
    // onGetempTraineeDeletedValue();
  };

  handleHasBrotherChange = event => {
    const { name, checked } = event.target;
    const value = checked ? 1 : 0;
    this.setState({
      HasBrotherCheck: value,
      showSiblingsSelect: checked,
    });
  };

  handleRemoveRow = (e, idx) => {
    if (idx === "01") {
      document.getElementById("addr" + idx).style.display = "block";
    } else if (typeof idx != "undefined") {
      document.getElementById("addr" + idx).style.display = "none";
    }
  };

  handleAlertCloseRelative = () => {
    this.setState({ duplicateErrorRelative: null });
  };

  handleAlertCloseRelative = () => {
    this.setState({ duplicateErrorRelative: null });
  };

  handleSiblingsDataChange = (id, fieldName, newValue) => {};

  handleAddRowSiblings = () => {
    const { siblingsArray, lastUsedId } = this.state;
    const emptyRowsExist = siblingsArray.some(
      sibling => sibling.brotherSID === null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorSibling: errorMessage });
    } else {
      const newSibling = {
        Id: lastUsedId,
        brotherSID: null,
      };
      this.setState({
        siblingsArray: [...siblingsArray, newSibling],
        lastUsedId: lastUsedId + 1,
      });
      this.setState({ duplicateErrorSibling: null });
    }
  };

  // handleSelectBrother = (rowId, fieldName, selectedValue, oldValue) => {
  //   const { studentsOpt, onUpdateBrother } = this.props;
  //   const { siblingsArray } = this.state;

  //   const selectBro = studentsOpt.find(
  //     traineeOpt => traineeOpt.value + " " + traineeOpt.key == oldValue
  //   );
  //   this.setState({ oldBrother: selectBro });

  //   const brotherObj = studentsOpt.find(
  //     traineeOpt => traineeOpt.value + " " + traineeOpt.key === selectedValue
  //   );

  //   if (brotherObj) {
  //     this.setState({ oldBrother: {} });
  //     const isDuplicate = siblingsArray.some(
  //       traineeBrother =>
  //         traineeBrother.Id !== rowId &&
  //         traineeBrother.brotherSID === brotherObj.key
  //     );
  //     if (isDuplicate) {
  //       const errorMessage = this.props.t("Sibling already exists");
  //       this.setState({ duplicateErrorSibling: errorMessage });
  //       console.error("value exist");
  //     } else {
  //       this.setState({ duplicateErrorSibling: null });
  //       this.setState(prevState => {
  //         const updatedSiblings = prevState.siblingsArray.map(sibling => {
  //           if (sibling.Id === rowId) {
  //             return {
  //               ...sibling,
  //               [fieldName]: brotherObj.key,
  //             };
  //           }
  //           return sibling;
  //         });

  //         return {
  //           siblingsArray: updatedSiblings,
  //         };
  //       });
  //     }
  //   }
  // };

  handleAlertClose = () => {
    this.setState({ duplicateErrorSibling: null });
  };

  onClickDeleteSiblingDB = rowId => {
    this.setState({ selectedRowId: rowId, deleteBroModal: true });
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "tempSiblings") {
      this.setState({ siblingsArray: selectedMulti });
    }
  };

  handleValidDate = date => {
    if (
      !date ||
      date === "1970-01-01" ||
      date === "0000-00-00" ||
      moment(date).year() === 1970
    ) {
      return "";
    }
    return moment(date).format("DD-MM-YYYY");
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "ExaminationSession") {
      this.setState({ selectedExaminationSession: option });
    }
  };

  handleButtonClick2 = (fieldName, option, values) => {
    // console.log("fieldName", fieldName);
    // console.log("option", option);
    // const { onGetTempTraineesDocuments } = this.props;
    // let obj = { certificateLevelId: option };
    // console.log("objobjobj", obj);
    // onGetTempTraineesDocuments(obj);
    if (fieldName == "registrationCertLevelId") {
      this.setState({ selectedRegistrationCertLevelId: option });
      this.setState({ tempTrainee: values });
    }
  };

  handelAddExperience = () => {
    const { onAddNewProfessionalExperience, lastAddedId, trnProfExperiences } =
      this.props;
    const {
      profExperiencesArray,
      lastUsedExperienceId,
      isAdd,
      selectedTempTraineeId,
    } = this.state;
    const emptyRowsExist = profExperiencesArray.some(
      profExperiences => profExperiences.jobTitle.trim() === ""
    );
    console.log("emptyRowsExist", emptyRowsExist);
    console.log("selectedTempTraineeId", selectedTempTraineeId);
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorProfExperiences: errorMessage });
    } else {
      const newExperience = {
        Id: lastUsedExperienceId,
        tempTraineeId: isAdd ? lastAddedId : selectedTempTraineeId,
        jobTitle: "",
        workPlace: "",
        workAddress: "",
        workField: "",
        workDuration: "",
      };
      // onAddNewProfessionalExperience(newExperience);
      this.setState({
        duplicateErrorProfExperiences: null,
        profExperiencesArray: [...profExperiencesArray, newExperience],
        lastUsedExperienceId: lastUsedExperienceId + 1,
      });
    }
  };

  handleExperienceDataChange = (rowId, fieldName, fieldValue) => {
    const { isEdit } = this.state;
    // if (isEdit == true) {
    this.setState(prevState => {
      const updatedProfExperience = prevState.profExperiencesArray.map(
        exper => {
          if (exper.Id === rowId) {
            return {
              ...exper,
              [fieldName]: fieldValue,
            };
          }
          return exper;
        }
      );

      return {
        profExperiencesArray: updatedProfExperience,
      };
    });
    // } else {
    //   const { onUpdateProfessionalExperience, trnProfExperiences } = this.props;
    //   const isDuplicate = trnProfExperiences.some(trnProfExperience => {
    //     return (
    //       trnProfExperience.Id !== rowId &&
    //       trnProfExperience.jobTitle.trim() === fieldValue.trim()
    //     );
    //   });

    //   if (isDuplicate) {
    //     const errorMessage = this.props.t("Value already exists");
    //     this.setState({ duplicateErrorProfExperiences: errorMessage });
    //   } else {
    //     this.setState({ duplicateErrorProfExperiences: null });
    //     let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    //     onUpdateProfessionalExperience(onUpdate);
    //   }
    // }
  };

  handleDiplomaSelect = (event, fieldName, setFieldValue, values) => {
    // const { onGetempTraineesDocuments } = this.props;
    const { diplomalevels } = this.props;
    const selectedValue = event.target.value;
    console.log("selectedValue", selectedValue);

    this.setState({
      tempTrainee: values,
    });

    const diplomaObject = diplomalevels.find(
      certificate => certificate.value === event.target.value
    );
    console.log(diplomaObject, "ollllllll");
    // let obj = { certificateLevelId: diplomaObject.key };
    // console.log("objobjobj", obj);
    // onGetempTraineesDocuments(obj);
    setFieldValue("diplomaId", selectedValue);

    if (diplomaObject) {
      this.setState({
        selectedDiplomaId: diplomaObject.key,
        selectedDiploma: selectedValue,
        diplomaTypeName: diplomaObject.value,
        diplomaError: false,
        tempTrainee: values,
      });
    }
  };
  // handleGovernorateSelect = (event, fieldName, setFieldValue, values) => {
  //   const { governorates } = this.props;
  //   const selectedValue = event.target.value;
  //   console.log("selectedValue", selectedValue);

  //   this.setState({
  //     tempTrainee: values,
  //   });

  //   const governorateObject = governorates.find(
  //     governorate => governorate.value === event.target.value
  //   );
  //   console.log(governorateObject, "governorateObjectgovernorateObject");
  //   setFieldValue("DiplomaGovernorateId", selectedValue);

  //   if (diplomaObject) {
  //     this.setState({
  //       selectedGovernorateId: governorateObject.key,
  //       selectedGovernorate: selectedValue,
  //       governorateName: governorateObject.value,
  //       diplomaError: false,
  //       tempTrainee: values,
  //     });
  //   }
  // };

  handleInputBlur = fieldName => {
    const {
      selectedDiploma,
      selectedCountry,
      selectedGovernorate,
      selectedCity,
      selectedUnivCountry,
      selectedSemester,
      selectedBrother,
    } = this.state;

    if (fieldName == "diplomaId") {
      this.setState({ selectedDiploma });
    }

    if (fieldName == "DiplomaCountryId") {
      this.setState({ selectedCountry });
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState({ selectedGovernorate });
    }

    /*    if (fieldName == "DiplomaCityId") {
      this.setState({ selectedCity });
    } */

    if (fieldName == "UnivCountryId") {
      this.setState({ selectedUnivCountry });
    }

    if (fieldName == "studentSID") {
      this.setState({ selectedBrother });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateErrorProfExperiences: null });
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "tempSiblings") {
      this.setState({ siblingsArray: selectedMulti });
    }
    console.log("selectedMulti", selectedMulti);
  };

  handleCheckboxEdit = (Id, fieldName) => {
    this.setState(prevState => ({
      reqDocuments: prevState.reqDocuments.map(document =>
        document.Id === Id
          ? { ...document, [fieldName]: document[fieldName] ? 0 : 1 }
          : document
      ),
    }));
  };

  // handleDeleteRow = () => {
  //   const { onDeleteProfessionalExperience } = this.props;
  //   const { selectedRowId } = this.state;
  //   console.log("ssssssssssssssssssssssselectedrow", selectedRowId);
  //   if (selectedRowId !== null) {
  //     onDeleteProfessionalExperience(selectedRowId);

  //     this.setState({
  //       selectedRowId: null,
  //       deleteModal: false,
  //       showAlert: true,
  //     });
  //   }
  // };

  deleteProfExperience = profExperience => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedProfExperiences = prevState.profExperiencesArray.filter(
        item => item.Id !== profExperience.Id
      );
      return {
        profExperiencesArray: updatedProfExperiences,
      };
    });
  };

  // handleSubmit = values => {
  //   const { lastAddedId, onAddRequiredDocs } = this.props;
  //   const { stdDocsArray } = this.state;
  //   console.log("values in save", values);
  //   values["tempTraineeId"] = lastAddedId;
  //   console.log(lastAddedId);
  //   let traineeinfo = {};
  //   const extractedArray = stdDocsArray.map(item => ({
  //     regReqDocId: item.Id,
  //     availableNumber: item.availableNumber,
  //   }));
  //   console.log("extractedArray", extractedArray);
  //   traineeinfo["stdDocs"] = extractedArray;
  //   traineeinfo["tempTraineeId"] = lastAddedId;
  //   console.log("traineeinfo", traineeinfo);
  //   onAddRequiredDocs(traineeinfo);
  // };

  handleSubmit = values => {
    const { onAddRequiredDocs } = this.props;
    const { stdDocsArray } = this.state;
    console.log("values in save", values);
    values["tempTraineeId"] = values.Id;
    console.log(values["tempTraineeId"]);
    let traineeinfo = {};
    const extractedArray = stdDocsArray.map(item => ({
      Id: item.Id,
      regReqDocId: item.regReqDocId,
      availableNumber: item.availableNumber,
    }));
    console.log("extractedArray", extractedArray);
    (traineeinfo["procedure"] = "Admission_UpdateDocsTrainee"),
      (traineeinfo["tablename"] = "Common_RegReqDocTempTrainee"),
      (traineeinfo["queryname"] = "_Common_TempTrainee"),
      (traineeinfo["stdDocs"] = extractedArray);
    traineeinfo["tempTraineeId"] = values.Id;
    console.log("traineeinfo", traineeinfo);
    onAddRequiredDocs(traineeinfo);
    // const saveDocsMessage = this.props.t("Documents requiered saved successfully");
    //     this.setState({
    //       successMessage: saveTempTraineeMessage,
    //     });
  };

  // handleExperienceSubmit = values => {
  //   const { lastAddedId, onAddNewProfessionalExperience } = this.props;
  //   const { profExperiencesArray, isEdit } = this.state;
  //   console.log("values in save", values);
  //   if (isEdit) {
  //     values["tempTraineeId"] = values.Id;
  //     console.log(values["tempTraineeId"]);
  //     let traineeinfo = {};
  //     const extractedArray = profExperiencesArray.map(item => ({
  //       Id: item.Id,
  //       jobTitle: item.jobTitle,
  //       workPlace: item.workPlace,
  //       workAddress: item.workAddress,
  //       workField: item.workField,
  //       workDuration: item.workDuration,
  //     }));
  //     console.log("extractedArray", extractedArray);
  //     traineeinfo["ProfessionalExperiences"] = extractedArray;
  //     traineeinfo["tempTraineeId"] = values.Id;
  //     console.log("traineeinfo", traineeinfo);
  //     onAddNewProfessionalExperience(traineeinfo);
  //   } else {
  //     values["tempTraineeId"] = lastAddedId;
  //     console.log(values["tempTraineeId"]);
  //     let traineeinfo = {};
  //     const extractedArray = profExperiencesArray.map(item => ({
  //       Id: item.Id,
  //       jobTitle: item.jobTitle,
  //       workPlace: item.workPlace,
  //       workAddress: item.workAddress,
  //       workField: item.workField,
  //       workDuration: item.workDuration,
  //     }));
  //     console.log("extractedArray", extractedArray);
  //     traineeinfo["ProfessionalExperiences"] = extractedArray;
  //     traineeinfo["tempTraineeId"] = lastAddedId;
  //     console.log("traineeinfo", traineeinfo);
  //     onAddNewProfessionalExperience(traineeinfo);
  //   }
  // };

  handleExperienceSubmit = values => {
    const { lastAddedId, onAddNewProfessionalExperience } = this.props;
    const { profExperiencesArray, lastUsedExperienceId, isEdit } = this.state;
    console.log("values in save", values);
    values["tempTraineeId"] = values.Id;
    console.log(values["tempTraineeId"]);
    // let traineeinfo = {};
    // const extractedArray = profExperiencesArray.map(item => ({
    //   Id: item.Id,
    //   jobTitle: item.jobTitle,
    //   workPlace: item.workPlace,
    //   workAddress: item.workAddress,
    //   workField: item.workField,
    //   workDuration: item.workDuration,
    // }));
    // console.log("extractedArray", extractedArray);
    // traineeinfo["ProfessionalExperiences"] = extractedArray;
    // traineeinfo["tempTraineeId"] = values.Id;
    // let experiencesObject = {};
    // profExperiencesArray.forEach((item, i) => {
    //   experiencesObject[`${i}`] = {
    //     Id: item.Id,
    //     jobTitle: item.jobTitle,
    //     workPlace: item.workPlace,
    //     workAddress: item.workAddress,
    //     workField: item.workField,
    //     workDuration: item.workDuration,
    //   };
    // });

    const traineeinfo = {
      tempTraineeId: values.Id,
      ProfessionalExperiences: profExperiencesArray.map(item => ({
        Id: item.Id,
        jobTitle: item.jobTitle,
        workPlace: item.workPlace,
        workAddress: item.workAddress,
        workField: item.workField,
        workDuration: item.workDuration,
      })),
      procedure: "SisApp_UpdateTempTraineeInfo",
      tablename: "Common_TempTraineesProfessionalExperiences",
      queryname: "_Common_TempTrainee",
    };

    console.log("traineeinfo", traineeinfo);
    onAddNewProfessionalExperience(traineeinfo);
    const saveProfExperienceMessage = this.props.t(
      "Professional Experience saved successfully"
    );
    this.setState({
      successMessage1: saveProfExperienceMessage,
    });
  };

  render() {
    //meta title
    document.title =
      "TempTrainee List | keyInHands - React Admin & Dashboard Template";

    const {
      estimateName,
      selectedYear,
      selectedHealthProblems,
      selectedHasDisability,
      selectedRegistrationDate,
      selectedRegistrationCertLevelId,
      selectedStudyPattern,
      selectedExaminationSession,
      selectedBirthDate,
      selectedEmissionDate,
      selectedPassportGrantDate,
      selectedPassportExpirationDate,
      selectedDiploma,
      selectedDiplomaDate,
      selectedDiplomaVerificationDate,
      selectedRegistrationDiplomaDate,
      nationalityName,
      grantName,
      bloodTypeName,
      selectedFacultyId,
      selectedStudyPlanId,
      facultyName,
      studyPlanName,
      selectedCountry,
      selectedTransferUnivCountry,
      selectedCity,
      selectedSemester,
      selectedGovernorate,
      selectedGender,
      genderName,
      IsTransferTempTraineeCheck,
      emptyTempTrainee,
      firstNameError,
      lastNameError,
      fatherNameError,
      grandFatherNameError,
      motherNameError,
      examinationSessionError,
      birthLocError,
      birthdateError,
      nationalityError,
      facultyError,
      averageError,
      errorMessage,
      successMessage,
      errorMessage1,
      successMessage1,
      averageValue,
      showAlert,
      grantCond,
      IsSpecial,
      HasBrotherCheck,
      selectedBrother,
      showGenerateButton,
      traineeGrade,
      totalGradeValue,
      duplicateErrorRelative,
      stdDocsArray,
      showSiblingsSelect,
      siblingsArray,
      profExperiencesArray,
      duplicateErrorSibling,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      menuObject,
      currentYearObj,
      duplicateError,
      diplomaIdError,
      studentListColumns,
      duplicateErrorProfExperiences,
      selectedIdentityIssueDate,
      selectedPassportIssueDate,
      selectedPassportExpiryDate,
      selectedNationalityId,
      selectedUnivCountry,
      selectedSocialStatus,
      genderError,
      diplomaError,
      stdTotalGradeError,
      diplomaNumberError,
      studentGrade,
      attestatedValue,
      gradeError,
      selectedInstituteCountry,
      selectedHightStudyTypeId,
      selectedEstimateId,
      selectedRegUniDate,
      languageState,
      nationalNoError,
      identityNoError,
      plan_studyError,
      tempTrainee,
    } = this.state;

    const showNewInput =
      selectedRegistrationCertLevelId === 1 ||
      selectedRegistrationCertLevelId === 2;
    const isShowInstituteinfo = selectedRegistrationCertLevelId === 2;

    const isShowUlterStudy = selectedRegistrationCertLevelId === 5;

    const isHightSchooll = selectedRegistrationCertLevelId === 3;

    const showUniForm = selectedRegistrationCertLevelId === 79;

    const {
      tempTraineeStatus,
      isLoading,
      years,
      tempRelatives,
      tempTrainees,
      tempTrainee_regReqDocs,
      nationalities,
      relatives,
      faculties,
      countries,
      yearSemesters,
      currentSemester,
      cities,
      certificates,
      governorates,
      genders,
      certificatelevels,
      admissionConditions,
      academiccertificates,
      filteredFaculties,
      filteredAcademicCertificates,
      generated_tempTrainee,
      deleted,
      grants,
      t,
      regReqDocuments,
      tempTraineeBrothers,
      lastAddedId,
      trnProfExperiences,
      socialStatus,
      tempTraineesDocuments,
      diplomalevels,
      onGetFilteredAcademicCertificates,
      getFilteredFaculties,
      generated_student,
      regcertificates,
      highstudytypes,
      estimates,
    } = this.props;

    const { isEdit, deleteModal, generateModal } = this.state;

    const defaultSorted = [
      {
        id: 99,
        dataField: "Id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      TotalGradeSize: tempTrainees.length, // replace later with size(tempTrainees),
      custom: true,
      page: 1,
    };

    const columns = [
      {
        text: "Id",
        key: "Id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, tempTrainee) => <>{tempTrainee.Id}</>,
      },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex, extraData) => {
          const currentPage = extraData?.currentPage || 1;
          const sizePerPage = extraData?.sizePerPage || pageOptions.sizePerPage;
          return rowIndex + 1 + (currentPage - 1) * sizePerPage;
        },
        editable: false,
      },
      {
        dataField: "img",
        key: "img",
        text: "#",
        hidden: true,
      },
      {
        dataField: "fullName",
        key: "fName",
        text: this.props.t("Full Name"),
        sort: true,

        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: menuObject && menuObject.isSearch == 1 ? false : true,
        }),
      },
      {
        dataField: "MotherName",
        text: this.props.t("Mother Name"),
        key: "mothName",
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "nationalNo",
        key: "idNum",
        text: this.props.t("National No"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "RegistrationDate",
        text: this.props.t("Registration Date"),
        sort: true,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.RegistrationDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "registrationCertLevelId",
        text: this.props.t("Registered Under"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "traineeStatus",
        text: this.props.t("Trainee Status"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "applyMethod",
        text: this.props.t("Apply Method"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, tempTrainee) => (
          <div className="d-flex gap-3">
            {/* {menuObject && menuObject.isEdit == 1 && ( */}
            <Link className="text-secondary" to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => this.handleEditempTrainee(tempTrainee)}
              ></i>
            </Link>
            {/* )} */}
            {/* {menuObject && menuObject.isDelete == 1 && ( */}
            {/* <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(tempTrainee)}
              ></i>
            </Link> */}
            {/* )} */}
          </div>
        ),
      },
    ];

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const formattedRegistrationDate =
      tempTrainee && tempTrainee.RegistrationDate
        ? new Date(tempTrainee.RegistrationDate).toISOString().split("T")[0]
        : selectedRegistrationDate;

    const formattedEmissionDate =
      isEdit && tempTrainee && tempTrainee.EmissionDate
        ? new Date(tempTrainee.EmissionDate).toISOString().split("T")[0]
        : selectedEmissionDate;

    const formattedPassportGrantDate =
      isEdit && tempTrainee && tempTrainee.passportGrantDate
        ? new Date(tempTrainee.passportGrantDate).toISOString().split("T")[0]
        : selectedPassportGrantDate;

    const formattedPassportExpirationDate =
      isEdit && tempTrainee && tempTrainee.passportExpirationDate
        ? new Date(tempTrainee.passportExpirationDate)
            .toISOString()
            .split("T")[0]
        : selectedPassportExpirationDate;

    const formattedDiplomaDate =
      isEdit && tempTrainee && tempTrainee.diplomaDate
        ? new Date(tempTrainee.diplomaDate).toISOString().split("T")[0]
        : selectedDiplomaDate;

    const formattedDiplomaVerificationDate =
      isEdit && tempTrainee && tempTrainee.diplomaVerificationDate
        ? new Date(tempTrainee.diplomaVerificationDate)
            .toISOString()
            .split("T")[0]
        : selectedDiplomaVerificationDate;

    const selectRow = {
      mode: "checkbox",
    };

    const preReqColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Document Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Required Number"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Available Number"),
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: this.props.t("Available number value must be > 0"),
            };
          }
          return true;
        },
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Prevent Admission"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() => this.handleCheckboxEdit(row.Id, "preventAdmission")}
          />
        ),
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Prevent Registration"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() =>
              this.handleCheckboxEdit(row.Id, "preventRegistration")
            }
          />
        ),
      },
      {
        dataField: "preventGraduation",

        text: this.props.t("Prevent Graduation"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() =>
              this.handleCheckboxEdit(row.Id, "preventGraduation")
            }
          />
        ),
      },
      {
        dataField: "requireAttestation",

        text: this.props.t("Require Attestation"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() =>
              this.handleCheckboxEdit(row.Id, "requireAttestation")
            }
          />
        ),
      },
      {
        dataField: "attestated",

        text: this.props.t("Attestated"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() => this.handleCheckboxEdit(row.Id, "attestated")}
          />
        ),
      },

      // {
      //   dataField: "attestated",

      //   text: this.props.t("Attestated"),
      //   formatter: (cellContent, row) => (
      //     <div className="btn-group">
      //       <button
      //         type="button"
      //         className={`btn ${
      //           row.attestated === 1 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.Id, "attestated", 1)
      //         }
      //       >
      //         {this.props.t("Yes")}
      //       </button>
      //       <button
      //         type="button"
      //         className={`btn ${
      //           row.attestated === 0 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.Id, "attestated", 0)
      //         }
      //       >
      //         {this.props.t("No")}
      //       </button>
      //     </div>
      //   ),
      //   editorRenderer: (
      //     editorProps,
      //     value,
      //     row,
      //     column,
      //     rowIndex,
      //     columnIndex
      //   ) => (
      //     <div className="btn-group">
      //       <button
      //         type="button"
      //         className={`btn ${
      //           value === 1 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.regReqDocId, "attestated", 1)
      //         }
      //       >
      //         {this.props.t("Yes")}
      //       </button>
      //       <button
      //         type="button"
      //         className={`btn ${
      //           value === 0 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.regReqDocId, "attestated", 0)
      //         }
      //       >
      //         {this.props.t("No")}
      //       </button>
      //     </div>
      //   ),
      // },
      {
        dataField: "uploadFile",
        id: 8,
        key: "file",
        text: this.props.t("Upload File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => this.handleupload(row.Id, event)}
            >
              {this.props.t("Upload File")}
            </button>
          </div>
        ),
      },
    ];

    const trnProfExperienceColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "jobTitle", text: t("Job Title"), sort: true },
      { dataField: "workPlace", text: t("Work Place"), sort: true },
      { dataField: "workAddress", text: t("Work Address"), sort: true },
      { dataField: "workField", text: t("Work Field"), sort: true },
      { dataField: "workDuration", text: t("Work Duration"), sort: true },
      {
        dataField: "uploadFile",
        id: 8,
        key: "file",
        text: this.props.t("Upload Experience Certificate File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => this.handleupload(row.Id, event)}
            >
              {this.props.t("Upload File")}
            </button>
          </div>
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        // hidden: !showDeleteButton,
        formatter: (cellContent, trnProfExperience) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(trnProfExperience)}
            ></i>
          </Link>
        ),
      },
    ];

    const bloodTypes = [
      { value: "A+", label: "A+" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B-", label: "B-" },
      { value: "AB+", label: "AB+" },
      { value: "AB-", label: "AB-" },
      { value: "O+", label: "O+" },
      { value: "O-", label: "O-" },
    ];
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteTempTrainee}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />

        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs breadcrumbItem={this.props.t("Applicants")} />

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      key="unique-pagination-key"
                      keyField="Pagination-Provider"
                      columns={columns}
                      data={tempTrainees}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          key="unique-toolkit-key"
                          keyField="Toolkit-Provider"
                          columns={columns}
                          data={tempTrainees}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="5"></Col>
                                <Col sm="2">
                                  <Select
                                    className="select-style-year"
                                    name="yearId"
                                    key={`yearId`}
                                    options={years}
                                    onChange={newValue => {
                                      this.handleSelectYear("yearId", newValue);
                                    }}
                                    value={selectedYear}
                                  />
                                </Col>
                                <Col sm="4"></Col>

                                {/* {menuObject && menuObject.isAdd == 1 && ( 
                                <Col sm="1">
                                  <div className="text-sm-end">
                                    <Tooltip
                                      title={this.props.t("Create New TempTrainee")}
                                      placement="top"
                                    >
                                      <IconButton
                                        color="primary"
                                        onClick={this.handleTempTraineeClicks}
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </Col>
                                 )} */}
                              </Row>
                              <Row>
                                <div>
                                  {deleted == 0 && showAlert && (
                                    <Alert
                                      color="danger"
                                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                      role="alert"
                                    >
                                      {alertMessage}
                                      <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={this.handleDeletedErrorClose}
                                      ></button>
                                    </Alert>
                                  )}
                                  {deleted == 1 && showAlert && (
                                    <Alert
                                      color="success"
                                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                      role="alert"
                                    >
                                      {alertMessage}
                                      <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={this.handleDeletedSuccessClose}
                                      ></button>
                                    </Alert>
                                  )}
                                </div>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      keyField="Id"
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      columns={columns.map(col => ({
                                        ...col,
                                        formatter:
                                          col.dataField === "serial"
                                            ? (cell, row, rowIndex) =>
                                                rowIndex +
                                                1 +
                                                (paginationProps.page - 1) *
                                                  paginationProps.sizePerPage
                                            : col.formatter,
                                      }))}
                                      bordered={false}
                                      striped={false}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      filterPosition="top"
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit TempTrainee")
                                          : this.props.t("Add New TempTrainee")}
                                      </ModalHeader>
                                      <Row>
                                        <div>
                                          {errorMessage && (
                                            <Alert
                                              color="danger"
                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                              role="alert"
                                            >
                                              {errorMessage}
                                              <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                onClick={this.handleErrorClose}
                                              ></button>
                                            </Alert>
                                          )}
                                        </div>
                                        <div>
                                          {successMessage && (
                                            <Alert
                                              color="success"
                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                              role="alert"
                                            >
                                              {successMessage}
                                              <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                onClick={
                                                  this.handleSuccessClose
                                                }
                                              ></button>
                                            </Alert>
                                          )}
                                        </div>
                                      </Row>
                                      <ModalBody>
                                        <Modal
                                          isOpen={generateModal}
                                          toggle={this.props.onCloseClick}
                                          centered={true}
                                        >
                                          <ModalBody className="py-3 px-5">
                                            <Row>
                                              <Col lg={12}>
                                                <div className="text-center">
                                                  <i
                                                    className="bx bx-check"
                                                    style={{
                                                      fontSize: "9em",
                                                      color: "#34c38f",
                                                    }}
                                                  />

                                                  <h2>
                                                    {this.props.t(
                                                      "Trainee Generated Successfully"
                                                    )}
                                                  </h2>
                                                  <h4>
                                                    {this.props.t("Id :")}
                                                    {
                                                      generated_tempTrainee.newTId
                                                    }
                                                  </h4>
                                                </div>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col>
                                                <div className="text-center mt-3">
                                                  <button
                                                    type="button"
                                                    className="btn btn-success btn-lg me-2"
                                                    onClick={() =>
                                                      this.onCloseGenerateModal()
                                                    }
                                                  >
                                                    {this.props.t("Ok")}
                                                  </button>
                                                </div>
                                              </Col>
                                            </Row>
                                          </ModalBody>
                                        </Modal>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={
                                            (isEdit && {
                                              Id: tempTrainee.Id,
                                              FirstName:
                                                (tempTrainee &&
                                                  tempTrainee.FirstName) ||
                                                "",
                                              LastName:
                                                (tempTrainee &&
                                                  tempTrainee.LastName) ||
                                                "",
                                              FatherName:
                                                (tempTrainee &&
                                                  tempTrainee.FatherName) ||
                                                "",
                                              grandFatherName:
                                                (tempTrainee &&
                                                  tempTrainee.grandFatherName) ||
                                                "",
                                              MotherName:
                                                (tempTrainee &&
                                                  tempTrainee.MotherName) ||
                                                "",
                                              BirthLocation:
                                                (tempTrainee &&
                                                  tempTrainee.BirthLocation) ||
                                                "",
                                              FirstNameE:
                                                (tempTrainee &&
                                                  tempTrainee.FirstNameE) ||
                                                "",
                                              LastNameE:
                                                (tempTrainee &&
                                                  tempTrainee.LastNameE) ||
                                                "",
                                              FatherNameE:
                                                (tempTrainee &&
                                                  tempTrainee.FatherNameE) ||
                                                "",
                                              grandFatherNameE:
                                                (tempTrainee &&
                                                  tempTrainee.grandFatherNameE) ||
                                                "",
                                              MotherNameE:
                                                (tempTrainee &&
                                                  tempTrainee.MotherNameE) ||
                                                "",
                                              BirthLocationE:
                                                (tempTrainee &&
                                                  tempTrainee.BirthLocationE) ||
                                                "",
                                              birthdate:
                                                (tempTrainee &&
                                                  tempTrainee.birthdate) ||
                                                selectedBirthDate,
                                              NationalityId:
                                                (tempTrainee &&
                                                  tempTrainee.NationalityId) ||
                                                selectedNationalityId,
                                              GenderId:
                                                (tempTrainee &&
                                                  tempTrainee.GenderId) ||
                                                selectedGender ||
                                                "",

                                              nationalNo:
                                                (tempTrainee &&
                                                  tempTrainee.nationalNo) ||
                                                "",
                                              identityNo:
                                                (tempTrainee &&
                                                  tempTrainee.identityNo) ||
                                                "",
                                              identityIssueDate:
                                                (tempTrainee &&
                                                  tempTrainee.identityIssueDate) ||
                                                selectedIdentityIssueDate ||
                                                "",
                                              civicZone:
                                                (tempTrainee &&
                                                  tempTrainee.civicZone) ||
                                                "",
                                              registerZone:
                                                (tempTrainee &&
                                                  tempTrainee.registerZone) ||
                                                "",
                                              registerNo:
                                                (tempTrainee &&
                                                  tempTrainee.registerNo) ||
                                                "",
                                              PassNumber:
                                                (tempTrainee &&
                                                  tempTrainee.PassNumber) ||
                                                "",
                                              passportIssueDate:
                                                (tempTrainee &&
                                                  tempTrainee.passportIssueDate) ||
                                                selectedPassportIssueDate,
                                              passportExpiryDate:
                                                (tempTrainee &&
                                                  tempTrainee.passportExpiryDate) ||
                                                selectedPassportExpiryDate,
                                              diplomaId:
                                                (tempTrainee &&
                                                  tempTrainee.diplomaId) ||
                                                selectedDiploma,
                                              DiplomaCountryId:
                                                (tempTrainee &&
                                                  tempTrainee.DiplomaCountryId) ||
                                                selectedCountry,

                                              DiplomaNumber:
                                                (tempTrainee &&
                                                  tempTrainee.DiplomaNumber) ||
                                                "",
                                              DiplomaGovernorateId:
                                                (tempTrainee &&
                                                  tempTrainee.DiplomaGovernorateId) ||
                                                selectedGovernorate,

                                              /* DiplomaCityId:
                                  (tempTrainee && tempTrainee.DiplomaCityId) ||
                                  selectedCity, */

                                              DiplomaYear:
                                                (tempTrainee &&
                                                  tempTrainee.DiplomaYear) ||
                                                "",
                                              ExaminationSession:
                                                (tempTrainee &&
                                                  tempTrainee.ExaminationSession) ||
                                                "",
                                              Average:
                                                (tempTrainee &&
                                                  tempTrainee.Average) ||
                                                "",
                                              diplomaDate:
                                                (tempTrainee &&
                                                  tempTrainee.diplomaDate) ||
                                                selectedDiplomaDate,
                                              diplomaVerificationNum:
                                                (tempTrainee &&
                                                  tempTrainee.diplomaVerificationNum) ||
                                                "",
                                              diplomaVerificationDate:
                                                (tempTrainee &&
                                                  tempTrainee.diplomaVerificationDate) ||
                                                selectedDiplomaVerificationDate,
                                              socialStatusId:
                                                tempTrainee &&
                                                tempTrainee.socialStatusId,
                                              registrationCertLevelId:
                                                (tempTrainee &&
                                                  tempTrainee.registrationCertLevelId) ||
                                                selectedRegistrationCertLevelId,
                                              registrationDiplomaName:
                                                (tempTrainee &&
                                                  tempTrainee.registrationDiplomaName) ||
                                                "",
                                              registrationDiplomaDepartment:
                                                (tempTrainee &&
                                                  tempTrainee.registrationDiplomaDepartment) ||
                                                "",
                                              diplomaName:
                                                (tempTrainee &&
                                                  tempTrainee.diplomaName) ||
                                                "",

                                              registrationDiplomaAverage:
                                                (tempTrainee &&
                                                  tempTrainee.registrationDiplomaAverage) ||
                                                "",
                                              uniAverage:
                                                (tempTrainee &&
                                                  tempTrainee.uniAverage) ||
                                                "",
                                              registrationDiplomaDate:
                                                (tempTrainee &&
                                                  tempTrainee.registrationDiplomaDate) ||
                                                selectedRegistrationDiplomaDate,

                                              uniName:
                                                (tempTrainee &&
                                                  tempTrainee.uniName) ||
                                                "",
                                              UnivCountryId:
                                                (tempTrainee &&
                                                  tempTrainee.UnivCountryId) ||
                                                selectedUnivCountry,

                                              /* TransferUnivAverage:
                                  (tempTrainee && tempTrainee.TransferUnivAverage) ||
                                  "", */
                                              studyPattern:
                                                (tempTrainee &&
                                                  tempTrainee.studyPattern) ||
                                                "",
                                              /*  selectedSemester:
                                  (tempTrainee && tempTrainee.selectedSemester) ||
                                  selectedSemester ||
                                  null, */
                                              RegistrationDate:
                                                (tempTrainee &&
                                                  tempTrainee.RegistrationDate) ||
                                                selectedRegistrationDate, //""
                                              FacultyId:
                                                (tempTrainee &&
                                                  tempTrainee.FacultyId) ||
                                                selectedFacultyId,
                                              plan_study:
                                                (tempTrainee &&
                                                  tempTrainee.plan_study) ||
                                                "",
                                              CurrentAddress:
                                                (tempTrainee &&
                                                  tempTrainee.CurrentAddress) ||
                                                "",
                                              CurrentAddrPhone:
                                                (tempTrainee &&
                                                  tempTrainee.CurrentAddrPhone) ||
                                                "",
                                              CurrentAddrCell:
                                                (tempTrainee &&
                                                  tempTrainee.CurrentAddrCell) ||
                                                "",
                                              PermanentAddress:
                                                (tempTrainee &&
                                                  tempTrainee.PermanentAddress) ||
                                                "",
                                              ParentAddrPhone:
                                                (tempTrainee &&
                                                  tempTrainee.ParentAddrPhone) ||
                                                "",
                                              WhatsappMobileNum:
                                                (tempTrainee &&
                                                  tempTrainee.WhatsappMobileNum) ||
                                                "",
                                              Email:
                                                (tempTrainee &&
                                                  tempTrainee.Email) ||
                                                "",
                                              GeneralNote:
                                                (tempTrainee &&
                                                  tempTrainee.GeneralNote) ||
                                                "",
                                              academicYear:
                                                (tempTrainee &&
                                                  tempTrainee.academicYear) ||
                                                "",

                                              InstituteCountryId:
                                                (tempTrainee &&
                                                  tempTrainee.InstituteCountryId) ||
                                                selectedInstituteCountry,
                                              HighStudyTypeId:
                                                (tempTrainee &&
                                                  tempTrainee.HighStudyTypeId) ||
                                                selectedHightStudyTypeId,
                                              EstimateId:
                                                (tempTrainee &&
                                                  tempTrainee.EstimateId) ||
                                                selectedEstimateId,

                                              RegUniDate:
                                                (tempTrainee &&
                                                  tempTrainee.RegUniDate) ||
                                                selectedRegUniDate,
                                              statusId:
                                                tempTrainee &&
                                                tempTrainee.statusId,
                                            }) ||
                                            (!isEdit && {
                                              FirstName:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.FirstName) ||
                                                "",
                                              LastName:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.LastName) ||
                                                "",
                                              FatherName:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.FatherName) ||
                                                "",
                                              grandFatherName:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.grandFatherName) ||
                                                "",
                                              MotherName:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.MotherName) ||
                                                "",
                                              BirthLocation:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.BirthLocation) ||
                                                "",
                                              birthdate:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.birthdate) ||
                                                selectedBirthDate,
                                              NationalityId:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.NationalityId) ||
                                                "",
                                              diplomaId:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.diplomaId) ||
                                                "",
                                              Average:
                                                (emptyTempTrainee &&
                                                  emptyTempTrainee.Average) ||
                                                "",
                                            })
                                          }
                                          validationSchema={Yup.object().shape({
                                            FirstName: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your First Name"
                                              ),
                                            LastName: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your Last Name"
                                              ),
                                            FatherName: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your Father Name"
                                              ),
                                            diplomaId: Yup.string()
                                              .matches(/^[\u0600-\u06FF\s]+$/)
                                              .required(
                                                "Please Enter Your Certificate Type"
                                              ),
                                            ExaminationSession:
                                              Yup.string().required(
                                                "Examination Session Is Required"
                                              ),
                                            grandFatherName: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your Grandfather Name"
                                              ),
                                            MotherName: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your Mother Name"
                                              ),
                                            BirthLocation: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your Birth Location"
                                              ),
                                            FirstNameE:
                                              Yup.string().matches(
                                                /^[a-zA-Z]+$/
                                              ),
                                            LastNameE:
                                              Yup.string().matches(
                                                /^[a-zA-Z]+$/
                                              ),
                                            FatherNameE:
                                              Yup.string().matches(
                                                /^[a-zA-Z]+$/
                                              ),
                                            grandFatherNameE:
                                              Yup.string().matches(
                                                /^[a-zA-Z]+$/
                                              ),
                                            MotherNameE:
                                              Yup.string().matches(
                                                /^[a-zA-Z]+$/
                                              ),
                                            BirthLocationE:
                                              Yup.string().matches(
                                                /^[a-zA-Z]+$/
                                              ),
                                            DiplomaNumber: Yup.string()
                                              .matches(/^[0-9]+$/)
                                              .required(
                                                "Please Enter Your Certificate Number"
                                              ),
                                            DiplomaCountryId: Yup.string()
                                              .matches(/^[أ-ي]+$/)
                                              .required(
                                                "Please Enter Your Certificate Country"
                                              ),
                                            birthdate: Yup.date().required(
                                              "Please Enter Your Date of Birth"
                                            ),
                                            FacultyId: Yup.string().required(
                                              "Please Enter Your Faculty"
                                            ),

                                            Average: Yup.string()
                                              .matches(/^[0-9]+$/)
                                              .required(
                                                "Please Enter Your Average"
                                              ),
                                            Email: Yup.string().email(
                                              "Must be a valid Email"
                                            ),
                                          })}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleChange,
                                            handleBlur,
                                            setFieldValue,
                                          }) => (
                                            <Form>
                                              <Col lg="12">
                                                <Card>
                                                  <CardBody>
                                                    <div className="wizard clearfix">
                                                      <div className="steps clearfix">
                                                        <ul className="nav-list">
                                                          <NavItem
                                                            key={1}
                                                            className={`nav-item ${
                                                              this.state
                                                                .activeTab === 1
                                                                ? "current"
                                                                : ""
                                                            }`}
                                                          >
                                                            <NavLink
                                                              className={`nav-link ${
                                                                this.state
                                                                  .activeTab ===
                                                                1
                                                                  ? "active"
                                                                  : ""
                                                              }`}
                                                              onClick={() =>
                                                                this.toggleTab(
                                                                  1
                                                                )
                                                              }
                                                            >
                                                              <h3 className="navItem-header">
                                                                <span className="number">
                                                                  1.
                                                                </span>
                                                                {this.props.t(
                                                                  "Main Info"
                                                                )}
                                                              </h3>
                                                            </NavLink>
                                                          </NavItem>
                                                          <NavItem
                                                            key={2}
                                                            className={`nav-item ${
                                                              this.state
                                                                .activeTab === 2
                                                                ? "current"
                                                                : ""
                                                            }`}
                                                          >
                                                            <NavLink
                                                              className={`nav-link ${
                                                                this.state
                                                                  .activeTab ===
                                                                2
                                                                  ? "active"
                                                                  : ""
                                                              }`}
                                                              onClick={() =>
                                                                this.toggleTab(
                                                                  2
                                                                )
                                                              }
                                                            >
                                                              <h3 className="navItem-header">
                                                                <span className="number">
                                                                  2.
                                                                </span>
                                                                {this.props.t(
                                                                  "Academic Info"
                                                                )}
                                                              </h3>
                                                            </NavLink>
                                                          </NavItem>
                                                          <NavItem
                                                            key={3}
                                                            className={`nav-item ${
                                                              this.state
                                                                .activeTab === 3
                                                                ? "current"
                                                                : ""
                                                            }`}
                                                          >
                                                            <NavLink
                                                              className={`nav-link ${
                                                                this.state
                                                                  .activeTab ===
                                                                3
                                                                  ? "active"
                                                                  : ""
                                                              }`}
                                                              onClick={() =>
                                                                this.toggleTab(
                                                                  3
                                                                )
                                                              }
                                                            >
                                                              <h3 className="navItem-header">
                                                                <span className="number">
                                                                  3.
                                                                </span>
                                                                {this.props.t(
                                                                  "Contact Info"
                                                                )}
                                                              </h3>
                                                            </NavLink>
                                                          </NavItem>
                                                          <NavItem
                                                            key={4}
                                                            className={`nav-item ${
                                                              this.state
                                                                .activeTab === 4
                                                                ? "current"
                                                                : ""
                                                            }`}
                                                          >
                                                            <NavLink
                                                              className={`nav-link ${
                                                                this.state
                                                                  .activeTab ===
                                                                4
                                                                  ? "active"
                                                                  : ""
                                                              }`}
                                                              onClick={() =>
                                                                this.toggleTab(
                                                                  4
                                                                )
                                                              }
                                                            >
                                                              <h3 className="navItem-header">
                                                                <span className="number">
                                                                  4.
                                                                </span>
                                                                {this.props.t(
                                                                  "Professional experiences"
                                                                )}
                                                              </h3>
                                                            </NavLink>
                                                          </NavItem>
                                                          <NavItem
                                                            key={5}
                                                            className={`nav-item ${
                                                              this.state
                                                                .activeTab === 5
                                                                ? "current"
                                                                : ""
                                                            }`}
                                                          >
                                                            <NavLink
                                                              className={`nav-link ${
                                                                this.state
                                                                  .activeTab ===
                                                                5
                                                                  ? "active"
                                                                  : ""
                                                              }`}
                                                              onClick={() =>
                                                                this.toggleTab(
                                                                  5
                                                                )
                                                              }
                                                            >
                                                              <h3 className="navItem-header">
                                                                <span className="number">
                                                                  5.
                                                                </span>
                                                                {this.props.t(
                                                                  "Required Docs"
                                                                )}
                                                              </h3>
                                                            </NavLink>
                                                          </NavItem>
                                                        </ul>
                                                      </div>
                                                      <div className="content clearfix">
                                                        <TabContent
                                                          activeTab={
                                                            this.state.activeTab
                                                          }
                                                          className="body"
                                                        >
                                                          <TabPane
                                                            key={1}
                                                            tabId={1}
                                                          >
                                                            <Row>
                                                              <Card id="tempTrainee-card">
                                                                <CardBody className="cardBody">
                                                                  <Row>
                                                                    <div className="bordered">
                                                                      <Row>
                                                                        <Col lg="4">
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="arfirstName">
                                                                                  {this.props.t(
                                                                                    "First Name(ar)"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="FirstName"
                                                                                  id="arfirstName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.FirstName &&
                                                                                      touched.FirstName) ||
                                                                                    firstNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                {firstNameError && (
                                                                                  <div className="invalid-feedback">
                                                                                    {this.props.t(
                                                                                      "First Name is required"
                                                                                    )}
                                                                                  </div>
                                                                                )}
                                                                                <ErrorMessage
                                                                                  name="FirstName"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="arlastName">
                                                                                  {this.props.t(
                                                                                    "Last Name(ar)"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="LastName"
                                                                                  id="arlastName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.LastName &&
                                                                                      touched.LastName) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                {lastNameError && (
                                                                                  <div className="invalid-feedback">
                                                                                    {this.props.t(
                                                                                      "Last Name is required"
                                                                                    )}
                                                                                  </div>
                                                                                )}
                                                                                <ErrorMessage
                                                                                  name="LastName"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="arfatherName">
                                                                                  {this.props.t(
                                                                                    "Father Name(ar)"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="FatherName"
                                                                                  id="arfatherName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.FatherName &&
                                                                                      touched.FatherName) ||
                                                                                    fatherNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                {fatherNameError && (
                                                                                  <div className="invalid-feedback">
                                                                                    {this.props.t(
                                                                                      "Father Name is required"
                                                                                    )}
                                                                                  </div>
                                                                                )}
                                                                                <ErrorMessage
                                                                                  name="FatherName"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="argrandFatherName">
                                                                                  {this.props.t(
                                                                                    "Grandfather Name(ar)"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="grandFatherName"
                                                                                  id="argrandFatherName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.grandFatherName &&
                                                                                      touched.grandFatherName) ||
                                                                                    grandFatherNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                {grandFatherNameError && (
                                                                                  <div className="invalid-feedback">
                                                                                    {this.props.t(
                                                                                      "Father Name is required"
                                                                                    )}
                                                                                  </div>
                                                                                )}
                                                                                <ErrorMessage
                                                                                  name="grandFatherName"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="armotherName">
                                                                                  {this.props.t(
                                                                                    "Mother Name(ar)"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="MotherName"
                                                                                  id="armotherName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.MotherName &&
                                                                                      touched.MotherName) ||
                                                                                    motherNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                {motherNameError && (
                                                                                  <div className="invalid-feedback">
                                                                                    {this.props.t(
                                                                                      "Mother Name is required"
                                                                                    )}
                                                                                  </div>
                                                                                )}
                                                                                <ErrorMessage
                                                                                  name="MotherName"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="abirthLoc">
                                                                                  {this.props.t(
                                                                                    "Birth Location(ar)"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="BirthLocation"
                                                                                  id="abirthLoc"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.BirthLocation &&
                                                                                      touched.BirthLocation) ||
                                                                                    birthLocError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                {birthLocError && (
                                                                                  <div className="invalid-feedback">
                                                                                    {this.props.t(
                                                                                      "Birth Location is required"
                                                                                    )}
                                                                                  </div>
                                                                                )}
                                                                                <ErrorMessage
                                                                                  name="BirthLocation"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                        </Col>
                                                                        <Col lg="4">
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="enfirstName">
                                                                                  {this.props.t(
                                                                                    "First Name(En)"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="FirstNameE"
                                                                                  id="enfirstName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.FirstNameE &&
                                                                                      touched.FirstNameE) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <ErrorMessage
                                                                                  name="FirstNameE"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="enlastName">
                                                                                  {this.props.t(
                                                                                    "Last Name(En)"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="LastNameE"
                                                                                  id="enlastName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.LastNameE &&
                                                                                      touched.LastNameE) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <ErrorMessage
                                                                                  name="LastNameE"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="enfatherName">
                                                                                  {this.props.t(
                                                                                    "Father Name(En)"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="FatherNameE"
                                                                                  id="enfatherName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.FatherNameE &&
                                                                                      touched.FatherNameE) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <ErrorMessage
                                                                                  name="FatherNameE"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="enGrandFatherName">
                                                                                  {this.props.t(
                                                                                    "Grandfather Name(En)"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="grandFatherNameE"
                                                                                  id="enGrandFatherName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.grandFatherNameE &&
                                                                                      touched.grandFatherNameE) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <ErrorMessage
                                                                                  name="grandFatherNameE"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="enmotherName">
                                                                                  {this.props.t(
                                                                                    "Mother Name(En)"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="MotherNameE"
                                                                                  id="enmotherName"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.MotherNameE &&
                                                                                      touched.MotherNameE) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <ErrorMessage
                                                                                  name="motherNameE"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="enbirthLoc">
                                                                                  {this.props.t(
                                                                                    "Birth Location(En)"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="BirthLocationE"
                                                                                  id="enbirthLoc"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    ((errors.BirthLocationE &&
                                                                                      touched.BirthLocationE) ||
                                                                                    lastNameError
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <ErrorMessage
                                                                                  name="BirthLocationE"
                                                                                  component="div"
                                                                                  className="invalid-feedback"
                                                                                />
                                                                              </Col>
                                                                            </Row>
                                                                          </div>
                                                                        </Col>
                                                                        <Col lg="4">
                                                                          <div className="mb-3">
                                                                            <Card
                                                                              style={{
                                                                                width:
                                                                                  "18rem",
                                                                              }}
                                                                            >
                                                                              <img
                                                                                src={
                                                                                  this
                                                                                    .state
                                                                                    .photoURL
                                                                                }
                                                                              />
                                                                              <CardBody>
                                                                                <Label
                                                                                  htmlFor="photoInput"
                                                                                  className="btn btn-primary"
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Add your photo"
                                                                                  )}

                                                                                  <Input
                                                                                    name="img"
                                                                                    type="file"
                                                                                    id="photoInput"
                                                                                    accept="image/*"
                                                                                    style={{
                                                                                      display:
                                                                                        "none",
                                                                                    }}
                                                                                    onChange={
                                                                                      this
                                                                                        .handlePhotoChange
                                                                                    }
                                                                                    className={
                                                                                      "form-control"
                                                                                    }
                                                                                  />
                                                                                </Label>
                                                                              </CardBody>
                                                                            </Card>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </div>

                                                                    <div className="bordered">
                                                                      <Row>
                                                                        <Col lg="4">
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="arbirthDate">
                                                                                  {this.props.t(
                                                                                    "Date of Birth"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  name="birthdate"
                                                                                  className={`form-control ${
                                                                                    birthdateError
                                                                                      ? "is-invalid"
                                                                                      : ""
                                                                                  }`}
                                                                                  type="date"
                                                                                  value={
                                                                                    values.birthdate
                                                                                      ? new Date(
                                                                                          values.birthdate
                                                                                        )
                                                                                          .toISOString()
                                                                                          .split(
                                                                                            "T"
                                                                                          )[0]
                                                                                      : ""
                                                                                  }
                                                                                  onChange={
                                                                                    handleChange
                                                                                  }
                                                                                  onBlur={
                                                                                    handleBlur
                                                                                  }
                                                                                  id="arbirthdate-date-input"
                                                                                />
                                                                              </Col>
                                                                              {birthdateError && (
                                                                                <div className="invalid-feedback">
                                                                                  {this.props.t(
                                                                                    "Birth Date is required"
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                            </Row>
                                                                          </div>

                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <div>
                                                                                  <Label className="nationalityId">
                                                                                    {this.props.t(
                                                                                      "Nationality"
                                                                                    )}
                                                                                  </Label>
                                                                                  <span className="text-danger">
                                                                                    *
                                                                                  </span>
                                                                                </div>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Select
                                                                                  className={`form-control ${
                                                                                    nationalityError
                                                                                      ? "is-invalid"
                                                                                      : ""
                                                                                  }`}
                                                                                  name="NationalityId"
                                                                                  id="nationalityId"
                                                                                  key={`nationality_select`}
                                                                                  options={
                                                                                    nationalities
                                                                                  }
                                                                                  onChange={newValue =>
                                                                                    this.handleSelectChange(
                                                                                      "NationalityId",
                                                                                      newValue.value,
                                                                                      values
                                                                                    )
                                                                                  }
                                                                                  defaultValue={nationalities.find(
                                                                                    opt =>
                                                                                      opt.value ===
                                                                                      values.NationalityId
                                                                                  )}
                                                                                />
                                                                              </Col>
                                                                              {nationalityError && (
                                                                                <div className="invalid-feedback">
                                                                                  {this.props.t(
                                                                                    "Nationality is required"
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                            </Row>
                                                                          </div>
                                                                        </Col>
                                                                        <Col lg="4">
                                                                          <div className="mb-3">
                                                                            <Row className="align-items-center">
                                                                              <Col className="col-4">
                                                                                <Label className="form-label mt-4">
                                                                                  {this.props.t(
                                                                                    "Gender"
                                                                                  )}
                                                                                </Label>
                                                                                <span className="text-danger">
                                                                                  *
                                                                                </span>
                                                                              </Col>
                                                                              <Col
                                                                                lg="3"
                                                                                // className="mb-3"
                                                                              >
                                                                                <div className="d-flex gap-3">
                                                                                  {genders.map(
                                                                                    gender => (
                                                                                      <div
                                                                                        className="radio-button-gender d-flex align-items-center"
                                                                                        key={
                                                                                          gender.value
                                                                                        }
                                                                                      >
                                                                                        <Input
                                                                                          id="genderId"
                                                                                          className={
                                                                                            errors.GenderId &&
                                                                                            touched.GenderId
                                                                                              ? "is-invalid"
                                                                                              : ""
                                                                                          }
                                                                                          type="radio"
                                                                                          name="GenderId"
                                                                                          value={
                                                                                            gender.value
                                                                                          }
                                                                                          onChange={event => {
                                                                                            this.handleGenderChange(
                                                                                              "GenderId",
                                                                                              event
                                                                                                .target
                                                                                                .value,
                                                                                              values
                                                                                            );
                                                                                          }}
                                                                                          defaultChecked={
                                                                                            gender.value ===
                                                                                            selectedGender
                                                                                          }
                                                                                        />
                                                                                        <Label for="genderId">
                                                                                          {this.props.t(
                                                                                            gender.label
                                                                                          )}
                                                                                        </Label>
                                                                                      </div>
                                                                                    )
                                                                                  )}
                                                                                  {genderError && (
                                                                                    <div className="invalid-feedback">
                                                                                      {this.props.t(
                                                                                        "Gender is required"
                                                                                      )}
                                                                                    </div>
                                                                                  )}
                                                                                  <ErrorMessage
                                                                                    name="GenderId"
                                                                                    component="div"
                                                                                    className="invalid-feedback"
                                                                                  />
                                                                                </div>
                                                                              </Col>
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="socialStatus">
                                                                                      {t(
                                                                                        "Social Status"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Select
                                                                                      name="socialStatusId"
                                                                                      options={
                                                                                        socialStatus
                                                                                      }
                                                                                      className={`form-control`}
                                                                                      onChange={newValue => {
                                                                                        this.handleSelect(
                                                                                          "socialStatusId",
                                                                                          newValue.value,
                                                                                          values
                                                                                        );
                                                                                      }}
                                                                                      defaultValue={socialStatus.find(
                                                                                        opt =>
                                                                                          opt.value ===
                                                                                          tempTrainee?.socialStatusId
                                                                                      )}
                                                                                    />
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                            </Row>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </div>
                                                                  </Row>
                                                                </CardBody>
                                                              </Card>
                                                            </Row>

                                                            <Row>
                                                              <Accordion defaultActiveKey="1">
                                                                <Accordion.Item eventKey="2">
                                                                  <Accordion.Header>
                                                                    {this.props.t(
                                                                      "Personal Informations and Passport"
                                                                    )}
                                                                  </Accordion.Header>
                                                                  <Accordion.Body>
                                                                    <Row>
                                                                      <Col
                                                                        className="bordered"
                                                                        lg="4"
                                                                      >
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="idNum">
                                                                                {this.props.t(
                                                                                  "National No"
                                                                                )}
                                                                              </Label>
                                                                              <span className="text-danger">
                                                                                *
                                                                              </span>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="nationalNo"
                                                                                id="idNum"
                                                                                className={
                                                                                  "form-control" +
                                                                                  ((errors.nationalNo &&
                                                                                    touched.nationalNo) ||
                                                                                  nationalNoError
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />

                                                                              {nationalNoError && (
                                                                                <div className="invalid-feedback">
                                                                                  {this.props.t(
                                                                                    "National Number is required"
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                              <ErrorMessage
                                                                                name="nationalNo"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="cardNum">
                                                                                {this.props.t(
                                                                                  "Identity No"
                                                                                )}
                                                                              </Label>
                                                                              <span className="text-danger">
                                                                                *
                                                                              </span>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="identityNo"
                                                                                id="cardNum"
                                                                                className={
                                                                                  "form-control" +
                                                                                  ((errors.identityNo &&
                                                                                    touched.identityNo) ||
                                                                                  identityNoError
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              {identityNoError && (
                                                                                <div className="invalid-feedback">
                                                                                  {this.props.t(
                                                                                    "Identity Number is required"
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                              <ErrorMessage
                                                                                name="identityNo"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="emissionDate">
                                                                                {this.props.t(
                                                                                  "Identity Issue Date"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                name="identityIssueDate"
                                                                                className={`form-control`}
                                                                                type="date"
                                                                                value={
                                                                                  values.identityIssueDate
                                                                                    ? new Date(
                                                                                        values.identityIssueDate
                                                                                      )
                                                                                        .toISOString()
                                                                                        .split(
                                                                                          "T"
                                                                                        )[0]
                                                                                    : ""
                                                                                }
                                                                                onChange={
                                                                                  handleChange
                                                                                }
                                                                                onBlur={
                                                                                  handleBlur
                                                                                }
                                                                                id="identityIssueDate-date-input"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="cardCaza">
                                                                                {this.props.t(
                                                                                  "Civic Zone"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="civicZone"
                                                                                id="cardCaza"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="cardCazaReg">
                                                                                {this.props.t(
                                                                                  "Register Zone"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="registerZone"
                                                                                id="cardCazaReg"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="cardRegNum">
                                                                                {this.props.t(
                                                                                  "Register No"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="registerNo"
                                                                                id="cardRegNum"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>

                                                                      <Col
                                                                        className="bordered"
                                                                        lg="4"
                                                                      >
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="passNum">
                                                                                {this.props.t(
                                                                                  "Passport Number"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="PassNumber"
                                                                                id="passNum"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="passGrantdate">
                                                                                {this.props.t(
                                                                                  "Passport Issue Date"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                name="passportIssueDate"
                                                                                className={`form-control`}
                                                                                type="date"
                                                                                value={
                                                                                  values.passportIssueDate
                                                                                    ? new Date(
                                                                                        values.passportIssueDate
                                                                                      )
                                                                                        .toISOString()
                                                                                        .split(
                                                                                          "T"
                                                                                        )[0]
                                                                                    : ""
                                                                                }
                                                                                onChange={
                                                                                  handleChange
                                                                                }
                                                                                onBlur={
                                                                                  handleBlur
                                                                                }
                                                                                id="passportIssueDate-date-input"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="passExpDate">
                                                                                {this.props.t(
                                                                                  "Passport Expiry Date"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                name="passportExpiryDate"
                                                                                className={`form-control`}
                                                                                type="date"
                                                                                value={
                                                                                  values.passportExpiryDate
                                                                                    ? new Date(
                                                                                        values.passportExpiryDate
                                                                                      )
                                                                                        .toISOString()
                                                                                        .split(
                                                                                          "T"
                                                                                        )[0]
                                                                                    : ""
                                                                                }
                                                                                onChange={
                                                                                  handleChange
                                                                                }
                                                                                onBlur={
                                                                                  handleBlur
                                                                                }
                                                                                id="passportExpiryDate-date-input"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </Accordion.Body>
                                                                </Accordion.Item>
                                                              </Accordion>
                                                            </Row>
                                                          </TabPane>
                                                          <TabPane
                                                            key={2}
                                                            tabId={2}
                                                          >
                                                            <Row className="bordered">
                                                              <Col lg="4">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="reg-date">
                                                                        {this.props.t(
                                                                          "Registration Date"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    {isEdit && (
                                                                      <Col className="col-8">
                                                                        <Input
                                                                          type="text"
                                                                          name="RegistrationDate"
                                                                          id="reg-date"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          value={
                                                                            formattedRegistrationDate
                                                                          }
                                                                          readOnly
                                                                        />
                                                                      </Col>
                                                                    )}
                                                                    {!isEdit && (
                                                                      <Col className="col-8">
                                                                        <Input
                                                                          type="text"
                                                                          name="RegistrationDate"
                                                                          id="reg-date"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          defaultValue={
                                                                            selectedRegistrationDate
                                                                          }
                                                                          readOnly
                                                                        />
                                                                      </Col>
                                                                    )}
                                                                  </Row>
                                                                </div>
                                                              </Col>
                                                              <Row>
                                                                <Col lg="4">
                                                                  <div className="mb-2">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="regDiploma">
                                                                          {this.props.t(
                                                                            "Registered under"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <div
                                                                          name="registrationCertLevelId"
                                                                          id="regDiploma"
                                                                          role="group"
                                                                          className={
                                                                            "btn-group btn-group-example mb-3" +
                                                                            (errors.registrationCertLevelId &&
                                                                            touched.registrationCertLevelId
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                        >
                                                                          {regcertificates
                                                                            .slice()
                                                                            .sort(
                                                                              (
                                                                                a,
                                                                                b
                                                                              ) =>
                                                                                b.Id -
                                                                                a.Id
                                                                            )
                                                                            .map(
                                                                              level => (
                                                                                <button
                                                                                  key={
                                                                                    level.Id
                                                                                  }
                                                                                  type="button"
                                                                                  name="registrationCertLevelId"
                                                                                  value={
                                                                                    selectedRegistrationCertLevelId ==
                                                                                    level.arTitle //arcertificatelevel
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }
                                                                                  className={`btn btn-outline-primary w-sm ${
                                                                                    selectedRegistrationCertLevelId ===
                                                                                    level.Id
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleButtonClick2(
                                                                                      "registrationCertLevelId",
                                                                                      level.Id,
                                                                                      values
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {languageState ===
                                                                                  "ar"
                                                                                    ? level.arTitle
                                                                                    : level.enTitle}
                                                                                </button>
                                                                              )
                                                                            )}
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                              </Row>

                                                              <Row>
                                                                {isShowUlterStudy && (
                                                                  <FormGroup>
                                                                    <Row>
                                                                      <Col lg="4">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label
                                                                                for="HighStudyType_select"
                                                                                className="form-label"
                                                                              >
                                                                                {this.props.t(
                                                                                  "Certificate Type"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Select
                                                                                className={`select-style-std ${
                                                                                  facultyError
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                                name="HighStudyTypeId"
                                                                                key={`HighStudyType_select`}
                                                                                options={
                                                                                  highstudytypes
                                                                                }
                                                                                onChange={hight => {
                                                                                  setFieldValue(
                                                                                    "HighStudyTypeId",
                                                                                    hight.value
                                                                                  );
                                                                                }}
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </FormGroup>
                                                                )}
                                                              </Row>

                                                              <Row>
                                                                <Col lg="4">
                                                                  {(showNewInput ||
                                                                    isShowUlterStudy) && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="uniName"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "University Name"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="uniName"
                                                                              id="uniName"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="UnivCountryId-Id"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "University Country"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="UnivCountryId"
                                                                              placeholder="Type to search..."
                                                                              className={`form-control }`}
                                                                              list="univCountryDatalistOptions"
                                                                              value={
                                                                                values.UnivCountryId
                                                                              }
                                                                              autoComplete="off"
                                                                              onChange={event => {
                                                                                setFieldValue(
                                                                                  "UnivCountryId",
                                                                                  event
                                                                                    .target
                                                                                    .value
                                                                                );
                                                                              }}
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "UnivCountryId"
                                                                                )
                                                                              }
                                                                              id="UnivCountryId-Id"
                                                                            />

                                                                            <datalist id="univCountryDatalistOptions">
                                                                              {countries.map(
                                                                                country => (
                                                                                  <option
                                                                                    key={
                                                                                      country.key
                                                                                    }
                                                                                    value={
                                                                                      country.value
                                                                                    }
                                                                                  />
                                                                                )
                                                                              )}
                                                                            </datalist>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                                <Col lg="4">
                                                                  {(showNewInput ||
                                                                    isShowUlterStudy) && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="regUniAvg"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "University Average"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="uniAverage"
                                                                              id="regUniAvg"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="registration-Diploma-Date"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Diploma Date"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              name="RegUniDate"
                                                                              className={`form-control`}
                                                                              type="date"
                                                                              value={
                                                                                values.RegUniDate
                                                                                  ? new Date(
                                                                                      values.RegUniDate
                                                                                    )
                                                                                      .toISOString()
                                                                                      .split(
                                                                                        "T"
                                                                                      )[0]
                                                                                  : ""
                                                                              }
                                                                              onChange={
                                                                                handleChange
                                                                              }
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                              id="registrationDiploma-date-input"
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                                <Col lg="4">
                                                                  {(showNewInput ||
                                                                    isShowUlterStudy) && (
                                                                    <FormGroup>
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="Estimate-id"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Estimate"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="">
                                                                            <Select
                                                                              className={`select-style-std ${
                                                                                gradeError
                                                                                  ? "is-invalid"
                                                                                  : ""
                                                                              }`}
                                                                              name="EstimateId"
                                                                              key={`grade_select`}
                                                                              options={
                                                                                estimates
                                                                              }
                                                                              onChange={newValue => {
                                                                                this.handleSelect(
                                                                                  "EstimateId",
                                                                                  newValue.value,
                                                                                  values
                                                                                );
                                                                              }}
                                                                              defaultValue={estimates.find(
                                                                                opt =>
                                                                                  opt.value ===
                                                                                  tempTrainee?.EstimateId
                                                                              )}
                                                                            />
                                                                          </Col>
                                                                          {gradeError && (
                                                                            <div className="invalid-feedback">
                                                                              {this.props.t(
                                                                                "Estimate is required"
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                                {(showNewInput ||
                                                                  isShowUlterStudy) && (
                                                                  <FormGroup>
                                                                    <Row>
                                                                      <Col lg="4">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label
                                                                                for="faculty-id"
                                                                                className="form-label"
                                                                              >
                                                                                {this.props.t(
                                                                                  "Faculty"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Select
                                                                                className={`select-style-std ${
                                                                                  facultyError
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                                name="FacultyId"
                                                                                key={`faculty_select`}
                                                                                options={
                                                                                  faculties
                                                                                }
                                                                                onChange={faculty => {
                                                                                  setFieldValue(
                                                                                    "FacultyId",
                                                                                    faculty.value
                                                                                  );
                                                                                }}
                                                                                defaultValue={faculties.find(
                                                                                  opt =>
                                                                                    opt.label ===
                                                                                    facultyName
                                                                                )}
                                                                              />
                                                                            </Col>
                                                                            {facultyError && (
                                                                              <div className="invalid-feedback">
                                                                                {this.props.t(
                                                                                  "Faculty is required"
                                                                                )}
                                                                              </div>
                                                                            )}
                                                                          </Row>
                                                                        </div>
                                                                      </Col>

                                                                      <Col lg="4">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label
                                                                                for="study-plan"
                                                                                className="form-label"
                                                                              >
                                                                                {this.props.t(
                                                                                  "Specialty"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Input
                                                                                type="text"
                                                                                name="plan_study"
                                                                                id="study-plan"
                                                                                className="form-control"
                                                                                value={
                                                                                  values.plan_study
                                                                                }
                                                                                onChange={e =>
                                                                                  setFieldValue(
                                                                                    "plan_study",
                                                                                    e
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </FormGroup>
                                                                )}

                                                                {/* for a  not Instituteinfooooooooooooooo */}

                                                                <Col lg="4">
                                                                  {isShowInstituteinfo && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="diplomaName"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Diploma Name"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="diplomaName"
                                                                              id="diplomaName"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="reg-diploma-dep"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Diploma Department"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="registrationDiplomaDepartment"
                                                                              id="reg-diploma-dep"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                                <Col lg="4">
                                                                  {isShowInstituteinfo && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="InstituteCountryId-Id"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Institute Country"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="InstituteCountryId"
                                                                              className={`form-control }`}
                                                                              placeholder="Type to search..."
                                                                              list="InstituteCountryIdDatalistOptions"
                                                                              value={
                                                                                values.InstituteCountryId
                                                                              }
                                                                              autoComplete="off"
                                                                              onChange={event => {
                                                                                const selectedInstituteCountry =
                                                                                  event
                                                                                    .target
                                                                                    .value;
                                                                                setFieldValue(
                                                                                  "InstituteCountryId",
                                                                                  selectedInstituteCountry
                                                                                );
                                                                              }}
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "InstituteCountryId"
                                                                                )
                                                                              }
                                                                              id="InstituteCountryId-Id"
                                                                            />

                                                                            <datalist id="InstituteCountryIdDatalistOptions">
                                                                              {countries.map(
                                                                                country => (
                                                                                  <option
                                                                                    key={
                                                                                      country.key
                                                                                    }
                                                                                    value={
                                                                                      country.value
                                                                                    }
                                                                                  />
                                                                                )
                                                                              )}
                                                                            </datalist>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>

                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="registration-Diploma-Date"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Reg Diploma Date"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              name="registrationDiplomaDate"
                                                                              className={`form-control`}
                                                                              type="date"
                                                                              value={
                                                                                values.registrationDiplomaDate
                                                                                  ? new Date(
                                                                                      values.registrationDiplomaDate
                                                                                    )
                                                                                      .toISOString()
                                                                                      .split(
                                                                                        "T"
                                                                                      )[0]
                                                                                  : ""
                                                                              }
                                                                              onChange={
                                                                                handleChange
                                                                              }
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                              id="registrationDiploma-date-input"
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                                <Col lg="4">
                                                                  {isShowInstituteinfo && (
                                                                    <FormGroup>
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="grade-id"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Estimate"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col>
                                                                            <Select
                                                                              className={`select-style-std ${
                                                                                gradeError
                                                                                  ? "is-invalid"
                                                                                  : ""
                                                                              }`}
                                                                              name="EstimateId"
                                                                              key={`grade_select`}
                                                                              options={
                                                                                estimates
                                                                              }
                                                                              onChange={newValue => {
                                                                                this.handleSelect(
                                                                                  "EstimateId",
                                                                                  newValue.value,
                                                                                  values
                                                                                );
                                                                              }}
                                                                              defaultValue={estimates.find(
                                                                                opt =>
                                                                                  opt.value ===
                                                                                  tempTrainee?.EstimateId
                                                                              )}
                                                                            />
                                                                          </Col>
                                                                          {gradeError && (
                                                                            <div className="invalid-feedback">
                                                                              {this.props.t(
                                                                                "EstimateId is required"
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        </Row>
                                                                      </div>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="regDiplomaAverage"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Diploma Average"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="registrationDiplomaAverage"
                                                                              id="regDiplomaAverage"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                              </Row>

                                                              <Row>
                                                                <Col lg="4">
                                                                  {showUniForm && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="uniName"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "University Name"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="uniName"
                                                                              id="uniName"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="UnivCountryId-Id"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "University Country"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="UnivCountryId"
                                                                              className={`form-control }`}
                                                                              placeholder="Type to search..."
                                                                              list="univCountryDatalistOptions"
                                                                              value={
                                                                                values.UnivCountryId
                                                                              }
                                                                              autoComplete="off"
                                                                              onChange={event => {
                                                                                setFieldValue(
                                                                                  "UnivCountryId",
                                                                                  event
                                                                                    .target
                                                                                    .value
                                                                                );
                                                                              }}
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "UnivCountryId"
                                                                                )
                                                                              }
                                                                              id="UnivCountryId-Id"
                                                                            />

                                                                            <datalist id="univCountryDatalistOptions">
                                                                              {countries.map(
                                                                                country => (
                                                                                  <option
                                                                                    key={
                                                                                      country.key
                                                                                    }
                                                                                    value={
                                                                                      country.value
                                                                                    }
                                                                                  />
                                                                                )
                                                                              )}
                                                                            </datalist>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                                <Col lg="4">
                                                                  {showUniForm && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="academicYear"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Academic Year"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="academicYear"
                                                                              id="academicYear"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                              value={
                                                                                values.academicYear
                                                                              }
                                                                              onChange={event => {
                                                                                setFieldValue(
                                                                                  "academicYear",
                                                                                  event
                                                                                    .target
                                                                                    .value
                                                                                );
                                                                              }}
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </FormGroup>
                                                                  )}
                                                                </Col>
                                                              </Row>
                                                              <Row>
                                                                {showUniForm && (
                                                                  <FormGroup>
                                                                    <Row>
                                                                      <Col lg="4">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label
                                                                                for="faculty-id"
                                                                                className="form-label"
                                                                              >
                                                                                {this.props.t(
                                                                                  "Faculty"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Select
                                                                                className={`select-style-std ${
                                                                                  facultyError
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                                name="FacultyId"
                                                                                key={`faculty_select`}
                                                                                options={
                                                                                  faculties
                                                                                }
                                                                                onChange={faculty => {
                                                                                  setFieldValue(
                                                                                    "FacultyId",
                                                                                    faculty.value
                                                                                  );
                                                                                }}
                                                                              />
                                                                            </Col>
                                                                            {facultyError && (
                                                                              <div className="invalid-feedback">
                                                                                {this.props.t(
                                                                                  "Faculty is required"
                                                                                )}
                                                                              </div>
                                                                            )}
                                                                          </Row>
                                                                        </div>
                                                                      </Col>

                                                                      <Col lg="4">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label
                                                                                for="study-plan"
                                                                                className="form-label"
                                                                              >
                                                                                {this.props.t(
                                                                                  "Specialty"
                                                                                )}
                                                                              </Label>
                                                                              <span className="text-danger">
                                                                                *
                                                                              </span>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Input
                                                                                type="text"
                                                                                name="plan_study"
                                                                                id="study-plan"
                                                                                className={
                                                                                  "form-control" +
                                                                                  ((errors.plan_study &&
                                                                                    touched.plan_study) ||
                                                                                  plan_studyError
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                                value={
                                                                                  values.plan_study
                                                                                }
                                                                                onChange={e =>
                                                                                  setFieldValue(
                                                                                    "plan_study",
                                                                                    e
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                              />
                                                                              {plan_studyError && (
                                                                                <div className="invalid-feedback">
                                                                                  {this.props.t(
                                                                                    "Specialty is required"
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                              <ErrorMessage
                                                                                name="plan_study"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </FormGroup>
                                                                )}
                                                              </Row>

                                                              <Card>
                                                                {!isHightSchooll && (
                                                                  <CardTitle id="card_header">
                                                                    {this.props.t(
                                                                      "Hight School Diploma Info "
                                                                    )}
                                                                  </CardTitle>
                                                                )}

                                                                <CardBody>
                                                                  <Row>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="diploma-id">
                                                                              {this.props.t(
                                                                                "Diploma Type"
                                                                              )}
                                                                            </Label>
                                                                            <span className="text-danger">
                                                                              *
                                                                            </span>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="diplomaId"
                                                                              id="diploma-Id"
                                                                              list="certificateDatalistOptions"
                                                                              placeholder="Type to search..."
                                                                              onBlur={() =>
                                                                                this.handleInputBlur(
                                                                                  "diplomaId"
                                                                                )
                                                                              }
                                                                              autoComplete="off"
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "diplomaId"
                                                                                )
                                                                              }
                                                                              onChange={event =>
                                                                                this.handleDiplomaSelect(
                                                                                  event,
                                                                                  "diplomaId",
                                                                                  setFieldValue,
                                                                                  values
                                                                                )
                                                                              }
                                                                              value={
                                                                                (
                                                                                  diplomalevels.find(
                                                                                    certificate =>
                                                                                      certificate.key ===
                                                                                      selectedDiploma
                                                                                  ) ||
                                                                                  ""
                                                                                )
                                                                                  .value
                                                                              }
                                                                              className={
                                                                                "form-control" +
                                                                                ((errors.diplomaId &&
                                                                                  touched.diplomaId) ||
                                                                                diplomaIdError
                                                                                  ? " is-invalid"
                                                                                  : "")
                                                                              }
                                                                            />
                                                                            <datalist id="certificateDatalistOptions">
                                                                              {diplomalevels.map(
                                                                                certificate => (
                                                                                  <option
                                                                                    key={
                                                                                      certificate.key
                                                                                    }
                                                                                    value={
                                                                                      certificate.value
                                                                                    }
                                                                                  />
                                                                                )
                                                                              )}
                                                                            </datalist>
                                                                            {diplomaIdError && (
                                                                              <div className="invalid-feedback">
                                                                                {this.props.t(
                                                                                  "Certificate is required"
                                                                                )}
                                                                              </div>
                                                                            )}
                                                                            <ErrorMessage
                                                                              name="diplomaId"
                                                                              component="div"
                                                                              className="invalid-feedback"
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                  <Row>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="diplomaCountry">
                                                                              {this.props.t(
                                                                                "Diploma Country"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="DiplomaCountryId"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                              placeholder="Type to search..."
                                                                              list="CountrydatalistOptions"
                                                                              value={
                                                                                values.DiplomaCountryId
                                                                              }
                                                                              autoComplete="off"
                                                                              onChange={event => {
                                                                                const selectedCountry =
                                                                                  event
                                                                                    .target
                                                                                    .value;
                                                                                setFieldValue(
                                                                                  "DiplomaCountryId",
                                                                                  selectedCountry
                                                                                );
                                                                              }}
                                                                              onBlur={
                                                                                handleBlur
                                                                              }
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "DiplomaCountryId"
                                                                                )
                                                                              }
                                                                              id="diplomaCountry"
                                                                            />

                                                                            <datalist id="CountrydatalistOptions">
                                                                              {/* {countries.map(
                                                                                country => (
                                                                                  <option
                                                                                    key={
                                                                                      country.key
                                                                                    }
                                                                                    value={
                                                                                      country.value
                                                                                    }
                                                                                  />
                                                                                )
                                                                              )} */}
                                                                              {countries.map(
                                                                                country => (
                                                                                  <option
                                                                                    key={
                                                                                      country.key
                                                                                    }
                                                                                    value={
                                                                                      country.value
                                                                                    }
                                                                                  >
                                                                                    {
                                                                                      country.value
                                                                                    }
                                                                                  </option>
                                                                                )
                                                                              )}
                                                                            </datalist>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="diplomaGovernorate">
                                                                              {this.props.t(
                                                                                "Governorate"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="DiplomaGovernorateId"
                                                                              className={`form-control }`}
                                                                              placeholder="Type to search..."
                                                                              list="GovernoratedatalistOptions"
                                                                              value={
                                                                                values.DiplomaGovernorateId
                                                                              }
                                                                              autoComplete="off"
                                                                              onChange={event => {
                                                                                setFieldValue(
                                                                                  "DiplomaGovernorateId",
                                                                                  event
                                                                                    .target
                                                                                    .value
                                                                                );
                                                                              }}
                                                                              // onChange={event =>
                                                                              //   this.handleGovernorateSelect(
                                                                              //     event,
                                                                              //     "DiplomaGovernorateId",
                                                                              //     setFieldValue,
                                                                              //     values
                                                                              //   )
                                                                              // }
                                                                              onBlur={() =>
                                                                                this.handleInputBlur(
                                                                                  "DiplomaGovernorateId"
                                                                                )
                                                                              }
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "DiplomaGovernorateId"
                                                                                )
                                                                              }
                                                                              id="diplomaGovernorate-Id"
                                                                            />

                                                                            <datalist id="GovernoratedatalistOptions">
                                                                              {governorates.map(
                                                                                governorate => (
                                                                                  <option
                                                                                    key={
                                                                                      governorate.key
                                                                                    }
                                                                                    value={
                                                                                      governorate.value
                                                                                    }
                                                                                  />
                                                                                )
                                                                              )}
                                                                            </datalist>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                  <Row>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="diploma-year">
                                                                              {this.props.t(
                                                                                "High School Year"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="DiplomaYear"
                                                                              id="diploma-year"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                            <span className="font-13 text-muted">
                                                                              yyyy
                                                                            </span>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="exam-session">
                                                                              {this.props.t(
                                                                                "Examination Session"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <div
                                                                              name="ExaminationSession"
                                                                              id="exam-session"
                                                                              role="group"
                                                                              className={
                                                                                "btn-group btn-group-example mb-3 bg-transparent form-control"
                                                                              }
                                                                            >
                                                                              <button
                                                                                id="firstSession"
                                                                                type="button"
                                                                                name="ExaminationSession"
                                                                                value={
                                                                                  selectedExaminationSession ==
                                                                                  "firstSession"
                                                                                    ? "active"
                                                                                    : ""
                                                                                }
                                                                                className={`btn btn-outline-primary w-sm ${
                                                                                  selectedExaminationSession ===
                                                                                  "firstSession"
                                                                                    ? "active"
                                                                                    : ""
                                                                                }`}
                                                                                onClick={() =>
                                                                                  this.handleButtonClick(
                                                                                    "ExaminationSession",
                                                                                    "firstSession"
                                                                                  )
                                                                                }
                                                                              >
                                                                                {this.props.t(
                                                                                  "First Session"
                                                                                )}
                                                                              </button>

                                                                              <button
                                                                                id="secondSession"
                                                                                type="button"
                                                                                name="ExaminationSession"
                                                                                value={
                                                                                  selectedExaminationSession ===
                                                                                  "secondSession"
                                                                                    ? "active"
                                                                                    : ""
                                                                                }
                                                                                className={`btn btn-outline-primary w-sm ${
                                                                                  selectedExaminationSession ===
                                                                                  "secondSession"
                                                                                    ? "active"
                                                                                    : ""
                                                                                }`}
                                                                                onClick={() =>
                                                                                  this.handleButtonClick(
                                                                                    "ExaminationSession",
                                                                                    "secondSession"
                                                                                  )
                                                                                }
                                                                              >
                                                                                {this.props.t(
                                                                                  "Second Session"
                                                                                )}
                                                                              </button>
                                                                            </div>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="diploma-num">
                                                                              {this.props.t(
                                                                                "Diploma Number"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="DiplomaNumber"
                                                                              id="diploma-num"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                  <Row>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="avg">
                                                                              {this.props.t(
                                                                                "Average"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <InputGroup>
                                                                              <Field
                                                                                type="text"
                                                                                name="Average"
                                                                                id="avg"
                                                                                className="form-control"
                                                                              />
                                                                              <div className="input-group-text">
                                                                                %
                                                                              </div>

                                                                              <ErrorMessage
                                                                                name="Average"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </InputGroup>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>

                                                                  <Row>
                                                                    {/*   <Col lg="4">
                                                                                                  <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="diploma-verficationNum">
                                                                                                          {this.props.t(
                                                                                                            "Verification Number"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <Field
                                                                                                          type="text"
                                                                                                          name="diplomaVerificationNum"
                                                                                                          id="diploma-verficationNum"
                                                                                                          className={
                                                                                                            "form-control"
                                                                                                          }
                                                                                                        />
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div>
                                                                                                </Col>
                                                                                                <Col lg="4">
                                                                                                  <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="diploma-verficationDate">
                                                                                                          {this.props.t(
                                                                                                            "Verification Date"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <Field
                                                                                                          name="diplomaVerificationDate"
                                                                                                          className={`form-control`}
                                                                                                          type="date"
                                                                                                          value={
                                                                                                            values.diplomaVerificationDate
                                                                                                              ? new Date(
                                                                                                                  values.diplomaVerificationDate
                                                                                                                )
                                                                                                                  .toISOString()
                                                                                                                  .split(
                                                                                                                    "T"
                                                                                                                  )[0]
                                                                                                              : ""
                                                                                                          }
                                                                                                          onChange={
                                                                                                            handleChange
                                                                                                          }
                                                                                                          onBlur={
                                                                                                            handleBlur
                                                                                                          }
                                                                                                          id="diplomaVerificationDate-date-input"
                                                                                                        />
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div>
                                                                                                </Col> */}
                                                                  </Row>
                                                                  <Row>
                                                                    {/*     <Col lg="4">
                                                                                                  <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="study-pattern">
                                                                                                          {this.props.t(
                                                                                                            "Study Pattern"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <div
                                                                                                          name="studyPattern"
                                                                                                          id="study-pattern"
                                                                                                          role="group"
                                                                                                          className={
                                                                                                            "btn-group btn-group-example mb-3" +
                                                                                                            (errors.studyPattern &&
                                                                                                            touched.studyPattern
                                                                                                              ? " is-invalid"
                                                                                                              : "")
                                                                                                          }
                                                                                                        >
                                                                                                          <button
                                                                                                            id="creditHours"
                                                                                                            type="button"
                                                                                                            name="studyPattern"
                                                                                                            value={
                                                                                                              selectedStudyPattern ==
                                                                                                              "creditHours"
                                                                                                                ? "active"
                                                                                                                : ""
                                                                                                            }
                                                                                                            className={`btn btn-outline-primary w-sm ${
                                                                                                              selectedStudyPattern ===
                                                                                                              "creditHours"
                                                                                                                ? "active"
                                                                                                                : ""
                                                                                                            }`}
                                                                                                            onClick={() =>
                                                                                                              this.handleButtonClick(
                                                                                                                "studyPattern",
                                                                                                                "creditHours"
                                                                                                              )
                                                                                                            }
                                                                                                          >
                                                                                                            {this.props.t(
                                                                                                              "Credit Hours"
                                                                                                            )}
                                                                                                          </button>
                                                                                                          <button
                                                                                                            id="semester"
                                                                                                            type="button"
                                                                                                            name="studyPattern"
                                                                                                            value={
                                                                                                              selectedStudyPattern ==
                                                                                                              "semester"
                                                                                                                ? "active"
                                                                                                                : ""
                                                                                                            }
                                                                                                            className={`btn btn-outline-primary w-sm ${
                                                                                                              selectedStudyPattern ===
                                                                                                              "semester"
                                                                                                                ? "active"
                                                                                                                : ""
                                                                                                            }`}
                                                                                                            onClick={() =>
                                                                                                              this.handleButtonClick(
                                                                                                                "studyPattern",
                                                                                                                "semester"
                                                                                                              )
                                                                                                            }
                                                                                                          >
                                                                                                            {this.props.t(
                                                                                                              "Semester"
                                                                                                            )}
                                                                                                          </button>
                                                                                                        </div>
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div>
                                                                                                </Col> */}
                                                                  </Row>

                                                                  <Row>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="hasBrother"
                                                                              className="form-label"
                                                                            >
                                                                              {this.props.t(
                                                                                "Has Sibling / Relative"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <div className="form-check mb-2">
                                                                              <input
                                                                                type="checkbox"
                                                                                name="HasBrother"
                                                                                className={`form-check-input input-mini`}
                                                                                onChange={
                                                                                  this
                                                                                    .handleHasBrotherChange
                                                                                }
                                                                                defaultChecked={
                                                                                  HasBrotherCheck
                                                                                }
                                                                              />
                                                                            </div>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                    <Col lg="4">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col lg="4">
                                                                            <Label
                                                                              for="tempTraineeStatus-Id"
                                                                              className="form-label d-flex"
                                                                            >
                                                                              {this.props.t(
                                                                                "Trainee Status"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Select
                                                                              id="tempTraineeStatus-Id"
                                                                              name="statusId"
                                                                              options={
                                                                                tempTraineeStatus
                                                                              }
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                              onChange={newValue =>
                                                                                this.handleSelect(
                                                                                  "statusId",
                                                                                  newValue.value,
                                                                                  values
                                                                                )
                                                                              }
                                                                              defaultValue={tempTraineeStatus.find(
                                                                                opt =>
                                                                                  opt.value ===
                                                                                  tempTrainee?.statusId
                                                                              )}
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                  {/* <Row>
                                                                    {showSiblingsSelect && (
                                                                      <Col lg="4">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4"></Col>
                                                                            <Col className="col-8">
                                                                              <Select
                                                                                value={
                                                                                  siblingsArray
                                                                                }
                                                                                name="tempSiblings"
                                                                                isMulti={
                                                                                  true
                                                                                }
                                                                                onChange={selectedOption =>
                                                                                  this.handleMulti(
                                                                                    "tempSiblings",
                                                                                    selectedOption
                                                                                  )
                                                                                }
                                                                                options={
                                                                                  universityStudents
                                                                                }
                                                                                classNamePrefix="select2-selection"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    )}
                                                                  </Row> */}
                                                                </CardBody>
                                                              </Card>
                                                            </Row>
                                                          </TabPane>
                                                          <TabPane
                                                            key={3}
                                                            tabId={3}
                                                          >
                                                            <Row className="bordered">
                                                              <Row>
                                                                <Col
                                                                  className="bordered"
                                                                  lg="4"
                                                                >
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="current-address">
                                                                          {this.props.t(
                                                                            "Current Address"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="CurrentAddress"
                                                                          id="current-address"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  {/* <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="current-street">
                                                                                                          {this.props.t(
                                                                                                            "Current Street"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <Field
                                                                                                          type="text"
                                                                                                          name="currentAddrStreet"
                                                                                                          id="current-street"
                                                                                                          className={
                                                                                                            "form-control"
                                                                                                          }
                                                                                                        />
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div>
                                                                                                  <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="current-building">
                                                                                                          {this.props.t(
                                                                                                            "Current Building Number"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <Field
                                                                                                          type="text"
                                                                                                          name="currentAddrBuildingNum"
                                                                                                          id="current-building"
                                                                                                          className={
                                                                                                            "form-control"
                                                                                                          }
                                                                                                        />
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div> */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="current-phone">
                                                                          {this.props.t(
                                                                            "Current Phone"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="CurrentAddrPhone"
                                                                          id="current-phone"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="current-cell">
                                                                          {this.props.t(
                                                                            "Current Mobile"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="CurrentAddrCell"
                                                                          id="current-cell"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                                <Col
                                                                  className="bordered"
                                                                  lg="4"
                                                                >
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="permenant-address">
                                                                          {this.props.t(
                                                                            "Permanent Address"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="PermanentAddress"
                                                                          id="permenant-address"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  {/* <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="permenant-street">
                                                                                                          {this.props.t(
                                                                                                            "Permanent Street"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <Field
                                                                                                          type="text"
                                                                                                          name="permanentAddrStreet"
                                                                                                          id="permenant-street"
                                                                                                          className={
                                                                                                            "form-control"
                                                                                                          }
                                                                                                        />
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div>
                                                                                                  <div className="mb-3">
                                                                                                    <Row>
                                                                                                      <Col className="col-4">
                                                                                                        <Label for="permenant-building">
                                                                                                          {this.props.t(
                                                                                                            "Permanent Building Number"
                                                                                                          )}
                                                                                                        </Label>
                                                                                                      </Col>
                                                                                                      <Col className="col-8">
                                                                                                        <Field
                                                                                                          type="text"
                                                                                                          name="permanentAddrBuildingNum"
                                                                                                          id="permenant-building"
                                                                                                          className={
                                                                                                            "form-control"
                                                                                                          }
                                                                                                        />
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                  </div> */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="permenant-phobe">
                                                                          {this.props.t(
                                                                            "Parent Phone"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="ParentAddrPhone"
                                                                          id="permenant-phobe"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="permenant-cell">
                                                                          {this.props.t(
                                                                            "Whatsapp Mobile"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="WhatsappMobileNum"
                                                                          id="permenant-cell"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                        />
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                              </Row>
                                                              <Row>
                                                                <Col
                                                                  className="bordered"
                                                                  lg="8"
                                                                >
                                                                  <Row>
                                                                    <Col lg="6">
                                                                      <div className="mb-3">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label for="email">
                                                                              {this.props.t(
                                                                                "Email"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <InputGroup>
                                                                              <Field
                                                                                type="text"
                                                                                name="Email"
                                                                                id="email"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                              />
                                                                              <div className="input-group-text">
                                                                                @
                                                                              </div>
                                                                            </InputGroup>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                      <div className="md-3">
                                                                        <Row>
                                                                          <Col className="col-4 text-center">
                                                                            <Label for="note">
                                                                              {this.props.t(
                                                                                "Notes"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="textarea"
                                                                              name="GeneralNote"
                                                                              as="textarea"
                                                                              id="note"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </Col>
                                                              </Row>
                                                            </Row>
                                                            {/*     <Row>
                                                                                              <Accordion defaultActiveKey="1">
                                                                                                <Accordion.Item eventKey="2">
                                                                                                  <Accordion.Header>
                                                                                                    {this.props.t(
                                                                                                      "Relatives Information"
                                                                                                    )}
                                                                                                  </Accordion.Header>
                                                                                                  <Accordion.Body>
                                                                                                    {duplicateErrorRelative && (
                                                                                                      <Alert
                                                                                                        color="danger"
                                                                                                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                                        role="alert"
                                                                                                      >
                                                                                                        {
                                                                                                          duplicateErrorRelative
                                                                                                        }
                                                                                                        <button
                                                                                                          type="button"
                                                                                                          className="btn-close"
                                                                                                          aria-label="Close"
                                                                                                          onClick={
                                                                                                            this
                                                                                                              .handleAlertCloseRelative
                                                                                                          }
                                                                                                        ></button>
                                                                                                      </Alert>
                                                                                                    )}
                                                                                                    <Row>
                                                                                                      <Col>
                                                                                                        <div className="text-sm-end">
                                                                                                          <Tooltip
                                                                                                            title={this.props.t(
                                                                                                              "Add"
                                                                                                            )}
                                                                                                            placement="top"
                                                                                                          >
                                                                                                            <IconButton
                                                                                                              color="primary"
                                                                                                              onClick={
                                                                                                                this
                                                                                                                  .handleAddRowRelative
                                                                                                              }
                                                                                                            >
                                                                                                              <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                                                            </IconButton>
                                                                                                          </Tooltip>
                                                                                                        </div>
                                                                                                      </Col>
                                                                                                    </Row>
                                                                                                    <BootstrapTable
                                                                                                      keyField="Id"
                                                                                                      data={relativesArray}
                                                                                                      columns={
                                                                                                        ParentsColumns
                                                                                                      }
                                                                                                      cellEdit={cellEditFactory(
                                                                                                        {
                                                                                                          mode: "click",
                                                                                                          blurToSave: true,
                                                                                                          afterSaveCell: (
                                                                                                            oldValue,
                                                                                                            newValue,
                                                                                                            row,
                                                                                                            column
                                                                                                          ) => {
                                                                                                            this.handleParentsDataChange(
                                                                                                              row.Id,
                                                                                                              column.dataField,
                                                                                                              newValue
                                                                                                            );
                                                                                                          },
                                                                                                        }
                                                                                                      )}
                                                                                                      noDataIndication={t(
                                                                                                        "No Relatives Found"
                                                                                                      )}
                                                                                                      defaultSorted={
                                                                                                        defaultSorting
                                                                                                      }
                                                                                                    />
                                                                                                  </Accordion.Body>
                                                                                                </Accordion.Item>
                                                                                              </Accordion>
                                                                                            </Row> */}
                                                          </TabPane>
                                                          <TabPane
                                                            key={4}
                                                            tabId={4}
                                                          >
                                                            <Row className="documents-table">
                                                              <Col>
                                                                <Card>
                                                                  <CardBody>
                                                                    <div className="table-responsive">
                                                                      {/* {duplicateErrorProfExperiences && (
                                                                                                        <Alert
                                                                                                          color="danger"
                                                                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                                          role="alert"
                                                                                                        >
                                                                                                          {
                                                                                                            duplicateErrorProfExperiences
                                                                                                          }
                                                                                                          <button
                                                                                                            type="button"
                                                                                                            className="btn-close"
                                                                                                            aria-label="Close"
                                                                                                            onClick={
                                                                                                              this
                                                                                                                .handleAlertCloseProfExperiences
                                                                                                            }
                                                                                                          ></button>
                                                                                                        </Alert>
                                                                                                      )} */}
                                                                      <Row>
                                                                        <div>
                                                                          {errorMessage1 && (
                                                                            <Alert
                                                                              color="danger"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                errorMessage1
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleExpErrorClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
                                                                        </div>
                                                                        <div>
                                                                          {successMessage1 && (
                                                                            <Alert
                                                                              color="success"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                successMessage1
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleExpSuccessClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
                                                                        </div>
                                                                      </Row>
                                                                      <div>
                                                                        {duplicateErrorProfExperiences && (
                                                                          <Alert
                                                                            color="danger"
                                                                            className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                            role="alert"
                                                                          >
                                                                            {
                                                                              duplicateErrorProfExperiences
                                                                            }
                                                                            <button
                                                                              type="button"
                                                                              className="btn-close"
                                                                              aria-label="Close"
                                                                              onClick={
                                                                                this
                                                                                  .handleAlertClose
                                                                              }
                                                                            ></button>
                                                                          </Alert>
                                                                        )}
                                                                        {deleted ==
                                                                          0 &&
                                                                          showAlert && (
                                                                            <Alert
                                                                              color="danger"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                alertMessage
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleExpErrorClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
                                                                        {deleted ==
                                                                          1 &&
                                                                          showAlert && (
                                                                            <Alert
                                                                              color="success"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                alertMessage
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleExpSuccessClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
                                                                      </div>
                                                                      <Row>
                                                                        <Col>
                                                                          <div className="text-sm-end">
                                                                            <Tooltip
                                                                              title={this.props.t(
                                                                                "Add"
                                                                              )}
                                                                              placement="top"
                                                                            >
                                                                              <IconButton
                                                                                color="primary"
                                                                                onClick={
                                                                                  this
                                                                                    .handelAddExperience
                                                                                }
                                                                                disabled={
                                                                                  !lastAddedId &&
                                                                                  !isEdit
                                                                                }
                                                                              >
                                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                              </IconButton>
                                                                            </Tooltip>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                      <DeleteModal
                                                                        show={
                                                                          deleteModal
                                                                        }
                                                                        onDeleteClick={
                                                                          this
                                                                            .handleDelete
                                                                        }
                                                                        onCloseClick={() =>
                                                                          this.setState(
                                                                            {
                                                                              deleteModal: false,
                                                                              selectedRowId:
                                                                                null,
                                                                            }
                                                                          )
                                                                        }
                                                                      />
                                                                      <BootstrapTable
                                                                        keyField="Id"
                                                                        data={
                                                                          profExperiencesArray
                                                                        }
                                                                        columns={
                                                                          trnProfExperienceColumns
                                                                        }
                                                                        cellEdit={cellEditFactory(
                                                                          {
                                                                            mode: "dbclick",
                                                                            blurToSave: true,
                                                                            afterSaveCell:
                                                                              (
                                                                                oldValue,
                                                                                newValue,
                                                                                row,
                                                                                column
                                                                              ) => {
                                                                                this.handleExperienceDataChange(
                                                                                  row.Id,
                                                                                  column.dataField,
                                                                                  newValue
                                                                                );
                                                                              },
                                                                          }
                                                                        )}
                                                                      />
                                                                    </div>
                                                                  </CardBody>
                                                                </Card>
                                                              </Col>
                                                            </Row>
                                                          </TabPane>
                                                          <TabPane
                                                            key={5}
                                                            tabId={5}
                                                          >
                                                            <Row className="documents-table">
                                                              <Col>
                                                                <Card>
                                                                  <CardBody>
                                                                    <div className="table-responsive">
                                                                      <BootstrapTable
                                                                        keyField="Id"
                                                                        data={
                                                                          stdDocsArray
                                                                        }
                                                                        columns={
                                                                          preReqColumns
                                                                        }
                                                                        key={
                                                                          document.Id
                                                                        }
                                                                        cellEdit={cellEditFactory(
                                                                          {
                                                                            mode: "click",
                                                                            blurToSave: true,
                                                                            afterSaveCell:
                                                                              (
                                                                                oldValue,
                                                                                newValue,
                                                                                row,
                                                                                column
                                                                              ) => {
                                                                                this.handleRegReqDocDataChange(
                                                                                  row.Id,
                                                                                  column.dataField,
                                                                                  newValue
                                                                                );
                                                                              },
                                                                          }
                                                                        )}
                                                                      />
                                                                    </div>
                                                                  </CardBody>
                                                                </Card>
                                                              </Col>
                                                            </Row>
                                                          </TabPane>
                                                        </TabContent>
                                                      </div>
                                                      <div className="actions clearfix">
                                                        <ul>
                                                          {(isEdit ||
                                                            (showGenerateButton &&
                                                              this.state
                                                                .activeTab ===
                                                                3)) && (
                                                            <li>
                                                              <Link
                                                                to="#"
                                                                className="generate-button"
                                                                onClick={() => {
                                                                  this.handleGenerateTempTrainee(
                                                                    values.Id
                                                                  );
                                                                }}
                                                              >
                                                                {this.props.t(
                                                                  "Generate"
                                                                )}
                                                              </Link>
                                                            </li>
                                                          )}

                                                          {!isEdit &&
                                                            this.state
                                                              .activeTab ===
                                                              3 && (
                                                              <li>
                                                                <Link
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleSave(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  save
                                                                </Link>
                                                              </li>
                                                            )}
                                                          {isEdit &&
                                                            this.state
                                                              .activeTab ===
                                                              3 && (
                                                              <li>
                                                                <Link
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleSave(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  save
                                                                </Link>
                                                              </li>
                                                            )}

                                                          {!isEdit &&
                                                            this.state
                                                              .activeTab ===
                                                              4 && (
                                                              <li>
                                                                <Link
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleExperienceSubmit(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  save
                                                                </Link>
                                                              </li>
                                                            )}
                                                          {isEdit &&
                                                            this.state
                                                              .activeTab ===
                                                              4 && (
                                                              <li>
                                                                <Link
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleExperienceSubmit(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  save
                                                                </Link>
                                                              </li>
                                                            )}
                                                          {!isEdit &&
                                                            this.state
                                                              .activeTab ===
                                                              5 && (
                                                              <li>
                                                                <Link
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleSubmit(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  save
                                                                </Link>
                                                              </li>
                                                            )}
                                                          {isEdit &&
                                                            this.state
                                                              .activeTab ===
                                                              5 && (
                                                              <li>
                                                                <Link
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleSubmit(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  save
                                                                </Link>
                                                              </li>
                                                            )}

                                                          <li
                                                            className={
                                                              this.state
                                                                .activeTab === 1
                                                                ? "previous disabled"
                                                                : "previous"
                                                            }
                                                          >
                                                            <Link
                                                              to="#"
                                                              onClick={() => {
                                                                this.toggleTab(
                                                                  this.state
                                                                    .activeTab -
                                                                    1
                                                                );
                                                              }}
                                                            >
                                                              {this.props.t(
                                                                "Previous"
                                                              )}
                                                            </Link>
                                                          </li>
                                                          <li
                                                            className={
                                                              this.state
                                                                .activeTab === 5
                                                                ? "next disabled"
                                                                : "next"
                                                            }
                                                          >
                                                            <Link
                                                              to="#"
                                                              onClick={() => {
                                                                this.toggleTab(
                                                                  this.state
                                                                    .activeTab +
                                                                    1
                                                                );
                                                              }}
                                                            >
                                                              {this.props.t(
                                                                "Next"
                                                              )}
                                                            </Link>
                                                          </li>
                                                        </ul>
                                                      </div>
                                                    </div>
                                                  </CardBody>
                                                </Card>
                                              </Col>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  tempTrainees,
  nationalities,
  mobAppFacultyAccs,
  countries,
  generalManagements,
  cities,
  diplomalevels,
  certificates,
  governorates,
  regReqDocuments,
  genders,
  certificatelevels,
  admissionConditions,
  semesters,
  academiccertificates,
  highstudytypes,
  grants,
  years,
  menu_items,
  relatives,
  estimates,
}) => ({
  tempTrainees: tempTrainees.tempTrainees,
  years: years.years,
  deleted: tempTrainees.deleted,
  tempTrainees: tempTrainees.tempTrainees,
  lastAddedId: tempTrainees.lastAddedId,
  trnProfExperiences: tempTrainees.trnProfExperiences,
  tempTraineesDocuments: tempTrainees.tempTraineesDocuments,
  nationalities: nationalities.nationalities,
  faculties: mobAppFacultyAccs.faculties,
  countries: countries.countries,
  currentSemester: semesters.currentSemester,
  cities: cities.cities,
  diplomalevels: diplomalevels.diplomalevels,
  governorates: governorates.governorates,
  regReqDocuments: regReqDocuments.regReqDocuments,
  genders: genders.genders,
  academiccertificates: academiccertificates.academiccertificates,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  tempRelatives: tempTrainees.tempRelatives,
  socialStatus: tempTrainees.socialStatus,
  relatives: relatives.relatives,
  regcertificates: tempTrainees.regcertificates,
  deleted: tempTrainees.deleted,
  highstudytypes: highstudytypes.highstudytypes,
  estimates: estimates.estimates,
  requiredDocs: tempTrainees.requiredDocs,
  tempTraineeStatus: tempTrainees.tempTraineeStatus,
  generated_tempTrainee: tempTrainees.generated_tempTrainee,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTempTrainees: lang => dispatch(getTempTrainees(lang)),
  onAddNewTempTrainee: tempTrainee => dispatch(addNewTempTrainee(tempTrainee)),
  onUpdateTempTrainee: tempTrainee => dispatch(updateTempTrainee(tempTrainee)),
  onDeleteTempTrainee: tempTrainee => dispatch(deleteTempTrainee(tempTrainee)),
  onGetTempTraineesRegCertificates: () => dispatch(getRegisterCertificates()),
  onGetTempTraineeById: tempTrainee =>
    dispatch(getTempTraineeById(tempTrainee)),
  onGetTempTraineesDocuments: obj =>
    dispatch(getTempTraineeDefaultRegReqDocs(obj)),
  onAddNewProfessionalExperience: profExperience =>
    dispatch(addNewProfessionalExperience(profExperience)),
  onUpdateProfessionalExperience: profExperience =>
    dispatch(updateProfessionalExperience(profExperience)),
  onDeleteProfessionalExperience: profExperience =>
    dispatch(deleteProfessionalExperience(profExperience)),
  onAddRequiredDocs: tTrainee => dispatch(addRequiredDocs(tTrainee)),
  onGenerateTempTrainee: tTrainee => dispatch(generateTempTrainee(tTrainee)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ApplicantsList)));
