const localUrl = 'http://192.168.1.18:8000/api'
const prodUrl = 'http://ec2-52-13-30-170.us-west-2.compute.amazonaws.com:8000/api';

const { NODE_ENV } = process.env;
const __DEVELOPMENT__ = NODE_ENV === 'development';

console.log('__DEVELOPMENT__', NODE_ENV)
let useProd;
useProd = true; // comment this line for convenience
export const api = (__DEVELOPMENT__ && !useProd) ? localUrl : prodUrl;
