import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class UserSignUpDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Username cannot be empty' })
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Phone cannot be empty' })
    @IsPhoneNumber('VN', { message: 'Invalid phone number' })
    phone: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address cannot be empty' })
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Birthdate cannot be empty' })
    @IsDateString()
    birthdate: string;
}
