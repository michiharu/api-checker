import { Env } from '../../src/data-types/env';

declare module '*/setting/api.json' {
  const value: Env[];
  export default value;
}