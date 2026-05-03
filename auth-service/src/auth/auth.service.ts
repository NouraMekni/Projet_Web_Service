import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type User = {
  id: number;
  email: string;
  password: string;
  role: string;
};

@Injectable()
export class AuthService {
  private users: User[] = [];

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user: User = {
      id: Date.now(),
      email,
      password: hashed,
      role: 'OPERATOR',
    };

    this.users.push(user);
    return user;
  }

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);

    if (!user) throw new Error('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Wrong password');

    return {
      access_token: 'FAKE_JWT',
    };
  }
}
