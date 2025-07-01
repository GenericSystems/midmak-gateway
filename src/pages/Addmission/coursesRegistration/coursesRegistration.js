import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  FormGroup,
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
  getCoursesRegistration,
  getAllCoursesRegistration,
  addNewCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  getCourseRegistrationDeletedValue,
} from "store/courses-registration/actions";
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
import { coursesRegistration } from "common/data";
import courses from "store/courses/reducer";
class CoursesRegistrationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursesRegistration: [],
      sectors: [],
      trainingFormats: [],
      certificateTypes: [],
      courseRegistration: "",
      activeTab1: "5",
      activeTab2: "5",
      selectConId: null,
      showAlert: null,
      selectedCourse: null,
      ifUpdateCourse: 0,
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
      errorMessage: null,
      successMessage: null,
      values: "",
      modalContractValue: [],
    };
    this.toggle1 = this.toggle1.bind(this);
  }

  componentDidMount() {
    const {
      coursesRegistration,
      onGetCoursesRegistration,
      onGetAllCoursesRegistration,
      allCoursesRegistration,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetCoursesRegistration();
    onGetAllCoursesRegistration();
    this.setState({
      coursesRegistration,
      allCoursesRegistration,
      deleted,
    });

    console.log("rsssssssssssssss", coursesRegistration);
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

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      courseRegistration: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleChangeCheckbox = (row, currentStatus, fieldName) => {
    const {
      onUpdateCourseRegistration,
      onAddNewCourseRegistration,
      onDeleteCourseRegistration,
      onGetCoursesRegistration,
      onGetAllCoursesRegistration,
    } = this.props;
    const { showAll } = this.state;

    const newRow = {
      Id: row.Id,
      courseId: row.courseId,
      courseCode: row.courseCode,
      isCompletedStudy:
        fieldName === "isCompletedStudy"
          ? currentStatus
            ? 1
            : 0
          : row.isCompletedStudy,
      isOnlyExam:
        fieldName === "isOnlyExam" ? (currentStatus ? 1 : 0) : row.isOnlyExam,
      queryname: "_courseOffering",
      fieldName: fieldName,
      fieldValue: currentStatus ? 1 : 0,
    };

    if (!newRow.isCompletedStudy && !newRow.isOnlyExam) {
      onAddNewCourseRegistration(newRow);
      onDeleteCourseRegistration({ Id: row.Id });
    } else {
      if (row.Id) {
        onUpdateCourseRegistration(newRow);
      } else {
        onDeleteCourseRegistration({ Id: row.Id });
      }
    }
    if (showAll == false) {
      onGetCoursesRegistration();
      this.setState({ ifUpdateCourse: 0 });
    } else {
      onGetAllCoursesRegistration();
      this.setState({ ifUpdateCourse: 1 });
    }
  };

  handleViewAll = isChecked => {
    const { onGetAllCoursesRegistration, onGetCoursesRegistration } =
      this.props;
    this.setState({ showAll: isChecked }, () => {
      if (isChecked) {
        onGetAllCoursesRegistration();
      } else {
        onGetCoursesRegistration();
      }
    });
  };

  toggle1(tab) {
    const { onGetCoursesRegistration } = this.props;
    const { ifUpdateCourse } = this.state;
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
    if (ifUpdateCourse != 0) {
      onGetCoursesRegistration();
      this.setState({ ifUpdateCourse: 0 });
    }

    document.getElementById("square-switch1").checked = false;
  }

  // handleDeleteRow = () => {
  //   const { onDeleteContract } = this.props;
  //   const { selectedRowId } = this.state;

  //   if (selectedRowId !== null) {
  //     onDeleteContract(selectedRowId);

  //     this.setState({
  //       selectedRowId: null,
  //       deleteModal: false,
  //       showAlert: true,
  //     });
  //   }
  // };

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

  handleCheckboxAddOfferedCourseOrDelete = (row, currentStatus, fieldName) => {
    console.log("Checkbox clicked", { row, currentStatus, fieldName });
    const { onAddNewCourseRegistration, onDeleteCourseRegistration } =
      this.props;
    const newStatus = currentStatus ? 1 : 0;
    if (fieldName === "isOffered" && newStatus === 0) {
      onDeleteCourseRegistration({ Id: row.Id });
    } else if (newStatus === 1) {
      const newRow = {
        Id: row.Id,
        courseId: row.courseId,
        courseCode: row.courseCode,
        isOffered: 1,
        isCompletedStudy: row.isCompletedStudy ?? 0,
        isOnlyExam: row.isOnlyExam ?? 0,
        // queryname: "_courseOffering",
      };

      onAddNewCourseRegistration(newRow);
    }
  };

  render() {
    const courseRegistration = this.state.coursesRegistration;
    const {
      coursesRegistration,
      t,
      deleted,
      sectors,
      trainingFormats,
      certificateTypes,
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
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      modalContractValue,
      selectedCourse,
    } = this.state;
    const trainingSectorOptions = sectors;
    const trainingFormatOptions = trainingFormats;
    const trainingProgramOptions = certificateTypes;
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
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Course Name (ar)"),
        editable: false,
        sort: true,
      },
      {
        dataField: "enTitle",
        text: this.props.t("Course Name (en)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "Code",
        text: t("Course Code"),
        editable: false,
        sort: true,
      },
      {
        dataField: "sectorId",
        text: this.props.t("Training Sector"),
        sort: true,
        editable: false,
        formatter: (cell, row) => {
          console.log("sectorId:", row.sectorId);
          const option = trainingSectorOptions.find(
            opt => opt.value === row.sectorId
          );
          console.log("sectorId:", row.sectorId, "=>", option);
          return option ? option.label : "";
        },
      },
      {
        dataField: "trainingFormatId",
        text: t("Traning Format"),
        editable: false,
        sort: true,
        formatter: (cell, row) => {
          const option = trainingFormatOptions.find(
            opt => opt.value === row.trainingFormatId
          );
          return option ? option.label : "";
        },
      },
      {
        dataField: "programId",
        text: this.props.t("Training Program"),
        sort: true,
        editable: false,
        formatter: (cell, row) => {
          const option = trainingProgramOptions.find(
            opt => opt.value === row.programId
          );
          return option ? option.label : "";
        },
      },
      {
        dataField: "isOffered",
        text: t("isOffered"),
        editable: false,
        hidden: true,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            className={`form-check-input input-mini warning`}
            id={`isOffered-${row.Id}`}
            checked={cellContent == 1}
            onChange={event =>
              this.handleCheckboxAddOfferedCourseOrDelete(
                row,
                event.target.checked,
                "isOffered"
              )
            }
          />
        ),
      },
      {
        key: "isCompletedStudy",
        dataField: "isCompletedStudy",
        text: t("Completed Study"),
        editable: false,

        formatter: (cellContent, row, column) => {
          return (
            <div className="form-check form-switch form-switch-md mb-3 ">
              <input
                type="checkbox"
                className="form-check-input"
                id={`isCompletedStudy-${row.Id}`}
                defaultChecked={cellContent === 1}
                onChange={event => {
                  this.handleChangeCheckbox(
                    row,
                    event.target.checked,
                    "isCompletedStudy"
                  );
                }}
                // disabled={row.isOffered === 0}
              />
            </div>
          );
        },
      },

      {
        key: "isOnlyExam",
        dataField: "isOnlyExam",
        text: t("Only Exams"),
        editable: false,

        formatter: (cellContent, row, column) => {
          const isDisabled = !row.isOffered;

          return (
            <div className="form-check form-switch form-switch-md mb-3 ">
              <input
                type="checkbox"
                className="form-check-input"
                id={`isOnlyExam-${row.Id}`}
                defaultChecked={row.isOnlyExam === 1}
                onChange={event => {
                  this.handleChangeCheckbox(
                    row,
                    event.target.checked,
                    "isOnlyExam"
                  );
                }}
                // disabled={row.isOffered === 0}
              />
            </div>
          );
        },
      },
    ];
    // const columns2 = [
    //   { dataField: "Id", text: t("ID"), hidden: true },
    //   {
    //     dataField: "arTitle",
    //     text: t("Course Name"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "courseCode",
    //     text: t("Course Code"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "nbHours",
    //     text: t("Number of Hours"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "courseType",
    //     text: t("Course Type"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "numOfSections ",
    //     text: t("Number of Sections"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "numOfLabs ",
    //     text: t("Number of Labs"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "courses",
    //     text: t("Courses"),
    //     editable: false,
    //     sort: true,
    //   },
    //   {
    //     dataField: "menu",
    //     isDummyField: true,
    //     editable: false,
    //     text: this.props.t(""),
    //     formatter: (cellContent, branch) => (
    //       <div
    //         className="d-flex gap-3"
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <Tooltip title={t("Sections & Labs")} placement="top">
    //           <Link className="section-button text-secondary" to="#">
    //             <i
    //               className="bx bx-calendar-event font-size-18"
    //               id="edittooltip"
    //               onClick={() => this.handleEditBranch(branch)}
    //             ></i>
    //           </Link>
    //         </Tooltip>
    //       </div>
    //     ),
    //   },
    // ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: coursesRegistration.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("CoursesRegistration")} />
            <div className="checkout-tabs"></div>
            <Row>
              <Card>
                <CardTitle className="h4"></CardTitle>
                <Row>
                  <Col md="3">
                    <Nav pills className="flex-column">
                      <NavItem>
                        <NavLink
                          id="vertical-home-link"
                          style={{ cursor: "pointer" }}
                          className={`nav-link ${
                            this.state.activeTab1 === "5" ? "active" : ""
                          }`}
                          onClick={() => {
                            this.toggle1("5");
                          }}
                        >
                          {this.props.t("Course Offering")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          id="vertical-home-link"
                          style={{ cursor: "pointer" }}
                          className={`nav-link ${
                            this.state.activeTab1 === "6" ? "active" : ""
                          }`}
                          onClick={() => {
                            this.toggle1("6");
                          }}
                        >
                          {this.props.t("Classes")}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col md="9">
                    <TabContent
                      activeTab={this.state.activeTab1}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="5">
                        <PaginationProvider
                          pagination={paginationFactory(pageOptions)}
                          keyField="Id"
                          columns={columns}
                          data={coursesRegistration}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="Id"
                              data={coursesRegistration}
                              columns={columns}
                              search
                            >
                              {toolkitprops => (
                                <React.Fragment>
                                  <Row className="mb-2">
                                    <Col sm="4">
                                      <div className="search-box ms-2 mb-2 d-inline-block">
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                            placeholder={t("Search...")}
                                          />
                                          <i className="bx bx-search-alt search-icon" />
                                        </div>
                                      </div>
                                    </Col>
                                    <Col sm="5"></Col>
                                    <Col sm="1">
                                      <Tooltip
                                        title={t("View All")}
                                        placement="top"
                                      >
                                        <div className="square-switch square-switch-view">
                                          <input
                                            type="checkbox"
                                            id="square-switch1"
                                            switch="none"
                                            onChange={event => {
                                              this.handleViewAll(
                                                event.target.checked
                                              );
                                            }}
                                          />
                                          <label
                                            htmlFor="square-switch1"
                                            data-on-label="View"
                                            data-off-label="Off"
                                          />
                                        </div>
                                      </Tooltip>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      keyField="Id"
                                      data={coursesRegistration}
                                      columns={columns}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                      })}
                                      noDataIndication={t(
                                        "No Courses Registration"
                                      )}
                                    />
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
                      </TabPane>
                      {/* <TabPane tabId="6">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions2)}
                        keyField="id"
                        columns={columns2}
                        data={classes}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="id"
                            columns={columns2}
                            data={classes}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row className="mb-2">
                                  <Col sm="3">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                        />
                                        <i className="bx bx-search-alt search-icon" />
                                      </div>
                                    </div>
                                  </Col>
                                  <Col>
                                    <label className="cu-Semes form-label mt-1">
                                      {selectedCourse &&
                                        selectedCourse["label"]}{" "}
                                    </label>
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
                    </TabPane> */}
                    </TabContent>
                  </Col>
                </Row>
              </Card>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  coursesCatalogs,
  coursesRegistration,
  sectors,
  certificateTypes,
  trainingFormats,
  menu_items,
}) => ({
  coursesRegistration: coursesRegistration.coursesRegistration,
  allCoursesRegistration: coursesRegistration.allCoursesRegistration,
  coursesCatalogs: coursesCatalogs.coursesCatalogs,
  sectors: sectors.sectors,
  certificateTypes: certificateTypes.certificateTypes,
  trainingFormats: trainingFormats.trainingFormats,
  deleted: coursesRegistration.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCoursesRegistration: () => dispatch(getCoursesRegistration()),
  onGetAllCoursesRegistration: () => dispatch(getAllCoursesRegistration()),
  // onAddNewContract: contract => dispatch(addNewContract(contract)),
  // onUpdateContract: contract => dispatch(updateContract(contract)),
  // onDeleteContract: contract => dispatch(deleteContract(contract)),
  // onGetContractDeletedValue: () => dispatch(getContractDeletedValue()),
  // onGetJobRanksOpt: () => dispatch(getJobRanksOpt()),
  // onGetJobTitlesOpt: () => dispatch(getJobTitlesOpt()),
  // onGetAcademicYearsOpt: () => dispatch(getAcademicYearsOpt()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(CoursesRegistrationList)));
