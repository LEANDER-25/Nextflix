import { Controller, Get, Req, SetMetadata, UseGuards } from "@nestjs/common";
import RequestWithUser from "src/dtos/user/request-with-user";
import { JwtAuthGuard } from "src/middlewares/guards/auth/jwt-auth.guard";
import { RolesGuard } from "src/middlewares/guards/auth/role.guard";
import { Roles } from "src/services/auth/role.annotaion";

@Controller('demo')
export class DemoController {
    @Get('get')
    @UseGuards(JwtAuthGuard)
    async getHandler(@Req() req: RequestWithUser) {
        console.log(req.user);
        return {
            'message': 'Hello from getHandler'
        }
    }
    
    @Get('get2')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(true)
    async getHandler2(@Req() req: RequestWithUser) {
        console.log(req.user);
        
        return {
            'message': 'Hello from demo getHandler 2'
        }
    }
}