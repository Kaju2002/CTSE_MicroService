import {
    Body,
    Get,
    UseGuards,
    Request,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
  } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { User } from "@prisma/client";
import { CurrentUser } from "./decorators/current-user.decorator";


@Controller("auth")
@ApiTags("Auth")
@UsePipes(new ValidationPipe({transform:true}))
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiOperation({summary: "Register a new user"})
    @ApiResponse({status: 201, description: "User registered successfully"})
    @ApiResponse({status: 409, description: "User already exists"})
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post("login")
    @ApiOperation({summary: "Login a user"})
    @ApiResponse({status: 200, description: "User logged in successfully"})
    @ApiResponse({status: 401, description: "Invalid credentials"})
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: "Get current user"})
    @ApiResponse({status: 200, description: "Current user retrieved successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async getProfile(@CurrentUser() user: User) {
        return this.authService.getProfile(user)
    }
}