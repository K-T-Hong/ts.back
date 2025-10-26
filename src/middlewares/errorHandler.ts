import type { ErrorRequestHandler } from "express";
import HttpError from "../utiles/HttpError.js";
import { Prisma } from "@prisma/client";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.errorType !== undefined ? { errorType: err.errorType } : {}),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          message: "이미 존재하는 값입니다.",
          errorType: "validation",
        });
      case "P2025":
        return res.status(404).json({
          message: "리소스를 찾을 수 없습니다.",
          errorType: "notfound",
        });
      default:
        return res.status(400).json({
          message: "요청을 처리할 수 없습니다.",
          errorType: "validation",
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "유효하지 않은 요청 데이터입니다.",
      errorType: "validation",
    });
  }

  if (err?.name === "jsonWebTokenError" || err?.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "토큰이 유효하지 않습니다.",
      errorType: "auth",
    });
  }

  const status =
    (typeof (err as any)?.status === "number" && (err as any).status) ||
    (typeof (err as any)?.code === "number" && (err as any).code) ||
    500;

  const message =
    (typeof (err as any)?.message === "string" && (err as any).message) ||
    "서버 내부 오류";

  res.status(status).json({ message });
  console.error("Error:", err);
};

export default errorHandler;
