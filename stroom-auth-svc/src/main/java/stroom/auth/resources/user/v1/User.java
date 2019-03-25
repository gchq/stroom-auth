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

package stroom.auth.resources.user.v1;

import com.google.common.base.Strings;
import org.apache.commons.lang3.tuple.Pair;
import org.mindrot.jbcrypt.BCrypt;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;

/**
 * This POJO binds to the response from the database, and to the JSON.
 * <p>
 * The names are database-style to reduce mapping code. This looks weird in Java but it's sensible for the database
 * and it's sensible for the json.
 */
public final class User {
    @Nullable
    private Integer id;
    @Nullable
    private String first_name;
    @Nullable
    private String last_name;
    @Nullable
    private String comments;
    @Nullable
    private String email;
    @Nullable
    private String state;
    @Nullable
    private String password;
    @Nullable
    private String password_hash;
    @Nullable
    private Integer login_failures;
    @Nullable
    private Integer login_count;
    @Nullable
    private String last_login;
    @Nullable
    private String updated_on;
    @Nullable
    private String updated_by_user;
    @Nullable
    private String created_on;
    @Nullable
    private String created_by_user;
    @Nullable
    private boolean never_expires;
    @Nullable
    private String reactivatedDate;

    public User() {
    }

    public User(@NotNull String email, @NotNull String password) {
        this.email = email;
        this.password = password;
    }

    @Nullable
    public final Integer getId() {
        return this.id;
    }

    public final void setId(@Nullable Integer id) {
        this.id = id;
    }

    @Nullable
    public final String getFirst_name() {
        return this.first_name;
    }

    public final void setFirst_name(@Nullable String firstName) {
        this.first_name = firstName;
    }

    @Nullable
    public final String getLast_name() {
        return this.last_name;
    }

    public final void setLast_name(@Nullable String lastName) {
        this.last_name = lastName;
    }

    @Nullable
    public final String getComments() {
        return this.comments;
    }

    public final void setComments(@Nullable String comments) {
        this.comments = comments;
    }

    @Nullable
    public final String getEmail() {
        return this.email;
    }

    public final void setEmail(@Nullable String email) {
        this.email = email;
    }

    @Nullable
    public final String getState() {
        return this.state;
    }

    public final void setState(@Nullable String state) {
        this.state = state;
    }

    @Nullable
    public final String getPassword() {
        return this.password;
    }

    public final void setPassword(@Nullable String password) {
        this.password = password;
    }

    @Nullable
    public final String getPassword_hash() {
        return this.password_hash;
    }

    public final void setPassword_hash(@Nullable String passwordHash) {
        this.password_hash = passwordHash;
    }

    @Nullable
    public final Integer getLogin_failures() {
        return this.login_failures;
    }

    public final void setLogin_failures(@Nullable Integer loginFailures) {
        this.login_failures = loginFailures;
    }

    @Nullable
    public final Integer getLogin_count() {
        return this.login_count;
    }

    public final void setLogin_count(@Nullable Integer loginCount) {
        this.login_count = loginCount;
    }

    @Nullable
    public final String getLast_login() {
        return this.last_login;
    }

    public final void setLast_login(@Nullable String lastLogin) {
        this.last_login = lastLogin;
    }

    @Nullable
    public final String getUpdated_on() {
        return this.updated_on;
    }

    public final void setUpdated_on(@Nullable String updatedOn) {
        this.updated_on = updatedOn;
    }

    @Nullable
    public final String getUpdated_by_user() {
        return this.updated_by_user;
    }

    public final void setUpdated_by_user(@Nullable String updatedByUser) {
        this.updated_by_user = updatedByUser;
    }

    @Nullable
    public final String getCreated_on() {
        return this.created_on;
    }

    public final void setCreated_on(@Nullable String createdOn) {
        this.created_on = createdOn;
    }

    @Nullable
    public final String getCreated_by_user() {
        return this.created_by_user;
    }

    public final void setCreated_by_user(@Nullable String createdByUser) {
        this.created_by_user = createdByUser;
    }

    @Nullable
    public boolean getNever_expires() {
        return never_expires;
    }

    public void setNever_expires(@Nullable boolean never_expires) {
        this.never_expires = never_expires;
    }

    public void setReactivatedDate(String reactivatedDate) {
        this.reactivatedDate = reactivatedDate;
    }

    public String getReactivatedDate() {
        return this.reactivatedDate;
    }

    /**
     * This is not the same as getPasswordHash(). That's a getting for the model property,
     * but this method actually creates a new hash.
     */
    public String generatePasswordHash() {
        return BCrypt.hashpw(this.password, BCrypt.gensalt());
    }

    public static Pair<Boolean, String> isValidForCreate(User user) {
        ArrayList<UserValidationError> validationErrors = new ArrayList<>();

        if (user == null) {
            validationErrors.add(UserValidationError.NO_USER);
        } else {
            if (Strings.isNullOrEmpty(user.getEmail())) {
                validationErrors.add(UserValidationError.NO_NAME);
            }

            if (Strings.isNullOrEmpty(user.getPassword())) {
                validationErrors.add(UserValidationError.NO_PASSWORD);
            }
        }

        String validationMessages = validationErrors.stream()
                .map(UserValidationError::getMessage)
                .reduce((validationMessage1, validationMessage2) -> validationMessage1 + validationMessage2).orElse("");
        boolean isValid = validationErrors.size() == 0;
        return Pair.of(isValid, validationMessages);
    }


    public enum UserState {
        ENABLED("enabled"),
        INACTIVE("inactive"),
        DISABLED("disabled"),
        LOCKED("locked");

        private String stateText;

        UserState(String stateText) {
            this.stateText = stateText;
        }

        public String getStateText() {
            return this.stateText;
        }
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", first_name='" + first_name + '\'' +
                ", last_name='" + last_name + '\'' +
                ", comments='" + comments + '\'' +
                ", email='" + email + '\'' +
                ", state='" + state + '\'' +
                ", password='" + password + '\'' +
                ", password_hash='" + password_hash + '\'' +
                ", login_failures=" + login_failures +
                ", login_count=" + login_count +
                ", last_login='" + last_login + '\'' +
                ", updated_on='" + updated_on + '\'' +
                ", updated_by_user='" + updated_by_user + '\'' +
                ", created_on='" + created_on + '\'' +
                ", created_by_user='" + created_by_user + '\'' +
                ", never_expire='" + never_expires + '\'' +
                ", reactivated_date='" + reactivatedDate + '\'' +
                '}';
    }
}
