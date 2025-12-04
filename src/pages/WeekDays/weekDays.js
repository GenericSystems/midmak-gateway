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
import Breadcrumbs from "components/Common/Breadcrumb";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Tooltip from "@mui/material/Tooltip";

import {
  getWeekDays,
  addNewWeekDay,
  updateWeekDay,
  deleteWeekDay,
} from "store/weekdays/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, size, map } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
const WEEKDAY_STORAGE_KEY = "editableWeekDay";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class WeekDays extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekDays: [],
      weekDay: "",
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAddButton: false,
      showDeleteButton: false,
      showSearchButton: false,
      showEditButton: false,
    };
  }

  componentDidMount() {
    const { weekDays, onGetWeekDays, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (weekDays && !weekDays.length) {
      onGetWeekDays();
    }
    this.setState({ weekDays });
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
    const { weekDays, onAddNewWeekDay } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };
    const emptyRowsExist = weekDays.some(
      weekDay => weekDay.arTitle.trim() === "-----"
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewWeekDay(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteWeekDay } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteWeekDay(selectedRowId);

      this.setState({ selectedRowId: null, deleteModal: false });
    }
  };
  handleWeekDayDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateWeekDay, weekDays } = this.props;
    /*let obUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateWeekDay(obUpdate);*/

    const isDuplicate = weekDays.some(
      weekDay =>
        weekDay.Id !== rowId &&
        weekDay.arTitle.trim() === fieldValue.trim() /* ||
          weekDay.enTitle.trim() === fieldValue.trim() */
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateWeekDay(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateWeekDay(onUpdate);
    }
  };

  handleActiveToggle = (rowId, currentStatus) => {
    const { onUpdateWeekDay } = this.props;
    onUpdateWeekDay({ Id: rowId, active: currentStatus === 1 ? 0 : 1 });
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  render() {
    const { weekDays } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      { dataField: "dayOrder", text: this.props.t("Day Order"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("WeekDay(ar)"),
        sort: true,
        headerStyle: { width: "33%" },
        style: { width: "33%" },
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "WeekDay",
        sort: true,
        headerStyle: { width: "33%" },
        style: { width: "33%" },
        editable: showEditButton,
      },
      {
        dataField: "active",
        text: this.props.t("Active"),
        editable: false,
        formatter: (cellContent, weekDay) => (
          <IconButton
            color="primary"
            onClick={() => this.handleActiveToggle(weekDay.Id, weekDay.active)}
            disabled={!showEditButton}
          >
            {weekDay.active ? (
              <i
                className="bx bx-radio-circle-marked"
                style={{ color: "green" }}
              />
            ) : (
              <i className="bx bx-radio-circle" style={{ color: "red" }} />
            )}
          </IconButton>
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, weekDay) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(weekDay)}
            ></i>
          </Link>
        ),
        hidden: true,
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: weekDays.length,
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
              title={this.props.t("WeekDays")}
              breadcrumbItem={this.props.t("WeekDays List")}
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
                    </div>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={weekDays}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={weekDays}
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
                                  data={weekDays}
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
                                      this.handleWeekDayDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No WeekDays found"
                                  )}
                                  defaultSort={[
                                    {
                                      dataField: "dayOrder",
                                      order: "asc",
                                    },
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

const mapStateToProps = ({ weekDays, menu_items }) => ({
  weekDays: weekDays.weekDays,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetWeekDays: () => dispatch(getWeekDays()),
  onAddNewWeekDay: weekDay => dispatch(addNewWeekDay(weekDay)),
  onUpdateWeekDay: weekDay => dispatch(updateWeekDay(weekDay)),
  onDeleteWeekDay: weekDay => dispatch(deleteWeekDay(weekDay)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(WeekDays));
