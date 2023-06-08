import Conifg from "./config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    host: Conifg.DATABASE_HOST,
    port: Conifg.DATABASE_PORT,
    username: Conifg.DATABASE_USERNAME,
    password: Conifg.DATABASE_PASSWORD,
    database: "excels",
    dialect: "mysql"
});

export default sequelize;