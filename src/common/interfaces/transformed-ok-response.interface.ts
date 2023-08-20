export interface TransformedOkResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}
