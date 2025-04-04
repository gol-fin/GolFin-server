import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.model';
import { UpdateProfileDto } from './dtos/update-user.dto';
import type { Multer } from 'multer';
import { UploadService } from '../uploader/upload.service';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly uploadService: UploadService,
    ) {}

    async updateProfile(
        id: string,
        updateProfileDto: Partial<UpdateProfileDto>,
    ): Promise<User> {
        return this.usersRepository.updateProfile(id, updateProfileDto);
    }

    async getMyProfile(profileUser: User): Promise<{
        email: string;
        username: string;
        id: string;
        role: string;
        phoneNumber: string;
        image: string;
        balance: number;
        birthdate: string;
    }> {
        try {
            const { id } = profileUser;
            const user = await this.usersRepository.findOneById(id);

            if (!user) {
                throw new BadRequestException('User not found');
            }

            const newUser = {
                email: user.email,
                username: user.username,
                id: user.id,
                role: user.role,
                phoneNumber: user.phone,
                image: user.profileImage,
                balance: user.balance,
                birthdate: user.birthdate,
            };
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error getting profile',
                error.message,
            );
        }
    }

    async updateProfileImage(
        userId: string,
        file: Multer.File,
    ): Promise<{ message: string; user: Partial<User> }> {
        const imageUrl = await this.uploadService.uploadFile(file, 'users');
        await this.usersRepository.updateProfileImage(userId, imageUrl);
        const user = await this.usersRepository.findOneById(userId);
        const newUser = {
            id: user.id,
            username: user.username,
            profileImage: user.profileImage,
        };
        return {
            message: 'Profile image uploaded successfully',
            user: newUser,
        };
    }
}
