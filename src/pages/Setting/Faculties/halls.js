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
  CardTitle
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
  getHalls,
  addNewHall,
  updateHall,
  deleteHall,
  getHallDeletedValue,
} from "store/halls/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { getFaculties } from "store/mob-app-faculty-accs/actions";

import { isEmpty, size, map } from "lodash";

const HALL_STORAGE_KEY = "editableHall";

import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class HallsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      halls: [],
      hall: "",
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
    const { halls, onGetHalls, faculties, deleted, user_menu,onGetFaculties } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (halls && !halls.length) {
      onGetFaculties();

    }
    this.setState({ halls });
    this.setState({ faculties, deleted });
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
    const {selectedFacultyId} = this.state
    const { onAddNewHall, halls } = this.props;
    const newRow = {
      hallName: "-----",
      facultyId: selectedFacultyId

    };

    const emptyRowsExist = halls.some(
      hall => hall.hallName.trim() === "-----"
      // ||
      // hall.facultyId.trim() === ""
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewHall(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteHall } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteHall(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleHallDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateHall, halls } = this.props;

    const isDuplicate = halls.some(
      hall => hall.Id !== rowId && hall.hallName.trim() === fieldValue.trim()
      // hall.facultyId.trim() === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateHall(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateHall(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, selectedValue) {
    const { onUpdateHall } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateHall(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetHallDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHallDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetHallDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHallDeletedValue();
  };
  handleFacultyChange = e =>{
    const {
      onGetHalls,
      faculties
    } = this.props;

    const selectedValue = e.target.value;
    const selectedFaculty = faculties.find(
      faculty => faculty.title === selectedValue
    );
    
    console.log(selectedFaculty)
    if(selectedFaculty){
      onGetHalls({facultyId :selectedFaculty.Id})
      this.setState({
        selectedFacultyId: selectedFaculty.Id
      })
    }
    
  }
  render() {
    const { halls, t, faculties, deleted } = this.props;
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
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
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
        dataField: "hallName",
        text: this.props.t("Hall Name"),
        sort: true,
        editable: showEditButton,
      },
     
      {
        dataField: "teachingCapacity",
        text: this.props.t("Teaching Capacity"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "examinationCapacity",
        text: this.props.t("Examination Capacity"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, hall) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(hall)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: halls.length,
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
              title={this.props.t("Halls")}
              breadcrumbItem={this.props.t("Halls List")}
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
                        data={halls}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={halls}
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
                                  <Col sm="4">
                                  <div className="justify-content-center mb-2 input-container">
                                    <Col sm="5">
                         <CardTitle id="horizontalTitles">
                            {this.props.t("Choose Faculty")}
                          </CardTitle> 
                          </Col>
                          <Col sm="7">
                          <input
                            className={`form-control ${this.state.inputClass}`}
                            list="datalistOptions"
                            id="exampleDataList"
                            placeholder="Type to search..."
                            autoComplete="off"
                            onChange={this.handleFacultyChange}
                          />
                         <datalist id="datalistOptions">
                            {faculties.map(faculty => (
                              <option
                                key={faculty.Id}
                                value={faculty.title}
                              />
                            ))}
                          </datalist> 
                          </Col>
                        </div>
                        </Col> 
                                  <Col sm="4">
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
                                  data={halls}
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
                                      this.handleHallDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Halls found"
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

const mapStateToProps = ({ halls, mobAppFacultyAccs, menu_items }) => ({
  halls: halls.halls,
  deleted: halls.deleted,
  faculties: mobAppFacultyAccs.faculties,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetHalls: hall => dispatch(getHalls(hall)),
  onGetFaculties: () => dispatch(getFaculties()),
  onAddNewHall: hall => dispatch(addNewHall(hall)),
  onUpdateHall: hall => dispatch(updateHall(hall)),
  onDeleteHall: hall => dispatch(deleteHall(hall)),
  onGetHallDeletedValue: () => dispatch(getHallDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HallsList));
