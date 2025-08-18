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
  getGradesVersions,
  addNewGradeVersion,
  updateGradeVersion,
  deleteGradeVersion,
  getGradeVersionDeletedValue,
} from "store/gradesVersions/actions";
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
} from "../../utils/menuUtils";
class GradesVersionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradesVersions: [],
      grVersion: "",
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
    };
  }

  componentDidMount() {
    const { gradesVersions, onGetGradesVersions, deleted, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (gradesVersion && !gradesVersions.length) {
    //   onGetGradesVersions();
    // }

    onGetGradesVersions();

    this.setState({ gradesVersions });
    console.log("gradesVersionssssssssssssss", gradesVersions);
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

  handleAddRow = () => {
    console.log("shhhhhhhhhhhh");
    const { onAddNewGradeVersion, gradesVersions } = this.props;

    const newRow = {
      arTitle: "-----",
    };
    console.log("gradesVersionssssssssss", newRow);

    // Check if the same value already exists in the table
    const emptyRowsExist = gradesVersions.some(
      gradesVersions => gradesVersions.arTitle.trim() === "-----"
      // ||
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGradeVersion(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteGradesVersions } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteGradesVersions(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleGradesVersionsDataChange = (rowId, fieldName, fieldValue) => {
    const { gradesVersions, onUpdateGradesVersions } = this.props;

    const isDuplicate = gradesVersions.some(grVersion => {
      return (
        grVersion.Id !== rowId && grVersion.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateGradesVersions(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateGradesVersions(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateGradesVersions } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateGradesVersions(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetGradeVersionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGradeVersionDeletedValue();
  };

  handleErrorClose = () => {
    const { ongetGradeVersionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    ongetGradeVersionDeletedValue();
  };

  render() {
    const { gradesVersions, t, deleted } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
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
        dataField: "arTitle",
        text: this.props.t("Version Title (ar)"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Version Title (en)",
        sort: true,
        //  editable: showEditButton,
      },
      {
        key: "vers-num",
        dataField: "versionNumber",
        text: this.props.t("Version Number"),
        sort: true,
        editable: true,
      },
      {
        dataField: "versionDate",
        text: this.props.t("Version Date"),
        sort: true,
        editable: true,
        editorRenderer: (
          editorProps,
          value,
          row,
          column,
          rowIndex,
          columnIndex
        ) => {
          return (
            <input
              type="date"
              {...editorProps}
              value={value || ""}
              onChange={e => editorProps.onUpdate(e.target.value)}
              className="form-control"
            />
          );
        },
      },
      {
        dataField: "fromYear",
        text: this.props.t("From Year"),
        sort: true,
        editable: true,
      },
      {
        dataField: "toYear",
        text: this.props.t("To Year"),
        sort: true,
        editable: true,
      },
      {
        dataField: "minMark",
        text: this.props.t("Minimum Pass Mark"),
        sort: true,
        editable: true,
      },
      {
        dataField: "uploadFile",
        id: 8,
        key: "file",
        text: this.props.t("Upload Experience Certificate File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => this.handleupload(row.Id, event)}
            >
              {this.props.t("Upload File")}
            </button>
          </div>
        ),
      },

      {
        dataField: "Add",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: gradesVersion => (
          <Tooltip title={this.props.t("Add ")} placement="top">
            <Link className="text-secondary" to="#">
              <i
                className="mdi mdi-plus-circle blue-noti-icon"
                onClick={() => this.handleOnClick(gradesVersion)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: gradesVersions.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("GradesVersions")} />
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
                        data={gradesVersions}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={gradesVersions}
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
                                  data={gradesVersions}
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
                                      this.handlegradesVersionDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No GradesVersions found"
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

const mapStateToProps = ({ gradesVersions, menu_items }) => ({
  gradesVersions: gradesVersions.gradesVersions,
  deleted: gradesVersions.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGradesVersions: () => dispatch(getGradesVersions()),
  onAddNewGradeVersion: grVersion => dispatch(addNewGradeVersion(grVersion)),
  onUpdateGradeVersion: grVersion => dispatch(updateGradeVersion(grVersion)),
  onDeleteGradeVersion: grVersion => dispatch(deleteGradeVersion(grVersion)),
  ongetGradeVersionDeletedValue: () => dispatch(getGradeVersionDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GradesVersionsList));
