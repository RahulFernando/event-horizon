/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

const checkTokenValidity = (token: string) => {
  const decodedToken: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp > currentTime;
};

export default checkTokenValidity;
