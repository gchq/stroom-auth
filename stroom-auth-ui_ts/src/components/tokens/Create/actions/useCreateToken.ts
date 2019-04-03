import useApi from "../../api/useApi";
import { useCallback } from 'react';
import useRouter from 'src/lib/useRouter';
import { Token } from '../../api';

const useCreateToken = () => {
  const { history } = useRouter();
  const { createToken } = useApi();
  return useCallback((email: string) => {
    createToken(email)
      .then((newToken: Token) => {
        // toggleIsCreation();
        history.push(`/token/${newToken.id}`);
      });
  }, [])
}

export default useCreateToken;