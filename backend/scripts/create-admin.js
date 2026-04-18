import bcrypt from "bcrypt";
import { prisma as Prisma } from "../src/utils/prismaClient.js";
import { Role } from "@prisma/client";

const firstNonEmpty = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const parseArgs = () => {
  const values = {};

  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith("--")) {
      continue;
    }

    const [rawKey, ...rawValueParts] = arg.slice(2).split("=");
    const key = rawKey?.trim();
    const value = rawValueParts.join("=").trim();

    if (!key || !value) {
      continue;
    }

    values[key] = value;
  }

  return values;
};

const parsePositionalArgs = () => {
  const positionals = process.argv
    .slice(2)
    .filter((arg) => arg && !arg.startsWith("--"));

  const [email = "", password = "", ...nameParts] = positionals;

  return {
    email,
    password,
    name: nameParts.join(" "),
  };
};

const resolveBootstrapValues = () => {
  const args = parseArgs();
  const positional = parsePositionalArgs();

  const email = firstNonEmpty(
    args.email,
    process.env.npm_config_email,
    positional.email,
    process.env.ADMIN_BOOTSTRAP_EMAIL,
  );

  const password = firstNonEmpty(
    args.password,
    process.env.npm_config_password,
    positional.password,
    process.env.ADMIN_BOOTSTRAP_PASSWORD,
  );

  const name = firstNonEmpty(
    args.name,
    process.env.npm_config_name,
    positional.name,
    process.env.ADMIN_BOOTSTRAP_NAME,
    "Platform Admin",
  );

  if (!email || !password) {
    throw new Error(
      "Provide admin credentials using --email and --password, positional args (<email> <password> [name]), or ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD env vars.",
    );
  }

  return {
    email: email.trim(),
    password,
    name: name.trim(),
  };
};

const bootstrapAdmin = async () => {
  const { email, password, name } = resolveBootstrapValues();

  if (password.length < 6) {
    throw new Error("Admin password must be at least 6 characters long.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    update: {
      name,
      password: hashedPassword,
      role: Role.ADMIN,
      classId: null,
      refreshToken: null,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    },
  });

  console.log("Admin account is ready:", admin);
};

bootstrapAdmin()
  .catch((error) => {
    console.error("Failed to bootstrap admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Prisma.$disconnect();
  });
