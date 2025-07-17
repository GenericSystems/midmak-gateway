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
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  Table,
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
  getDefineExamDates,
  addNewDefineExamDate,
  updateDefineExamDate,
  deleteDefineExamDate,
  getDefineExamDateDeletedValue,
} from "store/Exam/DefineExamDates/actions";
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
class DefineExamDatesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      defineExamDates: [],
      defineExamDate: "",
      employee: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      newStartTime: "",
      newEndTime: "",
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
      selectedExamType: "",
      selectedDefinPeriod: "",
      startDateError: false,
      endDateError: false,
      examArError: false,
      examEnError: false,
      examTypeError: false,
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
      defineExamDates,
      onDefineExamDates,

      deleted,

      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onDefineExamDates();

    this.setState({
      defineExamDates,
      deleted,
    });
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
      defineExamDate: "",
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
      onDeleteContract(selectedRowId);

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
      defineExamDate,
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
    values["fullNameId"] = selectedFullName;
    values["employmentCaseId"] = selectedEmploymentCase;
    values["hasMinistryApprove"] = selectedHasMinistryApprove;
    values["governmentWorker"] = selectedGovernmentWorker;
    values["workClassificationId"] = selectedWorkClassification;
    values["academicYearId"] = selectedAcademicYearId;
    console.log("valuesssssssssssssssssssss", values);

    let contractInfo = {};
    // if (values.fullNameId) {
    //   const nameObject = fullNamesOpt.find(
    //     fullName => fullName.value === values.fullNameId
    //   );
    //   console.log("nameObject", nameObject);
    //   values["fullNameId"] = nameObject.key;
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
    if (fieldName === "jobTitleId") {
      const selected = this.state.jobTitlesOpt.find(
        job => job.arTitle === selectedValue
      );

      this.setState({
        selectedJobTitle: selected ? selected.Id : null,
      });
      return;
    }

    if (fieldName === "fullNameId") {
      const selected = this.state.employeesNames.find(
        employeeName => employeeName.value === selectedValue
      );

      this.setState({
        selectedFullName: selected ? selected.key : null,
      });
      return;
    }

    if (fieldName === "academicYearId") {
      const selected = this.state.academicYearsOpt.find(
        academicYear =>
          academicYear.arTitle.trim().toLowerCase() ===
          selectedValue.trim().toLowerCase()
      );
      this.setState({
        selectedAcademicYearId: selected ? selected.Id : null,
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
      defineExamDate: arg,
      selectedJobRank: arg.jobRankId,
      selectedJobTitle: arg.jobTitleId,
      selectedCorporateNode: arg.corporateNodeId,
      selectedContractType: arg.contractTypeId,
      selectedEmploymentCase: arg.employmentCaseId,
      selectedHasMinistryApprove: arg.hasMinistryApprove,
      selectedGovernmentWorker: arg.governmentWorker,
      selectedWorkClassification: arg.workClassificationId,
      selectedAcademicYearId: arg.academicYearId,
      isEdit: true,
      isOpen: false,
    });
    this.toggle();
  };

  handleEmployeeDataClick = defineExamDate => {
    console.log("arg", defineExamDate);

    this.setState({
      isOpen: true,
      selectConId: defineExamDate.Id,
      modalContractValue: defineExamDate,
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
    const defineExamDate = this.state.defineExamDate;
    const employee = this.state.employee;
    const { defineExamDates, t, deleted } = this.props;
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
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      endDateError,
      startDateError,
      examArError,
      examEnError,
      examTypeError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      modalContractValue,
      fullNamesOpt,
      selectedDefinPeriod,
      selectedExamType,
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
        text: this.props.t("Exam"),
        sort: true,
        editable: false,
      },
      {
        dataField: "ncsDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.ncsDate),
      },
      {
        dataField: "employeeName",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "position",
        text: this.props.t("Days Count"),
        sort: true,
        editable: false,
      },
      {
        dataField: "jobTitle",
        text: this.props.t("Exam Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, defineExamDate) => (
          <div className="d-flex gap-3">
            <Tooltip
              title={this.props.t("View Employee Information")}
              placement="top"
            >
              <Link className="text-sm-end" to="#">
                <i
                  className="fas fa-male font-size-18"
                  id="viewtooltip"
                  onClick={() => this.handleEmployeeDataClick(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleContractClick(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "startTime",
        text: t("Start Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.startTime}
            onChange={newValue => {
              this.handleLecturePeriodDataChange(
                row.Id,
                "startTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "endTime",
        text: t("End Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.endTime}
            onChange={newValue => {
              this.handleLecturePeriodDataChange(
                row.Id,
                "endTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        // hidden: !showDeleteButton,
        formatter: (cellContent, lecturePeriod) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(lecturePeriod)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: defineExamDates.length,
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
                        data={defineExamDates}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={defineExamDates}
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
                                  data={defineExamDates}
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
                                  // className={"modal-fullscreen"}
                                  size="lg"
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Define Exam Date")
                                      : t("Add Define Exam Date ")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          defineExamDate && {
                                            Id: defineExamDate.Id,
                                          }),
                                        examAr:
                                          (defineExamDate &&
                                            defineExamDate.examAr) ||
                                          "",
                                        examEn:
                                          (defineExamDate &&
                                            defineExamDate.examEn) ||
                                          "",
                                        examTypeId:
                                          (defineExamDate &&
                                            defineExamDate.jobTitleId) ||
                                          selectedExamType,
                                        definPeriodId:
                                          (defineExamDate &&
                                            defineExamDate.definPeriodId) ||
                                          selectedDefinPeriod,
                                        startDate:
                                          (defineExamDate &&
                                            defineExamDate.startDate) ||
                                          "",
                                        endDate:
                                          (defineExamDate &&
                                            defineExamDate.endDate) ||
                                          "",
                                        studentOrderId:
                                          (defineExamDate &&
                                            defineExamDate.studentOrderId) ||
                                          "",
                                        startTime:
                                          (defineExamDate &&
                                            defineExamDate.startTime) ||
                                          "",
                                        endTime:
                                          (defineExamDate &&
                                            defineExamDate.endTime) ||
                                          "",
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
                                              {t("Add Exam Name")}
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
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Row>
                                                        <Col lg="12">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="examAr">
                                                                  {this.props.t(
                                                                    "Exam (ar)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="examAr"
                                                                  type="text"
                                                                  id="examAr"
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
                                                                <Label for="examEn">
                                                                  {this.props.t(
                                                                    "Exam (en)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="examEn"
                                                                  type="text"
                                                                  id="examEn"
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
                                                                <Label for="startDate">
                                                                  {this.props.t(
                                                                    "Start Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="startDate"
                                                                  className={`form-control ${
                                                                    startDateError
                                                                      ? "is-invalid"
                                                                      : ""
                                                                  }`}
                                                                  type="date"
                                                                  value={
                                                                    values.startDate
                                                                      ? new Date(
                                                                          values.startDate
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
                                                                  id="startDate-date-input"
                                                                />
                                                                {startDateError && (
                                                                  <div className="invalid-feedback">
                                                                    {this.props.t(
                                                                      "Start Date is required"
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
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
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
                                                                <Label for="examTypeId">
                                                                  {this.props.t(
                                                                    "Exam Type"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="examTypeId"
                                                                  key={`select_examTypeId`}
                                                                  // options={
                                                                  //   examTypes
                                                                  // }
                                                                  className={`form-control`}
                                                                  // onChange={newValue => {
                                                                  //   this.handleSelect(
                                                                  //     "examTypeId",
                                                                  //     newValue.value
                                                                  //   );
                                                                  // }}
                                                                  // defaultValue={examTypes.find(
                                                                  //   opt =>
                                                                  //     opt.value ===
                                                                  //     defineExamDate?.examTypeId
                                                                  // )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="definePeriodId">
                                                                  {this.props.t(
                                                                    "Define Period"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="definePeriodId"
                                                                  key={`select_definePeriodId`}
                                                                  // options={
                                                                  //   definePeriods
                                                                  // }
                                                                  className={`form-control`}
                                                                  // onChange={newValue => {
                                                                  //   this.handleSelect(
                                                                  //     "definePeriodId",
                                                                  //     newValue.value
                                                                  //   );
                                                                  // }}
                                                                  // defaultValue={definePeriods.find(
                                                                  //   opt =>
                                                                  //     opt.value ===
                                                                  //     defineExamDate?.definePeriodId
                                                                  // )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
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
                                                      onClick={
                                                        this.handleAlertClose
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
                                              </div>
                                              <div className="table-responsive">
                                                <PaginationProvider
                                                  pagination={paginationFactory(
                                                    pageOptions
                                                  )}
                                                  keyField="Id"
                                                  columns={columns2}
                                                  data={defineExamDates}
                                                >
                                                  {({
                                                    paginationProps,
                                                    paginationTableProps,
                                                  }) => (
                                                    <ToolkitProvider
                                                      keyField="Id"
                                                      data={defineExamDates}
                                                      columns={columns2}
                                                      search
                                                    >
                                                      {toolkitprops => (
                                                        <React.Fragment>
                                                          <Row>
                                                            <Col sm="4">
                                                              <div className="search-box ms-2 mb-2 d-inline-block">
                                                                {showSearchButton && (
                                                                  <div className="position-relative">
                                                                    <SearchBar
                                                                      {...toolkitprops.searchProps}
                                                                    />
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                          <br />
                                                          <br />
                                                          <div className="marginTop">
                                                            <Row>
                                                              <Col lg="2">
                                                                <div className="centeraligne">
                                                                  {this.props.t(
                                                                    "Start Time"
                                                                  )}
                                                                </div>
                                                              </Col>
                                                              <Col lg="3">
                                                                <Input
                                                                  type="time"
                                                                  value={
                                                                    this.state
                                                                      .newStartTime
                                                                  }
                                                                  onChange={e =>
                                                                    this.setState(
                                                                      {
                                                                        newStartTime:
                                                                          e
                                                                            .target
                                                                            .value,
                                                                      }
                                                                    )
                                                                  }
                                                                />
                                                              </Col>
                                                              <Col lg="2">
                                                                <div className="centeraligne">
                                                                  {this.props.t(
                                                                    "End Time"
                                                                  )}
                                                                </div>
                                                              </Col>
                                                              <Col lg="3">
                                                                <Input
                                                                  type="time"
                                                                  value={
                                                                    this.state
                                                                      .newEndTime
                                                                  }
                                                                  onChange={e =>
                                                                    this.setState(
                                                                      {
                                                                        newEndTime:
                                                                          e
                                                                            .target
                                                                            .value,
                                                                      }
                                                                    )
                                                                  }
                                                                />
                                                              </Col>
                                                              <Col>
                                                                <div className="text-sm-start">
                                                                  <Button
                                                                    size="md"
                                                                    className="btn btn-warning ms-auto"
                                                                    onClick={
                                                                      this
                                                                        .handleGenerateNewData
                                                                    }
                                                                  >
                                                                    <i className="bx bx-error font-size-16 align-middle me-2"></i>
                                                                    {this.props.t(
                                                                      "Generate"
                                                                    )}
                                                                  </Button>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <BootstrapTable
                                                            keyField="Id"
                                                            {...toolkitprops.baseProps}
                                                            {...paginationTableProps}
                                                            data={
                                                              defineExamDates
                                                            }
                                                            columns={columns2}
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
                                                                  this.handleLecturePeriodDataChange(
                                                                    row.Id,
                                                                    column.dataField,
                                                                    newValue
                                                                  );
                                                                },
                                                              }
                                                            )}
                                                            defaultSorted={
                                                              defaultSorting
                                                            }
                                                          />
                                                        </React.Fragment>
                                                      )}
                                                    </ToolkitProvider>
                                                  )}
                                                </PaginationProvider>
                                              </div>
                                            </CardBody>
                                          </Card>
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

const mapStateToProps = ({ menu_items, defineExamDates }) => ({
  defineExamDates: defineExamDates.defineExamDates,
  deleted: defineExamDates.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onDefineExamDates: () => dispatch(getDefineExamDates()),
  onAddNewDefineExamDate: defineExamDate =>
    dispatch(addNewDefineExamDate(defineExamDate)),
  onUpdateDefineExamDate: defineExamDate =>
    dispatch(updateDefineExamDate(defineExamDate)),
  onDeleteDefineExamDate: defineExamDate =>
    dispatch(deleteDefineExamDate(defineExamDate)),
  onGetDefineExamDateDeletedValue: () =>
    dispatch(getDefineExamDateDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(DefineExamDatesList)));
