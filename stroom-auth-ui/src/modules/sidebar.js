export const goToStroom = (token) => {
  return dispatch => {
    var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
    window.location.href = loginUrl
  }
}