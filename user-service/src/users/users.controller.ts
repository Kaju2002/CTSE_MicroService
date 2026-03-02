import { Controller, Get, UseGuards, Put, Param, Patch, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Role, User } from "@prisma/client";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
@ApiTags("Users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Roles(Role.ADMIN)
    @ApiOperation({summary: "Get all users"})
    @ApiResponse({status: 200, description: "Users retrieved successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async getUsers() {
        return this.usersService.getAllUsers()
    }

    @Put("/deactivate/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Roles(Role.ADMIN)
    @ApiOperation({summary: "Deactivate user"})
    @ApiResponse({status: 200, description: "User deactivated successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async deactivateUser(@Param("id") id: string) {
        return this.usersService.deactivateUser(id)
    }

    @Put("/activate/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Roles(Role.ADMIN)
    @ApiOperation({summary: "Activate user"})
    @ApiResponse({status: 200, description: "User activated successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async activateUser(@Param("id") id: string) {
        return this.usersService.activateUser(id)
    }
    

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: "Get current user"})
    @ApiResponse({status: 200, description: "Current user retrieved successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async getProfile(@CurrentUser() user: any) {
        return this.usersService.getProfile(user)
    }

    @Patch("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: "Update current user"})
    @ApiResponse({status: 200, description: "Current user updated successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async updateProfile(@Body() data: UpdateUserDto, @CurrentUser() user: any) {
        return this.usersService.updateProfile(user, data)
    }
}