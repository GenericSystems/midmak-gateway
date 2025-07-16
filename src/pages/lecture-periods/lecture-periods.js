import React, { Component } from "react";
import { Row, Col, Card, Alert, CardBody, Input, Button } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import {
  getLecturePeriods,
  addNewLecturePeriod,
  updateLecturePeriod,
  deleteLecturePeriod,
} from "store/lecture-periods/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
const LECTURE_PERIOD_STORAGE_KEY = "editableLecturePeriod";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class LecturePeriodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      newStartTime: "",
      newEndTime: "",
      newDuration: "",
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }
  componentDidMount() {
    const { lecturePeriods, onGetLecturePeriods, user_menu } = this.props;
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (lecturePeriods && !lecturePeriods.length) {
      onGetLecturePeriods();
      this.setState({ lecturePeriods });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
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
    const { onAddNewLecturePeriod, lecturePeriods } = this.props;
    const newRow = {
      startTime: "00:00:00",
      endTime: "00:00:00",
      duration: "",
    };

    const isDuplicate = lecturePeriods.some(period => {
      return period.startTime === "00:00:00" && period.endTime === "00:00:00";
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewLecturePeriod(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteLecturePeriod } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteLecturePeriod(selectedRowId);

      this.setState({ selectedRowId: null, deleteModal: false });
    }
  };
  handleGenerateNewData = () => {
    const { onAddNewLecturePeriod, lecturePeriods } = this.props;

    const newStartTime = this.state.newStartTime;
    const newEndTime = this.state.newEndTime;
    const newDuration = this.state.newDuration;

    if (!newStartTime || !newEndTime) {
      const errorMessage = this.props.t("Fill in all fields");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });

      const newRow = {
        startTime: newStartTime,
        endTime: newEndTime,
        duration: newDuration,
      };

      const isDuplicate = lecturePeriods.some(period => {
        return (
          period.startTime === newStartTime &&
          period.endTime === newEndTime &&
          period.duration === newDuration
        );
      });

      if (isDuplicate) {
        const errorMessage = this.props.t("Duplicate entry");
        this.setState({ duplicateError: errorMessage });
      } else {
        this.setState({ duplicateError: null });
        onAddNewLecturePeriod(newRow);
      }
    }
  };

  handleLecturePeriodDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateLecturePeriod, lecturePeriods } = this.props;

    const updatedTimeParts = fieldValue.split(":");
    const updatedHours = parseInt(updatedTimeParts[0], 10);

    const isConflict = lecturePeriods.some(period => {
      const existingTimeParts = period.startTime.split(":");
      const existingHours = parseInt(existingTimeParts[0], 10);

      return rowId !== period.Id && updatedHours === existingHours;
    });

    if (isConflict) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateLecturePeriod(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  render() {
    const { lecturePeriods, t } = this.props;
    const {
      duplicateError,
      deleteModal,
      showDeleteButton,
      showSearchButton,
      showEditButton,
    } = this.state;
    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "asc",
      },
    ];
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "startTime",
        text: t("Start Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.startTime}
            onChange={newValue => {
              this.handleLecturePeriodDataChange(
                row.Id,
                "startTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "endTime",
        text: t("End Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.endTime}
            onChange={newValue => {
              this.handleLecturePeriodDataChange(
                row.Id,
                "endTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      { dataField: "duration", text: t("Duration"), editable: false },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, lecturePeriod) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(lecturePeriod)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: lecturePeriods.length,
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
              title={t("LecturePeriods")}
              breadcrumbItem={t("LecturePeriods List")}
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
                        data={lecturePeriods}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={lecturePeriods}
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
                                </Row>
                                <br />
                                <br />
                                <div className="marginTop">
                                  <Row>
                                    <Col sm="1">
                                      <div className="centeraligne">
                                        {this.props.t("Start Time")}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <Input
                                        type="time"
                                        value={this.state.newStartTime}
                                        onChange={e =>
                                          this.setState({
                                            newStartTime: e.target.value,
                                          })
                                        }
                                      />
                                    </Col>
                                    <Col sm="1">
                                      <div className="centeraligne">
                                        {this.props.t("End Time")}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <Input
                                        type="time"
                                        value={this.state.newEndTime}
                                        onChange={e =>
                                          this.setState({
                                            newEndTime: e.target.value,
                                          })
                                        }
                                      />
                                    </Col>
                                    <Col sm="1">
                                      <div className="centeraligne">
                                        {this.props.t("Duration")}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <Input
                                        type="text"
                                        value={this.state.newDuration}
                                        onChange={e =>
                                          this.setState({
                                            newDuration: e.target.value,
                                          })
                                        }
                                      />
                                    </Col>

                                    <Col>
                                      <div className="text-sm-start">
                                        <Button
                                          size="md"
                                          className="btn btn-warning ms-auto"
                                          onClick={this.handleGenerateNewData}
                                        >
                                          <i className="bx bx-error font-size-16 align-middle me-2"></i>
                                          {this.props.t("Generate")}
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={lecturePeriods}
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
                                      this.handleLecturePeriodDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
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

const mapStateToProps = ({ lecturePeriods }) => ({
  lecturePeriods: lecturePeriods.lecturePeriods,
});

const mapDispatchToProps = dispatch => ({
  onGetLecturePeriods: () => dispatch(getLecturePeriods()),
  onAddNewLecturePeriod: lecturePeriod =>
    dispatch(addNewLecturePeriod(lecturePeriod)),
  onUpdateLecturePeriod: lecturePeriod =>
    dispatch(updateLecturePeriod(lecturePeriod)),
  onDeleteLecturePeriod: lecturePeriod =>
    dispatch(deleteLecturePeriod(lecturePeriod)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LecturePeriodsList));
