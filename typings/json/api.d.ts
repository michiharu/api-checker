import { Resource } from '../../src/data-types/resource';

declare module '*/setting/api.json' {
  const value: Resource[];
  export default value;
}