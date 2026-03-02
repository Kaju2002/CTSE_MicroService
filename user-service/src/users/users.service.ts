import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Role, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { sanitizeUser } from "./user.utils";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllUsers() {
        return this.prisma.user.findMany()
    }

    async deactivateUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        if (!user.isActive) {
            throw new BadRequestException("User is already deactivated")
        }
        if (user.role === Role.ADMIN) {
            throw new BadRequestException("Admin cannot be deactivated")
        }
        await this.prisma.user.update({
            where: { id },
            data: { isActive: false }
        })
        return { message: "User deactivated successfully" }

    }

    async activateUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        if (user.isActive) {
            throw new BadRequestException("User is already activated")
        }
        if (user.role === Role.ADMIN) {
            throw new BadRequestException("Admin cannot be activated")
        }
        await this.prisma.user.update({
            where: { id },
            data: { isActive: true }
        })
        return { message: "User activated successfully" }
    }

    async getProfile(user: User) {
        return sanitizeUser(user)
    }

    async updateProfile(user: User, data: UpdateUserDto) {

        const existingUser = await this.prisma.user.findUnique({
            where: { id: user.id }
        })
        if (!existingUser) {
            throw new NotFoundException("User not found")
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: data
        })
        return { message: "User updated successfully", user: sanitizeUser(updatedUser) }
    }

    // private sanitizeUser(user: User) {
    //     const { password, ...rest } = user
    //     return rest
    // }
}