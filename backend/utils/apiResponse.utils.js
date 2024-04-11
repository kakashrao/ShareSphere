export default class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statuCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
  }
}
