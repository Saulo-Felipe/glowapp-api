import { HttpException, HttpStatus } from '@nestjs/common';

export class WarningExeption extends HttpException {
  constructor(message: string, status?: HttpStatus) {
    super(
      {
        warning: true,
        message,
        status,
      },
      status || HttpStatus.OK,
    );
  }
}
