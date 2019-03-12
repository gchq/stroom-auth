// import { useContext, useCallback } from "react";
// import { StoreContext } from "redux-react-hook";
// import { useActionCreators } from "./redux";
// import useHttpClient from "../useHttpClient";

// import {handleErrors, getBody, getJsonBody} from './fetchFunctions';

// import {push} from 'react-router-redux';

// import {HttpError} from '../../ErrorTypes';

// export default (editedUser) => {
//     const store = useContext(StoreContext);

//     const { httpPutJsonResponse } = useHttpClient();
//     const { toggleIsSaving , saveUserBeingEdited, toggleAlertVisibility} = useActionCreators();
//     const saveChanges = useCallback(
//         (editedUser) => {
//             toggleIsSaving(true);
//             const jwsToken = store.authentication.idToken;
//             const {
//               id,
//               email,
//               password,
//               first_name,
//               last_name,
//               comments,
//               state,
//               never_expires,
//               force_password_change,
//             } = editedUser;

//             const url = `${store.config.userServiceUrl}/${id}`;
//             httpPutJsonResponse(url, {
//                 body: JSON.stringify({
//                     email,
//                     password,
//                     first_name,
//                     last_name,
//                     comments,
//                     state,
//                     never_expires,
//                     force_password_change,
//                 })
//             }).then(handleStatus).then(response => {
//                 saveUserBeingEdited(undefined);
//                 push('/userSearch');
//                 toggleAlertVisibility(true, 'User has been updated');
//                 toggleIsSaving(false);
//             })
//             .catch(error => {
//                 toggleIsSaving(false);
//                 handleErrors(error, jwsToken); //FIXME: needs dispatch, needs updating
//             })

//         }, [toggleIsSaving, saveUserBeingEdited, push, toggleAlertVisibility, toggleIsSaving]
//     );
//     }