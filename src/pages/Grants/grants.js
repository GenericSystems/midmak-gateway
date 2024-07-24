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
import Select from "react-select";
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
  getGrants,
  addNewGrant,
  updateGrant,
  deleteGrant,
  getGrantDeletedValue,
} from "store/grants/actions";
import DeleteModal from "components/Common/DeleteModal";
import { isEmpty, size, map } from "lodash";

const GRANT_SPONSOR_STORAGE_KEY = "editableGrant";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class GrantsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grants: [],
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
    const { grants, onGetGrants, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (grants && !grants.length) {
      onGetGrants();
    }
    this.setState({ grants });
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
    const { onAddNewGrant, grants } = this.props;
    const newRow = {
      grantType: "-----",
    };

    const emptyRowsExist = grants.some(
      grant => grant.grantType.trim() === "-----"
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGrant(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteGrant } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteGrant({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleGrantDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateGrant, grants } = this.props;
    let parsedValue = fieldValue;
    let onUpdate;

    if (["grantLevel", "grantOrder", "isBrothersGrant"].includes(fieldName)) {
      if (fieldValue.trim() !== "") {
        parsedValue = parseInt(fieldValue, 10);
        const isValidInteger = Number.isInteger(parsedValue);

        if (!isValidInteger) {
          const errorMessage = this.props.t("Field must be an integer");
          this.setState({ duplicateError: errorMessage });
          onUpdate = { Id: rowId, [fieldName]: null };
          onUpdateGrant(onUpdate);
          return;
        }
      } else {
        parsedValue = null;
      }
    }

    const isDuplicate = grants.some(
      grant =>
        grant.Id !== rowId &&
        grant.grantType &&
        grant.grantType.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateGrant(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      onUpdate = { Id: rowId, [fieldName]: parsedValue };
      onUpdateGrant(onUpdate);
    }
  };

  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateGrant } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    onUpdateGrant(ob);
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handleSuccessClose = () => {
    const { onGetGrantDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGrantDeletedValue();
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
    const { onGetGrantDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGrantDeletedValue();
  };
  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { onUpdateGrant } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateGrant(onUpdate);
  };

  render() {
    const { grants, deleted, t, grantSponsors } = this.props;
    const {
      duplicateError,
      showAlert,
      deleteModal,
      showAddButton,
      showSearchButton,
      showEditButton,
      showDeleteButton,
    } = this.state;
    const modifiedGrantSponsors = grantSponsors.map(sponsor => ({
      value: sponsor.Id,
      label: sponsor.arTitle,
    }));

    const { SearchBar } = Search;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: grants.length,
      custom: true,
    };

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "grantType",
        text: this.props.t("Grant"),
        editable: showEditButton,
      },

      {
        dataField: "grantSponsorId",
        text: t("Grant Sponsor"),
        formatter: (cell, row) => (
          <Select
            key={`grantSponsorId`}
            options={modifiedGrantSponsors}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "grantSponsorId",
                newValue.value
              );
            }}
            value={modifiedGrantSponsors.find(
              opt => opt.value == row.grantSponsorId
            )}
            disabled={!showEditButton}
          />
        ),
        editable: false,
      },
      {
        dataField: "showAdmission",
        text: this.props.t("Show Accepted"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="showAdmission"
            className={`form-check-input input-mini warning}`}
            id="admissionButton"
            defaultChecked={cellContent == 1}
            disabled={!showEditButton}
            onChange={event => this.handleChangeCheckbox(row, "showAdmission")}
          />
        ),
      },
      {
        dataField: "grantDuration",
        text: t("Grant Duration"),
        editable: showEditButton,
      },
      {
        dataField: "grantLevel",
        text: t("Grant Level"),
        editable: showEditButton,
      },
      {
        dataField: "grantOrder",
        text: t("Grant Order"),
        editable: showEditButton,
      },

      {
        dataField: "isBrothersGrant",
        text: t("Siblings Grant"),
        editable: showEditButton,
      },
      {
        dataField: "renewalPossibility",
        text: t("Renewal Possibility"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowAdmission"
            className={`form-check-input input-mini warning}`}
            id="admissionButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, "renewalPossibility")
            }
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "grantStatus",
        text: t("Grant Status"),
        editable: showEditButton,
      },
      {
        dataField: "effectivenessCurSem",
        text: t("Current Semester Effectiveness"),
        editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, grant) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(grant)}
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
              title={this.props.t("Grants")}
              breadcrumbItem={this.props.t("Grants List")}
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
                        data={grants}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={grants}
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
                                  data={grants}
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
                                      this.handleGrantDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Grants found"
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

const mapStateToProps = ({ grants, grantSponsors, menu_items }) => ({
  grants: grants.grants,
  deleted: grants.deleted,
  grantSponsors: grantSponsors.grantSponsors,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGrants: () => dispatch(getGrants()),
  onAddNewGrant: grant => dispatch(addNewGrant(grant)),
  onUpdateGrant: grant => dispatch(updateGrant(grant)),
  onDeleteGrant: grant => dispatch(deleteGrant(grant)),
  onGetGrantDeletedValue: () => dispatch(getGrantDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GrantsList));
