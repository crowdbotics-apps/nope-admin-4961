import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import DatePicker from "react-datepicker";
import uuid from "uuid/v4";

import { AppContext } from "components";
import { ClientController, CampaignController } from "controllers";
import QuestionType from "../../../constants/questionType";

import styles from "./CampaignEditContainer.module.scss";
import "react-datepicker/dist/react-datepicker.css";

import selectStyles from "../Add/select.styles";

class CampaignEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    this.context.showLoading();

    this.context.hideLoading();
  }

  updateClicked = async () => {
    // validation for basic info
    let { basic, questions } = this.state;
    basic["description"] = this.description.innerHTML;

    this.context.showLoading();
    if (!basic.name) {
      alert("Name is empty or invalid!");
      return;
    }
    if (!basic.marketing_name) {
      alert("Marketing Name is empty or invalid!");
      return;
    }
    if (!basic.org) {
      alert("Please select Organization!");
      return;
    }
    if (!basic.participant_group) {
      alert("Please select Participant Group!");
      return;
    }
    if (parseInt(basic.total_points) <= 0) {
      alert("Total point is not valid!");
      return;
    }
    if (!basic.description) {
      alert("Description is empty or invalid!");
      return;
    }

    // validation for questions
    for (var i = 0; i < questions.length; i++) {
      if (!questions[i].question) {
        alert(`Question${i + 1}'s Question Text is empty or invalid!`);
        return;
      }
      if (questions[i].type !== QuestionType.OPEN_TEXT_QUESTION) {
        for (let j = 0; j < questions[i].answers.length; j++) {
          if (!questions[i].answers[j]) {
            alert(`Question${i + 1}'s Question Answers are not completed!`);
            return;
          }
        }
      }
    }

    // updating a campaign
    try {
      await CampaignController.updateCampaign({
        campaignId: this.state.campaignId,
        basic: this.state.basic,
        questions: this.state.questions
      });
      this.props.history.goBack();
    } catch (error) {
      alert(error.message);
    }

    this.context.hideLoading();
  };

  cancelClicked = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <h1> Edit phone number </h1>
        <table>
          <thead>
            <tr>
              <td>
                <h2>Basic Information</h2>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Phone Number</span>
                  <input
                    value={this.state.basic.name}
                    onChange={this.basicInfoChanged("name")}
                  />
                </div>
              </td>
              <td>
                <div className={styles.inputItem}>
                  <span>Number of Calls</span>
                  <input
                    value={this.state.basic.marketing_name}
                    onChange={this.basicInfoChanged("marketing_name")}
                  />
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Starting Date</span>
                  <DatePicker
                    className={styles.datepicker}
                    selected={this.state.basic.from}
                    onChange={this.basicInfoChanged("from")}
                  />
                </div>
              </td>
              <td>
                <div className={styles.inputItem}>
                  <span>Ending Date</span>
                  <DatePicker
                    className={styles.datepicker}
                    selected={this.state.basic.to}
                    onChange={this.basicInfoChanged("to")}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Participant Group</span>
                  <div className={styles.select}>
                    <Select
                      styles={selectStyles}
                      value={this.state.selectedGroup}
                      onChange={this.basicInfoChanged("participant_group")}
                      options={this.state.groupList}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.inputItem}>
                  <span>Total Points</span>
                  <input
                    value={this.state.basic["total_points"]}
                    onChange={this.basicInfoChanged("total_points")}
                  />
                </div>
              </td>
              <td>
                <div className={styles.textareaItem}>
                  <span>Description</span>
                  <div
                    ref={ref => (this.description = ref)}
                    className={styles.textContainer}
                    contentEditable
                    dangerouslySetInnerHTML={{
                      __html: this.state.basic["description"]
                    }}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {this.state.questions.map((question, index) =>
          this.renderQuestion(question, index)
        )}
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

CampaignEditContainer.contextType = AppContext;

CampaignEditContainer.propTypes = {
  history: PropTypes.object
};

export default CampaignEditContainer;
