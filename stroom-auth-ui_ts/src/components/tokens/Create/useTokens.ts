import useToggleState from './actions/useToggleState';
import { useTokenState } from './useTokenState';
import useFetchToken from './actions/useFetchToken';
import useCreateToken from './actions/useCreateToken';

const useTokens = () => {
  const { token, setEnabled, setToken } = useTokenState();
  return {
    token,
    toggleEnabledState: useToggleState(setEnabled),
    createToken: useCreateToken(),
    fetchApiKey: useFetchToken(setToken),
  }
}

export default useTokens;
