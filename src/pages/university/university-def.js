import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "components/Common/Breadcrumb";
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
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./UniversityInfo.scss";
import {
  getUniversityInfo,
  updateUniversityInfo,
  addUniversityInfo,
} from "store/universitydef/actions";

class UniversityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universityInfo: [],
      universityName: "",
      universityEventDecision: null,
      contactNumber: "",
      faxNumber: "",
      universityWebsite: "",
      logo: null,
      link1: "",
      link2: "",
      link3: "",
      links: ["", "", ""],
      universityNameError: false,
      saveError: false,
      linkErrors: [false, false, false],
      universityWebsiteError: false,
      setErrormessage: false,
      successMessage: null,
    };
  }

  componentDidMount() {
    const { universityInfo, onGetuniversityinfo } = this.props;
    if (universityInfo && !universityInfo.length) {
      onGetuniversityinfo();
    }
    this.setState({ universityInfo });
  }

  componentDidUpdate(prevProps) {
    const { universityInfo } = this.props;
    if (prevProps.universityInfo !== this.props.universityInfo) {
      this.setState({
        universityName:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].universityName
            : "",
        universityEventDecision:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].universityEventDecision
            : "",
        contactNumber:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].contactNumber
            : "",
        faxNumber:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].faxNumber
            : "",
        universityWebsite:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].universityWebsite
            : "",
        logo:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].logo
            : "",
        link1:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].link1
            : "",
        link2:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].link2
            : "",
        link3:
          universityInfo && universityInfo.length > 0
            ? universityInfo[0].link3
            : "",
        universityInfo: universityInfo,
      });
    }
  }

  isUrlValid = event => {
    const pattern = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    return pattern.test(event);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === "universityName") {
      this.setState({ universityNameError: value.trim() === "" });
    }
  };

  handleLogoUpload = event => {
    const { name, files } = event.target;
    if (name === "logo") {
      this.setState({ logo: files[0] });
    } else if (name === "universityEventDecision") {
      this.setState({ universityEventDecision: files[0] });
    }
  };
  handleLinkChange = (event, index) => {
    const { value } = event.target;

    if (index === 0) {
      this.setState({
        link1: value,
      });
    }
    if (index === 1) {
      this.setState({
        link2: value,
      });
    }
    if (index === 2) {
      this.setState({
        link3: value,
      });
    }
  };

  testUniversityWebsite = () => {
    const universityWebsite = this.state.universityWebsite;

    if (!universityWebsite.trim()) {
      return "";
    }

    const isUrlValid = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(
      universityWebsite
    );

    return isUrlValid ? "" : universityWebsite;
  };

  handleSave = () => {
    const {
      universityName,
      universityEventDecision,
      contactNumber,
      faxNumber,
      universityWebsite,
      logo,
      link1,
      link2,
      link3,
    } = this.state;
    const { universityInfo } = this.props;
    if (universityInfo && universityInfo.length > 0) {
      const formData = {
        Id: 1,
        universityName,
        universityEventDecision,
        contactNumber,
        faxNumber,
        universityWebsite,
        logo,
        link1,
        link2,
        link3,
      };
      if (
        this.state.universityName.trim() === "" &&
        universityInfo[0].universityName.trim() === ""
      ) {
        this.setState({ universityNameError: true, saveError: true });
      } else {
        const updateUniMessage = this.props.t(
          "University info updated successfully"
        );
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: updateUniMessage,
        });

        this.props.onUpdateUniversityInfo(formData);
      }
    } else if (universityInfo && universityInfo.length == 0) {
      const formData = {
        universityName,
        universityEventDecision,
        contactNumber,
        faxNumber,
        universityWebsite,
        logo,
        link1,
        link2,
        link3,
      };
      if (this.state.universityName.trim() === "") {
        this.setState({ universityNameError: true, saveError: true });
      } else {
        const savedUniMessage = this.props.t(
          "University info added successfully"
        );
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: savedUniMessage,
        });

        this.props.onAddUniversityInfo(formData);
      }
    }
  };

  handleReset = () => {
    const restedata = {
      Id: 1,
      universityName: "",
      universityEventDecision: null,
      contactNumber: 0,
      faxNumber: 0,
      universityWebsite: "",
      logo: null,
      link1: "",
      link2: "",
      link3: "",
    };
    const { onUpdateUniversityInfo } = this.props;
    onUpdateUniversityInfo(restedata);
    this.setState({
      universityName: "",
      universityEventDecision: null,
      contactNumber: null,
      faxNumber: null,
      universityWebsite: "",
      logo: null,
      link1: "",
      link2: "",
      link3: "",
    });
  };

  handleAlertClose = () => {
    this.setState({ setErrormessage: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  render() {
    const {
      universityName,
      universityEventDecision,
      contactNumber,
      faxNumber,
      universityWebsite,
      logo,

      link1,
      link2,
      link3,
      links,
      universityNameError,
      successMessage,
      setErrormessage,
    } = this.state;

    document.title =
      "Form Elements | keyInHands - React Admin & Dashboard Template";

    const { t } = this.props; // Access the t function for translation

    return (
      <React.Fragment>
        <div className="page-content">
          <Breadcrumbs
            title={this.props.t("University System")}
            breadcrumbItem={this.props.t("University Definition")}
          />
          <div>
            {successMessage && (
              <Alert
                color="success"
                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                role="alert"
              >
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={this.handleSuccessClose}
                ></button>
              </Alert>
            )}
            {setErrormessage && (
              <Alert
                color="danger"
                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                role="alert"
              >
                {setErrormessage}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={this.handleAlertClose}
                ></button>
              </Alert>
            )}
          </div>

          <Form>
            <Card>
              <CardBody>
                <Row>
                  <Col className="col-12">
                    <Card>
                      <CardTitle id="add_header">
                        {this.props.t("University information")}
                      </CardTitle>

                      <CardBody>
                        <Row>
                          <Col lg="6">
                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <Label className="form-label">
                                    {this.props.t("University Name")}
                                  </Label>
                                  <span className="text-danger">*</span>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="universityName"
                                    name="universityName"
                                    autoComplete="off"
                                    className={`form-control ${
                                      universityNameError ? "is-invalid" : ""
                                    }`}
                                    placeholder={t("University Name")}
                                    value={universityName}
                                    onChange={this.handleInputChange}
                                  />

                                  {universityNameError && (
                                    <div className="invalid-feedback">
                                      {t("University Name is required")}
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </div>

                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <label
                                    htmlFor="contactNumber"
                                    className="col-form-label"
                                  >
                                    {t("Contact Number")}:
                                  </label>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="contactNumber"
                                    name="contactNumber"
                                    className="form-control"
                                    placeholder={t("1-(555)-555-5555")}
                                    value={contactNumber || ""}
                                    onChange={this.handleInputChange}
                                  />
                                </Col>
                              </Row>
                            </div>

                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <label
                                    htmlFor="universityWebsite"
                                    className="col-form-label"
                                  >
                                    {this.props.t("University Website")}:
                                  </label>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="universityWebsite"
                                    name="universityWebsite"
                                    className="form-control"
                                    placeholder="www.UniversityName.com"
                                    value={universityWebsite}
                                    onChange={this.handleInputChange}
                                  />
                                </Col>
                              </Row>
                            </div>

                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <label
                                    htmlFor="faxNumber"
                                    className="col-form-label"
                                  >
                                    {t("Fax Number")}:
                                  </label>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="number"
                                    id="faxNumber"
                                    name="faxNumber"
                                    className="form-control"
                                    value={faxNumber || ""}
                                    onChange={this.handleInputChange}
                                  />
                                </Col>
                              </Row>
                            </div>
                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <label
                                    htmlFor="universityEventDecision"
                                    className="col-form-label"
                                  >
                                    {this.props.t("University Event Decision")}:
                                  </label>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="file" // Change the input type to "file"
                                    id="universityEventDecision"
                                    name="universityEventDecision"
                                    accept="image/*" // Allow only image files to be uploaded
                                    onChange={this.handleLogoUpload} // Use the same handler for logo and university event decision
                                  />
                                </Col>
                              </Row>
                            </div>
                          </Col>

                          <Col lg="6">
                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <div className="logo">
                                    <Label
                                      htmlFor="logoUpload"
                                      className="btn btn-primary"
                                    >
                                      {this.props.t("university logo")}

                                      <Input
                                        name="logo"
                                        type="file"
                                        id="logoUpload"
                                        accept="image/*"
                                        style={{
                                          display: "none",
                                        }}
                                        onChange={this.handleLogoUpload}
                                      />
                                    </Label>
                                  </div>
                                </Col>

                                <Col lg="8" className="mt-4">
                                  {logo && (
                                    <img
                                      src={URL.createObjectURL(logo)}
                                      alt="University Logo"
                                      className="university-logo"
                                    />
                                  )}
                                </Col>
                              </Row>
                            </div>
                            <div className="mb-3">
                              <Row>
                                <Col lg="3" className="mt-2">
                                  <label className="col-form-label">
                                    {t("Important Links")}
                                  </label>
                                </Col>

                                <Col lg="7" className="mt-3">
                                  <ul className="list-unstyled">
                                    <li className="py-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Link1"
                                        value={link1}
                                        onChange={event =>
                                          this.handleLinkChange(event, 0)
                                        }
                                      />
                                    </li>
                                    <li className="py-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Link2"
                                        value={link2}
                                        onChange={event =>
                                          this.handleLinkChange(event, 1)
                                        }
                                      />
                                    </li>
                                    <li className="py-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Link3"
                                        value={link3}
                                        onChange={event =>
                                          this.handleLinkChange(event, 2)
                                        }
                                      />
                                    </li>
                                  </ul>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

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
                    onClick={this.handleReset}
                  >
                    {t("Reset")}
                  </button>
                </div>
              </CardBody>
            </Card>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ universityInfo }) => ({
  universityInfo: universityInfo.universityInfo,
});
const mapDispatchToProps = dispatch => ({
  onGetuniversityinfo: () => dispatch(getUniversityInfo()),

  onUpdateUniversityInfo: universityInfo =>
    dispatch(updateUniversityInfo(universityInfo)),

  onAddUniversityInfo: universityInfo =>
    dispatch(addUniversityInfo(universityInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UniversityInfo));
