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
  getPositions,
  addNewPosition,
  updatePosition,
  deletePosition,
  getPositionDeletedValue,
} from "store/job&position/actions";
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
class PositionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      positions: [],
      position: "",
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
      selectedPositionType: null,
      employeeFullName: "",
      signatureDateError: false,
      hireDateError: false,
      fullNameError: false,
      positionTypeError: false,
      academicYearsIdError: false,
      jobTitleError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      modalPositionValue: [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const { positions, onGetPositions, deleted, user_menu, employees } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (position && !positions.length) {
    //   onGetPositions();
    // }
    onGetPositions();
    this.setState({
      positions,
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
      position: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeletePosition } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      let onDelete = { Id: selectedRowId.Id };
      onDeletePosition(onDelete);

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
      selectedPositionType,
      selectedEmploymentCase,
      selectedNcsDate,
      selectedEndDate,
      selectedHireDate,
      selectedSignatureDate,
      selectedWorkClassification,
      selectedAcademicYearId,
      position,
      isEdit,
      isAdd,
      selectEmpId,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      selectedFullName,
      fullNamesOpt,
    } = this.state;
    const { onAddNewPosition, onUpdatePosition } = this.props;

    //values["administrativeSupervisor"] = selectedAdministrativeSupervisor;
    // values["physicalWorkLocation"] = selectedPhysicalWorkLocations;
    // values["employeeId"] = selectEmpId;

    values["jobRankId"] = selectedJobRank;
    values["jobTitleId"] = selectedJobTitle;
    // values["corporateNodeId"] = selectedCorporateNode;
    values["positionTypeId"] = selectedPositionType;
    values["employeeId"] = selectedFullName;
    values["employmentCaseId"] = selectedEmploymentCase;
    values["hasMinistryApprove"] = selectedHasMinistryApprove;
    values["governmentWorker"] = selectedGovernmentWorker;
    values["workClassificationId"] = selectedWorkClassification;
    values["academicYearId"] = selectedAcademicYearId;
    console.log("valuesssssssssssssssssssss", values);

    let positionInfo = {};
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
      values.positionNumber &&
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
      selectedPositionType !== null &&
      selectedEmploymentCase !== null &&
      selectedFullName !== null
    ) {
      console.log("selectedFullName", selectedFullName);
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", positionInfo);
        positionInfo[key] = values[key];
      });
      if (isEdit) {
        console.log("9999999", positionInfo);
        onUpdatePosition(positionInfo);
      } else {
        onAddNewPosition(positionInfo);
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
      if (selectedPositionType === undefined) {
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
    if (fieldName == "positionTypeId") {
      this.setState({
        selectedPositionType: selectedValue,
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

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    const { onGetPositionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetPositionDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetPositionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetPositionDeletedValue();
  };

  handlePositionClick = arg => {
    console.log("arg", arg);

    this.setState({
      position: arg,
      selectedFullName: arg.employeeId,
      employeeFullName: arg.employeeName,
      selectedJobRank: arg.jobRankId,
      selectedJobTitle: arg.jobTitleId,
      jobTitleName: arg.jobTitle,
      selectedCorporateNode: arg.corporateNodeId,
      selectedPositionType: arg.positionTypeId,
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

  handleEmployeeDataClick = position => {
    console.log("arg", position);

    this.setState({
      isOpen: true,
      selectConId: position.Id,
      modalPositionValue: position,
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
    const position = this.state.position;
    const { positions, t, deleted } = this.props;
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
      signatureDateError,
      hireDateError,
      fullNameError,
      ncsDateError,
      corporateNodeError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      modalPositionValue,
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
        dataField: "positionName",
        text: this.props.t("Position Type "),
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
        formatter: (cellContent, position) => (
          <div className="d-flex gap-3">
            <Tooltip
              title={this.props.t("View Employee Information")}
              placement="top"
            >
              <IconButton
                onClick={() => this.handleEmployeeDataClick(position)}
              >
                <i className="fas fa-male font-size-18" id="viewtooltip"></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={this.props.t("Edit")} placement="top">
              <IconButton onClick={() => this.handlePositionClick(position)}>
                <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton onClick={() => this.onClickDelete(position)}>
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: positions.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Positions")} />
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
                        data={positions}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={positions}
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
                                  data={positions}
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
                                    "No Positions found"
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
                                      ? t("Edit Position Data")
                                      : t("Add Position Data")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          position && {
                                            Id: position.Id,
                                          }),
                                        jobNumber:
                                          (position && position.jobNumber) ||
                                          "",
                                        biometricCode:
                                          (position &&
                                            position.biometricCode) ||
                                          "",
                                        positionNumber:
                                          (position &&
                                            position.positionNumber) ||
                                          "",
                                        // corporateNodeId:
                                        //   (position &&
                                        //     position.corporateNodeId) ||
                                        //   "",
                                        // physicalWorkLocation:
                                        //   (position &&
                                        //     position.physicalWorkLocation) ||
                                        //   "",
                                        quorum:
                                          (position && position.quorum) || "",
                                        sequenceInWorkplace:
                                          (position &&
                                            position.sequenceInWorkplace) ||
                                          "",
                                        hireDate: position?.hireDate
                                          ? moment
                                              .utc(position.hireDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        signatureDate: position?.signatureDate
                                          ? moment
                                              .utc(position.signatureDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        endDate: position?.endDate
                                          ? moment
                                              .utc(position.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        ncsDate: position?.ncsDate
                                          ? moment
                                              .utc(position.ncsDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        // administrativeSupervisor:
                                        //   (position &&
                                        //     position.administrativeSupervisor) ||
                                        //   "",
                                        jobRankId: position?.jobRankId || "",

                                        governmentWorker:
                                          (position &&
                                            position.governmentWorker) ||
                                          "",
                                        hasMinistryApprove:
                                          (position &&
                                            position.hasMinistryApprove) ||
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
                                                              </Col>
                                                              <Col lg="6">
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
                                                          {t("PositionType")}
                                                        </CardTitle>
                                                        <CardBody>
                                                          <Row>
                                                            <Col lg="6">
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
                                                                    <Label for="positionNumber">
                                                                      {this.props.t(
                                                                        "Position Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="positionNumber"
                                                                      type="text"
                                                                      id="positionNumber"
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

const mapStateToProps = ({ positions, menu_items }) => ({
  positions: positions.positions,
  deleted: positions.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetPositions: () => dispatch(getPositions()),
  onAddNewPosition: position => dispatch(addNewPosition(position)),
  onUpdatePosition: position => dispatch(updatePosition(position)),
  onDeletePosition: position => dispatch(deletePosition(position)),
  onGetPositionDeletedValue: () => dispatch(getPositionDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(PositionsList)));
