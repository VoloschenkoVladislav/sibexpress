export interface IResponse<D, E> {
  data: D | null,
  error_message: string | null,
  errors: E | null,
}
