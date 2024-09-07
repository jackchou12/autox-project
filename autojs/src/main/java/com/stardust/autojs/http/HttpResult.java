package com.stardust.autojs.http;

import java.io.Serializable;

public class HttpResult<T> implements Serializable {
    public T data;
    public String msg;
    public int code;
}
