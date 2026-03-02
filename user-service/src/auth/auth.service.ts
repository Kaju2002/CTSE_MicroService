import * as bcrypt from "bcrypt"
import { PrismaService } from "../prisma/prisma.service"
import { RegisterDto } from "./dto/register.dto"
import { BadRequestException, Injectable } from "@nestjs/common"
import { Role, User } from "@prisma/client"
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    // register a new user
    async register(data: RegisterDto) {

        //check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (existingUser) {
            throw new BadRequestException("User already exists")
        }

        //hash password
        const hashedPassword = await bcrypt.hash(data.password, 10)

        //create user
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: Role.USER,
                isActive: true
            }
        })
        const token = this.issueToken(user)
        return {
            user: this.sanitizeUser(user),
            accessToken: token
        }
    }

    // login a user
    async login(data: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!user) {
            throw new BadRequestException("Invalid credentials")
        }

        const isMatch = await bcrypt.compare(data.password, user.password)

        if (!isMatch) {
            throw new BadRequestException("Invalid credentials")
        }
        const token = this.issueToken(user)
        return {
            user: this.sanitizeUser(user),
            accessToken: token
        }
    }

    // validate user by id
    async validateUserById(userId: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        return user ?? null
    }

    // issue token to user
    private issueToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }
        return this.jwtService.sign(payload)
    }

    // remove password from user object
    private sanitizeUser(user: User) {
        const { password, ...rest } = user
        return rest
    }
}