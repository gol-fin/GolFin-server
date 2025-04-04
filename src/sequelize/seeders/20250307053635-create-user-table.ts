import { QueryInterface, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
import { Role } from '../../auth/enums/roles.enum';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

dotenv.config();

export = {
    async up(queryInterface: QueryInterface) {
        const saltRounds = process.env.SALT_ROUNDS
            ? parseInt(process.env.SALT_ROUNDS)
            : 10;

        const managerPassword = await bcrypt.hash(
            process.env.MANAGER_PASSWORD,
            saltRounds,
        );
        const employeePassword = await bcrypt.hash('user01', saltRounds);
        const guestPassword = await bcrypt.hash('user02', saltRounds);

        const managerEmail = process.env.MANAGER_EMAIL;
        const employeeEmail = 'user01@example.com';
        const guestEmail = 'user02@example.com';

        // Check if the manager already exists
        const [existingUser] = await queryInterface.sequelize.query(
            `SELECT id FROM accounts WHERE email IN (:emails) LIMIT 1`,
            {
                replacements: {
                    emails: [managerEmail, employeeEmail, guestEmail],
                },
                type: QueryTypes.SELECT,
            },
            // Add more user objects as needed
        );

        if (!existingUser) {
            await queryInterface.bulkInsert('accounts', [
                {
                    id: crypto.randomUUID(),
                    username: process.env.MANAGER_USERNAME || 'manager01',
                    email: managerEmail,
                    password: managerPassword,
                    phone: '1234567890',
                    birthdate: new Date('1990-01-01'),
                    role: Role.ADMIN,
                    balance: 2000000,
                    profileImage: process.env.DEFAULT_PROFILE_IMAGE,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: crypto.randomUUID(),
                    username: 'user01',
                    email: employeeEmail,
                    password: employeePassword,
                    phone: '0987654321',
                    birthdate: new Date('1995-05-15'),
                    role: Role.USER,
                    balance: 1000000,
                    profileImage: process.env.DEFAULT_PROFILE_IMAGE,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: crypto.randomUUID(),
                    username: 'user02',
                    email: guestEmail,
                    password: guestPassword,
                    phone: '0123456789',
                    birthdate: new Date('2000-09-20'),
                    role: Role.USER,
                    balance: 0,
                    profileImage: process.env.DEFAULT_PROFILE_IMAGE,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);
        }
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.bulkDelete('accounts', null, {});
    },
};
