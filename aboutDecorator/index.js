import property from 'lodash/property';

const getUrl = property('url');
const hasTarget = (args)=>getUrl(args) === 'a';
const win = window || {};
const microSvrBaseUrl = 'micro-url';


function setBaseDomain (target, name, descriptor){

  const originFunc = descriptor.value;
  descriptor.value = function () {

    const { baseUrl } = win;

    const needSetParam = hasTarget(arguments);
    if(needSetParam) win.baseUrl = microSvrBaseUrl;

    try
    {
      return originFunc.apply(this, arguments);
    }
    finally
    {
      if(needSetParam) win.baseUrl = baseUrl;
    }
  };
  return descriptor;
}

class CommonClass {
  constructor(){
    console.log('constructed');
    win.baseUrl = 'http://base-url';
    this.id = "hello ";
  }
  
  @setBaseDomain
  getAPIUrl ({url = 'a'}){
    const fullUrl = win.baseUrl + '/' + url;
    return fullUrl;
  }
}

(()=>{

  const obj = new CommonClass();

  console.log('win.baseUrl begin', win.baseUrl);
  const url = obj.getAPIUrl();
  console.log('url', url);
  console.log('win.baseUrl end', win.baseUrl);
})();

