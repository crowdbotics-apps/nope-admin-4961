import React from "react";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import { AppContext } from "components";
import { CampaignController } from "controllers";
import styles from "./LoginContainer.module.scss";

var _ = require("lodash");
class LoginContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filter: "phone",
      keyword: "",
      activePage: 1,
      itemPerPage: 10
    };
  }

  async componentDidMount() {}

  render() {
    return (
      <div className={styles.wrapper}>
        <div className="container">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              required
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              required
              value={this.state.password}
              onChange={this.onChange}
            />
          </div>
          <input
            type="submit"
            value="Login"
            className="btn btn-primary btn-block"
          />
        </div>
      </div>
    );
  }
}

LoginContainer.contextType = AppContext;

LoginContainer.propTypes = {
  history: PropTypes.object
};
export default LoginContainer;
