package com.stardust.autojs.http;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class HttpManager {

    private static final int DEFAULT_TIMEOUT = 10;
    public ApiService SERVICE;

    private HttpManager() {
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder.readTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);
        builder.writeTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);
        builder.connectTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api.go-pay.live/api/")
                .client(builder.build())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        SERVICE = retrofit.create(ApiService.class);
    }

    public static HttpManager getInstance() {
        return HttpManagerHolder.INSTANCE;
    }

    private static class HttpManagerHolder {
        private static final HttpManager INSTANCE = new HttpManager();
    }

}
