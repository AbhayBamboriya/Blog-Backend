// import postgres from 'postgres'

// const connectionString = process.env.DATABASE_URL
// const connectionToDB = postgres(connectionString)

// export default connectionToDB


import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const connectionToDB = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default connectionToDB;
