import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
import * as moment from "moment";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
  Input,
  InputGroup,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeDeletedValue,
  getNationalitiesOpt,
  getGendersch,
  // getAdministrativeSupervisorsOpt,
  getJobRanksOpt,
  getCorporateNodesOpt,
  getJobTitlesOpt,
  getPhysicalWorkLocationsOpt,
  getAcademicYearsOpt,
} from "store/HR/employees/actions";
import {
  getContracts,
  addNewContract,
  updateContract,
  // getEmployeeDeletedValue,
} from "store/HR/contracts/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import countriesSaga from "store/country/saga";
class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      contracts: [],
      contractsTypes: [],
      employmentCases: [],
      workClassifications: [],
      employee: "",
      contract: "",
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      selectEmpId: null,
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      modal3: false,
      firstNameError: false,
      grandFatherNameError: false,
      fatherNameError: false,
      motherNameError: false,
      lastNameError: false,
      birthLocationError: false,
      ncsDateError: false,
      isEdit: false,
      isAdd: false,
      isOpen: false,
      isView: false,
      selectedGender: "",
      selectedBirthDate: "",
      selectedPassportExpirationDate: "",
      selectedPassportGrantDate: "",
      selectedResExpirationDate: "",
      selectedResidenceGrantedDate: "",
      selectedCardExpirationDate: "",
      selectedCardGrantDate: "",
      // selectedCorporateNode: "",
      // selectedAdministrativeSupervisors: "",
      // selectedPhysicalWorkLocations: "",
      selectedWorkClassification: "",
      selectedJobTitle: "",
      selectedCostCenter: "",
      selectedJobRank: "",
      selectedCountryId: "",
      selectedCityId: "",
      selectedStateId: "",
      selectedHasMinistryApprove: "",
      selectedGovernmentWorker: "",
      selectedNationality: 0,
      birthdateError: false,
      nationalityError: false,
      signatureDateError: false,
      hireDateError: false,
      contractTypeError: false,
      academicYearsIdError: false,
      // corporateNodeError: false,
      jobTitleError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      languageState: "",
      showDecision: false,
      showEmployeeData: false,
    };
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      employees,
      contracts,
      contractsTypes,
      employmentCases,
      genders,
      onGetEmployees,
      onGetContracts,
      deleted,
      user_menu,
      nationalitiesOpt,
      administrativeSupervisorsOpt,
      // physicalWorkLocationsOpt,
      workClassifications,
      onGetAdministrativeSupervisorsOpt,
      onGetPhysicalWorkLocationsOpt,
      onGetJobRanksOpt,
      onGetJobTitlesOpt,
      // onGetCorporateNodesOpt,
      jobRanksOpt,
      corporateNodesOpt,
      jobTitlesOpt,
      onGetAcademicYearsOpt,
      cities,
      countries,
      governorates,
      academicYearsOpt,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (employee && !employees.length) {
    //   onGetEmployees();
    // }
    onGetEmployees(lang);
    onGetContracts();
    // onGetAdministrativeSupervisorsOpt();
    // onGetPhysicalWorkLocationsOpt();
    onGetJobRanksOpt();
    onGetJobTitlesOpt();
    // onGetCorporateNodesOpt();
    onGetAcademicYearsOpt();

    this.setState({
      employees,
      deleted,
      genders,
      nationalitiesOpt,
      // administrativeSupervisorsOpt,
      // corporateNodesOpt,
      jobRanksOpt,
      jobTitlesOpt,
      workClassifications,
      // physicalWorkLocationsOpt,
      contracts,
      contractsTypes,
      employmentCases,
      academicYearsOpt,
      cities,
      countries,
      governorates,
      languageState: lang,
    });
    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleLanguageChange = lng => {
    const { onGetEmployees } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetEmployees(lng);
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
    }
  }

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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  toggle2 = () => {
    this.setState(prevState => ({
      modal2: !prevState.modal2,
    }));
  };

  toggle3 = () => {
    this.setState(prevState => ({
      modal3: !prevState.modal3,
    }));
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModal: true });
  };

  handleEmployeeClick = arg => {
    console.log("arg", arg);

    this.setState({
      employee: arg,
      // perosonalCardNum: arg.perosonalCardNum,
      // perosonalCardGrantDate: arg.perosonalCardGrantDate,
      // perosonalCardExpirationDate: arg.perosonalCardExpirationDate,
      // amanaNum: arg.amanaNum,
      selectedGender: arg.genderId,
      selectedNationality: arg.nationalityId,
      // selectedStateId: arg.stateId,
      // selectedCountryId: arg.countryId,
      // selectedCityId: arg.cityId,
      isEdit: true,
    });
    this.toggle();
  };

  handleOnClick = employee => {
    console.log("fffffffffff", employee);
    this.setState({
      contract: "",
      isOpen: true,
      selectEmpId: employee.Id,
    });
    this.toggle2();
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName === "hasMinistryApprove") {
      this.setState({ selectedHasMinistryApprove: option });
    }

    if (fieldName === "governmentWorker") {
      this.setState({ selectedGovernmentWorker: option });
    }
  };

  handleAddRow = () => {
    this.setState({
      employee: "",
      isEdit: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleSave = values => {
    const {
      isEdit,
      isAdd,
      isOpen,
      selectedBirthDate,
      selectedPassportExpirationDate,
      selectedPassportGrantDate,
      selectedResExpirationDate,
      selectedCountryId,
      selectedCityId,
      selectedStateId,
      selectedResidenceGrantedDate,
      selectedCardGrantDate,
      selectedCardExpirationDate,
      selectedGender,
      selectedNationality,
    } = this.state;
    const {
      onAddNewEmployee,
      cities,
      countries,
      governorates,
      onUpdateEmployee,
    } = this.props;
    console.log("values", values);

    values["genderId"] = selectedGender;
    values["nationalityId"] = selectedNationality;
    values["countryId"] = selectedCountryId;
    values["cityId"] = selectedCityId;
    values["stateId"] = selectedStateId;
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.fatherName === "" ||
      values.grandFatherName === "" ||
      values.motherName === "" ||
      values.birthLocation === "" ||
      values.birthdate === "" ||
      (values.nationalityId === "" && selectedNationality === "")
    ) {
      this.setState({ firstNameError: true, saveError: true });

      this.setState({ lastNameError: true, saveError: true });

      this.setState({ fatherNameError: true, saveError: true });

      this.setState({ grandFatherNameError: true, saveError: true });

      this.setState({ motherNameError: true, saveError: true });

      this.setState({ birthLocError: true, saveError: true });

      this.setState({ birthDateError: true, saveError: true });

      this.setState({ nationalityError: true, saveError: true });

      const emptyError = this.props.t(
        "Fill the Required Fields to Save Employee"
      );

      this.setState({ emptyError: emptyError });
    } else {
      this.setState({ firstNameError: false, saveError: false });
      this.setState({ lastNameError: false, saveError: false });
      this.setState({ fatherNameError: false, saveError: false });
      this.setState({ motherNameError: false, saveError: false });
      this.setState({ birthLocError: false, saveError: false });
      this.setState({ birthdateError: false, saveError: false });
      this.setState({ nationalityError: false, saveError: false });
      this.setState({ grandFatherNameError: false, saveError: false });

      let employeeinfo = {};

      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          employeeinfo[key] = values[key];
      });

      this.setState({
        errorMessages: {},
      });

      if (selectedGender) {
        employeeinfo["genderId"] = parseInt(selectedGender);
      }

      if (selectedNationality) {
        employeeinfo["nationalityId"] = selectedNationality;
      }

      if (selectedBirthDate != "") {
        employeeinfo["birthDate"] = selectedBirthDate;
      }

      if (selectedPassportGrantDate) {
        employeeinfo["passportGrantDate"] = selectedPassportGrantDate;
      }

      if (selectedPassportExpirationDate) {
        employeeinfo["passportExpirationDate"] = selectedPassportExpirationDate;
      }

      if (selectedCardGrantDate) {
        employeeinfo["perosonalCardGrantDate"] = selectedCardGrantDate;
      }

      if (selectedCardExpirationDate) {
        employeeinfo["perosonalCardExpirationDate"] =
          selectedCardExpirationDate;
      }

      if (selectedResExpirationDate) {
        employeeinfo["resExpirationDate"] = selectedResExpirationDate;
      }

      if (selectedResidenceGrantedDate) {
        employeeinfo["residenceGrantedDate"] = selectedResidenceGrantedDate;
      }

      if (values.countryId) {
        const countryObject = countries.find(
          country => country.value === values.DiplomaCountryId
        );
        employeeinfo["countryId"] = countryObject.key;
      }
      if (values.stateId) {
        const governorateObject = governorates.find(
          governorate => governorate.value === values.stateId
        );
        employeeinfo["stateId"] = governorateObject.key;
      }

      if (values.cityId) {
        const cityObject = cities.find(city => city.value === values.cityId);
        employeeinfo["cityId"] = cityObject.key;
      }

      if (isEdit) {
        console.log("rrrrrrrrrrrrrrr", employeeinfo);
        onUpdateEmployee(employeeinfo);
      } else if (isAdd) {
        onAddNewEmployee(employeeinfo);
      }

      const saveEmployeeMessage = "Saved successfully ";
      this.setState({
        successMessage: saveEmployeeMessage,
      });

      this.toggle();
    }
  };

  handleSubmit = values => {
    const {
      isOpen,
      // selectedAdministrativeSupervisor,
      selectedPhysicalWorkLocations,
      selectedJobRank,
      selectedJobTitle,
      selectedCorporateNode,
      selectedContractType,
      selectedEmploymentCase,
      selectedNcsDate,
      selectedEndDate,
      selectedHireDate,
      selectedSignatureDate,
      selectedWorkClassification,
      selectedAcademicYearId,
      contract,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      selectEmpId,
    } = this.state;
    const { onAddNewContract, onUpdateContract } = this.props;

    //values["administrativeSupervisor"] = selectedAdministrativeSupervisor;
    // values["physicalWorkLocation"] = selectedPhysicalWorkLocations;
    values["employeeId"] = selectEmpId;
    values["jobRankId"] = selectedJobRank;
    values["jobTitleId"] = selectedJobTitle;
    // values["corporateNodeId"] = selectedCorporateNode;
    values["contractTypeId"] = selectedContractType;
    values["employmentCaseId"] = selectedEmploymentCase;
    values["hasMinistryApprove"] = selectedHasMinistryApprove;
    values["governmentWorker"] = selectedGovernmentWorker;
    values["workClassificationId"] = selectedWorkClassification;
    values["academicYearId"] = selectedAcademicYearId;
    console.log("valuesssssssssssssssssssss", values);
    let contractInfo = {};
    if (
      values.jobNumber &&
      values.biometricCode &&
      values.contractNumber &&
      values.sequenceInWorkplace &&
      values.quorum &&
      values.ncsDate &&
      values.endDate &&
      values.hireDate &&
      values.signatureDate &&
      // selectedAdministrativeSupervisor !== null &&
      // selectedPhysicalWorkLocations !== null &&
      selectedJobRank !== null &&
      selectedAcademicYearId !== null &&
      selectedWorkClassification !== null &&
      selectedJobTitle !== null &&
      // selectedCorporateNode !== null &&
      selectedContractType !== null &&
      selectedEmploymentCase !== null
    ) {
      console.log("selectEmpId", selectEmpId);
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", contractInfo);
        contractInfo[key] = values[key];
      });

      onAddNewContract(contractInfo);
      this.setState({
        errorMessages: {},
      });
      this.toggle2();
    } else {
      let emptyError = "";
      if (
        selectedJobTitle === undefined ||
        selectedNcsDate === undefined ||
        selectedContractType === undefined ||
        selectedHireDate === undefined ||
        selectedSignatureDate === undefined
      ) {
        this.setState({ emptyError: "Please fill in the required fields" });
      }
    }
  };

  handleDeleteRow = () => {
    const { onDeleteEmployee } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteEmployee({ Id: selectedRowId });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  // handleEmployeeDataChange = (rowId, fieldName, fieldValue) => {
  //   const { employees, onUpdateEmployee } = this.props;

  //   const isDuplicate = employees.some(employee => {
  //     return (
  //       employee.Id !== rowId && employee.arTitle.trim() === fieldValue.trim()
  //     );
  //   });

  //   if (isDuplicate) {
  //     const errorMessage = this.props.t("Value already exists");
  //     this.setState({ duplicateError: errorMessage });
  //     let onUpdate = { Id: rowId, [fieldName]: "-----" };
  //     onUpdateEmployee(onUpdate);
  //   } else {
  //     this.setState({ duplicateError: null });
  //     let onUpdate = { Id: rowId, [fieldName]: fieldValue };
  //     onUpdateEmployee(onUpdate);
  //   }
  // };

  handleSelectChange = (fieldName, selectedValue, values) => {
    console.log("selectedValue", selectedValue);
    const { nationalitiesOpt, countries, cities, governorates } = this.props;

    if (fieldName == "nationalityId") {
      const name = nationalitiesOpt.find(
        nationality => nationality.value === selectedValue
      );

      this.setState({
        selectedNationality: selectedValue,
        nationalityId: name.label,
        employee: values,
      });
    }
    if (fieldName === "countryId") {
      const selected = countries.find(
        country => country.value === selectedValue
      );
      console.log("selectedcountryId", selected);
      this.setState({
        selectedCountryId: selected ? selected.key : null,
        employee: values,
      });
      return;
    }
    if (fieldName === "cityId") {
      const selected = cities.find(city => city.value === selectedValue);
      console.log("CCCCCCCCCC", selected);
      this.setState({
        selectedCityId: selected ? selected.key : null,
        employee: values,
      });
      return;
    }

    if (fieldName === "stateId") {
      const selected = governorates.find(
        state => state.value === selectedValue
      );

      this.setState({
        selectedStateId: selected ? selected.key : null,
        employee: values,
      });
      return;
    }
    if (fieldName === "genderId") {
      this.setState({ selectedGender: selectedValue, employee: values });
    }
  };

  handleSelect = (fieldName, selectedValue, values) => {
    const { jobTitlesOpt, academicYearsOpt } = this.props;
    // if (fieldName == "administrativeSupervisor") {
    //   this.setState({
    //     selectedAdministrativeSupervisor: selectedValue,
    //   });
    // }
    /*  if (fieldName == "physicalWorkLocation") {
      this.setState({
        selectedPhysicalWorkLocations: selectedValue,
      });
    } */
    if (fieldName == "jobRankId") {
      this.setState({
        selectedJobRank: selectedValue,
        contract: values,
      });
    }
    if (fieldName == "contractTypeId") {
      this.setState({
        selectedContractType: selectedValue,
        contract: values,
      });
    }
    if (fieldName == "employmentCaseId") {
      this.setState({
        selectedEmploymentCase: selectedValue,
        contract: values,
      });
    }
    if (fieldName == "workClassificationId") {
      this.setState({
        selectedWorkClassification: selectedValue,
        contract: values,
      });
    }
    if (fieldName === "jobTitleId") {
      const selected = jobTitlesOpt.find(job => job.arTitle === selectedValue);

      this.setState({
        selectedJobTitle: selected ? selected.Id : null,
        contract: values,
      });
      return;
    }
    if (fieldName === "academicYearId") {
      const selected = academicYearsOpt.find(
        academicYear =>
          academicYear.arTitle.trim().toLowerCase() ===
          selectedValue.trim().toLowerCase()
      );
      this.setState({
        selectedAcademicYearId: selected ? selected.Id : null,
        contract: values,
      });

      return;
    }

    // if (fieldName == "corporateNodeId") {
    //   this.setState({
    //     selectedCorporateNode: selectedValue,
    //   });
    // }
    // if (fieldName == "academicYearId") {
    //   this.setState({
    //     selectedAcademicYearId: selectedValue,
    //   });
    // }
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
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

  handleSuccessClose = () => {
    const { onGetEmployeeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetEmployeeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetEmployeeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetEmployeeDeletedValue();
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleViewEmployee = arg => {
    console.log("arg", arg);
    this.setState({
      employee: arg,
      selectedCountryId: arg.countryId || null,
      // diplomaTypeName: arg.diplomaTypeName || null,
      // averageValue: arg.Average || null,
      // selectedCountry: arg.DiplomaCountryId || null,
      // facultyName: arg.facultyName || "",
      // selectedFacultyId: arg.FacultyId || null,
      // studyPlanName: arg.plan_study || "",
      // selectedGovernorate: arg.DiplomaGovernorateId || null,
      // selectedExaminationSession: arg.ExaminationSession || "",
      // selectedRegistrationCertLevelId: arg.registrationCertLevelId || "",
      // socialStatusName: arg.socialStatusName || null,
      // selectedRegistrationDiplomaDate: arg.registrationDiplomaDate || "",
      isView: true,
    });
    this.toggle3();
  };

  handleDecision = () => {
    this.setState({
      showDecision: true,
      showEmployeeData: false,
    });
  };

  handleEmployeeInformation = () => {
    this.setState({
      showEmployeeData: true,
      showDecision: false,
    });
  };

  render() {
    const employee = this.state.employee;
    const contract = this.state.contract;
    const {
      employees,
      contracts,
      t,
      contractsTypes,
      employmentCases,
      deleted,
      genders,
      nationalitiesOpt,
      administrativeSupervisorsOpt,
      workClassifications,
      physicalWorkLocationsOpt,
      jobRanksOpt,
      jobTitlesOpt,
      corporateNodesOpt,
      costCentersOpt,
      academicYearsOpt,
      cities,
      countries,
      governorates,
    } = this.props;
    const {
      languageState,
      duplicateError,
      deleteModal,
      modal,
      modal2,
      modal3,
      isEdit,
      isAdd,
      isView,
      isOpen,
      showAlert,
      emptyError,
      firstNameError,
      lastNameError,
      grandFatherNameError,
      fatherNameError,
      motherNameError,
      birthLocationError,
      hireDateError,
      ncsDateError,
      corporateNodeError,
      selectedBirthDate,
      selectedCityId,
      selectedCountryId,
      selectedStateId,
      selectedPassportExpirationDate,
      selectedPassportGrantDate,
      selectedResExpirationDate,
      selectedResidenceGrantedDate,
      selectedCardExpirationDate,
      selectedCardGrantDate,
      selectedNationality,
      selectedGender,
      birthDateError,
      contractTypeError,
      academicYearsIdError,
      jobTitleError,
      nationalityError,
      signatureDateError,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      errorMessage,
      successMessage,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      showDecision,
      showEmployeeData,
    } = this.state;
    console.log("employeeeeeeeeeeeeeeeee", employees);
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
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "fullName",
        text: this.props.t("Full Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "motherName",
        text: this.props.t("Mother Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "idNumber",
        text: this.props.t("Number ID"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "birthDate",
        text: this.props.t("Birth Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.birthDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "age",
        text: this.props.t("Age"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "gender",
        text: this.props.t("Gender"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "contractsCount",
        text: this.props.t("Contracts Count"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, employee, contract) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Add Contract")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-plus-circle blue-noti-icon"
                  onClick={() => this.handleOnClick(employee)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEmployeeClick(employee)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("View Employee")} placement="top">
              <IconButton>
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  id="viewtooltip"
                  onClick={() => this.handleViewEmployee(employee)}
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(employee)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: employees.length,
      custom: true,
    };
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({
              deleteModal: false,
              deleteModal2: false,
              deleteModal3: false,
              selectedRowId: null,
            })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("Employees")} />
            <Row>
              <Col>
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
                            onClick={() =>
                              this.handleAlertClose("duplicateError")
                            }
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
                        columns={columns}
                        data={employees}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={employees}
                            columns={columns}
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
                                  {/*    {showAddButton && ( */}
                                  <Col sm="8">
                                    <div className="text-sm-end">
                                      <Tooltip
                                        title={this.props.t("Add")}
                                        placement="top"
                                      >
                                        <IconButton
                                          color="primary"
                                          onClick={this.handleAddRow}
                                        >
                                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={employees}
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "click",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handleEmployeeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Employees found"
                                  )}
                                  defaultSorted={defaultSorting}
                                  bordered={true}
                                  striped={false}
                                  responsive
                                  filter={filterFactory()}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={modal}
                                  toggle={this.toggle}
                                  className={"modal-fullscreen"}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Employee Data")
                                      : t("Add Employee Data")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit && {
                                          Id: employee.Id,
                                        }),
                                        firstName:
                                          (employee && employee.firstName) ||
                                          "",
                                        lastName:
                                          (employee && employee.lastName) || "",
                                        fatherName:
                                          (employee && employee.fatherName) ||
                                          "",
                                        grandFatherName:
                                          (employee &&
                                            employee.grandFatherName) ||
                                          "",
                                        motherName:
                                          (employee && employee.motherName) ||
                                          "",

                                        birthLocation:
                                          (employee &&
                                            employee.birthLocation) ||
                                          "",
                                        firstNameE:
                                          (employee && employee.firstNameE) ||
                                          "",
                                        lastNameE:
                                          (employee && employee.lastNameE) ||
                                          "",
                                        fatherNameE:
                                          (employee && employee.fatherNameE) ||
                                          "",
                                        grandFatherNameE:
                                          (employee &&
                                            employee.grandFatherNameE) ||
                                          "",
                                        motherNameE:
                                          (employee && employee.motherNameE) ||
                                          "",
                                        birthDate: employee?.birthDate
                                          ? moment
                                              .utc(employee.birthDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        nationalityId:
                                          (employee &&
                                            employee.nationalityId) ||
                                          selectedNationality,
                                        genderId:
                                          (employee && employee.genderId) ||
                                          selectedGender,
                                        age: (employee && employee.age) || "",
                                        idNumber:
                                          (employee && employee.idNumber) || "",
                                        perosonalCardNum:
                                          (employee &&
                                            employee.perosonalCardNum) ||
                                          "",
                                        perosonalCardGrantDate:
                                          employee?.perosonalCardGrantDate
                                            ? moment
                                                .utc(
                                                  employee.perosonalCardGrantDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        perosonalCardExpirationDate:
                                          employee?.perosonalCardExpirationDate
                                            ? moment
                                                .utc(
                                                  employee.perosonalCardExpirationDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",

                                        amanaNum:
                                          (employee && employee.amanaNum) || "",
                                        registrationPlace:
                                          (employee &&
                                            employee.registrationPlace) ||
                                          "",
                                        registrationNum:
                                          (employee &&
                                            employee.registrationNum) ||
                                          "",
                                        passNumber:
                                          (employee && employee.passNumber) ||
                                          "",
                                        passportGrantDate:
                                          employee?.passportGrantDate
                                            ? moment
                                                .utc(employee.passportGrantDate)
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",

                                        passportExpirationDate:
                                          employee?.passportExpirationDate
                                            ? moment
                                                .utc(
                                                  employee.passportExpirationDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",

                                        residenceNum:
                                          (employee && employee.residenceNum) ||
                                          "",
                                        residenceGrantedDate:
                                          employee?.residenceGrantedDate
                                            ? moment
                                                .utc(
                                                  employee.residenceGrantedDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        resExpirationDate:
                                          employee?.resExpirationDate
                                            ? moment
                                                .utc(employee.resExpirationDate)
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",

                                        stateId:
                                          (employee && employee.stateId) ||
                                          selectedStateId,
                                        countryId:
                                          (employee && employee.countryId) ||
                                          selectedCountryId,
                                        cityId:
                                          (employee && employee.cityId) ||
                                          selectedCityId,
                                        // permanentAddress:
                                        //   (employee &&
                                        //     employee.permanentAddress) ||
                                        //   "",
                                        // temporaryAddress:
                                        //   (employee &&
                                        //     employee.temporaryAddress) ||
                                        //   "",
                                        phoneNumber:
                                          (employee && employee.phoneNumber) ||
                                          "",
                                        mobileNumber:
                                          (employee && employee.mobileNumber) ||
                                          "",
                                        whatsAppNumber:
                                          (employee &&
                                            employee.whatsAppNumber) ||
                                          "",
                                        email:
                                          (employee && employee.email) || "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        firstName: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your First Name"
                                          ),
                                        lastName: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Last Name"
                                          ),
                                        fatherName: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Father Name"
                                          ),
                                        grandFatherName: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Grandfather Name"
                                          ),

                                        motherName: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Mother Name"
                                          ),
                                        birthLocation: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Birth Location"
                                          ),
                                        firstNameE:
                                          Yup.string().matches(/^[a-zA-Z]+$/),
                                        lastNameE:
                                          Yup.string().matches(/^[a-zA-Z]+$/),
                                        fatherNameE:
                                          Yup.string().matches(/^[a-zA-Z]+$/),
                                        grandFatherNameE:
                                          Yup.string().matches(/^[a-zA-Z]+$/),
                                        motherNameE:
                                          Yup.string().matches(/^[a-zA-Z]+$/),
                                        email: Yup.string().email(
                                          "Must be a valid Email"
                                        ),
                                        phoneNumber: Yup.string()
                                          .notRequired()
                                          .test(
                                            "is-numeric-or-empty",
                                            "Phone number must contain digits only",
                                            value =>
                                              !value || /^\d+$/.test(value)
                                          ),
                                        mobileNumber: Yup.string()
                                          .notRequired()
                                          .test(
                                            "is-numeric-or-empty",
                                            "Mobile number must contain digits only",
                                            value =>
                                              !value || /^\d+$/.test(value)
                                          ),
                                        whatsAppNumber: Yup.string()
                                          .notRequired()
                                          .test(
                                            "is-numeric-or-empty",
                                            " WhatsApp number must contain digits only",
                                            value =>
                                              !value || /^\d+$/.test(value)
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
                                          <Card id="employee-card">
                                            <CardTitle id="course_header">
                                              {t("Employee Profile")}
                                            </CardTitle>
                                            <CardBody className="cardBody">
                                              {emptyError && (
                                                <Alert
                                                  color="danger"
                                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                  role="alert"
                                                >
                                                  {emptyError}
                                                  <button
                                                    type="button"
                                                    className="btn-close"
                                                    aria-label="Close"
                                                    onClick={() =>
                                                      this.handleAlertClose(
                                                        "emptyError"
                                                      )
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="5">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Arabic Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Col lg="12">
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="arfirstName">
                                                                      {this.props.t(
                                                                        "First Name(ar)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="firstName"
                                                                      id="arfirstName"
                                                                      className={
                                                                        "form-control" +
                                                                        ((errors.firstName &&
                                                                          touched.firstName) ||
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
                                                                      name="firstName"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="arlastName">
                                                                      {this.props.t(
                                                                        "Last Name(ar)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="lastName"
                                                                      id="arlastName"
                                                                      className={
                                                                        "form-control" +
                                                                        ((errors.lastName &&
                                                                          touched.lastName) ||
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
                                                                      name="lastName"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="arfatherName">
                                                                      {this.props.t(
                                                                        "Father Name(ar)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="fatherName"
                                                                      id="arfatherName"
                                                                      className={
                                                                        "form-control" +
                                                                        ((errors.fatherName &&
                                                                          touched.fatherName) ||
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
                                                                      name="fatherName"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="argrandFatherName">
                                                                      {this.props.t(
                                                                        "Grandfather Name ar"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
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
                                                                          "Grandfather Name is required"
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
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="armotherName">
                                                                      {this.props.t(
                                                                        "Mother Name(ar)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="motherName"
                                                                      id="armotherName"
                                                                      className={
                                                                        "form-control" +
                                                                        ((errors.motherName &&
                                                                          touched.motherName) ||
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
                                                                      name="motherName"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                                <Col lg="5">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "English Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Col lg="12">
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="enfirstName">
                                                                      {this.props.t(
                                                                        "First Name"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="firstNameE"
                                                                      id="enfirstName"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="enlastName">
                                                                      {this.props.t(
                                                                        "Last Name"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="lastNameE"
                                                                      id="enlastName"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="enfatherName">
                                                                      {this.props.t(
                                                                        "Father Name"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="fatherNameE"
                                                                      id="enfatherName"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="enGrandFatherName">
                                                                      {this.props.t(
                                                                        "Grandfather Name"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
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
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="enMotherName">
                                                                      {this.props.t(
                                                                        "Mother Name"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="motherNameE"
                                                                      id="enMotherName"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                                <Col lg="2">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <div className="mb-1">
                                                        <Card
                                                          style={{
                                                            width: "12rem",
                                                          }}
                                                        >
                                                          <CardTitle id="card_header">
                                                            {t(
                                                              "Personal Photo"
                                                            )}
                                                          </CardTitle>
                                                          <img
                                                            src={
                                                              this.state
                                                                .photoURL
                                                            }
                                                          />
                                                          <CardBody className="cardBody">
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
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg="4">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Basic Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="card_Body">
                                                          <Row>
                                                            <Col lg="12">
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="arbirthLoc">
                                                                      {this.props.t(
                                                                        "Birth Location(ar)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6>">
                                                                    <Field
                                                                      type="text"
                                                                      name="birthLocation"
                                                                      id="abirthLoc"
                                                                      className={
                                                                        "form-control" +
                                                                        ((errors.birthLocation &&
                                                                          touched.birthLocation) ||
                                                                        birthLocationError
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                    />

                                                                    {birthLocationError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Birth Location is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="birthLocation"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="birthDate">
                                                                      {this.props.t(
                                                                        "Date of Birth"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      name="birthDate"
                                                                      className={`form-control ${
                                                                        birthDateError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      type="date"
                                                                      value={
                                                                        values.birthDate
                                                                          ? new Date(
                                                                              values.birthDate
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
                                                                      id="birthDate-date-input"
                                                                    />
                                                                    {birthDateError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Birth Date is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="age">
                                                                      {this.props.t(
                                                                        "Age"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="age"
                                                                      id="age"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label className="form-label">
                                                                      {this.props.t(
                                                                        "Gender"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-3 mb-3">
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
                                                                              name="genderId"
                                                                              value={
                                                                                gender.value
                                                                              }
                                                                              id={
                                                                                gender.value
                                                                              }
                                                                              onChange={event => {
                                                                                this.handleSelectChange(
                                                                                  "genderId",
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
                                                                            <label>
                                                                              {this.props.t(
                                                                                gender.label
                                                                              )}
                                                                            </label>
                                                                          </div>
                                                                        )
                                                                      )}
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="nationalityId">
                                                                      {this.props.t(
                                                                        "Nationality"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Select
                                                                      className={`form-control ${
                                                                        nationalityError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      name="nationalityId"
                                                                      id="nationalityId"
                                                                      key="nationality_select"
                                                                      options={
                                                                        nationalitiesOpt
                                                                      }
                                                                      onChange={newValue =>
                                                                        this.handleSelectChange(
                                                                          "nationalityId",
                                                                          newValue.value,
                                                                          values
                                                                        )
                                                                      }
                                                                      defaultValue={nationalitiesOpt.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          employee?.nationalityId
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
                                                                  <ErrorMessage
                                                                    name="nationalityId"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                  />
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                                <Col lg="4">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "National Card Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="card_Body">
                                                          <Row>
                                                            <Col lg="12">
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="idNum">
                                                                      {this.props.t(
                                                                        "ID Number"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="idNumber"
                                                                      id="idNum"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="cardNum">
                                                                      {this.props.t(
                                                                        "Card Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
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
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="perosonalCardGrantDate">
                                                                      {this.props.t(
                                                                        "Grant Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="date"
                                                                      name="perosonalCardGrantDate"
                                                                      id="perosonalCardGrantDate-date-input"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                      value={
                                                                        values.perosonalCardGrantDate
                                                                          ? new Date(
                                                                              values.perosonalCardGrantDate
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
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="perosonalCardExpirationDate">
                                                                      {this.props.t(
                                                                        "End Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="date"
                                                                      name="perosonalCardExpirationDate"
                                                                      id="perosonalCardExpirationDate-date-input"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                      value={
                                                                        values.perosonalCardExpirationDate
                                                                          ? new Date(
                                                                              values.perosonalCardExpirationDate
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
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="cardCaza">
                                                                      {this.props.t(
                                                                        "amanaNum"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="amanaNum"
                                                                      id="cardCaza"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="cardCazaReg">
                                                                      {this.props.t(
                                                                        "Place of Registration"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="registrationPlace"
                                                                      id="cardCazaReg"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="cardRegNum">
                                                                      {this.props.t(
                                                                        "Number of Registration"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="registrationNum"
                                                                      id="cardRegNum"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                                <Col lg="4">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Passport and residence information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="card_Body">
                                                          <Row>
                                                            <Col lg="12">
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="passNum">
                                                                      {this.props.t(
                                                                        "Passport Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="passNumber"
                                                                      id="passNum"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="passGrantdate">
                                                                      {this.props.t(
                                                                        "Grant Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="date"
                                                                      name="passportGrantDate"
                                                                      className={`form-control`}
                                                                      value={
                                                                        values.passportGrantDate
                                                                          ? new Date(
                                                                              values.passportGrantDate
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
                                                                      id="passportGrantDate-date-input"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="passExpDate">
                                                                      {this.props.t(
                                                                        "Expiration Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="date"
                                                                      name="passportExpirationDate"
                                                                      className={`form-control`}
                                                                      value={
                                                                        values.passportExpirationDate
                                                                          ? new Date(
                                                                              values.passportExpirationDate
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
                                                                      id="passportExpirationDate-date-input"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="residence">
                                                                      {this.props.t(
                                                                        "Residence Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="residenceNum"
                                                                      id="residence"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="resGrantDate">
                                                                      {this.props.t(
                                                                        "Residence Granted Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="date"
                                                                      name="residenceGrantedDate"
                                                                      className={`form-control`}
                                                                      value={
                                                                        values.residenceGrantedDate
                                                                          ? new Date(
                                                                              values.residenceGrantedDate
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
                                                                      id="residenceGrantedDate-date-input"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="resExpirationDate">
                                                                      {this.props.t(
                                                                        "Residence Expiration Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="date"
                                                                      name="resExpirationDate"
                                                                      className={`form-control`}
                                                                      value={
                                                                        values.resExpirationDate
                                                                          ? new Date(
                                                                              values.resExpirationDate
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
                                                                      id="residenceExpirationDate-date-input"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Contact Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="card_Body">
                                                          <Row>
                                                            <Col lg="4">
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="countryId">
                                                                      {this.props.t(
                                                                        "Country"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <input
                                                                      name="countryId"
                                                                      className={`form-control ${this.state.inputClass}`}
                                                                      list="countriesId"
                                                                      id="countryId"
                                                                      placeholder="Type to search..."
                                                                      autoComplete="off"
                                                                      // value={
                                                                      //   values.countryId
                                                                      // }
                                                                      onChange={e =>
                                                                        this.handleSelectChange(
                                                                          e
                                                                            .target
                                                                            .name,
                                                                          e
                                                                            .target
                                                                            .value,
                                                                          values
                                                                        )
                                                                      }
                                                                    />
                                                                    <datalist id="countriesId">
                                                                      {countries.map(
                                                                        countryOpt => (
                                                                          <option
                                                                            key={
                                                                              countryOpt.key
                                                                            }
                                                                            value={
                                                                              countryOpt.value
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
                                                                    <Label for="stateId">
                                                                      {this.props.t(
                                                                        "State"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <input
                                                                      name="stateId"
                                                                      className={`form-control ${this.state.inputClass}`}
                                                                      list="statesId"
                                                                      id="stateId"
                                                                      placeholder="Type to search..."
                                                                      autoComplete="off"
                                                                      // value={
                                                                      //   values.stateId
                                                                      // }
                                                                      onChange={e =>
                                                                        this.handleSelectChange(
                                                                          e
                                                                            .target
                                                                            .name,
                                                                          e
                                                                            .target
                                                                            .value,
                                                                          values
                                                                        )
                                                                      }
                                                                    />
                                                                    <datalist id="statesId">
                                                                      {governorates.map(
                                                                        stateOpt => (
                                                                          <option
                                                                            key={
                                                                              stateOpt.key
                                                                            }
                                                                            value={
                                                                              stateOpt.value
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
                                                                    <Label for="cityId">
                                                                      {this.props.t(
                                                                        "City"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <input
                                                                      name="cityId"
                                                                      className={`form-control ${this.state.inputClass}`}
                                                                      list="citiesId"
                                                                      id="cityId"
                                                                      placeholder="Type to search..."
                                                                      autoComplete="off"
                                                                      onChange={e =>
                                                                        this.handleSelectChange(
                                                                          e
                                                                            .target
                                                                            .name,
                                                                          e
                                                                            .target
                                                                            .value,
                                                                          values,
                                                                          values
                                                                        )
                                                                      }
                                                                    />
                                                                    <datalist id="citiesId">
                                                                      {cities.map(
                                                                        cityOpt => (
                                                                          <option
                                                                            key={
                                                                              cityOpt.key
                                                                            }
                                                                            value={
                                                                              cityOpt.value
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
                                                            <Col lg="6">
                                                              {/* <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="permanentAddress">
                                                                      {this.props.t(
                                                                        "Permanent Address (Full Details)"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="permanentAddress"
                                                                      id="permanentAddress"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div> */}
                                                              <div className="mb-2">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="phoneNumber">
                                                                      {this.props.t(
                                                                        "Phone Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <Field
                                                                      type="text"
                                                                      name="phoneNumber"
                                                                      id="phoneNumber"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                    <ErrorMessage
                                                                      name="phoneNumber"
                                                                      component="div"
                                                                      className="text-danger"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-6">
                                                                    <Label for="email">
                                                                      {this.props.t(
                                                                        "Email Address"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-6">
                                                                    <InputGroup>
                                                                      <Field
                                                                        type="text"
                                                                        name="email"
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
                                                              <Col lg="12">
                                                                <Row>
                                                                  <Col lg="12">
                                                                    {/* <div className="mb-2">
                                                                      <Row>
                                                                        <Col className="col-6">
                                                                          <Label for="temporaryAddress">
                                                                            {this.props.t(
                                                                              "Temporary Address (if applicable)"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-6">
                                                                          <Field
                                                                            type="text"
                                                                            name="temporaryAddress"
                                                                            id="temporaryAddress"
                                                                            className={
                                                                              "form-control"
                                                                            }
                                                                          />
                                                                        </Col>
                                                                      </Row>
                                                                    </div> */}
                                                                    <div className="mb-2">
                                                                      <Row>
                                                                        <Col className="col-6">
                                                                          <Label for="mobileNumber">
                                                                            {this.props.t(
                                                                              "Mobile Phone Number"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-6">
                                                                          <Field
                                                                            type="text"
                                                                            name="mobileNumber"
                                                                            id="mobileNumber"
                                                                            className={
                                                                              "form-control"
                                                                            }
                                                                          />
                                                                          <ErrorMessage
                                                                            name="mobileNumber"
                                                                            component="div"
                                                                            className="text-danger"
                                                                          />
                                                                        </Col>
                                                                      </Row>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Row>
                                                                        <Col className="col-6">
                                                                          <Label for="whatsAppNumber">
                                                                            {this.props.t(
                                                                              "WhatsApp Number"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-6">
                                                                          <Field
                                                                            type="text"
                                                                            name="whatsAppNumber"
                                                                            id="whatsAppNumber"
                                                                            className={
                                                                              "form-control"
                                                                            }
                                                                          />
                                                                          <ErrorMessage
                                                                            name="whatsAppNumber"
                                                                            component="div"
                                                                            className="text-danger"
                                                                          />
                                                                        </Col>
                                                                      </Row>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </Col>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                          <Row>
                                            <Col>
                                              <div className="text-center">
                                                <button
                                                  type="button"
                                                  className="btn btn-primary me-2"
                                                  onClick={() => {
                                                    this.handleSave(values);
                                                  }}
                                                >
                                                  {t("Save")}
                                                </button>
                                              </div>
                                            </Col>
                                          </Row>
                                        </Form>
                                      )}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
                                <Modal
                                  isOpen={modal2}
                                  toggle={this.toggle2}
                                  className={"modal-fullscreen"}
                                >
                                  <ModalHeader toggle={this.toggle2} tag="h4">
                                    {!!isOpen ? t("Add Contract Data") : ""}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        // ...(isOpen && {
                                        //   Id: employee.Id,
                                        // }),
                                        jobNumber:
                                          (contract && contract.jobNumber) ||
                                          "",
                                        biometricCode:
                                          (contract &&
                                            contract.biometricCode) ||
                                          "",
                                        contractTypeId:
                                          (contract &&
                                            contract.contractTypeId) ||
                                          "",
                                        contractNumber:
                                          (contract &&
                                            contract.contractNumber) ||
                                          "",
                                        jobTitleId:
                                          (contract && contract.jobTitleId) ||
                                          "",
                                        // corporateNodeId:
                                        //   (contract &&
                                        //     contract.corporateNodeId) ||
                                        //   "",
                                        // physicalWorkLocation:
                                        //   (contract &&
                                        //     contract.physicalWorkLocation) ||
                                        //   "",
                                        quorum:
                                          (contract && contract.quorum) || "",
                                        sequenceInWorkplace:
                                          (contract &&
                                            contract.sequenceInWorkplace) ||
                                          "",
                                        hireDate:
                                          (contract && contract.hireDate) || "",
                                        signatureDate:
                                          (contract &&
                                            contract.signatureDate) ||
                                          "",
                                        endDate:
                                          (contract && contract.endDate) || "",
                                        ncsDate:
                                          (contract && contract.ncsDate) || "",
                                        // administrativeSupervisor:
                                        //   (contract &&
                                        //     contract.administrativeSupervisor) ||
                                        //   "",
                                        jobRankId:
                                          (contract && contract.jobRankId) ||
                                          "",
                                        workClassificationId:
                                          (contract &&
                                            contract.workClassificationId) ||
                                          "",
                                        academicYearId:
                                          (contract &&
                                            contract.academicYearId) ||
                                          "",
                                        governmentWorker:
                                          (contract &&
                                            contract.governmentWorker) ||
                                          "",
                                        hasMinistryApprove:
                                          (contract &&
                                            contract.hasMinistryApprove) ||
                                          "",
                                        employmentCaseId:
                                          (contract &&
                                            contract.employmentCaseId) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        contratType: Yup.string().required(
                                          "Please Enter Your Contract Type"
                                        ),
                                        ncsDate: Yup.date()
                                          .typeError(
                                            "Please Enter a valid NCS Date"
                                          )
                                          .required(
                                            "Please Enter Your NCS Date"
                                          ),

                                        hireDate: Yup.date()
                                          .typeError(
                                            "Please Enter a valid Hire Date"
                                          )
                                          .required(
                                            "Please Enter Your Hire Date"
                                          ),

                                        signatureDate: Yup.date()
                                          .typeError(
                                            "Please Enter a valid Signature Date"
                                          )
                                          .required(
                                            "Please Enter Your Signature Date"
                                          ),

                                        jobTitleId: Yup.string().required(
                                          "Please Select Your Job Title"
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
                                          <Card id="employee-card">
                                            <CardTitle id="course_header">
                                              {t("Job profile")}
                                            </CardTitle>
                                            <CardBody className="cardBody">
                                              {emptyError && (
                                                <Alert
                                                  color="danger"
                                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                  role="alert"
                                                >
                                                  {emptyError}
                                                  <button
                                                    type="button"
                                                    className="btn-close"
                                                    aria-label="Close"
                                                    onClick={() =>
                                                      this.handleAlertClose(
                                                        "emptyError"
                                                      )
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t("Job Information")}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Row>
                                                              <Col lg="6">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="jobNumber">
                                                                        {this.props.t(
                                                                          "Job Number"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="jobNumber"
                                                                        id="jobNumber"
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
                                                                      <Label for="ncsDate">
                                                                        {this.props.t(
                                                                          "NCS Date"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        name="ncsDate"
                                                                        className={`form-control ${
                                                                          touched.ncsDate &&
                                                                          errors.ncsDate
                                                                            ? "is-invalid"
                                                                            : ""
                                                                        }`}
                                                                        type="date"
                                                                        value={
                                                                          values.ncsDate
                                                                            ? new Date(
                                                                                values.ncsDate
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
                                                                        id="ncsDate-date-input"
                                                                      />
                                                                      <ErrorMessage
                                                                        name="ncsDate"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                {/* <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="administrativeSupervisors">
                                                                        {this.props.t(
                                                                          "Administrative Supervisor"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <input
                                                                        className={`form-control ${this.state.inputClass}`}
                                                                        list="administrativeSupervisors"
                                                                        id="administrativeSupervisor"
                                                                        placeholder="Type to search..."
                                                                        autoComplete="off"
                                                                        onChange={
                                                                          this
                                                                            .handleSelect
                                                                        }
                                                                      />
                                                                      <datalist id="administrativeSupervisors">
                                                                        {administrativeSupervisorsOpt.map(
                                                                          administrativeSupervisorOpt => (
                                                                            <option
                                                                              key={
                                                                                administrativeSupervisorOpt.Id
                                                                              }
                                                                              value={
                                                                                administrativeSupervisorOpt.arTitle
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                    </Col>
                                                                  </Row>
                                                                </div> */}
                                                              </Col>
                                                              <Col lg="6">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="jobRankId">
                                                                        {this.props.t(
                                                                          "Job Rank"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Select
                                                                        name="jobRankId"
                                                                        key={`select_jobRank`}
                                                                        options={
                                                                          jobRanksOpt
                                                                        }
                                                                        className={`form-control`}
                                                                        onChange={newValue => {
                                                                          this.handleSelect(
                                                                            "jobRankId",
                                                                            newValue.value,
                                                                            values
                                                                          );
                                                                        }}
                                                                        defaultValue={jobRanksOpt.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            contract.jobRankId
                                                                        )}
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="biometricCode">
                                                                        {this.props.t(
                                                                          "Biometric Code"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="biometricCode"
                                                                        id="biometricCode"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Contracting Type"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody>
                                                          <Row>
                                                            <Col lg="6">
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="jobTitleId">
                                                                      {this.props.t(
                                                                        "Job Title"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <input
                                                                      className={`form-control ${this.state.inputClass}`}
                                                                      list="jobTitles"
                                                                      name="jobTitleId"
                                                                      id="jobTitleId"
                                                                      placeholder="Type to search..."
                                                                      autoComplete="off"
                                                                      onChange={e =>
                                                                        this.handleSelect(
                                                                          e
                                                                            .target
                                                                            .name,
                                                                          e
                                                                            .target
                                                                            .value,
                                                                          values
                                                                        )
                                                                      }
                                                                    />
                                                                    <datalist id="jobTitles">
                                                                      {jobTitlesOpt.map(
                                                                        jobTitleOpt => (
                                                                          <option
                                                                            key={
                                                                              jobTitleOpt.Id
                                                                            }
                                                                            value={
                                                                              jobTitleOpt.arTitle
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                    </datalist>
                                                                    {jobTitleError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Job Title is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="jobTitleId"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="contractTypeId">
                                                                      {this.props.t(
                                                                        "Contract Type "
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Select
                                                                      name="contractTypeId"
                                                                      key={`select_contractType`}
                                                                      options={
                                                                        contractsTypes
                                                                      }
                                                                      className={`form-control ${
                                                                        contractTypeError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      onChange={newValue => {
                                                                        this.handleSelect(
                                                                          "contractTypeId",
                                                                          newValue.value,
                                                                          values
                                                                        );
                                                                      }}
                                                                      defaultValue={contractsTypes.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract.contractTypeId
                                                                      )}
                                                                    />
                                                                    {contractTypeError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Contract Type is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="contractTypeId"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="workClassificationId">
                                                                      {this.props.t(
                                                                        "Work Classification"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Select
                                                                      name="workClassificationId"
                                                                      key={`select_workClassification`}
                                                                      options={
                                                                        workClassifications
                                                                      }
                                                                      className={`form-control`}
                                                                      onChange={newValue => {
                                                                        this.handleSelect(
                                                                          "workClassificationId",
                                                                          newValue.value,
                                                                          values
                                                                        );
                                                                      }}
                                                                      defaultValue={workClassifications.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract.workClassification
                                                                      )}
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="hireDate">
                                                                      {this.props.t(
                                                                        "Hire Date"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="hireDate"
                                                                      className={`form-control ${
                                                                        hireDateError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      type="date"
                                                                      value={
                                                                        values.hireDate
                                                                          ? new Date(
                                                                              values.hireDate
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
                                                                      id="hireDate-date-input"
                                                                    />
                                                                    {hireDateError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Hire Date is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="academicYearId">
                                                                      {this.props.t(
                                                                        "Academic Year"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <input
                                                                      name="academicYearId"
                                                                      className={`form-control ${this.state.inputClass}`}
                                                                      list="academicYearsId"
                                                                      id="academicYearId"
                                                                      placeholder="Type to search..."
                                                                      autoComplete="off"
                                                                      onChange={e =>
                                                                        this.handleSelect(
                                                                          e
                                                                            .target
                                                                            .name,
                                                                          e
                                                                            .target
                                                                            .value,
                                                                          values
                                                                        )
                                                                      }
                                                                    />
                                                                    <datalist id="academicYearsId">
                                                                      {academicYearsOpt.map(
                                                                        academicYearOpt => (
                                                                          <option
                                                                            key={
                                                                              academicYearOpt.Id
                                                                            }
                                                                            value={
                                                                              academicYearOpt.arTitle
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                    </datalist>
                                                                    {academicYearsIdError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Academic Years is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="academicYearId"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              {/* <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="corporateNodeId">
                                                                      {this.props.t(
                                                                        "Corporate Node"
                                                                      )}
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <input
                                                                      name="corporateNodeId"
                                                                      className={`form-control ${this.state.inputClass}`}
                                                                      list="corporateNodes"
                                                                      id="corporateNodeId"
                                                                      placeholder="Type to search..."
                                                                      autoComplete="off"
                                                                      onChange={e =>
                                                                        this.handleSelect(
                                                                          e
                                                                            .target
                                                                            .name,
                                                                          e
                                                                            .target
                                                                            .value
                                                                        )
                                                                      }
                                                                    />
                                                                    <datalist id="corporateNodes">
                                                                      {corporateNodesOpt.map(
                                                                        corporateNodeOpt => (
                                                                          <option
                                                                            key={
                                                                              corporateNodeOpt.Id
                                                                            }
                                                                            value={
                                                                              corporateNodeOpt.arTitle
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                    </datalist>
                                                                    {corporateNodeError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Corporate Node is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="corporateNodeId"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div> */}
                                                              {/* <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="physicalWorkLocation">
                                                                      {this.props.t(
                                                                        "Physical Work Location"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Select
                                                                      name="physicalWorkLocation"
                                                                      key={`select_physicalWorkLocation`}
                                                                      options={
                                                                        physicalWorkLocationsOpt
                                                                      }
                                                                      onChange={newValue => {
                                                                        this.handleSelect(
                                                                          "physicalWorkLocation",
                                                                          newValue.value
                                                                        );
                                                                      }}
                                                                      defaultValue={physicalWorkLocationsOpt.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract.physicalWorkLocation
                                                                      )}
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div> */}
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="quorum">
                                                                      {this.props.t(
                                                                        "Quorum"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <div className="input-group">
                                                                      <Field
                                                                        type="text"
                                                                        name="quorum"
                                                                        id="quorum"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                      <div className="input-group-append">
                                                                        <span className="input-group-text">
                                                                          Weekly
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                            <Col lg="6">
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="employmentCaseId">
                                                                      {this.props.t(
                                                                        "Employment Case"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Select
                                                                      name="employmentCaseId"
                                                                      key={`select_employmentCase`}
                                                                      options={
                                                                        employmentCases
                                                                      }
                                                                      className={`form-control`}
                                                                      onChange={newValue => {
                                                                        this.handleSelect(
                                                                          "employmentCaseId",
                                                                          newValue.value,
                                                                          values
                                                                        );
                                                                      }}
                                                                      defaultValue={employmentCases.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract.employmentCaseId
                                                                      )}
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="contractNumber">
                                                                      {this.props.t(
                                                                        "Contract Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="contractNumber"
                                                                      type="text"
                                                                      id="contractNumber"
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
                                                                    <Label for="signatureDate">
                                                                      {this.props.t(
                                                                        "Signature Date"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="signatureDate"
                                                                      className={`form-control ${
                                                                        signatureDateError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      type="date"
                                                                      value={
                                                                        values.signatureDate
                                                                          ? new Date(
                                                                              values.signatureDate
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
                                                                      id="signatureDate-date-input"
                                                                    />
                                                                    {signatureDateError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Signature Date is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="endDate">
                                                                      {this.props.t(
                                                                        "End Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      className={`form-control`}
                                                                      name="endDate"
                                                                      type="date"
                                                                      value={
                                                                        values.endDate
                                                                          ? new Date(
                                                                              values.endDate
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
                                                                      id="endDate-date-input"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="sequenceInWorkplace">
                                                                      {this.props.t(
                                                                        "Sequence In Workplace"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      type="text"
                                                                      name="sequenceInWorkplace"
                                                                      id="sequenceInWorkplace"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                          <Col lg="12">
                                            <div className="bordered">
                                              <Col lg="12">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Ministry Information")}
                                                  </CardTitle>
                                                  <CardBody>
                                                    <Row>
                                                      <Col lg="auto">
                                                        {" "}
                                                        <Label for="ministry">
                                                          {this.props.t(
                                                            "Has Ministry Approve"
                                                          )}
                                                        </Label>
                                                      </Col>
                                                      <Col lg="2">
                                                        <div
                                                          name="hasMinistryApprove"
                                                          id="ministry"
                                                          role="group"
                                                          className={
                                                            "btn-group btn-group-example mb-3 bg-transparent"
                                                          }
                                                        >
                                                          <button
                                                            id="yes"
                                                            type="button"
                                                            name="hasMinistryApprove"
                                                            value={
                                                              selectedHasMinistryApprove ==
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedHasMinistryApprove ===
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "hasMinistryApprove",
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
                                                            name="hasMinistryApprove"
                                                            value={
                                                              selectedHasMinistryApprove ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedHasMinistryApprove ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "hasMinistryApprove",
                                                                0
                                                              )
                                                            }
                                                          >
                                                            {this.props.t("No")}
                                                          </button>
                                                        </div>
                                                      </Col>
                                                      <Col
                                                        lg="auto"
                                                        style={{
                                                          marginRight: "2rem",
                                                        }}
                                                      >
                                                        {" "}
                                                        <Label for="government">
                                                          {this.props.t(
                                                            "Government Worker"
                                                          )}
                                                        </Label>
                                                      </Col>
                                                      <Col lg="2">
                                                        <div
                                                          name="governmentWorker"
                                                          id="government"
                                                          role="group"
                                                          className={
                                                            "btn-group btn-group-example mb-3 bg-transparent"
                                                          }
                                                        >
                                                          <button
                                                            id="yes"
                                                            type="button"
                                                            name="governmentWorker"
                                                            value={
                                                              selectedGovernmentWorker ==
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedGovernmentWorker ===
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "governmentWorker",
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
                                                            name="governmentWorker"
                                                            value={
                                                              selectedGovernmentWorker ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedGovernmentWorker ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "governmentWorker",
                                                                0
                                                              )
                                                            }
                                                          >
                                                            {this.props.t("No")}
                                                          </button>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </Col>
                                            </div>
                                          </Col>
                                          <Row>
                                            <Col>
                                              <div className="text-center">
                                                <Link
                                                  to="#"
                                                  className="btn btn-primary me-2"
                                                  onClick={() => {
                                                    this.handleSubmit(values);
                                                  }}
                                                >
                                                  {t("Save")}
                                                </Link>
                                              </div>
                                            </Col>
                                          </Row>
                                        </Form>
                                      )}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <Modal
                                      isOpen={modal3}
                                      className={this.props.className}
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle3}
                                        tag="h4"
                                      >
                                        {/* {!!isView &&
                                          (languageState === "ar"
                                            ? `${employee.firstName} ${employee.fatherName} ${employee.lastName}`
                                            : `${employee.firstNameE} ${employee.fatherNameE} ${employee.lastNameE}`)} */}
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
                                            <h2 className="employee-info">
                                              {languageState === "ar"
                                                ? `${
                                                    this.state.employee
                                                      ?.firstName || ""
                                                  } ${
                                                    this.state.employee
                                                      ?.fatherName || ""
                                                  } ${
                                                    this.state.employee
                                                      ?.lastName || ""
                                                  }`
                                                : `${
                                                    this.state.employee
                                                      ?.firstNameE || ""
                                                  } ${
                                                    this.state.employee
                                                      ?.fatherNameE || ""
                                                  } ${
                                                    this.state.employee
                                                      ?.lastNameE || ""
                                                  }`}
                                            </h2>
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this
                                                      .handleEmployeeInformation
                                                  }
                                                  style={{
                                                    color: showEmployeeData
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Employee Data File"
                                                  )}
                                                </a>
                                              </li>{" "}
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={this.handleDecision}
                                                  style={{
                                                    color: showDecision
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Decision File"
                                                  )}
                                                </a>
                                              </li>
                                            </ul>
                                          </div>

                                          <div className="modal-content">
                                            {showEmployeeData && (
                                              <div>
                                                <Card className="bordered">
                                                  <CardHeader className="card-header">
                                                    <h4>
                                                      <i className="fas fa-user-circle" />{" "}
                                                      {languageState === "ar"
                                                        ? employee.firstName +
                                                          " " +
                                                          employee.fatherName +
                                                          " " +
                                                          employee.lastName
                                                        : employee.firstNameE +
                                                          " " +
                                                          employee.fatherNameE +
                                                          " " +
                                                          employee.lastNameE}
                                                    </h4>
                                                  </CardHeader>
                                                  <CardBody className="cardBody">
                                                    {emptyError && (
                                                      <Alert
                                                        color="danger"
                                                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                        role="alert"
                                                      >
                                                        {emptyError}
                                                        <button
                                                          type="button"
                                                          className="btn-close"
                                                          aria-label="Close"
                                                          onClick={() =>
                                                            this.handleAlertClose(
                                                              "emptyError"
                                                            )
                                                          }
                                                        ></button>
                                                      </Alert>
                                                    )}
                                                    <Row>
                                                      <Col lg="5">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardTitle id="card_header">
                                                                {t(
                                                                  "Arabic Information"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="cardBody">
                                                                <Row>
                                                                  <Col lg="12">
                                                                    <div className="mb-2">
                                                                      <Label for="arfirstName">
                                                                        {this.props.t(
                                                                          "First Name(ar)"
                                                                        )}{" "}
                                                                        :
                                                                      </Label>

                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.firstName
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="arlastName">
                                                                        {this.props.t(
                                                                          "Last Name(ar)"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.lastName
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="arfatherName">
                                                                        {this.props.t(
                                                                          "Father Name(ar)"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.fatherName
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="argrandFatherName">
                                                                        {this.props.t(
                                                                          "Grandfather Name ar"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.grandFatherName
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="armotherName">
                                                                        {this.props.t(
                                                                          "Mother Name(ar)"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.motherName
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                      <Col lg="5">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardTitle id="card_header">
                                                                {t(
                                                                  "English Information"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="cardBody">
                                                                <Row>
                                                                  <Col lg="12">
                                                                    <div className="mb-2">
                                                                      <Label for="enfirstName">
                                                                        {this.props.t(
                                                                          "First Name"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.firstNameE
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="enlastName">
                                                                        {this.props.t(
                                                                          "Last Name"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.lastNameE
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="enfatherName">
                                                                        {this.props.t(
                                                                          "Father Name"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.fatherNameE
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="enGrandFatherName">
                                                                        {this.props.t(
                                                                          "Grandfather Name"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.grandFatherNameE
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="enMotherName">
                                                                        {this.props.t(
                                                                          "Mother Name"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.motherNameE
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                      <Col lg="2">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <div className="mb-1">
                                                              <Card
                                                                style={{
                                                                  width:
                                                                    "12rem",
                                                                }}
                                                              >
                                                                <CardTitle id="card_header">
                                                                  {t(
                                                                    "Personal Photo"
                                                                  )}
                                                                </CardTitle>
                                                                <img
                                                                  src={
                                                                    this.state
                                                                      .photoURL
                                                                  }
                                                                />
                                                                <CardBody className="cardBody">
                                                                  <Row></Row>
                                                                </CardBody>
                                                              </Card>
                                                            </div>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col lg="4">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardTitle id="card_header">
                                                                {t(
                                                                  "Basic Information"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="card_Body">
                                                                <Row>
                                                                  <Col lg="12">
                                                                    <div className="mb-2">
                                                                      <Label for="arbirthLoc">
                                                                        {this.props.t(
                                                                          "Birth Location(ar)"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.birthLocation
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="birthDate">
                                                                        {this.props.t(
                                                                          "Date of Birth"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.birthDate &&
                                                                          new Date(
                                                                            employee.birthDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="age">
                                                                        {this.props.t(
                                                                          "Age"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.age
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label className="form-label">
                                                                        {this.props.t(
                                                                          "Gender"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          (
                                                                            genders.find(
                                                                              opt =>
                                                                                opt.value ===
                                                                                employee.genderId
                                                                            ) ||
                                                                            ""
                                                                          )
                                                                            .label
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="nationalityId">
                                                                        {this.props.t(
                                                                          "Nationality"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          (
                                                                            nationalitiesOpt.find(
                                                                              opt =>
                                                                                opt.value ===
                                                                                employee.nationalityId
                                                                            ) ||
                                                                            ""
                                                                          )
                                                                            .label
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                      <Col lg="4">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardTitle id="card_header">
                                                                {t(
                                                                  "National Card Information"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="card_Body">
                                                                <Row>
                                                                  <Col lg="12">
                                                                    <div className="mb-2">
                                                                      <Label for="idNum">
                                                                        {this.props.t(
                                                                          "ID Number"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.idNumber
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="cardNum">
                                                                        {this.props.t(
                                                                          "Card Number"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.perosonalCardNum
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="perosonalCardGrantDate">
                                                                        {this.props.t(
                                                                          "Grant Date"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.perosonalCardGrantDate &&
                                                                          new Date(
                                                                            employee.perosonalCardGrantDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="perosonalCardExpirationDate">
                                                                        {this.props.t(
                                                                          "End Date"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.perosonalCardExpirationDate &&
                                                                          new Date(
                                                                            employee.perosonalCardExpirationDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="cardCaza">
                                                                        {this.props.t(
                                                                          "Amana Num"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.amanaNum
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="cardCazaReg">
                                                                        {this.props.t(
                                                                          "Place of Registration"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.registrationPlace
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="cardRegNum">
                                                                        {this.props.t(
                                                                          "Number of Registration"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.registrationNum
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                      <Col lg="4">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardTitle id="card_header">
                                                                {t(
                                                                  "Passport and residence information"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="card_Body">
                                                                <Row>
                                                                  <Col lg="12">
                                                                    <div className="mb-2">
                                                                      <Label for="passNum">
                                                                        {this.props.t(
                                                                          "Passport Number"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.passNumber
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="passGrantdate">
                                                                        {this.props.t(
                                                                          "Grant Date"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.passportGrantDate &&
                                                                          new Date(
                                                                            employee.passportGrantDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="passExpDate">
                                                                        {this.props.t(
                                                                          "Expiration Date"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.passportExpirationDate &&
                                                                          new Date(
                                                                            employee.passportExpirationDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="residence">
                                                                        {this.props.t(
                                                                          "Residence Number"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.residenceNum
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="resGrantDate">
                                                                        {this.props.t(
                                                                          "Residence Granted Date"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.residenceGrantedDate &&
                                                                          new Date(
                                                                            employee.residenceGrantedDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="resExpirationDate">
                                                                        {this.props.t(
                                                                          "Residence Expiration Date"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {employee?.resExpirationDate &&
                                                                          new Date(
                                                                            employee.resExpirationDate
                                                                          ).toLocaleDateString()}
                                                                      </Label>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col lg="12">
                                                        <div className="bordered">
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardTitle id="card_header">
                                                                {t(
                                                                  "Contact Information"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="card_Body">
                                                                <div className="mb-3">
                                                                  <Label for="countryId">
                                                                    {this.props.t(
                                                                      "Country"
                                                                    )}
                                                                    {""}:
                                                                  </Label>

                                                                  <Label className="left-label">
                                                                    {
                                                                      (
                                                                        countries.find(
                                                                          countryOpt =>
                                                                            countryOpt.value ===
                                                                            employee?.countryId
                                                                        ) || {}
                                                                      ).label
                                                                    }
                                                                  </Label>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Label for="stateId">
                                                                    {this.props.t(
                                                                      "State"
                                                                    )}
                                                                    {""}:
                                                                  </Label>
                                                                  <Label className="left-label">
                                                                    {
                                                                      (
                                                                        governorates.find(
                                                                          state =>
                                                                            state.value ===
                                                                            employee.stateId
                                                                        ) || {}
                                                                      ).value
                                                                    }
                                                                  </Label>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Label for="cityId">
                                                                    {this.props.t(
                                                                      "City"
                                                                    )}
                                                                    {""}:
                                                                  </Label>
                                                                  <Label className="left-label">
                                                                    {
                                                                      (
                                                                        cities.find(
                                                                          city =>
                                                                            city.value ===
                                                                            employee.cityId
                                                                        ) || {}
                                                                      ).value
                                                                    }
                                                                  </Label>
                                                                </div>
                                                                <Row>
                                                                  <Col lg="6">
                                                                    <div className="mb-2">
                                                                      <Label for="permanentAddress">
                                                                        {this.props.t(
                                                                          "Permanent Address (Full Details)"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.permanentAddress
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-2">
                                                                      <Label for="phoneNumber">
                                                                        {this.props.t(
                                                                          "Phone Number"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.phoneNumber
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                      <Label for="email">
                                                                        {this.props.t(
                                                                          "Email Address"
                                                                        )}
                                                                        {""}:
                                                                      </Label>
                                                                      <Label className="left-label">
                                                                        {
                                                                          employee.email
                                                                        }
                                                                      </Label>
                                                                    </div>
                                                                  </Col>
                                                                  <Col lg="6">
                                                                    <Col lg="12">
                                                                      <Row>
                                                                        <Col lg="12">
                                                                          <div className="mb-2">
                                                                            <Label for="temporaryAddress">
                                                                              {this.props.t(
                                                                                "Temporary Address (if applicable)"
                                                                              )}
                                                                              {
                                                                                ""
                                                                              }
                                                                              :
                                                                            </Label>
                                                                            <Label className="left-label">
                                                                              {
                                                                                employee.temporaryAddress
                                                                              }
                                                                            </Label>
                                                                          </div>
                                                                          <div className="mb-2">
                                                                            <Label for="mobileNumber">
                                                                              {this.props.t(
                                                                                "Mobile Phone Number"
                                                                              )}
                                                                              {
                                                                                ""
                                                                              }
                                                                              :
                                                                            </Label>
                                                                            <Label className="left-label">
                                                                              {
                                                                                employee.mobileNumber
                                                                              }
                                                                            </Label>
                                                                          </div>
                                                                          <div className="mb-2">
                                                                            <Label for="whatsAppNumber">
                                                                              {this.props.t(
                                                                                "WhatsApp Number"
                                                                              )}
                                                                              {
                                                                                ""
                                                                              }
                                                                              :
                                                                            </Label>
                                                                            <Label className="left-label">
                                                                              {
                                                                                employee.whatsAppNumber
                                                                              }
                                                                            </Label>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Col>
                                                                </Row>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </div>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  employees,
  menu_items,
  contracts,
  contractsTypes,
  employmentCases,
  workClassifications,
  countries,
  governorates,
  cities,
}) => ({
  employees: employees.employees,
  deleted: employees.deleted,
  nationalitiesOpt: employees.nationalitiesOpt || [],
  // administrativeSupervisorsOpt: employees.administrativeSupervisorsOpt || [],
  workClassifications: workClassifications.workClassifications || [],
  // physicalWorkLocationsOpt: employees.physicalWorkLocationsOpt || [],
  jobRanksOpt: employees.jobRanksOpt || [],
  jobTitlesOpt: employees.jobTitlesOpt || [],
  // corporateNodesOpt: employees.corporateNodesOpt || [],
  genders: employees.genders,
  academicYearsOpt: employees.academicYearsOpt,
  countries: countries.countries,
  governorates: governorates.governorates,
  cities: cities.cities,
  contractsTypes: contractsTypes.contractsTypes,
  employmentCases: employmentCases.employmentCases,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetEmployees: lng => dispatch(getEmployees(lng)),
  // onGetAdministrativeSupervisorsOpt: () =>
  //   dispatch(getAdministrativeSupervisorsOpt()),
  // onGetPhysicalWorkLocationsOpt: () => dispatch(getPhysicalWorkLocationsOpt()),
  onGetJobRanksOpt: () => dispatch(getJobRanksOpt()),
  onGetJobTitlesOpt: () => dispatch(getJobTitlesOpt()),
  // onGetCorporateNodesOpt: () => dispatch(getCorporateNodesOpt()),
  onGetAcademicYearsOpt: () => dispatch(getAcademicYearsOpt()),
  onGetContracts: () => dispatch(getContracts()),
  onAddNewEmployee: employee => dispatch(addNewEmployee(employee)),
  onAddNewContract: contract => dispatch(addNewContract(contract)),
  onUpdateEmployee: employee => dispatch(updateEmployee(employee)),
  onUpdateContract: contract => dispatch(updateContract(contract)),
  onDeleteEmployee: employee => dispatch(deleteEmployee(employee)),
  onGetEmployeeDeletedValue: () => dispatch(getEmployeeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(EmployeesList)));
