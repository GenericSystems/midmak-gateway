import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Alert, Card, CardBody, Col, Container, Row, Label } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

//Import config
import { facebook, google } from "../../config";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// actions
import { apiError, loginUser, socialLogin } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import lightlogo from "../../assets/images/logo-light.svg";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      showPassword: false,
    };
  }

  componentDidMount() {
    this.props.apiError("");
  }

  signIn = (res, type) => {
    const { socialLogin } = this.props;
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      socialLogin(postData, this.props.history, type);
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      };
      socialLogin(postData, this.props.history, type);
    }
    console.log("11111111111111", socialLogin);
  };

  //handleGoogleLoginResponse
  googleResponse = response => {
    this.signIn(response, "google");
  };

  //handleTwitterLoginResponse
  twitterResponse = () => {};

  //handleFacebookLoginResponse
  facebookResponse = response => {
    this.signIn(response, "facebook");
  };
  handleAlertClose = () => {
    const { duplicateError } = this.state;

    this.setState({ duplicateError: false });

    this.props.apiError("");
  };

  handleDuplicateError = () => {
    const { duplicateError } = this.state;

    this.setState({ duplicateError: true });
  };

  render() {
    const { duplicateError } = this.state;
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="bx bx-home h2" />
          </Link>
        </div>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div className="p-2">
                      {this.props.error &&
                        this.props.error[0].statusLogin == 1 &&
                        duplicateError && (
                          <Alert
                            color="danger"
                            className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                            role="alert"
                          >
                            {t("Email or Password Invalid")}
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                              onClick={this.handleAlertClose}
                            ></button>
                          </Alert>
                        )}
                      {this.props.error &&
                        this.props.error[0].statusLogin == 0 &&
                        duplicateError && (
                          <Alert
                            color="success"
                            className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                            role="alert"
                          >
                            {t("Successful Login")}
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                              onClick={this.handleAlertClose}
                            ></button>
                          </Alert>
                        )}
                      {this.props.error &&
                        this.props.error[0].statusLogin == 2 &&
                        duplicateError && (
                          <Alert
                            color="danger"
                            className="d-flex flex-column justify-content-center align-items-center alert-dismissible fade show"
                            role="alert"
                          >
                            {t("There is a Problem in Your Account")}
                            <br />
                            {t("Please Contact the Administrator")}
                            <button
                              type="button"
                              className="btn-close mt-2"
                              aria-label="Close"
                              onClick={this.handleAlertClose}
                            ></button>
                          </Alert>
                        )}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          email: this.state && this.state.email,
                          password: this.state && this.state.password,
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string().required(
                            "Please Enter Your Email"
                          ),
                          password: Yup.string().required(
                            "Please Enter Valid Password"
                          ),
                        })}
                        onSubmit={values => {
                          this.props.loginUser(values, this.props.history);
                        }}
                      >
                        {({ errors, status, touched }) => (
                          <Form className="form-horizontal">
                            <div className="mb-3">
                              <Label for="email" className="form-label">
                                {this.props.t("Email")}
                              </Label>
                              <Field
                                name="email"
                                type="text"
                                className={
                                  "form-control" +
                                  (errors.email && touched.email
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                            <div className="mb-3">
                              <Label for="password" className="form-label">
                                {this.props.t("Password")}
                              </Label>
                              <div className="input-group auth-pass-inputgroup">
                                <Field
                                  name="password"
                                  type={
                                    this.state.showPassword
                                      ? "text"
                                      : "password"
                                  }
                                  autoComplete="true"
                                  className={
                                    "form-control" +
                                    (errors.password && touched.password
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <button
                                  className="btn btn-light "
                                  type="button"
                                  id="password-addon"
                                  onClick={() =>
                                    this.setState(prevState => ({
                                      showPassword: !prevState.showPassword,
                                    }))
                                  }
                                >
                                  <i className="mdi mdi-eye-outline"></i>
                                </button>
                              </div>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>

                            {/* <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="customControlInline"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="customControlInline"
                              >
                               {this.props.t("Remember me")}
                              </label>
                            </div> */}

                            <div
                              className="d-flex justify-content-center  "
                              style={{ marginTop: "1.5rem" }}
                            >
                              <button
                                onClick={this.handleDuplicateError}
                                className="btn btn-primary btn-block px-4"
                                type="submit"
                              >
                                {this.props.t("Log In")}
                              </button>
                            </div>

                            {/* <div className="mt-4 text-center">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                <i className="mdi mdi-lock me-1" /> 
                               {this.props.t("Forgot your password?")}
                              </Link>
                            </div> */}
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </CardBody>
                </Card>
                {/* <div className="mt-5 text-center">
                  <p>
                  {this.props.t("Don't have an account?")}
                  
                    <Link to="register" className="fw-medium text-primary">
                    {this.props.t("Signup Now")}
                    </Link>
                  </p>
                
                </div> */}
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  apiError: PropTypes.any,
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func,
};

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(
    withTranslation()(Login)
  )
);
