package stroom.auth.service.resources.token.v1;

import java.util.List;

public class SearchResponse {
  private List<Token> tokens;
  private int totalPages;

  public int getTotalPages() {
    return totalPages;
  }

  public void setTotalPages(int totalPages) {
    this.totalPages = totalPages;
  }

  public List<Token> getTokens() {
    return tokens;
  }

  public void setTokens(List<Token> tokens) {
    this.tokens = tokens;
  }
}
