import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserDataBaseService {
  constructor() {}

  async listDBUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          name: true,
          email: true,
          password: false,
        },
      });
      return users;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async insertDBUser(user: Prisma.UserCreateInput) {
    try {
      return await prisma.user.create({ data: user });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateDBUser(user: Prisma.UserUpdateInput, id: number) {
    try {
      return await prisma.user.update({
        where: { id },
        data: user,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteDBUser(id: number) {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default new UserDataBaseService();
