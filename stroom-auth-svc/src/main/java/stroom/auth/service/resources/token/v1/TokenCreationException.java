package stroom.auth.service.resources.token.v1;

public class TokenCreationException extends Exception {
  private Token.TokenType tokenType;
  private String errorMessage;

  public TokenCreationException(Exception e){
    super(e);
  }

  public TokenCreationException(String errorMessage){
    this.errorMessage = errorMessage;
  }

  public TokenCreationException(Token.TokenType tokenType, String errorMessage){
    this.tokenType = tokenType;
    this.errorMessage = errorMessage;
  }
}
