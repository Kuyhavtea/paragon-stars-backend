import { Injectable } from '@nestjs/common';

interface User {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  isGoogleAccount?: boolean;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private idCounter = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(userData: User): Promise<User> {
    const newUser = {
      id: this.idCounter++,
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
}