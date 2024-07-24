import React, { Component } from "react";
import { Row, Col, Card, Alert, CardBody, Input,CardTitle, Label, Form, FormGroup } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";
import {
  getReqTypes,
  addNewReqType,
  updateReqType,
  deleteReqType,
  getReqTypeDeletedValue,
} from "store/req-types/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
const REQUIREMENT_TYPE_STORAGE_KEY = "editableReqType";
import Tooltip from "@mui/material/Tooltip";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import { getFaculties } from "store/mob-app-faculty-accs/actions";
import { selectFilter } from "react-bootstrap-table2-filter";
class RequirementTypesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      selectedLevel: {},
      reqTypes: props.reqTypes || [],
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }
  componentDidMount() {
    const { reqTypes, onGetReqTypes, requirementlevels, deleted,onGetFaculties,faculties, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (reqTypes && !reqTypes.length) {
     // onGetReqTypes();
     onGetFaculties();
      this.setState({ reqTypes });
      this.setState({ requirementlevels, deleted, faculties });
    }
  }

  componentDidUpdate(prevProps) {
    const { reqTypes } = this.props;

    // Check if the preReqTypes prop has been updated
    if (reqTypes !== prevProps.reqTypes) {
      this.setState({ reqTypes });
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

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
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
    const { onAddNewReqType, reqTypes } = this.props;
    const {selectedFacultyId} =this.state

    const newRow = {
      arTitle: "-----",
      enTitle: "",
      facultyId: selectedFacultyId
    };
    const emptyRowsExist = reqTypes.some(
      reqType => reqType.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewReqType(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteReqType } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteReqType(selectedRowId);

      this.setState({ deleteModal: false, showAlert: true });
    }
  };
  handleReqTypeDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateReqType, reqTypes } = this.props;
    const { selectedLevel } = this.state;

    this.setState({
      selectedLevel: {
        ...selectedLevel,
        [rowId]: fieldValue,
      },
    });

    const isDuplicate = reqTypes.some(
      reqType =>
        reqType.Id !== rowId &&
        ((reqType.arTitle && reqType.arTitle.trim()) === fieldValue.trim() ||
          (reqType.enTitle && reqType.enTitle.trim()) === fieldValue.trim())
    );
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateReqType(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateReqType(onUpdate);
    }
  };

  handleChangeCheckbox = (rowId, currentStatus, fieldName) => {
    const { onUpdateReqType } = this.props;
    const newStatus = currentStatus ? 1 : 0;
    let ob = {};
    ob["Id"] = rowId;
    ob[fieldName] = newStatus;
    onUpdateReqType(ob);
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetReqTypeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetReqTypeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetReqTypeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetReqTypeDeletedValue();
  };

  handleFacultyChange = e =>{
    const {
      onGetReqTypes,
      faculties
    } = this.props;

    const selectedValue = e.target.value;
    const selectedFaculty = faculties.find(
      faculty => faculty.title === selectedValue
    );
    console.log(selectedFaculty)
    if(selectedFaculty){
      onGetReqTypes({facultyId :selectedFaculty.Id})
      this.setState({
        selectedFacultyId: selectedFaculty.Id
      })
    }
   
  }

  render() {
    const { reqTypes, deleted,faculties, t } = this.props;
    const {
      selectedLevel,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const { SearchBar } = Search;

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const { duplicateError, deleteModal } = this.state;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const requirementlevels = [
      { label: "University", value: "University" },
      { label: "Faculty", value: "Faculty" },
      { label: "Certificate", value: "Certificate" },
    ];
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Requisite Type(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Requisite Type",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "required",
        text: t("Required"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            disabled={row.levelId === null || !showEditButton}
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(
                row.Id,
                event.target.checked,
                "required"
              )
            }
          />
        ),
      },
      {
        dataField: "requirementLevel",
        text: t("Requirement Level"),
        editable: false,
        sort: true,
        formatter: (cellContent, row, column) => (
          <Select
            key={`level_select`}
            options={requirementlevels}
            defaultValue={requirementlevels.find(
              opt => opt.label == row.requirementLevel
            )}
            onChange={newValue => {
              this.handleReqTypeDataChange(
                row.Id,
                "requirementLevel",
                newValue.value
              );
            }}
            isDisabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "requirementCode",
        text: t("Code"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, reqType) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(reqType)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: reqTypes.length,
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
              title={t("ReqTypes")}
              breadcrumbItem={t("ReqTypes List")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    {
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
                    }
                               <Card>
                       
                      </Card>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={reqTypes}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={reqTypes}
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
                                  data={reqTypes}
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
                                      if (column.dataField != "required") {
                                        this.handleReqTypeDataChange(
                                          row.Id,
                                          column.dataField,
                                          newValue
                                        );
                                      }
                                    },
                                  })}
                                  noDataIndication={t(
                                    "No Requirement Types found"
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

const mapStateToProps = ({ reqTypes, menu_items, mobAppFacultyAccs }) => ({
  reqTypes: reqTypes.reqTypes,
  deleted: reqTypes.deleted,
  faculties: mobAppFacultyAccs.faculties,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetFaculties: () => dispatch(getFaculties()),
  onGetReqTypes: reqType => dispatch(getReqTypes(reqType)),
  onAddNewReqType: reqType => dispatch(addNewReqType(reqType)),
  onUpdateReqType: reqType => dispatch(updateReqType(reqType)),
  onDeleteReqType: reqType => dispatch(deleteReqType(reqType)),
  onGetReqTypeDeletedValue: () => dispatch(getReqTypeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RequirementTypesList));
