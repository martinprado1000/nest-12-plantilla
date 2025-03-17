import { SetMetadata, applyDecorators } from '@nestjs/common';

export const AUDIT_METADATA_KEY = 'AUDIT_METADATA_KEY';

export function Audit() {
  return applyDecorators(SetMetadata(AUDIT_METADATA_KEY, true));
}