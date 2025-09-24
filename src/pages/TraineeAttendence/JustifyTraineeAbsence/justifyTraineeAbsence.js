import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getJustifyTraineesAbsence,
  addNewJustifyTraineeAbsence,
  updateJustifyTraineeAbsence,
  deleteJustifyTraineeAbsence,
  getJustifyTraineeAbsenceDeletedValue,
} from "store/justifyTraineeAbsence/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import justifyTraineesAbsence from "store/justifyTraineeAbsence/reducer";
class JustifyTraineesAbsenceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justifyTraineesAbsence: [],
      justifyTraineeAbsence: {},
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      isEdit: false,
      traineesOpt: [],
      selectedTraineeKey: "",
      defaultTraineeName: "",
      modal: false,
      modal1: false,
      traineeModal: false,
      selectedTrainee: null,
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
    };
  }

  componentDidMount() {
    this.setState({ modal: true });
    const {
      justifyTraineesAbsence,
      onGetJustifyTraineesAbsence,
      traineesOpt,
      deleted,
      user_menu,
      trainees,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (justifyTraineeAbsence && !justifyTraineesAbsence.length) {
    //   onGetJustifyTraineesAbsence();
    // }
    onGetJustifyTraineesAbsence();

    this.setState({ justifyTraineesAbsence, trainees, traineesOpt });
    this.setState({ deleted });
    console.log("rsssssssssssssss", justifyTraineesAbsence);
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
    const { onAddNewJustifyTraineeAbsence, justifyTraineesAbsence } =
      this.props;

    const newRow = {
      arTitle: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = justifyTraineesAbsence.some(
      justifyTraineesAbsence =>
        justifyTraineesAbsence.arTitle.trim() === "-----"
      // ||
      // justifyTraineeAbsence.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      console.log("11111111111111111");
      onAddNewJustifyTraineeAbsence(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteJustifyTraineeAbsence } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteJustifyTraineeAbsence(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  toggleTrainee = () => {
    this.setState({ traineeModal: !this.state.traineeModal });
  };
  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  handleJustifyTraineeAbsenceDataChange = (rowId, fieldName, fieldValue) => {
    const { justifyTraineesAbsence, onUpdateJustifyTraineeAbsence } =
      this.props;

    const isDuplicate = justifyTraineesAbsence.some(justifyTraineeAbsence => {
      return (
        justifyTraineeAbsence.Id !== rowId &&
        justifyTraineeAbsence.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateJustifyTraineeAbsence(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateJustifyTraineeAbsence(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateJustifyTraineeAbsence } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateJustifyTraineeAbsence(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetJustifyTraineeAbsenceDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetJustifyTraineeAbsenceDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetJustifyTraineeAbsenceDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetJustifyTraineeAbsenceDeletedValue();
  };

  handleEditTrainee = arg => {
    this.setState({
      justifyTraineeAbsence: arg,
      isEdit: true,
    });

    this.toggle1();
  };

  handleTraineeSelectByName = name => {
    const selected = this.props.justifyTraineesAbsence.find(
      t => t.fullName === name
    );

    if (selected) {
      this.setState({
        selectedTrainee: selected,
        traineeModal: true,
        searchText: selected.fullName,
      });
    } else {
      this.setState({
        selectedTrainee: null,
        searchText: name,
      });
    }
  };

  render() {
    const { justifyTraineesAbsence, traineesOpt, trainees, t, deleted } =
      this.props;
    const {
      modal,
      isEdit,
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      justifyTraineeAbsence,
      traineeModal,
      modal1,
      selectedTraineeKey,
      defaultTraineeName,
      selectedTrainee,
    } = this.state;
    console.log("traineesOpttraineesOpt", traineesOpt);
    const traineesArray = Object.values(traineesOpt);
    const { SearchBar } = Search;
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex) => rowIndex + 1,
      },
      {
        dataField: "arTitle",
        text: this.props.t("Week"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "enTitle",
        text: this.props.t("Lecture"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "code",
        text: this.props.t("Lecture Date"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "weight",
        text: this.props.t("Start Time"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "endTime",
        text: this.props.t("End Time"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "absenceTypeId",
        text: this.props.t("Absence Type"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "reason",
        text: this.props.t("Reason"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "justified",
        text: this.props.t("Justified"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "justifyDocument",
        text: this.props.t("Justify Document"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "Update",
        text: "Update",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, justifyTraineeAbsence) => (
          <div className="d-flex justify-content-center gap-3">
            <Tooltip title={this.props.t("Update")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditTrainee(justifyTraineeAbsence)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: justifyTraineesAbsence.length,
      custom: true,
    };
    return (
      <React.Fragment>
        <div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              traineeId: justifyTraineeAbsence?.traineeId || defaultTraineeName,
            }}
          >
            {({
              errors,
              status,
              touched,
              values,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
                <Card
                  className="mt-3"
                  style={{
                    position: "relative",
                    marginRight: "30px",
                  }}
                >
                  <CardHeader className="card-header text-center">
                    <h4>{""}</h4>
                  </CardHeader>
                  <CardBody className="cardBody">
                    <Row>
                      <Card className="mt-3">
                        <CardTitle id="course_header">{""}</CardTitle>
                        <CardBody className="cardBody">
                          <Modal
                            isOpen={this.state.modal}
                            className={this.props.className}
                            size="lg"
                            centered
                          >
                            <ModalHeader toggle={this.toggle} tag="h4">
                              {t("Confirm")}
                            </ModalHeader>

                            <ModalBody>
                              <Row>
                                <Col className="col-4 mb-3">
                                  <Label for="inst">{t("Trainee Name")}</Label>
                                  <span className="text-danger">*</span>
                                </Col>
                                <Col className="col-8">
                                  <Field
                                    name="traineeId"
                                    as="input"
                                    type="text"
                                    placeholder="Search..."
                                    className={
                                      "form-control" +
                                      (errors.traineeId && touched.traineeId
                                        ? " is-invalid"
                                        : "")
                                    }
                                    // value={
                                    //   traineesArray.find(
                                    //     trainee =>
                                    //       trainee.key ===
                                    //       this.state.selectedTraineeKey
                                    //   )?.value || ""
                                    // }
                                    // onChange={e => {
                                    //   const newValue = e.target.value;
                                    //   const selectedTrainee =
                                    //     traineesArray.find(
                                    //       trainee => trainee.value === newValue
                                    //     );

                                    //   if (selectedTrainee) {
                                    //     this.setState({
                                    //       selectedTraineeKey:
                                    //         selectedTrainee.key,
                                    //       defaultTraineeName:
                                    //         selectedTrainee.value,
                                    //       traineeModal: true,
                                    //     });
                                    //   } else {
                                    //     this.setState({
                                    //       selectedTraineeKey: null,
                                    //       defaultTraineeName: newValue,
                                    //     });
                                    //   }
                                    // }}
                                    value={this.state.searchText}
                                    onChange={e =>
                                      this.handleTraineeSelectByName(
                                        e.target.value
                                      )
                                    }
                                    list="traineeIdList"
                                    autoComplete="off"
                                  />

                                  <datalist id="traineeIdList">
                                    {traineesArray.map(employee => (
                                      <option
                                        key={employee.key}
                                        value={employee.value}
                                      />
                                    ))}
                                  </datalist>
                                </Col>
                              </Row>
                            </ModalBody>
                          </Modal>
                          <Modal
                            isOpen={traineeModal}
                            toggle={this.toggleTrainee}
                            centered
                            fullscreen
                          >
                            <ModalHeader toggle={this.toggleTrainee}>
                              {selectedTrainee
                                ? `${selectedTrainee.fullName} [${selectedTrainee.TraineeNum}]`
                                : ""}
                            </ModalHeader>
                            <ModalBody>
                              {this.state.selectedTrainee && (
                                <Card>
                                  <Card className=" bordered mt-2">
                                    <CardHeader className="card-header">
                                      {" "}
                                      {selectedTrainee
                                        ? `${selectedTrainee.fullName} [${selectedTrainee.TraineeNum}]`
                                        : ""}{" "}
                                    </CardHeader>
                                    <CardBody className="cardBody">
                                      <Row>
                                        <Col className="col-2">
                                          <Label for="traineeStatus">
                                            {this.props.t("Trainee Status")}
                                            {""}
                                          </Label>
                                        </Col>
                                        <Col className="col-4">
                                          <Label for="traineeStatus">
                                            {selectedTrainee.traineeStatus}
                                          </Label>
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                  <Card className="bordered mt-2">
                                    <CardBody className="cardBody">
                                      <div>
                                        <BootstrapTable
                                          keyField="Id"
                                          data={justifyTraineesAbsence}
                                          columns={columns}
                                          cellEdit={cellEditFactory({
                                            mode: "dbclick",
                                            blurToSave: true,
                                            // afterSaveCell: (
                                            //   oldValue,
                                            //   newValue,
                                            //   row,
                                            //   column
                                            // ) => {
                                            //   this.handleParentsDataChange(
                                            //     row.Id,
                                            //     column.dataField,
                                            //     newValue
                                            //   );
                                            // },
                                          })}
                                          noDataIndication={t(
                                            "No Relatives Found"
                                          )}
                                          defaultSorted={defaultSorting}
                                        />
                                      </div>
                                      <Modal
                                        isOpen={this.state.modal1}
                                        className={this.props.className}
                                        size="lg"
                                        centered
                                      >
                                        <ModalHeader
                                          toggle={this.toggle1}
                                          tag="h4"
                                        >
                                          <h4>
                                            {t("Update Trainee Absent Justify")}{" "}
                                            - {selectedTrainee?.fullName || ""}
                                          </h4>
                                        </ModalHeader>

                                        <ModalBody></ModalBody>
                                      </Modal>
                                    </CardBody>
                                  </Card>
                                </Card>
                              )}
                            </ModalBody>
                          </Modal>
                        </CardBody>
                      </Card>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
            )}
          </Formik>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ justifyTraineesAbsence, menu_items, trainees }) => ({
  justifyTraineesAbsence: justifyTraineesAbsence.justifyTraineesAbsence,
  traineesOpt: trainees.traineesOpt,
  trainees: trainees.trainees,
  deleted: justifyTraineesAbsence.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetJustifyTraineesAbsence: () => dispatch(getJustifyTraineesAbsence()),
  onAddNewJustifyTraineeAbsence: justifyTraineeAbsence =>
    dispatch(addNewJustifyTraineeAbsence(justifyTraineeAbsence)),
  onUpdateJustifyTraineeAbsence: justifyTraineeAbsence =>
    dispatch(updateJustifyTraineeAbsence(justifyTraineeAbsence)),
  onDeleteJustifyTraineeAbsence: justifyTraineeAbsence =>
    dispatch(deleteJustifyTraineeAbsence(justifyTraineeAbsence)),
  onGetJustifyTraineeAbsenceDeletedValue: () =>
    dispatch(getJustifyTraineeAbsenceDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(JustifyTraineesAbsenceList));
