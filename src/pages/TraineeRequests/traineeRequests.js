import React, { Component } from "react";
import classnames from "classnames";
import { fetchFile } from "../../store/_common/actions"; // adjust path

import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  FormGroup,
  TabContent,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import FilePage from "pages/FilePage";
import FullPageModal from "components/FileView/FullPageModal";
import { uploadFile } from "store/_common/actions";

import {
  getTraineeRequests,
  getFilteredCoursesObjection,
  getGradeTypes,
} from "store/traineeRequests/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class TraineeRequestsList extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    console.log("Constructor props", props);
    this.state = {
      modalOpen: false,
      activeRequest: null,
      requestFormData: {
        studentName: "",
        reason: "",
        additionalInfo: "",
      },

      languageState: "",
      selectedTraineeId: 0,
      mimeType: null,
      selectedCourseId: null,
      selectedTestExam: null,
      dataUrl: null,
      downloadfinished: 0,
    };
  }

  componentDidMount() {
    const authUserStr = localStorage.getItem("authUser");
    let traineeId = "";

    if (authUserStr) {
      try {
        const parsed = JSON.parse(authUserStr);

        if (parsed && parsed.length > 0) {
          traineeId = parsed[0].traineeId;
        }
      } catch (e) {
        console.error("authUser parsing failed", e);
      }
    }
    this.setState({ traineeId });
    console.log("Trainee ID:", traineeId);
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      traineesRequests,
      onGetTraineeRequests,
      onGetGradeTypes,
      deleted,
      user_menu,
      i18n,
      mimeType,
      dataUrl,
      downloadfinished,
      onGetFilteredCoursesObjection,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (traineesRequests && !traineesRequests.length) {
    onGetTraineeRequests(lang, traineeId);
    console.log("9999999999", traineeId);
    onGetFilteredCoursesObjection(traineeId);
    onGetGradeTypes();
    this.setState({ dataUrl, mimeType, downloadfinished });
    this.setState({ traineesRequests });
    this.setState({
      deleted,
    });
    // }

    let curentueardata = localStorage.getItem("authUser");
    if (curentueardata) {
      try {
        const parsed = JSON.parse(curentueardata);
        const firstYear = parsed[0];
        const selectedYear = {
          value: firstYear.currentYearId,
          label: firstYear.currentYearName,
        };
        this.setState({
          selectedYear,
          currentYearObj: {
            currentYearId: firstYear.currentYearId,
            currentYearName: firstYear.currentYearName,
          },
        });
      } catch (error) {
        console.error("Error parsing authUser:", error);
      }
    }
    this.setState({ languageState: lang });
    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleFetch(fileName) {
    const { onFetchFile } = this.props;
    console.log("Calling with fileData", fileName, onFetchFile);
    this.setState({
      dataUrl: null,
      mimeType: null,
      downloadfinished: this.props.downloadfinished,
    });
    onFetchFile(fileName);
  }

  // openModal = (event, fileName) => {
  //   console.log("Opening modal", event, fileName);
  //   this.handleFetch(fileName);
  // };

  // closeModal = () => {
  //   console.log("Closing modal");
  //   this.setState({ showModal: false });
  // };

  handleLanguageChange = lng => {
    // const { onGetTraineeRequests } = this.props;
    // const lang = localStorage.getItem("I18N_LANGUAGE");

    // if (lang != lng) {
    this.setState({ languageState: lng });
    // onGetTraineeRequests(lng);
    // }
  };

  componentDidUpdate(prevProps) {
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
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
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

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  toggle = () => {
    console.log("toggle clicked");
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      requestFormData: {
        ...prevState.requestFormData,
        [name]: value,
      },
    }));
  };

  // handleSubmit = e => {
  //   e.preventDefault();
  //   const { activeRequest, requestFormData } = this.state;
  //   console.log("Submitting request:", activeRequest, requestFormData);

  //   this.toggleModal();
  // };

  handleAddRow = card => {
    console.log("cardcard", card);
    this.setState({
      selectedTitle: card.title,
      selectedTitleId: card.id,
    });
    this.toggle();
  };

  handleSave = values => {
    const { selectedTraineeId, selectedCourseId, selectedTestExam } =
      this.state;
    const { traineesOpt, onAddNewMarkObjection, onUpdateMarkObjection } =
      this.props;

    console.log("values", values);

    values["courseId"] = selectedCourseId;
    values["testExamId"] = selectedTestExam;
    // values.requestStatusId = isEdit ? selectedRequestStatus : 4;

    let objectioninfo = {};

    Object.keys(values).forEach(function (key) {
      if (
        values[key] != undefined &&
        (values[key].length > 0 || values[key] != "")
      )
        objectioninfo[key] = values[key];
    });

    objectioninfo["courseId"] = selectedCourseId;
    objectioninfo["testExamId"] = selectedTestExam;

    console.log("objectioninfoobjectioninfo", objectioninfo);
    // onAddNewMarkObjection(objectioninfo);
    // this.setState({ successMessage: "Saved successfully" });
    this.toggle();
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "courseId") {
      this.setState({
        selectedCourseId: selectedValue,
        // selectedCourseName: selectedValue.label,
        // markObjection: values,
      });
    }
    if (fieldName == "testExamId") {
      this.setState({
        selectedTestExam: selectedValue,
        // markObjection: values,
      });
    }
  };

  render() {
    const {
      traineesRequests,
      gradeTypes,
      coursesObjection,
      socialStatus,
      deleted,
      t,
      nationalities,
      genders,
    } = this.props;
    const {
      trainee,
      languageState,
      deleteModal,
      successMessage,
      errorMessage,
      traineeRequest,
      modalOpen,
      selectedTitle,
      selectedTitleId,
    } = this.state;
    console.log("selectedTitleselectedTitle", selectedTitleId);

    const cardsData = [
      { id: 1, title: "طلب اعتراض" },
      { id: 2, title: "إعادة الامتحان" },
      { id: 3, title: "إعادة تقييم المشروع" },
      { id: 4, title: "إصدار نسخة ثانية من الشهادة" },
      { id: 5, title: "Courier الدولي للشهادات" },
      { id: 6, title: "التوثيق الحكومي الإضافي" },
    ];
    const direction = languageState === "ar" ? "rtl" : "ltr";
    const filteredCoursesModified =
      coursesObjection &&
      coursesObjection.map(item => ({
        label: `${item.code} - ${item.CourseName}`,
        value: item.courseId,
      }));
    const traineeData =
      traineesRequests && traineesRequests.length > 0
        ? traineesRequests[0]
        : {};
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

    const pageOptions = {
      sizePerPage: 10,
      totalSize: traineesRequests.length,
      custom: true,
    };

    return (
      <div dir={direction} className="page-content">
        <React.Fragment>
          <DeleteModal
            show={deleteModal}
            onDeleteClick={this.handleDeleteRow}
            onCloseClick={() => this.setState({ deleteModal: false })}
          />
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={t("TraineeRequests")} />

            <Row>
              <Col lg="12">
                <Card>
                  <CardHeader>
                    <h4>
                      <i className="fas fa-user-circle" />{" "}
                      {languageState === "ar"
                        ? `${traineeData.fullName}`
                        : `${traineeData.fullNameE}`}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <React.Fragment>
                      <Row className="mt-4">
                        {cardsData.map(card => (
                          <div key={card.id} className="col-md-6 mb-3">
                            <Card>
                              <CardBody>
                                <CardTitle id="course_header">
                                  {card.title}
                                </CardTitle>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "20px 0",
                                  }}
                                >
                                  <Button
                                    color="primary"
                                    onClick={() => this.handleAddRow(card)}
                                  >
                                    {this.props.t("Add New Request")}
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          </div>
                        ))}

                        <Modal
                          isOpen={modalOpen}
                          toggle={this.toggle}
                          size="lg"
                        >
                          <ModalHeader toggle={this.toggle} tag="h4">
                            {this.props.t("Add")} {this.state.selectedTitle}
                          </ModalHeader>
                          <ModalBody>
                            <Formik
                              enableReinitialize={true}
                              initialValues={{
                                courseId:
                                  (traineeRequest && traineeRequest.courseId) ||
                                  "",
                                testExamId:
                                  (traineeRequest &&
                                    traineeRequest.testExamId) ||
                                  "",
                              }}
                              validationSchema={Yup.object().shape({
                                applyingDate: Yup.string()
                                  .nullable()
                                  .test(
                                    "is-valid-date",
                                    "Date must be valid",
                                    value =>
                                      !value ||
                                      moment(
                                        value,
                                        "YYYY-MM-DD",
                                        true
                                      ).isValid()
                                  ),
                              })}
                            >
                              {({
                                errors,
                                status,
                                touched,
                                values,
                                handleChange,
                                handleBlur,
                                setFieldValue,
                              }) => {
                                return (
                                  <Form>
                                    <Card id="employee-card">
                                      <CardBody className="cardBody">
                                        {errorMessage && (
                                          <Alert
                                            color="danger"
                                            className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                            role="alert"
                                          >
                                            {errorMessage}
                                            <button
                                              type="button"
                                              className="btn-close"
                                              aria-label="Close"
                                              onClick={() =>
                                                this.handleAlertClose(
                                                  "errorMessage"
                                                )
                                              }
                                            ></button>
                                          </Alert>
                                        )}
                                        <div>
                                          {/* <div className="mb-3">
                                                <Row>
                                                  <Col className="col-4">
                                                    <Label for="traineeName">
                                                      {this.props.t(
                                                        "Trainee Name"
                                                      )}
                                                    </Label>
                                                  </Col>
                                                  <Col className="col-8">
                                                    <Field
                                                      name="traineeName"
                                                      type="text"
                                                      list="traineeNameList"
                                                      as="input"
                                                      id="traineeName-Id"
                                                      className={
                                                        "form-control"
                                                      }
                                                      onChange={e => {
                                                        const traineeInput =
                                                          e.target.value;

                                                        const traineeName =
                                                          traineeInput.split(
                                                            " - "
                                                          )[0];

                                                        const plan =
                                                          traineesOpt.find(
                                                            trainee =>
                                                              trainee.value ===
                                                              traineeName
                                                          );
                                                        console.log(
                                                          "planplanplan",
                                                          traineesOpt
                                                        );
                                                        if (plan) {
                                                          onGetFilteredCoursesObjection(
                                                            plan
                                                          );
                                                        }
                                                        handleChange(e);
                                                      }}
                                                    />
                                                    <datalist id="traineeNameList">
                                                      {traineesOpt.map(
                                                        traineeOpt => (
                                                          <option
                                                            key={traineeOpt.key}
                                                            value={`${traineeOpt.value} - ${traineeOpt.TraineeNum}`}
                                                          />
                                                        )
                                                      )}
                                                    </datalist>
                                                    {traineeError && (
                                                      <div className="invalid-feedback">
                                                        {this.props.t(
                                                          "Trainee Name is required"
                                                        )}
                                                      </div>
                                                    )}
                                                  </Col>
                                                </Row>
                                              </div> */}
                                          <div className="mb-3">
                                            <Row>
                                              <Col className="col-2">
                                                <Label for="courseId">
                                                  {this.props.t("Courses")}
                                                </Label>
                                              </Col>
                                              <Col className="col-8">
                                                <Select
                                                  name="courseId"
                                                  options={
                                                    filteredCoursesModified
                                                  }
                                                  key={`select_course`}
                                                  onChange={newValue => {
                                                    this.handleSelect(
                                                      "courseId",
                                                      newValue.value
                                                    );
                                                  }}
                                                  value={filteredCoursesModified.find(
                                                    opt =>
                                                      opt.value ===
                                                      traineeRequest?.courseId
                                                  )}
                                                  className={
                                                    "form-control"
                                                    //  +
                                                    // ((errors.courseId &&
                                                    //   touched.courseId) ||
                                                    // courseError
                                                    //   ? " is-invalid"
                                                    //   : "")
                                                  }
                                                  id="courseId"
                                                />
                                                {/* 
                                                    {courseError && (
                                                      <div className="invalid-feedback">
                                                        {this.props.t(
                                                          "Courses is required"
                                                        )}
                                                      </div>
                                                    )} */}
                                              </Col>
                                            </Row>
                                          </div>
                                          {selectedTitleId === 1 && (
                                            <div className="mb-3">
                                              <Row>
                                                <Col className="col-2">
                                                  <Label for="testExamId">
                                                    {this.props.t("Test/Exam")}
                                                  </Label>
                                                  {/* <span className="text-danger">
                                                      *
                                                    </span> */}
                                                </Col>
                                                <Col className="col-8">
                                                  <Select
                                                    name="testExamId"
                                                    key={`select_testExam`}
                                                    options={gradeTypes}
                                                    className={
                                                      "form-control"
                                                      // +
                                                      // ((errors.testExamId &&
                                                      //   touched.testExamId) ||
                                                      // testExamError
                                                      //   ? " is-invalid"
                                                      //   : "")
                                                    }
                                                    onChange={newValue => {
                                                      this.handleSelect(
                                                        "testExamId",
                                                        newValue.value,
                                                        values
                                                      );
                                                    }}
                                                    value={gradeTypes.find(
                                                      opt =>
                                                        opt.value ===
                                                        traineeRequest?.testExamId
                                                    )}
                                                  />
                                                  {/* {testExamError && (
                                                      <div className="invalid-feedback">
                                                        {this.props.t(
                                                          "Test/Exam is required"
                                                        )}
                                                      </div>
                                                    )} */}
                                                </Col>
                                              </Row>
                                            </div>
                                          )}
                                        </div>
                                      </CardBody>
                                    </Card>
                                    <Row>
                                      <Col>
                                        <div className="text-center">
                                          <Link
                                            to="#"
                                            className="btn btn-primary me-2"
                                            onClick={() => {
                                              this.handleSave(values);
                                            }}
                                          >
                                            {t("Save")}
                                          </Link>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Form>
                                );
                              }}
                            </Formik>
                          </ModalBody>
                        </Modal>
                      </Row>
                    </React.Fragment>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = ({ traineesRequests }) => ({
  traineesRequests: traineesRequests.traineesRequests,
  coursesObjection: traineesRequests.coursesObjection,
  gradeTypes: traineesRequests.gradeTypes,
});

const mapDispatchToProps = dispatch => ({
  onGetTraineeRequests: (lng, traineeId) =>
    dispatch(getTraineeRequests(lng, traineeId)),
  onGetFilteredCoursesObjection: traineeId =>
    dispatch(getFilteredCoursesObjection(traineeId)),
  onGetGradeTypes: () => dispatch(getGradeTypes()),
  onUploadFile: fileData => dispatch(uploadFile(fileData)),
  onFetchFile: fileId => dispatch(fetchFile(fileId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineeRequestsList));
