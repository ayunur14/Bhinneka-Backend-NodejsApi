import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const user_data = await this.usersService.findUser(user.email);
    if (!user_data) {
      throw new HttpException(
        {
          status: HttpStatus.OK,
          message: 'Email atau password salah',
          data: [],
          error: 'Email atau password salah',
        },
        HttpStatus.OK,
      );
    }
    if (await bcrypt.compare(user.password, user_data.password)) {
      const payload = { email: user_data.email, sub: user_data.id };
      return {
        statusCode: HttpStatus.OK,
        message: 'Login berhasil !',
        data: user_data,
        error: '',
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new HttpException(
      {
        status: HttpStatus.OK,
        message: 'Email atau password salah',
        data: [],
        error: 'Email atau password salah',
      },
      HttpStatus.OK,
    );
  }

  async register(user: any) {
    const user_data = await this.usersService.create(user);
    const payload = { email: user_data.email, sub: user_data.id };
    return {
      statusCode: HttpStatus.OK,
      message: 'Pendaftaran berhasil !',
      data: user_data,
      error: '',
      access_token: this.jwtService.sign(payload),
    };
  }

  async checkUser(user: any) {
    return await this.usersService.findUser(user.email);
  }
}
