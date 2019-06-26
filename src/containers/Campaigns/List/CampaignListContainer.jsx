import React from "react";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import Switch from "react-switch";
import { AppContext } from "components";
import { CampaignController } from "controllers";
import styles from "./CampaignListContainer.module.scss";

var _ = require("lodash");
class CampaignListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      { title: "No", key: "" },
      { title: "Phone Number", key: "phone" },
      { title: "Number of Calls", key: "calls" },
      { title: "Yep's", key: "yeps" },
      { title: "Nope's", key: "nopes" },
      { title: "Blacklisted", key: "" }
      // { title: "Actions", key: "" }
    ];

    this.state = {
      data: [],
      filter: "phone",
      keyword: "",
      activePage: 1,
      itemPerPage: 10
    };
  }

  async componentDidMount() {
    await this.reload();
  }

  reload = async () => {
    this.context.showLoading();

    let data = await CampaignController.getCampaigns();

    data = data.filter(campaign =>
      campaign.phone.toLowerCase().includes(this.state.keyword.toLowerCase())
    );
    this.setState({
      data
    });

    this.context.hideLoading();
  };

  searchfilterChanged = filter => () => {
    this.setState({
      filter
    });
  };

  addClicked = () => {
    this.props.history.push("/block-numbers/add");
  };

  // editClicked = campaignId => () => {
  //   this.props.history.push(`/block-numbers/edit/${campaignId}`);
  // };

  async activateClicked(id) {
    if (window.confirm("Do you want to un-block this phone number?")) {
      await CampaignController.activateCampaign(id);
      await this.reload();
    }
  }

  async deactivateClicked(id) {
    if (window.confirm("Do you want to block this phone number?")) {
      await CampaignController.deactivateCampaign(id);
      await this.reload();
    }
  }

  handleActiveChange = async item => {
    if (item.blockByAdmin || item.nopes >= 10) {
      await this.activateClicked(item.id);
    } else {
      await this.deactivateClicked(item.id);
    }
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
    if (key !== "") {
      let { data } = this.state;
      data = _.orderBy(data, key);
      this.setState({ data });
    }
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
            <td>{item.phone}</td>
            <td>{item.calls}</td>
            <td>{item.yeps}</td>
            <td>{item.nopes}</td>
            <td>
              <Switch
                onChange={() => this.handleActiveChange(item)}
                checked={item.nopes >= 10 || item.blockByAdmin ? true : false}
                id="normal-switch"
              />
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
          </div>
          <div className={styles.btnAdd} onClick={this.addClicked}>
            <i className={`fa fa-plus ${styles.icon}`} />
            Add
          </div>
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

CampaignListContainer.contextType = AppContext;

CampaignListContainer.propTypes = {
  history: PropTypes.object
};
export default CampaignListContainer;
