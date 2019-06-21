import React from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import uuid from "uuid/v4";

import { AppContext } from "components";
import { ClientController } from "controllers";

import styles from "./ClientEditContainer.module.scss";

class ClientEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientId: props.match.params.id
    };
  }

  async componentDidMount() {
    this.context.showLoading();
    let data = await ClientController.getClientById(this.state.clientId);

    this.setState({
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status === "false" ? false : true
    });
    this.context.hideLoading();
  }

  updateClicked = async () => {
    this.context.showLoading();
    try {
      await ClientController.updateClient(this.state);
      alert("This client is updated.");
      this.props.history.goBack();
    } catch (error) {
      alert(error.message);
    }
    this.context.hideLoading();
  };

  cancelClicked = () => {
    this.props.history.goBack();
  };

  basicInfoChanged = type => e => {
    this.setState({ [type]: e.target.value });
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <h1> Edit User </h1>
        <div className={styles.container}>
          <h2>Basic Info</h2>
          <div className={styles.inputItem}>
            <span>Name</span>
            <input
              value={this.state.name}
              onChange={this.basicInfoChanged("name")}
            />
          </div>
          <div className={styles.inputItem}>
            <span>Email</span>
            <input
              disabled={true}
              value={this.state.email}
              onChange={this.basicInfoChanged("email")}
            />
          </div>
          <div className={styles.inputItem}>
            <span>Phone Number</span>
            <input
              value={this.state.phone}
              onChange={this.basicInfoChanged("phone")}
            />
          </div>
        </div>

        <div className={styles.btnGroup}>
          <div className={styles.btnSave} onClick={this.updateClicked}>
            Update
          </div>
          <div className={styles.btnCancel} onClick={this.cancelClicked}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

ClientEditContainer.contextType = AppContext;

ClientEditContainer.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default ClientEditContainer;
