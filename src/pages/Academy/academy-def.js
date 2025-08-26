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
import "./Academy.scss";
import {
  getAcademyInfo,
  updateAcademyInfo,
  addAcademyInfo,
} from "store/academydef/actions";

class AcademyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      academyInfo: [],
      academyName: "",
      academyEventDecision: null,
      contactNumber: "",
      faxNumber: "",
      academyWebsite: "",
      logo: null,
      link1: "",
      link2: "",
      link3: "",
      links: ["", "", ""],
      academyNameError: false,
      saveError: false,
      linkErrors: [false, false, false],
      academyWebsiteError: false,
      setErrormessage: false,
      successMessage: null,
    };
  }

  componentDidMount() {
    const { academyInfo, onGetacademyinfo } = this.props;
    if (academyInfo && !academyInfo.length) {
      onGetacademyinfo();
    }
    this.setState({ academyInfo });
  }

  componentDidUpdate(prevProps) {
    const { academyInfo } = this.props;
    if (prevProps.academyInfo !== this.props.academyInfo) {
      this.setState({
        academyName:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].academyName
            : "",
        academyEventDecision:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].academyEventDecision
            : "",
        contactNumber:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].contactNumber
            : "",
        faxNumber:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].faxNumber
            : "",
        academyWebsite:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].academyWebsite
            : "",
        logo:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].logo
            : "",
        link1:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].link1
            : "",
        link2:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].link2
            : "",
        link3:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].link3
            : "",
        academyInfo: academyInfo,
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
    if (name === "academyName") {
      this.setState({ academyNameError: value.trim() === "" });
    }
  };

  handleLogoUpload = event => {
    const { name, files } = event.target;
    if (name === "logo") {
      this.setState({ logo: files[0] });
    } else if (name === "academyEventDecision") {
      this.setState({ academyEventDecision: files[0] });
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

  testAcademyWebsite = () => {
    const academyWebsite = this.state.academyWebsite;

    if (!academyWebsite.trim()) {
      return "";
    }

    const isUrlValid = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(
      academyWebsite
    );

    return isUrlValid ? "" : academyWebsite;
  };

  handleSave = () => {
    const {
      academyName,
      academyEventDecision,
      contactNumber,
      faxNumber,
      academyWebsite,
      logo,
      link1,
      link2,
      link3,
    } = this.state;
    const { academyInfo } = this.props;
    if (academyInfo && academyInfo.length > 0) {
      const formData = {
        Id: 1,
        academyName,
        academyEventDecision,
        contactNumber,
        faxNumber,
        academyWebsite,
        logo,
        link1,
        link2,
        link3,
      };
      if (
        this.state.academyName.trim() === "" &&
        academyInfo[0].academyName.trim() === ""
      ) {
        this.setState({ academyNameError: true, saveError: true });
      } else {
        const updateUniMessage = this.props.t(
          "Academy info updated successfully"
        );
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: updateUniMessage,
        });

        this.props.onUpdateAcademyInfo(formData);
      }
    } else if (academyInfo && academyInfo.length == 0) {
      const formData = {
        academyName,
        academyEventDecision,
        contactNumber,
        faxNumber,
        academyWebsite,
        logo,
        link1,
        link2,
        link3,
      };
      if (this.state.academyName.trim() === "") {
        this.setState({ academyNameError: true, saveError: true });
      } else {
        const savedUniMessage = this.props.t(
          "Academy info added successfully"
        );
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: savedUniMessage,
        });

        this.props.onAddAcademyInfo(formData);
      }
    }
  };

  handleReset = () => {
    const restedata = {
      Id: 1,
      academyName: "",
      academyEventDecision: null,
      contactNumber: 0,
      faxNumber: 0,
      academyWebsite: "",
      logo: null,
      link1: "",
      link2: "",
      link3: "",
    };
    const { onUpdateAcademyInfo } = this.props;
    onUpdateAcademyInfo(restedata);
    this.setState({
      academyName: "",
      academyEventDecision: null,
      contactNumber: null,
      faxNumber: null,
      academyWebsite: "",
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
      academyName,
      academyEventDecision,
      contactNumber,
      faxNumber,
      academyWebsite,
      logo,

      link1,
      link2,
      link3,
      links,
      academyNameError,
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
            title={this.props.t("Academy System")}
            breadcrumbItem={this.props.t("Academy Definition")}
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
                        {this.props.t("Academy information")}
                      </CardTitle>

                      <CardBody>
                        <Row>
                          <Col lg="6">
                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <Label className="form-label">
                                    {this.props.t("Academy Name")}
                                  </Label>
                                  <span className="text-danger">*</span>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="academyName"
                                    name="academyName"
                                    autoComplete="off"
                                    className={`form-control ${
                                      academyNameError ? "is-invalid" : ""
                                    }`}
                                    placeholder={t("Academy Name")}
                                    value={academyName}
                                    onChange={this.handleInputChange}
                                  />

                                  {academyNameError && (
                                    <div className="invalid-feedback">
                                      {t("Academy Name is required")}
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
                                    htmlFor="academyWebsite"
                                    className="col-form-label"
                                  >
                                    {this.props.t("Academy Website")}:
                                  </label>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="academyWebsite"
                                    name="academyWebsite"
                                    className="form-control"
                                    placeholder="www.AcademyName.com"
                                    value={academyWebsite}
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
                                    htmlFor="academyEventDecision"
                                    className="col-form-label"
                                  >
                                    {this.props.t("Academy Event Decision")}:
                                  </label>
                                </Col>

                                <Col lg="8" className="mt-3">
                                  <input
                                    type="file" // Change the input type to "file"
                                    id="academyEventDecision"
                                    name="academyEventDecision"
                                    accept="image/*" // Allow only image files to be uploaded
                                    onChange={this.handleLogoUpload} // Use the same handler for logo and academy event decision
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
                                      {this.props.t("academy logo")}

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
                                      alt="Academy Logo"
                                      className="academy-logo"
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
const mapStateToProps = ({ academyInfo }) => ({
  academyInfo: academyInfo.academyInfo,
});
const mapDispatchToProps = dispatch => ({
  onGetacademyinfo: () => dispatch(getAcademyInfo()),

  onUpdateAcademyInfo: academyInfo =>
    dispatch(updateAcademyInfo(academyInfo)),

  onAddAcademyInfo: academyInfo =>
    dispatch(addAcademyInfo(academyInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AcademyInfo));
