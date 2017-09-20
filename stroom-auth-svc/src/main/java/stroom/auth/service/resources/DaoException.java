package stroom.auth.service.resources;

public class DaoException extends Exception {
  private int equivalentHttpReturnCode;

  public DaoException(String message, int equivalentHttpReturnCode){
    super(message);
    this.equivalentHttpReturnCode = equivalentHttpReturnCode;
  }

  public int getEquivalentHttpReturnCode() {
    return equivalentHttpReturnCode;
  }

  public static DaoException newBadRequest(String message){
    return new DaoException(message, 400);
  }

  public static DaoException newUnprocessableEntity(String message){
    return new DaoException(message, 422);
  }

}
