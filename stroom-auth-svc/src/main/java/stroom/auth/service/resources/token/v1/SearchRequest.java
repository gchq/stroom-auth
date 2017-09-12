package stroom.auth.service.resources.token.v1;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Map;

public class SearchRequest {
  @NotNull private int page;
  @NotNull private int limit;

  @Nullable
  @Pattern(
      regexp = "^enabled$|^user_email$|^issued_by_user$|^token$|^token_type$|^updated_by_user$|^expires_on$|^issued_on$|^updated_on$",
      message = "orderBy must be one of: 'enabled', 'user_email', 'issued_by_user', 'token', 'token_type', 'updated_by_user', 'expires_on', 'issued_on', 'updated_on'")
  private String orderBy;

  @Nullable
  @Pattern(regexp = "^asc$|^desc$", message = "orderDirection must be 'asc' or 'desc'")
  private String orderDirection;

  private Map<String, String> filters;

  public int getPage() {
    return page;
  }

  public int getLimit() {
    return limit;
  }

  public String getOrderBy() {
    return orderBy;
  }

  public String getOrderDirection() {
    return orderDirection;
  }

  public Map<String, String> getFilters() {
    return filters;
  }

  public static final class SearchRequestBuilder {
    private int page;
    private int limit;
    private String orderBy;
    private String orderDirection;
    private Map<String, String> filters;

    public SearchRequestBuilder() {
    }

    public SearchRequestBuilder page(int page) {
      this.page = page;
      return this;
    }

    public SearchRequestBuilder limit(int limit) {
      this.limit = limit;
      return this;
    }

    public SearchRequestBuilder orderBy(String orderBy) {
      this.orderBy = orderBy;
      return this;
    }

    public SearchRequestBuilder orderDirection(String orderDirection) {
      this.orderDirection = orderDirection;
      return this;
    }

    public SearchRequestBuilder filters(Map<String, String> filters) {
      this.filters = filters;
      return this;
    }

    public SearchRequest build() {
      SearchRequest searchRequest = new SearchRequest();
      searchRequest.orderBy = this.orderBy;
      searchRequest.limit = this.limit;
      searchRequest.orderDirection = this.orderDirection;
      searchRequest.filters = this.filters;
      searchRequest.page = this.page;
      return searchRequest;
    }
  }
}
