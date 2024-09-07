package com.stardust.autojs.http;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {

    @POST("script/result")
    Call<HttpResult> resultUpload(@Body String params);

}
