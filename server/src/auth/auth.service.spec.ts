import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('registers user successfully', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'usr_1',
      name: 'John',
      email: 'john@example.com',
    });

    const result = await service.register({
      name: 'John',
      email: 'john@example.com',
      password: 'StrongPass123',
    });

    expect(result).toEqual({
      id: 'usr_1',
      name: 'John',
      email: 'john@example.com',
    });
    expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
  });

  it('rejects duplicate email registration', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'usr_1' });

    await expect(
      service.register({
        name: 'John',
        email: 'john@example.com',
        password: 'StrongPass123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns JWT token on successful login', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'usr_1',
      passwordHash: await require('bcrypt').hash('StrongPass123', 4),
    });
    jwtMock.signAsync.mockResolvedValue('jwt.token.value');

    const result = await service.login({
      email: 'john@example.com',
      password: 'StrongPass123',
    });

    expect(result).toEqual({ token: 'jwt.token.value' });
    expect(jwtMock.signAsync).toHaveBeenCalledWith({ userId: 'usr_1' });
  });

  it('rejects invalid credentials on login', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'usr_1',
      passwordHash: await require('bcrypt').hash('OtherPass123', 4),
    });

    await expect(
      service.login({
        email: 'john@example.com',
        password: 'StrongPass123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
