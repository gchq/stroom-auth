package stroom.auth.resources.authentication.v1;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@ApiModel(description = "A response to a request to change a user's password.")
public class ChangePasswordResponse {
    @NotNull
    @ApiModelProperty(value = "Whether or not the change password request has succeeded.", required = true)
    private boolean changeSucceeded = true;

    @NotNull
    @ApiModelProperty(value = "If the request has failed, how has it failed?", required = true)
    private FailTypes[] failedOn;

    public boolean isChangeSucceeded() {
        return changeSucceeded;
    }

    public FailTypes[] getFailedOn() {
        return failedOn;
    }

    enum FailTypes {
        REUSE,
        LENGTH,
        COMPLEXITY,
        BAD_OLD_PASSWORD
    }

    public static final class ChangePasswordResponseBuilder {
        private boolean changeSucceeded;
        List<FailTypes> failedOn = new ArrayList<>();

        private ChangePasswordResponseBuilder() {
        }

        public static ChangePasswordResponseBuilder aChangePasswordResponse() {
            return new ChangePasswordResponseBuilder();
        }

        public ChangePasswordResponseBuilder withSuccess() {
            this.changeSucceeded = true;
            return this;
        }

        public ChangePasswordResponseBuilder withFailedOn(FailTypes ...failedOn) {
            this.failedOn.addAll(Arrays.asList(failedOn));
            this.changeSucceeded = false;
            return this;
        }

        public ChangePasswordResponse build() {
            ChangePasswordResponse changePasswordResponse = new ChangePasswordResponse();
            changePasswordResponse.failedOn = this.failedOn.toArray(new FailTypes[this.failedOn.size()]);
            changePasswordResponse.changeSucceeded = this.changeSucceeded;
            return changePasswordResponse;
        }
    }
}
