import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorExeption extends HttpException {
  constructor(message: string, status?: HttpStatus) {
    super(
      {
        error: true,
        message,
        status,
      },
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
