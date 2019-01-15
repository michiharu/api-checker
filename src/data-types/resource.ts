export interface Resource {
  name: string;
  version: string;
  params?: string[];
  exampleParams?: string[];
  methods: Method[];
}

export interface Method {
  name: string;
  url: string;
  exampleRequestBody?: string;
}

export type MethodName = 'GET' | 'POST' | 'PUT' | 'DELETE';