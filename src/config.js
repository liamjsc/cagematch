const localUrl = 'http://192.168.1.18:8000/api'
const prodUrl = 'http://ec2-18-236-88-40.us-west-2.compute.amazonaws.com:8000/api';

const { NODE_ENV } = process.env;
const __DEVELOPMENT__ = NODE_ENV === 'development';

let useProd;
// useProd = true; // comment this line for convenience
export const api = (__DEVELOPMENT__ && !useProd) ? localUrl : prodUrl;
