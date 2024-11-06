export const SALESMATE_BASE_URL = 'https://fullscope.salesmate.io/apis';

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const getSalesmateHeaders = (accessKey?: string, secretKey?: string) => ({
  accesskey: accessKey,
  secretkey: secretKey,
  'Content-Type': 'application/json'
});