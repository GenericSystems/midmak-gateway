import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardTitle,
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
  getContracts,
  addNewContract,
  updateContract,
  deleteContract,
  getContractDeletedValue,
} from "store/HR/contracts/actions";
import {
  // getAdministrativeSupervisorsOpt,
  getJobRanksOpt,
  getCorporateNodesOpt,
  getJobTitlesOpt,
  getPhysicalWorkLocationsOpt,
  getAcademicYearsOpt,
} from "store/HR/employees/actions";
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
import academicLoadSaga from "store/academicloads/saga";
class ContractsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      contracts: [],
      contract: "",
      employee: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      selectedWorkClassification: null,
      selectedJobTitle: null,
      jobTitleName: "",
      selectedCostCenter: null,
      selectedJobRank: null,
      selectedHasMinistryApprove: null,
      selectedGovernmentWorker: null,
      selectedFullName: null,
      selectedContractType: null,
      employeeFullName: "",
      signatureDateError: false,
      hireDateError: false,
      fullNameError: false,
      contractTypeError: false,
      academicYearsIdError: false,
      jobTitleError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      modalContractValue: [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      contracts,
      onGetContracts,
      genders,
      nationalitiesOpt,
      contractsTypes,
      employmentCases,
      deleted,
      onGetJobTitlesOpt,
      onGetJobRanksOpt,
      onGetAcademicYearsOpt,
      jobRanksOpt,
      workClassifications,
      academicYearsOpt,
      employeesNames,
      jobTitlesOpt,
      user_menu,
      employees,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (contract && !contracts.length) {
    //   onGetContracts();
    // }
    onGetContracts();
    onGetJobTitlesOpt();
    onGetJobRanksOpt();
    onGetAcademicYearsOpt();
    this.setState({
      contracts,
      deleted,
      jobRanksOpt,
      jobTitlesOpt,
      workClassifications,
      contractsTypes,
      employmentCases,
      academicYearsOpt,
      employeesNames,
      nationalitiesOpt,
      genders,
    });
    const fullNamesOpt = this.state;
    this.setState({ fullNamesOpt: employees });

    console.log("rsssssssssssssss", contracts);
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
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
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

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      contract: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteContract } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      let onDelete = { Id: selectedRowId.Id };
      onDeleteContract(onDelete);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName === "hasMinistryApprove") {
      this.setState({ selectedHasMinistryApprove: option });
    }

    if (fieldName === "governmentWorker") {
      this.setState({ selectedGovernmentWorker: option });
    }
  };

  handleSubmit = values => {
    const {
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
      isEdit,
      isAdd,
      selectEmpId,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      selectedFullName,
      fullNamesOpt,
    } = this.state;
    const { onAddNewContract, onUpdateContract } = this.props;

    //values["administrativeSupervisor"] = selectedAdministrativeSupervisor;
    // values["physicalWorkLocation"] = selectedPhysicalWorkLocations;
    // values["employeeId"] = selectEmpId;

    values["jobRankId"] = selectedJobRank;
    values["jobTitleId"] = selectedJobTitle;
    // values["corporateNodeId"] = selectedCorporateNode;
    values["contractTypeId"] = selectedContractType;
    values["employeeId"] = selectedFullName;
    values["employmentCaseId"] = selectedEmploymentCase;
    values["hasMinistryApprove"] = selectedHasMinistryApprove;
    values["governmentWorker"] = selectedGovernmentWorker;
    values["workClassificationId"] = selectedWorkClassification;
    values["academicYearId"] = selectedAcademicYearId;
    console.log("valuesssssssssssssssssssss", values);

    let contractInfo = {};
    // if (values.employeeId) {
    //   const nameObject = fullNamesOpt.find(
    //     fullName => fullName.value === values.employeeId
    //   );
    //   console.log("nameObject", nameObject);
    //   values["employeeId"] = nameObject.key;
    // }
    // console.log("valuesssssssssssssssssssss", values);
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
      selectedEmploymentCase !== null &&
      selectedFullName !== null
    ) {
      console.log("selectedFullName", selectedFullName);
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", contractInfo);
        contractInfo[key] = values[key];
      });
      if (isEdit) {
        console.log("9999999", contractInfo);
        onUpdateContract(contractInfo);
      } else {
        onAddNewContract(contractInfo);
      }
      this.setState({
        errorMessages: {},
      });
      this.toggle();
    } else {
      let emptyError = "";
      // if (selectedAdministrativeSupervisor === undefined) {
      //   emptyError = "Fill the empty select";
      // }
      // if (selectedPhysicalWorkLocations === undefined) {
      //   emptyError = "Fill the empty select";
      // }
      if (selectedJobTitle === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedNcsDate === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedContractType === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedAcademicYearId === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedHireDate === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedSignatureDate === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedFullName === undefined) {
        emptyError = "Fill the empty select";
      }
      // if (selectedCorporateNode === undefined) {
      //   emptyError = "Fill the empty select";
      // }
      this.setState({ emptyError: emptyError });
    }
  };

  handleSelect = (fieldName, selectedValue) => {
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
      });
    }
    if (fieldName == "contractTypeId") {
      this.setState({
        selectedContractType: selectedValue,
      });
    }
    if (fieldName == "employmentCaseId") {
      this.setState({
        selectedEmploymentCase: selectedValue,
      });
    }
    if (fieldName == "workClassificationId") {
      this.setState({
        selectedWorkClassification: selectedValue,
      });
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

  handleSelectDatalist = e => {
    const selectedValue = e.target.value;
    if (fieldName === "jobTitleId") {
      const selected = this.props.jobTitlesOpt.find(
        job => job.value === selectedValue
      );

      this.setState({
        selectedJobTitle: selected ? selected.key : null,
        jobTitleName: selectedValue,
      });
    }

    if (fieldName === "employeeId") {
      const selected = this.props.employeesNames.find(
        employeeName => employeeName.value === selectedValue
      );

      this.setState({
        selectedFullName: selected ? selected.key : null,
        employeeFullName: selectedValue,
      });
    }

    if (fieldName === "academicYearId") {
      const selected = this.props.academicYearsOpt.find(
        aYear => aYear.value === selectedValue
      );
      this.setState({
        selectedAcademicYearId: selected ? selected.key : null,
        academicYear: selectedValue,
      });

      return;
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetContractDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetContractDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetContractDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetContractDeletedValue();
  };

  handleContractClick = arg => {
    console.log("arg", arg);

    this.setState({
      contract: arg,
      selectedFullName: arg.employeeId,
      employeeFullName: arg.employeeName,
      selectedJobRank: arg.jobRankId,
      selectedJobTitle: arg.jobTitleId,
      jobTitleName: arg.jobTitle,
      selectedCorporateNode: arg.corporateNodeId,
      selectedContractType: arg.contractTypeId,
      selectedEmploymentCase: arg.employmentCaseId,
      selectedHasMinistryApprove: arg.hasMinistryApprove,
      selectedGovernmentWorker: arg.governmentWorker,
      selectedWorkClassification: arg.workClassificationId,
      selectedAcademicYearId: arg.academicYearId,
      academicYear: arg.academicYear,
      isEdit: true,
      isOpen: false,
    });
    this.toggle();
  };

  handleEmployeeDataClick = contract => {
    console.log("arg", contract);

    this.setState({
      isOpen: true,
      selectConId: contract.Id,
      modalContractValue: contract,
    });
    this.toggle2();
  };
  testselected = val => {
    console.log(val, "vvvvvvvvvvvvvvvvvv");
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  render() {
    const contract = this.state.contract;
    const employee = this.state.employee;
    const {
      contracts,
      t,
      deleted,
      contractsTypes,
      employmentCases,
      genders,
      nationalitiesOpt,
      employeesNames,
      administrativeSupervisorsOpt,
      workClassifications,
      physicalWorkLocationsOpt,
      jobRanksOpt,
      jobTitlesOpt,
      corporateNodesOpt,
      costCentersOpt,
      academicYearsOpt,
      employees,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      modal,
      modal2,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,
      contractTypeError,
      academicYearsIdError,
      jobTitleError,
      signatureDateError,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      selectedFullName,
      selectedJobTitle,
      selectedAcademicYearId,
      selectedContractType,
      selectedWorkClassification,
      selectedEmploymentCase,
      hireDateError,
      fullNameError,
      ncsDateError,
      corporateNodeError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      modalContractValue,
      fullNamesOpt,
    } = this.state;
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
        dataField: "jobNumber",
        text: this.props.t("Job Number"),
        sort: true,
        editable: false,
      },
      {
        dataField: "ncsDate",
        text: this.props.t("NCS Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.ncsDate),
      },
      {
        dataField: "employeeName",
        text: this.props.t("Full Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "position",
        text: this.props.t("Position"),
        sort: true,
        editable: false,
      },
      {
        dataField: "jobTitle",
        text: this.props.t("Job Title"),
        sort: true,
        editable: false,
      },
      {
        dataField: "corporateNode",
        text: this.props.t("Corporate Node"),
        sort: true,
        editable: false,
      },
      {
        dataField: "contractName",
        text: this.props.t("Contract Type "),
        sort: true,
        editable: false,
      },
      {
        dataField: "workClassification",
        text: this.props.t("Work Classification"),
        sort: true,
        editable: false,
      },
      {
        dataField: "status",
        text: this.props.t("Status"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, contract) => (
          <div className="d-flex gap-3">
            <Tooltip
              title={this.props.t("View Employee Information")}
              placement="top"
            >
              <Link className="text-sm-end" to="#">
                <i
                  className="fas fa-male font-size-18"
                  id="viewtooltip"
                  onClick={() => this.handleEmployeeDataClick(contract)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleContractClick(contract)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(contract)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: contracts.length,
      custom: true,
    };
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("Contracts")} />
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
                        columns={columns}
                        data={contracts}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={contracts}
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
                                  data={contracts}
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
                                      row.Id, column.dataField, newValue;
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Contracts found"
                                  )}
                                  defaultSorted={defaultSorting}
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
                                      ? t("Edit Contract Data")
                                      : t("Add Contract Data")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          contract && {
                                            Id: contract.Id,
                                          }),
                                        employeeId:
                                          (contract && contract.employeeId) ||
                                          selectedFullName,
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
                                          selectedContractType,
                                        contractNumber:
                                          (contract &&
                                            contract.contractNumber) ||
                                          "",
                                        jobTitleId:
                                          (contract && contract.jobTitleId) ||
                                          selectedJobTitle,
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
                                        hireDate: contract?.hireDate
                                          ? moment
                                              .utc(contract.hireDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        signatureDate: contract?.signatureDate
                                          ? moment
                                              .utc(contract.signatureDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        endDate: contract?.endDate
                                          ? moment
                                              .utc(contract.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        ncsDate: contract?.ncsDate
                                          ? moment
                                              .utc(contract.ncsDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        // administrativeSupervisor:
                                        //   (contract &&
                                        //     contract.administrativeSupervisor) ||
                                        //   "",
                                        jobRankId: contract?.jobRankId || "",
                                        workClassificationId:
                                          (contract &&
                                            contract.workClassificationId) ||
                                          selectedWorkClassification,
                                        academicYearId:
                                          (contract &&
                                            contract.academicYearId) ||
                                          selectedAcademicYearId,
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
                                          selectedEmploymentCase,
                                      }}
                                      validationSchema={Yup.object().shape({
                                        contratType: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Contrat Type"
                                          ),
                                        ncsDate: Yup.string().required(
                                          t("Please Enter Your NCS Date")
                                        ),
                                        hireDate: Yup.string().required(
                                          t("Please Enter Your Hire Date")
                                        ),
                                        academicYearId: Yup.string().required(
                                          t("Please Enter Your Academic Year")
                                        ),
                                        jobTitleId: Yup.string().required(
                                          t("Please Enter Your Job Title")
                                        ),
                                        // corporateNodeId: Yup.string().required(
                                        //   t("Please Enter Your Corporate Node")
                                        // ),

                                        signatureDate: Yup.string().required(
                                          t("Please Enter Your Signature Date")
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
                                                    onClick={
                                                      this.handleAlertClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="12">
                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col className="col-4">
                                                        <Label for="fullName-Id">
                                                          {this.props.t(
                                                            "Full Name"
                                                          )}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </Col>
                                                      <Col className="col-8">
                                                        <Field
                                                          name="employeeId"
                                                          as="input"
                                                          id="fullName-Id"
                                                          type="text"
                                                          placeholder="Search..."
                                                          className={
                                                            "form-control" +
                                                            (errors.employeeId &&
                                                            touched.employeeId
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          value={
                                                            employeesNames.find(
                                                              empl =>
                                                                empl.key ===
                                                                this.state
                                                                  .selectedFullName
                                                            )?.value || ""
                                                          }
                                                          onChange={e => {
                                                            const newValue =
                                                              e.target.value;

                                                            const selectedEmployee =
                                                              employeesNames.find(
                                                                empl =>
                                                                  empl.value ===
                                                                  newValue
                                                              );

                                                            if (
                                                              selectedEmployee
                                                            ) {
                                                              this.setState({
                                                                selectedFullName:
                                                                  selectedEmployee.key,
                                                                employeeFullName:
                                                                  selectedEmployee.value,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                selectedFullName:
                                                                  null,
                                                                employeeFullName:
                                                                  newValue,
                                                              });
                                                            }
                                                          }}
                                                          list="fullNames"
                                                          autoComplete="off"
                                                        />

                                                        <datalist id="fullNames">
                                                          {employeesNames.map(
                                                            employeesName => (
                                                              <option
                                                                key={
                                                                  employeesName.key
                                                                }
                                                                value={
                                                                  employeesName.value
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        {fullNameError && (
                                                          <div className="invalid-feedback">
                                                            {this.props.t(
                                                              "Full Name is required"
                                                            )}
                                                          </div>
                                                        )}
                                                        <ErrorMessage
                                                          name="fullName-Id"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                </Col>
                                              </Row>
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
                                                                          ncsDateError
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
                                                                      {ncsDateError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "NCS Date is required"
                                                                          )}
                                                                        </div>
                                                                      )}
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
                                                                            newValue.value
                                                                          );
                                                                        }}
                                                                        defaultValue={jobRanksOpt.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            contract?.jobRankId
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
                                                                    <Field
                                                                      name="jobTitleId"
                                                                      as="input"
                                                                      id="jobTitleId"
                                                                      type="text"
                                                                      placeholder="Search..."
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.jobTitleId &&
                                                                        touched.jobTitleId
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      value={
                                                                        jobTitlesOpt.find(
                                                                          job =>
                                                                            job.key ===
                                                                            this
                                                                              .state
                                                                              .selectedJobTitle
                                                                        )
                                                                          ?.value ||
                                                                        ""
                                                                      }
                                                                      onChange={e => {
                                                                        const newValue =
                                                                          e
                                                                            .target
                                                                            .value;

                                                                        const selectedJob =
                                                                          jobTitlesOpt.find(
                                                                            job =>
                                                                              job.value ===
                                                                              newValue
                                                                          );

                                                                        if (
                                                                          selectedJob
                                                                        ) {
                                                                          this.setState(
                                                                            {
                                                                              selectedJobTitle:
                                                                                selectedJob.key,
                                                                              jobTitleName:
                                                                                selectedJob.value,
                                                                            }
                                                                          );
                                                                        } else {
                                                                          this.setState(
                                                                            {
                                                                              selectedJobTitle:
                                                                                null,
                                                                              jobTitleName:
                                                                                newValue,
                                                                            }
                                                                          );
                                                                        }
                                                                      }}
                                                                      list="jobTitles"
                                                                      autoComplete="off"
                                                                    />

                                                                    <datalist id="jobTitles">
                                                                      {jobTitlesOpt.map(
                                                                        jobTitle => (
                                                                          <option
                                                                            key={
                                                                              jobTitle.key
                                                                            }
                                                                            value={
                                                                              jobTitle.value
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
                                                                          newValue.value
                                                                        );
                                                                      }}
                                                                      defaultValue={contractsTypes.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract?.contractTypeId
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
                                                                          newValue.value
                                                                        );
                                                                      }}
                                                                      defaultValue={workClassifications.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract?.workClassificationId
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
                                                                    <Field
                                                                      name="academicYearId"
                                                                      as="input"
                                                                      id="academicYearId"
                                                                      type="text"
                                                                      placeholder="Search..."
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.academicYearId &&
                                                                        touched.academicYearId
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      value={
                                                                        academicYearsOpt.find(
                                                                          academic =>
                                                                            academic.key ===
                                                                            this
                                                                              .state
                                                                              .selectedAcademicYearId
                                                                        )
                                                                          ?.value ||
                                                                        ""
                                                                      }
                                                                      onChange={e => {
                                                                        const newValue =
                                                                          e
                                                                            .target
                                                                            .value;

                                                                        const selectedAcademic =
                                                                          academicYearsOpt.find(
                                                                            academic =>
                                                                              academic.value ===
                                                                              newValue
                                                                          );

                                                                        if (
                                                                          selectedAcademic
                                                                        ) {
                                                                          this.setState(
                                                                            {
                                                                              selectedAcademicYearId:
                                                                                selectedAcademic.key,
                                                                              academicYear:
                                                                                selectedAcademic.value,
                                                                            }
                                                                          );
                                                                        } else {
                                                                          this.setState(
                                                                            {
                                                                              selectedAcademicYearId:
                                                                                null,
                                                                              academicYear:
                                                                                newValue,
                                                                            }
                                                                          );
                                                                        }
                                                                      }}
                                                                      list="academicYearsId"
                                                                      autoComplete="off"
                                                                    />

                                                                    <datalist id="academicYearsId">
                                                                      {academicYearsOpt.map(
                                                                        academicYear => (
                                                                          <option
                                                                            key={
                                                                              academicYear.key
                                                                            }
                                                                            value={
                                                                              academicYear.value
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
                                                                          newValue.value
                                                                        );
                                                                      }}
                                                                      defaultValue={employmentCases.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          contract?.employmentCaseId
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
                                <Modal
                                  isOpen={modal2}
                                  toggle={this.toggle2}
                                  className={"modal-fullscreen"}
                                >
                                  <ModalHeader toggle={this.toggle2} tag="h4">
                                    {!!isOpen ? t("View Employee Data") : ""}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Card id="employee-card">
                                      <CardTitle id="course_header">
                                        {t("Employee Data")}
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
                                              onClick={this.handleAlertClose}
                                            ></button>
                                          </Alert>
                                        )}
                                        <Row>
                                          <Col lg="5">
                                            <div className="bordered">
                                              <Col lg="12">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Personl Information")}
                                                  </CardTitle>
                                                  <CardBody className="card_Body1">
                                                    <Row>
                                                      <Col lg="12">
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Name"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.employeeName
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Mother Name"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.motherName
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Birth Date"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {modalContractValue?.birthDate &&
                                                              new Date(
                                                                modalContractValue.birthDate
                                                              ).toLocaleDateString()}
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "ID Number"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.idNumber
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Gender"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              (
                                                                genders.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    modalContractValue.genderId
                                                                ) || ""
                                                              ).label
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Nationality"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              (
                                                                nationalitiesOpt.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    modalContractValue.nationalityId
                                                                ) || ""
                                                              ).label
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
                                                    {t("Job Information")}
                                                  </CardTitle>
                                                  <CardBody className="card_Body1">
                                                    <Row>
                                                      <Col lg="12">
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Job Number"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.jobNumber
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Contract Number"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.contractNumber
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Signature Date"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {modalContractValue?.signatureDate &&
                                                              new Date(
                                                                modalContractValue.signatureDate
                                                              ).toLocaleDateString()}
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "End Date"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {modalContractValue?.endDate &&
                                                              new Date(
                                                                modalContractValue.endDate
                                                              ).toLocaleDateString()}
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "ID Number"
                                                            )}
                                                            {""}:
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.idNumber
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Job Title"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {/* {modalContractValue.jobTitleId
                                                              ? jobTitlesOpt.find(
                                                                  jobTitleOpt =>
                                                                    jobTitleOpt.key ===
                                                                      modalContractValue.jobTitleId ||
                                                                    ""
                                                                ).arTitle
                                                              : ""} */}
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Position"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.position
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Corporate Node"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {/* {modalContractValue.corporateNodeId
                                                              ? corporateNodesOpt.find(
                                                                  corporateNodeOpt =>
                                                                    corporateNodeOpt.key ===
                                                                      modalContractValue.corporateNodeId ||
                                                                    ""
                                                                ).arTitle
                                                              : ""} */}
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Work Classification"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              (
                                                                workClassifications.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    modalContractValue.workClassificationId
                                                                ) || ""
                                                              ).label
                                                            }
                                                          </Label>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {
                                                              modalContractValue.status
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
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Personal Photo")}
                                                  </CardTitle>
                                                  <CardBody className="cardBody">
                                                    <Row></Row>
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
                                                    {t("View Employee Contact")}
                                                  </CardTitle>
                                                  <CardBody className="cardBody">
                                                    <Row>
                                                      <div className="mb-2">
                                                        <Label className="right-label">
                                                          {this.props.t(
                                                            "Phone Number"
                                                          )}{" "}
                                                          :
                                                        </Label>
                                                        <Label className="left-label">
                                                          {
                                                            modalContractValue.phoneNumber
                                                          }
                                                        </Label>
                                                      </div>
                                                      <div className="mb-2">
                                                        <Label className="right-label">
                                                          {this.props.t(
                                                            "Mobile Phone Number"
                                                          )}{" "}
                                                          :
                                                        </Label>
                                                        <Label className="left-label">
                                                          {
                                                            modalContractValue.mobileNumber
                                                          }
                                                        </Label>
                                                      </div>
                                                      <div className="mb-2">
                                                        <Label className="right-label">
                                                          {this.props.t(
                                                            "Email Address"
                                                          )}{" "}
                                                          :
                                                        </Label>
                                                        <Label className="left-label">
                                                          {
                                                            modalContractValue.email
                                                          }
                                                        </Label>
                                                      </div>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </Col>
                                            </div>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </ModalBody>
                                </Modal>
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
  contracts,
  menu_items,
  employees,
  employmentCases,
  contractsTypes,
  workClassifications,
}) => ({
  // administrativeSupervisorsOpt: employees.administrativeSupervisorsOpt || [],
  workClassifications: workClassifications.workClassifications || [],
  // physicalWorkLocationsOpt: employees.physicalWorkLocationsOpt || [],
  jobRanksOpt: employees.jobRanksOpt || [],
  jobTitlesOpt: employees.jobTitlesOpt || [],
  // corporateNodesOpt: employees.corporateNodesOpt || [],
  genders: employees.genders,
  nationalitiesOpt: employees.nationalitiesOpt,
  academicYearsOpt: employees.academicYearsOpt,
  contractsTypes: contractsTypes.contractsTypes,
  employmentCases: employmentCases.employmentCases,
  contracts: contracts.contracts,
  genders: employees.genders,
  employeesNames: employees.employeesNames,
  employees: employees.employees,
  deleted: contracts.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetContracts: () => dispatch(getContracts()),
  onAddNewContract: contract => dispatch(addNewContract(contract)),
  onUpdateContract: contract => dispatch(updateContract(contract)),
  onDeleteContract: contract => dispatch(deleteContract(contract)),
  onGetContractDeletedValue: () => dispatch(getContractDeletedValue()),
  onGetJobRanksOpt: () => dispatch(getJobRanksOpt()),
  onGetJobTitlesOpt: () => dispatch(getJobTitlesOpt()),
  onGetAcademicYearsOpt: () => dispatch(getAcademicYearsOpt()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ContractsList)));
