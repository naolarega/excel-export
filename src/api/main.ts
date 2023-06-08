import sequelize from "./db";
import express from "express";
import excelExportRouter from "./controllers/excelExportController";

const app = express();

app.use(express.json());
app.use(excelExportRouter);

app.listen(8000, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch(e) {
        console.error("Connection with database failed", e);
        process.exit(1);
    }
    console.log("Excel export api listening on 8000");
});