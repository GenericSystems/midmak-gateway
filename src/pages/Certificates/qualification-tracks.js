import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import DeleteModal from "components/Common/DeleteModal";
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
  CardTitle,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import Tooltip from "@mui/material/Tooltip";
import {
  getQualificationsTracks,
  addNewQualificationTrack,
  updateQualificationTrack,
  deleteQualificationTrack,
  getQualificationTrackDeletedValue,
} from "store/qualification-tracks/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";

const QUALIFICATION_TRACK_STORAGE_KEY = "editableQualificationTrack";

import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class QualificationsTracksList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qualificationTracks: [],
      qualificationTrack: "",
      showAlert: null,
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      duplicateError: null,
      deleteModal: false,
    };
  }

  componentDidMount() {
    const { qualificationTracks, onGetQualificationsTracks, deleted, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (qualificationTracks && !qualificationTracks.length) {
    //   onGetQualificationsTracks();
    // }
    onGetQualificationsTracks();
    this.setState({ qualificationTracks });
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
    const { onAddNewQualificationTrack, qualificationTracks } = this.props;
    const newRow = {
      arTitle: "-----",
    };

    const emptyRowsExist = qualificationTracks.some(
      qualificationTrack => qualificationTrack.arTitle.trim() === "-----"
      // ||
      // qualificationTrack.facultyId.trim() === ""
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewQualificationTrack(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteQualificationTrack } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteQualificationTrack(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleQualificationTrackDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateQualificationTrack, qualificationTracks } = this.props;

    const isDuplicate = qualificationTracks.some(
      qualificationTrack =>
        qualificationTrack.Id !== rowId && qualificationTrack.arTitle.trim() === fieldValue.trim()
      // qualificationTrack.facultyId.trim() === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateQualificationTrack(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateQualificationTrack(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, selectedValue) {
    const { onUpdateQualificationTrack } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateQualificationTrack(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetQualificationTrackDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetQualificationTrackDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetQualificationTrackDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetQualificationTrackDeletedValue();
  };
  render() {
    const { qualificationTracks, t, deleted } = this.props;
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
      deleted == 0 ? t("Can't Delete") : t("Deleted Successfully");
    const { SearchBar } = Search;
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
        text: this.props.t("Qualification Track(ar)"),
        sort: true,
        // editable: showEditButton,
      },

      {
        dataField: "enTitle",
        text: this.props.t("Qualification Track (en)"),
        sort: true,
        // editable: showEditButton,
      },
      {
        dataField: "code",
        text: this.props.t("Code"),
        sort: true,
        // editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        // hidden: !showDeleteButton,
        formatter: (cellContent, qualificationTrack) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(qualificationTrack)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: qualificationTracks.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("QualificationsTracks List")} />

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
                        data={qualificationTracks}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={qualificationTracks}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                          placeholder={t("Search...")}
                                        />
                                      </div>
                                    </div>
                                  </Col>

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
                                  data={qualificationTracks}
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
                                      this.handleQualificationTrackDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No QualificationsTracks found"
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

const mapStateToProps = ({ qualificationTracks, menu_items }) => ({
  qualificationTracks: qualificationTracks.qualificationTracks,
  deleted: qualificationTracks.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetQualificationsTracks: () => dispatch(getQualificationsTracks()),
  onAddNewQualificationTrack: qualificationTrack => dispatch(addNewQualificationTrack(qualificationTrack)),
  onUpdateQualificationTrack: qualificationTrack => dispatch(updateQualificationTrack(qualificationTrack)),
  onDeleteQualificationTrack: qualificationTrack => dispatch(deleteQualificationTrack(qualificationTrack)),
  onGetQualificationTrackDeletedValue: () => dispatch(getQualificationTrackDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(QualificationsTracksList));
