import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
    @IsNotEmpty({ message: 'email không được để trống' })
    email: string;
    @IsNotEmpty({ message: 'pass không được để trống' })
    password: string;
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;
}
export class CodeAuthDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    id: number;
    @IsNotEmpty({ message: 'code không được để trống' })
    code: string;
}
