import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Alert } from "reactstrap";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Select from "react-select";
import {
  getTrainersGrades,
  addNewTrainerGrade,
  updateTrainerGrade,
  deleteTrainerGrade,
  getTrainerGradeDeletedValue,
} from "store/trainersGrades/actions";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, size, map } from "lodash";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class TrainersGrades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainersGrades: [],
      trainerGrade: "",
      selectedCertLevel: null,
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
    const { trainersGrades, onGetTrainersGrades, deleted, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (trainersGrades && !trainersGrades.length) {
      onGetTrainersGrades();
    }
    this.setState({ trainersGrades, deleted });
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
    const { trainersGrades, onAddNewTrainerGrade } = this.props;
    const newRow = {
      arTitle: "---",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = trainersGrades.some(
      trainerGrade => trainerGrade.arTitle.trim() === "---"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewTrainerGrade(newRow);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteTrainerGrade } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteTrainerGrade(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleTrainerGradeDataChange = (rowId, fieldName, fieldValue) => {
    const { trainersGrades, onUpdateTrainerGrade } = this.props;
    const isDuplicate = trainersGrades.some(
      trainerGrade =>
        trainerGrade.Id !== rowId &&
        trainerGrade.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateTrainerGrade(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      console.log("on update", onUpdate);
      onUpdateTrainerGrade(onUpdate);
    }
  };

  handleSuccessClose = () => {
    const { onGetTrainerGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTrainerGradeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetTrainerGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTrainerGradeDeletedValue();
  };

  render() {
    const { SearchBar } = Search;
    const { trainersGrades, deleted, t } = this.props;
    const alertMessage =
      deleted == 0 ? t("Can't Delete") : t("Deleted Successfully");
    const { onUpdateTrainerGrade, onDeleteTrainerGrade } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
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
        text: this.props.t("Trainers Grades(ar)"),
        sort: true,
        // editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Trainerts Grades",
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
        //  hidden: !showDeleteButton,
        isDummyField: true,
        editable: false,
        formatter: (cellContent, trainerGrade) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(trainerGrade)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: trainersGrades.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Trainers Grades")} />

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
                        data={trainersGrades}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={trainersGrades}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      {/*  {showSearchButton && ( */}
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                  <Col sm="8">
                                    {/*        {showAddButton && ( */}
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
                                  data={trainersGrades}
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
                                      this.handleTrainerGradeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No TrainerGradeType Types found"
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

const mapStateToProps = ({ trainersGrades, menu_items }) => ({
  trainersGrades: trainersGrades.trainersGrades,
  deleted: trainersGrades.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTrainersGrades: () => dispatch(getTrainersGrades()),
  onAddNewTrainerGrade: trainerGrade =>
    dispatch(addNewTrainerGrade(trainerGrade)),
  onUpdateTrainerGrade: trainerGrade =>
    dispatch(updateTrainerGrade(trainerGrade)),
  onDeleteTrainerGrade: trainerGrade =>
    dispatch(deleteTrainerGrade(trainerGrade)),
  onGetTrainerGradeDeletedValue: () => dispatch(getTrainerGradeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(TrainersGrades)));
