import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Request,
    Res,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Put,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import {
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiQuery,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfileDto } from '../auth/dtos/cred.dto';
import { CreateEmployeeDto } from './dtos/create-user.dto';
import { UpdateEmployeeDto, UpdateProfileDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({
        summary: 'Get profile with credentials [GUEST, EMPLOYEE, MANAGER]',
    })
    @ApiBearerAuth('access-token')
    @Get('user')
    @ApiResponse({
        status: 200,
        description: 'Get profile successfully',
        type: ProfileDto,
    })
    @UseGuards(ATAuthGuard)
    async getMyProfile(@Request() req: any, @Res() res: Response) {
        const foundUser: {
            email: string;
            username: string;
            id: string;
            role: string;
            phoneNumber: string;
            image: string;
            balance: number;
            birthdate: string;
        } = await this.usersService.getMyProfile(req.user);
        res.send(foundUser);
    }

    @ApiOperation({ summary: 'Update profile [USER]' })
    @ApiBearerAuth('access-token')
    @Patch('user')
    @ApiResponse({
        status: 200,
        description: 'Update profile successfully',
        type: UpdateProfileDto,
    })
    @UseGuards(ATAuthGuard)
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }

    @ApiOperation({ summary: 'Upload profile image [USER]' })
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary' },
            },
            required: ['image'],
        },
    })
    @Put('user/image')
    @UseGuards(ATAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadProfileImage(
        @Request() req: any,
        @UploadedFile() file: Multer.File,
    ) {
        return this.usersService.updateProfileImage(req.user.id, file);
    }
}
