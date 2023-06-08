import sequelize from "../db";
import { DataTypes } from "sequelize";

const ExcelModel = sequelize.define("Excel", {
    itemNo: {
        field: "item_no",
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    rate: {
        type: DataTypes.STRING
    },
    qty: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.STRING
    }
});

export default ExcelModel;