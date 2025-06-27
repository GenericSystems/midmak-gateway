import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getTrainingFormats,
  addNewTrainingFormat,
  updateTrainingFormat,
  deleteTrainingFormat,
  getTrainingFormatDeletedValue,
} from "store/trainingFormat/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class TrainingFormatsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { onGetTrainingFormats, user_menu, location } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetTrainingFormats();
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

  toggleDeleteModal = () => {
    this.setState(prev => ({ deleteModal: !prev.deleteModal }));
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row, deleteModal: true });
  };

  handleAddRow = () => {
    const { trainingFormats, onAddNewTrainingFormat } = this.props;
    const newRow = { arTitle: "-----" };

    const exists = trainingFormats.some(
      item => item.arTitle.trim() === "-----"
    );

    if (exists) {
      this.setState({ duplicateError: this.props.t("Fill in the empty row") });
    } else {
      this.setState({ duplicateError: null });
      onAddNewTrainingFormat(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteTrainingFormat } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId) {
      onDeleteTrainingFormat(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleTrainingFormatChange = (rowId, fieldName, newValue) => {
    const { trainingFormats, onUpdateTrainingFormat } = this.props;

    const isDuplicate = trainingFormats.some(
      format => format.Id !== rowId && format.arTitle.trim() === newValue.trim()
    );

    if (isDuplicate) {
      this.setState({ duplicateError: this.props.t("Value already exists") });
      onUpdateTrainingFormat({ Id: rowId, [fieldName]: "-----" });
    } else {
      this.setState({ duplicateError: null });
      onUpdateTrainingFormat({ Id: rowId, [fieldName]: newValue });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetTrainingFormatDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetTrainingFormatDeletedValue();
  };

  render() {
    const { trainingFormats, deleted, t } = this.props;
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

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Training Format(ar)"),
        sort: true,
      },
      {
        dataField: "enTitle",
        text: t("Training Format(en)"),
        sort: true,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Tooltip title={t("Delete")}>
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                onClick={() => this.onClickDelete(row)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: trainingFormats.length,
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
          <Container fluid>
            <Breadcrumbs breadcrumbItem={t("Training Formats")} />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    {duplicateError && (
                      <Alert color="danger" toggle={this.handleAlertClose}>
                        {duplicateError}
                      </Alert>
                    )}
                    {deleted === 0 && showAlert && (
                      <Alert color="danger" toggle={this.handleErrorClose}>
                        {t("Can't Delete")}
                      </Alert>
                    )}
                    {deleted === 1 && showAlert && (
                      <Alert color="success" toggle={this.handleSuccessClose}>
                        {t("Deleted Successfully")}
                      </Alert>
                    )}
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={columns}
                      data={trainingFormats}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          data={trainingFormats}
                          columns={columns}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  {showSearchButton && (
                                    <SearchBar
                                      {...toolkitprops.searchProps}
                                      placeholder={t("Search...")}
                                    />
                                  )}
                                </Col>
                                <Col sm="8" className="text-sm-end">
                                  {showAddButton && (
                                    <Tooltip title={t("Add")}>
                                      <IconButton
                                        color="primary"
                                        onClick={this.handleAddRow}
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Col>
                              </Row>
                              <BootstrapTable
                                keyField="Id"
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                                columns={columns}
                                data={trainingFormats}
                                cellEdit={cellEditFactory({
                                  mode: "click",
                                  blurToSave: true,
                                  afterSaveCell: (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    this.handleTrainingFormatChange(
                                      row.Id,
                                      column.dataField,
                                      newValue
                                    );
                                  },
                                })}
                                noDataIndication={t(
                                  "No Training Formats found"
                                )}
                                defaultSorted={[
                                  { dataField: "Id", order: "desc" },
                                ]}
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
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ trainingFormats, menu_items }) => ({
  trainingFormats: trainingFormats.trainingFormats || [],
  deleted: trainingFormats.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTrainingFormats: () => dispatch(getTrainingFormats()),
  onAddNewTrainingFormat: data => dispatch(addNewTrainingFormat(data)),
  onUpdateTrainingFormat: data => dispatch(updateTrainingFormat(data)),
  onDeleteTrainingFormat: data => dispatch(deleteTrainingFormat(data)),
  onGetTrainingFormatDeletedValue: () =>
    dispatch(getTrainingFormatDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(TrainingFormatsList)));
