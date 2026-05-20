import bcrypt from 'bcrypt';

const DEFAULT_COST_FACTOR = 12;

/**
 * Hashes a plaintext password using bcrypt.
 * The cost factor is read from BCRYPT_COST_FACTOR environment variable.
 */
export async function hashPassword(password: string): Promise<string> {
  const costFactorEnv = process.env.BCRYPT_COST_FACTOR;
  const saltRounds = costFactorEnv ? parseInt(costFactorEnv, 10) : DEFAULT_COST_FACTOR;
  
  // Validate that the parsed cost factor is a valid number, otherwise fallback
  const rounds = isNaN(saltRounds) ? DEFAULT_COST_FACTOR : saltRounds;
  
  return bcrypt.hash(password, rounds);
}

/**
 * Compares a plaintext password with a bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
