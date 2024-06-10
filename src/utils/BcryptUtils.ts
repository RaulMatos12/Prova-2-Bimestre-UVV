import bcrypt from 'bcrypt';

// Define o número de saltos para a criptografia
const saltRounds = 10;

// Função para gerar hash da senha
async function generateHash(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Erro ao gerar o hash da senha');
  }
}

// Função para comparar a senha com o hash
async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Erro ao comparar a senha');
  }
}

export { generateHash, comparePassword };
