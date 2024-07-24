import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  Col,
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
  Table,
  CardHeader,
} from "reactstrap";
import Tooltip from "@mui/material/Tooltip";
import Select from "react-select";
import { IconButton } from "@mui/material";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import images from "assets/images";

import { Formik, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

//i18n
import { withTranslation } from "react-i18next";

import {
  getUniversityStudents,
  addNewUniversityStudent,
  updateUniversityStudent,
  deleteUniversityStudent,
  getUniversityStudentById,
  getUniversityStudentRegReqDocs,
  updateUniversityStudentRegReqDoc,
  getBrothers,
  addBrother,
  deleteBrother,
  updateBrother,
  getStdRelatives,
  addNewStdRelative,
  updateStdRelative,
  deleteStdRelative,
  getStdRelativeDeletedValue,
} from "store/university-students/actions";

import { getFilteredFaculties } from "store/admissionConditions/actions";
import { getFilteredAcademicCertificates } from "store/academicvertificates/actions";

import { isEmpty, size, map } from "lodash";

import Accordion from "react-bootstrap/Accordion";

import Dropdown from "react-bootstrap/Dropdown";

import classnames from "classnames";

import InputMask from "react-input-mask";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage
} from "../../../utils/menuUtils";
class UniversityStudentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      universityStudent: "",
      student: "",
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      hasError: false,
      isOpen: false,
      modal: false,
      deleteModal: false,
      deleteBroModal: false,
      selectedDiploma: "",
      selecetdDiplomaId: "",
      selectedFacultyId: 0,
      selectedStudyPlanId: 0,
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
      selectedCountry: "",
      selectedSemester: "",
      selectedGovernorate: "",
      selectedCity: "",
      selectedGender: "",
      genderName: "",
      selectedBirthDate: "",
      selectedEmissionDate: "",
      selectedRegistrationDiplomaDate: "",
      selectedPassportGrantDate: "",
      selectedPassportExpirationDate: "",
      selectedDiplomaDate: "",
      selectedDiplomaVerificationDate: "",
      values: "",
      selectedBrother: [],
      firstNameError: false,
      lastNameError: false,
      fatherNameError: false,
      grandFatherNameError: false,
      motherNameError: false,
      birthLocError: false,
      birthdateError: false,
      nationalityError: false,
      facultyError: false,
      errorMessage: null,
      successMessage: null,
      averageValue: "",
      showAcademicForm: false,
      showRegistrationForm: false,
      duplicateError: null,
      showReportsLi: false,
      showStudentLifeLi: false,
      HasBrotherCheck: false,
      rows: [],
      showSiblingsSelect: false,
      grantCond: 0,
      totalGradeValue: "",
      studentGrade: "",
      IsSpecial: false,
      selectedHasDisability: null,
      selectedHealthProblems: null,
      bloodTypeName: "",
      grantName: "",
      duplicateErrorSibling: null,
      uniSiblingsArray: [],
      uniStdDocsArray: [],
      uniRelativesArray: [],
      showDeleteButton: false,
      showEditButton: true,
      showSearchButton: false,
    };
    this.handleEditUniStudent = this.handleEditUniStudent.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleUniStudentClicks = this.handleUniStudentClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleTabVertical = this.toggleTabVertical.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
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
      universityStudents,
      tempUniversityStudent,
      tempUniversityStudent_regReqDocs,
      onGetUniversityStudents,
      nationalities,
      faculties,
      relatives,
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
      filteredFaculties,
      academiccertificates,
      filteredAcademicCertificates,
      studentsOpt,
      studentBrothers,
      grants,
      user_menu,
    } = this.props;
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);

    if (universityStudents && !universityStudents.length) {
      onGetUniversityStudents();
    }
    this.setState({ universityStudents, studentsOpt, studentBrothers });
    this.setState({ tempUniversityStudent_regReqDocs });
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
    this.setState({ tempUniversityStudent });
    this.setState({ grants });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowDeleteButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowEditButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
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

  handleUniStudentClicks = () => {
    this.setState({
      universityStudent: "",
      bloodTypeName: "",
      selectedHasDisability: null,
      selectedHealthProblems: null,
      isEdit: false,
    });
    this.toggle();
  };

  handleSave = values => {
    const {
      selectedBirthDate,
      selectedNationalityId,
      selectedFacultyId,
      selectedStudyPlanId,
      isEdit,
      studentGrade,
      averageValue,
    } = this.state;

    if (
      values.FirstName == "" ||
      values.LastName == "" ||
      values.FatherName == "" ||
      values.grandFatherName == "" ||
      values.MotherName == "" ||
      values.BirthLocation == "" ||
      (values.birthdate == "" && selectedBirthDate == "") ||
      (values.NationalityId == "" && selectedNationalityId == "") ||
      (values.FacultyId == "" && selectedFacultyId == "")
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

      if (values.birthdate == "" && selectedBirthDate === "") {
        this.setState({ birthdateError: true, saveError: true });
      }

      if (values.NationalityId == "" && selectedNationalityId === "") {
        this.setState({ nationalityError: true, saveError: true });
      }

      if (values.FacultyId == "" && selectedFacultyId === "") {
        this.setState({ facultyError: true, saveError: true });
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
      this.setState({ grandFatherNameError: false, saveError: false });
      this.setState({ motherNameError: false, saveError: false });
      this.setState({ birthLocError: false, saveError: false });
      this.setState({ birthdateError: false, saveError: false });
      this.setState({ nationalityError: false, saveError: false });
      this.setState({ facultyError: false, saveError: false });

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
        selectedBrother,
        selectedBrothers,
        selectedHealthProblems,
        selectedHasDisability,
        uniSiblingsArray,
        uniStdDocsArray,
        uniRelativesArray,
      } = this.state;

      const { onUpdateUniversityStudent, tempUniversityStudent, onAddBrother } =
        this.props;
      const {
        cities,
        faculties,
        countries,
        certificates,
        yearSemesters,
        currentSemester,
        governorates,
        genders,
        studentsOpt,
      } = this.props;

      if (selectedGender) {
        studentinfo["GenderId"] = parseInt(selectedGender);
      }

      if (selectedNationalityId) {
        studentinfo["NationalityId"] = selectedNationalityId;
        if (selectedNationalityId != 2) {
          studentinfo["Mobilization"] = "";
          studentinfo["MobilizationNum"] = 0;
        }
      } else {
        studentinfo["NationalityId"] = tempUniversityStudent.NationalityId;
        studentinfo["Mobilization"] = tempUniversityStudent.Mobilization;
        studentinfo["MobilizationNum"] = tempUniversityStudent.MobilizationNum;
      }
      if (studentinfo.FacultyId != selectedFacultyId) {
        studentinfo["FacultyId"] = selectedFacultyId;
      } else {
        studentinfo["FacultyId"] = tempUniversityStudent.FacultyId;
      }

      if (selectedStudyPlanId) {
        studentinfo["plan_study"] = selectedStudyPlanId;
      } else {
        studentinfo["plan_study"] = tempUniversityStudent.plan_study;
      }

      if (selectedDiploma) {
        const diplomaObject = certificates.find(
          certificate => certificate.value === selectedDiploma
        );

        if (diplomaObject != undefined) {
          studentinfo["diplomaId"] = diplomaObject.key;
        } else {
          studentinfo["diplomaId"] = tempUniversityStudent.diplomaId;
        }
      }

      if (selectedCountry) {
        const countryObject = countries.find(
          country => country.value === selectedCountry
        );

        if (countryObject != undefined) {
          studentinfo["DiplomaCountryId"] = countryObject.key;
        } else {
          studentinfo["DiplomaCountryId"] =
            tempUniversityStudent.DiplomaCountryId;
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
            tempUniversityStudent.DiplomaGovernorateId;
        }
      }

      if (selectedCity) {
        const cityObject = cities.find(city => city.value === selectedCity);

        if (cityObject != undefined) {
          studentinfo["DiplomaCityId"] = cityObject.key;
        } else {
          studentinfo["DiplomaCityId"] = tempUniversityStudent.DiplomaCityId;
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
          tempUniversityStudent.registerYearSemesterId;
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
        }
      }
      if (selectedBirthDate != "") {
        studentinfo["birthdate"] = selectedBirthDate;
      } else {
        studentinfo["birthdate"] =
          tempUniversityStudent && tempUniversityStudent.birthdate
            ? new Date(tempUniversityStudent.birthdate)
                .toISOString()
                .split("T")[0]
            : selectedBirthDate;
      }

      if (selectedRegistrationDiplomaDate != "") {
        studentinfo["registrationDiplomaDate"] =
          selectedRegistrationDiplomaDate;
      } else {
        studentinfo["registrationDiplomaDate"] =
          tempUniversityStudent && tempUniversityStudent.registrationDiplomaDate
            ? new Date(tempUniversityStudent.registrationDiplomaDate)
                .toISOString()
                .split("T")[0]
            : selectedRegistrationDiplomaDate;
      }

      if (selectedEmissionDate) {
        studentinfo["EmissionDate"] = selectedEmissionDate;
      } else if (tempUniversityStudent.EmissionDate) {
        studentinfo["EmissionDate"] =
          tempUniversityStudent && tempUniversityStudent.EmissionDate
            ? new Date(tempUniversityStudent.EmissionDate)
                .toISOString()
                .split("T")[0]
            : selectedEmissionDate;
      }

      if (selectedPassportGrantDate) {
        studentinfo["passportGrantDate"] = selectedPassportGrantDate;
      } else if (tempUniversityStudent.passportGrantDate) {
        studentinfo["passportGrantDate"] =
          tempUniversityStudent && tempUniversityStudent.passportGrantDate
            ? new Date(tempUniversityStudent.passportGrantDate)
                .toISOString()
                .split("T")[0]
            : selectedPassportGrantDate;
      }

      if (selectedPassportExpirationDate) {
        studentinfo["passportExpirationDate"] = selectedPassportExpirationDate;
      } else if (tempUniversityStudent.passportExpirationDate) {
        studentinfo["passportExpirationDate"] =
          tempUniversityStudent && tempUniversityStudent.passportExpirationDate
            ? new Date(tempUniversityStudent.passportExpirationDate)
                .toISOString()
                .split("T")[0]
            : selectedPassportExpirationDate;
      }

      if (selectedDiplomaDate) {
        studentinfo["diplomaDate"] = selectedDiplomaDate;
      } else if (tempUniversityStudent.diplomaDate) {
        studentinfo["diplomaDate"] =
          tempUniversityStudent && tempUniversityStudent.diplomaDate
            ? new Date(tempUniversityStudent.diplomaDate)
                .toISOString()
                .split("T")[0]
            : selectedDiplomaDate;
      }

      if (selectedDiplomaVerificationDate) {
        studentinfo["diplomaVerificationDate"] =
          selectedDiplomaVerificationDate;
      } else if (tempUniversityStudent.diplomaVerificationDate) {
        studentinfo["diplomaVerificationDate"] =
          tempUniversityStudent && tempUniversityStudent.diplomaVerificationDate
            ? new Date(tempUniversityStudent.diplomaVerificationDate)
                .toISOString()
                .split("T")[0]
            : selectedDiplomaVerificationDate;
      }

      if (selectedRegistrationDate) {
        studentinfo["RegistrationDate"] = selectedRegistrationDate;
      }

      if (IsTransferStudentCheck == 1) {
        studentinfo["IsTransferStudent"] = IsTransferStudentCheck;
        if (studentinfo.TransferUnivCountryId != undefined) {
          const transferUnivCountryObject = countries.find(
            country => country.value === selectedTransferUnivCountry
          );

          if (transferUnivCountryObject != undefined) {
            studentinfo["TransferUnivCountryId"] =
              transferUnivCountryObject.key;
          } else {
            studentinfo["TransferUnivCountryId"] =
              tempUniversityStudent.TransferUnivCountryId;
          }
        }
      } else {
        studentinfo["IsTransferStudent"] = 0;
        studentinfo["TransferUniv"] = "";
        studentinfo["TransferUnivCountryId"] = null;
        studentinfo["TransferUnivAverage"] = null;
      }

      if (HasBrotherCheck == 1) {
        studentinfo["haveBrother"] = HasBrotherCheck;
      } else {
        studentinfo["haveBrother"] = 0;
      }

      if (averageValue) {
        studentinfo["Average"] = averageValue;
      }

      const extractedArray = uniStdDocsArray.map(item => ({
        regReqDocId: item.regReqDocId,
        attestated: parseInt(item.attestated),
        availableNumber: item.availableNumber,
      }));

      studentinfo["uniStdDocs"] = extractedArray;
      studentinfo["uniParentContact"] = uniRelativesArray;
      studentinfo["uniSiblings"] = uniSiblingsArray;

      if (isEdit) {
        studentinfo["Id"] = tempUniversityStudent.Id;
        studentinfo["SID"] = tempUniversityStudent.SID;
        onUpdateUniversityStudent(studentinfo);
        const updateStudentMessage = this.props.t(
          "Student updated successfully"
        );
        this.setState({ successMessage: updateStudentMessage });
      }
      this.toggle();
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleDeleteBroModal = () => {
    this.setState(prevState => ({
      deleteBroModal: !prevState.deleteBroModal,
    }));
  };

  onClickDelete = universityStudent => {
    this.setState({ universityStudent: universityStudent });
    this.setState({ deleteModal: true });
  };

  onClickDeleteBrother = brother => {
    this.setState({ brother: brother });
    this.setState({ deleteBroModal: true });
  };

  handleUpdateUniStudent = () => {
    const { onDeleteUniversityStudent } = this.props;
    const { universityStudent } = this.state;
    if (universityStudent.Id !== undefined) {
      let onUpdate = {
        Id: universityStudent.Id,
        SID: universityStudent.SID,
        IsDeleted: 1,
      };
      onDeleteUniversityStudent(onUpdate);

      this.setState({ deleteModal: false });
    }
  };

  handleEditUniStudent = arg => {
    const {
      universityStudents,
      onGetUniStudentById,
      currentSemester,
      studentBrothers,
      certificates,
      onGetRelatives,
      tempUniversityStudent,
    } = this.props;
    const universityStudent = arg;
    const { uniStdDocsArray, uniSiblingsArray, uniRelativesArray } = this.state;

    onGetUniStudentById(universityStudent);
    onGetRelatives(arg.Id);
    console.log("edit universityStudent",universityStudent)

    this.setState({
      grantName: universityStudent.grantId || "",
      bloodTypeName: universityStudent.bloodType || "",
      nationalityName: universityStudent.nationality || "",
      selectedNationalityId: universityStudent.nationalityId || null,
      selectedGender: universityStudent.GenderId || null,
      selectedDiploma: universityStudent.diplomaId || null,
      averageValue: universityStudent.Average || null,
      studentGrade: universityStudent.stdTotalGrade || null,
      selectedCountry: universityStudent.DiplomaCountryId || null,
      facultyName: universityStudent.Faculty || "",
      studyPlanName: universityStudent.plan_study || "",
      selectedFacultyId: universityStudent.FacultyId || null,
      selectedGovernorate: universityStudent.DiplomaGovernorateId || null,
      selectedCity: universityStudent.DiplomaCityId || null,
      selectedHasDisability: universityStudent.hasDisability || "",
      selectedHealthProblems: universityStudent.healthProblems || "",
      selectedExaminationSession: universityStudent.ExaminationSession || "",
      selectedregistrationCertLevelId:
        universityStudent.registrationCertLevelId || "",
      selectedStudyPattern: universityStudent.studyPattern || "",
      IsTransferStudentCheck: universityStudent.IsTransferStudent || null,
      HasBrotherCheck: universityStudent.haveBrother || null,
      selectedTransferUnivCountry:
        universityStudent.TransferUnivCountryId || null,
      selectedSemester:
        universityStudent.registerYearSemesterId ||
        currentSemester.cuYearSemesterId,
      studentId: universityStudent.Id,
      uniStdDocsArray:
        tempUniversityStudent &&
        tempUniversityStudent.RegReqDocStudent !== undefined &&
        tempUniversityStudent.RegReqDocStudent !== null
          ? tempUniversityStudent.RegReqDocStudent
          : uniStdDocsArray,
      uniSiblingsArray:
        tempUniversityStudent &&
        tempUniversityStudent.StudentBrothers !== undefined &&
        tempUniversityStudent.StudentBrothers !== null
          ? tempUniversityStudent.StudentBrothers
          : uniSiblingsArray,
      uniRelativesArray:
        tempUniversityStudent &&
        tempUniversityStudent.StudentRelatives !== undefined &&
        tempUniversityStudent.StudentRelatives !== null
          ? tempUniversityStudent.StudentRelatives
          : uniRelativesArray,
    });

    if (universityStudent.diplomaId) {
      const totalGrade = (
        certificates.find(
          certificate => certificate.key === universityStudent.diplomaId
        ) || ""
      ).totalGrades;

      this.setState({
        totalGradeValue: totalGrade,
      });
    }

    this.setState({ isEdit: true });
    this.setState({
      showSiblingsSelect: universityStudent.haveBrother == 1 ? true : false,
    });

    const { grantCond } = this.state;

    let obj = {
      diplomaId: universityStudent.diplomaId,
      Average: universityStudent.Average,
      isGrantCond: grantCond,
      YearId: currentSemester.cuYearId,
    };

    const { onGetFilteredFaculties } = this.props;
    onGetFilteredFaculties(obj);

    const { onGetFilteredAcademicCertificates } = this.props;
    onGetFilteredAcademicCertificates(universityStudent.FacultyId);

    const { onGetBrothers } = this.props;
    onGetBrothers(universityStudent.FacultyId);

    const { onGetUniversityStudentRegReqDocs } = this.props;
    if (universityStudent && !universityStudent.length) {
      onGetUniversityStudentRegReqDocs(universityStudent);
    }
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
    const {tempUniversityStudent} = this.props
    const {uniStdDocsArray,uniSiblingsArray,uniRelativesArray } = this.state
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
        //malak
        if(isEdit){
          this.setState({
            uniStdDocsArray:
        tempUniversityStudent &&
        tempUniversityStudent.RegReqDocStudent !== undefined &&
        tempUniversityStudent.RegReqDocStudent !== null
          ? tempUniversityStudent.RegReqDocStudent
          : uniStdDocsArray,
      uniSiblingsArray:
        tempUniversityStudent &&
        tempUniversityStudent.StudentBrothers !== undefined &&
        tempUniversityStudent.StudentBrothers !== null
          ? tempUniversityStudent.StudentBrothers
          : uniSiblingsArray,
      uniRelativesArray:
        tempUniversityStudent &&
        tempUniversityStudent.StudentRelatives !== undefined &&
        tempUniversityStudent.StudentRelatives !== null
          ? tempUniversityStudent.StudentRelatives
          : uniRelativesArray,
          })
        }
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

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "registrationCertLevelId") {
      this.setState({ selectedregistrationCertLevelId: option });
    } else if (fieldName == "studyPattern") {
      this.setState({ selectedStudyPattern: option });
    } else if (fieldName == "ExaminationSession") {
      this.setState({ selectedExaminationSession: option });
    }
    if (fieldName === "hasDisability") {
      this.setState({ selectedHasDisability: option });
    }

    if (fieldName === "healthProblems") {
      this.setState({ selectedHealthProblems: option });
    }
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
      this.setState({ selectedGender: selectedValue , genderName: gender.label,});
    }
  };

  handleDateChange = (fieldName, newDate) => {
    const formattedDate = new Date(newDate).toISOString().split("T")[0];

    if (fieldName == "birthdate") {
      this.setState({
        selectedBirthDate: formattedDate,
      });
      this.formattedBirthDate = formattedDate;
    }

    if (fieldName == "EmissionDate") {
      this.setState({
        selectedEmissionDate: formattedDate,
      });
    }

    if (fieldName == "passportGrantDate") {
      this.setState({
        selectedPassportGrantDate: formattedDate,
      });
    }

    if (fieldName == "passportExpirationDate") {
      this.setState({
        selectedPassportExpirationDate: formattedDate,
      });
    }

    if (fieldName == "diplomaDate") {
      this.setState({
        selectedDiplomaDate: formattedDate,
      });
    }

    if (fieldName == "diplomaVerificationDate") {
      this.setState({
        selectedDiplomaVerificationDate: formattedDate,
      });
    }

    if (fieldName == "registrationDiplomaDate") {
      this.setState({
        selectedRegistrationDiplomaDate: formattedDate,
      });
    }
  };


  handleRegReqDocDataChange = (rowId, fieldName, fieldValue) => {
    this.setState(prevState => {
      const updatedRegReqDocs = prevState.uniStdDocsArray.map(document => {
        if (document.regReqDocId === rowId) {
          return {
            ...document,
            [fieldName]: fieldValue,
          };
        }
        return document;
      });

      return {
        uniStdDocsArray: updatedRegReqDocs,
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
    const {
      IsTransferStudentCheck,
      HasBrotherCheck,
      selectedBrothers,
      selectedBrother,
    } = this.state;

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

    if (fieldName === "studentSID" && HasBrotherCheck) {
      this.setState({ selectedBrother: selectedValue });
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

    if (fieldName === "studentSID") {
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
      selectedBrothers,
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

    if (fieldName === "studentSID") {
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
      const name = nationalities.find(
        nationality => nationality.value === selectedValue
      );
      this.setState({
        selectedNationalityId: selectedValue,
        nationalityName: name.label,
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

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleRegistrationForm = () => {
    this.setState({
      showRegistrationForm: true,
      showAcademicForm: false,
    });
  };

  handleAcademicForm = () => {
    this.setState({
      showAcademicForm: true,
      showRegistrationForm: false,
    });
  };

  handleReportsDropdown = () => {
    const { showAcademicForm, showRegistrationForm } = this.state;

    this.setState({
      showAcademicForm: showAcademicForm ? true : false,
      showRegistrationForm: showRegistrationForm ? true : false,
    });
    this.setState(prevState => ({
      showReportsLi: !prevState.showReportsLi,
    }));
  };

  handleUniStudentsDropdown = () => {
    const { showAcademicForm, showRegistrationForm, showReportsLi } =
      this.state;
    this.setState({
      showAcademicForm: showAcademicForm ? true : false,
      showRegistrationForm: showRegistrationForm ? true : false,
      showReportsLi: showReportsLi ? true : false,
    });
    this.setState(prevState => ({
      showStudentLifeLi: !prevState.showStudentLifeLi,
    }));
  };

  handleCollapseButtonClick = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapse-sidebar");
  };

  handleIsTransferStudentChange = event => {
    const { name, checked } = event.target;
    const value = checked ? 1 : 0;
    this.setState({
      IsTransferStudentCheck: value,
    });
  };

  handleHasBrotherChange = event => {
    const { name, checked } = event.target;
    const value = checked ? 1 : 0;
    this.setState({
      HasBrotherCheck: value,
      showSiblingsSelect: checked,
    });
  };

  handleAddRowSiblings = () => {
    const { onAddBrother, studentBrothers, tempUniversityStudent } = this.props;

    const emptyRowsExist = studentBrothers.some(
      student => student.brotherSID === null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorSibling: errorMessage });
    } else {
      const newRow = {
        studentId: tempUniversityStudent.SID,
      };

      this.setState({ duplicateErrorSibling: null });
      onAddBrother(newRow);
    }
  };

  onClickDeleteBrother = rowId => {
    this.setState({ selectedRowId: rowId, deleteBroModal: true });
  };

  handleDeleteBrother = () => {
    const { onDeleteBrother } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteBrother(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteBroModal: false,
        showAlert: true,
      });
    }
  };

  handleSelectBrother = (rowId, fieldName, selectedValue, oldValue) => {
    const { studentsOpt, onUpdateBrother, studentBrothers } = this.props;

    const selectBro = studentsOpt.find(
      studentOpt => studentOpt.value + " " + studentOpt.key == oldValue
    );
    this.setState({ oldBrother: selectBro });

    const brotherObj = studentsOpt.find(
      studentOpt => studentOpt.value + " " + studentOpt.key === selectedValue
    );

    if (brotherObj) {
      this.setState({ oldBrother: {} });
      const isDuplicate = studentBrothers.some(
        studentBrother =>
          studentBrother.Id !== rowId &&
          studentBrother.brotherSID === brotherObj.key
      );
      if (isDuplicate) {
        const errorMessage = this.props.t("Sibling already exists");
        this.setState({ duplicateErrorSibling: errorMessage });
        console.error("value exist");
        let onUpdate = { Id: rowId, [fieldName]: null };
      } else {
        this.setState({ duplicateErrorSibling: null });
        let onUpdate = { Id: rowId, [fieldName]: brotherObj.key };
        onUpdateBrother(onUpdate);
      }
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateErrorSibling: null });
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

  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedRelatives = prevState.uniRelativesArray.map(relative => {
        if (relative.Id === rowId) {
          return {
            ...relative,
            [fieldName]: selectedValue,
          };
        }
        return relative;
      });

      return {
        uniRelativesArray: updatedRelatives,
      };
    });
  };

  deleteRelative = relative => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedRelatives = prevState.uniRelativesArray.filter(
        item => item.Id !== relative.Id
      );
      return {
        uniRelativesArray: updatedRelatives,
      };
    });
  };

  handleAddRowRelative = () => {
    const { uniRelativesArray, lastUsedId, isEdit, student } = this.state;
    const { tempRelatives } = this.props;
    const emptyRowsExist = uniRelativesArray.some(
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
        uniRelativesArray: [...uniRelativesArray, newRelative],
        lastUsedId: lastUsedId + 1,
      });
      this.setState({ duplicateErrorRelative: null });
    }
  };

  handleAlertCloseRelative = () => {
    this.setState({ duplicateErrorRelative: null });
  };


  handleParentsDataChange = (id, fieldName, newValue) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedRelatives = prevState.uniRelativesArray.map(relative => {
        if (relative.Id === id) {
          return {
            ...relative,
            [fieldName]: newValue,
          };
        }
        return relative;
      });

      return {
        uniRelativesArray: updatedRelatives,
      };
    });
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "uniSiblings") {
      this.setState({ uniSiblingsArray: selectedMulti });
    }
  };

  render() {
    //meta title
    document.title =
      "Student List | keyInHands - React Admin & Dashboard Template";

    const {
      duplicateErrorRelative,
      student,
      selectedRegistrationDate,
      selectedregistrationCertLevelId,
      selectedStudyPattern,
      selectedExaminationSession,
      selectedBirthDate,
      selectedEmissionDate,
      selectedRegistrationDiplomaDate,
      selectedPassportGrantDate,
      selectedPassportExpirationDate,
      selectedDiploma,
      selectedDiplomaDate,
      selectedDiplomaVerificationDate,
      selectedNationalityId,
      nationalityName,
      genderName,
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
      IsTransferStudentCheck,
      HasBrotherCheck,
      emptyStudent,
      firstNameError,
      lastNameError,
      fatherNameError,
      grandFatherNameError,
      motherNameError,
      birthLocError,
      birthdateError,
      nationalityError,
      facultyError,
      errorMessage,
      successMessage,
      averageValue,
      showRegistrationForm,
      showAcademicForm,
      showReportsLi,
      showStudentLifeLi,
      selectedBrother,
      showSiblingsSelect,
      deleteBroModal,
      duplicateError,
      studentGrade,
      totalGradeValue,
      IsSpecial,
      grantCond,
      grantName,
      bloodTypeName,
      selectedHealthProblems,
      selectedHasDisability,
      duplicateErrorSibling,
      uniStdDocsArray,
      uniSiblingsArray,
      uniRelativesArray,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const showNewInput =
      selectedregistrationCertLevelId === 1 ||
      selectedregistrationCertLevelId === 2;

    const showUniForm = selectedregistrationCertLevelId === 79;

    const { SearchBar } = Search;

    const {
      stdRelatives,
      t,
      universityStudents,
      tempUniversityStudent,
      tempUniversityStudent_regReqDocs,
      nationalities,
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
      studentsOpt,
      studentBrothers,
      grants,
      relatives,
    } = this.props;

    console.log("universityStudents",universityStudents)
    console.log("tempUniversityStudent",tempUniversityStudent)
    console.log("uniStdDocsArray",uniStdDocsArray)

    const filteredOptions = studentsOpt.filter(
      studentOpt => studentOpt.key !== tempUniversityStudent.SID
    );
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const uniStudentListColumns = [
      {
        text: "SID",
        key: "SID",
        dataField: "SID",
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>{universityStudent.SID}</>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "img",
        key: "img",
        text: "#",
        hidden: true,
        formatter: (cellContent, student) => (
          <>
            {!student.img ? (
              <div className="avatar-xs">
                <span>{student.FirstName}</span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={images[student.img]}
                  alt=""
                />
              </div>
            )}
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "studentname",
        key: "fName",
        text: this.props.t("Full Name"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.studentname}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "Faculty",
        key: "faculty",
        text: this.props.t("Faculty"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.Faculty}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, universityStudent) => (
          <div className="d-flex gap-3">
    
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditUniStudent(universityStudent)}
                ></i>
              </Link>
      
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(universityStudent)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];

    const formattedRegistrationDate =
      tempUniversityStudent && tempUniversityStudent.RegistrationDate
        ? new window.Date(tempUniversityStudent.RegistrationDate)
            .toISOString()
            .split("T")[0]
        : selectedRegistrationDate;

    const formattedBirthDate =
      tempUniversityStudent && tempUniversityStudent.birthdate
        ? new window.Date(tempUniversityStudent.birthdate)
            .toISOString()
            .split("T")[0]
        : selectedBirthDate;

    const formattedEmissionDate =
      tempUniversityStudent && tempUniversityStudent.EmissionDate
        ? new window.Date(tempUniversityStudent.EmissionDate)
            .toISOString()
            .split("T")[0]
        : selectedEmissionDate;

    const formattedPassportGrantDate =
      tempUniversityStudent && tempUniversityStudent.passportGrantDate
        ? new window.Date(tempUniversityStudent.passportGrantDate)
            .toISOString()
            .split("T")[0]
        : selectedPassportGrantDate;

    const formattedPassportExpirationDate =
      tempUniversityStudent && tempUniversityStudent.passportExpirationDate
        ? new window.Date(tempUniversityStudent.passportExpirationDate)
            .toISOString()
            .split("T")[0]
        : selectedPassportExpirationDate;

    const formattedDiplomaDate =
      tempUniversityStudent && tempUniversityStudent.diplomaDate
        ? new window.Date(tempUniversityStudent.diplomaDate)
            .toISOString()
            .split("T")[0]
        : selectedDiplomaDate;

    const formattedDiplomaVerificationDate =
      tempUniversityStudent && tempUniversityStudent.diplomaVerificationDate
        ? new window.Date(tempUniversityStudent.diplomaVerificationDate)
            .toISOString()
            .split("T")[0]
        : selectedDiplomaVerificationDate;

    const { isEdit, deleteModal } = this.state;

    const universityStudent = this.state.universityStudent;

    const pageOptions = {
      sizePerPage: 10,
      TotalGradeSize: universityStudents.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const selectRow = {
      mode: "checkbox",
    };

    const siblingsColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "brotherSID",
        text: t("Sibling"),
        sort: true,
        formatter: (cell, row) => (
          <div className="col-9">
            <Input
              type="text"
              id="brotherSID"
              list="brothersOptionlist"
              className="form-control"
              defaultValue={
                (
                  filteredOptions.find(
                    filteredOption => filteredOption.key === row.brotherSID
                  ) || ""
                ).value
              }
              onChange={event => {
                this.handleSelectBrother(
                  row.Id,
                  "brotherSID",
                  event.target.value,
                  row.brotherSID
                );
              }}
              autoComplete="off"
            />

            <datalist id="brothersOptionlist">
              {filteredOptions.map(uniStudent => (
                <option
                  key={uniStudent.key}
                  value={uniStudent.value + " " + uniStudent.key}
                />
              ))}
            </datalist>
          </div>
        ),

        editable: false,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, brother) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDeleteBrother(brother)}
            ></i>
          </Link>
        ),
      },
    ];

    const Date = props => (
      <InputMask
        mask="99/99/9999"
        value={props.value}
        className="form-control input-mask"
        onChange={props.onChange}
      ></InputMask>
    );

    const Year = props => (
      <InputMask
        mask="9999"
        value={props.value}
        className="form-control input-mask"
        onChange={props.onChange}
      ></InputMask>
    );

    const preReqColumns = [
      {
        dataField: "Id",
        id: 10,
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",
        id: 0,
        text: this.props.t("Document Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",
        id: 1,
        text: this.props.t("Required Number"),
        editable: false,
      },
      {
        dataField: "availableNumber",
        id: 6,
        text: this.props.t("Available Number"),
      },
      {
        dataField: "preventAdmission",
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 7,
        text: this.props.t("Attestated"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className={`btn ${
                row.attestated === 1 ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() =>
                this.handleRegReqDocDataChange(row.regReqDocId, "attestated", 1)
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
                this.handleRegReqDocDataChange(row.regReqDocId, "attestated", 0)
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

    const rows = tempUniversityStudent_regReqDocs.map(
      tempUniversityStudent_regReqDoc => ({
        Id: tempUniversityStudent_regReqDoc.Id,
        StudentId: tempUniversityStudent_regReqDoc.SID,
        docName: tempUniversityStudent_regReqDoc.docName,
        requiredNumber: tempUniversityStudent_regReqDoc.requiredNumber,
        preventAdmission: tempUniversityStudent_regReqDoc.preventAdmission,
        preventRegistration:
          tempUniversityStudent_regReqDoc.preventRegistration,
        preventGraduation: tempUniversityStudent_regReqDoc.preventGraduation,
        requireAttestation: tempUniversityStudent_regReqDoc.requireAttestation,
        availableNumber: tempUniversityStudent_regReqDoc.availableNumber,
        attestated: tempUniversityStudent_regReqDoc.attestated,
      })
    );

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
          onDeleteClick={this.handleUpdateUniStudent}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <DeleteModal
          show={deleteBroModal}
          onDeleteClick={this.handleDeleteBrother}
          onCloseClick={() =>
            this.setState({ deleteBroModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              title={this.props.t("Students")}
              breadcrumbItem={this.props.t("University Students List")}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      key="unique-pagination-key"
                      keyField="Pagination-Provider"
                      columns={uniStudentListColumns}
                      data={universityStudents}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          key="unique-toolkit-key"
                          keyField="Toolkit-Provider"
                          columns={uniStudentListColumns}
                          data={universityStudents}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4"></Col>
                              </Row>
                              <Row>
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
                                        onClick={this.handleSuccessClose}
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
                                      </Row>
                                      <ModalBody>
                                        <div className="modal">
                                          <div className="sidebar">
                                            <h2 className="student-info">
                                              {tempUniversityStudent.FirstName +
                                                "  " +
                                                tempUniversityStudent.FatherName +
                                                "  " +
                                                tempUniversityStudent.LastName +
                                                "  "}

                                              <span className="student-id">
                                                {tempUniversityStudent.SID}
                                              </span>
                                            </h2>
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleAcademicForm
                                                  }
                                                  style={{
                                                    color: showAcademicForm
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Academic File"
                                                  )}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleRegistrationForm
                                                  }
                                                  style={{
                                                    color: showRegistrationForm
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
                                                    this
                                                      .handleUniStudentsDropdown
                                                  }
                                                >
                                                  {this.props.t(
                                                    "Student University Life"
                                                  )}
                                                  {showStudentLifeLi && (
                                                    <span>
                                                      <i className="mdi mdi-chevron-down float-end" />
                                                    </span>
                                                  )}
                                                  {!showStudentLifeLi && (
                                                    <span>
                                                      <i className="bx bx-chevron-right float-end" />
                                                    </span>
                                                  )}
                                                </a>
                                                {showStudentLifeLi && (
                                                  <ul className="included-items">
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Student status"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Remaining Courses"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Student Performance"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Student Requests"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Student Exceptions"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Disciplinary Decisions"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Decisions of the Registered Office"
                                                        )}
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a>
                                                        {this.props.t(
                                                          "Documents Requests"
                                                        )}
                                                      </a>
                                                    </li>

                                                    <li>
                                                      <a
                                                        href="#"
                                                        onClick={
                                                          this
                                                            .handleReportsDropdown
                                                        }
                                                      >
                                                        {this.props.t(
                                                          "Student Reports"
                                                        )}
                                                        {showReportsLi && (
                                                          <span>
                                                            <i className="mdi mdi-chevron-down float-end" />
                                                          </span>
                                                        )}
                                                        {!showReportsLi && (
                                                          <span>
                                                            <i className="bx bx-chevron-right float-end" />
                                                          </span>
                                                        )}
                                                      </a>
                                                      {showReportsLi && (
                                                        <ul className="included-items">
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grades detection (all majors)"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Current Semester Grades"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grade detection (according to current semester)"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grade detection (according to certificates)"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grade detection (according to requirements)"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grade detection (according to courses)"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grade detection (according to courses newspaper)"
                                                              )}
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a>
                                                              {this.props.t(
                                                                "Grade detection (without blocking)"
                                                              )}
                                                            </a>
                                                          </li>
                                                        </ul>
                                                      )}
                                                    </li>
                                                  </ul>
                                                )}
                                              </li>
                                            </ul>
                                          </div>
                                          <div className="collapse-button">
                                            <i
                                              onClick={
                                                this.handleCollapseButtonClick
                                              }
                                              className="bx bx-menu"
                                            ></i>
                                          </div>

                                          <div className="modal-content">
                                            {showAcademicForm && (
                                              <div>
                                                <Card className="bordered">
                                                  <CardHeader className="card-header">
                                                    <h4>
                                                      <i className="fas fa-user-circle" />{" "}
                                                      {tempUniversityStudent.FirstName +
                                                        "  " +
                                                        tempUniversityStudent.FatherName +
                                                        "  " +
                                                        tempUniversityStudent.LastName +
                                                        "   " +
                                                        "[" +
                                                        tempUniversityStudent.SID +
                                                        "]"}
                                                    </h4>
                                                  </CardHeader>
                                                  <CardBody>
                                                    <Row>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Faculty"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              (
                                                                admissionConditions.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    tempUniversityStudent.FacultyId
                                                                ) || ""
                                                              ).label
                                                            }
                                                          </Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Study Pattern"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {tempUniversityStudent.studyPattern ==
                                                              "creditHours" &&
                                                              this.props.t(
                                                                "Credit Hours"
                                                              )}
                                                            {tempUniversityStudent.studyPattern ==
                                                              "semester" &&
                                                              this.props.t(
                                                                "Semester"
                                                              )}
                                                          </Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Last Semester"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {tempUniversityStudent.registerYearSemesterId
                                                              ? yearSemesters.find(
                                                                  yearSemester =>
                                                                    yearSemester.key ===
                                                                      tempUniversityStudent.registerYearSemesterId ||
                                                                    ""
                                                                ).value
                                                              : ""}
                                                          </Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Level"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Finished Hours"
                                                            )}
                                                          </Label>

                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "GPA"
                                                            )}{" "}
                                                            :
                                                          </Label>

                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Academic Warning"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>
                                                      </Col>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Academic Director"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Student Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Last Semester Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Current Semester Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Transfer Hours"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>

                                                <Card className="bordered">
                                                  <CardHeader className="card-header">
                                                    <h4>
                                                      {" "}
                                                      {this.props.t(
                                                        "Financial Informations"
                                                      )}
                                                    </h4>
                                                  </CardHeader>
                                                  <CardBody>
                                                    <Row>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Semester Fees"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Total Payments"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Total Semester Payments"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Amount to be paid"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Remaining Balance"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Currency"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Financial Hourly Rate"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-2">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Study Fees"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Service and Order Fees"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                            )}

                                            {showRegistrationForm && (
                                              <Formik
                                                enableReinitialize={true}
                                                initialValues={
                                                  (isEdit && {
                                                    SID: tempUniversityStudent.SID,
                                                    FirstName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.FirstName) ||
                                                      "",
                                                    LastName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.LastName) ||
                                                      "",
                                                    bloodType:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.bloodType) ||
                                                      "",
                                                    FatherName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.FatherName) ||
                                                      "",
                                                    grandFatherName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.grandFatherName) ||
                                                      "",
                                                    MotherName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.MotherName) ||
                                                      "",
                                                    BirthLocation:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.BirthLocation) ||
                                                      "",
                                                    FirstNameE:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.FirstNameE) ||
                                                      "",
                                                    LastNameE:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.LastNameE) ||
                                                      "",
                                                    FatherNameE:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.FatherNameE) ||
                                                      "",
                                                    MotherNameE:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.MotherNameE) ||
                                                      "",
                                                    BirthLocationE:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.BirthLocationE) ||
                                                      "",

                                                    birthdate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.birthdate) ||
                                                      formattedBirthDate,
                                                    NationalityId:
                                                      tempUniversityStudent &&
                                                      tempUniversityStudent.NationalityId,
                                                    GenderId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.GenderId) ||
                                                      selectedGender,
                                                    Mobilization:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.Mobilization) ||
                                                      "",
                                                    MobilizationNum:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.MobilizationNum) ||
                                                      "",
                                                    IdNumber:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.IdNumber) ||
                                                      "",
                                                    perosonalCardNum:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.perosonalCardNum) ||
                                                      "",
                                                    EmissionDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.EmissionDate) ||
                                                      formattedEmissionDate,
                                                    perCardCaza:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.perCardCaza) ||
                                                      "",
                                                    perCardPlaceRegistration:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.perCardPlaceRegistration) ||
                                                      "",
                                                    perCardRegNum:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.perCardRegNum) ||
                                                      "",
                                                    PassNumber:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.PassNumber) ||
                                                      "",
                                                    passportGrantDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.passportGrantDate) ||
                                                      formattedPassportGrantDate,
                                                    passportExpirationDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.passportExpirationDate) ||
                                                      formattedPassportExpirationDate,
                                                    diplomaId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.diplomaId) ||
                                                      selectedDiploma,
                                                    DiplomaCountryId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.DiplomaCountryId) ||
                                                      selectedCountry,
                                                    DiplomaNumber:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.DiplomaNumber) ||
                                                      "",
                                                    DiplomaGovernorateId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.DiplomaGovernorateId) ||
                                                      selectedGovernorate,
                                                    DiplomaCityId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.DiplomaCityId) ||
                                                      selectedCity,
                                                    DiplomaYear:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.DiplomaYear) ||
                                                      "",
                                                    ExaminationSession:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.ExaminationSession) ||
                                                      selectedExaminationSession,
                                                    TotalGrade:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.TotalGrade) ||
                                                      "",
                                                    Average:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.Average) ||
                                                      averageValue,
                                                    diplomaDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.diplomaDate) ||
                                                      formattedDiplomaDate,
                                                    diplomaVerificationNum:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.diplomaVerificationNum) ||
                                                      "",
                                                    diplomaVerificationDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.diplomaVerificationDate) ||
                                                      formattedDiplomaVerificationDate,
                                                    registrationCertLevelId:
                                                      tempUniversityStudent &&
                                                      tempUniversityStudent.registrationCertLevelId,
                                                    registrationDiplomaName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.registrationDiplomaName) ||
                                                      "",
                                                    registrationDiplomaDepartment:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.registrationDiplomaDepartment) ||
                                                      "",
                                                    registrationDiplomaName:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.registrationDiplomaName) ||
                                                      "",
                                                    registrationDiplomaAverage:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.registrationDiplomaAverage) ||
                                                      "",
                                                    registrationDiplomaDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.registrationDiplomaDate) ||
                                                      "",

                                                    haveBrother:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.haveBrother) ||
                                                      HasBrotherCheck,
                                                    TransferUniv:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.TransferUniv) ||
                                                      "",
                                                    TransferUnivCountryId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.TransferUnivCountryId) ||
                                                      selectedTransferUnivCountry,
                                                    TransferUnivAverage:
                                                      (student &&
                                                        student.TransferUnivAverage) ||
                                                      "",
                                                    hasDisability:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.hasDisability) ||
                                                      "",
                                                    healthProblems:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.healthProblems) ||
                                                      "",
                                                    OtherHealthDetails:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.OtherHealthDetails) ||
                                                      "",
                                                    grantId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.grantId) ||
                                                      "",
                                                    studyPattern:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.studyPattern) ||
                                                      "",
                                                    registerYearSemesterId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.registerYearSemesterId) ||
                                                      selectedSemester,
                                                    RegistrationDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.RegistrationDate) ||
                                                      formattedRegistrationDate,
                                                    FacultyId:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.FacultyId) ||
                                                      selectedFacultyId,
                                                    plan_study:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.plan_study) ||
                                                      selectedStudyPlanId,
                                                    acceptanceDate:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.acceptanceDate) ||
                                                      "",
                                                    CurrentAddress:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.CurrentAddress) ||
                                                      "",
                                                    currentAddrStreet:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.currentAddrStreet) ||
                                                      "",
                                                    currentAddrBuildingNum:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.currentAddrBuildingNum) ||
                                                      "",
                                                    CurrentAddrPhone:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.CurrentAddrPhone) ||
                                                      "",
                                                    CurrentAddrCell:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.CurrentAddrCell) ||
                                                      "",
                                                    PermanentAddress:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.PermanentAddress) ||
                                                      "",
                                                    permanentAddrStreet:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.permanentAddrStreet) ||
                                                      "",
                                                    permanentAddrBuildingNum:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.permanentAddrBuildingNum) ||
                                                      "",
                                                    PermanentAddrPhone:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.PermanentAddrPhone) ||
                                                      "",
                                                    PermanentAddrCell:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.PermanentAddrCell) ||
                                                      "",
                                                    Email:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.Email) ||
                                                      "",
                                                    GeneralNote:
                                                      (tempUniversityStudent &&
                                                        tempUniversityStudent.GeneralNote) ||
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
                                                      "",
                                                    NationalityId:
                                                      (emptyStudent &&
                                                        emptyStudent.NationalityId) ||
                                                      "",
                                                    FacultyId:
                                                      (emptyStudent &&
                                                        emptyStudent.FacultyId) ||
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
                                                    MotherNameE:
                                                      Yup.string().matches(
                                                        /^[a-zA-Z]+$/
                                                      ),
                                                    BirthLocationE:
                                                      Yup.string().matches(
                                                        /^[a-zA-Z]+$/
                                                      ),
                                                    birthdate:
                                                      Yup.date().required(
                                                        "Please Enter Your Date of Birth"
                                                      ),
                                                    Email: Yup.string().email(
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
                                                  handleBlur,
                                                  handleChange,
                                                  setFieldValue,
                                                }) => (
                                                  <div className="student-form">
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
                                                                      this.state
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
                                                                      this.state
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
                                                                          "Registration Info"
                                                                        )}
                                                                      </h3>
                                                                    </NavLink>
                                                                  </NavItem>
                                                                  <NavItem
                                                                    key={4}
                                                                    className={`nav-item ${
                                                                      this.state
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
                                                                          "Contact Info"
                                                                        )}
                                                                      </h3>
                                                                    </NavLink>
                                                                  </NavItem>
                                                                  <NavItem
                                                                    key={5}
                                                                    className={`nav-item ${
                                                                      this.state
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
                                                                    this.state
                                                                      .activeTab
                                                                  }
                                                                  className="body"
                                                                >
                                                                  <TabPane
                                                                    key={1}
                                                                    tabId={1}
                                                                  >
                                                                    <Row>
                                                                      <Card id="student-card">
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
                                                                                        <input
                                                                                          name="birthdate"
                                                                                          className={`form-control ${
                                                                                            birthdateError
                                                                                              ? "is-invalid"
                                                                                              : ""
                                                                                          }`}
                                                                                          type="date"
                                                                                          defaultValue={
                                                                                            formattedBirthDate
                                                                                          }
                                                                                          onChange={event =>
                                                                                            this.handleDateChange(
                                                                                              "birthdate",
                                                                                              event
                                                                                                .target
                                                                                                .value
                                                                                            )
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
                                                                                        key={`faculty_select`}
                                                                                        options={
                                                                                          bloodTypes
                                                                                        }
                                                                                        onChange={faculty => {
                                                                                          setFieldValue(
                                                                                            "bloodType",
                                                                                            faculty.value
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
                                                                                  className={
                                                                                    "form-control"
                                                                                  }
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
                                                                                  /* onChange={event =>
                                                                                  this.handleDateChange(
                                                                                    "DiplomaYear",
                                                                                    event.target.value
                                                                                  )
                                                                                } */
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
                                                                                    className={`form-control`}
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
                                                                                      className={`form-control }`}
                                                                                      list="univCountryDatalistOptions"
                                                                                      value={
                                                                                        values.TransferUnivCountryId
                                                                                      }
                                                                                      onChange={event => {
                                                                                        setFieldValue(
                                                                                          "TransferUnivCountryId",
                                                                                          event
                                                                                            .target
                                                                                            .value
                                                                                        );
                                                                                      }}
                                                                                      onBlur={
                                                                                        handleBlur
                                                                                      }
                                                                                      id="TransferUnivCountryId-Id"
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
                                                                                    (
                                                                                      yearSemesters.find(
                                                                                        yearSemester =>
                                                                                          yearSemester.key ===
                                                                                          selectedSemester
                                                                                      ) ||
                                                                                      currentSemester.cuYearSemesterId
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
                                                                                      opt.value ===
                                                                                      selectedFacultyId
                                                                                  )}
                                                                                  isDisabled={
                                                                                    true
                                                                                  }
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
                                                                                  key={`planStudy_select`}
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
                                                                                  for="haveBrother"
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
                                                                                    name="haveBrother"
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
                                                                                      uniSiblingsArray
                                                                                    }
                                                                                    name="uniSiblings"
                                                                                    isMulti={
                                                                                      true
                                                                                    }
                                                                                    onChange={selectedOption =>
                                                                                      this.handleMulti(
                                                                                        "uniSiblings",
                                                                                        selectedOption
                                                                                      )
                                                                                    }
                                                                                    options={
                                                                                      studentsOpt
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
                                                                          </div>
                                                                          <div className="mb-3">
                                                                            <Row>
                                                                              <Col className="col-4">
                                                                                <Label for="permenant-phobe">
                                                                                  {this.props.t(
                                                                                    "Permanent Phone"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="PermanentAddrPhone"
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
                                                                                    "Permanent Mobile"
                                                                                  )}
                                                                                </Label>
                                                                              </Col>
                                                                              <Col className="col-8">
                                                                                <Field
                                                                                  type="text"
                                                                                  name="PermanentAddrCell"
                                                                                  id="permenant-cell"
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
                                                                                        value={
                                                                                          tempUniversityStudent.Email
                                                                                        }
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
                                                                    <Row>
                                                                      <Accordion defaultActiveKey="1">
                                                                        <Accordion.Item eventKey="2">
                                                                          <Accordion.Header>
                                                                            {this.props.t(
                                                                              "Relatives' Information"
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
                                                                              data={
                                                                                uniRelativesArray
                                                                              }
                                                                              columns={
                                                                                ParentsColumns
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
                                                                                keyField="Bootstrap-Table"
                                                                                data={
                                                                                  uniStdDocsArray
                                                                                }
                                                                                columns={
                                                                                  preReqColumns
                                                                                }
                                                                                key={
                                                                                  document.regReqDocId
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
                                                                                          row.regReqDocId,
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

                                                                  {!isEdit &&
                                                                    this.state
                                                                      .activeTab ===
                                                                      4 && (
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
                                                                        {this.props.t(
                                                                          "Save"
                                                                        )}
                                                                      </Link>
                                                                    </li>
                                                                  )}
                                                                  <li
                                                                    className={
                                                                      this.state
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
                                                                      this.state
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
  universityStudents,
  nationalities,
  mobAppFacultyAccs,
  countries,
  generalManagements,
  cities,
  certificates,
  governorates,
  regReqDocuments,
  genders,
  semesters,
  certificatelevels,
  admissionConditions,
  academiccertificates,
  grants,
  students,
  menu_items,
  relatives
}) => ({
  universityStudents: universityStudents.universityStudents,
  studentsOpt: universityStudents.studentsOpt,
  studentBrothers: universityStudents.studentBrothers,
  tempUniversityStudent: universityStudents.tempUniversityStudent,
  last_created_student: universityStudents.last_created_student,
  tempUniversityStudent_regReqDocs:
    universityStudents.tempUniversityStudent_regReqDocs,
  nationalities: nationalities.nationalities,
  faculties: mobAppFacultyAccs.faculties,
  countries: countries.countries,
  yearSemesters: generalManagements.yearSemesters,
  currentSemester: semesters.currentSemester,
  cities: cities.cities,
  certificates: certificates.certificates,
  governorates: governorates.governorates,
  regReqDocuments: regReqDocuments.regReqDocuments,
  genders: genders.genders,
  certificatelevels: certificatelevels.certificatelevels,
  admissionConditions: admissionConditions.admissionConditions,
  filteredFaculties: admissionConditions.filteredFaculties,
  academiccertificates: academiccertificates.academiccertificates,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  grants: grants.grants,
  stdRelatives: universityStudents.stdRelatives,
  relatives: relatives.relatives,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetUniversityStudents: () => dispatch(getUniversityStudents()),
  onAddNewUniversityStudent: universityStudent =>
    dispatch(addNewUniversityStudent(universityStudent)),
  onUpdateUniversityStudent: universityStudent =>
    dispatch(updateUniversityStudent(universityStudent)),
  onDeleteUniversityStudent: universityStudent =>
    dispatch(deleteUniversityStudent(universityStudent)),
  onGetUniStudentById: tempUniversityStudent =>
    dispatch(getUniversityStudentById(tempUniversityStudent)),
  onGetUniversityStudentRegReqDocs: tempUniversityStudents =>
    dispatch(getUniversityStudentRegReqDocs(tempUniversityStudents)),
  onUpdateUniversityStudentRegReqDoc: tempUniversityStudent =>
    dispatch(updateUniversityStudentRegReqDoc(tempUniversityStudent)),
  onGetFilteredFaculties: admissionCond =>
    dispatch(getFilteredFaculties(admissionCond)),
  onGetFilteredAcademicCertificates: academicCer =>
    dispatch(getFilteredAcademicCertificates(academicCer)),
  onGetBrothers: brothers => dispatch(getBrothers(brothers)),
  onAddBrother: brother => dispatch(addBrother(brother)),
  onDeleteBrother: brother => dispatch(deleteBrother(brother)),
  onUpdateBrother: brother => dispatch(updateBrother(brother)),
  onGetRelatives: relative => dispatch(getStdRelatives(relative)),
  onAddNewRelative: relative => dispatch(addNewStdRelative(relative)),
  onUpdateRelative: relative => dispatch(updateStdRelative(relative)),
  onDeleteRelative: relative => dispatch(deleteStdRelative(relative)),
  onGetRelativeDeletedValue: () => dispatch(getStdRelativeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(UniversityStudentsList)));
