import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log(`Database connection successfull.`);
  } catch (error) {
    console.error(`mysql connection error: ${error}`);
    process.exit(1);
  }
};

export default connectToDatabase;
