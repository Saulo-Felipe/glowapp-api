import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(clientData: unknown) {
    if (!clientData) {
      throw new BadRequestException({
        message: 'Dados de login não enviados',
        error: true,
      });
    }

    const result = this.schema.safeParse(clientData);
    if (!result.success) {
      throw new BadRequestException({
        message: result.error.message,
        error: true,
      });
    }
    return result.data;
  }
}
