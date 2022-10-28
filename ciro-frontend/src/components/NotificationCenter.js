import React from 'react';
import axios from 'axios';

import Notification from './Notification';

// TODO: use BASE_URL and pass var throughout
const ENDPOINT_URL = 'http://localhost:3001/new';

/**
 * Plan:
 *      - style the UI with material UI
 *      - add unit tests
 *      - convert to typescript
 *      - do not show all on first load, show like (and 2 more, view full notification center)
 *      - need to consider security
 *      - leave 15 mins to push and for README
 */

export default class NotificationCenter extends React.Component {
  state = {
    notifications: []
  }

  /**
   * add a database for notif dismissed per user by ID/userId
   * dont show notifications again
   */
  componentDidMount() {
    axios.get(`${ENDPOINT_URL}?userId=${ this.props.userId }`)
      .then(res => {
        // console.log('res', res);
        const data = res.data;
        // const data = [ res.data[0], res.data[1] ]; // only get a few for testing
        this.setState({ notifications: data });
      });
  }

  render() {
    return (
      <div className='ciro-notification-center'>
        {
          this.state.notifications.map(n =>
            <Notification userId={this.props.userId} notification={n} key={n.id} />
          )
        }
      </div>
    )
  }
}