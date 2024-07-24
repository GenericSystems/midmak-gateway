import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "components/Common/Breadcrumb";
import { Editor } from "react-bootstrap-table2-editor";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Label,
  Alert,
  Form,
  CardTitle,
  Table,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import DeleteModal from "components/Common/DeleteModal";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import {
  getAcademicLoads,
  addNewAcademicLoad,
  updateAcademicLoad,
  deleteAcademicLoad,
  getAcademicLoadDeletedValue,
} from "store/academicloads/actions";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class AcademicLoadList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      deleteModal: false,
      currentValueWarning: null,
      oldWarning: [],
      options: [],
      combinedOptions: [],
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.academicLoads !== prevProps.academicLoads ||
      this.props.warnings !== prevProps.warnings
    ) {
      this.updateFilteredWarnings();
    }
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

  updateFilteredWarnings() {
    const { academicLoads, warnings } = this.props;
    const filteredWarnings = warnings
      .filter(
        warning =>
          !academicLoads.some(
            academicLoad => academicLoad.statusId === warning.key
          )
      )
      .map(warning => <option key={warning.key} value={warning.value} />);

    this.setState({ filteredWarnings });
  }

  componentDidMount() {
    const { academicLoads, onGetAcademicLoads, deleted, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (academicLoads && !academicLoads.length) {
      onGetAcademicLoads();
    }
    this.setState({ academicLoads, deleted });
    this.updateFilteredWarnings();
  }

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
    const { onAddNewAcademicLoad, academicLoads } = this.props;
    const newRow = {
      maxNbRegularHour: 0,
      minNbRegularHour: 0,
      maxNbSummerHour: 0,
      minNbSummerHour: 0,
    };

    const emptyRowsExist = academicLoads.some(
      academicLoad => academicLoad.statusId === null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewAcademicLoad(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteAcademicLoad } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteAcademicLoad(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleacadmicLoadDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateAcademicLoad, academicLoads } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateAcademicLoad(onUpdate);
  };

  handleSelectRequiredWarning = (rowId, fieldName, selectedValue, oldValue) => {
    const { warnings, onUpdateAcademicLoad, academicLoads } = this.props;

    const selectWar = warnings.find(warning => warning.key == oldValue);
    this.setState({ oldWarning: selectWar });

    const warningObj = warnings.find(
      warning => warning.value === selectedValue // &&  warning.key != oldValue
    );

    if (warningObj) {
      this.setState({ oldWarning: {} });
      const isDuplicate = academicLoads.some(
        academicLoad =>
          academicLoad.Id !== rowId && academicLoad.statusId === warningObj.key
      );
      if (isDuplicate) {
        const errorMessage = this.props.t("Value already exists");
        this.setState({ duplicateError: errorMessage });
        let onUpdate = { Id: rowId, [fieldName]: null };
        onUpdateAcademicLoad(onUpdate);
      } else {
        this.setState({ duplicateError: null });
        let onUpdate = { Id: rowId, [fieldName]: warningObj.key };
        onUpdateAcademicLoad(onUpdate);
      }
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetAcademicLoadDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAcademicLoadDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetAcademicLoadDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAcademicLoadDeletedValue();
  };

  render() {
    const { t, academicLoads, warnings, deleted } = this.props;
    const {
      duplicateError,
      deleteModal,
      currentValueWarning,
      oldWarning,
      filteredWarnings,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "statusId",
        text: this.props.t("Student Status"),
        formatter: (cell, row) => (
          <div className="col-9">
            <Input
              type="text"
              id="statusId"
              list="WarningOptionlist"
              className="form-control"
              defaultValue={
                (warnings.find(warning => warning.key === row.statusId) || "")
                  .value
              }
              onChange={event => {
                this.handleSelectRequiredWarning(
                  row.Id,
                  "statusId",
                  event.target.value,
                  row.statusId
                );
              }}
              autoComplete="off"
              disabled={!showEditButton}
            />

            <datalist id="WarningOptionlist">
              {warnings.map(warning => (
                <option key={warning.key} value={warning.value} />
              ))}
            </datalist>
          </div>
        ),

        editable: false,
      },

      {
        dataField: "minNbRegularHour",
        text: this.props.t("minimum nb hours"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue >= row.maxNbRegularHour) {
            return {
              valid: false,
              message: "Minimum nb hours must be less than Maximum nb hours",
            };
          }
          return true;
        },
      },
      {
        dataField: "maxNbRegularHour",
        text: this.props.t("Maximum nb hours"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue <= row.minNbRegularHour) {
            return {
              valid: false,
              message: "Maximum nb hours must be greater than Minimum nb hours",
            };
          }
          return true;
        },
      },
      {
        dataField: "minNbSummerHour",
        text: this.props.t("minimum nb hours"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue >= row.maxNbSummerHour) {
            return {
              valid: false,
              message: "Minimum nb hours must be less than Maximum nb hours",
            };
          }
          return true;
        },
      },
      {
        dataField: "maxNbSummerHour",
        text: this.props.t("Maximum nb hours"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue <= row.minNbSummerHour) {
            return {
              valid: false,
              message: "Maximum nb hours must be greater than Minimum nb hours",
            };
          }
          return true;
        },
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, AcademicLoad) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(AcademicLoad)}
            ></i>
          </Link>
        ),
      },
    ];

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: academicLoads.length,
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
              title={this.props.t("AcademicLoads")}
              breadcrumbItem={this.props.t("AcademicLoad List")}
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
                        data={academicLoads}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={academicLoads}
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

                                <Row>
                                  <Col md="2"></Col>

                                  <Col
                                    md="4"
                                    className="d-flex justify-content-center border border-2 background-h6"
                                  >
                                    <div className="ml-2 p-2 text-center h6">
                                      {this.props.t(
                                        "Number of regular semester hours"
                                      )}
                                    </div>
                                  </Col>

                                  <Col md="1"></Col>
                                  <Col
                                    md="4"
                                    className="d-flex justify-content-center border border-2 background-h6"
                                  >
                                    <div className="ml-2 p-2 text-center h6 ">
                                      {this.props.t(
                                        "Number of summer semester hours"
                                      )}
                                    </div>
                                  </Col>
                                  <Col md="1"></Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={academicLoads}
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
                                      this.handleacadmicLoadDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Academic Loads found"
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

const mapStateToProps = ({ academicLoads, warnings, menu_items }) => ({
  academicLoads: academicLoads.academicLoads,
  deleted: academicLoads.deleted,
  warnings: warnings.warnings,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAcademicLoads: () => dispatch(getAcademicLoads()),
  onAddNewAcademicLoad: academicLoad =>
    dispatch(addNewAcademicLoad(academicLoad)),
  onUpdateAcademicLoad: academicLoad =>
    dispatch(updateAcademicLoad(academicLoad)),
  onDeleteAcademicLoad: academicLoad =>
    dispatch(deleteAcademicLoad(academicLoad)),
  onGetAcademicLoadDeletedValue: () => dispatch(getAcademicLoadDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AcademicLoadList));
