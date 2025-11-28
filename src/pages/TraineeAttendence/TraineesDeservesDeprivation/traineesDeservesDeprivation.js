import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import classnames from "classnames";
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
  NavItem,
  NavLink,
  Nav,
  Input,
  TabContent,
  TabPane,
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
  getTraineesDeservesDeprivation,
  addNewTraineeDeserveDeprivation,
  updateTraineeDeserveDeprivation,
  deleteTraineeDeserveDeprivation,
  getTraineeDeserveDeprivationDeletedValue,
} from "store/traineesDeservesDeprivation/actions";
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
class TraineesDeservesDeprivationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      traineesDeservesDeprivation: [],
      traineeDeserveDeprivation: "",
      employee: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      activeTab: "5",
      years: [],
      selectedYear: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      editModal: false,
      isEdit: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      modalTraineeDeserveDeprivationValue: [],
      requestNumError: false,
      applyingDateError: false,
      selectedTraineeId: null,
      traineeName: "",
      courseError: false,
      selectedCourseId: null,
      courseName: "",
      testExamError: false,
      selectedTestExam: null,
      selectedRequestType: null,
      selectedRequestStatus: null,
    };
    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      requestStatus,
      years,
      traineesDeservesDeprivation,
      onGetTraineesDeservesDeprivation,
      traineeOpt,
      coursesOffering,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (traineeDeserveDeprivation && !traineesDeservesDeprivation.length) {
    //   onGetTraineesDeservesDeprivation();
    // }
    onGetTraineesDeservesDeprivation();
    this.setState({
      requestStatus,
      traineesDeservesDeprivation,
      deleted,
      coursesOffering,
      traineeOpt,
      years,
    });

    let curentYeardata = localStorage.getItem("authUser");
    if (curentYeardata) {
      try {
        const parsed = JSON.parse(curentYeardata);
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

  toggle1(tab) {
    // console.log(
    //   "000000000000000000111111111111111111111",
    //   this.props.traineesDeservesDeprivation
    // );
    // const { onGetTraineesDeservesDeprivation } = this.props;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }

    // onGetTraineesDeservesDeprivation();
  }

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

  toggleEdit = () => {
    this.setState(prevState => ({
      editModal: !prevState.editModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      traineeDeserveDeprivation: "",
      selectedTraineeId: null,
      traineeName: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteTraineeDeserveDeprivation } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      let onDelete = { Id: selectedRowId.Id };
      onDeleteTraineeDeserveDeprivation(onDelete);

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

  handleSave = values => {
    const {
      isEdit,
      isAdd,
      isOpen,
      selectedTraineeId,
      selectedCourseId,
      selectedTestExam,
    } = this.state;
    const { onAddNewEmployee, onUpdateEmployee } = this.props;
    console.log("values", values);

    values["courseNameId"] = selectedCourseId;
    values["traineeNameId"] = selectedTraineeId;
    values["testExamId"] = selectedTestExam;
    if (
      values.requestNum === "" ||
      values.applyingDate === "" ||
      values.traineeNameId === "" ||
      values.courseNameId === "" ||
      (values.testExamId === "" && selectedTestExam === null)
    ) {
      this.setState({ requestNumError: true, saveError: true });

      this.setState({ applyingDateError: true, saveError: true });

      this.setState({ traineeError: true, saveError: true });

      this.setState({ courseError: true, saveError: true });

      this.setState({ testExamError: true, saveError: true });
      const emptyError = this.props.t("Fill the Required Fields to Save");

      this.setState({ emptyError: emptyError });
    } else {
      this.setState({ requestNumError: false, saveError: false });
      this.setState({ applyingDateError: false, saveError: false });
      this.setState({ traineeError: false, saveError: false });
      this.setState({ courseError: false, saveError: false });
      this.setState({ testExamError: false, saveError: false });

      let employeeinfo = {};

      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          employeeinfo[key] = values[key];
      });
      employeeinfo["courseNameId"] = selectedCourseId;
      employeeinfo["traineeNameId"] = selectedTraineeId;
      employeeinfo["testExamId"] = selectedTestExam;
      this.setState({
        errorMessages: {},
      });

      if (isEdit) {
        console.log("rrrrrrrrrrrrrrr", employeeinfo);
        // onUpdateEmployee(employeeinfo);
      } else if (isAdd) {
        console.log("employeeinfoemployeeinfo", employeeinfo);

        // onAddNewEmployee(employeeinfo);
      }

      const saveEmployeeMessage = "Saved successfully";
      this.setState({
        successMessage: saveEmployeeMessage,
      });

      this.toggle();
    }
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    const { onGetTraineeDeserveDeprivationDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTraineeDeserveDeprivationDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetTraineeDeserveDeprivationDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTraineeDeserveDeprivationDeletedValue();
  };

  handleTraineeDeserveDeprivationClick = arg => {
    console.log("arg", arg);

    this.setState({
      traineeDeserveDeprivation: arg,
      isEdit: true,
    });
    this.toggleEdit();
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "testExamId") {
      this.setState({
        selectedTestExam: selectedValue,
        traineeDeserveDeprivation: values,
      });
    }
    if (fieldName == "requestTypeId") {
      this.setState({
        selectedRequestType: selectedValue,
        traineeDeserveDeprivation: values,
      });
    }
  };

  handleSelectYear = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    // const { onGetCoursesOffering } = this.props;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
    // onGetCoursesOffering();
  };

  render() {
    const traineeDeserveDeprivation = this.state.traineeDeserveDeprivation;
    const employee = this.state.employee;
    const {
      requestStatus,
      coursesOffering,
      traineesOpt,
      traineesDeservesDeprivation,
      t,
      deleted,
      years,
    } = this.props;
    const {
      selectedYear,
      selectedRequestStatus,
      testExamError,
      selectedCourseId,
      courseName,
      courseError,
      traineeError,
      selectedTraineeId,
      applyingDateError,
      requestNumError,
      duplicateError,
      deleteModal,
      modal,
      editModal,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,
    } = this.state;
    const { SearchBar } = Search;
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const selectRow = {
      mode: "checkbox",
      clickToSelect: false,
      selected: traineesDeservesDeprivation
        .filter(row => Number(row.isOffered) === 1)
        .map(row => row.Id),
      selectionRenderer: ({ checked }) => (
        <input
          type="checkbox"
          checked={checked}
          disabled={true}
          className="form-check-input custom-check"
          readOnly
          onChange={() => {}}
        />
      ),
    };

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: traineesDeservesDeprivation.length,
      custom: true,
      page: 1,
    };

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex, extraData) => {
          const currentPage = extraData?.currentPage || 1;
          const sizePerPage = extraData?.sizePerPage || pageOptions.sizePerPage;
          return rowIndex + 1 + (currentPage - 1) * sizePerPage;
        },
        editable: false,
      },
      {
        dataField: "TraineeNum",
        text: this.props.t("Trainee Num"),
        sort: true,
        editable: false,
      },
      {
        dataField: "traineeName",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "CourseName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "code",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "candidatingPercentage",
        text: this.props.t("% Min Percent"),
        sort: true,
        editable: false,
      },
      {
        dataField: "result",
        text: this.props.t("Trainee Result"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, traineeDeserveDeprivation) => (
          <Tooltip title={this.props.t("Edit")} placement="top">
            <IconButton
              onClick={() =>
                this.handleTraineeDeserveDeprivationClick(
                  traineeDeserveDeprivation
                )
              }
            >
              <i className="mdi mdi-plus font-size-18" id="edittooltip"></i>
            </IconButton>
          </Tooltip>
        ),
      },
    ];

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
            <Breadcrumbs
              breadcrumbItem={this.props.t("Trainees Deserves Deprivation")}
            />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div>
                      {duplicateError && (
                        <Alert
                          color="danger"
                          className="d-flex justify-content-center align-items-center alert-Deprivationible fade show"
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
                          className="d-flex justify-content-center align-items-center alert-Deprivationible fade show"
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
                          className="d-flex justify-content-center align-items-center alert-Deprivationible fade show"
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
                        data={traineesDeservesDeprivation}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={traineesDeservesDeprivation}
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
                                  <Col lg="3">
                                    <Select
                                      className="select-style-year"
                                      name="yearId"
                                      key={`yearId`}
                                      options={years}
                                      onChange={newValue => {
                                        this.handleSelectYear(
                                          "yearId",
                                          newValue
                                        );
                                      }}
                                      value={selectedYear}
                                    />
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={traineesDeservesDeprivation}
                                  selectRow={selectRow}
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "dbclick",
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
                                    "No Trainees Deserves Deprivation found"
                                  )}
                                  defaultSorted={defaultSorting}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
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
  traineesDeservesDeprivation,
  years,
  traineesDecrees,
  menu_items,
  employees,
  employmentCases,
  workClassifications,
  trainees,
  classScheduling,
}) => ({
  coursesOffering: classScheduling.coursesOffering,
  workClassifications: workClassifications.workClassifications || [],
  requestStatus: traineesDeservesDeprivation.requestStatus,
  // physicalWorkLocationsOpt: employees.physicalWorkLocationsOpt || [],
  jobRanksOpt: employees.jobRanksOpt || [],
  jobTitlesOpt: employees.jobTitlesOpt || [],
  // corporateNodesOpt: employees.corporateNodesOpt || [],
  traineesOpt: trainees.traineesOpt,
  years: years.years,
  genders: employees.genders,
  nationalitiesOpt: employees.nationalitiesOpt,
  academicYearsOpt: employees.academicYearsOpt,
  employmentCases: employmentCases.employmentCases,
  traineesDeservesDeprivation:
    traineesDeservesDeprivation.traineesDeservesDeprivation,
  genders: employees.genders,
  employeesNames: employees.employeesNames,
  employees: employees.employees,
  deleted: traineesDeservesDeprivation.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTraineesDeservesDeprivation: () =>
    dispatch(getTraineesDeservesDeprivation()),
  onAddNewTraineeDeserveDeprivation: traineeWarning =>
    dispatch(addNewTraineeDeserveDeprivation(traineeWarning)),
  onUpdateTraineeDeserveDeprivation: traineeWarning =>
    dispatch(updateTraineeDeserveDeprivation(traineeWarning)),
  onDeleteTraineeDeserveDeprivation: traineeWarning =>
    dispatch(deleteTraineeDeserveDeprivation(traineeWarning)),
  onGetTraineeDeserveDeprivationDeletedValue: () =>
    dispatch(getTraineeDeserveDeprivationDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(TraineesDeservesDeprivationList)));
