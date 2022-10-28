import React from 'react';
import axios from 'axios';
import './Notification.css';

// TODO: use BASE_URL and pass var throughout
const DISMISS_URL = 'http://localhost:3001/dismiss';

export default class NotificationCenter extends React.Component {
    state = {
      hidden: false
    }

    constructor() {
        super();
        this.dismissNotifcation = this.dismissNotifcation.bind(this);
    }

    dismissNotifcation() {
        console.log(this.props);
        axios.get(`${DISMISS_URL}?userId=${ this.props.userId }&notificationId=${this.props.notification.id}`)
            .then(res => {
                console.log('res', res);
                if (res.status === 200) {
                    this.setState({ hidden: true });
                } else {
                    alert('Notification could not be dismissed, try again.');
                }
            });
    }

  render() {
    // TODO: need to parse notification body using url tool
    return (
        this.state.hidden ?
            <div></div>
        :
            <div className="ciro-notification">
                <div>
                    <a
                        href={this.props.notification.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                            >{this.props.notification.companyName}
                    </a>
                </div>
                <div>{this.props.notification.companyPhone}</div>
                <div>{this.props.notification.companyAddress}</div>
                <hr></hr>
                <div>What's New?</div>
                <div>
                    <span>{this.props.notification.notificationBody}</span>
                    { this.props.notification.notificationSource ?
                            <a href={this.props.notification.notificationSource}
                                target="_blank"
                                rel="noreferrer">(source)</a>
                    : null }
                </div>
                <button onClick={this.dismissNotifcation}>Dismiss</button>
            </div>
    );
  }
}