import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { Role } from "@prisma/client";
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        imageUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
