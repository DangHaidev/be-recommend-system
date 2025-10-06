import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
    @IsNotEmpty({ message: 'email không được để trống' })
    email: string;
    @IsNotEmpty({ message: 'pass không được để trống' })
    password: string;
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;
}
