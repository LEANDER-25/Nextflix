import { Controller, Get, Req, SetMetadata, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import RequestWithUser from "src/dtos/user/request-with-user";
import { JwtAuthGuard } from "src/middlewares/guards/auth/jwt-auth.guard";
import { RolesGuard } from "src/middlewares/guards/auth/role.guard";
import { Roles } from "src/services/auth/role.annotaion";
import { Role } from "src/services/auth/role.enum";
import { DriveAPIConfig } from "src/configurations/drive-api.config";

@Controller('demo')
export class DemoController {

    // constructor(private configService: ConfigService) {}

    @Get('get')
    // @UseGuards(JwtAuthGuard)
    async getHandler(@Req() req: RequestWithUser) {
        // const uri = this.configService.get('redirectUri');
        console.log(req.user);
        return {
            'message': `Hello from getHandler, goto`
        }
    }
    
    @Get('get2')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getHandler2(@Req() req: RequestWithUser) {
        // console.log(req.user);
        
        return {
            'message': 'Hello from demo getHandler 2'
        }
    }
}