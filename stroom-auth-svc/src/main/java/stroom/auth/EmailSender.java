/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth;

import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.ServerConfig;
import org.simplejavamail.mailer.config.TransportStrategy;
import stroom.auth.config.Config;
import stroom.auth.resources.user.v1.User;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.mail.Message;

@Singleton
public class EmailSender {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(EmailSender.class);
    private Config config;

    @Inject
    public EmailSender(Config config) {
        this.config = config;
    }

    public void send(User user, String resetToken) {
        String resetName = user.getFirst_name() + "" + user.getLast_name();
        String resetUrl = String.format(config.getResetPasswordUrl(), resetToken);
        String passwordResetEmailText = String.format(config.getEmailConfig().getPasswordResetText(), resetUrl);

        Email email = new Email();
        email.setFromAddress(config.getEmailConfig().getFromName(), config.getEmailConfig().getFromAddress());
        email.setReplyToAddress(config.getEmailConfig().getFromName(), config.getEmailConfig().getFromAddress());
        email.addRecipient(resetName, user.getEmail(), Message.RecipientType.TO);
        email.setSubject(config.getEmailConfig().getPasswordResetSubject());
        email.setText(passwordResetEmailText);

        TransportStrategy transportStrategy = config.getEmailConfig().getSmtpConfig().getTransportStrategy();

        new Mailer(
                new ServerConfig(
                        config.getEmailConfig().getSmtpConfig().getHost(),
                        config.getEmailConfig().getSmtpConfig().getPort(),
                        config.getEmailConfig().getSmtpConfig().getUsername(),
                        config.getEmailConfig().getSmtpConfig().getPassword()),
                transportStrategy
        ).sendMail(email);
    }
}
