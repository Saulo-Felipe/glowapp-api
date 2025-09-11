export interface DefaultControllerResponse<T = any> {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  message?: string;
  data?: T;
}
