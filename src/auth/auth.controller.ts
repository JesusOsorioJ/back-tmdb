import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() user: any) {
    return this.authService.signUp(user);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log({ body });
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Invalid email or password' };
    }
    return this.authService.login(user);
  }
}
