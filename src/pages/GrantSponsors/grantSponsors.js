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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "components/Common/Breadcrumb";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import {
  getGrantSponsors,
  addNewGrantSponsor,
  updateGrantSponsor,
  deleteGrantSponsor,
  getGrantSponsorDeletedValue,
} from "store/grantSponsors/actions";
import DeleteModal from "components/Common/DeleteModal";
import { isEmpty, size, map } from "lodash";

const GRANT_SPONSOR_STORAGE_KEY = "editableGrantSponsor";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class GrantSponsors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grantSponsors: [],
      grant: "",
      duplicateError: null,
      showAlert: null,
      deleteModal: false,
      selectedRowId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }

  componentDidMount() {
    const { grantSponsors, onGetGrantSponsors, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (grantSponsors && !grantSponsors.length) {
      onGetGrantSponsors();
    }
    this.setState({ grantSponsors });
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

  handleAddRow = () => {
    const { onAddNewGrantSponsor, grantSponsors } = this.props;
    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist = grantSponsors.some(
      grantSponsor => grantSponsor.arTitle.trim() === "-----"
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGrantSponsor(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteGrantSponsor } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteGrantSponsor({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleGrantSponsorDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateGrantSponsor, grantSponsors } = this.props;

    const isDuplicate = grantSponsors.some(
      grantSponsor =>
        grantSponsor.Id !== rowId &&
        ((grantSponsor.arTitle &&
          grantSponsor.arTitle.trim() === fieldValue.trim()) ||
          (grantSponsor.enTitle &&
            grantSponsor.enTitle.trim() === fieldValue.trim()))
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateGrantSponsor(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateGrantSponsor(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handleSuccessClose = () => {
    const { onGetGrantSponsorDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGrantSponsorDeletedValue();
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
  handleErrorClose = () => {
    const { onGetGrantSponsorDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGrantSponsorDeletedValue();
  };
  render() {
    const { grantSponsors, deleted } = this.props;
    const {
      duplicateError,
      showAlert,
      deleteModal,
      showSearchButton,
      showEditButton,
      showAddButton,
      showDeleteButton,
    } = this.state;
    const { SearchBar } = Search;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: grantSponsors.length,
      custom: true,
    };

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("GrantSponsor(ar)"),
        editable: showEditButton,
      },
      { dataField: "enTitle", text: "GrantSponsor", editable: showEditButton },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, grantSponsor) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(grantSponsor)}
            ></i>
          </Link>
        ),
      },
    ];

    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
    };
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
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
            <Breadcrumbs
              title={this.props.t("GrantSponsors")}
              breadcrumbItem={this.props.t("GrantSponsors List")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
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
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={grantSponsors}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={grantSponsors}
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
                                          title={this.props.t("Add new")}
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
                                  data={grantSponsors}
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
                                      this.handleGrantSponsorDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No GrantSponsors found"
                                  )}
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
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ grantSponsors, menu_items }) => ({
  grantSponsors: grantSponsors.grantSponsors,
  deleted: grantSponsors.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGrantSponsors: () => dispatch(getGrantSponsors()),
  onAddNewGrantSponsor: grant => dispatch(addNewGrantSponsor(grant)),
  onUpdateGrantSponsor: grant => dispatch(updateGrantSponsor(grant)),
  onDeleteGrantSponsor: grant => dispatch(deleteGrantSponsor(grant)),
  onGetGrantSponsorDeletedValue: () => dispatch(getGrantSponsorDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GrantSponsors));
