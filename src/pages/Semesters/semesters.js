import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
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
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "components/Common/Breadcrumb";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import {
  getSemesters,
  getCurrentSemester,
  addNewSemester,
  updateSemester,
  deleteSemester,
  getSemesterDeletedValue,
} from "store/semesters/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, size, map } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
const SEMESTER_STORAGE_KEY = "editableSemester";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class SemestersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semesters: [],
      semester: "",
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }

  componentDidMount() {
    const {
      user_menu,
      semesters,
      onGetSemesters,
      currentSemester,
      onGetCurrentSemester,
      deleted,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (semesters && !semesters.length) {
      onGetSemesters();
      onGetCurrentSemester();
    }
    this.setState({ semesters });
    this.setState({ currentSemester });
    this.setState({ deleted });
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
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
/* 
  handleAddRow = () => {
    const { onAddNewSemester, semesters } = this.props;
    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };
    const emptyRowsExist = semesters.some(
      semester => semester.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewSemester(newRow);
    }
  }; */

  handleAddRow = () => {
    const { onAddNewSemester, semesters } = this.props;
    const newRow = {
      arTitle: "-----",
      enTitle: "",
      semesterCode: "", 
    };
  
    const arTitleEmpty = semesters.some(
      semester => semester.arTitle.trim() === "-----" 
    );

    const codeEmpty = semesters.some(
      semester => semester.semesterCode.trim() === ""
    );
  
    if (arTitleEmpty) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    }
    else if (!arTitleEmpty && codeEmpty) {
      const errorMessage = this.props.t("Semester Code is required");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewSemester(newRow);
    }
  };
  

  handleDeleteRow = () => {
    const { onDeleteSemester } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteSemester(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleSemesterDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateSemester, semesters } = this.props;
    /* let obUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateSemester(obUpdate);  */

    const isDuplicate = semesters.some(
      semester =>
        semester.Id !== rowId &&
        ((semester.arTitle && semester.arTitle.trim()) === fieldValue.trim() ||
          (semester.enTitle && semester.enTitle.trim()) === fieldValue.trim())
    );

    const codeEmpty = semesters.some(
      semester => semester.semesterCode.trim() === ""
    );
  


    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateSemester(onUpdate);
    } else  if (codeEmpty) {
      const errorMessage = this.props.t("Semester Code is required");
      this.setState({ duplicateError: errorMessage });
    }else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateSemester(onUpdate);
    }
  };

  handleActiveToggle = (rowId, currentStatus) => {
    const { onUpdateSemester } = this.props;
    onUpdateSemester({ Id: rowId, active: currentStatus === 1 ? 0 : 1 });
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetSemesterDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetSemesterDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetSemesterDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetSemesterDeletedValue();
  };
  render() {
    const { semesters, currentSemester, deleted } = this.props;
    const { SearchBar } = Search;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete ")
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
        dataField: "arTitle",
        text: this.props.t("Semester(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Semester",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "semesterNum",
        text: this.props.t("Semester Number"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "semesterCode",
        text: this.props.t("semesterCode"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "active",
        text: this.props.t("Active"),
        editable: false,
        formatter: (cellContent, semester) => (
          <div>
            <IconButton
              color="primary"
              onClick={() =>
                this.handleActiveToggle(semester.Id, semester.active)
              }
            >
              {semester.active ? (
                <i
                  className="bx bx-radio-circle-marked"
                  style={{ color: "green" }}
                />
              ) : (
                <i className="bx bx-radio-circle" style={{ color: "red" }} />
              )}
            </IconButton>
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(semester)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: semesters.length,
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
            <Breadcrumbs
              title={this.props.t("Semesters")}
              breadcrumbItem={this.props.t("Semesters List")}
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
                        data={semesters}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={semesters}
                            columns={columns}
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
                                  <Col sm="8">
                                    {showAddButton && (
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
                                    )}
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={semesters}
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
                                      this.handleSemesterDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Semesters found"
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

const mapStateToProps = ({ menu_items, semesters }) => ({
  semesters: semesters.semesters,
  deleted: semesters.deleted,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetSemesters: () => dispatch(getSemesters()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
  onAddNewSemester: semester => dispatch(addNewSemester(semester)),
  onUpdateSemester: semester => dispatch(updateSemester(semester)),
  onDeleteSemester: semester => dispatch(deleteSemester(semester)),
  onGetSemesterDeletedValue: () => dispatch(getSemesterDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SemestersList));
