export default class ApiResponse {
  constructor(statuCode, data, message = "Success") {
    this.statuCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
  }
}
