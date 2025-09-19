// src/lib/auth.ts
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const COOKIE_NAME = "axzons_auth";
const USERS_FILE = path.join(process.cwd(), "data", "users.json"); // <- matches your file

type StoredUser = {
  id: string;
  name: string;
  email: string;
  username: string; // stored lowercase
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

function ensureSecret() {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) throw new Error("JWT_SECRET is missing in .env.local");
  return secret;
}

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    if ((e as any)?.code === "ENOENT") {
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
      await fs.writeFile(USERS_FILE, "[]", "utf8");
      return [];
    }
    throw e;
  }
}

export async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

// Live password policy
export function validatePassword(pw: string) {
  const rules = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const ok = Object.values(rules).every(Boolean);
  return { ok, rules };
}

export async function createUser(name: string, email: string, username: string, password: string): Promise<PublicUser> {
  const users = await readUsers();
  const e = normalizeEmail(email);
  const u = normalizeUsername(username);

  if (users.some((x) => x.email === e)) throw new Error("Email already registered");
  if (users.some((x) => x.username === u)) throw new Error("Username already taken");

  const { ok } = validatePassword(password);
  if (!ok) throw new Error("Password does not meet complexity requirements");

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: e,
    username: u,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  const { passwordHash: _, ...pub } = newUser;
  return pub;
}

export async function findByEmailOrUsername(identifier: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  const id = identifier.trim().toLowerCase();
  return users.find((x) => x.email === id || x.username === id);
}

export async function verifyUser(identifier: string, password: string): Promise<PublicUser | null> {
  const user = await findByEmailOrUsername(identifier);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const { passwordHash: _, ...pub } = user;
  return pub;
}

export function signToken(user: PublicUser) {
  const secret = ensureSecret();
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, name: user.name },
    secret,
    { expiresIn: "7d" }
  );
}
