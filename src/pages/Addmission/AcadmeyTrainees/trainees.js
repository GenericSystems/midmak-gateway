import React, { Component } from "react";
import classnames from "classnames";
import { fetchFile } from "../../../store/_common/actions"; // adjust path

import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  FormGroup,
  TabContent,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import FilePage from "pages/FilePage";
import FullPageModal from "components/FileView/FullPageModal";
import { uploadFile } from "store/_common/actions";

import {
  getTrainees,
  addNewTrainee,
  updateTrainee,
  deleteTrainee,
  // getTraineeRegReqDocs,
} from "store/trainees/actions";
import {
  getRegisterCertificates,
  getTempTraineeDefaultRegReqDocs,
  updateProfessionalExperience,
  addNewProfessionalExperience,
  deleteProfessionalExperience,
  addRequiredDocs,
} from "store/new-Trainee/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";

let regReqDocId = 0;
let TraineeId = 0;
let fileId = "";
class TraineesList extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    console.log("Constructor props", props);
    this.state = {
      profExperiencesArray: [],
      trainees: {},
      trainee: "",
      years: [],
      tempTraineeLocal: "",
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showFatherName: false,
      showTraineeStatus: false,
      showTempStatus: false,
      showYear: false,
      showGrandFatherName: false,
      showMotherName: false,
      showBirthDate: false,
      showNationalityId: false,
      BirthLocation: false,
      showFirstName: false,
      showLastName: false,
      showIdentityNo: false,
      showNationalNo: false,
      showIdentityIssueDate: false,
      showPassNumber: false,
      showPassportIssueDate: false,
      showGender: false,
      showCivicZone: false,
      showRegisterZone: false,
      showRegisterNo: false,
      showPassportExpiryDate: false,
      showRegistrationDate: false,
      showCertificateLevel: false,
      showFaculty: false,
      showSpecialty: false,
      showUniversityAverage: false,
      showUniversityName: false,
      showUniversityCountry: false,
      showDiplomaName: false,
      showInstituteCountry: false,
      showDiplomaAverage: false,
      showEstimate: false,
      showCertificateType: false,
      showAcademicYear: false,
      showDiplomaDate: false,
      showDiplomaId: false,
      showDiplomaCountryId: false,
      showDiplomaGovernorateId: false,
      showDiplomaYear: false,
      showExaminationSession: false,
      showDiplomaNumber: false,
      showAverage: false,
      showCurrentAddress: false,
      showCurrentAddrPhone: false,
      showCurrentAddrCell: false,
      showPermanentAddress: false,
      showParentAddrPhone: false,
      showWhatsappMobileNum: false,
      showEmail: false,
      showWorkPlace: false,
      showWorkField: false,
      showWorkDuration: false,
      showWorkAddress: false,
      showJobTitle: false,
      showAdmissionDate: false,
      showRegisterYear: false,
      showLastRegCourse: false,
      showGrade: false,
      showCourseStatus: false,
      showDecisionCode: false,
      showDecisionType: false,
      showDecisionDate: false,
      showApplyingDate: false,
      showAcademyCouncilNo: false,
      showAcademyCouncilDate: false,
      showDecisionNote: false,
      modal: false,
      modal1: false,
      showModal: false,
      fileName: "",
      selectedMulti: null,
      selectedFromAdmSemes: "",
      selectedToAdmSemes: "",
      selectedFromRegSemes: "",
      selectedToRegSemes: "",
      selectedColor: "#556ee6",
      selectedRuleType: "",
      selectedCalculatedTransferCred: "",
      selectedActiveAdditionalPeriod: "",
      applyForSemesterArray: [],
      prevStatusSemesArray: [],
      applyStatusArray: [],
      prevAcademicWarningArray: [],
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      successMessage: null,
      showTraineeFile: false,
      showRegistrationForm: false,
      showTranscript: false,
      showDocuments: false,
      showTranscriptNoHide: false,
      showReportsLi: false,
      showTraineeLifeLi: false,
      selecetdDiplomaId: "",
      selectedFacultyId: 0,
      tempTrainee: "",
      hasError: false,
      isOpen: false,
      generateModal: false,
      averageValue: "",
      selectedDiploma: "",
      IsSpecial: false,
      grantCond: 0,
      selectedStudyPlanId: 0,
      selectedYear: null,
      currentYearObj: {},
      facultyName: "",
      studyPlanName: "",
      socialStatusName: "",
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
      errorMessage1: null,
      successMessage1: null,
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
      lastUsedExperienceId: 0,
      trnProfExperiences: {},
      trnProfExperience: "",
      showSiblingsSelect: false,
      siblingsArray: [],
      deleteBroModal: false,
      tempTrainees: {},
      selectedParentNationality: null,
      selectedInstituteCountry: "",
      selectedTraineeStatus: "",
      languageState: "",
      selectedHightStudyTypeId: "",
      selectedEstimateId: "",
      selectedRegUniDate: "",
      isTempTraineeSaved: false,
      selectedTraineeId: 0,
      isAdd: false,
      mimeType: null ,
      dataUrl: null ,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      last_created_trainee,
      tempTrainees,
      tempTrainee_regReqDocs,
      onGetTempTrainees,
      generated_tempTrainee,
      diplomalevels,
      nationalities,
      relatives,
      countries,
      cities,
      yearSemesters,
      governorates,
      regReqDocuments,
      genders,
      certificatelevels,
      admissionConditions,
      academiccertificates,
      filteredFaculties,
      filteredAcademicCertificates,
      grants,
      tempTraineeBrothers,
      onGetTempTraineesRegCertificates,
      trnProfExperiences,
      tempTraineesDocuments,
      generated_student,
      //onGetTempRelatives,
      regcertificates,
      trainees,
      tempTrainee,
      traineeStatus,
      stdWarningTestOpt,
      currencies,
      FatherNames,
      currentSemester,
      semesters,
      faculties,
      onGetTrainees,
      deleted,
      user_menu,
      i18n,
      mimeType,
      dataUrl,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (trainees && !trainees.length) {
    onGetTrainees(lang);
    this.setState({ dataUrl: this.dataUrl, mimeType: this.mimeType  });
    this.setState({ trainees, tempTrainee });
    this.setState({
      deleted,
      certificatelevels,
      genders,
      regReqDocuments,
      governorates,
      cities,
      countries,
      faculties,
      nationalities,
      regcertificates,
      diplomalevels,
      traineeStatus,
    });
    // }

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
  }

  handleFetch(fileName) {
    const { onFetchFile } = this.props;
    console.log("Calling with fileData", fileName, onFetchFile);
    this.setState({ dataUrl: null, mimeType: null  });
    onFetchFile(fileName);
  }

  openModal = (event, fileName) => {
    console.log("Opening modal", event, fileName);
    this.handleFetch(fileName);
  };

  closeModal = () => {
    console.log("Closing modal");
    this.setState({ showModal: false });
  };

  handleLanguageChange = lng => {
    // const { onGetTrainees } = this.props;
    // const lang = localStorage.getItem("I18N_LANGUAGE");

    // if (lang != lng) {
    this.setState({ languageState: lng });
    // onGetTrainees(lng);
    // }
  };

  componentDidUpdate(prevProps) {
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
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  handleButtonFileClick = (cellContent, Row) => {
    if (this.fileInputRef.current) {
      TraineeId = this.state.selectedTraineeId;
      console.log(this.state);
      regReqDocId = Row.regReqDocId;
      this.fileInputRef.current.click(); // Trigger file input
    }
  };

  handleFileChange = (event, row) => {
    const file = event.target.files[0];
    this.handleupload(regReqDocId, file); // Your upload logic
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.props.onGetTrainees();
  };

  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleExpSuccessClose = () => {
    this.setState({ successMessage1: null, showAlert: null });
  };

  handleExpErrorClose = () => {
    this.setState({ errorMessage1: null, showAlert: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleDeleteRow = () => {
    const { onDeleteStdWarningTest } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteStdWarningTest({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleShowFile = values => {
    setFileId(values.fileId);
    this.setState(prevState => ({
      showViewer: !prevState.showViewer,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleShowColumn = fieldName => {
    if (fieldName == "FatherName") {
      this.setState(prevState => ({
        showFatherName: !prevState.showFatherName,
      }));
    }

    if (fieldName == "grandFatherName") {
      this.setState(prevState => ({
        showGrandFatherName: !prevState.showGrandFatherName,
      }));
    }

    if (fieldName == "MotherName") {
      this.setState(prevState => ({
        showMotherName: !prevState.showMotherName,
      }));
    }

    if (fieldName == "birthdate") {
      this.setState(prevState => ({
        showBirthDate: !prevState.showBirthDate,
      }));
    }

    if (fieldName == "NationalityId") {
      this.setState(prevState => ({
        showNationalityId: !prevState.showNationalityId,
      }));
    }

    if (fieldName == "BirthLocation") {
      this.setState(prevState => ({
        BirthLocation: !prevState.BirthLocation,
      }));
    }

    if (fieldName == "FirstName") {
      this.setState(prevState => ({
        showFirstName: !prevState.showFirstName,
      }));
    }

    if (fieldName == "LastName") {
      this.setState(prevState => ({
        showLastName: !prevState.showLastName,
      }));
    }

    if (fieldName == "identityNo") {
      this.setState(prevState => ({
        showIdentityNo: !prevState.showIdentityNo,
      }));
    }

    if (fieldName == "nationalNo") {
      this.setState(prevState => ({
        showNationalNo: !prevState.showNationalNo,
      }));
    }

    if (fieldName == "identityIssueDate") {
      this.setState(prevState => ({
        showIdentityIssueDate: !prevState.showIdentityIssueDate,
      }));
    }

    if (fieldName == "PassNumber") {
      this.setState(prevState => ({
        showPassNumber: !prevState.showPassNumber,
      }));
    }

    if (fieldName == "passportIssueDate") {
      this.setState(prevState => ({
        showPassportIssueDate: !prevState.showPassportIssueDate,
      }));
    }

    if (fieldName == "passportExpiryDate") {
      this.setState(prevState => ({
        showPassportExpiryDate: !prevState.showPassportExpiryDate,
      }));
    }

    if (fieldName == "GenderId") {
      this.setState(prevState => ({
        showGender: !prevState.showGender,
      }));
    }

    if (fieldName == "civicZone") {
      this.setState(prevState => ({
        showCivicZone: !prevState.showCivicZone,
      }));
    }

    if (fieldName == "registerZone") {
      this.setState(prevState => ({
        showRegisterZone: !prevState.showRegisterZone,
      }));
    }

    if (fieldName == "registerNo") {
      this.setState(prevState => ({
        showRegisterNo: !prevState.showRegisterNo,
      }));
    }

    if (fieldName == "yearId") {
      this.setState(prevState => ({
        showYear: !prevState.showYear,
      }));
    }

    if (fieldName == "traineeStatusId") {
      this.setState(prevState => ({
        showTraineeStatus: !prevState.showTraineeStatus,
      }));
    }

    if (fieldName == "tempStatusId") {
      this.setState(prevState => ({
        showTempStatus: !prevState.showTempStatus,
      }));
    }

    if (fieldName == "RegistrationDate") {
      this.setState(prevState => ({
        showRegistrationDate: !prevState.showRegistrationDate,
      }));
    }

    if (fieldName == "registrationCertLevelId") {
      this.setState(prevState => ({
        showCertificateLevel: !prevState.showCertificateLevel,
      }));
    }

    if (fieldName == "facultyName") {
      this.setState(prevState => ({
        showFaculty: !prevState.showFaculty,
      }));
    }

    if (fieldName == "plan_study") {
      this.setState(prevState => ({
        showSpecialty: !prevState.showSpecialty,
      }));
    }

    if (fieldName == "uniName") {
      this.setState(prevState => ({
        showUniversityName: !prevState.showUniversityName,
      }));
    }

    if (fieldName == "UnivCountryId") {
      this.setState(prevState => ({
        showUniversityCountry: !prevState.showUniversityCountry,
      }));
    }

    if (fieldName == "uniAverage") {
      this.setState(prevState => ({
        showUniversityAverage: !prevState.showUniversityAverage,
      }));
    }

    if (fieldName == "RegUniDate") {
      this.setState(prevState => ({
        showDiplomaDate: !prevState.showDiplomaDate,
      }));
    }

    if (fieldName == "EstimateId") {
      this.setState(prevState => ({
        showEstimate: !prevState.showEstimate,
      }));
    }

    if (fieldName == "diplomaName") {
      this.setState(prevState => ({
        showDiplomaName: !prevState.showDiplomaName,
      }));
    }

    if (fieldName == "InstituteCountryId") {
      this.setState(prevState => ({
        showInstituteCountry: !prevState.showInstituteCountry,
      }));
    }

    if (fieldName == "registrationDiplomaAverage") {
      this.setState(prevState => ({
        showDiplomaAverage: !prevState.showDiplomaAverage,
      }));
    }

    if (fieldName == "academicYear") {
      this.setState(prevState => ({
        showAcademicYear: !prevState.showAcademicYear,
      }));
    }

    if (fieldName == "HighStudyTypeId") {
      this.setState(prevState => ({
        showCertificateType: !prevState.showCertificateType,
      }));
    }

    if (fieldName == "diplomaId") {
      this.setState(prevState => ({
        showDiplomaId: !prevState.showDiplomaId,
      }));
    }

    if (fieldName == "DiplomaCountryId") {
      this.setState(prevState => ({
        showDiplomaCountryId: !prevState.showDiplomaCountryId,
      }));
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState(prevState => ({
        showDiplomaGovernorateId: !prevState.showDiplomaGovernorateId,
      }));
    }

    if (fieldName == "DiplomaYear") {
      this.setState(prevState => ({
        showDiplomaYear: !prevState.showDiplomaYear,
      }));
    }

    if (fieldName == "ExaminationSession") {
      this.setState(prevState => ({
        showExaminationSession: !prevState.showExaminationSession,
      }));
    }

    if (fieldName == "DiplomaNumber") {
      this.setState(prevState => ({
        showDiplomaNumber: !prevState.showDiplomaNumber,
      }));
    }

    if (fieldName == "Average") {
      this.setState(prevState => ({
        showAverage: !prevState.showAverage,
      }));
    }

    if (fieldName == "CurrentAddress") {
      this.setState(prevState => ({
        showCurrentAddress: !prevState.showCurrentAddress,
      }));
    }

    if (fieldName == "CurrentAddrPhone") {
      this.setState(prevState => ({
        showCurrentAddrPhone: !prevState.showCurrentAddrPhone,
      }));
    }

    if (fieldName == "CurrentAddrCell") {
      this.setState(prevState => ({
        showCurrentAddrCell: !prevState.showCurrentAddrCell,
      }));
    }

    if (fieldName == "PermanentAddress") {
      this.setState(prevState => ({
        showPermanentAddress: !prevState.showPermanentAddress,
      }));
    }

    if (fieldName == "ParentAddrPhone") {
      this.setState(prevState => ({
        showParentAddrPhone: !prevState.showParentAddrPhone,
      }));
    }

    if (fieldName == "WhatsappMobileNum") {
      this.setState(prevState => ({
        showWhatsappMobileNum: !prevState.showWhatsappMobileNum,
      }));
    }

    if (fieldName == "Email") {
      this.setState(prevState => ({
        showEmail: !prevState.showEmail,
      }));
    }

    if (fieldName == "jobTitle") {
      this.setState(prevState => ({
        showJobTitle: !prevState.showJobTitle,
      }));
    }

    if (fieldName == "workPlace") {
      this.setState(prevState => ({
        showWorkPlace: !prevState.showWorkPlace,
      }));
    }

    if (fieldName == "workAddress") {
      this.setState(prevState => ({
        showWorkAddress: !prevState.showWorkAddress,
      }));
    }

    if (fieldName == "workField") {
      this.setState(prevState => ({
        showWorkField: !prevState.showWorkField,
      }));
    }

    if (fieldName == "workDuration") {
      this.setState(prevState => ({
        showWorkDuration: !prevState.showWorkDuration,
      }));
    }

    if (fieldName == "registerYear") {
      this.setState(prevState => ({
        showRegisterYear: !prevState.showRegisterYear,
      }));
    }

    if (fieldName == "admissionDate") {
      this.setState(prevState => ({
        showAdmissionDate: !prevState.showAdmissionDate,
      }));
    }

    if (fieldName == "lastRegCourse") {
      this.setState(prevState => ({
        showLastRegCourse: !prevState.showLastRegCourse,
      }));
    }

    if (fieldName == "grade") {
      this.setState(prevState => ({
        showGrade: !prevState.showGrade,
      }));
    }

    if (fieldName == "courseStatus") {
      this.setState(prevState => ({
        showCourseStatus: !prevState.showCourseStatus,
      }));
    }
    if (fieldName == "decisionCode") {
      this.setState(prevState => ({
        showDecisionCode: !prevState.showDecisionCode,
      }));
    }
    if (fieldName == "decisionType") {
      this.setState(prevState => ({
        showDecisionType: !prevState.showDecisionType,
      }));
    }
    if (fieldName == "decisionDate") {
      this.setState(prevState => ({
        showDecisionDate: !prevState.showDecisionDate,
      }));
    }
    if (fieldName == "applyingDate") {
      this.setState(prevState => ({
        showApplyingDate: !prevState.showApplyingDate,
      }));
    }
    if (fieldName == "academyCouncilNo") {
      this.setState(prevState => ({
        showAcademyCouncilNo: !prevState.showAcademyCouncilNo,
      }));
    }
    if (fieldName == "academyCouncilDate") {
      this.setState(prevState => ({
        showAcademyCouncilDate: !prevState.showAcademyCouncilDate,
      }));
    }
    if (fieldName == "decisionNote") {
      this.setState(prevState => ({
        showDecisionNote: !prevState.showDecisionNote,
      }));
    }
  };

  // handleMulti = (fieldName, selectedMulti) => {
  //   if (fieldName === "applyForSemester") {
  //     this.setState({ applyForSemesterArray: selectedMulti });
  //   }

  //   if (fieldName === "nationalNo") {
  //     this.setState({ prevStatusSemesArray: selectedMulti });
  //   }

  //   if (fieldName === "identityNo") {
  //     this.setState({ prevAcademicWarningArray: selectedMulti });
  //   }

  //   if (fieldName === "identityIssueDate") {
  //     this.setState({ applyStatusArray: selectedMulti });
  //   }
  // };

  handleColorChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedColor: selectedValue });
  }

  handleViewTrainee = arg => {
    console.log("arg", arg);
    const { onGetTraineeById } = this.props;
    // const { stdDocsArray, profExperiencesArray } = this.state;

    // const filteredTempTrainee = tempTrainees.filter(tempTrainee => tempTrainee.key != arg.Id);
    // console.log("BEFORE tempTrainee", tempTrainee);
    // console.log("BEFORE tempTrainee", tempTrainee);
    // onGetTraineeById(arg);
    // console.log("aFTER Btrainee", tempTrainee.Id);
    // console.log("aFTER Btrainee", tempTrainee.ProfessionalExperiences);
    this.setState({
      //   showGenerateButton: true,
      //   // tempTrainee: {
      //   // Id: tempTrainee.Id,
      trainee: arg,
      selectedTraineeId: arg.Id,
      nationalityName: arg.nationality || "",
      selectedNationalityId: arg.NationalityId || null,
      // //   //selectedRegistrationDate: arg.RegistrationDate || null,
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
      // // selectedSocialStatus: arg.socialStatusId || "",
      socialStatusName: arg.socialStatusName || null,
      selectedRegistrationDiplomaDate: arg.registrationDiplomaDate || "",
      // //   // },
      // //   selectedTraineeId: arg.Id,
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
    console.log(`Selected Trainee ID: ${arg}`);
    this.toggle();
  };

  handleRegistrationForm = () => {
    this.setState({
      showRegistrationForm: true,
      showTraineeFile: false,
      showTranscript: false,
      showDocuments: false,
      showTranscriptNoHide: false,
    });
  };

  handleTraineeFile = () => {
    this.setState({
      showTraineeFile: true,
      showRegistrationForm: false,
      showTranscript: false,
      showDocuments: false,
      showTranscriptNoHide: false,
    });
  };
  handleTranscript = () => {
    this.setState({
      showTraineeFile: false,
      showRegistrationForm: false,
      showTranscript: true,
      showDocuments: false,
      showTranscriptNoHide: false,
    });
  };
  handleTranscriptNoHide = () => {
    this.setState({
      showTraineeFile: false,
      showRegistrationForm: false,
      showTranscript: false,
      showDocuments: false,
      showTranscriptNoHide: true,
    });
  };
  handleDocuments = () => {
    this.setState({
      showTraineeFile: false,
      showRegistrationForm: false,
      showDocuments: true,
      showTranscript: false,
      showTranscriptNoHide: false,
    });
  };

  handleReportsDropdown = () => {
    const {
      showTraineeFile,
      showRegistrationForm,
      showTranscript,
      showDocuments,
      showTranscriptNoHide,
    } = this.state;

    this.setState({
      showTraineeFile: showTraineeFile ? true : false,
      showRegistrationForm: showRegistrationForm ? true : false,
      showTranscript: showTranscript ? true : false,
      showDocuments: showDocuments ? true : false,
      showTranscriptNoHide: showTranscriptNoHide ? true : false,
    });
    this.setState(prevState => ({
      showReportsLi: !prevState.showReportsLi,
    }));
  };

  handleUniTraineesDropdown = () => {
    const {
      showTraineeFile,
      showRegistrationForm,
      showReportsLi,
      showTranscript,
    } = this.state;
    this.setState({
      showTraineeFile: showTraineeFile ? true : false,
      showRegistrationForm: showRegistrationForm ? true : false,
      showReportsLi: showReportsLi ? true : false,
      showTranscript: showTranscript ? true : false,
      showDocuments: showDocuments ? true : false,
      showTranscriptNoHide: showTranscriptNoHide ? true : false,
    });
    this.setState(prevState => ({
      showTraineeLifeLi: !prevState.showTraineeLifeLi,
    }));
  };

  toggleTab(tab) {
    if (tab === 5 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    if (tab === 4 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    const {
      trainee,
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
            stdDocsArray: trainee.RegReqDocTempTrainee || [],
            profExperiencesArray: trainee.ProfessionalExperiences || [],
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

  handleCollapseButtonClick = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapse-sidebar");
  };

  handleSubmit = values => {
    const { onAddRequiredDocs } = this.props;
    const { stdDocsArray } = this.state;
    console.log("values in save", values);
    values["traineeId"] = values.Id;
    values["isAdd"] = 0;
    console.log(values["traineeId"]);
    let traineeinfo = {};
    const extractedArray = stdDocsArray.map(item => ({
      Id: item.Id,
      regReqDocId: item.regReqDocId,
      availableNumber: item.availableNumber,
    }));
    console.log("extractedArray", extractedArray);
    (traineeinfo["procedure"] = "Admission_UpdateDocsTrainee"),
      (traineeinfo["tablename"] = "Common_RegReqDocTrainee"),
      (traineeinfo["queryname"] = "_Common_Trainee"),
      (traineeinfo["stdDocs"] = extractedArray);
    traineeinfo["traineeId"] = values.Id;
    traineeinfo["isAdd"] = 0;
    console.log("traineeinfo", traineeinfo);
    onAddRequiredDocs(traineeinfo);
    // const saveDocsMessage = this.props.t("Documents requiered saved successfully");
    //     this.setState({
    //       successMessage: saveTempTraineeMessage,
    //     });
  };

  handleExperienceSubmit = values => {
    const { lastAddedId, onAddNewProfessionalExperience } = this.props;
    const { profExperiencesArray, lastUsedExperienceId, isEdit } = this.state;
    console.log("values in save", values);
    values["traineeId"] = values.Id;
    console.log(values["traineeId"]);
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
    // traineeinfo["selectedTraineeId"] = values.Id;
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
      traineeId: values.Id,
      procedure: "SisApp_UpdateTraineeInfo",
      tablename: "Common_TraineesProfessionalExperiences",
      queryname: "_Common_Trainee",
      ProfessionalExperiences: profExperiencesArray.map(item => ({
        Id: item.Id,
        jobTitle: item.jobTitle,
        workPlace: item.workPlace,
        workAddress: item.workAddress,
        workField: item.workField,
        workDuration: item.workDuration,
      })),
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
      selectedTraineeStatus,
    } = this.state;
    console.log("values in save", values);
    values["socialStatusId"] = selectedSocialStatus;
    values.statusId = isEdit ? selectedTraineeStatus : 1;

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
        trainee,
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

      const { onUpdateTrainee, onAddNewTrainee } = this.props;
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
          traineeinfo["diplomaId"] = trainee.diplomaId;
        }
      }

      if (values.DiplomaCountryId) {
        const countryObject = countries.find(
          country => country.value === values.DiplomaCountryId
        );
        if (countryObject === undefined) {
          traineeinfo["DiplomaCountryId"] = trainee.DiplomaCountryId;
        }
      }

      if (values.DiplomaGovernorateId) {
        const governorateObject = governorates.find(
          governorate => governorate.value === values.DiplomaGovernorateId
        );
        if (governorateObject === undefined) {
          traineeinfo["DiplomaGovernorateId"] = trainee.DiplomaGovernorateId;
        }
      }

      if (values.UnivCountryId) {
        const univCountryObject = countries.find(
          country => country.value === values.UnivCountryId
        );
        if (univCountryObject === undefined) {
          traineeinfo["UnivCountryId"] = trainee.UnivCountryId;
        }
      }

      if (values.InstituteCountryId) {
        const instCountryObject = countries.find(
          country => country.value === values.InstituteCountryId
        );
        if (instCountryObject === undefined) {
          traineeinfo["InstituteCountryId"] = trainee.InstituteCountryId;
        }
      }
      if (values.birthdate) {
        traineeinfo["birthdate"] =
          values && values.birthdate
            ? new Date(values.birthdate).toISOString().split("T")[0]
            : selectedBirthDate;
      }

      if (values.identityIssueDate) {
        traineeinfo["identityIssueDate"] =
          values && values.identityIssueDate
            ? new Date(values.identityIssueDate).toISOString().split("T")[0]
            : selectedIdentityIssueDate;
      }
      if (values.passportExpiryDate) {
        traineeinfo["passportExpiryDate"] =
          values && values.passportExpiryDate
            ? new Date(values.passportExpiryDate).toISOString().split("T")[0]
            : selectedPassportExpiryDate;
      }
      if (values.passportIssueDate) {
        traineeinfo["passportIssueDate"] =
          values && values.passportIssueDate
            ? new Date(values.passportIssueDate).toISOString().split("T")[0]
            : selectedPassportIssueDate;
      }

      if (selectedGender) {
        traineeinfo["GenderId"] = parseInt(selectedGender);
      }

      if (selectedNationalityId) {
        traineeinfo["NationalityId"] = trainee.NationalityId;
      }

      if (selectedExaminationSession) {
        traineeinfo["ExaminationSession"] = trainee.ExaminationSession;
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
        onUpdateTrainee(traineeinfo);
      } else if (isAdd) {
        onAddNewTrainee(traineeinfo);
      }
      const saveTraineeMessage = this.props.t("Trainee saved successfully");
      this.setState({
        successMessage: saveTraineeMessage,
      });
    }
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handelAddExperience = () => {
    const { onAddNewProfessionalExperience, lastAddedId, trnProfExperiences } =
      this.props;
    const {
      profExperiencesArray,
      lastUsedExperienceId,
      isAdd,
      selectedTraineeId,
    } = this.state;
    const emptyRowsExist = profExperiencesArray.some(
      profExperiences => profExperiences.jobTitle.trim() === ""
    );
    console.log("emptyRowsExist", emptyRowsExist);
    console.log("selectedTraineeId", selectedTraineeId);
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorProfExperiences: errorMessage });
    } else {
      const newExperience = {
        Id: lastUsedExperienceId,
        traineeId: isAdd ? lastAddedId : selectedTraineeId,
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

  handleSelect = (fieldName, selectedValue, values) => {
    const { socialStatus, traineeStatus } = this.props;
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
      const name = traineeStatus.find(
        traineeStatu => traineeStatu.value === selectedValue
      );
      console.log("naaaaamesooo", name);

      this.setState({
        selectedTraineeStatus: selectedValue,
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

  handlePrintHistory = trainee => {
    this.setState({
      trainee: trainee,
      isOpen: true,
    });
    this.toggle1();
  };

  handleupload(rowId, file) {
    console.log("rowId", rowId);
    console.log("file", file);
    const { onUploadFile } = this.props;
    const reader = new FileReader();
    // `file`,`entity`,`entityId`,`entityProp`,`entityPropId`,`entityPropSeq`,`entityProp_entity`
    const fileData = {
      file: file,
      entityId: this.state.selectedTraineeId,
      entity: "Common_Trainee",
      entityProp: "uploadedDocument",
      entityPropId: rowId,
      entityPropSeq: 0,
      entityProp_entity: "Common_RegReqDocTrainee",
    };
    console.log("Calling with fileData", fileData);
    onUploadFile(fileData);
  }

  render() {
    const {
      trainees,
      stdWarningTestOpt,
      FatherNames,
      currencies,
      semesters,
      traineeStatus,
      deleted,
      t,
      faculties,
      isLoading,
      years,
      nationalities,
      relatives,
      countries,
      yearSemesters,
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
      grants,
      regReqDocuments,
      tempTraineeBrothers,
      lastAddedId,
      trnProfExperiences,
      socialStatus,
      tempTraineesDocuments,
      diplomalevels,
      onGetFilteredAcademicCertificates,
      getFilteredFaculties,
      regcertificates,
      highstudytypes,
      estimates,
    } = this.props;
    const {
      trainee,
      profExperiencesArray,
      duplicateErrorProfExperiences,
      selectedRegistrationDate,
      selectedRegistrationCertLevelId,
      selectedExaminationSession,
      selectedBirthDate,
      selectedRegistrationDiplomaDate,
      selectedDiploma,
      selectedDiplomaVerificationDate,
      selectedNationalityId,
      showRegistrationForm,
      showTranscript,
      showDocuments,
      showTraineeFile,
      showTranscriptNoHide,
      languageState,
      duplicateError,
      errorMessage,
      successMessage,
      sidebarOpen,
      deleteModal,
      showViewer,
      isEdit,
      showTraineeStatus,
      showTempStatus,
      showYear,
      showFatherName,
      showGrandFatherName,
      showMotherName,
      showBirthDate,
      showNationalityId,
      BirthLocation,
      showFirstName,
      showLastName,
      showIdentityNo,
      showNationalNo,
      showIdentityIssueDate,
      showPassNumber,
      showPassportIssueDate,
      showPassportExpiryDate,
      showGender,
      showCivicZone,
      showRegisterNo,
      showRegisterZone,
      showFaculty,
      showSpecialty,
      showEstimate,
      showUniversityName,
      showUniversityAverage,
      showUniversityCountry,
      showInstituteCountry,
      showDiplomaAverage,
      showDiplomaName,
      showDiplomaDate,
      showCertificateType,
      showDiplomaId,
      showDiplomaCountryId,
      showAcademicYear,
      showAverage,
      showDiplomaGovernorateId,
      showDiplomaNumber,
      showDiplomaYear,
      showRegistrationDate,
      showCertificateLevel,
      showExaminationSession,
      showCurrentAddress,
      showCurrentAddrCell,
      showCurrentAddrPhone,
      showEmail,
      showWhatsappMobileNum,
      showParentAddrPhone,
      showPermanentAddress,
      showJobTitle,
      showWorkDuration,
      showWorkField,
      showWorkPlace,
      showWorkAddress,
      showAdmissionDate,
      showRegisterYear,
      showLastRegCourse,
      showGrade,
      showCourseStatus,
      showDecisionCode,
      showDecisionNote,
      showDecisionType,
      showDecisionDate,
      showApplyingDate,
      showAcademyCouncilDate,
      showAcademyCouncilNo,
      showAlert,
      selectedFacultyId,
      facultyName,
      selectedCountry,
      selectedUnivCountry,
      selectedGovernorate,
      selectedGender,
      emptyTrainee,
      firstNameError,
      lastNameError,
      fatherNameError,
      grandFatherNameError,
      motherNameError,
      birthLocError,
      birthdateError,
      nationalityError,
      genderError,
      facultyError,
      HasBrotherCheck,
      stdDocsArray,
      gradeError,
      selectedInstituteCountry,
      selectedHightStudyTypeId,
      selectedEstimateId,
      nationalNoError,
      identityNoError,
      plan_studyError,
      errorMessage1,
      successMessage1,
      diplomaIdError,
      isOpen,
      showModal,
    } = this.state;
    console.log("state", this.state);
    console.log("props", this.props);
    const direction = languageState === "ar" ? "rtl" : "ltr";

    const showNewInput =
      selectedRegistrationCertLevelId === 1 ||
      selectedRegistrationCertLevelId === 2;

    const isShowInstituteinfo = selectedRegistrationCertLevelId === 2;

    const isShowUlterStudy = selectedRegistrationCertLevelId === 5;

    const isHightSchooll = selectedRegistrationCertLevelId === 3;

    const showUniForm = selectedRegistrationCertLevelId === 79;

    const formattedRegistrationDate =
      trainee && trainee.RegistrationDate
        ? new Date(trainee.RegistrationDate).toISOString().split("T")[0]
        : selectedRegistrationDate;

    const { SearchBar } = Search;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

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
              onClick={this.handleButtonFileClick(cellContent, row)}
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
              id="trnprofdeletetooltip"
              onClick={() => this.onClickDelete(trnProfExperience)}
            ></i>
          </Link>
        ),
      },
    ];

    const gradeColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Course Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Course Code"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Total Hours"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Final Marks"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Points"),
        editable: false,
      },
      {
        dataField: "preventGraduation",

        text: this.props.t("Grade"),
        editable: false,
      },
    ];
    const documentsColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Document Num"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Document Type"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Year"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Request Date"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Due Date"),
        editable: false,
      },
      {
        dataField: "preventGraduation",

        text: this.props.t("Last Print Date"),
        editable: false,
      },
      {
        dataField: "Print History",
        isDummyField: true,
        editable: false,
        text: "",
        formatter: (cellContent, trainee) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Print History")} placement="top">
              <Link className="" to="#">
                <div className="text-center mt-3">
                  <i
                    className="fas fa-history"
                    id="printtooltip"
                    onClick={() => this.handlePrintHistory(trainee)}
                  ></i>
                </div>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const printHistoryColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Print Notes"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Reprint Reason"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("User Name"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Print Date"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Print Time"),
        editable: false,
      },
    ];

    const preReqColumns = [
      {
        dataField: "Id",
        Id: 1,
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",
        Id: 2,
        text: this.props.t("Document Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",
        Id: 3,
        text: this.props.t("Required Number"),
        editable: false,
      },
      {
        dataField: "availableNumber",
        Id: 4,
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
        Id: 5,
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
        Id: 6,
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
        Id: 7,
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
        Id: 8,
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
        Id: 9,
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

      {
        dataField: "uploadFile",
        id: 10,
        key: "file",
        text: this.props.t("Upload File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="d-flex gap-2 upload-btn-container">
            <label
              className="btn btn-sm btn-outline-secondary p-1 m-0"
              onClick={event => this.handleButtonFileClick(event, row)}
            >
              <i className="mdi mdi-upload me-1"></i>
              {this.props.t("Upload")}
            </label>

            <input
              type="file"
              ref={this.fileInputRef}
              style={{ display: "none" }}
              onChange={event => this.handleFileChange(event, row)}
              accept="image/*,.pdf"
            />
            {(row.selectedFileName || row.fileName) && (
              <a
                href={"#"}
                rel="noopener noreferrer"
                className="text-truncate"
                onClick={event => {
                  console.log(
                    "SelectedText",
                    row.filePath,
                    row.selectedFileName,
                    row.fileName
                  );
                  this.fileName = row.fileName;
                  this.openModal(event, row.filePath);
                }}
                style={{ maxWidth: "150px", textDecoration: "underline" }}
              >
                {row.selectedFileName || row.fileName}
              </a>
            )}
          </div>
        ),
      },
    ];

    const MainInfoColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "TraineeNum",
        text: this.props.t("Trainee Number"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "fullName",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "admissionDate",
        text: this.props.t("Admission Date"),
        sort: true,
        editable: false,
        hidden: !showAdmissionDate,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.admissionDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "yearId",
        text: this.props.t("Register Year"),
        sort: true,
        editable: false,
        hidden: !showRegisterYear,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "traineeStatusId",
        text: this.props.t("Trainee Status"),
        sort: true,
        editable: false,
        hidden: !showTraineeStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "tempStatusId",
        text: this.props.t("Temporary Trainee Status"),
        sort: true,
        editable: false,
        hidden: !showTempStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "FirstName",
        text: this.props.t("First Name"),
        sort: true,
        editable: false,
        hidden: !showFirstName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "LastName",
        text: this.props.t("Last Name"),
        sort: true,
        editable: false,
        hidden: !showLastName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "FatherName",
        text: this.props.t("Father Name"),
        sort: true,
        editable: false,
        hidden: !showFatherName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "grandFatherName",
        text: this.props.t("Grandfather Name"),
        sort: true,
        editable: false,
        hidden: !showGrandFatherName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "MotherName",
        text: this.props.t("Mother Name"),
        sort: true,
        editable: false,
        hidden: !showMotherName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "BirthLocation",
        text: this.props.t("Birth Location"),
        sort: true,
        editable: false,
        hidden: !BirthLocation,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "birthdate",

        text: this.props.t("Birth Date"),
        sort: true,
        editable: false,
        hidden: !showBirthDate,
        formatter: (cellContent, row) => this.handleValidDate(row.birthdate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "nationalNo",
        text: this.props.t("National No"),
        sort: true,
        editable: false,
        hidden: !showNationalNo,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "identityNo",
        text: this.props.t("Identity No"),
        sort: true,
        editable: false,
        hidden: !showIdentityNo,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "identityIssueDate",
        text: this.props.t("Identity Issue Date"),
        editable: false,
        sort: true,
        hidden: !showIdentityIssueDate,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.identityIssueDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "PassNumber",
        text: this.props.t("Passport Number"),
        editable: false,
        sort: true,
        hidden: !showPassNumber,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passportIssueDate",
        text: this.props.t("passport Issue Date"),
        editable: false,
        sort: true,
        hidden: !showPassportIssueDate,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.passportIssueDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passportExpiryDate",
        text: this.props.t("Passport Expiry Date"),
        editable: false,
        sort: true,
        hidden: !showPassportExpiryDate,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.passportExpiryDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "GenderId",
        text: this.props.t("Gender"),
        editable: false,
        sort: true,
        hidden: !showGender,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "NationalityId",

        text: this.props.t("Nationality"),
        sort: true,
        editable: false,
        hidden: !showNationalityId,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "civicZone",
        text: this.props.t("Civic Zone"),
        editable: false,
        sort: true,
        hidden: !showCivicZone,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registerZone",
        text: this.props.t("Register Zone"),
        editable: false,
        sort: true,
        hidden: !showRegisterZone,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registerNo",
        text: this.props.t("Register No"),
        editable: false,
        sort: true,
        hidden: !showRegisterNo,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      ,
      // {
      //   dataField: "passportExpiryDate",
      //   text: this.props.t("Passport Expiry Date"),
      //   editable: false,
      //   hidden: !showPassportExpiryDate,
      //   // filter: textFilter({
      //   //   placeholder: this.props.t("Search..."),
      //   // }),
      // },
      {
        dataField: "RegistrationDate",
        text: this.props.t("Registration Date"),
        editable: false,
        sort: true,
        hidden: !showRegistrationDate,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.RegistrationDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registrationCertLevelId",
        text: this.props.t("Certificate Level"),
        editable: false,
        sort: true,
        hidden: !showCertificateLevel,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "facultyName",
        text: this.props.t("Faculty"),
        editable: false,
        sort: true,
        hidden: !showFaculty,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "plan_study",
        text: this.props.t("Specialty"),
        editable: false,
        sort: true,
        hidden: !showSpecialty,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "uniName",
        text: this.props.t("UniversityName"),
        editable: false,
        sort: true,
        hidden: !showUniversityName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "diplomaName",
        text: this.props.t("Diploma Name"),
        editable: false,
        sort: true,
        hidden: !showDiplomaName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "UnivCountryId",
        text: this.props.t("University Country"),
        editable: false,
        sort: true,
        hidden: !showUniversityCountry,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "InstituteCountryId",
        text: this.props.t("Institute Country"),
        editable: false,
        sort: true,
        hidden: !showInstituteCountry,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "uniAverage",
        text: this.props.t("University Average"),
        editable: false,
        sort: true,
        hidden: !showUniversityAverage,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registrationDiplomaAverage",
        text: this.props.t("Diploma Average"),
        editable: false,
        sort: true,
        hidden: !showDiplomaAverage,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "EstimateId",
        text: this.props.t("Estimate"),
        editable: false,
        sort: true,
        hidden: !showEstimate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "RegUniDate",
        text: this.props.t("Diploma Date"),
        editable: false,
        sort: true,
        hidden: !showDiplomaDate,
        formatter: (cellContent, row) => this.handleValidDate(row.RegUniDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academicYear",
        text: this.props.t("Academic Year"),
        editable: false,
        sort: true,
        hidden: !showAcademicYear,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "HighStudyTypeId",
        text: this.props.t("Certificate Type"),
        editable: false,
        sort: true,
        hidden: !showCertificateType,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "diplomaId",
        text: this.props.t("Diploma Type"),
        editable: false,
        sort: true,
        hidden: !showDiplomaId,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaCountryId",
        text: this.props.t("Diploma Country"),
        editable: false,
        sort: true,
        hidden: !showDiplomaCountryId,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaGovernorateId",
        text: this.props.t("Diploma Governorate"),
        editable: false,
        sort: true,
        hidden: !showDiplomaGovernorateId,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaYear",
        text: this.props.t("Diploma Year"),
        editable: false,
        sort: true,
        hidden: !showDiplomaYear,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "ExaminationSession",
        text: this.props.t("Examination Session"),
        editable: false,
        sort: true,
        hidden: !showExaminationSession,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaNumber",
        text: this.props.t("Diploma Number"),
        editable: false,
        sort: true,
        hidden: !showDiplomaNumber,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "Average",
        text: this.props.t("Average"),
        editable: false,
        sort: true,
        hidden: !showAverage,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "CurrentAddress",
        text: this.props.t("Current Address"),
        editable: false,
        sort: true,
        hidden: !showCurrentAddress,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      ,
      {
        dataField: "CurrentAddrPhone",
        text: this.props.t("Current Phone"),
        editable: false,
        sort: true,
        hidden: !showCurrentAddrPhone,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      ,
      {
        dataField: "CurrentAddrCell",
        text: this.props.t("Current Mobile"),
        editable: false,
        sort: true,
        hidden: !showCurrentAddrCell,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      ,
      {
        dataField: "PermanentAddress",
        text: this.props.t("Permanent Address"),
        editable: false,
        sort: true,
        hidden: !showPermanentAddress,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "ParentAddrPhone",
        text: this.props.t("Parent Phone"),
        editable: false,
        sort: true,
        hidden: !showParentAddrPhone,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "WhatsappMobileNum",
        text: this.props.t("Whatsapp Number"),
        editable: false,
        sort: true,
        hidden: !showWhatsappMobileNum,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "Email",
        text: this.props.t("Email"),
        editable: false,
        sort: true,
        hidden: !showEmail,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "jobTitle",
        text: this.props.t("Job Title"),
        editable: false,
        sort: true,
        hidden: !showJobTitle,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "workPlace",
        text: this.props.t("Work Place"),
        editable: false,
        sort: true,
        hidden: !showWorkPlace,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "workAddress",
        text: this.props.t("Work Address"),
        editable: false,
        sort: true,
        hidden: !showWorkAddress,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "workField",
        text: this.props.t("Work Field"),
        editable: false,
        sort: true,
        hidden: !showWorkField,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "workDuration",
        text: this.props.t("Work Duration"),
        editable: false,
        sort: true,
        hidden: !showWorkDuration,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "lastRegCourse",
        text: this.props.t("Last Reg.Course"),
        editable: false,
        sort: true,
        hidden: !showLastRegCourse,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "grade",
        text: this.props.t("Grade"),
        editable: false,
        sort: true,
        hidden: !showGrade,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      // {
      //   dataField: "LastRegCourse",
      //   text: this.props.t("Last Reg.Course"),
      //   editable: false,
      //   hidden: !showLastRegCourse,
      //   // filter: textFilter({
      //   //   placeholder: this.props.t("Search..."),
      //   // }),
      // },
      {
        dataField: "courseStatus",
        text: this.props.t("Course Status"),
        editable: false,
        sort: true,
        hidden: !showCourseStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decisionCode",
        text: this.props.t("Decision Code"),
        editable: false,
        sort: true,
        hidden: !showDecisionCode,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decisionType",
        text: this.props.t("Decision Type"),
        editable: false,
        sort: true,
        hidden: !showDecisionType,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decisionDate",
        text: this.props.t("Decision Date"),
        editable: false,
        sort: true,
        hidden: !showDecisionDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
        formatter: (cellContent, row) => this.handleValidDate(row.decisionDate),
      },
      {
        dataField: "applyingDate",
        text: this.props.t("Applying Date"),
        editable: false,
        sort: true,
        hidden: !showApplyingDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academyCouncilNo",
        text: this.props.t("Academy Council No"),
        editable: false,
        sort: true,
        hidden: !showAcademyCouncilNo,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academyCouncilDate",
        text: this.props.t("Academy Council Date"),
        editable: false,
        sort: true,
        hidden: !showAcademyCouncilDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
        formatter: (cellContent, row) =>
          this.handleValidDate(row.academyCouncilDate),
      },
      {
        dataField: "decisionNote",
        text: this.props.t("Decision Note"),
        editable: false,
        sort: true,
        hidden: !showDecisionNote,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, trainee) => (
          <div className="d-flex justify-content-center gap-3">
            {/* {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <IconButton color="danger">
                  <i
                    className="mdi mdi-delete font-size-18 text-danger"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(warning)}
                  ></i>
                </IconButton>
              </Tooltip>
            )} */}

            <Tooltip title={this.props.t("View Trainee")} placement="top">
              <IconButton onClick={() => this.handleViewTrainee(trainee)}>
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  id="viewtraineetooltip"
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: trainees.length,
      custom: true,
    };

    return (
      <div dir={direction} className="page-content">
        <React.Fragment>
          <DeleteModal
            show={deleteModal}
            onDeleteClick={this.handleDeleteRow}
            onCloseClick={() => this.setState({ deleteModal: false })}
          />
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={t("Academy Trainees")} />

            <Row>
              {sidebarOpen && (
                <Row>
                  <Col xs="12" sm="12" md="4" lg="2" className="mb-3">
                    <div>
                      <Card className="accordion-card">
                        <CardHeader className="card-header1">
                          {t("Required data")}
                        </CardHeader>
                        <CardBody style={{ padding: "0" }}>
                          <Accordion flush>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                {t("Main Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck17"
                                        autoComplete="off"
                                        defaultChecked={showYear}
                                        onClick={() =>
                                          this.handleShowColumn("yearId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck17"
                                      >
                                        {this.props.t("Year")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck18"
                                        autoComplete="off"
                                        defaultChecked={showTraineeStatus}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "traineeStatusId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck18"
                                      >
                                        {this.props.t("Trainee Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck67"
                                        autoComplete="off"
                                        defaultChecked={showTempStatus}
                                        onClick={() =>
                                          this.handleShowColumn("tempStatusId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck67"
                                      >
                                        {this.props.t(
                                          "Temporary Trainee Status"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                {t("Personal Information")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Col>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck15"
                                          autoComplete="off"
                                          defaultChecked={showFirstName}
                                          onClick={() =>
                                            this.handleShowColumn("FirstName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck15"
                                        >
                                          {this.props.t("First Name")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck4"
                                          autoComplete="off"
                                          defaultChecked={showLastName}
                                          onClick={() =>
                                            this.handleShowColumn("LastName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck4"
                                        >
                                          {this.props.t("Last Name")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck16"
                                          autoComplete="off"
                                          defaultChecked={showFatherName}
                                          onClick={() =>
                                            this.handleShowColumn("FatherName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck16"
                                        >
                                          {this.props.t("Father Name")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck3"
                                          autoComplete="off"
                                          defaultChecked={showGrandFatherName}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "grandFatherName"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck3"
                                        >
                                          {this.props.t("Grandfather Name")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck6"
                                          autoComplete="off"
                                          defaultChecked={showMotherName}
                                          onClick={() =>
                                            this.handleShowColumn("MotherName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck6"
                                        >
                                          {this.props.t("Mother Name")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck5"
                                          autoComplete="off"
                                          defaultChecked={BirthLocation}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "BirthLocation"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck5"
                                        >
                                          {this.props.t("Birth Location")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck7"
                                          autoComplete="off"
                                          defaultChecked={showBirthDate}
                                          onClick={() =>
                                            this.handleShowColumn("birthdate")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck7"
                                        >
                                          {this.props.t("Birth Date")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck8"
                                          autoComplete="off"
                                          defaultChecked={showNationalityId}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "NationalityId"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck8"
                                        >
                                          {this.props.t("Nationality")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck9"
                                          autoComplete="off"
                                          defaultChecked={showNationalNo}
                                          onClick={() =>
                                            this.handleShowColumn("nationalNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck9"
                                        >
                                          {this.props.t("National No")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck10"
                                          autoComplete="off"
                                          defaultChecked={showIdentityNo}
                                          onClick={() =>
                                            this.handleShowColumn("identityNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck10"
                                        >
                                          {this.props.t("Identity No")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck11"
                                          autoComplete="off"
                                          defaultChecked={showIdentityIssueDate}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "identityIssueDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck11"
                                        >
                                          {this.props.t("Identity Issue Date")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck12"
                                          autoComplete="off"
                                          defaultChecked={showPassNumber}
                                          onClick={() =>
                                            this.handleShowColumn("PassNumber")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck12"
                                        >
                                          {this.props.t("Passport Number")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck14"
                                          autoComplete="off"
                                          defaultChecked={showPassportIssueDate}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "passportIssueDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck14"
                                        >
                                          {this.props.t("Passport Issue Date")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck13"
                                          autoComplete="off"
                                          defaultChecked={
                                            showPassportExpiryDate
                                          }
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "passportExpiryDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck13"
                                        >
                                          {this.props.t("Passport Expiry Date")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck21"
                                          autoComplete="off"
                                          defaultChecked={showGender}
                                          onClick={() =>
                                            this.handleShowColumn("GenderId")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck21"
                                        >
                                          {this.props.t("Gender")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck22"
                                          autoComplete="off"
                                          defaultChecked={showCivicZone}
                                          onClick={() =>
                                            this.handleShowColumn("civicZone")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck22"
                                        >
                                          {this.props.t("Civic Zone")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck19"
                                          autoComplete="off"
                                          defaultChecked={showRegisterZone}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "registerZone"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck19"
                                        >
                                          {this.props.t("Register Zone")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck20"
                                          autoComplete="off"
                                          defaultChecked={showRegisterNo}
                                          onClick={() =>
                                            this.handleShowColumn("registerNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck20"
                                        >
                                          {this.props.t("Register No")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                              <Accordion.Header>
                                {t("Academic Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck30"
                                        autoComplete="off"
                                        defaultChecked={showRegistrationDate}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "RegistrationDate"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck30"
                                      >
                                        {this.props.t("Registration Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck2"
                                        autoComplete="off"
                                        defaultChecked={showAdmissionDate}
                                        onClick={() =>
                                          this.handleShowColumn("admissionDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck2"
                                      >
                                        {this.props.t("Admission Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck1"
                                        autoComplete="off"
                                        defaultChecked={showRegisterYear}
                                        onClick={() =>
                                          this.handleShowColumn("yearId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck1"
                                      >
                                        {this.props.t("Register Year")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>

                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck31"
                                        autoComplete="off"
                                        defaultChecked={showCertificateLevel}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registrationCertLevelId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck31"
                                      >
                                        {this.props.t("Certificate Level")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>

                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck55"
                                        autoComplete="off"
                                        defaultChecked={showFaculty}
                                        onClick={() =>
                                          this.handleShowColumn("facultyName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck55"
                                      >
                                        {this.props.t("Faculty")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>

                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck56"
                                        autoComplete="off"
                                        defaultChecked={showSpecialty}
                                        onClick={() =>
                                          this.handleShowColumn("plan_study")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck56"
                                      >
                                        {this.props.t("Specialty")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck57"
                                        autoComplete="off"
                                        defaultChecked={showUniversityName}
                                        onClick={() =>
                                          this.handleShowColumn("uniName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck57"
                                      >
                                        {this.props.t("University Name")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck58"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaName}
                                        onClick={() =>
                                          this.handleShowColumn("diplomaName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck58"
                                      >
                                        {this.props.t("Diploma Name")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck59"
                                        autoComplete="off"
                                        defaultChecked={showUniversityCountry}
                                        onClick={() =>
                                          this.handleShowColumn("UnivCountryId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck59"
                                      >
                                        {this.props.t("University Country")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck60"
                                        autoComplete="off"
                                        defaultChecked={showInstituteCountry}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "InstituteCountryId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck60"
                                      >
                                        {this.props.t("Institute Country")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck61"
                                        autoComplete="off"
                                        defaultChecked={showUniversityAverage}
                                        onClick={() =>
                                          this.handleShowColumn("uniAverage")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck61"
                                      >
                                        {this.props.t("University Average")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck62"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaAverage}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registrationDiplomaAverage"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck62"
                                      >
                                        {this.props.t("Diploma Average")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck63"
                                        autoComplete="off"
                                        defaultChecked={showEstimate}
                                        onClick={() =>
                                          this.handleShowColumn("EstimateId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck63"
                                      >
                                        {this.props.t("Estimate")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck64"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaDate}
                                        onClick={() =>
                                          this.handleShowColumn("RegUniDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck64"
                                      >
                                        {this.props.t("Diploma Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck65"
                                        autoComplete="off"
                                        defaultChecked={showAcademicYear}
                                        onClick={() =>
                                          this.handleShowColumn("academicYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck65"
                                      >
                                        {this.props.t("Academic Year")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck66"
                                        autoComplete="off"
                                        defaultChecked={showCertificateType}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "HighStudyTypeId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck66"
                                      >
                                        {this.props.t("Certificate Type")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck32"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaId}
                                        onClick={() =>
                                          this.handleShowColumn("diplomaId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck32"
                                      >
                                        {this.props.t("Diploma Type")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck33"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaCountryId}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "DiplomaCountryId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck33"
                                      >
                                        {this.props.t("Diploma Country")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck34"
                                        autoComplete="off"
                                        defaultChecked={
                                          showDiplomaGovernorateId
                                        }
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "DiplomaGovernorateId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck34"
                                      >
                                        {this.props.t("Diploma Governorate")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck35"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaYear}
                                        onClick={() =>
                                          this.handleShowColumn("DiplomaYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck35"
                                      >
                                        {this.props.t("Diploma Year")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck36"
                                        autoComplete="off"
                                        defaultChecked={showExaminationSession}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "ExaminationSession"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck36"
                                      >
                                        {this.props.t("Examination Session")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck37"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaNumber}
                                        onClick={() =>
                                          this.handleShowColumn("DiplomaNumber")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck37"
                                      >
                                        {this.props.t("Diploma Number")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck38"
                                        autoComplete="off"
                                        defaultChecked={showAverage}
                                        onClick={() =>
                                          this.handleShowColumn("Average")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck38"
                                      >
                                        {this.props.t("Average")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck39"
                                        autoComplete="off"
                                        defaultChecked={showRegistrationDate}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "RegistrationDate"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck39"
                                      >
                                        {this.props.t("Registration Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                              <Accordion.Header>
                                {t("Contact Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck23"
                                        autoComplete="off"
                                        defaultChecked={showCurrentAddress}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddress"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck23"
                                      >
                                        {this.props.t("Current Address")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck24"
                                        autoComplete="off"
                                        defaultChecked={showCurrentAddrPhone}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddrPhone"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck24"
                                      >
                                        {this.props.t("Current Phone")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck25"
                                        autoComplete="off"
                                        defaultChecked={showCurrentAddrCell}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddrCell"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck25"
                                      >
                                        {this.props.t("Current Mobile")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck26"
                                        autoComplete="off"
                                        defaultChecked={showPermanentAddress}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "PermanentAddress"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck26"
                                      >
                                        {this.props.t("Permanent Address")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck27"
                                        autoComplete="off"
                                        defaultChecked={showParentAddrPhone}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "ParentAddrPhone"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck27"
                                      >
                                        {this.props.t("Parent Phone")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck28"
                                        autoComplete="off"
                                        defaultChecked={showWhatsappMobileNum}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "WhatsappMobileNum"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck28"
                                      >
                                        {this.props.t("WhatsApp Number")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck29"
                                        autoComplete="off"
                                        defaultChecked={showEmail}
                                        onClick={() =>
                                          this.handleShowColumn("Email")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck29"
                                      >
                                        {this.props.t("Email")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                              <Accordion.Header>
                                {t("Professional experiences")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck40"
                                        autoComplete="off"
                                        defaultChecked={showJobTitle}
                                        onClick={() =>
                                          this.handleShowColumn("jobTitle")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck40"
                                      >
                                        {this.props.t("Job Title")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck41"
                                        autoComplete="off"
                                        defaultChecked={showWorkPlace}
                                        onClick={() =>
                                          this.handleShowColumn("workPlace")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck41"
                                      >
                                        {this.props.t("Work Place")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck42"
                                        autoComplete="off"
                                        defaultChecked={showWorkAddress}
                                        onClick={() =>
                                          this.handleShowColumn("workAddress")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck42"
                                      >
                                        {this.props.t("Work Address")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck43"
                                        autoComplete="off"
                                        defaultChecked={showWorkField}
                                        onClick={() =>
                                          this.handleShowColumn("workField")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck43"
                                      >
                                        {this.props.t("Work Field")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck44"
                                        autoComplete="off"
                                        defaultChecked={showWorkDuration}
                                        onClick={() =>
                                          this.handleShowColumn("workDuration")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck44"
                                      >
                                        {this.props.t("Work Duration")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="5">
                              <Accordion.Header>
                                {t("Register Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck45"
                                        autoComplete="off"
                                        defaultChecked={showLastRegCourse}
                                        onClick={() =>
                                          this.handleShowColumn("lastRegCourse")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck45"
                                      >
                                        {this.props.t("Last Reg.Course")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck46"
                                        autoComplete="off"
                                        defaultChecked={showGrade}
                                        onClick={() =>
                                          this.handleShowColumn("grade")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck46"
                                      >
                                        {this.props.t("Grade")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck47"
                                        autoComplete="off"
                                        defaultChecked={showCourseStatus}
                                        onClick={() =>
                                          this.handleShowColumn("courseStatus")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck47"
                                      >
                                        {this.props.t("Course Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="6">
                              <Accordion.Header>
                                {t("Trainee Decisions")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck48"
                                        autoComplete="off"
                                        defaultChecked={showDecisionCode}
                                        onClick={() =>
                                          this.handleShowColumn("decisionCode")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck48"
                                      >
                                        {this.props.t("Decision Code")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck49"
                                        autoComplete="off"
                                        defaultChecked={showDecisionType}
                                        onClick={() =>
                                          this.handleShowColumn("decisionType")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck49"
                                      >
                                        {this.props.t("Decision Type")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck50"
                                        autoComplete="off"
                                        defaultChecked={showDecisionDate}
                                        onClick={() =>
                                          this.handleShowColumn("decisionDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck50"
                                      >
                                        {this.props.t("Decision Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck51"
                                        autoComplete="off"
                                        defaultChecked={showApplyingDate}
                                        onClick={() =>
                                          this.handleShowColumn("applyingDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck51"
                                      >
                                        {this.props.t("Applying Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck52"
                                        autoComplete="off"
                                        defaultChecked={showAcademyCouncilNo}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "academyCouncilNo"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck52"
                                      >
                                        {this.props.t("Academy Council No")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck53"
                                        autoComplete="off"
                                        defaultChecked={showAcademyCouncilDate}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "academyCouncilDate"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck53"
                                      >
                                        {this.props.t("Academy Council Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck54"
                                        autoComplete="off"
                                        defaultChecked={showDecisionNote}
                                        onClick={() =>
                                          this.handleShowColumn("decisionNote")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck54"
                                      >
                                        {this.props.t("Decision Note")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                          </Accordion>
                        </CardBody>
                      </Card>
                    </div>
                  </Col>

                  <Col
                    xs="12"
                    sm="12"
                    md={sidebarOpen ? "8" : "12"}
                    lg={sidebarOpen ? "10" : "12"}
                  >
                    <Card>
                      <CardBody>
                        <div>
                          {duplicateError && (
                            <Alert
                              color="danger"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {duplicateError}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleAlertClose}
                              ></button>
                            </Alert>
                          )}
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
                                onClick={this.handleErrorClose}
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
                                onClick={this.handleSuccessClose}
                              ></button>
                            </Alert>
                          )}
                        </div>
                       
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="Id"
                            columns={MainInfoColumns}
                            data={trainees}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={trainees}
                                columns={MainInfoColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Row>
                                      <Col sm="4">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                          {/*   {showSearchButton && ( */}
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                              placeholder={t("Search...")}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Col xl="12">
                                      <div className="table-responsive">
                                        <BootstrapTable
                                          keyField="Id"
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          data={trainees}
                                          columns={MainInfoColumns}
                                          noDataIndication={this.props.t(
                                            "No Trainees found"
                                          )}
                                          defaultSorted={defaultSorting}
                                          classes={
                                            "table align-middle table-nowrap table-hover"
                                          }
                                          bordered={false}
                                          striped={false}
                                          responsive
                                          ref={this.node}
                                          filter={filterFactory()}
                                          filterPosition="top"
                                        />
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                          <PaginationListStandalone
                                            {...paginationProps}
                                          />
                                        </Col>
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
                                              ? this.props.t("Edit Trainee")
                                              : this.props.t("Add New Trainee")}
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
                                                    onClick={
                                                      this.handleErrorClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                            </div>
                                          </Row>
                                          <ModalBody>
                                            <div className="modal">
                                              <div className="sidebar">
                                                <h2 className="trainee-info">
                                                  {languageState === "ar"
                                                    ? trainee.FirstName +
                                                      " " +
                                                      trainee.FatherName +
                                                      " " +
                                                      trainee.LastName +
                                                      " "
                                                    : trainee.FirstNameE +
                                                      " " +
                                                      trainee.FatherNameE +
                                                      " " +
                                                      trainee.LastNameE +
                                                      " "}

                                                  <span className="trainee-id">
                                                    {trainee.TraineeNum}
                                                  </span>
                                                </h2>
                                                <ul>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this.handleTraineeFile
                                                      }
                                                      style={{
                                                        color: showTraineeFile
                                                          ? "orange"
                                                          : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Trainee File"
                                                      )}
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this
                                                          .handleRegistrationForm
                                                      }
                                                      style={{
                                                        color:
                                                          showRegistrationForm
                                                            ? "orange"
                                                            : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Registration File"
                                                      )}
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this.handleTranscript
                                                      }
                                                      style={{
                                                        color: showTranscript
                                                          ? "orange"
                                                          : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Transcript"
                                                      )}
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this
                                                          .handleTranscriptNoHide
                                                      }
                                                      style={{
                                                        color:
                                                          showTranscriptNoHide
                                                            ? "orange"
                                                            : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Transcript (No Hide)"
                                                      )}
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this.handleDocuments
                                                      }
                                                      style={{
                                                        color: showDocuments
                                                          ? "orange"
                                                          : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Requested Documents"
                                                      )}
                                                    </a>
                                                  </li>
                                                </ul>
                                              </div>
                                              <div className="collapse-button">
                                                <i
                                                  onClick={
                                                    this
                                                      .handleCollapseButtonClick
                                                  }
                                                  className="bx bx-menu"
                                                ></i>
                                              </div>

                                              <div className="modal-content">
                                                {showTraineeFile && (
                                                  <div>
                                                    <Card className="bordered">
                                                      <CardHeader className="card-header">
                                                        <h4>
                                                          <i className="fas fa-user-circle" />{" "}
                                                          {languageState ===
                                                          "ar"
                                                            ? trainee.FirstName +
                                                              " " +
                                                              trainee.FatherName +
                                                              " " +
                                                              trainee.LastName +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"
                                                            : trainee.FirstNameE +
                                                              " " +
                                                              trainee.FatherNameE +
                                                              " " +
                                                              trainee.LastNameE +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"}
                                                        </h4>
                                                      </CardHeader>
                                                      <CardBody>
                                                        <Row>
                                                          <Col lg="4">
                                                            <div className="mb-2">
                                                              <Label className="right-label">
                                                                {this.props.t(
                                                                  "Permanent State"
                                                                )}{" "}
                                                                :
                                                              </Label>
                                                              <Label className="left-label">
                                                                {
                                                                  trainee.traineeStatus
                                                                }
                                                              </Label>
                                                            </div>

                                                            <div className="mb-2">
                                                              <Label className="right-label">
                                                                {this.props.t(
                                                                  "Temporary Status"
                                                                )}{" "}
                                                                :
                                                              </Label>
                                                              <Label className="left-label">
                                                                {
                                                                  trainee.traineeStatus
                                                                }
                                                              </Label>
                                                            </div>

                                                            <div className="mb-2">
                                                              <Label className="right-label">
                                                                {this.props.t(
                                                                  "Academic Year"
                                                                )}{" "}
                                                                :
                                                              </Label>
                                                              <Label className="left-label">
                                                                {trainee.year}
                                                              </Label>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </CardBody>
                                                    </Card>
                                                  </div>
                                                )}

                                                {showTranscript && (
                                                  <div>
                                                    <Card className="bordered">
                                                      <CardHeader className="card-header">
                                                        <h4>
                                                          <i className="fas fa-user-circle" />{" "}
                                                          {languageState ===
                                                          "ar"
                                                            ? trainee.FirstName +
                                                              " " +
                                                              trainee.FatherName +
                                                              " " +
                                                              trainee.LastName +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"
                                                            : trainee.FirstNameE +
                                                              " " +
                                                              trainee.FatherNameE +
                                                              " " +
                                                              trainee.LastNameE +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"}
                                                        </h4>
                                                      </CardHeader>
                                                      <CardBody>
                                                        <div>
                                                          <div
                                                            className="card-header text-dark text-center fw-bold mb-2"
                                                            style={{
                                                              backgroundColor:
                                                                "#b3d4f5",
                                                            }}
                                                          >
                                                            <Label className="left-label">
                                                              {
                                                                trainee.TraineeNum
                                                              }
                                                            </Label>
                                                          </div>
                                                          <BootstrapTable
                                                            keyField="Id"
                                                            data={trainees}
                                                            columns={
                                                              gradeColumns
                                                            }
                                                            cellEdit={cellEditFactory(
                                                              {
                                                                mode: "dbclick",
                                                                blurToSave: true,
                                                                // afterSaveCell: (
                                                                //   oldValue,
                                                                //   newValue,
                                                                //   row,
                                                                //   column
                                                                // ) => {
                                                                //   this.handleParentsDataChange(
                                                                //     row.Id,
                                                                //     column.dataField,
                                                                //     newValue
                                                                //   );
                                                                // },
                                                              }
                                                            )}
                                                            noDataIndication={t(
                                                              "No Relatives Found"
                                                            )}
                                                            defaultSorted={
                                                              defaultSorting
                                                            }
                                                          />
                                                          <div className="d-flex justify-content-start mt-3">
                                                            <button
                                                              className="btn"
                                                              onClick={() =>
                                                                window.print()
                                                              }
                                                            >
                                                              <i className="fas fa-print"></i>
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </div>
                                                )}
                                                {showTranscriptNoHide && (
                                                  <div>
                                                    <Card className="bordered">
                                                      <CardHeader className="card-header">
                                                        <h4>
                                                          <i className="fas fa-user-circle" />{" "}
                                                          {languageState ===
                                                          "ar"
                                                            ? trainee.FirstName +
                                                              " " +
                                                              trainee.FatherName +
                                                              " " +
                                                              trainee.LastName +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"
                                                            : trainee.FirstNameE +
                                                              " " +
                                                              trainee.FatherNameE +
                                                              " " +
                                                              trainee.LastNameE +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"}
                                                        </h4>
                                                      </CardHeader>
                                                      <CardBody>
                                                        <div>
                                                          <BootstrapTable
                                                            keyField="Id"
                                                            data={trainees}
                                                            columns={
                                                              gradeColumns
                                                            }
                                                            cellEdit={cellEditFactory(
                                                              {
                                                                mode: "dbclick",
                                                                blurToSave: true,
                                                                // afterSaveCell: (
                                                                //   oldValue,
                                                                //   newValue,
                                                                //   row,
                                                                //   column
                                                                // ) => {
                                                                //   this.handleParentsDataChange(
                                                                //     row.Id,
                                                                //     column.dataField,
                                                                //     newValue
                                                                //   );
                                                                // },
                                                              }
                                                            )}
                                                            noDataIndication={t(
                                                              "No Relatives Found"
                                                            )}
                                                            defaultSorted={
                                                              defaultSorting
                                                            }
                                                          />
                                                          <div className="d-flex justify-content-start mt-3">
                                                            <button
                                                              className="btn"
                                                              onClick={() =>
                                                                window.print()
                                                              }
                                                            >
                                                              <i className="fas fa-print"></i>
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </div>
                                                )}
                                                {showDocuments && (
                                                  <div>
                                                    <Card className="bordered">
                                                      <CardHeader className="card-header">
                                                        <h4>
                                                          <i className="fas fa-user-circle" />{" "}
                                                          {languageState ===
                                                          "ar"
                                                            ? trainee.FirstName +
                                                              " " +
                                                              trainee.FatherName +
                                                              " " +
                                                              trainee.LastName +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"
                                                            : trainee.FirstNameE +
                                                              " " +
                                                              trainee.FatherNameE +
                                                              " " +
                                                              trainee.LastNameE +
                                                              " [" +
                                                              trainee.TraineeNum +
                                                              "]"}
                                                        </h4>
                                                      </CardHeader>
                                                      <CardBody>
                                                        <div>
                                                          <BootstrapTable
                                                            keyField="Id"
                                                            data={trainees}
                                                            columns={
                                                              documentsColumns
                                                            }
                                                            cellEdit={cellEditFactory(
                                                              {
                                                                mode: "dbclick",
                                                                blurToSave: true,
                                                                // afterSaveCell: (
                                                                //   oldValue,
                                                                //   newValue,
                                                                //   row,
                                                                //   column
                                                                // ) => {
                                                                //   this.handleParentsDataChange(
                                                                //     row.Id,
                                                                //     column.dataField,
                                                                //     newValue
                                                                //   );
                                                                // },
                                                              }
                                                            )}
                                                            noDataIndication={t(
                                                              "No Relatives Found"
                                                            )}
                                                            defaultSorted={
                                                              defaultSorting
                                                            }
                                                          />
                                                        </div>
                                                        <Modal
                                                          isOpen={
                                                            this.state.modal1
                                                          }
                                                          className={
                                                            this.props.className
                                                          }
                                                          size="lg"
                                                        >
                                                          <ModalHeader
                                                            toggle={
                                                              this.toggle1
                                                            }
                                                            tag="h4"
                                                          >
                                                            {!!isOpen
                                                              ? this.props.t(
                                                                  "Print History"
                                                                )
                                                              : ""}
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
                                                                    onClick={
                                                                      this
                                                                        .handleErrorClose
                                                                    }
                                                                  ></button>
                                                                </Alert>
                                                              )}
                                                            </div>
                                                          </Row>
                                                          <ModalBody>
                                                            <BootstrapTable
                                                              keyField="Id"
                                                              data={trainees}
                                                              columns={
                                                                printHistoryColumns
                                                              }
                                                              cellEdit={cellEditFactory(
                                                                {
                                                                  mode: "dbclick",
                                                                  blurToSave: true,
                                                                  // afterSaveCell: (
                                                                  //   oldValue,
                                                                  //   newValue,
                                                                  //   row,
                                                                  //   column
                                                                  // ) => {
                                                                  //   this.handleParentsDataChange(
                                                                  //     row.Id,
                                                                  //     column.dataField,
                                                                  //     newValue
                                                                  //   );
                                                                  // },
                                                                }
                                                              )}
                                                              noDataIndication={t(
                                                                "No Relatives Found"
                                                              )}
                                                              defaultSorted={
                                                                defaultSorting
                                                              }
                                                            />
                                                          </ModalBody>
                                                        </Modal>
                                                      </CardBody>
                                                    </Card>
                                                  </div>
                                                )}
                                                
                                                {showRegistrationForm && (
                                                  <Formik
                                                    enableReinitialize={true}
                                                    initialValues={
                                                      (isEdit && {
                                                        Id: trainee.Id,
                                                        FirstName:
                                                          trainee?.FirstName ||
                                                          "",
                                                        LastName:
                                                          trainee?.LastName ||
                                                          "",
                                                        FatherName:
                                                          trainee?.FatherName ||
                                                          "",
                                                        grandFatherName:
                                                          trainee?.grandFatherName ||
                                                          "",
                                                        MotherName:
                                                          trainee?.MotherName ||
                                                          "",
                                                        BirthLocation:
                                                          trainee?.BirthLocation ||
                                                          "",
                                                        FirstNameE:
                                                          trainee?.FirstNameE ||
                                                          "",
                                                        LastNameE:
                                                          trainee?.LastNameE ||
                                                          "",
                                                        FatherNameE:
                                                          trainee?.FatherNameE ||
                                                          "",
                                                        grandFatherNameE:
                                                          trainee?.grandFatherNameE ||
                                                          "",
                                                        MotherNameE:
                                                          trainee?.MotherNameE ||
                                                          "",
                                                        BirthLocationE:
                                                          trainee?.BirthLocationE ||
                                                          "",
                                                        birthdate:
                                                          trainee?.birthdate
                                                            ? moment
                                                                .utc(
                                                                  trainee.birthdate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        NationalityId:
                                                          trainee?.NationalityId ||
                                                          selectedNationalityId,
                                                        GenderId:
                                                          trainee?.GenderId ||
                                                          selectedGender ||
                                                          "",

                                                        nationalNo:
                                                          trainee?.nationalNo ||
                                                          "",
                                                        identityNo:
                                                          trainee?.identityNo ||
                                                          "",
                                                        identityIssueDate:
                                                          trainee?.identityIssueDate
                                                            ? moment
                                                                .utc(
                                                                  trainee.identityIssueDate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        civicZone:
                                                          trainee?.civicZone ||
                                                          "",
                                                        registerZone:
                                                          trainee?.registerZone ||
                                                          "",
                                                        registerNo:
                                                          trainee?.registerNo ||
                                                          "",
                                                        PassNumber:
                                                          trainee?.PassNumber ||
                                                          "",
                                                        passportIssueDate:
                                                          trainee?.passportIssueDate
                                                            ? moment
                                                                .utc(
                                                                  trainee.passportIssueDate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        passportExpiryDate:
                                                          trainee?.passportExpiryDate
                                                            ? moment
                                                                .utc(
                                                                  trainee.passportExpiryDate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        diplomaId:
                                                          trainee?.diplomaId ||
                                                          selectedDiploma,
                                                        DiplomaCountryId:
                                                          trainee?.DiplomaCountryId ||
                                                          selectedCountry,

                                                        DiplomaNumber:
                                                          trainee?.DiplomaNumber ||
                                                          "",
                                                        DiplomaGovernorateId:
                                                          trainee?.DiplomaGovernorateId ||
                                                          selectedGovernorate,

                                                        /* DiplomaCityId:
                                                                            (trainee && trainee.DiplomaCityId) ||
                                                                            selectedCity, */

                                                        DiplomaYear:
                                                          trainee?.DiplomaYear ||
                                                          "",
                                                        ExaminationSession:
                                                          trainee?.ExaminationSession ||
                                                          "",
                                                        Average:
                                                          trainee?.Average ||
                                                          "",
                                                        diplomaDate:
                                                          trainee?.diplomaDate
                                                            ? moment
                                                                .utc(
                                                                  trainee.diplomaDate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        diplomaVerificationNum:
                                                          trainee?.diplomaVerificationNum ||
                                                          "",
                                                        diplomaVerificationDate:
                                                          trainee?.diplomaVerificationDate ||
                                                          selectedDiplomaVerificationDate,
                                                        socialStatusId:
                                                          trainee &&
                                                          trainee.socialStatusId,
                                                        registrationCertLevelId:
                                                          trainee?.registrationCertLevelId ||
                                                          selectedRegistrationCertLevelId,
                                                        registrationDiplomaName:
                                                          trainee?.registrationDiplomaName ||
                                                          "",
                                                        registrationDiplomaDepartment:
                                                          trainee?.registrationDiplomaDepartment ||
                                                          "",
                                                        diplomaName:
                                                          trainee?.diplomaName ||
                                                          "",

                                                        registrationDiplomaAverage:
                                                          trainee?.registrationDiplomaAverage ||
                                                          "",
                                                        uniAverage:
                                                          trainee?.uniAverage ||
                                                          "",
                                                        registrationDiplomaDate:
                                                          trainee?.registrationDiplomaDate ||
                                                          selectedRegistrationDiplomaDate,

                                                        uniName:
                                                          trainee?.uniName ||
                                                          "",
                                                        UnivCountryId:
                                                          trainee?.UnivCountryId ||
                                                          selectedUnivCountry,

                                                        /* TransferUnivAverage:
                                                                            (trainee && trainee.TransferUnivAverage) ||
                                                                            "", */
                                                        studyPattern:
                                                          trainee?.studyPattern ||
                                                          "",
                                                        /*  selectedSemester:
                                                                            (trainee && trainee.selectedSemester) ||
                                                                            selectedSemester ||
                                                                            null, */

                                                        RegistrationDate:
                                                          trainee?.RegistrationDate
                                                            ? moment
                                                                .utc(
                                                                  trainee.RegistrationDate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        FacultyId:
                                                          trainee?.FacultyId ||
                                                          selectedFacultyId,
                                                        plan_study:
                                                          trainee?.plan_study ||
                                                          "",
                                                        CurrentAddress:
                                                          trainee?.CurrentAddress ||
                                                          "",
                                                        CurrentAddrPhone:
                                                          trainee?.CurrentAddrPhone ||
                                                          "",
                                                        CurrentAddrCell:
                                                          trainee?.CurrentAddrCell ||
                                                          "",
                                                        PermanentAddress:
                                                          trainee?.PermanentAddress ||
                                                          "",
                                                        ParentAddrPhone:
                                                          trainee?.ParentAddrPhone ||
                                                          "",
                                                        WhatsappMobileNum:
                                                          trainee?.WhatsappMobileNum ||
                                                          "",
                                                        Email:
                                                          trainee?.Email || "",
                                                        GeneralNote:
                                                          trainee?.GeneralNote ||
                                                          "",
                                                        academicYear:
                                                          trainee?.academicYear ||
                                                          "",

                                                        InstituteCountryId:
                                                          trainee?.InstituteCountryId ||
                                                          selectedInstituteCountry,
                                                        HighStudyTypeId:
                                                          trainee?.HighStudyTypeId ||
                                                          selectedHightStudyTypeId,
                                                        EstimateId:
                                                          trainee?.EstimateId ||
                                                          selectedEstimateId,
                                                        RegUniDate:
                                                          trainee?.RegUniDate
                                                            ? moment
                                                                .utc(
                                                                  trainee.RegUniDate
                                                                )
                                                                .local()
                                                                .format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                            : "",
                                                        statusId:
                                                          trainee &&
                                                          trainee.statusId,
                                                      }) ||
                                                      (!isEdit && {
                                                        FirstName:
                                                          (emptyTrainee &&
                                                            emptyTrainee.FirstName) ||
                                                          "",
                                                        LastName:
                                                          (emptyTrainee &&
                                                            emptyTrainee.LastName) ||
                                                          "",
                                                        FatherName:
                                                          (emptyTrainee &&
                                                            emptyTrainee.FatherName) ||
                                                          "",
                                                        grandFatherName:
                                                          (emptyTrainee &&
                                                            emptyTrainee.grandFatherName) ||
                                                          "",
                                                        MotherName:
                                                          (emptyTrainee &&
                                                            emptyTrainee.MotherName) ||
                                                          "",
                                                        BirthLocation:
                                                          (emptyTrainee &&
                                                            emptyTrainee.BirthLocation) ||
                                                          "",
                                                        birthdate:
                                                          (emptyTrainee &&
                                                            emptyTrainee.birthdate) ||
                                                          selectedBirthDate,
                                                        NationalityId:
                                                          (emptyTrainee &&
                                                            emptyTrainee.NationalityId) ||
                                                          "",
                                                        diplomaId:
                                                          (emptyTrainee &&
                                                            emptyTrainee.diplomaId) ||
                                                          "",
                                                        Average:
                                                          (emptyTrainee &&
                                                            emptyTrainee.Average) ||
                                                          "",
                                                        FacultyId:
                                                          (emptyTrainee &&
                                                            emptyTrainee.FacultyId) ||
                                                          "",
                                                      })
                                                    }
                                                    validationSchema={Yup.object().shape(
                                                      {
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
                                                          .matches(
                                                            /^[\u0600-\u06FF\s]+$/
                                                          )
                                                          .required(
                                                            "Please Enter Your Certificate Type"
                                                          ),
                                                        ExaminationSession:
                                                          Yup.string().required(
                                                            "Examination Session Is Required"
                                                          ),
                                                        grandFatherName:
                                                          Yup.string()
                                                            .matches(/^[أ-ي]+$/)
                                                            .required(
                                                              "Please Enter Your Grandfather Name"
                                                            ),
                                                        MotherName: Yup.string()
                                                          .matches(/^[أ-ي]+$/)
                                                          .required(
                                                            "Please Enter Your Mother Name"
                                                          ),
                                                        BirthLocation:
                                                          Yup.string()
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
                                                        DiplomaNumber:
                                                          Yup.string()
                                                            .matches(/^[0-9]+$/)
                                                            .required(
                                                              "Please Enter Your Certificate Number"
                                                            ),
                                                        DiplomaCountryId:
                                                          Yup.string()
                                                            .matches(/^[أ-ي]+$/)
                                                            .required(
                                                              "Please Enter Your Certificate Country"
                                                            ),
                                                        birthdate:
                                                          Yup.date().required(
                                                            "Please Enter Your Date of Birth"
                                                          ),
                                                        FacultyId:
                                                          Yup.string().required(
                                                            "Please Enter Your Faculty"
                                                          ),

                                                        Average: Yup.string()
                                                          .matches(/^[0-9]+$/)
                                                          .required(
                                                            "Please Enter Your Average"
                                                          ),
                                                        Email:
                                                          Yup.string().email(
                                                            "Must be a valid Email"
                                                          ),
                                                      }
                                                    )}
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
                                                      <div className="student-form">
                                                        <Form>
                                                          <Col lg="12">
                                                            <Card>
                                                              <div>
                                                                {successMessage && (
                                                                  <Alert
                                                                    color="success"
                                                                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                    role="alert"
                                                                  >
                                                                    {
                                                                      successMessage
                                                                    }
                                                                    <button
                                                                      type="button"
                                                                      className="btn-close"
                                                                      aria-label="Close"
                                                                      onClick={
                                                                        this
                                                                          .handleSuccessClose
                                                                      }
                                                                    ></button>
                                                                  </Alert>
                                                                )}
                                                              </div>
                                                              <CardBody>
                                                                <div className="wizard clearfix">
                                                                  <div className="steps clearfix">
                                                                    <ul className="nav-list">
                                                                      <NavItem
                                                                        key={1}
                                                                        className={`nav-item ${
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          1
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
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
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          2
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
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
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          3
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
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
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          4
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
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
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          5
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
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
                                                                        this
                                                                          .state
                                                                          .activeTab
                                                                      }
                                                                      className="body"
                                                                    >
                                                                      <TabPane
                                                                        key={1}
                                                                        tabId={
                                                                          1
                                                                        }
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
                                                                                                      trainee?.socialStatusId
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
                                                                        tabId={
                                                                          2
                                                                        }
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
                                                                                        "Registered Under"
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
                                                                                          className={`form-control }`}
                                                                                          placeholder={t(
                                                                                            "Type to search..."
                                                                                          )}
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
                                                                                          onChange={estimate => {
                                                                                            setFieldValue(
                                                                                              "EstimateId",
                                                                                              estimate.value
                                                                                            );
                                                                                          }}
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
                                                                                          placeholder={t(
                                                                                            "Type to search..."
                                                                                          )}
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
                                                                                          onChange={estimate => {
                                                                                            setFieldValue(
                                                                                              "EstimateId",
                                                                                              estimate.value
                                                                                            );
                                                                                          }}
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
                                                                                          placeholder={t(
                                                                                            "Type to search..."
                                                                                          )}
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
                                                                                          placeholder={t(
                                                                                            "Type to search..."
                                                                                          )}
                                                                                          list="certificateDatalistOptions"
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
                                                                                          placeholder={t(
                                                                                            "Type to search..."
                                                                                          )}
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
                                                                                          id="diplomaCountry"
                                                                                        />

                                                                                        <datalist id="CountrydatalistOptions">
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
                                                                                          placeholder={t(
                                                                                            "Type to search..."
                                                                                          )}
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
                                                                                          onBlur={
                                                                                            handleBlur
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
                                                                                          for="traineeStatus-Id"
                                                                                          className="form-label d-flex"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Trainee Status"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Select
                                                                                          id="traineeStatus-Id"
                                                                                          name="statusId"
                                                                                          options={
                                                                                            traineeStatus
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
                                                                                          defaultValue={traineeStatus.find(
                                                                                            opt =>
                                                                                              opt.value ===
                                                                                              trainee?.statusId
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
                                                                                                                            universityTrainees
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
                                                                        tabId={
                                                                          3
                                                                        }
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
                                                                        tabId={
                                                                          4
                                                                        }
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
                                                                                          <span>
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
                                                                                          </span>
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
                                                                        tabId={
                                                                          5
                                                                        }
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
                                                                      {!isEdit &&
                                                                        this
                                                                          .state
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
                                                                              {this.props.t(
                                                                                "Save"
                                                                              )}
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {isEdit &&
                                                                        this
                                                                          .state
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
                                                                              {this.props.t(
                                                                                "Save"
                                                                              )}
                                                                            </Link>
                                                                          </li>
                                                                        )}

                                                                      {!isEdit &&
                                                                        this
                                                                          .state
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
                                                                              {this.props.t(
                                                                                "Save"
                                                                              )}
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {isEdit &&
                                                                        this
                                                                          .state
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
                                                                              {this.props.t(
                                                                                "Save"
                                                                              )}
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {!isEdit &&
                                                                        this
                                                                          .state
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
                                                                              {this.props.t(
                                                                                "Save"
                                                                              )}
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {isEdit &&
                                                                        this
                                                                          .state
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
                                                                              {this.props.t(
                                                                                "Save"
                                                                              )}
                                                                            </Link>
                                                                          </li>
                                                                        )}

                                                                      <li
                                                                        className={
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          1
                                                                            ? "previous disabled"
                                                                            : "previous"
                                                                        }
                                                                      >
                                                                        <Link
                                                                          to="#"
                                                                          onClick={() => {
                                                                            this.toggleTab(
                                                                              this
                                                                                .state
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
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          5
                                                                            ? "next disabled"
                                                                            : "next"
                                                                        }
                                                                      >
                                                                        <Link
                                                                          to="#"
                                                                          onClick={() => {
                                                                            this.toggleTab(
                                                                              this
                                                                                .state
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
                                                      </div>
                                                    )}
                                                  </Formik>
                                                )}
                                              </div>
                                            </div>
                                          </ModalBody>
                                        </Modal>
                                      </div>
                                    </Col>
                                  </React.Fragment>
                                )}
                              </ToolkitProvider>
                            )}
                          </PaginationProvider>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </Row>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = ({
  trainees,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  menu_items,
  tempTrainees,
  nationalities,
  countries,
  cities,
  diplomalevels,
  certificates,
  governorates,
  regReqDocuments,
  genders,
  certificatelevels,
  admissionConditions,
  academiccertificates,
  highstudytypes,
  grants,
  years,
  relatives,
  estimates,
  dataUrl,
  mimeType,
}) => ({
  trainees: trainees.trainees,
  // trainee: trainees.trainee,
  deleted: trainees.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  FatherNames: generalManagements.FatherNames,
  years: years.years,
  nationalities: nationalities.nationalities,
  faculties: mobAppFacultyAccs.faculties,
  countries: countries.countries,
  cities: cities.cities,
  diplomalevels: diplomalevels.diplomalevels,
  governorates: governorates.governorates,
  regReqDocuments: regReqDocuments.regReqDocuments,
  genders: genders.genders,
  academiccertificates: academiccertificates.academiccertificates,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  socialStatus: tempTrainees.socialStatus,
  relatives: relatives.relatives,
  regcertificates: tempTrainees.regcertificates,
  deleted: tempTrainees.deleted,
  highstudytypes: highstudytypes.highstudytypes,
  estimates: estimates.estimates,
  requiredDocs: tempTrainees.requiredDocs,
  traineeStatus: trainees.traineeStatus,
  user_menu: menu_items.user_menu || [],
  dataUrl: dataUrl,
  mimeType: mimeType,
});

const mapDispatchToProps = dispatch => ({
  onGetTrainees: lng => dispatch(getTrainees(lng)),
  onAddNewTrainee: trainee => dispatch(addNewTrainee(trainee)),
  onUpdateTrainee: trainee => dispatch(updateTrainee(trainee)),
  onDeleteTrainee: trainee => dispatch(deleteTrainee(trainee)),
  // onGetTraineeById: trainee => dispatch(getTraineeById(trainee)),
  onGetTraineesDocuments: obj => dispatch(getTempTraineeDefaultRegReqDocs(obj)),
  onAddNewProfessionalExperience: profExperience =>
    dispatch(addNewProfessionalExperience(profExperience)),
  onUpdateProfessionalExperience: profExperience =>
    dispatch(updateProfessionalExperience(profExperience)),
  onDeleteProfessionalExperience: profExperience =>
    dispatch(deleteProfessionalExperience(profExperience)),
  onAddRequiredDocs: trainee => dispatch(addRequiredDocs(trainee)),
  onUploadFile: fileData => dispatch(uploadFile(fileData)),
  onFetchFile: fileId => dispatch(fetchFile(fileId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesList));
