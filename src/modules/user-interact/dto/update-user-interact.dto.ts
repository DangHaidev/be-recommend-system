import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInteractDto } from './create-user-interact.dto';

export class UpdateUserInteractDto extends PartialType(CreateUserInteractDto) {}
