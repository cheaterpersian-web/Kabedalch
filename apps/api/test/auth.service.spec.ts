import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/modules/common/prisma.service';

describe('AuthService', () => {
  const prisma = new PrismaService();
  const svc = new AuthService({} as any, prisma);

  it('register rejects duplicate', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({ id: 'u' } as any);
    await expect(
      svc.register({ name: 'a', family: 'b', email: 'e', phone: 'p', password: 'x' })
    ).rejects.toBeTruthy();
  });
});
