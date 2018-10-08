/*
 * Copyright 2016 Crown Copyright
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

package stroom.auth.service.eventlogging;

import event.logging.AuthenticateAction;
import event.logging.AuthenticateOutcome;
import event.logging.Event;
import event.logging.impl.DefaultEventSerializer;
import event.logging.impl.EventSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.config.EventLoggingConfig;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;

import static event.logging.AuthenticateOutcomeReason.ACCOUNT_LOCKED;
import static event.logging.AuthenticateOutcomeReason.INCORRECT_USERNAME_OR_PASSWORD;

@Singleton
/**
 * A service to allow other components to easily create Stroom logging events.
 */
public class StroomEventLoggingService {

    private static final Logger AUDIT_LOGGER = LoggerFactory.getLogger("event-logger");

    private final StroomEventFactory stroomEventFactory;

    private final EventSerializer eventSerializer = new DefaultEventSerializer();

    @Inject
    public StroomEventLoggingService(EventLoggingConfig config) {
        stroomEventFactory = new StroomEventFactory(config);
    }

    public void successfulLogin(final HttpServletRequest request, String usersEmail) {
        Event event = stroomEventFactory.createAuthenticateEvent(
                request, usersEmail, AuthenticateAction.LOGON);
        create(event);
    }

    public void failedLogin(final HttpServletRequest request, String usersEmail) {
        Event event = stroomEventFactory.createAuthenticateEvent(
                request, usersEmail, AuthenticateAction.LOGON);
        AuthenticateOutcome authenticateOutcome = new AuthenticateOutcome();
        authenticateOutcome.setReason(INCORRECT_USERNAME_OR_PASSWORD);
        event.getEventDetail().getAuthenticate().setOutcome(authenticateOutcome);
        create(event);
    }

    public void failedLoginBecauseLocked(final HttpServletRequest request, String usersEmail) {
        Event event = stroomEventFactory.createAuthenticateEvent(
                request, usersEmail, AuthenticateAction.LOGON);
        AuthenticateOutcome authenticateOutcome = new AuthenticateOutcome();
        authenticateOutcome.setReason(ACCOUNT_LOCKED);
        event.getEventDetail().getAuthenticate().setOutcome(authenticateOutcome);
        create(event);
    }

    public void logout(final HttpServletRequest request, String usersEmail) {
        Event event = stroomEventFactory.createAuthenticateEvent(
                request, usersEmail, AuthenticateAction.LOGOFF);
        create(event);
    }

    public void resetPassword(final HttpServletRequest request, String usersEmail) {
        Event event = stroomEventFactory.createAuthenticateEvent(
                request, usersEmail, AuthenticateAction.RESET_PASSWORD);
        create(event);
    }

    public void changePassword(final HttpServletRequest request, String usersEmail) {
        Event event = stroomEventFactory.createAuthenticateEvent(
                request, usersEmail, AuthenticateAction.CHANGE_PASSWORD);
        create(event);
    }


    private void create(Event event) {
        String data = this.eventSerializer.serialize(event);
        String trimmed = data.trim();
        if (trimmed.length() > 0) {
            AUDIT_LOGGER.info(trimmed);
        }
    }

}