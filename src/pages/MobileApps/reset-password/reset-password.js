import React, { Component } from "react";
import { Card, CardBody, Col, Container, Row, Input, Alert } from "reactstrap";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getStudentsOptions,
  updatePassword,
} from "store/reset-password/actions";

import { Formik, Field, Form, ErrorMessage } from "formik";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordError: null,
      selectedStudent: "",
      newPassword: "",
      retypePassword: "",
    };
  }

  componentDidMount() {
    const { onGetStudentsOptions, studentsInfo, students } = this.props;
    if (studentsInfo && !studentsInfo.length) {
      onGetStudentsOptions();
    }
    this.setState({ studentsInfo });
    this.setState({ students });
  }

  handleInputChange = (fieldName, selectedValue) => {
    const { students } = this.props;
    const { selectedStudent } = this.state;
    this.setState({
      selectedStudent: selectedValue,
    });
  };

  handlePasswordChange = (fieldName, value) => {
    const { newPassword, retypePassword } = this.state;
    if (fieldName == "newPassword") {
      this.setState({
        newPassword: value,
      });
    }
    if (fieldName == "retypePassword") {
      this.setState({
        retypePassword: value,
      });
    }
  };

  handleSave = () => {
    const { students } = this.props;
    const { selectedStudent, newPassword, retypePassword } = this.state;
    const selectedStudent1 = students.find(
      student => `${student.value}` === selectedStudent
    );
    if (newPassword === retypePassword) {
      const { onUpdatePassword } = this.props;
      const onUpdate = {
        studentid: selectedStudent1.key,
        password: newPassword,
        Id: selectedStudent1.Id,
      };
      onUpdatePassword(onUpdate);
      this.setState({ passwordError: null });
    } else {
      const errorMessage = this.props.t("Password doesn't match");
      this.setState({ passwordError: errorMessage });
      return;
    }
  };

  handleDelete = () => {
    this.setState({
      selectedStudent: "",
      newPassword: "",
      retypePassword: "",
    });
  };

  handleAlertClose = () => {
    this.setState({ passwordError: null });
  };
  render() {
    //meta title
    document.title =
      "Reset Password | keyInHands - React Admin & Dashboard Template";

    const { studentsInfo, students } = this.props;

    document.title =
      "Form Elements | keyInHands - React Admin & Dashboard Template";

    const { t } = this.props; // Access the t function for translation;

    const { selectedStudent, newPassword, retypePassword, passwordError } =
      this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <Breadcrumbs
            title={this.props.t("Mobile Application")}
            breadcrumbItem={this.props.t("Reset Password")}
          />
          <Container fluid={true}>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div>
                      {passwordError && (
                        <Alert
                          color="danger"
                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                          role="alert"
                        >
                          {passwordError}
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={this.handleAlertClose}
                          ></button>
                        </Alert>
                      )}
                    </div>
                    <div className="reset-password">
                      <Row className="form-row">
                        <div className="form-group mb-3 row align-items-center">
                          <label
                            htmlFor="studentid"
                            className="col-md-2 col-form-label"
                          >
                            {t("Select Student")}
                          </label>
                          <div className="col-md-4">
                            <div className="input-group">
                              <Input
                                type="text"
                                name="usernameInput"
                                id="studentid"
                                list="datalistOptions"
                                className="form-control"
                                value={selectedStudent}
                                onChange={event =>
                                  this.handleInputChange(
                                    "studentid",
                                    event.target.value
                                  )
                                }
                                autoComplete="off"
                              />
                              <datalist id="datalistOptions">
                                {students.map(student => (
                                  <option
                                    key={student.key}
                                    value={student.value}
                                  />
                                ))}
                              </datalist>
                            </div>
                          </div>
                        </div>
                      </Row>

                      <Row className="form-row">
                        <div className="form-group mb-3 row align-items-center">
                          <label
                            htmlFor="password1"
                            className="col-md-2 col-form-label"
                          >
                            {t("New Password")}
                          </label>
                          <div className="col-md-4">
                            <div>
                              <Input
                                name="newPassword"
                                type="password"
                                value={newPassword}
                                placeholder="password"
                                autoComplete="new-password"
                                onChange={event =>
                                  this.handlePasswordChange(
                                    "newPassword",
                                    event.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="mt-2">
                              <Input
                                name="retypePassword"
                                type="password"
                                value={retypePassword}
                                autoComplete="new-password"
                                placeholder="Re-Type password"
                                onChange={event =>
                                  this.handlePasswordChange(
                                    "retypePassword",
                                    event.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </Row>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={this.handleSave}
                      >
                        {t("Save")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={this.handleDelete}
                      >
                        {t("Reset")}
                      </button>
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

const mapStateToProps = ({ studentsInfo }) => ({
  studentsInfo: studentsInfo.studentsInfo,
  students: studentsInfo.students,
});

const mapDispatchToProps = dispatch => ({
  onGetStudentsOptions: () => dispatch(getStudentsOptions()),
  onUpdatePassword: studentInfo => dispatch(updatePassword(studentInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ResetPassword)));
