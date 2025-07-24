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
  getStudents,
  addNewStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  generateStudent,
  getDefaultRegReqDocs,
  getStudentDeletedValue,
  getTempRelativeDeletedValue,
} from "store/Exam/Applicants/actions";

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
// import { departments } from "common/data";
// import certificateLevel from "pages/Certificateslevels/certificate-level";
class ApplicantsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      student: "",
      years: [],
      tempStudentLocal: "",
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
      selectedregistrationCertLevelId: "",
      selectedStudyPattern: "",
      selectedExaminationSession: "",
      IsTransferStudentCheck: false,
      transferUniName: "",
      selectedTransferUnivCountry: "",
      selectedRegistrationDate: new Date().toISOString().split("T")[0],
      selectedNationalityId: 0,
      nationalityName: "",
      grantName: "",
      selectedCountry: "",
      selectedSemester: "",
      selectedGovernorate: "",
      selectedCity: "",
      selectedGender: "",
      genderName: "",
      selectedBirthDate: "",
      selectedRegistrationDiplomaDate: "",
      selectedEmissionDate: "",
      selectedPassportGrantDate: "",
      selectedPassportExpirationDate: "",
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
      facultyError: false,
      diplomaError: false,
      averageError: false,
      errorMessage: null,
      successMessage: null,
      averageValue: "",
      showAlert: null,
      HasBrotherCheck: false,
      showGenerateButton: false,
      totalGradeValue: "",
      studentGrade: "",
      rows: [],
      bloodTypeName: "",
      examinationSessionError: false,
      duplicateRelativeError: null,
      relativesArray: [],
      lastUsedId: 0,
      stdDocsArray: [],
      showSiblingsSelect: false,
      siblingsArray: [],
      duplicateErrorSibling: null,
      deleteBroModal: false,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };

    this.handleEditStudent = this.handleEditStudent.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleStudentClicks = this.handleStudentClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleTabVertical = this.toggleTabVertical.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleIsTransferStudentChange =
      this.handleIsTransferStudentChange.bind(this);
    this.handleCheckboxEdit = this.handleCheckboxEdit.bind(this);
    this.handleButtonEdit = this.handleButtonEdit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    const {
      last_created_student,
      students,
      tempStudent_regReqDocs,
      onGetStudents,
      tempStudent,
      generated_student,
      nationalities,
      relatives,
      faculties,
      countries,
      cities,
      yearSemesters,
      currentSemester,
      certificates,
      governorates,
      regReqDocuments,
      genders,
      certificatelevels,
      admissionConditions,
      academiccertificates,
      filteredFaculties,
      filteredAcademicCertificates,
      deleted,
      universityStudents,
      grants,
      studentsOpt,
      tempStudentBrothers,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.getAllObject(this.props.user_menu, this.props.location.pathname);
    const { student } = this.state;
    onGetStudents();
    this.setState({ last_created_student });
    this.setState({ students });
    this.setState({ tempStudent_regReqDocs });
    this.setState({ nationalities });
    this.setState({ relatives });
    this.setState({ faculties });
    this.setState({ countries });
    this.setState({ yearSemesters });
    this.setState({ currentSemester });
    this.setState({ cities });
    this.setState({ certificates });
    this.setState({ governorates });
    this.setState({ regReqDocuments });
    this.setState({ genders });
    this.setState({ certificatelevels });
    this.setState({ admissionConditions });
    this.setState({ academiccertificates });
    this.setState({ filteredFaculties });
    this.setState({ filteredAcademicCertificates });
    this.setState({ tempStudent });
    this.setState({ generated_student });
    this.setState({ deleted });
    this.setState({ universityStudents, studentsOpt });
    this.setState({ grants });
    this.setState({ tempStudentBrothers });
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

    console.log(this.state.currentYearObj, "gggg");
  }

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
  }
  handleSelectYear = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    const { onGetStudents } = this.props;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
    onGetStudents();
  };
  handleStudentClicks = () => {
    const { tempStudent } = this.props;
    const emptyStudent = {};
    Object.keys(tempStudent).forEach(key => {
      emptyStudent[key] = "";
    });

    const { currentSemester } = this.props;

    const { selectedBirthDate } = this.state;
    this.setState({
      selectedNationalityId: "",
      nationalityName: "",
      grantName: "",
      bloodTypeName: "",
      selectedGender: "",
      selectedDiploma: "",
      averageValue: "",
      selectedFacultyId: "",
      facultyName: "",
      selectedStudyPlanId: "",
      studyPlanName: "",
      selectedCountry: "",
      selectedGovernorate: "",
      selectedCity: "",
      selectedBrother: "",
      selectedExaminationSession: "",
      selectedregistrationCertLevelId: "",
      selectedStudyPattern: "",
      IsTransferStudentCheck: "",
      selectedTransferUnivCountry: "",
      selectedSemester: currentSemester.cuYearSemesterId,
      selectedBirthDate: "",
      selectedRegistrationDiplomaDate: "",
      selectedHasDisability: null,
      selectedHealthProblems: null,
      totalGradeValue: "",
      studentGrade: "",
      stdDocsArray: [],
      siblingsArray: [],
      relativesArray: [],
    });

    this.setState({
      emptyStudent,
      isEdit: false,
      showGenerateButton: false,
      errorMessage: null,
      successMessage: null,
    });
    this.toggle();
  };

  handleSave = values => {
    const {
      selectedBirthDate,
      selectedNationalityId,
      selectedFacultyId,
      selectedDiplomaId,
      averageValue,
      studentGrade,
      selectedStudyPlanId,
      selectedExaminationSession,
      isEdit,
    } = this.state;

    if (
      values.FirstName === "" ||
      values.LastName === "" ||
      values.FatherName === "" ||
      values.grandFatherName === "" ||
      values.MotherName === "" ||
      values.BirthLocation === "" ||
      selectedExaminationSession === "" ||
      (values.birthdate === "" && selectedBirthDate === "") ||
      (values.NationalityId === "" && selectedNationalityId === "") ||
      (values.FacultyId === "" && selectedFacultyId === "") ||
      (values.diplomaId === "" && selectedDiplomaId === "") ||
      (values.stdTotalGrade === "" && studentGrade === "")
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
      if (values.grandFatherName.trim() === "") {
        this.setState({ grandFatherNameError: true, saveError: true });
      }
      if (values.MotherName.trim() === "") {
        this.setState({ motherNameError: true, saveError: true });
      }

      if (values.BirthLocation.trim() === "") {
        this.setState({ birthLocError: true, saveError: true });
      }

      if (values.birthdate === "" && selectedBirthDate === "") {
        this.setState({ birthdateError: true, saveError: true });
      }

      if (values.NationalityId === "" && selectedNationalityId === "") {
        this.setState({ nationalityError: true, saveError: true });
      }

      if (values.FacultyId === "" && selectedFacultyId === "") {
        this.setState({ facultyError: true, saveError: true });
      }

      if (values.diplomaId === "" && selectedDiplomaId === "") {
        this.setState({ diplomaError: true, saveError: true });
      }
      if (selectedExaminationSession === "") {
        this.setState({ examinationSessionError: true, saveError: true });
      }
      if (isEdit) {
        const errorUpdateStudentMessage = this.props.t(
          "Fill the Required Fields to Update Student"
        );
        this.setState({ errorMessage: errorUpdateStudentMessage });
      } else {
        const errorSaveStudentMessage = this.props.t(
          "Fill the Required Fields to Save Student"
        );
        this.setState({ errorMessage: errorSaveStudentMessage });
      }
    } else {
      this.setState({ firstNameError: false, saveError: false });
      this.setState({ lastNameError: false, saveError: false });
      this.setState({ fatherNameError: false, saveError: false });
      this.setState({ motherNameError: false, saveError: false });
      this.setState({ examinationSessionError: false, saveError: false });
      this.setState({ birthLocError: false, saveError: false });
      this.setState({ birthdateError: false, saveError: false });
      this.setState({ nationalityError: false, saveError: false });
      this.setState({ facultyError: false, saveError: false });
      this.setState({ diplomaError: false, saveError: false });
      this.setState({ averageError: false, saveError: false });
      this.setState({ grandFatherNameError: false, saveError: false });

      let studentinfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          studentinfo[key] = values[key];
      });

      const {
        student,
        selectedExaminationSession,
        selectedStudyPattern,
        selectedregistrationCertLevelId,
        selectedBirthDate,
        selectedRegistrationDiplomaDate,
        selectedEmissionDate,
        selectedPassportGrantDate,
        selectedPassportExpirationDate,
        selectedDiplomaDate,
        selectedDiplomaVerificationDate,
        selectedRegistrationDate,
        selectedGender,
        selectedNationalityId,
        selectedFacultyId,
        selectedStudyPlanId,
        IsTransferStudentCheck,
        selectedDiploma,
        selectedCountry,
        selectedGovernorate,
        selectedCity,
        selectedTransferUnivCountry,
        selectedSemester,
        HasBrotherCheck,
        selectedHasDisability,
        selectedHealthProblems,
        stdDocsArray,
        relativesArray,
        siblingsArray,
      } = this.state;

      const { onUpdateStudent, onAddNewStudent, tempStudent } = this.props;
      const {
        cities,
        faculties,
        countries,
        certificates,
        yearSemesters,
        currentSemester,
        governorates,
        genders,
      } = this.props;

      if (selectedGender) {
        studentinfo["GenderId"] = parseInt(selectedGender);
      }

      if (selectedNationalityId) {
        studentinfo["NationalityId"] = selectedNationalityId;
        if (selectedNationalityId != 2) {
          studentinfo["Mobilization"] = "";
        }
      } else {
        studentinfo["NationalityId"] = tempStudent.NationalityId;
        studentinfo["Mobilization"] = tempStudent.Mobilization;
        studentinfo["MobilizationNum"] = tempStudent.MobilizationNum;
      }

      if (studentinfo.FacultyId != selectedFacultyId) {
        studentinfo["FacultyId"] = selectedFacultyId;
      } else {
        studentinfo["FacultyId"] = tempStudent.FacultyId;
      }

      if (tempStudent.plan_study != selectedStudyPlanId) {
        studentinfo["plan_study"] = selectedStudyPlanId;
        if (!selectedStudyPlanId) {
          studentinfo["plan_study"] = null;
        }
      } else {
        studentinfo["plan_study"] = tempStudent.plan_study;
      }

      if (selectedDiploma) {
        const diplomaObject = certificates.find(
          certificate => certificate.value === selectedDiploma
        );

        if (diplomaObject != undefined) {
          studentinfo["diplomaId"] = diplomaObject.key;
        } else {
          studentinfo["diplomaId"] = tempStudent.diplomaId;
        }
      }

      if (selectedCountry) {
        const countryObject = countries.find(
          country => country.value === selectedCountry
        );

        if (countryObject != undefined) {
          studentinfo["DiplomaCountryId"] = countryObject.key;
        } else {
          studentinfo["DiplomaCountryId"] = tempStudent.DiplomaCountryId;
        }
      }

      if (selectedGovernorate) {
        const governorateObject = governorates.find(
          governorate => governorate.value === selectedGovernorate
        );

        if (governorateObject != undefined) {
          studentinfo["DiplomaGovernorateId"] = governorateObject.key;
        } else {
          studentinfo["DiplomaGovernorateId"] =
            tempStudent.DiplomaGovernorateId;
        }
      }

      if (selectedCity) {
        const cityObject = cities.find(city => city.value === selectedCity);

        if (cityObject != undefined) {
          studentinfo["DiplomaCityId"] = cityObject.key;
        } else {
          studentinfo["DiplomaCityId"] = tempStudent.DiplomaCityId;
        }
      }

      if (selectedSemester) {
        const semesterObject = yearSemesters.find(
          yearSemester => yearSemester.value === selectedSemester
        );

        if (semesterObject != undefined) {
          studentinfo["registerYearSemesterId"] = semesterObject.key;
        } else {
          studentinfo["registerYearSemesterId"] =
            currentSemester.cuYearSemesterId;
        }
      } else {
        studentinfo["registerYearSemesterId"] =
          tempStudent.registerYearSemesterId;
      }

      if (selectedExaminationSession) {
        studentinfo["ExaminationSession"] = selectedExaminationSession;
      }
      if (selectedHasDisability) {
        studentinfo["hasDisability"] = selectedHasDisability;
      }
      if (selectedHealthProblems) {
        studentinfo["healthProblems"] = selectedHealthProblems;
      }
      if (selectedStudyPattern) {
        studentinfo["studyPattern"] = selectedStudyPattern;
      }

      if (selectedregistrationCertLevelId) {
        studentinfo["registrationCertLevelId"] =
          selectedregistrationCertLevelId;
        if (selectedregistrationCertLevelId == 3) {
          studentinfo["registrationDiplomaName"] = "";
          studentinfo["registrationDiplomaDepartment"] = "";
          studentinfo["registrationDiplomaAverage"] = "";
        }
      }

      if (values.birthdate) {
        studentinfo["birthdate"] =
          values && values.birthdate
            ? new Date(values.birthdate).toISOString().split("T")[0]
            : selectedBirthDate;
      }

      if (selectedRegistrationDiplomaDate) {
        studentinfo["registrationDiplomaDate"] =
          selectedRegistrationDiplomaDate;
      } else if (tempStudent.registrationDiplomaDate) {
        studentinfo["registrationDiplomaDate"] =
          tempStudent && tempStudent.registrationDiplomaDate
            ? new Date(tempStudent.registrationDiplomaDate)
                .toISOString()
                .split("T")[0]
            : selectedRegistrationDiplomaDate;
      }

      if (selectedEmissionDate) {
        studentinfo["EmissionDate"] = selectedEmissionDate;
      } else if (tempStudent.EmissionDate) {
        studentinfo["EmissionDate"] =
          tempStudent && tempStudent.EmissionDate
            ? new Date(tempStudent.EmissionDate).toISOString().split("T")[0]
            : selectedEmissionDate;
      }

      if (selectedPassportGrantDate) {
        studentinfo["passportGrantDate"] = selectedPassportGrantDate;
      } else if (tempStudent.passportGrantDate) {
        studentinfo["passportGrantDate"] =
          tempStudent && tempStudent.passportGrantDate
            ? new Date(tempStudent.passportGrantDate)
                .toISOString()
                .split("T")[0]
            : selectedPassportGrantDate;
      }

      if (selectedPassportExpirationDate) {
        studentinfo["passportExpirationDate"] = selectedPassportExpirationDate;
      } else if (tempStudent.passportExpirationDate) {
        studentinfo["passportExpirationDate"] =
          tempStudent && tempStudent.passportExpirationDate
            ? new Date(tempStudent.passportExpirationDate)
                .toISOString()
                .split("T")[0]
            : selectedPassportExpirationDate;
      }

      if (selectedDiplomaDate) {
        studentinfo["diplomaDate"] = selectedDiplomaDate;
      } else if (tempStudent.diplomaDate) {
        studentinfo["diplomaDate"] =
          tempStudent && tempStudent.diplomaDate
            ? new Date(tempStudent.diplomaDate).toISOString().split("T")[0]
            : selectedDiplomaDate;
      }

      if (selectedDiplomaVerificationDate) {
        studentinfo["diplomaVerificationDate"] =
          selectedDiplomaVerificationDate;
      } else if (tempStudent.diplomaVerificationDate) {
        studentinfo["diplomaVerificationDate"] =
          tempStudent && tempStudent.diplomaVerificationDate
            ? new Date(tempStudent.diplomaVerificationDate)
                .toISOString()
                .split("T")[0]
            : selectedDiplomaVerificationDate;
      }

      if (selectedRegistrationDate) {
        studentinfo["RegistrationDate"] = selectedRegistrationDate;
      }

      if (IsTransferStudentCheck) {
        const isChecked = IsTransferStudentCheck;

        const newStatus = isChecked ? 1 : 0;

        if (newStatus == 1) {
          studentinfo["IsTransferStudent"] = newStatus;
          if (studentinfo.TransferUnivCountryId != undefined) {
            const transferUnivCountryObject = countries.find(
              country => country.value === selectedTransferUnivCountry
            );

            if (transferUnivCountryObject != undefined) {
              studentinfo["TransferUnivCountryId"] =
                transferUnivCountryObject.key;
            } else {
              studentinfo["TransferUnivCountryId"] =
                tempStudent.TransferUnivCountryId;
            }
          }
        }
      }

      if (HasBrotherCheck) {
        studentinfo["haveBrother"] = 1;
      } else {
        studentinfo["haveBrother"] = 0;
      }

      if (averageValue) {
        studentinfo["Average"] = averageValue;
      }

      studentinfo["parentContact"] = relativesArray;
      studentinfo["siblings"] = siblingsArray;

      if (isEdit) {
        studentinfo["Id"] = tempStudent.Id;
        const extractedArray = stdDocsArray.map(item => ({
          Id: item.Id,
          regReqDocId: item.regReqDocId,
          attestated: parseInt(item.attestated),
          availableNumber: item.availableNumber,
        }));

        studentinfo["stdDocs"] = extractedArray;
        onUpdateStudent(studentinfo);
        const updateStudentMessage = this.props.t(
          "Student updated successfully"
        );
        this.setState({ successMessage: updateStudentMessage });
      } else {
        const extractedArray = stdDocsArray.map(item => ({
          regReqDocId: item.Id,
          attestated: parseInt(item.attestated),
          availableNumber: item.availableNumber,
        }));

        studentinfo["stdDocs"] = extractedArray;

        console.log("studentInfo in save", studentinfo);
        //        onAddNewStudent(studentinfo);
        const saveStudentMessage = this.props.t(
          "Student saved successfully, You can Generate the student"
        );
        this.setState({
          successMessage: saveStudentMessage,
          showGenerateButton: true,
        });
      }
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = student => {
    this.setState({ student: student });
    this.setState({ deleteModal: true });
  };

  handleDeleteStudent = () => {
    const { onDeleteStudent } = this.props;
    const { student } = this.state;
    if (student.Id !== undefined) {
      let onDelete = { Id: student.Id };
      onDeleteStudent(onDelete);
      this.setState({ deleteModal: false, showAlert: true });
    }
  };

  handleEditStudent = arg => {
    const { tempStudent, onGetStudentById, certificates, currentSemester } =
      this.props;
    const { stdDocsArray, siblingsArray, relativesArray } = this.state;
    const student = arg;

    onGetStudentById(student);
    this.setState({ isEdit: true, showGenerateButton: true });
    this.setState({
      selectedBirthDate:
        new Date(student.birthdate).toISOString().split("T")[0] || "",
      nationalityName: student.nationality || "",
      grantName: student.grantId || "",
      bloodTypeName: student.bloodType || "",
      selectedNationalityId: student.nationalityId || null,
      selectedGender: student.GenderId || null,
      selectedDiploma: student.diplomaId || null,
      averageValue: student.Average || null,
      studentGrade: student.stdTotalGrade || null,
      selectedCountry: student.DiplomaCountryId || null,
      facultyName: student.Faculty || "",
      studyPlanName: student.plan_study || "",
      selectedFacultyId: student.FacultyId || null,
      selectedGovernorate: student.DiplomaGovernorateId || null,
      selectedCity: student.DiplomaCityId || null,
      selectedExaminationSession: student.ExaminationSession || "",
      selectedHasDisability: student.hasDisability || "",
      selectedHealthProblems: student.healthProblems || "",
      selectedregistrationCertLevelId: student.registrationCertLevelId || "",
      selectedStudyPattern: student.studyPattern || "",
      IsTransferStudentCheck: student.IsTransferStudent || null,
      HasBrotherCheck: student.haveBrother || null,
      selectedTransferUnivCountry: student.TransferUnivCountryId || null,
      selectedSemester:
        student.registerYearSemesterId || currentSemester.cuYearSemesterId,
      student: student.Id,
      //selectedRegistrationDiplomaDate:
      //new Date(student.registrationDiplomaDate).toISOString().split("T")[0] || "",
      stdDocsArray:
        tempStudent &&
        tempStudent.RegReqDocTempStudent !== undefined &&
        tempStudent.RegReqDocTempStudent !== null
          ? tempStudent.RegReqDocTempStudent
          : stdDocsArray,
      siblingsArray:
        tempStudent &&
        tempStudent.TempStudentBrothers !== undefined &&
        tempStudent.TempStudentBrothers !== null
          ? tempStudent.TempStudentBrothers
          : siblingsArray,
      relativesArray:
        tempStudent &&
        tempStudent.TempStudentRelatives !== undefined &&
        tempStudent.TempStudentRelatives !== null
          ? tempStudent.TempStudentRelatives
          : relativesArray,
    });

    this.setState({
      showSiblingsSelect: student.haveBrother == 1 ? true : false,
    });

    if (student.diplomaId) {
      const totalGrade = (
        certificates.find(
          certificate => certificate.key === student.diplomaId
        ) || ""
      ).totalGrades;

      this.setState({
        totalGradeValue: totalGrade,
      });
    }

    const { grantCond } = this.state;
    let obj = {
      diplomaId: student.diplomaId,
      Average: parseInt(student.Average),
      isGrantCond: grantCond,
      YearId: currentSemester.cuYearId,
    };

    const { onGetFilteredFaculties } = this.props;
    onGetFilteredFaculties(obj);

    const { onGetFilteredAcademicCertificates } = this.props;
    onGetFilteredAcademicCertificates(student.FacultyId);

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
    const { isEdit, siblingsArray, relativesArray, stdDocsArray } = this.state;
    const { tempStudent } = this.props;
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
        if (isEdit) {
          this.setState({
            stdDocsArray:
              tempStudent &&
              tempStudent.RegReqDocTempStudent !== undefined &&
              tempStudent.RegReqDocTempStudent !== null
                ? tempStudent.RegReqDocTempStudent
                : stdDocsArray,
            siblingsArray:
              tempStudent &&
              tempStudent.TempStudentBrothers !== undefined &&
              tempStudent.TempStudentBrothers !== null
                ? tempStudent.TempStudentBrothers
                : siblingsArray,
            relativesArray:
              tempStudent &&
              tempStudent.TempStudentRelatives !== undefined &&
              tempStudent.TempStudentRelatives !== null
                ? tempStudent.TempStudentRelatives
                : relativesArray,
          });
        }
      }
    }

    if ((tab == 4 || tab == 3 || tab == 2 || tab == 1) && isEdit == false) {
      const { tempStudent_regReqDocs } = this.props;
      const { stdDocsArray } = this.state;
      this.setState({
        stdDocsArray: !stdDocsArray.length
          ? tempStudent_regReqDocs
          : stdDocsArray,
      });
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

  handleButtonClick = (fieldName, option) => {
    console.log("fieldName", fieldName);
    console.log("option", option);
    const { onGetDefaultRegReqDocs, currentSemester } = this.props;
    let obj = { yearId: currentSemester.cuYearId, certificateLevelId: option };
    onGetDefaultRegReqDocs(obj);

    if (fieldName == "ExaminationSession") {
      this.setState({ selectedExaminationSession: option });
    }
    if (fieldName == "registrationCertLevelId") {
      this.setState({ selectedregistrationCertLevelId: option });
    }
    if (fieldName == "studyPattern") {
      this.setState({ selectedStudyPattern: option });
    }
    if (fieldName === "hasDisability") {
      this.setState({ selectedHasDisability: option });
    }

    if (fieldName === "healthProblems") {
      this.setState({ selectedHealthProblems: option });
    }
  };

  handleIsTransferStudentChange = event => {
    const { name, checked } = event.target;
    this.setState({
      IsTransferStudentCheck: checked,
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
    console.log("rowId", rowId);
    console.log("fieldName", fieldName);
    console.log("fieldValue", fieldValue);
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

  handleIsSpecial = event => {
    const { averageValue, selectedDiplomaId } = this.state;
    const { currentSemester, onGetFilteredFaculties } = this.props;
    const { name, checked } = event.target;

    this.setState({
      IsSpecial: checked,
      grantCond: checked ? 1 : 0,
    });
    const grantValue = checked ? 1 : 0;

    if (averageValue != "" && selectedDiplomaId != undefined) {
      let obj = {
        diplomaId: selectedDiplomaId,
        Average: averageValue,
        isGrantCond: grantValue,
        YearId: currentSemester.cuYearId,
      };

      onGetFilteredFaculties(obj);
    }
  };

  handleDiplomaSelect = (event, fieldName) => {
    const { certificates, currentSemester, onGetFilteredFaculties } =
      this.props;

    const selectedValue = event.target.value;

    if (fieldName === "diplomaId") {
      this.setState({ selectedDiploma: selectedValue, diplomaError: false });

      const diplomaObject = certificates.find(
        certificate => certificate.value === event.target.value
      );

      if (diplomaObject) {
        const { averageValue, grantCond, studentGrade } = this.state;

        this.setState({ selectedDiplomaId: diplomaObject.key });

        const totalGrade = (
          certificates.find(
            certificate => certificate.value === selectedValue
          ) || ""
        ).totalGrades;

        this.setState({
          totalGradeValue: totalGrade,
        });

        if (averageValue != "") {
          const average = (studentGrade / totalGrade) * 100;
          let obj = {
            diplomaId: diplomaObject.key,
            Average: average,
            isGrantCond: grantCond,
            YearId: currentSemester.cuYearId,
          };

          onGetFilteredFaculties(obj);
          this.setState({
            averageValue: average,
          });
        }
      }
    }
  };

  handleDataListChange = (event, fieldName) => {
    const { IsTransferStudentCheck, HasBrotherCheck } = this.state;

    const selectedValue = event.target.value;

    if (fieldName == "DiplomaCountryId") {
      this.setState({ selectedCountry: selectedValue });
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState({ selectedGovernorate: selectedValue });
    }

    if (fieldName == "DiplomaCityId") {
      this.setState({ selectedCity: selectedValue });
    }

    if (IsTransferStudentCheck) {
      if (fieldName === "TransferUnivCountryId") {
        this.setState({ selectedTransferUnivCountry: selectedValue });
      }
    }

    if (HasBrotherCheck) {
      if (fieldName === "studentSID") {
        this.setState({ selectedBrother: selectedValue });
      }
    }

    if (fieldName == "registerYearSemesterId") {
      this.setState({ selectedSemester: selectedValue });
    }
  };

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

    if (fieldName == "studentSID") {
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

    if (fieldName == "studentSID") {
      this.setState({ selectedBrother });
    }
  };

  handleSelectChange = (fieldName, selectedValue) => {
    const { onGetFilteredAcademicCertificates, nationalities } = this.props;
    if (fieldName == "FacultyId") {
      this.setState({
        selectedFacultyId: selectedValue,
      });
      onGetFilteredAcademicCertificates(selectedValue);
    }
    if (fieldName == "NationalityId") {
      const nationality = nationalities.find(
        nationality => nationality.value == selectedValue
      );

      this.setState({
        selectedNationalityId: selectedValue,
        nationalityName: nationality.label,
      });
    }
  };

  handleSelectStudyPlan = (fieldName, selectedValue) => {
    if (fieldName == "plan_study") {
      this.setState({
        selectedStudyPlanId: selectedValue,
      });
    }
  };

  handleGenerateStudent = studentId => {
    const { onGenerateStudent, last_created_student } = this.props;

    const { isEdit } = this.state;
    if (isEdit) {
      onGenerateStudent(studentId);
    } else if (!isEdit) {
      onGenerateStudent(last_created_student);
    }

    this.setState({ generateModal: true });
  };

  toggleGenerateModal = () => {
    this.setState(prevState => ({
      generate: !prevState.generate,
    }));
  };

  onCloseGenerateModal = () => {
    const { onGetStudents } = this.props;
    this.setState({ generateModal: false });
    onGetStudents();
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleDeletedSuccessClose = () => {
    const { onGetStudentDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStudentDeletedValue();
  };

  handleDeletedErrorClose = () => {
    const { onGetStudentDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStudentDeletedValue();
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

  handleChangeStudentGrade = (fieldName, value) => {
    const { onGetFilteredFaculties, certificates, currentSemester } =
      this.props;
    const { totalGradeValue, selectedDiplomaId, grantCond } = this.state;
    const average = (value / totalGradeValue) * 100;

    this.setState({ averageValue: average, studentGrade: value });

    if (selectedDiplomaId != undefined) {
      let obj = {
        diplomaId: selectedDiplomaId,
        Average: average,
        isGrantCond: grantCond,
        YearId: currentSemester.cuYearId,
      };

      onGetFilteredFaculties(obj);
    }
  };

  handleAlertCloseRelative = () => {
    this.setState({ duplicateErrorRelative: null });
  };

  handleAddRowRelative = () => {
    const { relativesArray, lastUsedId, isEdit, student } = this.state;
    const { tempRelatives } = this.props;
    const emptyRowsExist = relativesArray.some(
      relative => relative.arName.trim() === ""
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorRelative: errorMessage });
    } else {
      const newRelative = {
        Id: lastUsedId,
        arName: "",
        enName: "",
        relativeId: null,
        nationalityId: null,
        phone: "",
        cellular: "",
      };
      this.setState({
        relativesArray: [...relativesArray, newRelative],
        lastUsedId: lastUsedId + 1,
      });
      this.setState({ duplicateErrorRelative: null });
    }
  };

  handleParentsDataChange = (id, fieldName, newValue) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedRelatives = prevState.relativesArray.map(relative => {
        if (relative.Id === id) {
          return {
            ...relative,
            [fieldName]: newValue,
          };
        }
        return relative;
      });

      return {
        relativesArray: updatedRelatives,
      };
    });
  };

  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedRelatives = prevState.relativesArray.map(relative => {
        if (relative.Id === rowId) {
          return {
            ...relative,
            [fieldName]: selectedValue,
          };
        }
        return relative;
      });

      return {
        relativesArray: updatedRelatives,
      };
    });
  };

  deleteRelative = relative => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedRelatives = prevState.relativesArray.filter(
        item => item.Id !== relative.Id
      );
      return {
        relativesArray: updatedRelatives,
      };
    });
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

  handleSelectBrother = (rowId, fieldName, selectedValue, oldValue) => {
    const { studentsOpt, onUpdateBrother } = this.props;
    const { siblingsArray } = this.state;

    const selectBro = studentsOpt.find(
      studentOpt => studentOpt.value + " " + studentOpt.key == oldValue
    );
    this.setState({ oldBrother: selectBro });

    const brotherObj = studentsOpt.find(
      studentOpt => studentOpt.value + " " + studentOpt.key === selectedValue
    );

    if (brotherObj) {
      this.setState({ oldBrother: {} });
      const isDuplicate = siblingsArray.some(
        studentBrother =>
          studentBrother.Id !== rowId &&
          studentBrother.brotherSID === brotherObj.key
      );
      if (isDuplicate) {
        const errorMessage = this.props.t("Sibling already exists");
        this.setState({ duplicateErrorSibling: errorMessage });
        console.error("value exist");
      } else {
        this.setState({ duplicateErrorSibling: null });
        this.setState(prevState => {
          const updatedSiblings = prevState.siblingsArray.map(sibling => {
            if (sibling.Id === rowId) {
              return {
                ...sibling,
                [fieldName]: brotherObj.key,
              };
            }
            return sibling;
          });

          return {
            siblingsArray: updatedSiblings,
          };
        });
      }
    }
  };

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

  render() {
    //meta title
    document.title =
      "Student List | keyInHands - React Admin & Dashboard Template";

    const {
      selectedYear,
      relativesArray,
      selectedHealthProblems,
      selectedHasDisability,
      selectedRegistrationDate,
      selectedregistrationCertLevelId,
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
      IsTransferStudentCheck,
      emptyStudent,
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
      averageValue,
      showAlert,
      grantCond,
      IsSpecial,
      HasBrotherCheck,
      selectedBrother,
      showGenerateButton,
      studentGrade,
      totalGradeValue,
      duplicateErrorRelative,
      stdDocsArray,
      showSiblingsSelect,
      siblingsArray,
      duplicateErrorSibling,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      menuObject,
      currentYearObj,
    } = this.state;

    const showNewInput =
      selectedregistrationCertLevelId === 1 ||
      selectedregistrationCertLevelId === 2;

    const showUniForm = selectedregistrationCertLevelId === 79;

    const {
      years,
      tempRelatives,
      students,
      tempStudent,
      tempStudent_regReqDocs,
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
      generated_student,
      deleted,
      universityStudents,
      grants,
      t,
      regReqDocuments,
      studentsOpt,
      tempStudentBrothers,
    } = this.props;

    console.log("universityStudents", universityStudents);
    console.log("studentsOpt", studentsOpt);

    const { isEdit, deleteModal, generateModal } = this.state;

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const studentListColumns = [
      {
        text: "Id",
        key: "Id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, student) => <>{student.Id}</>,
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
        dataField: "motherName",
        text: this.props.t("Mother Name"),
        key: "mothName",
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "idNum",
        key: "b-day",
        text: this.props.t("ID Number"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "birthdate",
        text: this.props.t("Registration date"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          // hidden: !showSearchButton,
        }),
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, student) => (
          <div className="d-flex gap-3">
            {/* {menuObject && menuObject.isEdit == 1 && ( */}
            <Link className="text-secondary" to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => this.handleEditStudent(student)}
              ></i>
            </Link>
            {/* )} */}
            {/* {menuObject && menuObject.isDelete == 1 && ( */}
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(student)}
              ></i>
            </Link>
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
      tempStudent && tempStudent.RegistrationDate
        ? new Date(tempStudent.RegistrationDate).toISOString().split("T")[0]
        : selectedRegistrationDate;

    const formattedEmissionDate =
      isEdit && tempStudent && tempStudent.EmissionDate
        ? new Date(tempStudent.EmissionDate).toISOString().split("T")[0]
        : selectedEmissionDate;

    const formattedPassportGrantDate =
      isEdit && tempStudent && tempStudent.passportGrantDate
        ? new Date(tempStudent.passportGrantDate).toISOString().split("T")[0]
        : selectedPassportGrantDate;

    const formattedPassportExpirationDate =
      isEdit && tempStudent && tempStudent.passportExpirationDate
        ? new Date(tempStudent.passportExpirationDate)
            .toISOString()
            .split("T")[0]
        : selectedPassportExpirationDate;

    const formattedDiplomaDate =
      isEdit && tempStudent && tempStudent.diplomaDate
        ? new Date(tempStudent.diplomaDate).toISOString().split("T")[0]
        : selectedDiplomaDate;

    const formattedDiplomaVerificationDate =
      isEdit && tempStudent && tempStudent.diplomaVerificationDate
        ? new Date(tempStudent.diplomaVerificationDate)
            .toISOString()
            .split("T")[0]
        : selectedDiplomaVerificationDate;

    const student = this.state.student;

    const pageOptions = {
      sizePerPage: 10,
      TotalGradeSize: students.length, // replace later with size(students),
      custom: true,
    };

    const defaultSorted = [
      {
        id: 99,
        dataField: "Id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    const ParentsColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "arName", text: t("Name(ar)"), sort: true },
      { dataField: "enName", text: t("Name(en)"), sort: true },
      {
        dataField: "relativeId",
        text: t("Relatives"),
        formatter: (cell, row) => (
          <Select
            key={`relative_Id`}
            options={relatives}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "relativeId",
                newValue.value
              );
            }}
            value={relatives.find(opt => opt.value == row.relativeId)}
          />
        ),
        editable: false,
      },

      {
        dataField: "nationalityId",
        text: t("Nationality"),
        formatter: (cell, row) => (
          <Select
            key={`nationality_Id`}
            options={nationalities}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "nationalityId",
                newValue.value
              );
            }}
            defaultValue={nationalities.find(
              opt => opt.value == row.nationalityId
            )}
          />
        ),
        editable: false,
      },
      { dataField: "phone", text: t("Phone Number") },
      { dataField: "cellular", text: t("Cellular Number") },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, relative) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.deleteRelative(relative)}
            ></i>
          </Link>
        ),
      },
    ];

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
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className={`btn ${
                row.attestated === 1 ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() =>
                this.handleRegReqDocDataChange(row.Id, "attestated", 1)
              }
            >
              {this.props.t("Yes")}
            </button>
            <button
              type="button"
              className={`btn ${
                row.attestated === 0 ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() =>
                this.handleRegReqDocDataChange(row.Id, "attestated", 0)
              }
            >
              {this.props.t("No")}
            </button>
          </div>
        ),
        editorRenderer: (
          editorProps,
          value,
          row,
          column,
          rowIndex,
          columnIndex
        ) => (
          <div className="btn-group">
            <button
              type="button"
              className={`btn ${
                value === 1 ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() =>
                this.handleRegReqDocDataChange(row.Id, "attestated", 1)
              }
            >
              {this.props.t("Yes")}
            </button>
            <button
              type="button"
              className={`btn ${
                value === 0 ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() =>
                this.handleRegReqDocDataChange(row.Id, "attestated", 0)
              }
            >
              {this.props.t("No")}
            </button>
          </div>
        ),
      },
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
          onDeleteClick={this.handleDeleteStudent}
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
                      columns={studentListColumns}
                      data={students}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          key="unique-toolkit-key"
                          keyField="Toolkit-Provider"
                          columns={studentListColumns}
                          data={students}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="5"></Col>
                                <Col sm="3">
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
                                <Col sm="3"></Col>

                                {/* {menuObject && menuObject.isAdd == 1 && ( */}
                                <Col sm="1">
                                  <div className="text-sm-end">
                                    <Tooltip
                                      title={this.props.t("Create New Student")}
                                      placement="top"
                                    >
                                      <IconButton
                                        color="primary"
                                        onClick={this.handleStudentClicks}
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </Col>
                                {/* )} */}
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
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
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
                                    {/* <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Student")
                                          : this.props.t("Add New Student")}
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
                                                      "Student Generated Successfully"
                                                    )}
                                                  </h2>
                                                  <h4>
                                                    {this.props.t("Id :")}
                                                    {generated_student.newSId}
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
                                              Id: tempStudent.Id,
                                              FirstName:
                                                (tempStudent &&
                                                  tempStudent.FirstName) ||
                                                "",
                                              LastName:
                                                (tempStudent &&
                                                  tempStudent.LastName) ||
                                                "",
                                              FatherName:
                                                (tempStudent &&
                                                  tempStudent.FatherName) ||
                                                "",
                                              grandFatherName:
                                                (tempStudent &&
                                                  tempStudent.grandFatherName) ||
                                                "",
                                              MotherName:
                                                (tempStudent &&
                                                  tempStudent.MotherName) ||
                                                "",
                                              BirthLocation:
                                                (tempStudent &&
                                                  tempStudent.BirthLocation) ||
                                                "",
                                              FirstNameE:
                                                (tempStudent &&
                                                  tempStudent.FirstNameE) ||
                                                "",
                                              LastNameE:
                                                (tempStudent &&
                                                  tempStudent.LastNameE) ||
                                                "",
                                              FatherNameE:
                                                (tempStudent &&
                                                  tempStudent.FatherNameE) ||
                                                "",
                                              grandFatherNameE:
                                                (tempStudent &&
                                                  tempStudent.grandFatherNameE) ||
                                                "",
                                              MotherNameE:
                                                (tempStudent &&
                                                  tempStudent.MotherNameE) ||
                                                "",
                                              BirthLocationE:
                                                (tempStudent &&
                                                  tempStudent.BirthLocationE) ||
                                                "",
                                              birthdate:
                                                (tempStudent &&
                                                  tempStudent.birthdate) ||
                                                "",
                                              NationalityId:
                                                tempStudent &&
                                                tempStudent.NationalityId,
                                              GenderId:
                                                (tempStudent &&
                                                  tempStudent.GenderId) ||
                                                selectedGender,
                                              Mobilization:
                                                (tempStudent &&
                                                  tempStudent.Mobilization) ||
                                                "",
                                              MobilizationNum:
                                                (tempStudent &&
                                                  tempStudent.MobilizationNum) ||
                                                "",
                                              IdNumber:
                                                (tempStudent &&
                                                  tempStudent.IdNumber) ||
                                                "",
                                              perosonalCardNum:
                                                (tempStudent &&
                                                  tempStudent.perosonalCardNum) ||
                                                "",
                                              EmissionDate:
                                                (tempStudent &&
                                                  tempStudent.EmissionDate) ||
                                                formattedEmissionDate,
                                              perCardCaza:
                                                (tempStudent &&
                                                  tempStudent.perCardCaza) ||
                                                "",
                                              perCardPlaceRegistration:
                                                (tempStudent &&
                                                  tempStudent.perCardPlaceRegistration) ||
                                                "",
                                              perCardRegNum:
                                                (tempStudent &&
                                                  tempStudent.perCardRegNum) ||
                                                "",
                                              PassNumber:
                                                (tempStudent &&
                                                  tempStudent.PassNumber) ||
                                                "",
                                              passportGrantDate:
                                                (tempStudent &&
                                                  tempStudent.passportGrantDate) ||
                                                formattedPassportGrantDate,
                                              passportExpirationDate:
                                                (tempStudent &&
                                                  tempStudent.passportExpirationDate) ||
                                                formattedPassportExpirationDate,
                                              diplomaId:
                                                (tempStudent &&
                                                  tempStudent.diplomaId) ||
                                                selectedDiploma,
                                              DiplomaCountryId:
                                                (tempStudent &&
                                                  tempStudent.DiplomaCountryId) ||
                                                selectedCountry,
                                              DiplomaNumber:
                                                (tempStudent &&
                                                  tempStudent.DiplomaNumber) ||
                                                "",
                                              DiplomaGovernorateId:
                                                (tempStudent &&
                                                  tempStudent.DiplomaGovernorateId) ||
                                                selectedGovernorate,
                                              DiplomaCityId:
                                                (tempStudent &&
                                                  tempStudent.DiplomaCityId) ||
                                                selectedCity,
                                              DiplomaYear:
                                                (tempStudent &&
                                                  tempStudent.DiplomaYear) ||
                                                "",
                                              ExaminationSession:
                                                (tempStudent &&
                                                  tempStudent.ExaminationSession) ||
                                                selectedExaminationSession,
                                              TotalGrade:
                                                (tempStudent &&
                                                  tempStudent.TotalGrade) ||
                                                "",
                                              Average:
                                                (tempStudent &&
                                                  tempStudent.Average) ||
                                                averageValue,
                                              diplomaDate:
                                                (tempStudent &&
                                                  tempStudent.diplomaDate) ||
                                                formattedDiplomaDate,
                                              diplomaVerificationNum:
                                                (tempStudent &&
                                                  tempStudent.diplomaVerificationNum) ||
                                                "",
                                              diplomaVerificationDate:
                                                (tempStudent &&
                                                  tempStudent.diplomaVerificationDate) ||
                                                formattedDiplomaVerificationDate,
                                              registrationCertLevelId:
                                                tempStudent &&
                                                tempStudent.registrationCertLevelId,
                                              registrationDiplomaName:
                                                (tempStudent &&
                                                  tempStudent.registrationDiplomaName) ||
                                                "",
                                              registrationDiplomaDepartment:
                                                (tempStudent &&
                                                  tempStudent.registrationDiplomaDepartment) ||
                                                "",
                                              registrationDiplomaAverage:
                                                (tempStudent &&
                                                  tempStudent.registrationDiplomaAverage) ||
                                                "",
                                              registrationDiplomaDate:
                                                (tempStudent &&
                                                  tempStudent.registrationDiplomaDate) ||
                                                selectedRegistrationDiplomaDate,
                                              IsTransferStudent:
                                                (tempStudent &&
                                                  tempStudent.IsTransferStudent) ||
                                                IsTransferStudentCheck,
                                              TransferUniv:
                                                (tempStudent &&
                                                  tempStudent.TransferUniv) ||
                                                "",
                                              TransferUnivCountryId:
                                                (tempStudent &&
                                                  tempStudent.TransferUnivCountryId) ||
                                                selectedTransferUnivCountry,
                                              TransferUnivAverage:
                                                (tempStudent &&
                                                  tempStudent.TransferUnivAverage) ||
                                                "",
                                              studyPattern:
                                                (tempStudent &&
                                                  tempStudent.studyPattern) ||
                                                "",
                                              registerYearSemesterId:
                                                (tempStudent &&
                                                  tempStudent.registerYearSemesterId) ||
                                                selectedSemester,
                                              RegistrationDate:
                                                (tempStudent &&
                                                  tempStudent.RegistrationDate) ||
                                                formattedRegistrationDate,
                                              FacultyId:
                                                (tempStudent &&
                                                  tempStudent.FacultyId) ||
                                                selectedFacultyId,
                                              plan_study:
                                                (tempStudent &&
                                                  tempStudent.plan_study) ||
                                                selectedStudyPlanId,
                                              acceptanceDate:
                                                (tempStudent &&
                                                  tempStudent.acceptanceDate) ||
                                                "",
                                              CurrentAddress:
                                                (tempStudent &&
                                                  tempStudent.CurrentAddress) ||
                                                "",
                                              currentAddrStreet:
                                                (tempStudent &&
                                                  tempStudent.currentAddrStreet) ||
                                                "",
                                              currentAddrBuildingNum:
                                                (tempStudent &&
                                                  tempStudent.currentAddrBuildingNum) ||
                                                "",
                                              CurrentAddrPhone:
                                                (tempStudent &&
                                                  tempStudent.CurrentAddrPhone) ||
                                                "",
                                              CurrentAddrCell:
                                                (tempStudent &&
                                                  tempStudent.CurrentAddrCell) ||
                                                "",
                                              PermanentAddress:
                                                (tempStudent &&
                                                  tempStudent.PermanentAddress) ||
                                                "",
                                              permanentAddrStreet:
                                                (tempStudent &&
                                                  tempStudent.permanentAddrStreet) ||
                                                "",
                                              permanentAddrBuildingNum:
                                                (tempStudent &&
                                                  tempStudent.permanentAddrBuildingNum) ||
                                                "",
                                              PermanentAddrPhone:
                                                (tempStudent &&
                                                  tempStudent.PermanentAddrPhone) ||
                                                "",
                                              PermanentAddrCell:
                                                (tempStudent &&
                                                  tempStudent.PermanentAddrCell) ||
                                                "",
                                              Email:
                                                (tempStudent &&
                                                  tempStudent.Email) ||
                                                "",
                                              GeneralNote:
                                                (tempStudent &&
                                                  tempStudent.GeneralNote) ||
                                                "",
                                              bloodType:
                                                (tempStudent &&
                                                  tempStudent.bloodType) ||
                                                "",
                                              hasDisability:
                                                (tempStudent &&
                                                  tempStudent.hasDisability) ||
                                                "",
                                              healthProblems:
                                                (tempStudent &&
                                                  tempStudent.healthProblems) ||
                                                "",
                                              OtherHealthDetails:
                                                (tempStudent &&
                                                  tempStudent.OtherHealthDetails) ||
                                                "",
                                              grantId:
                                                (tempStudent &&
                                                  tempStudent.grantId) ||
                                                "",
                                            }) ||
                                            (!isEdit && {
                                              FirstName:
                                                (emptyStudent &&
                                                  emptyStudent.FirstName) ||
                                                "",
                                              LastName:
                                                (emptyStudent &&
                                                  emptyStudent.LastName) ||
                                                "",
                                              FatherName:
                                                (emptyStudent &&
                                                  emptyStudent.FatherName) ||
                                                "",
                                              grandFatherName:
                                                (emptyStudent &&
                                                  emptyStudent.grandFatherName) ||
                                                "",
                                              MotherName:
                                                (emptyStudent &&
                                                  emptyStudent.MotherName) ||
                                                "",
                                              BirthLocation:
                                                (emptyStudent &&
                                                  emptyStudent.BirthLocation) ||
                                                "",
                                              birthdate:
                                                (emptyStudent &&
                                                  emptyStudent.birthdate) ||
                                                selectedBirthDate,
                                              NationalityId:
                                                (emptyStudent &&
                                                  emptyStudent.NationalityId) ||
                                                "",
                                              diplomaId:
                                                (emptyStudent &&
                                                  emptyStudent.diplomaId) ||
                                                "",
                                              Average:
                                                (emptyStudent &&
                                                  emptyStudent.Average) ||
                                                "",
                                              FacultyId:
                                                (emptyStudent &&
                                                  emptyStudent.FacultyId) ||
                                                "",
                                              grantId:
                                                (emptyStudent &&
                                                  emptyStudent.grantId) ||
                                                "",
                                              bloodType:
                                                (emptyStudent &&
                                                  emptyStudent.bloodType) ||
                                                "",
                                              hasDisability:
                                                (emptyStudent &&
                                                  emptyStudent.hasDisability) ||
                                                "",
                                              healthProblems:
                                                (emptyStudent &&
                                                  emptyStudent.healthProblems) ||
                                                "",
                                              OtherHealthDetails:
                                                (emptyStudent &&
                                                  emptyStudent.OtherHealthDetails) ||
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
                                                                  "Registration Info"
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
                                                                  "Contact Info"
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
                                                            <Card id="student-card">
                                                              <CardBody className="cardBody">
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
                                                                              First
                                                                              Name
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="FirstNameE"
                                                                              id="enfirstName"
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
                                                                            <Label for="enlastName">
                                                                              Last
                                                                              Name
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="LastNameE"
                                                                              id="enlastName"
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
                                                                            <Label for="enfatherName">
                                                                              Father
                                                                              Name
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="FatherNameE"
                                                                              id="enfatherName"
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
                                                                            <Label for="enGrandFatherName">
                                                                              Grandfather
                                                                              Name
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="grandFatherNameE"
                                                                              id="enGrandFatherName"
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
                                                                            <Label for="enmotherName">
                                                                              Mother
                                                                              Name
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="MotherNameE"
                                                                              id="enmotherName"
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
                                                                            <Label for="enbirthLoc">
                                                                              Place
                                                                              of
                                                                              Birth
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <Field
                                                                              type="text"
                                                                              name="BirthLocationE"
                                                                              id="enbirthLoc"
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
                                                              </CardBody>
                                                            </Card>

                                                            <Card>
                                                              <CardBody className="mb-4">
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
                                                                                (values.birthdate
                                                                                  ? new Date(
                                                                                      values.birthdate
                                                                                    )
                                                                                      .toISOString()
                                                                                      .split(
                                                                                        "T"
                                                                                      )[0]
                                                                                  : "") ||
                                                                                ""
                                                                              }
                                                                              onChange={event => {
                                                                                handleChange(
                                                                                  event
                                                                                );
                                                                                console.log(
                                                                                  "event",
                                                                                  event
                                                                                    .target
                                                                                    .value
                                                                                );
                                                                              }}
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
                                                                              <Label className="form-label">
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
                                                                              className={`select-style-std ${
                                                                                nationalityError
                                                                                  ? "is-invalid"
                                                                                  : ""
                                                                              }`}
                                                                              name="NationalityId"
                                                                              key={`nationality_select`}
                                                                              options={
                                                                                nationalities
                                                                              }
                                                                              onChange={newValue =>
                                                                                this.handleSelectChange(
                                                                                  "NationalityId",
                                                                                  newValue.value
                                                                                )
                                                                              }
                                                                              defaultValue={nationalities.find(
                                                                                opt =>
                                                                                  opt.label ===
                                                                                  nationalityName
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
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label className="form-label">
                                                                              {this.props.t(
                                                                                "Gender"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-3">
                                                                            <div className="radio-buttons-gender-container mt-3">
                                                                              {genders.map(
                                                                                gender => (
                                                                                  <div
                                                                                    className="radio-button-gender"
                                                                                    key={
                                                                                      gender.value
                                                                                    }
                                                                                  >
                                                                                    <Input
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
                                                                                            .value
                                                                                        );
                                                                                      }}
                                                                                      defaultChecked={
                                                                                        gender.value ===
                                                                                        selectedGender
                                                                                      }
                                                                                    />{" "}
                                                                                    {this.props.t(
                                                                                      gender.label
                                                                                    )}
                                                                                  </div>
                                                                                )
                                                                              )}
                                                                            </div>
                                                                          </Col>
                                                                        </Row>
                                                                      </div>
                                                                      {(nationalityName.includes(
                                                                        "سوري"
                                                                      ) ||
                                                                        nationalityName
                                                                          .toLowerCase()
                                                                          .includes(
                                                                            "syrian"
                                                                          )) &&
                                                                        (genderName.includes(
                                                                          "ذكر"
                                                                        ) ||
                                                                          genderName
                                                                            .toLowerCase()
                                                                            .includes(
                                                                              "male"
                                                                            )) && (
                                                                          <FormGroup>
                                                                            <div className="mb-3">
                                                                              <Row>
                                                                                <Col className="col-4">
                                                                                  <Label
                                                                                    for="mobilization"
                                                                                    className="form-label"
                                                                                  >
                                                                                    {this.props.t(
                                                                                      "Mobilization"
                                                                                    )}
                                                                                  </Label>
                                                                                </Col>
                                                                                <Col className="col-8">
                                                                                  <Field
                                                                                    type="text"
                                                                                    name="Mobilization"
                                                                                    id="mobilization"
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
                                                                                  <Label
                                                                                    for="MobilizationNum"
                                                                                    className="form-label"
                                                                                  >
                                                                                    {this.props.t(
                                                                                      "Mobilization Number"
                                                                                    )}
                                                                                  </Label>
                                                                                </Col>
                                                                                <Col className="col-8">
                                                                                  <Field
                                                                                    type="number"
                                                                                    name="MobilizationNum"
                                                                                    id="MobilizationNum"
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
                                                                </div>
                                                              </CardBody>
                                                            </Card>

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
                                                                                  "ID Number"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="IdNumber"
                                                                                id="idNum"
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
                                                                              <Label for="cardNum">
                                                                                {this.props.t(
                                                                                  "Card Number"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="perosonalCardNum"
                                                                                id="cardNum"
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
                                                                              <Label for="emissionDate">
                                                                                {this.props.t(
                                                                                  "Grant Date"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <input
                                                                                name="EmissionDate"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                                type="date"
                                                                                onChange={event =>
                                                                                  this.handleDateChange(
                                                                                    "EmissionDate",
                                                                                    event
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                                defaultValue={
                                                                                  formattedEmissionDate
                                                                                }
                                                                                id="emissionDate-date-input"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="cardCaza">
                                                                                {this.props.t(
                                                                                  "perCardCaza"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="perCardCaza"
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
                                                                                  "Place of Registration"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="perCardPlaceRegistration"
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
                                                                                  "Number of Registration"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <Field
                                                                                type="text"
                                                                                name="perCardRegNum"
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
                                                                                  "Granting Date"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <input
                                                                                name="passportGrantDate"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                                type="date"
                                                                                onChange={event =>
                                                                                  this.handleDateChange(
                                                                                    "passportGrantDate",
                                                                                    event
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                                defaultValue={
                                                                                  formattedPassportGrantDate
                                                                                }
                                                                                id="passportGrantDate-date-input"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col className="col-4">
                                                                              <Label for="passExpDate">
                                                                                {this.props.t(
                                                                                  "Expiration Date"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-8">
                                                                              <input
                                                                                name="passportExpirationDate"
                                                                                className={
                                                                                  "form-control"
                                                                                }
                                                                                type="date"
                                                                                onChange={event =>
                                                                                  this.handleDateChange(
                                                                                    "passportExpirationDate",
                                                                                    event
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                                defaultValue={
                                                                                  formattedPassportExpirationDate
                                                                                }
                                                                                id="passportExpirationDate-date-input"
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
                                                            <Row>
                                                              <Accordion defaultActiveKey="1">
                                                                <Accordion.Item eventKey="2">
                                                                  <Accordion.Header>
                                                                    {this.props.t(
                                                                      "Health Information"
                                                                    )}
                                                                  </Accordion.Header>
                                                                  <Accordion.Body>
                                                                    <Row>
                                                                      <Col>
                                                                        {" "}
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="1">
                                                                              <Label
                                                                                for="bloodType"
                                                                                className="form-label"
                                                                              >
                                                                                {this.props.t(
                                                                                  "Blood Type"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="2">
                                                                              <Select
                                                                                className={`select-style-std ${
                                                                                  facultyError
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                                name="bloodType"
                                                                                key={`blood_select`}
                                                                                options={
                                                                                  bloodTypes
                                                                                }
                                                                                onChange={blood => {
                                                                                  setFieldValue(
                                                                                    "bloodType",
                                                                                    blood.value
                                                                                  );
                                                                                }}
                                                                                defaultValue={bloodTypes.find(
                                                                                  opt =>
                                                                                    opt.label ===
                                                                                    bloodTypeName
                                                                                )}
                                                                              />
                                                                            </Col>

                                                                            <Col lg="auto">
                                                                              {" "}
                                                                              <Label for="exam-session">
                                                                                {this.props.t(
                                                                                  "Has Disability"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="2">
                                                                              <div
                                                                                name="hasDisability"
                                                                                id="exam-session"
                                                                                role="group"
                                                                                className={
                                                                                  "btn-group btn-group-example mb-3 bg-transparent"
                                                                                }
                                                                              >
                                                                                <button
                                                                                  id="yes"
                                                                                  type="button"
                                                                                  name="hasDisability"
                                                                                  value={
                                                                                    selectedHasDisability ==
                                                                                    1
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }
                                                                                  className={`btn btn-outline-primary w-sm ${
                                                                                    selectedHasDisability ==
                                                                                    1
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleButtonClick(
                                                                                      "hasDisability",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>

                                                                                <button
                                                                                  id="no"
                                                                                  type="button"
                                                                                  name="hasDisability"
                                                                                  value={
                                                                                    selectedHasDisability ==
                                                                                    0
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }
                                                                                  className={`btn btn-outline-primary w-sm ${
                                                                                    selectedHasDisability ==
                                                                                    0
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleButtonClick(
                                                                                      "hasDisability",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>

                                                                              <ErrorMessage
                                                                                name="hasDisability"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>

                                                                            <Col lg="2">
                                                                              {" "}
                                                                              <Label for="exam-session">
                                                                                {this.props.t(
                                                                                  "Has Health Problems"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="2">
                                                                              <div
                                                                                name="healthProblems"
                                                                                id="exam-session"
                                                                                role="group"
                                                                                className={
                                                                                  "btn-group btn-group-example mb-3 bg-transparent"
                                                                                }
                                                                              >
                                                                                <button
                                                                                  id="Yes"
                                                                                  type="button"
                                                                                  name="healthProblems"
                                                                                  value={
                                                                                    selectedHealthProblems ==
                                                                                    1
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }
                                                                                  className={`btn btn-outline-primary w-sm ${
                                                                                    selectedHealthProblems ==
                                                                                    1
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleButtonClick(
                                                                                      "healthProblems",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>

                                                                                <button
                                                                                  id="No"
                                                                                  type="button"
                                                                                  name="healthProblems"
                                                                                  value={
                                                                                    selectedHealthProblems ==
                                                                                    0
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }
                                                                                  className={`btn btn-outline-primary w-sm ${
                                                                                    selectedHealthProblems ==
                                                                                    0
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleButtonClick(
                                                                                      "healthProblems",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>

                                                                              <ErrorMessage
                                                                                name="healthProblems"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                    <Row>
                                                                      <Col lg="1">
                                                                        <Label for="otherHealthDetails">
                                                                          {this.props.t(
                                                                            "Other Details"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col lg="10">
                                                                        <textarea
                                                                          type="textfield"
                                                                          name="OtherHealthDetails"
                                                                          id="otherHealthDetails"
                                                                          className={
                                                                            "form-control h-100"
                                                                          }
                                                                          onChange={
                                                                            handleChange
                                                                          }
                                                                          onBlur={
                                                                            handleBlur
                                                                          }
                                                                        />
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
                                                              <Row>
                                                                <Col lg="4">
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="diploma-id">
                                                                          {this.props.t(
                                                                            "Certificate Type"
                                                                          )}
                                                                        </Label>
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
                                                                          onFocus={() =>
                                                                            this.handleInputFocus(
                                                                              "diplomaId"
                                                                            )
                                                                          }
                                                                          onChange={event =>
                                                                            this.handleDiplomaSelect(
                                                                              event,
                                                                              "diplomaId"
                                                                            )
                                                                          }
                                                                          className={`form-control ${
                                                                            facultyError
                                                                              ? "is-invalid"
                                                                              : ""
                                                                          }`}
                                                                          value={
                                                                            (
                                                                              certificates.find(
                                                                                certificate =>
                                                                                  certificate.key ===
                                                                                  selectedDiploma
                                                                              ) ||
                                                                              ""
                                                                            )
                                                                              .value
                                                                          }
                                                                        />
                                                                        <datalist id="certificateDatalistOptions">
                                                                          {certificates.map(
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
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>

                                                                <Col lg="4">
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="diplomaCountry">
                                                                          {this.props.t(
                                                                            "Special Acceptance"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <div className="form-check mb-2">
                                                                          <input
                                                                            type="checkbox"
                                                                            name="IsSpecial"
                                                                            className={`form-check-input input-mini`}
                                                                            onChange={
                                                                              this
                                                                                .handleIsSpecial
                                                                            }
                                                                            defaultChecked={
                                                                              IsSpecial
                                                                            }
                                                                          />
                                                                        </div>
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
                                                                            "Certificate Country"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="DiplomaCountryId"
                                                                          id="diplomaCountry"
                                                                          list="CountrydatalistOptions"
                                                                          placeholder="Type to search..."
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          onBlur={() =>
                                                                            this.handleInputBlur(
                                                                              "DiplomaCountryId"
                                                                            )
                                                                          }
                                                                          onFocus={() =>
                                                                            this.handleInputFocus(
                                                                              "DiplomaCountryId"
                                                                            )
                                                                          }
                                                                          onChange={event =>
                                                                            this.handleDataListChange(
                                                                              event,
                                                                              "DiplomaCountryId"
                                                                            )
                                                                          }
                                                                          value={
                                                                            (
                                                                              countries.find(
                                                                                country =>
                                                                                  country.key ===
                                                                                  selectedCountry
                                                                              ) ||
                                                                              ""
                                                                            )
                                                                              .value
                                                                          }
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
                                                                          id="diplomaGovernorate"
                                                                          list="GovernoratedatalistOptions"
                                                                          placeholder="Type to search..."
                                                                          className={
                                                                            "form-control"
                                                                          }
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
                                                                          onChange={event =>
                                                                            this.handleDataListChange(
                                                                              event,
                                                                              "DiplomaGovernorateId"
                                                                            )
                                                                          }
                                                                          value={
                                                                            (
                                                                              governorates.find(
                                                                                governorate =>
                                                                                  governorate.key ===
                                                                                  selectedGovernorate
                                                                              ) ||
                                                                              ""
                                                                            )
                                                                              .value
                                                                          }
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
                                                                <Col lg="4">
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="diplomaCity">
                                                                          {this.props.t(
                                                                            "Diploma City"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="DiplomaCityId"
                                                                          id="diplomaCity"
                                                                          list="CitydatalistOptions"
                                                                          placeholder="Type to search..."
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          onBlur={() =>
                                                                            this.handleInputBlur(
                                                                              "DiplomaCityId"
                                                                            )
                                                                          }
                                                                          onFocus={() =>
                                                                            this.handleInputFocus(
                                                                              "DiplomaCityId"
                                                                            )
                                                                          }
                                                                          onChange={event =>
                                                                            this.handleDataListChange(
                                                                              event,
                                                                              "DiplomaCityId"
                                                                            )
                                                                          }
                                                                          value={
                                                                            (
                                                                              cities.find(
                                                                                city =>
                                                                                  city.key ===
                                                                                  selectedCity
                                                                              ) ||
                                                                              ""
                                                                            )
                                                                              .value
                                                                          }
                                                                        />
                                                                        <datalist id="CitydatalistOptions">
                                                                          {cities.map(
                                                                            city => (
                                                                              <option
                                                                                key={
                                                                                  city.key
                                                                                }
                                                                                value={
                                                                                  city.value
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
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      {!isEdit ? (
                                                                        <Col className="col-8">
                                                                          <div
                                                                            name="ExaminationSession"
                                                                            id="exam-session"
                                                                            role="group"
                                                                            className={
                                                                              "btn-group btn-group-example mb-3 bg-transparent form-control" +
                                                                              ((errors.ExaminationSession &&
                                                                                touched.ExaminationSession) ||
                                                                              examinationSessionError
                                                                                ? " is-invalid"
                                                                                : "")
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
                                                                          {examinationSessionError && (
                                                                            <div className="invalid-feedback">
                                                                              {this.props.t(
                                                                                "Examination Session is required"
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                          <ErrorMessage
                                                                            name="ExaminationSession"
                                                                            component="div"
                                                                            className="invalid-feedback"
                                                                          />
                                                                        </Col>
                                                                      ) : (
                                                                        <Col className="col-8">
                                                                          <div
                                                                            name="ExaminationSession"
                                                                            id="exam-session"
                                                                            role="group"
                                                                            className={
                                                                              "btn-group btn-group-example mb-3"
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
                                                                      )}
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                                <Col lg="4">
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="diploma-num">
                                                                          {this.props.t(
                                                                            "Certificate Number"
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
                                                                        <Label for="Total">
                                                                          {this.props.t(
                                                                            "Total"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="number"
                                                                          name="stdTotalGrade"
                                                                          id="Total"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          defaultValue={
                                                                            studentGrade
                                                                          }
                                                                          onBlur={event =>
                                                                            this.handleChangeStudentGrade(
                                                                              "stdTotalGrade",
                                                                              event
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
                                                              <Row>
                                                                <Col lg="4">
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="total-grade">
                                                                          {this.props.t(
                                                                            "Total Grade"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="number"
                                                                          name="TotalGrade"
                                                                          id="total-grade"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          value={
                                                                            totalGradeValue
                                                                          }
                                                                          disabled={
                                                                            true
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
                                                                            className={`form-control ${
                                                                              averageError
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                            value={
                                                                              averageValue
                                                                            }
                                                                            onBlur={e => {
                                                                              this.handleAverageChange(
                                                                                e
                                                                                  .target
                                                                                  .value
                                                                              );
                                                                            }}
                                                                            disabled={
                                                                              true
                                                                            }
                                                                          />
                                                                          <div className="input-group-text">
                                                                            %
                                                                          </div>
                                                                          {averageError && (
                                                                            <div className="invalid-feedback">
                                                                              {this.props.t(
                                                                                "Average is required"
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        </InputGroup>
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
                                                                        <Label for="diploma-date">
                                                                          {this.props.t(
                                                                            "Certificate Date"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <input
                                                                          name="diplomaDate"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          type="date"
                                                                          onChange={event =>
                                                                            this.handleDateChange(
                                                                              "diplomaDate",
                                                                              event
                                                                                .target
                                                                                .value
                                                                            )
                                                                          }
                                                                          defaultValue={
                                                                            formattedDiplomaDate
                                                                          }
                                                                          id="diplomaDate-date-input"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                                <Col lg="4">
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
                                                                        <input
                                                                          name="diplomaVerificationDate"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          type="date"
                                                                          onChange={event =>
                                                                            this.handleDateChange(
                                                                              "diplomaVerificationDate",
                                                                              event
                                                                                .target
                                                                                .value
                                                                            )
                                                                          }
                                                                          defaultValue={
                                                                            formattedDiplomaVerificationDate
                                                                          }
                                                                          id="diplomaVerificationDate-date-input"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                              </Row>
                                                            </Row>
                                                          </TabPane>
                                                          <TabPane
                                                            key={3}
                                                            tabId={3}
                                                          >
                                                            <Row className="bordered">
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
                                                                          {certificatelevels
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
                                                                                    selectedregistrationCertLevelId ==
                                                                                    level.arcertificatelevel
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }
                                                                                  className={`btn btn-outline-primary w-sm ${
                                                                                    selectedregistrationCertLevelId ===
                                                                                    level.Id
                                                                                      ? "active"
                                                                                      : ""
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleButtonClick(
                                                                                      "registrationCertLevelId",
                                                                                      level.Id
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {
                                                                                    level.arcertificatelevel
                                                                                  }
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
                                                                <Col lg="4">
                                                                  {showNewInput && (
                                                                    <FormGroup>
                                                                      <div className="mb-2">
                                                                        <Row>
                                                                          <Col className="col-4">
                                                                            <Label
                                                                              for="regDiplomaNme"
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
                                                                              name="registrationDiplomaName"
                                                                              id="regDiplomaName"
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
                                                                  {showNewInput && (
                                                                    <FormGroup>
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
                                                                              type="number"
                                                                              name="registrationDiplomaAverage"
                                                                              id="regDiplomaAverage"
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
                                                                                "Reg Diploma Date"
                                                                              )}
                                                                            </Label>
                                                                          </Col>
                                                                          <Col className="col-8">
                                                                            <input
                                                                              name="registrationDiplomaDate"
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                              type="date"
                                                                              onChange={event =>
                                                                                this.handleDateChange(
                                                                                  "registrationDiplomaDate",
                                                                                  event
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              defaultValue={
                                                                                formattedDiplomaDate
                                                                              }
                                                                              id="registrationDiplomaDate-date-input"
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
                                                                              for="tarnsferUni"
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
                                                                              name="TransferUniv"
                                                                              id="tarnsferUni"
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
                                                                              for="tansferUniId"
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
                                                                              name="TransferUnivCountryId"
                                                                              id="univCountry"
                                                                              list="univCountryDatalistOptions"
                                                                              placeholder="Type to search..."
                                                                              className={
                                                                                "form-control"
                                                                              }
                                                                              onBlur={() =>
                                                                                this.handleInputBlur(
                                                                                  "TransferUnivCountryId"
                                                                                )
                                                                              }
                                                                              onFocus={() =>
                                                                                this.handleInputFocus(
                                                                                  "TransferUnivCountryId"
                                                                                )
                                                                              }
                                                                              onChange={event =>
                                                                                this.handleDataListChange(
                                                                                  event,
                                                                                  "TransferUnivCountryId"
                                                                                )
                                                                              }
                                                                              value={
                                                                                (
                                                                                  countries.find(
                                                                                    country =>
                                                                                      country.key ===
                                                                                      selectedTransferUnivCountry
                                                                                  ) ||
                                                                                  ""
                                                                                )
                                                                                  .value
                                                                              }
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
                                                                              for="tarnsferUni"
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
                                                                              name="TransferUnivAverage"
                                                                              id="tarnsferUni"
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
                                                                            "btn-group btn-group-example mb-3"
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
                                                                </Col>
                                                              </Row>

                                                              <Row>
                                                                <Col lg="4">
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <div>
                                                                          <Label className="form-label">
                                                                            {this.props.t(
                                                                              "Grant"
                                                                            )}
                                                                          </Label>
                                                                        </div>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Select
                                                                          className={`select-style-std`}
                                                                          name="grantId"
                                                                          key={`grant_select`}
                                                                          options={
                                                                            grants
                                                                          }
                                                                          onChange={grant => {
                                                                            setFieldValue(
                                                                              "grantId",
                                                                              grant.value
                                                                            );
                                                                          }}
                                                                          defaultValue={grants.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              grantName
                                                                          )}
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
                                                                        <Label
                                                                          for="reg-smsId"
                                                                          className="form-label"
                                                                        >
                                                                          {this.props.t(
                                                                            "Registration Semester"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          type="text"
                                                                          name="registerYearSemesterId"
                                                                          id="year-semester"
                                                                          list="yearSemesterdatalistOptions"
                                                                          placeholder="Type to search..."
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          onBlur={() =>
                                                                            this.handleInputBlur(
                                                                              "registerYearSemesterId"
                                                                            )
                                                                          }
                                                                          onFocus={() =>
                                                                            this.handleInputFocus(
                                                                              "registerYearSemesterId"
                                                                            )
                                                                          }
                                                                          onChange={event =>
                                                                            this.handleDataListChange(
                                                                              event,
                                                                              "registerYearSemesterId"
                                                                            )
                                                                          }
                                                                          value={
                                                                            yearSemesters.find(
                                                                              yearSemester =>
                                                                                yearSemester.key ===
                                                                                  currentSemester.cuYearSemesterId ||
                                                                                ""
                                                                            )
                                                                              .value
                                                                          }
                                                                          readOnly
                                                                        />
                                                                        <datalist id="yearSemesterdatalistOptions">
                                                                          {yearSemesters.map(
                                                                            yearSemester => (
                                                                              <option
                                                                                key={
                                                                                  yearSemester.key
                                                                                }
                                                                                value={
                                                                                  yearSemester.value
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
                                                              </Row>
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
                                                                            filteredFaculties
                                                                          }
                                                                          onChange={newValue => {
                                                                            this.handleSelectChange(
                                                                              "FacultyId",
                                                                              newValue.value
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
                                                                        <Select
                                                                          className={`select-style-std`}
                                                                          name="plan_study"
                                                                          key={`plan_study_select`}
                                                                          options={
                                                                            filteredAcademicCertificates
                                                                          }
                                                                          onChange={newValue => {
                                                                            this.handleSelectStudyPlan(
                                                                              "plan_study",
                                                                              newValue.value
                                                                            );
                                                                          }}
                                                                          defaultValue={academiccertificates.find(
                                                                            opt =>
                                                                              opt.label ===
                                                                              studyPlanName
                                                                          )}
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
                                                                        <Label for="accept-date">
                                                                          {this.props.t(
                                                                            "Acceptance Date"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Input
                                                                          type="text"
                                                                          name="acceptanceDate"
                                                                          id="accept-date"
                                                                          className={
                                                                            "form-control"
                                                                          }
                                                                          readOnly
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
                                                              </Row>
                                                              <Row>
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
                                                              </Row>
                                                            </Row>
                                                          </TabPane>
                                                          <TabPane
                                                            key={4}
                                                            tabId={4}
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
                                                                  <div className="mb-3">
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
                                                                  </div>
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
                                                                  <div className="mb-3">
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
                                                                            "Permanent Building Number" */}
                                    /
                                    {/* <TabPane
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
                                                                5)) && (
                                                            <li>
                                                              <Link
                                                                to="#"
                                                                className="generate-button"
                                                                onClick={() => {
                                                                  this.handleGenerateStudent(
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
                                                              5 && (
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
                                                          {isEdit && (
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
                                    </Modal> */}
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
  applicants,
  nationalities,
  mobAppFacultyAccs,
  countries,
  generalManagements,
  cities,
  certificates,
  governorates,
  regReqDocuments,
  genders,
  certificatelevels,
  admissionConditions,
  semesters,
  academiccertificates,
  universityStudents,
  grants,
  years,
  menu_items,
  relatives,
}) => ({
  students: applicants.students,
  years: years.years,

  // universityStudents: universityStudents.universityStudents,
  deleted: applicants.deleted,
  // generated_student: applicants.generated_student,
  // tempStudent: applicants.tempStudent,
  // generatedStudent: applicants.generatedStudent,
  // last_created_student: applicants.last_created_student,
  // tempStudent_regReqDocs: applicants.tempStudent_regReqDocs,
  // tempStudentBrothers: applicants.tempStudentBrothers,
  // nationalities: nationalities.nationalities,
  // relatives: relatives.relatives,
  // faculties: mobAppFacultyAccs.faculties,
  // countries: countries.countries,
  // yearSemesters: generalManagements.yearSemesters,
  //  currentSemester: semesters.currentSemester,
  // cities: cities.cities,
  // certificates: certificates.certificates,
  // governorates: governorates.governorates,
  // regReqDocuments: regReqDocuments.regReqDocuments,
  // genders: genders.genders,
  //certificatelevels: certificatelevels.certificatelevels,
  // admissionConditions: admissionConditions.admissionConditions,
  //filteredFaculties: admissionConditions.filteredFaculties,
  // academiccertificates: academiccertificates.academiccertificates,
  // filteredAcademicCertificates:
  //  academiccertificates.filteredAcademicCertificates,
  // grants: grants.grants,
  // tempRelatives: applicants.tempRelatives,
  // studentsOpt: universityStudents.studentsOpt,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetStudents: () => dispatch(getStudents()),
  onAddNewStudent: student => dispatch(addNewStudent(student)),
  onUpdateStudent: student => dispatch(updateStudent(student)),
  onDeleteStudent: student => dispatch(deleteStudent(student)),
  onGetStudentById: tempStudent => dispatch(getStudentById(tempStudent)),
  // onGenerateStudent: student => dispatch(generateStudent(student)),
  // onGetDefaultRegReqDocs: years => dispatch(getDefaultRegReqDocs(years)),
  // onGetFilteredFaculties: admissionCond =>
  //   dispatch(getFilteredFaculties(admissionCond)),
  // onGetFilteredAcademicCertificates: academicCer =>
  //   dispatch(getFilteredAcademicCertificates(academicCer)),
  // onGetStudentDeletedValue: () => dispatch(getStudentDeletedValue()),
  // onGetTempRelativeDeletedValue: () => dispatch(getTempRelativeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ApplicantsList)));
