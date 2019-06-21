import React from "react";
import cn from "classnames";
import { Link, Switch, Route, Redirect } from "react-router-dom";

// clients
import ClientListContainer from "containers/Clients/List";
import ClientAddContainer from "containers/Clients/Add";
import ClientEditContainer from "containers/Clients/Edit";

// campaigns
import CampaignListContainer from "containers/Campaigns/List";
import CampaignAddContainer from "containers/Campaigns/Add";
import CampaignEditContainer from "containers/Campaigns/Edit";

import styles from "./Router.module.scss";

class Router extends React.Component {
  render() {
    let selectedMenuItem = 0;
    if (window.location.pathname.startsWith("/users")) {
      selectedMenuItem = 0;
    } else if (window.location.pathname.startsWith("/block-numbers")) {
      selectedMenuItem = 1;
    } else {
      selectedMenuItem = 0; // default
    }
    return (
      <div className={styles.wrapper}>
        <header>Nope Admin</header>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Link
              to="/users"
              className={cn(
                styles.menuitem,
                selectedMenuItem === 0 && styles["menuitem-selected"]
              )}
            >
              Users
            </Link>
            <Link
              to="/block-numbers"
              className={cn(
                styles.menuitem,
                selectedMenuItem === 1 && styles["menuitem-selected"]
              )}
            >
              Phone Numbers
            </Link>
          </div>
          <div className={styles.content}>
            <Switch>
              <Route path="/users/add" component={ClientAddContainer} />
              <Route path="/users/edit/:id" component={ClientEditContainer} />
              <Route path="/users" component={ClientListContainer} />
              <Route
                path="/block-numbers/add"
                component={CampaignAddContainer}
              />
              <Route
                path="/block-numbers/edit/:id"
                component={CampaignEditContainer}
              />
              <Route path="/block-numbers" component={CampaignListContainer} />

              <Redirect to="/users" />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Router;
