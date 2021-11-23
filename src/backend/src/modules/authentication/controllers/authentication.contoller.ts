import {
  Body, Controller, Post
} from '@nestjs/common';
import {
  ApiOperation, ApiResponse, ApiTags
} from '@nestjs/swagger';

import {AuthenticationDto} from "../dto/authentication.dto";
import {AuthenticationService} from "../services/authentication.service";
import {TokenType} from "../types";

@ApiTags('Authentication')
@ApiResponse({status: 200, description: 'Успешное получение'})
@ApiResponse({status: 400, description: 'Ошибка обработки запроса'})
@ApiResponse({status: 401, description: 'Ошибка аутентификации'})
@ApiResponse({status: 500, description: 'Ошибка сервера'})
@Controller()
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {
  }

  @Post('auth/login')
  @ApiOperation({summary: 'Аутентификация пользователя'})
  async login(@Body() req: AuthenticationDto): Promise<TokenType> {
    return this.authenticationService.login(req);
  }
}
