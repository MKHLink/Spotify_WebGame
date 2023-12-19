import { toPairs } from 'lodash';
import 'whatwg-fetch';

const SPOTIFY_ROOT = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_CLIENT_ID = 'ff517e55aeba40c3bef9f659974dd54e';
const SPOTIFY_CLIENT_SECRET = '4d3ecb8332f14e39b0755b9ed3d57924';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
const parseJSON = (response: any) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

const checkStatus = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error: any = new Error(response.statusText);
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export const request = (url: any, options?: any) => {
  // eslint-disable-next-line no-undef
  return fetch(url, options).then(checkStatus).then(parseJSON);
};

const headers = new Headers({
  Authorization: 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
  'Content-Type': 'application/x-www-form-urlencoded',
});

const body = new URLSearchParams();
body.set('grant_type', 'client_credentials');

const json = true;

export const fetchToken = async () => {
  return request(SPOTIFY_AUTH_URL, {
    method: 'POST',
    headers,
    body,
    json,
  }).then((response: any) => {
    return { access_token: response.access_token, expires_in: response.expires_in };
  });
};

const fetchFromSpotify = async ({ token, endpoint, params }: any) => {
  let url = [SPOTIFY_ROOT, endpoint].join('/');
  if (params) {
    const paramString = toPairs(params)
      .map((param: any) => param.join('='))
      .join('&');
    url += `?${paramString}`;
  }
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return request(url, options);
};

export const searchSpotifyByGenre = (token: string, genre: string) => {
  return fetchFromSpotify({
    token,
    endpoint: 'search',
    params: {
      q: `genre:"${genre}"`,
      type: 'artist',
      limit: 50,
    },
  });
};

export const searchSpotifyByArtist = (token: string, artist: string) => {
  return fetchFromSpotify({
    token,
    endpoint: 'search',
    params: {
      q: `artist:"${artist}"`,
      type: 'track',
      limit: 50,
    },
  });
};
