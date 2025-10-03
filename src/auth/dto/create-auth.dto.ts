import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
    @IsNotEmpty({ message: 'username không được để trống' })
    username: string;
    @IsNotEmpty({ message: 'pass không được để trống' })
    password: string;
}
