import {
    Request,
    Response,
    Router
} from "express";
import {
    checkSchema,
    matchedData,
    param,
    query,
    validationResult
} from "express-validator";
import ExcelModel from "../models/excelModel";
import multer from "multer";
import { read, utils } from "xlsx";

const excelExportRouter = Router();
const upload = multer();

excelExportRouter.get(
    "/excelExport",
    query("limit")
        .optional()
        .isInt({
            gt: 0
        })
        .toInt(),
    query("offset")
        .optional()
        .isInt({
            gt: 0
        })
        .toInt(),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return res.status(400)
                .json({
                    "errors": result.array()
                });
        }
        const pagination = matchedData(req);
        try {
            const excels = await ExcelModel.findAll({
                ...pagination,
                attributes: [
                    "item_no",
                    "description",
                    "qty",
                    "rate",
                    "amount"
                ]
            });
            res.json(excels);
        } catch {
            res.status(500)
                .json({
                    "message": "something went wrong"
                });
        }
    }
);

excelExportRouter.post(
    "/excelExport",
    upload.single("excel"),
    async (req: Request, res: Response) => {
        const excelFile = req.file;
        if(excelFile === undefined) {
            return res.status(400)
                .json({
                    "error": "excel file not uploaded"
                });
        }

        if(excelFile.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return res.status(415)
                .json({
                    "error": "uploaded file is not an xlsx"
                });
        }

        const workBook = read(excelFile.buffer);
        utils.sheet_to_json(
            workBook.Sheets[workBook.SheetNames[0]],
            {
                raw: false,
                header: [
                    "itemNo",
                    "description",
                    "unit",
                    "qty",
                    "rate",
                    "amount"
                ]
            }
        ).forEach(
            async row => {
                try {
                    await ExcelModel.create(row as {});
                } catch {
                    /* invalid row */
                }
            }
        );

        res.json({
            "detail": "uploaded"
        });
    }
);

excelExportRouter.delete(
    "/excelExport/:itemNo",
    param("itemNo")
        .notEmpty()
        .isFloat()
        .toFloat(),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return res.status(400)
                .json({
                    "errors": result.array()
                })
        }

        const {itemNo} = matchedData(req);
        try {
            const item = await ExcelModel.findOne({
                where: {
                    itemNo
                }
            });
            if(item === null) {
                return res.status(404)
                    .json({
                        "message": "item not found"
                    });
            }
            await item.destroy()
        } catch {
            return res.status(500)
                .json({
                    "message": "something went wrong"
                });
        }

        res.json({
            "itemNo": itemNo 
        });
    }
);

excelExportRouter.put(
    "/excelExport/:itemNo",
    param("itemNo")
        .notEmpty()
        .isFloat()
        .toFloat(),
    checkSchema({
        "description": {
            isString: true
        },
        "unit": {
            isFloat: true,
        },
        "qty": {
            isFloat: true,
        },
        "rate": {
            isFloat: true,
        },
        "amount": {
            isFloat: true
        }
    }),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return res.status(400)
                .json({
                    "error": result.array()
                });
        }

        const {itemNo, ...itemUpdate} = matchedData(req);
        try {
            const item = await ExcelModel.findOne({
                where: {
                    itemNo
                }
            })
            if(item === null) {
                return res.status(404)
                    .json({
                        "message": "item not found"
                    });
            }
            await item.update(itemUpdate);
        } catch(e) {
            return res.status(500)
                .json({
                    "message": "something went wrong"
                });
        }

        res.json({
            "itemNo": itemNo
        });
    }
);

export default excelExportRouter;