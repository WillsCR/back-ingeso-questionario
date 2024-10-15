import { HttpException } from "@nestjs/common";
import { ResponseMessage } from "src/types/message";

export function ThrowHTTPException(
    message: string,
    errorVariables: string[],
    status: number,
    error: string,
): Promise<never> {
    throw new HttpException(
        {
            message: [`${errorVariables.join(",")}$${message}`],
            error: error.toUpperCase(),
            status
        },
        status
        //}
    )
}

export function SuccessHTTPAnswer<T>(
    message: string,
    data: any
): ResponseMessage<T> {
    return {
        message,
        data,
        success: true
    };
}