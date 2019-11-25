/*
 * Stroom Auth API
 * Various APIs for interacting with authentication, users, and tokens.
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


package stroom.auth.service.api.model;

import java.util.Objects;
import com.google.gson.annotations.SerializedName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * User
 */
@javax.annotation.Generated(value = "io.swagger.codegen.languages.JavaClientCodegen", date = "2019-11-22T11:58:22.499Z")
public class User {
  @SerializedName("id")
  private Integer id = null;

  @SerializedName("first_name")
  private String firstName = null;

  @SerializedName("last_name")
  private String lastName = null;

  @SerializedName("comments")
  private String comments = null;

  @SerializedName("email")
  private String email = null;

  @SerializedName("state")
  private String state = null;

  @SerializedName("password")
  private String password = null;

  @SerializedName("password_hash")
  private String passwordHash = null;

  @SerializedName("login_failures")
  private Integer loginFailures = null;

  @SerializedName("login_count")
  private Integer loginCount = null;

  @SerializedName("last_login")
  private String lastLogin = null;

  @SerializedName("updated_on")
  private String updatedOn = null;

  @SerializedName("updated_by_user")
  private String updatedByUser = null;

  @SerializedName("created_on")
  private String createdOn = null;

  @SerializedName("created_by_user")
  private String createdByUser = null;

  @SerializedName("never_expires")
  private Boolean neverExpires = null;

  @SerializedName("reactivatedDate")
  private String reactivatedDate = null;

  public User id(Integer id) {
    this.id = id;
    return this;
  }

   /**
   * Get id
   * @return id
  **/
  @ApiModelProperty(example = "null", value = "")
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public User firstName(String firstName) {
    this.firstName = firstName;
    return this;
  }

   /**
   * Get firstName
   * @return firstName
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public User lastName(String lastName) {
    this.lastName = lastName;
    return this;
  }

   /**
   * Get lastName
   * @return lastName
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public User comments(String comments) {
    this.comments = comments;
    return this;
  }

   /**
   * Get comments
   * @return comments
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getComments() {
    return comments;
  }

  public void setComments(String comments) {
    this.comments = comments;
  }

  public User email(String email) {
    this.email = email;
    return this;
  }

   /**
   * Get email
   * @return email
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public User state(String state) {
    this.state = state;
    return this;
  }

   /**
   * Get state
   * @return state
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public User password(String password) {
    this.password = password;
    return this;
  }

   /**
   * Get password
   * @return password
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public User passwordHash(String passwordHash) {
    this.passwordHash = passwordHash;
    return this;
  }

   /**
   * Get passwordHash
   * @return passwordHash
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public User loginFailures(Integer loginFailures) {
    this.loginFailures = loginFailures;
    return this;
  }

   /**
   * Get loginFailures
   * @return loginFailures
  **/
  @ApiModelProperty(example = "null", value = "")
  public Integer getLoginFailures() {
    return loginFailures;
  }

  public void setLoginFailures(Integer loginFailures) {
    this.loginFailures = loginFailures;
  }

  public User loginCount(Integer loginCount) {
    this.loginCount = loginCount;
    return this;
  }

   /**
   * Get loginCount
   * @return loginCount
  **/
  @ApiModelProperty(example = "null", value = "")
  public Integer getLoginCount() {
    return loginCount;
  }

  public void setLoginCount(Integer loginCount) {
    this.loginCount = loginCount;
  }

  public User lastLogin(String lastLogin) {
    this.lastLogin = lastLogin;
    return this;
  }

   /**
   * Get lastLogin
   * @return lastLogin
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(String lastLogin) {
    this.lastLogin = lastLogin;
  }

  public User updatedOn(String updatedOn) {
    this.updatedOn = updatedOn;
    return this;
  }

   /**
   * Get updatedOn
   * @return updatedOn
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getUpdatedOn() {
    return updatedOn;
  }

  public void setUpdatedOn(String updatedOn) {
    this.updatedOn = updatedOn;
  }

  public User updatedByUser(String updatedByUser) {
    this.updatedByUser = updatedByUser;
    return this;
  }

   /**
   * Get updatedByUser
   * @return updatedByUser
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getUpdatedByUser() {
    return updatedByUser;
  }

  public void setUpdatedByUser(String updatedByUser) {
    this.updatedByUser = updatedByUser;
  }

  public User createdOn(String createdOn) {
    this.createdOn = createdOn;
    return this;
  }

   /**
   * Get createdOn
   * @return createdOn
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getCreatedOn() {
    return createdOn;
  }

  public void setCreatedOn(String createdOn) {
    this.createdOn = createdOn;
  }

  public User createdByUser(String createdByUser) {
    this.createdByUser = createdByUser;
    return this;
  }

   /**
   * Get createdByUser
   * @return createdByUser
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getCreatedByUser() {
    return createdByUser;
  }

  public void setCreatedByUser(String createdByUser) {
    this.createdByUser = createdByUser;
  }

  public User neverExpires(Boolean neverExpires) {
    this.neverExpires = neverExpires;
    return this;
  }

   /**
   * Get neverExpires
   * @return neverExpires
  **/
  @ApiModelProperty(example = "null", value = "")
  public Boolean getNeverExpires() {
    return neverExpires;
  }

  public void setNeverExpires(Boolean neverExpires) {
    this.neverExpires = neverExpires;
  }

  public User reactivatedDate(String reactivatedDate) {
    this.reactivatedDate = reactivatedDate;
    return this;
  }

   /**
   * Get reactivatedDate
   * @return reactivatedDate
  **/
  @ApiModelProperty(example = "null", value = "")
  public String getReactivatedDate() {
    return reactivatedDate;
  }

  public void setReactivatedDate(String reactivatedDate) {
    this.reactivatedDate = reactivatedDate;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    User user = (User) o;
    return Objects.equals(this.id, user.id) &&
        Objects.equals(this.firstName, user.firstName) &&
        Objects.equals(this.lastName, user.lastName) &&
        Objects.equals(this.comments, user.comments) &&
        Objects.equals(this.email, user.email) &&
        Objects.equals(this.state, user.state) &&
        Objects.equals(this.password, user.password) &&
        Objects.equals(this.passwordHash, user.passwordHash) &&
        Objects.equals(this.loginFailures, user.loginFailures) &&
        Objects.equals(this.loginCount, user.loginCount) &&
        Objects.equals(this.lastLogin, user.lastLogin) &&
        Objects.equals(this.updatedOn, user.updatedOn) &&
        Objects.equals(this.updatedByUser, user.updatedByUser) &&
        Objects.equals(this.createdOn, user.createdOn) &&
        Objects.equals(this.createdByUser, user.createdByUser) &&
        Objects.equals(this.neverExpires, user.neverExpires) &&
        Objects.equals(this.reactivatedDate, user.reactivatedDate);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, firstName, lastName, comments, email, state, password, passwordHash, loginFailures, loginCount, lastLogin, updatedOn, updatedByUser, createdOn, createdByUser, neverExpires, reactivatedDate);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class User {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    firstName: ").append(toIndentedString(firstName)).append("\n");
    sb.append("    lastName: ").append(toIndentedString(lastName)).append("\n");
    sb.append("    comments: ").append(toIndentedString(comments)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    state: ").append(toIndentedString(state)).append("\n");
    sb.append("    password: ").append(toIndentedString(password)).append("\n");
    sb.append("    passwordHash: ").append(toIndentedString(passwordHash)).append("\n");
    sb.append("    loginFailures: ").append(toIndentedString(loginFailures)).append("\n");
    sb.append("    loginCount: ").append(toIndentedString(loginCount)).append("\n");
    sb.append("    lastLogin: ").append(toIndentedString(lastLogin)).append("\n");
    sb.append("    updatedOn: ").append(toIndentedString(updatedOn)).append("\n");
    sb.append("    updatedByUser: ").append(toIndentedString(updatedByUser)).append("\n");
    sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
    sb.append("    createdByUser: ").append(toIndentedString(createdByUser)).append("\n");
    sb.append("    neverExpires: ").append(toIndentedString(neverExpires)).append("\n");
    sb.append("    reactivatedDate: ").append(toIndentedString(reactivatedDate)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
  
}

