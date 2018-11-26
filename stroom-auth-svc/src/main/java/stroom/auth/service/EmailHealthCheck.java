package stroom.auth.service;

import com.codahale.metrics.health.HealthCheck;
import stroom.auth.EmailSender;
import stroom.auth.resources.user.v1.User;

/**
 * A health check for email sending. It tries to send an email and logs any exception that comes out.
 */
public class EmailHealthCheck extends HealthCheck {
    private EmailSender emailSender;

    public EmailHealthCheck(EmailSender emailSender){
        this.emailSender = emailSender;
    }

    @Override
    protected Result check() throws Exception {
        try {
            User dummyUser = new User("dummy_email@dummydummydummydummy.abc", "Dummy password");
            dummyUser.setFirst_name("Dummy first name");
            dummyUser.setLast_name("Dummy last name");
            emailSender.send(dummyUser, "Dummy token");
        }catch(Exception ex){
            return Result.unhealthy(ex);
        }
        return Result.healthy();
    }
}
