import { Request, Response } from 'express';
import UserDataBaseService from './UserDataBaseService';
import { generateHash, comparePassword } from '../utils/BcryptUtils';

class UserController {
  constructor() {}

  async listUsers(req: Request, res: Response) {
    try {
      const users = await UserDataBaseService.listDBUsers();
      res.json({ status: "ok", users });
    } catch (error) {
      console.error(error);
      res.json({ status: "error", message: error });
    }
  }

  async createUser(req: Request, res: Response) {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.json({ status: "error", message: "Falta parâmetros" });
    }

    const hashPassword = await generateHash(password);

    if (!hashPassword) {
      return res.json({ status: "error", message: "Erro ao criptografar senha ..." });
    }

    try {
      const newuser = await UserDataBaseService.insertDBUser({
        name,
        email,
        password: hashPassword
      });
      res.json({ status: "ok", newuser });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id) {
      return res.json({ status: "error", message: "Faltou o ID" });
    }

    if (!email || !name) {
      return res.json({ status: "error", message: "Falta parâmetros" });
    }

    try {
      const updatedUser = await UserDataBaseService.updateDBUser({ name, email }, parseInt(id));
      res.json({ status: "ok", updatedUser });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.json({ status: "error", message: "Faltou o ID" });
    }

    try {
      const response = await UserDataBaseService.deleteDBUser(parseInt(id));
      if (response) {
        res.json({ status: "ok", message: "usuário deletado com sucesso" });
      }
    } catch (error) {
      console.error(error);
      res.json({ status: "error", message: error });
    }
  }

  async authenticateUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ status: "error", message: "Falta parâmetros" });
    }

    try {
      const user = await UserDataBaseService.findUserByEmail(email);
      if (!user) {
        return res.json({ status: "error", message: "Usuário não encontrado" });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.json({ status: "error", message: "Senha incorreta" });
      }

      res.json({ status: "ok", message: "Usuário autenticado com sucesso" });
    } catch (error) {
      console.error(error);
      res.json({ status: "error", message: "Erro ao autenticar usuário" });
    }
  }
}

export default new UserController();
