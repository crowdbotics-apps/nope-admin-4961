import React from "react";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import { AppContext } from "components";
import { ClientController } from "controllers";
import { getCampaigns } from "../../../controllers/Campaign";
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
      filter: "name",
      activePage: 1,
      itemPerPage: 10,
      totalUsers: 0,
      totalYeps: 0,
      totalNopes: 0,
      totalBlacklisted: 0,
      totalWhitelisted: 0
    };
  }

  async componentDidMount() {
    await this.reload();
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  reload = async () => {
    this.context.showLoading();

    let phones = await getCampaigns();
    phones &&
      phones.length !== 0 &&
      (await phones.map(phone => {
        this.setState({
          totalYeps: this.state.totalYeps + phone.yeps,
          totalNopes: this.state.totalNopes + phone.nopes
        });
        if (phone.blockByAdmin || phone.nopes >= 10) {
          this.setState({ totalBlacklisted: this.state.totalBlacklisted + 1 });
        } else {
          this.setState({ totalWhitelisted: this.state.totalWhitelisted + 1 });
        }
      }));

    let data = await ClientController.getClients();
    await this.setState({ totalUsers: data.length || 0 });
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

  // addClicked = () => {
  //   this.props.history.push("/clients/add");
  // };

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
    let { data } = this.state;
    data = _.orderBy(data, key);
    this.setState({ data });
  }

  createRow() {
    const { data } = this.state;
    let children = [];
    for (
      var i = (this.state.activePage - 1) * this.state.itemPerPage;
      i < this.state.activePage * this.state.itemPerPage;
      i++
    ) {
      let item = data[i];
      children.push(
        _.isEmpty(item) ? null : (
          <tr key={item.id}>
            <td>{`${i + 1}`}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td>
              <span onClick={this.editClicked(item.id)}>
                <i className={`fa fa-pencil-square-o ${styles.iconPencil}`} />
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
        )
      );
    }
    return children;
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.inputItem}>
            <span>Total Users:</span>
            <span>{this.state.totalUsers}</span>
          </div>
          <div className={styles.inputItem}>
            <span>Total Yep's:</span>
            <span>{this.state.totalYeps}</span>
          </div>
          <div className={styles.inputItem}>
            <span>Total Nope's:</span>
            <span>{this.state.totalNopes}</span>
          </div>
          <div className={styles.inputItem}>
            <span>Total BlackListed:</span>
            <span>{this.state.totalBlacklisted}</span>
          </div>
          <div className={styles.inputItem}>
            <span>Total Whitelisted:</span>
            <span>{this.state.totalWhitelisted}</span>
          </div>
        </div>
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
          <div>
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
              <tbody>{this.createRow()}</tbody>
            </table>
            <div className={styles.bottom}>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemPerPage}
                totalItemsCount={this.state.data.length}
                onChange={pageNumber => this.handlePageChange(pageNumber)}
                innerClass={styles.pagination}
                activeClass={styles.activeItem}
              />
            </div>
          </div>
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
