package com.stardust.autojs.gopay;

import android.util.Log;

import org.greenrobot.eventbus.EventBus;

import java.nio.charset.StandardCharsets;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;

public class GoPayServerHandler extends ChannelInboundHandlerAdapter {

    private final static String TAG = GoPayClient.class.getSimpleName();

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf) msg;
        String json = RSAUtil.publicDecrypt(buf.toString(StandardCharsets.UTF_8));
        Log.i(TAG, "receive from server original: " + json);
//        NettyMsgOrder order = GsonUtil.fromJson(json, NettyMsgOrder.class);
//        Log.i(TAG, "receive from server: " + order);
        EventBus.getDefault().post(new OrderEvent(json));
    }
}
