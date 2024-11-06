export const SALESMATE_BASE_URL = 'https://fullscopemsp.salesmate.io/apis';

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const getSalesmateHeaders = (sessionToken?: string) => ({
  'Content-Type': 'application/json',
  'accessToken': sessionToken,
  'x-linkname': 'fullscopemsp.salesmate.io'
});
