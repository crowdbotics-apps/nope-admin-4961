import React from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import uuid from "uuid/v4";

import { AppContext } from "components";
import { ClientController } from "controllers";

import styles from "./ClientAddContainer.module.scss";

class ClientAddContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basic: {
        org: "",
        contact: ""
      },
      groups: [this.generateNewGroup()]
    };

    this.fileInputs = {};
  }

  generateNewGroup = () => {
    return {
      id: uuid(),
      name: "",
      division: "",
      number_of_participants: 0,
      participant_list: []
    };
  };

  addClicked = async () => {
    this.context.showLoading();
    try {
      await ClientController.addClient(this.state);
      alert("A new user is added.");
      this.props.history.goBack();
    } catch (error) {
      alert(error.message);
    }
    this.context.hideLoading();
  };

  cancelClicked = () => {
    this.props.history.goBack();
  };

  addmoreClicked = () => {
    let { groups } = this.state;

    let last = groups[groups.length - 1];
    if (!last.name || !last.division) {
      alert("Please complete the current participant group to add more.");
      return;
    }
    groups.push(this.generateNewGroup());
    this.setState({ groups });
  };

  uploadClicked = id => () => {
    this.fileInputs[id].click();
  };

  fileUploadChange = index => e => {
    let files = e.target.files;
    if (files.length > 0) {
      Papa.parse(files[0], {
        error: error => {
          alert(error.message);
        },
        complete: results => {
          let { groups } = this.state;
          groups[index]["participant_list"] = results.data;
          groups[index]["number_of_participants"] = results.data.length;
          this.setState({ groups });
        }
      });
    }
  };

  basicInfoChanged = type => e => {
    let { basic } = this.state;
    basic[type] = e.target.value;
    this.setState({ basic });
  };

  groupChange = (type, index) => e => {
    let { groups } = this.state;
    groups[index][type] = e.target.value;
    this.setState({ groups });
  };

  groupRemove = index => () => {
    let { groups } = this.state;
    groups.splice(index, 1);
    this.setState({ groups });
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <h1> Add a new user </h1>
        <div className={styles.container}>
          <h2>Basic Info</h2>
          <div className={styles.inputItem}>
            <span>Organization</span>
            <input
              value={this.state.basic.org}
              onChange={this.basicInfoChanged("org")}
            />
          </div>
          <div className={styles.inputItem}>
            <span>Contact</span>
            <input
              value={this.state.basic.contact}
              onChange={this.basicInfoChanged("contact")}
            />
          </div>
        </div>
        {this.state.groups.map((group, index) => (
          <div key={group.id} className={styles.container}>
            <div className={styles.title}>
              <h2>Participant Group</h2>
              {this.state.groups.length > 1 && (
                <span onClick={this.groupRemove(index)}>
                  <i className={`fa fa-minus-circle ${styles.iconRemove}`} />
                </span>
              )}
            </div>
            <div className={styles.inputItem}>
              <span>Participant Group Name</span>
              <input
                value={group.name}
                onChange={this.groupChange("name", index)}
              />
            </div>
            <div className={styles.inputItem}>
              <span>Division / Location</span>
              <input
                value={group.division}
                onChange={this.groupChange("division", index)}
              />
            </div>
            <div className={styles.inputItem}>
              <span>Number of Participants</span>
              <input disabled value={group.number_of_participants} />
            </div>
            <div className={styles.inputItem}>
              <span>Participant List</span>
              <div
                className={styles.btnUpload}
                onClick={this.uploadClicked(group.id)}
              >
                Upload CSV
              </div>
              <input
                ref={ref => (this.fileInputs[group.id] = ref)}
                type="file"
                className={styles.file}
                accept=".csv"
                onChange={this.fileUploadChange(index)}
              />
            </div>
            {group.participant_list.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {group.participant_list.map((participant, index) => (
                    <tr key={`${index}`}>
                      <td>{participant[0]}</td>
                      <td>{participant[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {index === this.state.groups.length - 1 && (
              <div className={styles.btnAddMore} onClick={this.addmoreClicked}>
                Add More Participant Group
              </div>
            )}
          </div>
        ))}
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

ClientAddContainer.contextType = AppContext;

ClientAddContainer.propTypes = {
  history: PropTypes.object
};

export default ClientAddContainer;
