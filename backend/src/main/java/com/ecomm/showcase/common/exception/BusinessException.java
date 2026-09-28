package com.ecomm.showcase.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import org.springframework.lang.NonNull;

@Getter
public class BusinessException extends RuntimeException {

    private final String errorCode;
    @NonNull
    private final HttpStatus status;

    public BusinessException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status != null ? status : HttpStatus.BAD_REQUEST;
    }

    public BusinessException(String message, String errorCode) {
        this(message, errorCode, HttpStatus.BAD_REQUEST);
    }
}
