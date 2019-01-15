import { Resource, MethodName } from '../data-types/resource';
import resources from '../settings/api.json';
import env from '../settings/env.json';

export default class Api {

  getExampleUrl(resourceName: string, method: string): string {
    const resource: Resource = resources.find(n => n.name === resourceName)!;
    const r =
    resourceName === 'login' ? 'login' : 'coordinate';
    const m =
    method === 'GET' ? 'GET' :
    method === 'POST' ? 'POST' :
    method === 'PUT' ? 'PUT' : 'DELETE';
      
    return this.getUrl(r, m, resource.exampleParams);
  }

  getUrl(resourceName: ResourceName, methodName: MethodName, params?: string[]): string {
    const resource: Resource = resources.find(n => n.name === resourceName)!;
    var methodUrl = resource.methods.filter(n => n.name === methodName)[0].url;
    if (resource.params && params) {
      for (var i = 0; i < resource.params.length; i++) {
        methodUrl = methodUrl.replace(new RegExp(resource.params[i]), params[i]);
      }
    }

    return env.baseURL + resource.version + methodUrl;
  }

  send = (method: MethodName, url: string, data?: any): Promise<Response> => {
    const init: Init = {
      method,
      headers: new Headers({ 'Accept': 'application/json', 'Content-type': 'application/json' }),
      body: data ? JSON.stringify(data) : undefined
    };
    return fetch(url, init);
  }
}

type ResourceName =
  'login' |
  'coordinate';

interface Init {
  method: string;
  headers: Headers;
  body?: string;
}