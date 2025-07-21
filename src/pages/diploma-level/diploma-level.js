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
  getDiplomaLevels,
  addNewDiplomaLevel,
  updateDiplomaLevel,
  deleteDiplomaLevel,
  getDiplomaLevelDeletedValue,
} from "store/diploma-level/actions";

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

class DiplomaLevelsList extends Component {
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
    const { diplomalevels, onGetDiplomaLevels, deleted, user_menu } =
      this.props;

    this.updatePermissions(user_menu, this.props.location.pathname);

    if (!diplomalevels.length) {
      onGetDiplomaLevels();
    }
  }

  componentDidUpdate(prevProps) {
    const { user_menu, location } = this.props;

    if (
      user_menu !== prevProps.user_menu ||
      location.pathname !== prevProps.location.pathname
    ) {
      this.updatePermissions(user_menu, location.pathname);
    }
  }

  updatePermissions = (menu, pathname) => {
    this.setState({
      showAddButton: checkIsAddForPage(menu, pathname),
      showDeleteButton: checkIsDeleteForPage(menu, pathname),
      showEditButton: checkIsEditForPage(menu, pathname),
      showSearchButton: checkIsSearchForPage(menu, pathname),
    });
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
    const { onAddNewDiplomaLevel, diplomalevels } = this.props;

    const newRow = {
      ardiplomalevel: "-----",
      endiplomalevel: "",
    };

    const emptyRowExists = diplomalevels.some(
      item => item.ardiplomalevel.trim() === "-----"
    );

    if (emptyRowExists) {
      this.setState({ duplicateError: this.props.t("Fill in the empty row") });
    } else {
      this.setState({ duplicateError: null });
      onAddNewDiplomaLevel(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteDiplomaLevel } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteDiplomaLevel(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleDiplomaLevelDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateDiplomaLevel, diplomalevels } = this.props;

    const isDuplicate = diplomalevels.some(
      item =>
        item.Id !== rowId &&
        (item.ardiplomalevel.trim() === fieldValue.trim() ||
          item.endiplomalevel.trim() === fieldValue.trim())
    );

    if (isDuplicate) {
      this.setState({ duplicateError: this.props.t("Value already exists") });
      onUpdateDiplomaLevel({ Id: rowId, [fieldName]: "-----" });
    } else {
      this.setState({ duplicateError: null });
      onUpdateDiplomaLevel({ Id: rowId, [fieldName]: fieldValue });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetDiplomaLevelDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetDiplomaLevelDeletedValue();
  };

  render() {
    const { diplomalevels, t, deleted } = this.props;
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
        dataField: "ardiplomalevel",
        text: t("Diploma Level(ar)"),
        editable: showEditButton,
      },
      {
        dataField: "endiplomalevel",
        text: t("Diploma Level"),
        editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (_, row) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              onClick={() => this.onClickDelete(row)}
            />
          </Link>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: diplomalevels.length,
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
              title={t("DiplomaLevels")}
              breadcrumbItem={t("DiplomaLevels List")}
            />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    {duplicateError && (
                      <Alert color="danger" toggle={this.handleAlertClose}>
                        {duplicateError}
                      </Alert>
                    )}
                    {showAlert && (
                      <Alert
                        color={deleted === 1 ? "success" : "danger"}
                        toggle={
                          deleted === 1
                            ? this.handleSuccessClose
                            : this.handleErrorClose
                        }
                      >
                        {deleted === 1
                          ? t("Deleted Successfully")
                          : t("Can't Delete")}
                      </Alert>
                    )}
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          data={diplomalevels}
                          columns={columns}
                          search
                        >
                          {toolkitprops => (
                            <>
                              <Row className="mb-2">
                                <Col sm="4">
                                  {showSearchButton && (
                                    <SearchBar {...toolkitprops.searchProps} />
                                  )}
                                </Col>
                                {showAddButton && (
                                  <Col sm="8" className="text-sm-end">
                                    <Tooltip title={t("Add")} placement="top">
                                      <IconButton
                                        color="primary"
                                        onClick={this.handleAddRow}
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  </Col>
                                )}
                              </Row>
                              <BootstrapTable
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                                cellEdit={cellEditFactory({
                                  mode: "click",
                                  blurToSave: true,
                                  afterSaveCell: (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    this.handleDiplomaLevelDataChange(
                                      row.Id,
                                      column.dataField,
                                      newValue
                                    );
                                  },
                                })}
                                noDataIndication={t("No DiplomaLevels found")}
                                defaultSorted={[
                                  { dataField: "Id", order: "desc" },
                                ]}
                              />
                              <div className="d-flex justify-content-end mt-2">
                                <PaginationListStandalone
                                  {...paginationProps}
                                />
                              </div>
                            </>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

const mapStateToProps = ({ diplomalevels, menu_items }) => ({
  diplomalevels: diplomalevels.diplomalevels,
  deleted: diplomalevels.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDiplomaLevels: () => dispatch(getDiplomaLevels()),
  onAddNewDiplomaLevel: level => dispatch(addNewDiplomaLevel(level)),
  onUpdateDiplomaLevel: level => dispatch(updateDiplomaLevel(level)),
  onDeleteDiplomaLevel: id => dispatch(deleteDiplomaLevel(id)),
  onGetDiplomaLevelDeletedValue: () => dispatch(getDiplomaLevelDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(DiplomaLevelsList)));
