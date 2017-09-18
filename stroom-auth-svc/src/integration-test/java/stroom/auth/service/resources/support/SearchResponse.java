package stroom.auth.service.resources.support;

import stroom.auth.service.resources.token.v1.Token;

import java.util.List;

public class SearchResponse {
  private List<Token> results;
  private int totalPages;

  public List<Token> getResults() {
    return results;
  }

  public void setResults(List<Token> results) {
    this.results = results;
  }

  public int getTotalPages() {
    return totalPages;
  }

  public void setTotalPages(int totalPages) {
    this.totalPages = totalPages;
  }
}
