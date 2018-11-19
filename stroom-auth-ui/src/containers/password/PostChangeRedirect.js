/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import Countdown from 'react-countdown-now';
import {compose, withState, lifecycle} from 'recompose';
import {withRouter} from 'react-router';
import queryString from 'query-string';

const enhance = compose(
  withRouter,
  withState('redirectUrl', 'setRedirectUrl', undefined),
  lifecycle({
    componentDidMount() {
      const {setRedirectUrl} = this.props;
      const query = queryString.parse(this.props.location.search);
      if (query.redirect_url) {
        const redirectUrl = decodeURIComponent(query.redirect_url);
        setRedirectUrl(redirectUrl);
      }
    },
  }),
);

const PostChangeRedirect = ({redirectUrl}) => {
  return (
    <div>
      <br />
      <p>
        We're going to send you back to your original destination in&nbsp;
        <Countdown
          date={Date.now() + 5000}
          renderer={({hours, minutes, seconds, completed}) => (
            <span className="ChangePassword-countdown">{seconds}</span>
          )}
          onComplete={() => {
            window.location.href = redirectUrl;
          }}
        />
        &nbsp;seconds, or you can <a href={redirectUrl}>go there now.</a>
      </p>
    </div>
  );
};

export default enhance(PostChangeRedirect);
