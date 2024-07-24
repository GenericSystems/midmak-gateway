import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Alert,
  Button,
  Input,
} from "reactstrap";
import { Editor } from "react-bootstrap-table2-editor";
import DeleteModal from "components/Common/DeleteModal";
import classnames from "classnames";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import filterFactory, {
  textFilter,
  selectFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import {
  fetchAdmissionSetting,
  getAdmissionConditions,
  addNewAdmissionCondition,
  updateAdmissionCondition,
  deleteAdmissionCondition,
  getAdmissionConditionDeletedValue,
  copyAdmissionCond,
} from "store/admissionConditions/actions";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class AdmissionConditionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      selectedCertificateType: null,
      selectedEstimate: null,
      selectedYear: 0,
      verticalActiveTab: 0,
      currentFacultyId: null,
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      defaultYear: null,
      isCurrentYear: true,
      visible: true,
      activeTab1: "0",
      grantCond: 0,
      errorMessage: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.toggleVertical = this.toggleVertical.bind(this);
  }

  toggleVertical(facultyId, selectedYear) {
    const {
      onGetAdmissionConditions,
      admissionConditions,
      years,
      currentSemester,
    } = this.props;
    const { verticalActiveTab, grantCond } = this.state;
    const currentYear = years.find(
      year => year.value === currentSemester.cuYearId || ""
    );

    if (verticalActiveTab !== facultyId) {
      this.setState({
        verticalActiveTab: facultyId,
        currentFacultyId: facultyId,
      });
      let ob = {
        facultyId: facultyId,
        YearId: currentYear.value,
        isGrantCond: grantCond,
      };
      if (ob) {
        onGetAdmissionConditions(ob);
      }
    }
    const defaultYear = years.find(
      year => year.value === currentSemester.cuYearId
    );

    this.setState({ defaultYear: defaultYear, isCurrentYear: true });
  }
  componentDidMount() {
    const {
      studentManagements,
      onfetchAdmissionSetting,
      admissionConditions,
      certificates,
      faculties,
      years,
      estimates,
      deleted,
      currentSemester,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (admissionConditions && !admissionConditions.length) {
    }

    this.setState({ studentManagements });
    this.setState({ certificates });
    this.setState({ faculties });
    this.setState({ years });
    this.setState({ estimates });
    this.setState({ deleted });
    this.setState({ currentSemester });
    onfetchAdmissionSetting();
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

  toggle1(tab) {
    const { onGetAdmissionConditions, years, currentSemester } = this.props;
    const { currentFacultyId } = this.state;
    const currentYear = years.find(
      year => year.value === currentSemester.cuYearId || ""
    );
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
        grantCond: tab,
      });

      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: parseInt(tab),
      };
      if (ob) {
        onGetAdmissionConditions(ob);
      }
    }
  }

  handleAddRow = () => {
    const {
      onAddNewAdmissionCondition,
      admissionConditions,
      years,
      currentSemester,
    } = this.props;
    const { currentFacultyId, selectedYear, grantCond } = this.state;
    const emptyLevelExists = admissionConditions.some(
      row => row.certificateId === null
    );

    const currentYear = years.find(
      year => year.value === currentSemester.cuYearId || ""
    );
    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
      return;
    } else if (selectedYear != 0) {
      const newRow = {
        facultyId: currentFacultyId,
        YearId: selectedYear,
        isGrantCond: grantCond,
      };
      this.setState({ duplicateError: null });
      onAddNewAdmissionCondition(newRow);
    } else {
      const newRow = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: grantCond,
      };
      this.setState({ duplicateError: null });
      onAddNewAdmissionCondition(newRow);
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

  handleDeleteRow = () => {
    const { onDeleteAdmissionCondition } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteAdmissionCondition(selectedRowId);
      this.setState({ deleteModal: false, showAlert: true });
    }
  };

  handleChangeCheckbox = (row, currentStatus, fieldName) => {
    const { onUpdateAdmissionCondition } = this.props;
    const { currentFacultyId } = this.state;
    const newStatus = currentStatus ? 1 : 0;
    let rlogin = row.AllLogin == null ? 0 : row.AllLogin;
    let rAllowRegister = row.AllowRegister == null ? 0 : row.AllowRegister;
    let rAllowPay = row.AllowPay == null ? 0 : row.AllowPay;

    let ob = {
      Id: row.Id,
      levelId: row.levelId,
      facultyNum: currentFacultyId,
      AllLogin: fieldName === "AllLogin" ? newStatus : rlogin,
      AllowRegister: fieldName === "AllowRegister" ? newStatus : rAllowRegister,
      AllowPay: fieldName === "AllowPay" ? newStatus : rAllowPay,
    };
    onUpdateAdmissionCondition(ob);
  };

  resetAdmissionCondition = row => {
    const { currentFacultyId } = this.state;
    const { onUpdateAdmissionCondition } = this.props;
    let ob = {};
    ob["Id"] = row.Id;
    ob["levelId"] = row.levelId;
    (ob["facultyId"] = currentFacultyId), (ob["AllLogin"] = 0);
    ob["AllowRegister"] = 0;
    ob["AllowPay"] = 0;

    onUpdateAdmissionCondition(ob);
  };

  toggleCheckboxEditMode = () => {
    this.setState(prevState => ({
      checkboxEditable: !prevState.checkboxEditable,
    }));
  };

  handleSelectChange = (rowId, fieldName, selectedValue) => {
    if (fieldName == "certificateId") {
      this.setState({
        selectedEstimate: selectedValue,
      });
    }
    if (fieldName == "estimateId") {
      this.setState({
        selectedEstimate: selectedValue,
      });
    }
    const { onUpdateAdmissionCondition, admissionConditions } = this.props;
    const certificateExists = admissionConditions.some(
      row => row.certificateId === selectedValue
    );
    if (certificateExists) {
      return;
    }
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };

    onUpdateAdmissionCondition(onUpdate);
  };

  handleAverageChange = (rowId, fieldName, averageValue) => {
    const { onUpdateAdmissionCondition } = this.props;

    const numericValue = parseFloat(averageValue);

    if (isNaN(numericValue)) {
      console.error("Entered value is not a number");
      const errorNonNumeric = this.props.t(`Please enter a valid number`);
      this.setState({ errorMessage: errorNonNumeric });
    } else if (numericValue > 100) {
      console.error("Entered value is greater than grade value");
      const errorGreaterGrade = this.props.t(`Enter Grade From 0 to 100`);
      this.setState({ errorMessage: errorGreaterGrade });
    } else if (numericValue < 0) {
      console.error("Entered value is negative");
      const errorNegativeGrade = this.props.t("You Entered Negative Grade");
      this.setState({ errorMessage: errorNegativeGrade });
    } else {
      const onUpdate = { Id: rowId, [fieldName]: numericValue };
      onUpdateAdmissionCondition(onUpdate);
    }
  };

  handleSelectYear = (fieldName, selectedValue, facultyId) => {
    const { onGetAdmissionConditions, admissionConditions, currentSemester } =
      this.props;
    const { grantCond } = this.state;

    if (selectedValue.value === currentSemester.cuYearId) {
      this.setState({ isCurrentYear: true });
    } else {
      this.setState({ isCurrentYear: false });
    }

    if (selectedValue.value >= currentSemester.cuYearId) {
      this.setState({ visible: true });
    } else {
      this.setState({ visible: false });
    }

    const { currentFacultyId } = this.state;
    if (fieldName === "YearId") {
      this.setState({
        selectedYear: selectedValue.value,
        defaultYear: selectedValue,
      });
    }

    let ob = {
      facultyId: currentFacultyId,
      YearId: selectedValue.value,
      isGrantCond: grantCond,
    };
    if (ob) {
      onGetAdmissionConditions(ob);
    }
  };

  handleAdmissionConditionDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateAdmissionCondition } = this.props;

    if (fieldName == "average") {
      const numericValue = parseFloat(fieldValue);

      if (isNaN(numericValue)) {
        console.error("Entered value is not a number");
        const errorNonNumeric = this.props.t(`Please enter a valid number`);
        this.setState({ errorMessage: errorNonNumeric });
      } else if (numericValue > 100) {
        console.error("Entered value is greater than grade value");
        const errorGreaterGrade = this.props.t(`Enter Grade From 0 to 100`);
        this.setState({ errorMessage: errorGreaterGrade });
      } else if (numericValue < 0) {
        console.error("Entered value is negative");
        const errorNegativeGrade = this.props.t("You Entered Negative Grade");
        this.setState({ errorMessage: errorNegativeGrade });
      } else {
        const onUpdate = { Id: rowId, [fieldName]: numericValue };
        this.setState({ errorMessage: null });
        onUpdateAdmissionCondition(onUpdate);
      }
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetAdmissionConditionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAdmissionConditionDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetAdmissionConditionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAdmissionConditionDeletedValue();
  };

  handleCopyAdmissionCond = () => {
    const { grantCond, currentFacultyId, selectedYear } = this.state;
    const { onCopyAdmissionCond, admissionConditions, years, currentSemester } =
      this.props;

    const currentYear = years.find(
      year => year.value === currentSemester.cuYearId || ""
    );

    if (selectedYear != 0) {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: parseInt(grantCond, 10),
      };
      onCopyAdmissionCond(ob);
    } else {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: parseInt(grantCond, 10),
      };
      onCopyAdmissionCond(ob);
    }
  };

  render() {
    const {
      selectedCertificateType,
      duplicateError,
      selectedYear,
      currentFacultyId,
      showAlert,
      deleteModal,
      defaultYear,
      isCurrentYear,
      visible,
      errorMessage,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    console.log("showEditButton in admission", showEditButton);
    const {
      t,
      admissionConditions,
      certificates,
      faculties,
      years,
      estimates,
      currentSemester,
      deleted,
    } = this.props;

    const currentYear = currentSemester.cuYearId;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const pageOptions = {
      sizePerPage: 20,
      totalSize: admissionConditions.length,
      custom: true,
    };

    const admissionCondColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "certificateId",
        text: this.props.t("Certificate Type"),

        filter: customFilter(),
        filterRenderer: (onFilter, column) => (
          <div>
            {showSearchButton && (
              <Select
                onChange={selectedOption => {
                  if (selectedOption && selectedOption.value === "") {
                    onFilter("", column);
                  } else {
                    onFilter(selectedOption.value, column);
                  }
                }}
                options={[
                  { label: this.props.t("Select..."), value: "" },
                  ...certificates,
                ]}
                defaultValue={""}
              />
            )}
          </div>
        ),
        formatter: (cell, row) => (
          <Select
            key={`certificateType_select`}
            options={certificates.filter(
              option =>
                !admissionConditions.some(
                  row => row.certificateId === option.value
                )
            )}
            onChange={newValue => {
              this.handleSelectChange(row.Id, "certificateId", newValue.value);
            }}
            defaultValue={certificates.find(
              opt => opt.value == row.certificateId
            )}
            isDisabled={row.YearId < currentYear || !showEditButton}
          />
        ),
        editable: false,
      },
      {
        dataField: "average",
        text: this.props.t("Average"),
        editable: showEditButton && isCurrentYear ? true : false,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0 || newValue > 100) {
            return {
              valid: false,
              message: this.props.t("Average value must be between 0 and 100"),
            };
          }
          return true;
        },
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "estimateId",
        text: this.props.t("Estimate"),
        filter: customFilter(),
        filterRenderer: (onFilter, column) => (
          <div>
            {showSearchButton && (
              <Select
                onChange={selectedOption => {
                  if (selectedOption && selectedOption.value === "") {
                    onFilter("", column);
                  } else {
                    onFilter(selectedOption.value, column);
                  }
                }}
                options={[
                  { label: this.props.t("Select..."), value: "" },
                  ...estimates,
                ]}
                defaultValue={""}
              />
            )}
          </div>
        ),
        formatter: (cell, row) => (
          <Select
            key={`estimate_select`}
            options={estimates}
            onChange={newValue => {
              this.handleSelectChange(row.Id, "estimateId", newValue.value);
            }}
            defaultValue={estimates.find(opt => opt.value == row.estimateId)}
            isDisabled={row.YearId < currentYear || !showEditButton}
          />
        ),
        editable: false,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, admissionCondition) => (
          <IconButton
            color="secondary"
            onClick={() => this.onClickDelete(admissionCondition)}
            hidden={!visible}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        ),
      },
    ];

    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
      textAlign: "left",
    };
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              title={t("Admission")}
              breadcrumbItem={t("Admission Conditions")}
            />

            <div className="checkout-tabs">
              <Row>
                <Col lg="2">
                  <Nav pills className="flex-column">
                    {faculties.map(faculty => (
                      <NavItem
                        className="justify-content-center"
                        key={faculty.Id}
                        navlink={faculty.Id}
                      >
                        <NavLink
                          className={classnames({
                            active: this.state.verticalActiveTab === faculty.Id,
                          })}
                          onClick={() => {
                            this.toggleVertical(faculty.Id, selectedYear);
                          }}
                        >
                          <p className="font-weight-bold m-1 pt-2 ">
                            <span style={{ fontWeight: "bold" }}>
                              {faculty.title}
                            </span>
                          </p>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </Col>

                <Col lg="10">
                  <TabContent
                    activeTab={this.state.verticalActiveTab}
                    className="text-muted mt-4 mt-md-0"
                  >
                    {faculties.map(faculty => (
                      <TabPane key={faculty.Id} tabId={faculty.Id}>
                        <Card>
                          <CardBody>
                            <Nav pills className="navtab-bg nav-justified">
                              <NavItem>
                                <NavLink
                                  id="vertical-home-link"
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active: this.state.activeTab1 === "0",
                                  })}
                                  onClick={() => {
                                    this.toggle1("0");
                                  }}
                                >
                                  {this.props.t("Admission Condition")}
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  id="vertical-home-link"
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active: this.state.activeTab1 === "1",
                                  })}
                                  onClick={() => {
                                    this.toggle1("1");
                                  }}
                                >
                                  {this.props.t("Grant Condition")}
                                </NavLink>
                              </NavItem>
                            </Nav>

                            <TabContent
                              activeTab={this.state.activeTab1}
                              className="p-3 text-muted"
                            >
                              <TabPane tabId="0">
                                <Row>
                                  <Col sm="12">
                                    <CardText className="mb-0">
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

                                      <Row>
                                        <Col lg="4"></Col>
                                        <Col
                                          lg="4"
                                          className="d-flex align-items-center justify-content-center"
                                        >
                                          <div
                                            style={{
                                              width: "200px",
                                              marginLeft: "5px",
                                            }}
                                          >
                                            <Select
                                              className="select-style-year"
                                              name="YearId"
                                              key={`year_select`}
                                              options={years.sort(
                                                (a, b) => b.value - a.value
                                              )}
                                              onChange={newValue => {
                                                this.handleSelectYear(
                                                  "YearId",
                                                  newValue,
                                                  currentFacultyId
                                                );
                                              }}
                                              value={defaultYear}
                                              placeholder={this.props.t(
                                                "Select Year"
                                              )}
                                            />
                                          </div>
                                        </Col>
                                        <Col lg="4">
                                          {visible && (
                                            <div className="text-sm-end">
                                              <Tooltip
                                                title={this.props.t("Copy")}
                                                onClick={
                                                  this.handleCopyAdmissionCond
                                                }
                                                placement="top"
                                              >
                                                <IconButton color="primary">
                                                  <i className="mdi mdi-content-copy blue-noti-icon" />
                                                </IconButton>
                                              </Tooltip>

                                              {showAddButton && (
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
                                              )}
                                            </div>
                                          )}
                                        </Col>
                                      </Row>

                                      <div className="table-responsive">
                                        <BootstrapTable
                                          keyField="Id"
                                          data={admissionConditions}
                                          filter={filterFactory()}
                                          filterPosition="top"
                                          columns={admissionCondColumns}
                                          cellEdit={cellEditFactory({
                                            mode: "click",
                                            blurToSave: true,
                                            afterSaveCell: (
                                              oldValue,
                                              newValue,
                                              row,
                                              column
                                            ) => {
                                              if (
                                                column.dataField !=
                                                  "certificateId" ||
                                                "estimateId"
                                              ) {
                                                this.handleAdmissionConditionDataChange(
                                                  row.Id,
                                                  column.dataField,
                                                  newValue
                                                );
                                              }
                                            },
                                          })}
                                          noDataIndication={this.props.t(
                                            "No Condition found"
                                          )}
                                        />
                                      </div>
                                    </CardText>
                                  </Col>
                                </Row>
                              </TabPane>
                              <TabPane tabId="1">
                                <Row>
                                  <Col sm="12">
                                    <CardText className="mb-0">
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

                                      <Row>
                                        <Col lg="4"></Col>
                                        <Col
                                          lg="4"
                                          className="d-flex align-items-center justify-content-center"
                                        >
                                          <div
                                            style={{
                                              width: "200px",
                                              marginLeft: "5px",
                                            }}
                                          >
                                            <Select
                                              style={{
                                                borderColor: "",
                                                borderWidth: 3,
                                              }}
                                              className="select-style-year"
                                              name="YearId"
                                              key={`year_select`}
                                              options={years.sort(
                                                (a, b) => b.value - a.value
                                              )}
                                              onChange={newValue => {
                                                this.handleSelectYear(
                                                  "YearId",
                                                  newValue,
                                                  currentFacultyId
                                                );
                                              }}
                                              value={defaultYear}
                                              placeholder="Select Year"
                                            />
                                          </div>
                                        </Col>
                                        <Col lg="4">
                                          {visible && (
                                            <div className="text-sm-end">
                                              <Tooltip
                                                title={this.props.t("Copy")}
                                                onClick={
                                                  this.handleCopyAdmissionCond
                                                }
                                                placement="top"
                                              >
                                                <IconButton color="primary">
                                                  <i className="mdi mdi-content-copy blue-noti-icon" />
                                                </IconButton>
                                              </Tooltip>
                                              {showAddButton && (
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
                                              )}
                                            </div>
                                          )}
                                        </Col>
                                      </Row>

                                      <div className="table-responsive">
                                        <BootstrapTable
                                          keyField="Id"
                                          filter={filterFactory()}
                                          filterPosition="top"
                                          data={admissionConditions}
                                          columns={admissionCondColumns}
                                          cellEdit={cellEditFactory({
                                            mode: "click",
                                            blurToSave: true,
                                            afterSaveCell: (
                                              oldValue,
                                              newValue,
                                              row,
                                              column
                                            ) => {
                                              if (
                                                column.dataField !=
                                                  "certificateId" ||
                                                "estimateId"
                                              ) {
                                                this.handleAdmissionConditionDataChange(
                                                  row.Id,
                                                  column.dataField,
                                                  newValue
                                                );
                                              }
                                            },
                                          })}
                                          noDataIndication={this.props.t(
                                            "No Condition found"
                                          )}
                                        />
                                      </div>
                                    </CardText>
                                  </Col>
                                </Row>
                              </TabPane>
                            </TabContent>
                          </CardBody>
                        </Card>
                      </TabPane>
                    ))}
                  </TabContent>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  admissionConditions,
  mobAppFacultyAccs,
  certificates,
  years,
  estimates,
  semesters,
  menu_items,
}) => ({
  admissionConditions: admissionConditions.admissionConditions,
  user_menu: menu_items.user_menu || [],
  deleted: admissionConditions.deleted,
  faculties: mobAppFacultyAccs.faculties,
  certificates: certificates.certificates,
  years: years.years,
  estimates: estimates.estimates,
  currentSemester: semesters.currentSemester,
});

const mapDispatchToProps = dispatch => ({
  onfetchAdmissionSetting: () => dispatch(fetchAdmissionSetting()),
  onGetAdmissionConditions: admissionConditions =>
    dispatch(getAdmissionConditions(admissionConditions)),
  onAddNewAdmissionCondition: admissionCondition =>
    dispatch(addNewAdmissionCondition(admissionCondition)),
  onUpdateAdmissionCondition: admissionCondition =>
    dispatch(updateAdmissionCondition(admissionCondition)),
  onDeleteAdmissionCondition: admissionCondition =>
    dispatch(deleteAdmissionCondition(admissionCondition)),
  onGetAdmissionConditionDeletedValue: () =>
    dispatch(getAdmissionConditionDeletedValue()),
  onCopyAdmissionCond: admissionCondition =>
    dispatch(copyAdmissionCond(admissionCondition)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AdmissionConditionsList));
