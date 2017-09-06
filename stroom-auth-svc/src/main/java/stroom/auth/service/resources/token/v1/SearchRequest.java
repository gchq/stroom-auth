package stroom.auth.service.resources.token.v1;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

public class SearchRequest {
  @NotNull private int page;
  @NotNull private int limit;
  private String orderBy;
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
