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
} from "reactstrap";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import Select from "react-select";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import { getFilteredAcademicCertificates } from "store/academicvertificates/actions";

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
  getRegisterCertificates,
  getTempTraineeDefaultRegReqDocs,
  updateProfessionalExperience,
  addNewProfessionalExperience,
  deleteProfessionalExperience,
  addRequiredDocs,
  uploadFile,
} from "store/new-Trainee/actions";
import { isEmpty, size, map, values } from "lodash";

import Accordion from "react-bootstrap/Accordion";

import InputMask from "react-input-mask";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { ConsoleLineIcon } from "@icons/material";
import { da } from "date-fns/locale";

class NewTrainee extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      tempTrainees: {},
      trnProfExperiences: {},
      trnProfExperience: "",
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      isOpen: false,
      modal: false,
      deleteModal: false,
      averageValue: "",
      selectedDiploma: "",
      selecetdDiplomaId: "",
      selectedFacultyId: 0,
      selectedStudyPlanId: 0,
      facultyName: "",
      studyPlanName: "",
      selectedregistrationCertLevelId: "",
      selectedStudyPattern: "",
      selectedExaminationSession: "",
      transferUniName: "",
      selectedUnivCountry: "",
      selectedRegistrationDate: new Date().toISOString().split("T")[0],
      selectedNationalityId: 0,
      nationalityName: "",
      selectedCountry: "",
      selectedSemester: "",
      selectedGovernorate: "",
      selectedSocialStatus: "",
      selectedCity: "",
      selectedGender: "",
      genderName: "",
      selectedBirthDate: "",
      selectedRegistrationDiplomaDate: "",
      selectedIdentityIssueDate: "",
      selectedPassportIssueDate: "",
      selectedPassportExpiryDate: "",
      selectedDiplomaDate: "",
      selectedDiplomaVerificationDate: "",
      values: "",
      plan_studyError: false,
      lastNameError: false,
      firstNameError: false,
      fatherNameError: false,
      motherNameError: false,
      birthLocError: false,
      birthdateError: false,
      nationalityError: false,
      genderError: false,
      facultyError: false,
      errorMessage: null,
      errorMessage1: null,
      successMessage: null,
      successMessage1: null,
      averageValue: "",
      grandFatherNameError: false,
      diplomaIdError: false,
      HasBrotherCheck: false,
      duplicateError: null,
      averageError: false,
      diplomaNumberError: false,
      selectedParentNationality: null,
      relativesArray: [],
      lastUsedId: 0,
      duplicateRelativeError: null,
      grantCond: 0,
      totalGradeValue: "",
      studentGrade: "",
      stdTotalGradeError: false,
      showGenerateButton: false,
      attestatedValue: 0,
      stdDocsArray: [],
      showSiblingsSelect: false,
      siblingsArray: [],
      duplicateErrorSibling: null,
      gradeError: false,
      selectedInstituteCountry: "",
      languageState: "",
      selectedHightStudyTypeId: "",
      selectedEstimateId: "",
      selectedRegUniDate: "",
      nationalNoError: false,
      identityNoError: false,
      selectedRowId: null,
      showAlert: null,
      isTempTraineeSaved: false,
      lastUsedExperienceId: 0,
      profExperiencesArray: [],
      photo: null,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleTabVertical = this.toggleTabVertical.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");

    const {
      trnProfExperiences,
      last_created_trainee,
      tempTrainees,
      tempTraineesDocuments,
      onGetTempTrainees,
      onGetTempTraineeById,
      tempTrainee,
      generated_student,
      nationalities,
      relatives,
      faculties,
      countries,
      cities,
      currentSemester,
      diplomalevels,
      governorates,
      regReqDocuments,
      genders,
      admissionConditions,
      academiccertificates,
      filteredAcademicCertificates,
      //onGetTempRelatives,
      regcertificates,
      onGetTempTraineesRegCertificates,
      onGetTempTraineesDocuments,
      i18n,
      deleted,
    } = this.props;

    onGetTempTrainees(lang);
    onGetTempTraineesRegCertificates();
    // onGetTempTraineesDocuments();

    this.setState({ trnProfExperiences, deleted });
    this.setState({ tempTrainees });
    this.setState({ tempTraineesDocuments });
    this.setState({ nationalities });
    this.setState({ relatives });
    this.setState({ faculties });
    this.setState({ countries });
    this.setState({ currentSemester });
    this.setState({ cities });
    this.setState({ diplomalevels });
    this.setState({ governorates });
    this.setState({ regReqDocuments });
    this.setState({ genders });
    this.setState({ admissionConditions });
    this.setState({ academiccertificates });
    this.setState({ filteredAcademicCertificates });
    this.setState({ generated_student });

    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().slice(0, 10);

    this.setState({
      RegistrationDate: formattedDate,
    });

    this.setState({ languageState: lang });

    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleLanguageChange = lng => {
    const {
      onGetTempTrainees,
      onGetTempTraineesRegCertificates,
      onGetTempTraineesDocuments,
    } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetTempTrainees(lng);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.tempTrainees !== this.props.tempTrainees &&
      this.props.tempTrainees.length > 0
    ) {
      const lastItem =
        this.props.tempTrainees[this.props.tempTrainees.length - 1];
      if (lastItem.RegReqDocTempTrainee) {
        try {
          // const stdDocsArray = JSON.parse(lastItem.RegReqDocTempTrainee);
          const stdDocsArray = lastItem.RegReqDocTempTrainee;
          this.setState({ stdDocsArray });
        } catch (e) {
          console.error("Error parsing RegReqDocTempTrainee JSON", e);
        }
      }
    }
  }

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

  handleSave = values => {
    const {
      selectedBirthDate,
      selectedRegistrationDiplomaDate,
      selectedNationalityId,
      selectedregistrationCertLevelId,
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
    } = this.state;
    console.log("values in save", values);
    values["socialStatusId"] = selectedSocialStatus;
    values["statusId"] = 1;
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
        selectedregistrationCertLevelId === "")
    ) {
      // if (selectedregistrationCertLevelId === 1) {
      //   if (values.FacultyId === "" && selectedFacultyId === "") {
      //     this.setState({ facultyError: true, saveError: true });
      //   }
      //   if (values.plan_study.trim() === "") {
      //     this.setState({ plan_studyError: true, saveError: true });
      //   }
      // } else if (selectedregistrationCertLevelId === 2) {
      //   if (values.plan_study.trim() === "") {
      //     this.setState({ plan_studyError: true, saveError: true });
      //   }
      // } else if (selectedregistrationCertLevelId === 4) {
      //   if (values.FacultyId === "" && selectedFacultyId === "") {
      //     this.setState({ facultyError: true, saveError: true });
      //   }
      //   if (values.plan_study.trim() === "") {
      //     this.setState({ plan_studyError: true, saveError: true });
      //   }
      // } else if (selectedregistrationCertLevelId === 5) {
      //   if (values.FacultyId === "" && selectedFacultyId === "") {
      //     this.setState({ facultyError: true, saveError: true });
      //   }
      //   if (values.plan_study.trim() === "") {
      //     this.setState({ plan_studyError: true, saveError: true });
      //   }
      // }
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
      } = this.state;

      const { onUpdateTempTrainee, onAddNewTempTrainee, tempTrainee } =
        this.props;
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
        traineeinfo["diplomaId"] = diplomaObject.key;
      }

      if (values.DiplomaCountryId) {
        const countryObject = countries.find(
          country => country.value === values.DiplomaCountryId
        );
        traineeinfo["DiplomaCountryId"] = countryObject.key;
      }
      console.log(
        "DiplomaGovernorateIdDiplomaGovernorateId",
        values.DiplomaGovernorateId
      );
      if (values.DiplomaGovernorateId) {
        const governorateObject = governorates.find(
          governorate => governorate.value === values.DiplomaGovernorateId
        );
        traineeinfo["DiplomaGovernorateId"] = governorateObject.key;
      }

      /*  if (values.DiplomaCityId) {
        const cityObject = cities.find(
          city => city.value === values.DiplomaCityId
        );
        traineeinfo["DiplomaCityId"] = cityObject.key;
      } */

      if (values.UnivCountryId) {
        const univCountryObject = countries.find(
          country => country.value === values.UnivCountryId
        );
        traineeinfo["UnivCountryId"] = univCountryObject.key;
      }

      if (values.InstituteCountryId) {
        const InstirCountryObject = countries.find(
          country => country.value === values.InstituteCountryId
        );
        traineeinfo["InstituteCountryId"] = InstirCountryObject.key;
      }

      if (selectedGender) {
        traineeinfo["GenderId"] = parseInt(selectedGender);
      }

      if (selectedNationalityId) {
        traineeinfo["NationalityId"] = selectedNationalityId;
      } else {
        traineeinfo["NationalityId"] = tempTrainee.NationalityId;
      }

      if (selectedExaminationSession) {
        traineeinfo["ExaminationSession"] = selectedExaminationSession;
      }
      if (selectedSocialStatus) {
        traineeinfo["socialStatusId"] = selectedSocialStatus;
      }

      if (selectedStudyPattern) {
        traineeinfo["studyPattern"] = selectedStudyPattern;
      }

      if (selectedregistrationCertLevelId) {
        traineeinfo["registrationCertLevelId"] =
          selectedregistrationCertLevelId;
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

      const response = onAddNewTempTrainee(traineeinfo);
      if (response?.Id) {
        this.setState({ tempTraineeId: response.Id });
      }
      if (response?.RegReqDocTempTrainee) {
        const parsedDoc = JSON.parse(response.RegReqDocTempTrainee);
        this.setState({ stdDocsArray: parsedDoc });
      }
      const saveTempTraineeMessage = this.props.t(
        "TempTrainee saved successfully"
      );
      this.setState({
        successMessage: saveTempTraineeMessage,
        isTempTraineeSaved: true,
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

  state = {
    photoURL: "https://picsum.photos/300/200", // Default photo URL
  };

  handlePhotoChange = event => {
    const { onUploadFile } = this.props;
    const file = event.target.files[0];
    const reader = new FileReader();
    onUploadFile(file);
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
    if (tab === 5 && !this.state.isTempTraineeSaved) {
      return;
    }
    if (tab === 4 && !this.state.isTempTraineeSaved) {
      return;
    }
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
      }
    }

    if (tab == 4) {
      this.setState({
        trnProfExperiences: {},
      });
    }

    // if (tab == 5) {
    //   const { tempTraineesDocuments, onGetTempTraineesDocuments } = this.props;
    //   this.setState({
    //     stdDocsArray: tempTraineesDocuments,
    //   });
    // }
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
    if (tab == 4) {
      this.setState({
        trnProfExperiences: {},
      });
    }
  }

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "ExaminationSession") {
      this.setState({ selectedExaminationSession: option });
    }
  };

  handleButtonClick2 = (fieldName, option, values) => {
    const { onGetTempTraineesDocuments } = this.props;
    let obj = { certificateLevelId: option };
    console.log("objobjobj", obj);
    // onGetTempTraineesDocuments(obj);
    if (fieldName == "registrationCertLevelId") {
      this.setState({ selectedregistrationCertLevelId: option });
      this.setState({ trainee: values });
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

  handleGenerateTempTrainee = tempTraineeId => {
    //const { onGenerateTempTrainee } = this.props;
    //onGenerateTempTrainee(tempTraineeId);

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
    this.toggle();
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

  // handleSelectNationalityDetails = (rowId, fieldName, selectedValue) => {
  //   const { onUpdateRegReqDocument } = this.props;
  //   const { regReqDocuments } = this.state;

  //   const isValueExists = regReqDocuments.some(
  //     row => row.documentTypeId === selectedValue
  //   );

  //   this.setState({
  //     selectedParentNationality: selectedValue,
  //   });

  //   let onUpdate = { Id: rowId, [fieldName]: selectedValue };
  //   onUpdateRegReqDocument(onUpdate);
  // };

  // handleParentsDataChange = (id, fieldName, newValue) => {
  //   this.setState(prevState => {
  //     const updatedRelatives = prevState.relativesArray.map(relative => {
  //       if (relative.Id === id) {
  //         return {
  //           ...relative,
  //           [fieldName]: newValue,
  //         };
  //       }
  //       return relative;
  //     });

  //     return {
  //       relativesArray: updatedRelatives,
  //     };
  //   });
  // };

  handelAddExperience = () => {
    const { onAddNewProfessionalExperience, lastAddedId, trnProfExperiences } =
      this.props;
    const {
      profExperiencesArray,
      lastUsedExperienceId,
      isEdit,
      selectedTempTraineeId,
    } = this.state;
    const emptyRowsExist = profExperiencesArray.some(
      profExperiences => profExperiences.workType.trim() === ""
    );
    console.log("emptyRowsExist", emptyRowsExist);
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorProfExperiences: errorMessage });
    } else {
      const newExperience = {
        Id: lastUsedExperienceId,
        tempTraineeId: lastAddedId,
        workType: "",
        companyName: "",
        workPlace: "",
        workField: "",
        duaration: "",
      };
      //onAddNewProfessionalExperience(newExperience);
      this.setState({
        duplicateErrorProfExperiences: null,
        profExperiencesArray: [...profExperiencesArray, newExperience],
        lastUsedExperienceId: lastUsedExperienceId + 1,
      });
    }
  };

  // handleExperienceDataChange = (rowId, fieldName, fieldValue) => {
  //   const { onUpdateProfessionalExperience, trnProfExperiences } = this.props;
  //   const isDuplicate = trnProfExperiences.some(trnProfExperience => {
  //     return (
  //       trnProfExperience.Id !== rowId &&
  //       trnProfExperience.workType.trim() === fieldValue.trim()
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
  // };

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
  };

  // handleAddRowRelative = () => {
  //   const { relativesArray, lastUsedId } = this.state;
  //   const emptyRowsExist = relativesArray.some(
  //     relative => relative.arName.trim() === ""
  //   );
  //   if (emptyRowsExist) {
  //     const errorMessage = this.props.t("Fill in the empty row");
  //     this.setState({ duplicateErrorRelative: errorMessage });
  //   } else {
  //     const newRelative = {
  //       Id: lastUsedId,
  //       arName: "",
  //       enName: "",
  //       relativeId: null,
  //       nationalityId: null,
  //       phone: "",
  //       cellular: "",
  //     };
  //     this.setState({
  //       relativesArray: [...relativesArray, newRelative],
  //       lastUsedId: lastUsedId + 1,
  //     });
  //     this.setState({ duplicateErrorRelative: null });
  //   }
  // };

  // handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
  //   this.setState(prevState => {
  //     const updatedRelatives = prevState.relativesArray.map(relative => {
  //       if (relative.Id === rowId) {
  //         return {
  //           ...relative,
  //           [fieldName]: selectedValue,
  //         };
  //       }
  //       return relative;
  //     });

  //     return {
  //       relativesArray: updatedRelatives,
  //     };
  //   });
  // };
  // deleteRelative = relative => {
  //   this.setState(prevState => {
  //     const updatedRelatives = prevState.relativesArray.filter(
  //       item => item.Id !== relative.Id
  //     );

  //     return {
  //       relativesArray: updatedRelatives,
  //     };
  //   });
  // };
  // handleAlertCloseRelative = () => {
  //   this.setState({ duplicateErrorRelative: null });
  // };

  handleDiplomaSelect = (event, fieldName, setFieldValue, values) => {
    const { diplomalevels } = this.props;
    const selectedValue = event.target.value;
    console.log("selectedValue", selectedValue);

    this.setState({
      trainee: values,
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
        diplomaError: false,
        trainee: values,
      });
    }
  };

  handleDataListChange = (event, fieldName) => {
    const { HasBrotherCheck } = this.state;

    const selectedValue = event.target.value;

    if (fieldName == "DiplomaCountryId") {
      this.setState({ selectedCountry: selectedValue });
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState({ selectedGovernorate: selectedValue });
    }

    /*  if (fieldName == "DiplomaCityId") {
      this.setState({ selectedCity: selectedValue });
    } */

    if (fieldName === "UnivCountryId") {
      this.setState({ selectedUnivCountry: selectedValue });
    }

    if (HasBrotherCheck) {
      if (fieldName === "studentSID") {
        this.setState({ selectedBrother: selectedValue });
      }
    }
  };

  handleInputFocus = fieldName => {
    const {
      selectedDiploma,
      selectedCountry,
      selectedGovernorate,
      selectedCity,
      selectedBrother,
      selectedUnivCountry,
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

    /* if (fieldName == "DiplomaCityId") {
      this.setState({ selectedCity });
    } */

    if (fieldName == "UnivCountryId") {
      this.setState({ selectedUnivCountry });
    }

    if (fieldName == "studentSID") {
      this.setState({ selectedBrother });
    }

    if (fieldName == "studentSID") {
    }
  };

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

  // handleHasBrotherChange = event => {
  //   const { name, checked } = event.target;
  //   const value = checked ? 1 : 0;
  //   this.setState({
  //     HasBrotherCheck: value,
  //     showSiblingsSelect: checked,
  //   });
  // };

  handleSelectChange = (fieldName, selectedValue, values) => {
    const { nationalities } = this.props;
    console.log("values before setState", values);

    if (fieldName == "NationalityId") {
      const name = nationalities.find(
        nationality => nationality.value === selectedValue
      );
      this.setState({
        selectedNationalityId: selectedValue,
        nationalityName: name.label,
        trainee: values,
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
        trainee: values,
      });
    }
  };

  // handleAddRowSiblings = () => {
  //   const { siblingsArray, lastUsedId } = this.state;
  //   const emptyRowsExist = siblingsArray.some(
  //     sibling => sibling.brotherSID.trim() === ""
  //   );
  //   if (emptyRowsExist) {
  //     const errorMessage = this.props.t("Fill in the empty row");
  //     this.setState({ duplicateErrorSibling: errorMessage });
  //   } else {
  //     const newSibling = {
  //       Id: lastUsedId,
  //       brotherSID: null,
  //     };
  //     this.setState({
  //       siblingsArray: [...siblingsArray, newSibling],
  //       lastUsedId: lastUsedId + 1,
  //     });
  //     this.setState({ duplicateErrorSibling: null });
  //   }
  // };

  // handleDeleteSibling = sibling => {
  //   this.setState(prevState => {
  //     const updatedSiblings = prevState.siblingsArray.filter(
  //       item => item.Id !== sibling.Id
  //     );

  //     return {
  //       siblingsArray: updatedSiblings,
  //     };
  //   });
  // };

  // handleSelectBrother = (rowId, fieldName, selectedValue, oldValue) => {
  //   const { studentsOpt, onUpdateBrother } = this.props;
  //   const { siblingsArray } = this.state;

  //   const selectBro = studentsOpt.find(
  //     studentOpt => studentOpt.value + " " + studentOpt.key == oldValue
  //   );
  //   this.setState({ oldBrother: selectBro });

  //   const brotherObj = studentsOpt.find(
  //     studentOpt => studentOpt.value + " " + studentOpt.key === selectedValue
  //   );

  //   if (brotherObj) {
  //     this.setState({ oldBrother: {} });
  //     const isDuplicate = siblingsArray.some(
  //       studentBrother =>
  //         studentBrother.Id !== rowId &&
  //         studentBrother.brotherSID === brotherObj.key
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
    this.setState({ duplicateErrorProfExperiences: null });
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "tempSiblings") {
      this.setState({ siblingsArray: selectedMulti });
    }
    console.log("selectedMulti", selectedMulti);
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
    if (fieldName == "socialStatusId") {
      this.setState({
        selectedSocialStatus: selectedValue,
        trainee: values,
      });
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

  handleDeleteRow = () => {
    const { onDeleteProfessionalExperience } = this.props;
    const { selectedRowId } = this.state;
    console.log("ssssssssssssssssssssssselectedrow", selectedRowId);
    if (selectedRowId !== null) {
      onDeleteProfessionalExperience(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleSubmit = values => {
    const { lastAddedId, onAddRequiredDocs } = this.props;
    const { stdDocsArray } = this.state;
    console.log("values in save", values);
    values["tempTraineeId"] = lastAddedId;
    console.log(lastAddedId);
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
    traineeinfo["tempTraineeId"] = lastAddedId;
    console.log("traineeinfo", traineeinfo);
    onAddRequiredDocs(traineeinfo);
  };

  handleExperienceSubmit = values => {
    const { lastAddedId, onAddNewProfessionalExperience } = this.props;
    const { profExperiencesArray, lastUsedExperienceId, isEdit } = this.state;
    console.log("values in save", values);
    values["tempTraineeId"] = lastAddedId;
    console.log(values["tempTraineeId"]);
    let traineeinfo = {};
    const extractedArray = profExperiencesArray.map(item => ({
      Id: item.Id,
      workType: item.workType,
      companyName: item.companyName,
      workPlace: item.workPlace,
      workField: item.workField,
      duaration: item.duaration,
    }));
    console.log("extractedArray", extractedArray);
    (traineeinfo["procedure"] = "SisApp_UpdateTempTraineeInfo"),
      (traineeinfo["tablename"] = "Common_TempTraineesProfessionalExperiences"),
      (traineeinfo["queryname"] = "Common_TempTraineesProfessionalExperiences"),
      (traineeinfo["ProfessionalExperiences"] = extractedArray);
    traineeinfo["tempTraineeId"] = lastAddedId;
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
      "Add New TempTrainee | keyInHands - React Admin & Dashboard Template";

    // const { tempTrainees } = this.state

    const {
      profExperiencesArray,
      duplicateError,
      duplicateErrorRelative,
      diplomaIdError,
      studentListColumns,
      duplicateErrorProfExperiences,
      selectedRegistrationDate,
      selectedregistrationCertLevelId,
      selectedStudyPattern,
      selectedExaminationSession,
      selectedBirthDate,
      selectedRegistrationDiplomaDate,
      selectedIdentityIssueDate,
      selectedPassportIssueDate,
      selectedPassportExpiryDate,
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
      selectedUnivCountry,
      selectedCity,
      selectedSemester,
      selectedGovernorate,
      selectedSocialStatus,
      selectedGender,
      emptyTempTrainee,
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
      errorMessage,
      successMessage,
      averageValue,
      HasBrotherCheck,
      diplomaError,
      averageError,
      IsSpecial,
      showSiblingsSelect,
      stdTotalGradeError,
      diplomaNumberError,
      relativesArray,
      studentGrade,
      totalGradeValue,
      showGenerateButton,
      attestatedValue,
      duplicateErrorSibling,
      stdDocsArray,
      siblingsArray,
      gradeError,
      selectedInstituteCountry,
      selectedHightStudyTypeId,
      selectedEstimateId,
      selectedRegUniDate,
      languageState,
      nationalNoError,
      identityNoError,
      plan_studyError,
      showAlert,
    } = this.state;
    const gradeOptions = [
      { value: 1, label: "Good" },
      { value: 2, label: "Very Good" },
      { value: 3, label: "Excellent" },
      { value: 4, label: "Fair" },
    ];

    const showNewInput = selectedregistrationCertLevelId === 1;

    const showUniForm = selectedregistrationCertLevelId === 4;

    const isShowInstituteinfo = selectedregistrationCertLevelId === 2;

    const isShowUlterStudy = selectedregistrationCertLevelId === 5;

    const isHightSchooll = selectedregistrationCertLevelId === 3;

    const { SearchBar } = Search;

    const {
      lastAddedId,
      trnProfExperiences,
      tempTrainees,
      socialStatus,
      tempTrainee,
      tempTraineesDocuments,
      nationalities,
      faculties,
      countries,
      currentSemester,
      cities,
      deleted,
      diplomalevels,
      governorates,
      genders,
      admissionConditions,
      academiccertificates,
      filteredAcademicCertificates,
      onGetFilteredAcademicCertificates,
      getFilteredFaculties,
      generated_student,
      t,
      relatives,
      regcertificates,
      highstudytypes,
      estimates,
    } = this.props;

    const { isEdit, deleteModal, generateModal } = this.state;

    const trainee = this.state.trainee;
    console.log("std", stdDocsArray);
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");
    const pageOptions = {
      sizePerPage: 10,
      TotalGradeSize: tempTrainees.length,
      custom: true,
    };

    const defaultSorted = [
      {
        id: 99,
        dataField: "Id",
        order: "desc",
      },
    ];
    const selectRow = {
      mode: "checkbox",
    };
    const Year = props => (
      <InputMask
        mask="9999"
        value={props.value}
        className="form-control input-mask"
        onChange={props.onChange}
      ></InputMask>
    );
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
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
    const trnProfExperienceColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "workType", text: t("Work Type"), sort: true },
      { dataField: "companyName", text: t("Company Name"), sort: true },
      { dataField: "workPlace", text: t("Work Place"), sort: true },
      { dataField: "workField", text: t("Work Field"), sort: true },
      { dataField: "duaration", text: t("Duration"), sort: true },
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

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title={this.props.t("TempTrainee")}
              breadcrumbItem={this.props.t("New TempTrainee")}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <React.Fragment>
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
                      <Row>
                        <Col xl="12">
                          <div>
                            <Formik
                              enableReinitialize={true}
                              initialValues={{
                                FirstName: (trainee && trainee.FirstName) || "",
                                LastName: (trainee && trainee.LastName) || "",
                                FatherName:
                                  (trainee && trainee.FatherName) || "",
                                grandFatherName:
                                  (trainee && trainee.grandFatherName) || "",
                                MotherName:
                                  (trainee && trainee.MotherName) || "",
                                BirthLocation:
                                  (trainee && trainee.BirthLocation) || "",
                                FirstNameE:
                                  (trainee && trainee.FirstNameE) || "",
                                LastNameE: (trainee && trainee.LastNameE) || "",
                                FatherNameE:
                                  (trainee && trainee.FatherNameE) || "",
                                grandFatherNameE:
                                  (trainee && trainee.grandFatherNameE) || "",
                                MotherNameE:
                                  (trainee && trainee.MotherNameE) || "",
                                BirthLocationE:
                                  (trainee && trainee.BirthLocationE) || "",
                                birthdate:
                                  (trainee && trainee.birthdate) ||
                                  selectedBirthDate,
                                NationalityId:
                                  (trainee && trainee.NationalityId) ||
                                  selectedNationalityId,
                                GenderId:
                                  (trainee && trainee.GenderId) ||
                                  selectedGender ||
                                  "",

                                nationalNo:
                                  (trainee && trainee.nationalNo) || "",
                                identityNo:
                                  (trainee && trainee.identityNo) || "",
                                identityIssueDate:
                                  (trainee && trainee.identityIssueDate) ||
                                  selectedIdentityIssueDate ||
                                  "",
                                civicZone: (trainee && trainee.civicZone) || "",
                                registerZone:
                                  (trainee && trainee.registerZone) || "",
                                registerNo:
                                  (trainee && trainee.registerNo) || "",
                                PassNumber:
                                  (trainee && trainee.PassNumber) || "",
                                passportIssueDate:
                                  (trainee && trainee.passportIssueDate) ||
                                  selectedPassportIssueDate,
                                passportExpiryDate:
                                  (trainee && trainee.passportExpiryDate) ||
                                  selectedPassportExpiryDate,
                                diplomaId:
                                  (trainee && trainee.diplomaId) ||
                                  selectedDiploma,
                                DiplomaCountryId:
                                  (trainee && trainee.DiplomaCountryId) ||
                                  selectedCountry,

                                DiplomaNumber:
                                  (trainee && trainee.DiplomaNumber) || "",
                                DiplomaGovernorateId:
                                  (trainee && trainee.DiplomaGovernorateId) ||
                                  selectedGovernorate,

                                /* DiplomaCityId:
                                  (trainee && trainee.DiplomaCityId) ||
                                  selectedCity, */

                                DiplomaYear:
                                  (trainee && trainee.DiplomaYear) || "",
                                ExaminationSession:
                                  (trainee && trainee.ExaminationSession) || "",
                                Average: (trainee && trainee.Average) || "",
                                diplomaDate:
                                  (trainee && trainee.diplomaDate) ||
                                  selectedDiplomaDate,
                                diplomaVerificationNum:
                                  (trainee && trainee.diplomaVerificationNum) ||
                                  "",
                                diplomaVerificationDate:
                                  (trainee &&
                                    trainee.diplomaVerificationDate) ||
                                  selectedDiplomaVerificationDate,
                                socialStatusId:
                                  (trainee && trainee.socialStatusId) ||
                                  selectedSocialStatus,
                                registrationCertLevelId:
                                  (trainee &&
                                    trainee.registrationCertLevelId) ||
                                  selectedregistrationCertLevelId,
                                registrationDiplomaName:
                                  (trainee &&
                                    trainee.registrationDiplomaName) ||
                                  "",
                                registrationDiplomaDepartment:
                                  (trainee &&
                                    trainee.registrationDiplomaDepartment) ||
                                  "",
                                diplomaName:
                                  (trainee && trainee.diplomaName) || "",

                                registrationDiplomaAverage:
                                  (trainee &&
                                    trainee.registrationDiplomaAverage) ||
                                  "",
                                uniAverage:
                                  (trainee && trainee.uniAverage) || "",
                                registrationDiplomaDate:
                                  (trainee &&
                                    trainee.registrationDiplomaDate) ||
                                  selectedRegistrationDiplomaDate,

                                uniName: (trainee && trainee.uniName) || "",
                                UnivCountryId:
                                  (trainee && trainee.UnivCountryId) ||
                                  selectedUnivCountry,

                                /* TransferUnivAverage:
                                  (trainee && trainee.TransferUnivAverage) ||
                                  "", */
                                studyPattern:
                                  (trainee && trainee.studyPattern) || "",
                                /*  selectedSemester:
                                  (trainee && trainee.selectedSemester) ||
                                  selectedSemester ||
                                  null, */
                                RegistrationDate:
                                  (trainee && trainee.RegistrationDate) ||
                                  selectedRegistrationDate, //""
                                FacultyId:
                                  (trainee && trainee.FacultyId) ||
                                  selectedFacultyId,
                                plan_study:
                                  (trainee && trainee.plan_study) || "",
                                CurrentAddress:
                                  (trainee && trainee.CurrentAddress) || "",
                                CurrentAddrPhone:
                                  (trainee && trainee.CurrentAddrPhone) || "",
                                CurrentAddrCell:
                                  (trainee && trainee.CurrentAddrCell) || "",
                                PermanentAddress:
                                  (trainee && trainee.PermanentAddress) || "",
                                ParentAddrPhone:
                                  (trainee && trainee.ParentAddrPhone) || "",
                                WhatsappMobileNum:
                                  (trainee && trainee.WhatsappMobileNum) || "",
                                Email: (trainee && trainee.Email) || "",
                                GeneralNote:
                                  (trainee && trainee.GeneralNote) || "",
                                academicYear:
                                  (trainee && trainee.academicYear) || "",

                                InstituteCountryId:
                                  (trainee && trainee.InstituteCountryId) ||
                                  selectedInstituteCountry,
                                HighStudyTypeId:
                                  (trainee && trainee.HighStudyTypeId) ||
                                  selectedHightStudyTypeId,
                                EstimateId:
                                  (trainee && trainee.EstimateId) ||
                                  selectedEstimateId,

                                RegUniDate:
                                  (trainee && trainee.RegUniDate) ||
                                  selectedRegUniDate,
                                // workType: (trainee && trainee.workType) || "",
                                // companyName:
                                //   (trainee && trainee.companyName) || "",
                                // workPlace: (trainee && trainee.workPlace) || "",
                                // workField: (trainee && trainee.workField) || "",
                                // Duration: (trainee && trainee.Duration) || "",
                              }}
                              validationSchema={Yup.object().shape({
                                FirstName: Yup.string()
                                  .matches(/^[أ-ي]+$/)
                                  .required("Please Enter Your First Name"),
                                LastName: Yup.string()
                                  .matches(/^[أ-ي]+$/)
                                  .required("Please Enter Your Last Name"),
                                FatherName: Yup.string()
                                  .matches(/^[أ-ي]+$/)
                                  .required("Please Enter Your Father Name"),
                                FirstNameE: Yup.string().matches(/^[a-zA-Z]+$/),
                                LastNameE: Yup.string().matches(/^[a-zA-Z]+$/),
                                FatherNameE:
                                  Yup.string().matches(/^[a-zA-Z]+$/),
                                grandFatherNameE:
                                  Yup.string().matches(/^[a-zA-Z]+$/),
                                MotherNameE:
                                  Yup.string().matches(/^[a-zA-Z]+$/),
                                BirthLocationE:
                                  Yup.string().matches(/^[a-zA-Z]+$/),
                                Average: Yup.string()
                                  .matches(/^[0-9]+$/)
                                  .required("Please Enter Your Average"),
                                DiplomaNumber: Yup.string().matches(/^[0-9]+$/),
                                GenderId: Yup.string().required(
                                  "Please Select Your Gender"
                                ),
                                diplomaId: Yup.string()
                                  .matches(/^[\u0600-\u06FF\s]+$/)
                                  .required("Please Enter Your Diploma Type"),
                                grandFatherName: Yup.string()
                                  .matches(/^[أ-ي]+$/)
                                  .required(
                                    "Please Enter Your Grandfather Name"
                                  ),
                                MotherName: Yup.string()
                                  .matches(/^[أ-ي]+$/)
                                  .required("Please Enter Your Mother Name"),
                                BirthLocation: Yup.string()
                                  .matches(/^[أ-ي]+$/)
                                  .required("Please Enter Your Birth Location"),

                                birthdate: Yup.date().required(
                                  "Please Enter Your Date of Birth"
                                ),
                                Email: Yup.string().email(
                                  "Must be a valid Email"
                                ),
                                academicYear: Yup.string(),
                                plan_study: Yup.string().required(
                                  "Please Enter Your Specialty"
                                ),
                                nationalNo: Yup.string().required(
                                  "National Number Is Required"
                                ),
                                identityNo: Yup.string().required(
                                  "Identity Number Is Required"
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
                                handleFocus,
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
                                                  this.state.activeTab === 1
                                                    ? "current"
                                                    : ""
                                                }`}
                                              >
                                                <NavLink
                                                  className={`nav-link ${
                                                    this.state.activeTab === 1
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    this.toggleTab(1)
                                                  }
                                                >
                                                  <h3 className="navItem-header">
                                                    <span className="number">
                                                      1.
                                                    </span>
                                                    {this.props.t("Main Info")}
                                                  </h3>
                                                </NavLink>
                                              </NavItem>
                                              <NavItem
                                                key={2}
                                                className={`nav-item ${
                                                  this.state.activeTab === 2
                                                    ? "current"
                                                    : ""
                                                }`}
                                              >
                                                <NavLink
                                                  className={`nav-link ${
                                                    this.state.activeTab === 2
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    this.toggleTab(2)
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
                                                  this.state.activeTab === 3
                                                    ? "current"
                                                    : ""
                                                }`}
                                              >
                                                <NavLink
                                                  className={`nav-link ${
                                                    this.state.activeTab === 3
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    this.toggleTab(3)
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
                                                  this.state.activeTab === 4
                                                    ? "current"
                                                    : ""
                                                }`}
                                              >
                                                <NavLink
                                                  className={`nav-link ${
                                                    this.state.activeTab === 4
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    this.toggleTab(4)
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
                                                  this.state.activeTab === 5
                                                    ? "current"
                                                    : ""
                                                }`}
                                              >
                                                <NavLink
                                                  className={`nav-link ${
                                                    this.state.activeTab === 5
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    this.toggleTab(5)
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
                                              activeTab={this.state.activeTab}
                                              className="body"
                                            >
                                              <TabPane key={1} tabId={1}>
                                                <Row>
                                                  <Card id="trainee-card">
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
                                                                      this.state
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
                                              <TabPane key={2} tabId={2}>
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
                                                                  (a, b) =>
                                                                    b.Id - a.Id
                                                                )
                                                                .map(level => (
                                                                  <button
                                                                    key={
                                                                      level.Id
                                                                    }
                                                                    type="button"
                                                                    name="registrationCertLevelId"
                                                                    value={
                                                                      selectedregistrationCertLevelId ==
                                                                      level.arTitle //arcertificatelevel
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
                                                                ))}
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
                                                                  placeholder="Type to search..."
                                                                  list="univCountryDatalistOptions"
                                                                  value={
                                                                    values.UnivCountryId
                                                                  }
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
                                                                        e.target
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
                                                                  placeholder="Type to search..."
                                                                  list="univCountryDatalistOptions"
                                                                  value={
                                                                    values.UnivCountryId
                                                                  }
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
                                                                        e.target
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
                                                                  list="CountrydatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  value={
                                                                    values.DiplomaCountryId
                                                                  }
                                                                  // onChange={event => {
                                                                  //   const selectedCountry =
                                                                  //     event
                                                                  //       .target
                                                                  //       .value;
                                                                  //   setFieldValue(
                                                                  //     "DiplomaCountryId",
                                                                  //     selectedCountry
                                                                  //   );
                                                                  // }}
                                                                  onChange={event => {
                                                                    setFieldValue(
                                                                      "DiplomaCountryId",
                                                                      event
                                                                        .target
                                                                        .value
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
                                                                  placeholder="Type to search..."
                                                                  name="DiplomaGovernorateId"
                                                                  className={`form-control }`}
                                                                  list="GovernoratedatalistOptions"
                                                                  value={
                                                                    values.DiplomaGovernorateId
                                                                  }
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
                                                      </Row>
                                                    </CardBody>
                                                  </Card>

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
                                                                isMulti={true}
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
                                                </Row>
                                              </TabPane>
                                              <TabPane key={3} tabId={3}>
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
                                              <TabPane key={4} tabId={4}>
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
                                                            {deleted == 0 &&
                                                              showAlert && (
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
                                                                    onClick={
                                                                      this
                                                                        .handleExpErrorClose
                                                                    }
                                                                  ></button>
                                                                </Alert>
                                                              )}
                                                            {deleted == 1 &&
                                                              showAlert && (
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
                                                                      !lastAddedId
                                                                    }
                                                                  >
                                                                    <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                  </IconButton>
                                                                </Tooltip>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                          <DeleteModal
                                                            show={deleteModal}
                                                            onDeleteClick={
                                                              this
                                                                .handleDeleteRow
                                                            }
                                                            onCloseClick={() =>
                                                              this.setState({
                                                                deleteModal: false,
                                                                selectedRowId:
                                                                  null,
                                                              })
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
                                                                afterSaveCell: (
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
                                              <TabPane key={5} tabId={5}>
                                                <Row className="documents-table">
                                                  <Col>
                                                    <Card>
                                                      <CardBody>
                                                        <div className="table-responsive">
                                                          <BootstrapTable
                                                            keyField="Id"
                                                            data={stdDocsArray}
                                                            columns={
                                                              preReqColumns
                                                            }
                                                            key={document.Id}
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
                                                  this.state.activeTab ===
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
                                                    {this.props.t("Generate")}
                                                  </Link>
                                                </li>
                                              )}

                                              {!isEdit &&
                                                this.state.activeTab === 4 && (
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
                                              {isEdit && (
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
                                                this.state.activeTab === 5 && (
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
                                              {isEdit && (
                                                <li>
                                                  <Link
                                                    to="#"
                                                    onClick={() => {
                                                      this.handleSubmit(values);
                                                    }}
                                                  >
                                                    save
                                                  </Link>
                                                </li>
                                              )}

                                              {!isEdit &&
                                                this.state.activeTab === 3 && (
                                                  <li>
                                                    <Link
                                                      to="#"
                                                      onClick={() => {
                                                        this.handleSave(values);
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
                                                      this.handleSave(values);
                                                    }}
                                                  >
                                                    save
                                                  </Link>
                                                </li>
                                              )}
                                              <li
                                                className={
                                                  this.state.activeTab === 1
                                                    ? "previous disabled"
                                                    : "previous"
                                                }
                                              >
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    this.toggleTab(
                                                      this.state.activeTab - 1
                                                    );
                                                  }}
                                                >
                                                  {this.props.t("Previous")}
                                                </Link>
                                              </li>
                                              <li
                                                className={
                                                  this.state.activeTab === 5
                                                    ? "next disabled"
                                                    : "next"
                                                }
                                              >
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    this.toggleTab(
                                                      this.state.activeTab + 1
                                                    );
                                                  }}
                                                >
                                                  {this.props.t("Next")}
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
                          </div>
                        </Col>
                      </Row>
                    </React.Fragment>
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
  deleted,
  nationalities,
  mobAppFacultyAccs,
  countries,
  generalManagements,
  cities,
  diplomalevels,
  governorates,
  regReqDocuments,
  genders,
  semesters,
  academiccertificates,
  relatives,
  highstudytypes,
  estimates,
}) => ({
  tempTrainees: tempTrainees.tempTrainees,
  last_created_trainee: tempTrainees.last_created_trainee,
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
});

const mapDispatchToProps = dispatch => ({
  onGetTempTrainees: lng => dispatch(getTempTrainees(lng)),
  onAddNewTempTrainee: trainee => dispatch(addNewTempTrainee(trainee)),
  onGetFilteredAcademicCertificates: academicCer =>
    dispatch(getFilteredAcademicCertificates(academicCer)),
  onGetTempTraineesRegCertificates: () => dispatch(getRegisterCertificates()),
  onGetTempTraineesDocuments: years =>
    dispatch(getTempTraineeDefaultRegReqDocs(years)),
  onAddNewProfessionalExperience: profExperience =>
    dispatch(addNewProfessionalExperience(profExperience)),
  onUpdateProfessionalExperience: profExperience =>
    dispatch(updateProfessionalExperience(profExperience)),
  onDeleteProfessionalExperience: profExperience =>
    dispatch(deleteProfessionalExperience(profExperience)),
  onAddRequiredDocs: trainee => dispatch(addRequiredDocs(trainee)),
  onUploadFile: fileData => dispatch(uploadFile(fileData)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(NewTrainee)));
