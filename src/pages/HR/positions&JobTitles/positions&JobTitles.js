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
  FormGroup,
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
      positions: [],
      position: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      selectedPositionType: null,
      positionTypeError: false,
      positionError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      isNestedModalOpen: false,
      languageState: "",
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      positions,
      i18n,
      positionTypes,
      corporateNodesOpt,
      positionsOpt,
      onGetPositions,
      deleted,
      user_menu,
      employees,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (position && !positions.length) {
    //   onGetPositions();
    // }
    onGetPositions(lang);
    this.setState({
      positions,
      deleted,
      positionTypes,
      corporateNodesOpt,
      positionsOpt,
      languageState: lang,
    });
    i18n.on("languageChanged", this.handleLanguageChange);
  }
  handleLanguageChange = lng => {
    const { onGetPositions } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetPositions(lng);
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
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  toggleNestedModal = () => {
    const { isEdit, selectedOption, selectedSchedule } = this.state;
    const { onGetScheduleTimings, onGetScheduleTimingDescs, onGetHallTimings } =
      this.props;
    console.log("isEdit", isEdit);
    if (selectedOption === "Position") {
      if (isEdit) {
        this.setState({
          positionJobTitleData: {
            Capacity: "",
            PositionNumber: "",
          },
          isEdit: false,
          selectedOption: "",
        });
      }
    } else {
      if (isEdit) {
        this.setState({
          positionJobTitleData: {
            Capacity: "",
            LabNumber: "",
          },
          isEdit: false,
          selectedOption: "",
        });
      }
      this.setState({ selectedRow: null, selectedType: "" });
    }

    this.setState(prevState => ({
      isNestedModalOpen: !prevState.isNestedModalOpen,
    }));
    this.setState({
      selectedRowPositionLab: null,
    });
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

  handleDeletePositionLab = () => {
    const { onDeletePositionLab, selectedOption } = this.props;
    const { positionJobTitleData } = this.state;
    if (positionJobTitleData.Id !== undefined) {
      let onDelete = { Id: positionJobTitleData.Id };
      onDelete["tablename"] =
        positionJobTitleData.type === "JobTitle"
          ? "Common_Lab"
          : "Common_Position";
      onDeletePositionLab(onDelete);
    }
    this.setState({ deleteModal: false, selectedOption: "" });
    this.setState({
      positionJobTitleData: {
        Capacity: "",
        PositionNumber: "",
        LabNumber: "",
      },
      isEdit: false,
    });
  };

  handleEditPositionLab = SLD => {
    console.log("ssssssssld", SLD);
    this.setState({
      // defaultHallName: SLD.hallName,
      isEdit: true,
      positionJobTitleData: {
        Id: SLD.Id,
        Capacity: SLD.Capacity,
        PositionLabNumber: SLD.PositionLabNumber,
        startDate: SLD.startDate,
        endDate: SLD.endDate,
        type: SLD.type,
      },
      selectedOption: SLD.type,
      isPositionRadioDisabled: SLD.type === "JobTitle",
      isLabRadioDisabled: SLD.type === "Position",
    });

    this.toggleNestedModal();
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

  handleChangeOption = event => {
    const { onGetScheduleTimings, onGetScheduleTimingDescs, onGetHallTimings } =
      this.props;
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleSelectChange = (fieldName, selectedValue, values) => {
    console.log("selectedValue", selectedValue);
    const { positionTypes, countries, cities, governorates } = this.props;

    if (fieldName == "positionTypeId") {
      const name = positionTypes.find(
        positionType => positionType.value === selectedValue
      );

      this.setState({
        selectedPositionType: selectedValue,
        positionTypeId: name.label,
      });
    }
  };

  render() {
    const {
      positions,
      corporateNodesOpt,
      positionTypes,
      positionsOpt,
      t,
      deleted,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      isEdit,
      emptyError,
      showAlert,
      selectedOption,
      corporateNodeError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      isNestedModalOpen,
      positionJobTitleData,
      positionTypeError,
      positionError,
      languageState,
    } = this.state;

    const direction = languageState === "ar" ? "rtl" : "ltr";

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
        dataField: "jobPosition",
        text: this.props.t("Position /Job Title"),
        sort: true,
        editable: false,
      },
      {
        dataField: "jobPositionCode",
        text: this.props.t("Position Code /Job Title Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "positionType",
        text: this.props.t("Position Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "positionRank",
        text: this.props.t("Position Rank"),
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
        <div dir={direction} className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              breadcrumbItem={this.props.t("Positions & Job Titles")}
            />
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
                                          onClick={this.toggleNestedModal}
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
                                  isOpen={isNestedModalOpen}
                                  toggle={this.toggleNestedModal}
                                >
                                  <ModalHeader toggle={this.toggleNestedModal}>
                                    {isEdit
                                      ? t(
                                          `Edit ${
                                            selectedOption === "Position"
                                              ? "Position"
                                              : "JobTitle"
                                          }`
                                        )
                                      : selectedOption === "Position"
                                      ? t("Add Position")
                                      : selectedOption === "JobTitle"
                                      ? t("Add Job Title")
                                      : t("Add Form")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <div>
                                      <div>
                                        <Label>
                                          <Input
                                            type="radio"
                                            id="Position"
                                            name="radioOption"
                                            value="Position"
                                            checked={
                                              selectedOption === "Position"
                                            }
                                            onChange={this.handleChangeOption}
                                            disabled={
                                              isEdit && isPositionRadioDisabled
                                            }
                                          />
                                          {"  "} {t("Position")}
                                        </Label>

                                        <Label>
                                          <Input
                                            type="radio"
                                            id="JobTitle"
                                            name="radioOption"
                                            value="JobTitle"
                                            checked={
                                              selectedOption === "JobTitle"
                                            }
                                            onChange={this.handleChangeOption}
                                            disabled={
                                              isEdit && isLabRadioDisabled
                                            }
                                          />
                                          {"  "} {t("JobTitle")}
                                        </Label>
                                      </div>

                                      <div>
                                        {selectedOption === "Position" && (
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              positionAr:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.positionAr) ||
                                                "",
                                              positionEn:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.positionEn) ||
                                                "",
                                              positionTypeId:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.positionTypeId) ||
                                                "",
                                              positionRank:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.positionRank) ||
                                                "",
                                              positionCode:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.positionCode) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                positionAr:
                                                  Yup.string().required(
                                                    "Please Enter Your Position in Arabic"
                                                  ),
                                                positionEn:
                                                  Yup.string().required(
                                                    "Please Enter Your Position in English"
                                                  ),
                                                positionRank:
                                                  Yup.string().required(
                                                    "Please Enter Your Position Rank"
                                                  ),
                                                positionCode:
                                                  Yup.string().required(
                                                    "Please Enter Your Position Code"
                                                  ),
                                              }
                                            )}
                                            onSubmit={values => {}}
                                          >
                                            {({
                                              errors,
                                              status,
                                              touched,
                                              values,
                                              handleChange,
                                              handleBlur,
                                            }) => (
                                              <>
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
                                                          this.handleAlertClose(
                                                            "duplicateError"
                                                          )
                                                        }
                                                      ></button>
                                                    </Alert>
                                                  )}
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
                                                </div>
                                                <Form className="needs-validation">
                                                  <div className="bordered">
                                                    <Row>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom01">
                                                            {t("Position(ar)")}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="positionAr"
                                                            placeholder={t(
                                                              "Position(ar)"
                                                            )}
                                                            type="text"
                                                            className={
                                                              "form-control" +
                                                              (errors.positionAr &&
                                                              touched.positionAr
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="positionAr"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom05">
                                                            {t("Position(en)")}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="positionEn"
                                                            placeholder={t(
                                                              "Position(en)"
                                                            )}
                                                            type="text"
                                                            className={
                                                              "form-control" +
                                                              (errors.positionEn &&
                                                              touched.positionEn
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="positionEn"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>

                                                    <Row>
                                                      <Col className="col-6">
                                                        <FormGroup className="mb-3">
                                                          <Label for="positionTypeId">
                                                            {this.props.t(
                                                              "Position Type"
                                                            )}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Select
                                                            className={`form-control ${
                                                              positionTypeError
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            name="positionTypeId"
                                                            id="positionTypeId"
                                                            key="positionType_select"
                                                            options={
                                                              positionTypes
                                                            }
                                                            onChange={newValue =>
                                                              this.handleSelectChange(
                                                                "positionTypeId",
                                                                newValue.value,
                                                                values
                                                              )
                                                            }
                                                            defaultValue={positionTypes.find(
                                                              opt =>
                                                                opt.value ===
                                                                positionJobTitleData?.positionTypeId
                                                            )}
                                                          />
                                                          {positionTypeError && (
                                                            <div className="invalid-feedback">
                                                              {this.props.t(
                                                                "Position Type is required"
                                                              )}
                                                            </div>
                                                          )}
                                                          <ErrorMessage
                                                            name="positionTypeId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom02">
                                                            {t("Position Rank")}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="positionRank"
                                                            placeholder={t(
                                                              "Position Rank"
                                                            )}
                                                            type="number"
                                                            className={
                                                              "form-control" +
                                                              (errors.positionRank &&
                                                              touched.positionRank
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="positionRank"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom03">
                                                            {t("Position Code")}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="positionCode"
                                                            placeholder={t(
                                                              "Position Code"
                                                            )}
                                                            type="number"
                                                            className={
                                                              "form-control" +
                                                              (errors.positionCode &&
                                                              touched.positionCode
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="positionCode"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                  <Row className="justify-content-center">
                                                    <Col
                                                      lg="3"
                                                      className="d-flex justify-content-center"
                                                    >
                                                      <Link
                                                        to="#"
                                                        className="btn btn-primary me-2"
                                                        onClick={() => {
                                                          this.handleSubmit(
                                                            values
                                                          );
                                                        }}
                                                      >
                                                        {t("Save")}
                                                      </Link>
                                                    </Col>
                                                  </Row>
                                                </Form>
                                              </>
                                            )}
                                          </Formik>
                                        )}

                                        {selectedOption === "JobTitle" && (
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              jobTitleAr:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.jobTitleAr) ||
                                                "",
                                              jobTitleEn:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.jobTitleEn) ||
                                                "",
                                              positionId:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.positionId) ||
                                                "",
                                              corporateNodeId:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.corporateNodeId) ||
                                                "",
                                              jobTitleCode:
                                                (positionJobTitleData &&
                                                  positionJobTitleData.jobTitleCode) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                jobTitleAr:
                                                  Yup.string().required(
                                                    "Please Enter Your Job Title in Arabic"
                                                  ),
                                                jobTitleEn:
                                                  Yup.string().required(
                                                    "Please Enter Your Job Title in English"
                                                  ),
                                              }
                                            )}
                                            onSubmit={values => {}}
                                          >
                                            {({
                                              errors,
                                              status,
                                              touched,
                                              values,
                                              handleChange,
                                              handleBlur,
                                            }) => (
                                              <>
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
                                                        this.handleAlertClose(
                                                          "duplicateError"
                                                        )
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
                                                <Form className="needs-validation">
                                                  <div className="bordered">
                                                    <Row>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom06">
                                                            {t("Job Title(ar)")}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="jobTitleAr"
                                                            placeholder={t(
                                                              "Job Title(ar)"
                                                            )}
                                                            type="text"
                                                            className={
                                                              "form-control" +
                                                              (errors.jobTitleAr &&
                                                              touched.jobTitleAr
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="jobTitleAr"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom05">
                                                            {t("Job Title(en)")}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="jobTitleEn"
                                                            placeholder={t(
                                                              "Job Title(en)"
                                                            )}
                                                            type="text"
                                                            className={
                                                              "form-control" +
                                                              (errors.jobTitleEn &&
                                                              touched.jobTitleEn
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="jobTitleEn"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>

                                                    <Row>
                                                      <Col className="col-6">
                                                        <FormGroup className="mb-3">
                                                          <Label for="positionId">
                                                            {this.props.t(
                                                              "Position"
                                                            )}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Select
                                                            className={`form-control ${
                                                              positionError
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            name="positionId"
                                                            id="positionId"
                                                            key="position_select"
                                                            options={
                                                              positionsOpt
                                                            }
                                                            onChange={newValue =>
                                                              this.handleSelectChange(
                                                                "positionId",
                                                                newValue.value,
                                                                values
                                                              )
                                                            }
                                                            defaultValue={positionsOpt.find(
                                                              opt =>
                                                                opt.value ===
                                                                positionJobTitleData?.positionId
                                                            )}
                                                          />
                                                          {positionError && (
                                                            <div className="invalid-feedback">
                                                              {this.props.t(
                                                                "Position is required"
                                                              )}
                                                            </div>
                                                          )}
                                                          <ErrorMessage
                                                            name="positionId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label for="corporateNode">
                                                            {t(
                                                              "Corporate Node"
                                                            )}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="corporateNodeId"
                                                            as="input"
                                                            type="text"
                                                            id="corporateNode"
                                                            placeholder="Search..."
                                                            className={
                                                              "form-control" +
                                                              ((errors.corporateNodeId &&
                                                                touched.corporateNodeId) ||
                                                              corporateNodeError
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            value={
                                                              corporateNodesOpt.find(
                                                                h =>
                                                                  h.key ===
                                                                  this.state
                                                                    .selectedCorporateKey
                                                              )?.value || ""
                                                            }
                                                            onChange={e => {
                                                              const newValue =
                                                                e.target.value;

                                                              const selectedCorporateNode =
                                                                corporateNodesOpt.find(
                                                                  h =>
                                                                    h.value ===
                                                                    newValue
                                                                );

                                                              if (
                                                                selectedCorporateNode
                                                              ) {
                                                                this.setState({
                                                                  selectedCorporateKey:
                                                                    selectedCorporateNode.key,
                                                                  corporateNodeName:
                                                                    selectedCorporateNode.value,
                                                                });
                                                              } else {
                                                                this.setState({
                                                                  selectedCorporateKey:
                                                                    null,
                                                                  corporateNodeName:
                                                                    newValue,
                                                                });
                                                              }
                                                              this.onChangeHall(
                                                                this.state
                                                                  .corporateNodeName,
                                                                newValue
                                                              );
                                                            }}
                                                            list="corporateNodesList"
                                                            autoComplete="off"
                                                          />

                                                          <datalist id="corporateNodesList">
                                                            {corporateNodesOpt.map(
                                                              corporateNode => (
                                                                <option
                                                                  key={
                                                                    corporateNode.key
                                                                  }
                                                                  value={
                                                                    corporateNode.value
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
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <Label htmlFor="validationCustom07">
                                                            {t(
                                                              "Job Title Code"
                                                            )}
                                                          </Label>
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                          <Field
                                                            name="jobTitleCode"
                                                            placeholder={t(
                                                              "Job Title Code"
                                                            )}
                                                            type="number"
                                                            className={
                                                              "form-control" +
                                                              (errors.jobTitleCode &&
                                                              touched.jobTitleCode
                                                                ? " is-invalid"
                                                                : "")
                                                            }
                                                            autoComplete="Off"
                                                          />
                                                          <ErrorMessage
                                                            name="jobTitleCode"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                  <Row className="justify-content-center">
                                                    <Col
                                                      lg="3"
                                                      className="d-flex justify-content-center"
                                                    >
                                                      <Link
                                                        className="btn btn-primary me-2"
                                                        to="#"
                                                        onClick={() => {
                                                          this.handleSubmit(
                                                            values
                                                          );
                                                        }}
                                                      >
                                                        {t("Save")}
                                                      </Link>
                                                    </Col>
                                                  </Row>
                                                </Form>
                                              </>
                                            )}
                                          </Formik>
                                        )}
                                      </div>
                                    </div>
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

const mapStateToProps = ({ positions, menu_items, employees }) => ({
  positions: positions.positions,
  positionTypes: positions.positionTypes,
  positionsOpt: positions.positionsOpt,
  corporateNodesOpt: employees.corporateNodesOpt,
  deleted: positions.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetPositions: lng => dispatch(getPositions(lng)),
  onAddNewPosition: position => dispatch(addNewPosition(position)),
  onUpdatePosition: position => dispatch(updatePosition(position)),
  onDeletePosition: position => dispatch(deletePosition(position)),
  onGetPositionDeletedValue: () => dispatch(getPositionDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(PositionsList)));
