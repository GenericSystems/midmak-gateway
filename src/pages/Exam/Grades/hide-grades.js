import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import {
  Card,
  CardBody,
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
  CardTitle,
} from "reactstrap";
import * as moment from "moment";

import BootstrapTable from "react-bootstrap-table-next";
import DeleteModal from "components/Common/DeleteModal";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getHiddenGrades,
  addNewHiddenGrade,
  updateHiddenGrade,
  deleteHiddenGrade,
  getHiddenGradeDeletedValue,
  getHideReasons,
} from "store/hide-grade/actions";
//store/hide-grade/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsEditForPage,
  checkIsDeleteForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import hiddenGrades from "store/hide-grade/reducer";
class HiddenGradesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCourseId: null,
      selectedHideReasonId: null,
      courseCode: "",
      hiddenGrades: [],
      rows: [],
      hiddenGrade: "",
      showAlert: null,
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
      deleteModal: false,
      showDeleteButton: false,
      deleteModal: false,
      modal: false,
      isEdit: false,
    };
    this.state = {
      duplicateError: null,
      selectedRowId: null,
    };
  }

  componentDidMount() {
    const {
      hiddenGrades,
      onGetHiddenGrades,
      onGetHideReasons,
      user_menu,
      coursesOffering,
      hidereasons,
      deleted,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);

    onGetHiddenGrades();
    onGetHideReasons();

    const mappedHideReasons = (hidereasons || []).map(r => ({
      value: r.Id,
      label: r.arTitle,
    }));

    this.setState({
      hiddenGrades,
      coursesOffering,
      hidereasons: mappedHideReasons,
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

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };
  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
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
  handleAddRow = () => {
    // const { onAddNewHiddenGrade, hiddenGrades } = this.props;
    // console.log("hiddenGrades", hiddenGrades);

    // const newRow = {
    //   courseOfferingId: 0,
    // };
    // console.log("neww roww", newRow);

    // const hasEmptyRow = hiddenGrades.some(row => row.courseOfferingId === null);

    // if (hasEmptyRow) {
    //   const errorMessage = this.props.t("Fill in the empty row first");
    //   this.setState({ duplicateError: errorMessage });
    // } else {
    //   this.setState({ duplicateError: null });
    //   console.log("11111111111");
    //   onAddNewHiddenGrade(newRow);
    // }
    this.toggle();
  };
  onClickDelete = rowId => {
    console.log("roeIDDDDD", rowId);
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  handleDeleteRow = () => {
    const { onDeleteHiddenGrade } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteHiddenGrade(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleEditHiddenGrade = hiddenGrade => {
  console.log("Editing Hidden Grade:", hiddenGrade);

  this.setState({
    hiddenGrade: hiddenGrade, // full object for Formik or modal
    selectedCourseId: hiddenGrade.courseOfferingId,
    courseCode: hiddenGrade.courseCode,
    selectedHideReason: hiddenGrade.hideReasonId,
    fromDate: hiddenGrade.fromDate,
    toDate: hiddenGrade.toDate,
    isEdit: true,
  });

  this.toggle(); // open modal for editing
};

  handleSave = values => {
    console.log("valueessssss", values);
    const { selectedCourseId, courseCode, selectedHideReasonId, isEdit } =
      this.state;

    const { onAddNewHiddenGrade, onUpdateHiddenGrade } = this.props;

    values["courseOfferingId"] = selectedCourseId;
    // values["courseCode"] = courseCode;
    values["hideReasonId"] = selectedHideReasonId;

    console.log("Hidden Grade Form Values:", values);

    let hiddenGradeInfo = {};

    // if (
    //   values.courseOfferingId &&
    //   values.courseCode &&
    //   values.hideReasonId &&
    //   values.fromDate &&
    //   values.toDate
    // ) {

    Object.keys(values).forEach(function (key) {
      if (
        values[key] !== undefined &&
        (values[key].length > 0 || values[key] !== "")
      ) {
        hiddenGradeInfo[key] = values[key];
      }
    });

    if (isEdit) {
      console.log("3333333333333333333", hiddenGradeInfo);

      onUpdateHiddenGrade(hiddenGradeInfo);
    } else {
      console.log("222222222222222222", hiddenGradeInfo);

      onAddNewHiddenGrade(hiddenGradeInfo);
    }

    this.setState({
      errorMessages: {},
    });
    // } else {
    //   console.log("11111111111111", hiddenGradeInfo);
    //   this.setState({ emptyError: "Please fill in the required fields" });
    // // }
    this.toggle();
  };

  handleSuccessClose = () => {
    const { onGetHiddenGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHiddenGradeDeletedValue();
  };
  handleErrorClose = () => {
    const { onGetHiddenGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHiddenGradeDeletedValue();
  };
  handleSelectChange = (fieldName, selectedValue, values) => {
    console.log("selectedValueselectedValue", selectedValue);
    if (fieldName === "courseOfferingId") {
      this.setState({
        selectedCourseId: selectedValue.value,
        courseOfferingId: selectedValue.value,
        courseCode: selectedValue.Code,
        hiddenGrade: values,
      });
    }
    if (fieldName === "hideReasonId") {
      this.setState({
        selectedHideReasonId: selectedValue.value,
        hideReasonId: selectedValue.value,
        hiddenGrade: values,
      });
    }

    console.log(" hideReasonId", selectedValue.value);
  };

  handleSelect = (rowId, fieldName, selectedValue) => {
    console.log("selectedValueselectedValue", selectedValue);
    const { onUpdateHiddenGrade } = this.props;
    let onUpdate;
    if (fieldName === "courseOfferingId") {
      onUpdate = {
        Id: rowId,
        courseOfferingId: selectedValue.value,
        courseCode: selectedValue.Code || "", // auto-fill
      };
      // console.log("onUpdate",onUpdate)
    } else if (fieldName === "hideReasonId") {
      onUpdate = {
        Id: rowId,
        [fieldName]: selectedValue.value,
      };
    }

    onUpdateHiddenGrade(onUpdate);
  };

  handlehiddenGradeDataChange = (rowId, fieldName, fieldValue) => {
    console.log("called");
    const { onUpdateHiddenGrade } = this.props;

    let onUpdate = {
      Id: rowId,
      [fieldName]: fieldValue,
    };
    console.log("onUpdate", onUpdate);
    onUpdateHiddenGrade(onUpdate);
  };

  // handlehiddenGradeDataChange = (rowId, fieldName, fieldValue) => {
  //   const { hiddenGrades, onUpdateHiddenGrade } = this.props;

  //   const isDuplicate = hiddenGrades.some(hiddenGrade => {
  //     return (
  //       hiddenGrade.Id !== rowId &&
  //       hiddenGrade.arTitle.trim() === fieldValue.trim()
  //     );
  //   });

  //   if (isDuplicate) {
  //     const errorMessage = this.props.t("Value already exists");
  //     this.setState({ duplicateError: errorMessage });
  //     let onUpdate = { Id: rowId, [fieldName]: "-----" };
  //     onUpdateHiddenGrade(onUpdate);
  //   } else {
  //     this.setState({ duplicateError: null });
  //     let onUpdate = { Id: rowId, [fieldName]: fieldValue };
  //     onUpdateHiddenGrade(onUpdate);
  //   }
  // };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateHiddenGrade } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateHiddenGrade(onUpdate);
  }
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  handleAddRow = () => {
    this.setState({
      hiddenGrade: "",
      isEdit: false,
    });
    this.toggle();
  };

  render() {
    const { hiddenGrades, t, deleted, coursesOffering, hidereasons } =
      this.props;
    const {
      duplicateError,
      showAlert,
      showAddButton,
      deleteModal,
      modal,
      showDeleteButton,
      isEdit,
      showEditButton,
      showSearchButton,
      hiddenGrade,
      selectedCourseId,
      selectedHideReasonId,
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
        dataField: "courseNameAr",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
      },

      {
        dataField: "Code",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },

      {
        dataField: "fromDate",
        text: this.props.t("From Year"),
        sort: true,
        editable: false,
        formatter: cell => {
          if (!cell) return "";
          const date = new Date(cell);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        },
      },

      {
        dataField: "toDate",
        text: this.props.t("To Year"),
        sort: true,
        editable: false,
        formatter: cell => {
          if (!cell) return "";
          const date = new Date(cell);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        },
      },

      {
        dataField: "hideReasonId",
        text: this.props.t("Hide Reason"),
        sort: true,
        editable: false,
        // formatter: (cell, row) => {
        //   const reason = hidereasons.find(
        //     opt => opt.value === row.hideReasonId
        //   );
        //   return reason ? reason.label : "";
        // },
      },

      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, hiddenGrade) => (
          <div className="d-flex gap-3">
            {/* Edit action */}
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  onClick={() => this.handleEditHiddenGrade(hiddenGrade)}
                ></i>
              </Link>
            </Tooltip>

            {/* Delete action */}
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  onClick={() => this.onClickDelete(hiddenGrade)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: hiddenGrades.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Hide Grades")} />
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
                        data={hiddenGrades}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={hiddenGrades}
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
                                  data={hiddenGrades}
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
                                      this.handlehiddenGradeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No hidden grades found"
                                  )}
                                  defaultSorted={defaultSorting}
                                  filter={filterFactory()}
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
        <Modal
          isOpen={modal} // your modal state
          toggle={this.toggle} // your toggle function
          // gradeVersion={this.state.selectedGradeVersion} // now tied to clicked row
          // gradeVersionId={
          //   this.state.selectedGradeVersionId
          // } // FK
          size="lg"
        >
          <ModalHeader toggle={this.toggle} tag="h4">
            {!!isEdit ? t("Edit Hidden Grade") : t("Add Grades Data")}
          </ModalHeader>

          <ModalBody>
            <Formik
              enableReinitialize={true}
              initialValues={{
                ...(isEdit && {
                  Id: hiddenGrade.Id,
                }),
                courseOfferingId:
                  (hiddenGrade && hiddenGrade.courseOfferingId) || selectedCourseId,
                hideReasonId:
                  (hiddenGrade && hiddenGrade.hideReasonId) ||
                  selectedHideReasonId,

                fromDate: hiddenGrade?.fromDate
                  ? moment
                      .utc(hiddenGrade.fromDate)
                      .local()
                      .format("YYYY-MM-DD")
                  : "",

                toDate: hiddenGrade?.toDate
                  ? moment.utc(hiddenGrade.toDate).local().format("YYYY-MM-DD")
                  : "",
                // courseCode: (hiddenGrade && hiddenGrade.courseCode) || "",
              }}
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
                  <Card>
                    <CardTitle id="course_header">
                      {t("Add Hidden Grade")}
                    </CardTitle>
                    <CardBody>
                      <div className="mb-5">
                        <Row>
                          <Col lg="6">
                            <Row>
                              <Col>
                                <Label for="courseOfferingId">
                                  {this.props.t("Course Name")}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Select
                                  // className={`form-control`}
                                  name="courseOfferingId"
                                  id="courseOfferingId"
                                  key="_course_select_"
                                  options={coursesOffering}
                                  onChange={newValue =>
                                    this.handleSelectChange(
                                      "courseOfferingId",
                                      newValue,
                                      values
                                    )
                                  }
                                  defaultValue={coursesOffering.find(
                                    opt => opt.value === hiddenGrade?.courseOfferingId
                                  )}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg="6">
                            <Row>
                              <Label for="courseCode">
                                {this.props.t("Course Code")}
                              </Label>
                            </Row>
                            <Row>
                              <Col>
                                <Field
                                  type="text"
                                  name="courseCode"
                                  id="courseCode"
                                  value={
                                    this.state.courseCode ||
                                    hiddenGrade.courseCode ||
                                    ""
                                  }
                                  readOnly
                                  className="form-control"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg="6">
                            <Row>
                              <Col>
                                <Label for="fromDate">
                                  {this.props.t("from Date")}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Field
                                  name="fromDate"
                                  className={`form-control`}
                                  type="date"
                                  value={
                                    values.fromDate
                                      ? new Date(values.fromDate)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  id="fromDate-date-input"
                                />
                                {/* {fromDateError && (
                              <div className="invalid-feedback">
                                {this.props.t("Birth Date is required")}
                              </div>
                            )} */}
                              </Col>
                            </Row>
                          </Col>
                          <Col lg="6">
                            <Row>
                              <Col>
                                <Label for="toDate">
                                  {this.props.t("to Date")}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col >
                                <Field
                                  name="toDate"
                                  className={`form-control`}
                                  type="date"
                                  value={
                                    values.toDate
                                      ? new Date(values.toDate)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  id="toDate-date-input"
                                />
                                {/* {toDateError && (
                              <div className="invalid-feedback">
                                {this.props.t("Birth Date is required")}
                              </div>
                            )} */}
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row>
                          <Col className="col-6">
                            <Label for="hideReasonId">
                              {this.props.t("Hide Reason")}
                            </Label>
                          </Col>
                        </Row>
                        <Row>
                            <Col className="col-6">
                            <Select
                              // className={`form-control ${
                              //   // nationalityError ? "is-invalid" : ""
                              // }`}
                              name="hideReasonId"
                              id="hideReasonId"
                              key="_hideReasonselect_"
                              options={hidereasons}
                              onChange={newValue =>
                                this.handleSelectChange(
                                  "hideReasonId",
                                  newValue,
                                  values
                                )
                              }
                              defaultValue={hidereasons.find(
                                opt => opt.value === hiddenGrade?.hideReasonId
                              )}
                            />
                          </Col>
                        

                        </Row>
                        
                      </div>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ hiddenGrades, menu_items, classScheduling }) => ({
  hiddenGrades: hiddenGrades.hiddenGrades,
  hidereasons: hiddenGrades.hidereasons,
  deleted: hiddenGrades.deleted,

  coursesOffering: classScheduling.coursesOffering,

  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetHiddenGrades: () => dispatch(getHiddenGrades()),
  onAddNewHiddenGrade: hiddenGrade => dispatch(addNewHiddenGrade(hiddenGrade)),
  onUpdateHiddenGrade: hiddenGrade => dispatch(updateHiddenGrade(hiddenGrade)),
  onDeleteHiddenGrade: hiddenGrade => dispatch(deleteHiddenGrade(hiddenGrade)),
  onGetHiddenGradeDeletedValue: () => dispatch(getHiddenGradeDeletedValue()),
  onGetHideReasons: () => dispatch(getHideReasons()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HiddenGradesList));
