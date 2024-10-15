export interface ResponseMessage<T>{
    success: boolean;
    message: string;
    data: T;
}

export interface ErrorMessage{
    error: string;
}

export interface QueryMessage<T>{
    query: T;
}