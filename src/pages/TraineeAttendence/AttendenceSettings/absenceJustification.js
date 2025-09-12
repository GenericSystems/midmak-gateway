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
  getAbsencesJustifications,
  addNewAbsenceJustification,
  updateAbsenceJustification,
  deleteAbsenceJustification,
  getAbsenceJustificationDeletedValue,
} from "store/absenceJustification/actions";
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
class AbsencesJustificationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      absencesJustifications: [],
      absenceJustification: "",
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
    const { absencesJustifications, onGetAbsencesJustifications, deleted, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (absenceJustification && !absencesJustifications.length) {
    //   onGetAbsencesJustifications();
    // }
    onGetAbsencesJustifications();

    this.setState({ absencesJustifications });
    this.setState({ deleted });
    console.log("rsssssssssssssss", absencesJustifications);
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
    const { onAddNewAbsenceJustification, absencesJustifications } = this.props;

    const newRow = {
      arTitle: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = absencesJustifications.some(
      absencesJustifications => absencesJustifications.arTitle.trim() === "-----"
      // ||
      // absenceJustification.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewAbsenceJustification(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteAbsenceJustification } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteAbsenceJustification(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleAbsenceJustificationDataChange = (rowId, fieldName, fieldValue) => {
    const { absencesJustifications, onUpdateAbsenceJustification } = this.props;

    const isDuplicate = absencesJustifications.some(absenceJustification => {
      return (
        absenceJustification.Id !== rowId &&
        absenceJustification.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateAbsenceJustification(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateAbsenceJustification(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateAbsenceJustification } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateAbsenceJustification(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetAbsenceJustificationDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAbsenceJustificationDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetAbsenceJustificationDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAbsenceJustificationDeletedValue();
  };

  render() {
    const { absencesJustifications, t, deleted } = this.props;
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
        text: this.props.t("Absence Reason(ar)"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "enTitle",
        text: this.props.t("Absence Reason(en)"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "acceptableId",
        text: this.props.t("Acceptable"),
        // formatter: (cell, row) => (
        //   <Select
        //     key={`status_grade_${row.Id}`}
        //     options={yesno}
        //     onChange={newValue => {
        //       this.handleSelect(row.Id, "acceptableId", newValue.value);
        //     }}
        //     value={yesno.find(opt => opt.value == row.acceptableId)}
        //   />
        // ),
        // editable: false,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, absenceJustification) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(absenceJustification)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: absencesJustifications.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Absences Justification")} />
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
                        data={absencesJustifications}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={absencesJustifications}
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
                                  data={absencesJustifications}
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
                                      this.handleAbsenceJustificationDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Absence Justification found"
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

const mapStateToProps = ({ absencesJustifications, menu_items }) => ({
  absencesJustifications: absencesJustifications.absencesJustifications,
  deleted: absencesJustifications.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAbsencesJustifications: () => dispatch(getAbsencesJustifications()),
  onAddNewAbsenceJustification: absenceJustification =>
    dispatch(addNewAbsenceJustification(absenceJustification)),
  onUpdateAbsenceJustification: absenceJustification =>
    dispatch(updateAbsenceJustification(absenceJustification)),
  onDeleteAbsenceJustification: absenceJustification =>
    dispatch(deleteAbsenceJustification(absenceJustification)),
  onGetAbsenceJustificationDeletedValue: () => dispatch(getAbsenceJustificationDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AbsencesJustificationsList));
