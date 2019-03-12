import { useContext } from "react";
import { RouterContext, HistoryContext } from "./BrowserRouter";

export default function useRouter() {
  const router = useContext(RouterContext);
  const history = useContext(HistoryContext);

  return {
    router,
    history
  };
}
