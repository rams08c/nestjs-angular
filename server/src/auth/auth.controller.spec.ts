import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('register delegates to service', async () => {
    authServiceMock.register.mockResolvedValue({
      id: 'usr_1',
      name: 'John',
      email: 'john@example.com',
    });

    await expect(
      controller.register({
        name: 'John',
        email: 'john@example.com',
        password: 'StrongPass123',
      }),
    ).resolves.toEqual({
      id: 'usr_1',
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('login delegates to service', async () => {
    authServiceMock.login.mockResolvedValue({ token: 'token' });

    await expect(
      controller.login({ email: 'john@example.com', password: 'StrongPass123' }),
    ).resolves.toEqual({ token: 'token' });
  });
});
