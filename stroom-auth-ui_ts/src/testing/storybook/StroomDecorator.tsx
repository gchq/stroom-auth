import * as React from "react";
import { pipe } from "ramda";
import { RenderFunction } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as ReactModal from "react-modal";

import { useTestServer } from "./PollyDecorator";

// import testData from "../data";
import { withRouter, RouteComponentProps } from "react-router";
import { CustomRouter } from "src/lib/useRouter";
import { ConfigProvider } from "src/startup/config";
import { AuthorisationContextProvider } from "src/startup/Authorisation";
import { ErrorReportingContextProvider } from 'src/components/ErrorPage';

const B: React.FunctionComponent = ({ children }) => {
  // useFontAwesome();
  // useTestServer(testData);

  return <div>{children}</div>;
};

// const RouteWrapper: React.StatelessComponent<RouteComponentProps> = ({
//   children,
//   history,
// }) => {
//   return (
//     <CustomRouter history={history}>
//       <B>{children}</B>
//     </CustomRouter>
//   );
// };
// const DragDropRouted = pipe(
//   DragDropContext(HTML5Backend),
//   withRouter,
// )(RouteWrapper);

// ReactModal.setAppElement("#root");

// export default (storyFn: RenderFunction) =>
//   StoryRouter()(() => (
//     <ErrorReportingContextProvider>
//       <ConfigProvider>
//         <AuthenticationContext.Provider
//           value={{
//             idToken: "PollyWannaCracker",
//             setIdToken: () => {
//               console.error(
//                 "Setting the idToken in storybook? This is most unexpected!",
//               );
//             },
//           }}
//         >
//           <AuthorisationContextProvider>
//                   {storyFn()}
//           </AuthorisationContextProvider>
//         </AuthenticationContext.Provider>
//       </ConfigProvider>
//     </ErrorReportingContextProvider>
//   ));
