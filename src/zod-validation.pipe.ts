import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import z, { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(clientData: unknown) {
    if (!clientData) {
      throw new BadRequestException({
        errors: ['Dados de login não enviados'],
      });
    }

    const result = this.schema.safeParse(clientData);
    if (!result.success) {
      throw new BadRequestException(
        Object.values(z.flattenError(result.error).fieldErrors).flat(),
      );
    }
    return result.data;
  }
}
