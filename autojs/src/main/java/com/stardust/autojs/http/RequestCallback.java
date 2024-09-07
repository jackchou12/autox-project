package com.stardust.autojs.http;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public abstract class RequestCallback<T> implements Callback<T> {

    public abstract void onSuccess(T response);

    @Override
    public void onResponse(Call<T> call, Response<T> response) {
        if (response != null && response.isSuccessful() && response.body() != null) {
            HttpResult result = (HttpResult) response.body();
            switch (result.code) {
                case 0:
                    onSuccess(response.body());
                    break;
                default:
                    onFailed(response);
                    break;
            }
        } else {
            onFailed(response);
        }
    }

    @Override
    public void onFailure(Call<T> call, Throwable t) {
    }

    public void onFailed(Response<T> response) {
    }

}
