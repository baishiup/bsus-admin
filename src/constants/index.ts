export enum API_STATUS {
  SUCCESS = 'success',
  ERROR = 'error'
}

export type API_RESPONSE = {
  message: string;
  status: API_STATUS;
  list?: Array<any>;
  map?: Record<string, any>;
};

export enum PublishState {
  PUBLISH = '1',
  DRAFT = '2'
}
