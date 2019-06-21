import React from "react";
import PropTypes from "prop-types";

import { AppContext } from "components";
import { ClientController } from "controllers";
import styles from "./ClientListContainer.module.scss";

var _ = require("lodash");
class ClientListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      { title: "No", key: "" },
      { title: "Name", key: "name" },
      { title: "Email", key: "email" },
      { title: "Phone Number", key: "phone" },
      { title: "Actions", key: "" }
    ];

    this.state = {
      data: [],
      keyword: "",
      filter: "name"
    };
  }

  async componentDidMount() {
    await this.reload();
  }

  reload = async () => {
    this.context.showLoading();

    let data = await ClientController.getClients();
    console.log(data);
    console.log(this.state.filter);
    data = data
      .filter(client =>
        (client[this.state.filter] || "")
          .toLowerCase()
          .includes(this.state.keyword.toLowerCase())
      )
      .map(client => {
        let item = { ...client };

        return item;
      });

    await this.setState({ data });
    this.context.hideLoading();
  };

  addClicked = () => {
    this.props.history.push("/clients/add");
  };

  editClicked = clientId => () => {
    this.props.history.push(`/users/edit/${clientId}`);
  };

  deactivateClicked = clientId => async () => {
    var res = window.confirm("Do you want to deactivate this user?");
    if (res) {
      await ClientController.deactivateClient(clientId);
      await this.reload();
    }
  };

  activateClicked = clientId => async () => {
    var res = window.confirm("Do you want to activate this user?");
    if (res) {
      await ClientController.activateClient(clientId);
      await this.reload();
    }
  };

  searchfilterChanged = filter => () => {
    this.setState({
      filter
    });
  };

  searchInputChanged = e => {
    this.setState(
      {
        keyword: e.target.value
      },
      async () => {
        if (!this.state.keyword) {
          await this.reload();
        }
      }
    );
  };

  searchInputKeyPressed = async e => {
    if (e.charCode === 13) {
      // enter pressed
      await this.reload();
    }
  };

  sortBy(key) {
    console.log(key);
    let { data } = this.state;
    data = _.orderBy(data, key);
    this.setState({ data });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.searchContainer}>
            <div className={styles.searchbar}>
              <i className={`fa fa-search ${styles.iconSearch}`} />
              <input
                type="text"
                placeholder="Type here and press enter to get the result..."
                value={this.state.keyword}
                onChange={this.searchInputChanged}
                onKeyPress={this.searchInputKeyPressed}
              />
            </div>
            <div className={styles.searchfilters}>
              <div
                className={styles.filter}
                onClick={this.searchfilterChanged("name")}
              >
                <input
                  type="checkbox"
                  value="name"
                  checked={this.state.filter === "name"}
                  onChange={this.searchfilterChanged("name")}
                />
                Search by name
              </div>
              <div
                className={styles.filter}
                onClick={this.searchfilterChanged("email")}
              >
                <input
                  type="checkbox"
                  value="email"
                  checked={this.state.filter === "email"}
                  onChange={this.searchfilterChanged("email")}
                />
                Search by email
              </div>

              <div
                className={styles.filter}
                onClick={this.searchfilterChanged("phone")}
              >
                <input
                  type="checkbox"
                  value="org"
                  checked={this.state.filter === "phone"}
                  onChange={this.searchfilterChanged("phone")}
                />
                Search by phone number
              </div>
            </div>
          </div>
          {/* <div className={styles.btnAdd} onClick={this.addClicked}>
            <i className={`fa fa-plus ${styles.icon}`} />
            Add
          </div> */}
        </div>
        {this.state.data.length ? (
          <table>
            <thead>
              <tr className={styles.header}>
                {this.columns.map(item => (
                  <th key={item.title} onClick={() => this.sortBy(item.key)}>
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((item, index) => (
                <tr key={item.id}>
                  <td>{`${index + 1}`}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <span onClick={this.editClicked(item.id)}>
                      <i
                        className={`fa fa-pencil-square-o ${styles.iconPencil}`}
                      />
                    </span>
                    {item.status ? (
                      <span onClick={this.deactivateClicked(item.id)}>
                        <i className={`fa fa-trash-o ${styles.iconTrash}`} />
                      </span>
                    ) : (
                      <span onClick={this.activateClicked(item.id)}>
                        <i className={`fa fa-refresh ${styles.iconRefresh}`} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h3>No Search Result</h3>
        )}
      </div>
    );
  }
}

ClientListContainer.contextType = AppContext;

ClientListContainer.propTypes = {
  history: PropTypes.object
};

export default ClientListContainer;
