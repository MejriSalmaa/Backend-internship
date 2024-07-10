/* eslint-disable prettier/prettier */
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../constants/constants';

export function verifyTokenExpiry(token: string): boolean {
  try {
    const decodedToken = jwt.verify(token, jwtConstants.secret);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (typeof decodedToken !== 'string' && decodedToken.exp < currentTime) {
        // Token has expired
      return false;
    }

    // Token is still valid
    return true;
  } catch (error) {
    // Token verification failed (invalid token)
    return false;
  }
}
