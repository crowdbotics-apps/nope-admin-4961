import React from "react";
import PropTypes from "prop-types";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Switch from "react-switch";
import { AppContext } from "components";
import { CampaignController } from "controllers";

import styles from "./CampaignAddContainer.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import { getCampaigns } from "../../../controllers/Campaign";

class CampaignAddContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: "",
      calls: 0,
      yeps: 0,
      nopes: 0,
      blockByAdmin: true,
      existPhones: []
    };
  }

  async componentDidMount() {
    let blockNumbers = await getCampaigns();
    let existPhones = [];
    blockNumbers &&
      blockNumbers.length !== 0 &&
      (await blockNumbers.map(phone => {
        return existPhones.push(phone.phone);
      }));
    console.log(existPhones);
    this.setState({ existPhones });
  }

  basicInfoChanged(type, value) {
    this.setState({ [type]: value });
  }

  handleActiveChange = value => {
    this.setState({ blockByAdmin: value });
  };

  addClicked = async () => {
    let { existPhones, phone } = this.state;
    if (!isValidPhoneNumber(phone)) {
      alert("Phone number is invalid!");
      return;
    }

    if (existPhones.length !== 0 && existPhones.includes(phone)) {
      alert("Phone number is exist");
      return;
    }

    this.context.showLoading();
    await CampaignController.addCampaign(this.state);
    this.context.hideLoading();
    this.props.history.goBack();
  };

  cancelClicked = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <h1> Add new Phone Number </h1>
        <table>
          <thead>
            {/* <tr>
              <td>
                <h2>Basic Information</h2>
              </td>
            </tr> */}
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Phone Number</span>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={this.state.phone}
                    style={{ width: "100%", paddingLeft: 40 }}
                    onChange={phone => this.setState({ phone })}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Yep's</span>
                  <input
                    value={this.state.yeps}
                    type="number"
                    onChange={text => this.basicInfoChanged("yeps", text)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Number of Calls</span>
                  <input
                    value={this.state.calls}
                    type="number"
                    onChange={text => this.basicInfoChanged("calls", text)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Nope's</span>
                  <input
                    value={this.state.nopes}
                    numeric={true}
                    type="number"
                    onChange={text => this.basicInfoChanged("nopes", text)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>BlackListed</span>
                  <Switch
                    onChange={this.handleActiveChange}
                    checked={this.state.blockByAdmin}
                    id="normal-switch"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.btnGroup}>
          <div className={styles.btnSave} onClick={this.addClicked}>
            Save
          </div>
          <div className={styles.btnCancel} onClick={this.cancelClicked}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

CampaignAddContainer.contextType = AppContext;

CampaignAddContainer.propTypes = {
  history: PropTypes.object
};

export default CampaignAddContainer;
