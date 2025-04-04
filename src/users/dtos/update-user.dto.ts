import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsPhoneNumber('VN')
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    image: string;

    @ApiProperty()
    @IsDateString()
    birthdate: string;
}
