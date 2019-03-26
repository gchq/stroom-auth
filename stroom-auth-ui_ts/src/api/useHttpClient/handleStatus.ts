import { HttpError } from "../../lib/ErrorTypes";

export default (response: Response) => {
  if (response.status === 200) {
    return Promise.resolve(response);
  }
  return Promise.reject(new HttpError(response.status, response.statusText));
};
