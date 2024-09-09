package com.stardust.autojs.gopay;

import static android.content.Context.TELEPHONY_SUBSCRIPTION_SERVICE;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.SystemClock;
import android.provider.Settings;
import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.stardust.autojs.http.HttpManager;
import com.stardust.autojs.http.HttpResult;
import com.stardust.autojs.http.RequestCallback;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoop;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.LineBasedFrameDecoder;
import io.netty.handler.codec.string.LineEncoder;
import io.netty.handler.codec.string.LineSeparator;
import io.netty.util.AttributeKey;
import io.netty.util.concurrent.DefaultThreadFactory;

public class GoPayClient {

    private final static String TAG = GoPayClient.class.getSimpleName();

    private Context mContext;
    private final String serverHost;
    private final int serverPort;

    public String getClientId() {
        return clientId;
    }

    private final String clientId;

    private final BlockingQueue<String> taskQueue;
    private final BlockingQueue<String> resultQueue;
    private final SimpleDateFormat sdf;

    private static final Object mLock = new Object();
    private static GoPayClient mInstance;

    @NonNull
    public static GoPayClient getInstance(@NonNull Context context) {
        synchronized (mLock) {
            if (mInstance == null) {
                mInstance = new GoPayClient(context, "api.go-pay.live", 20800,
                        Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID));
            }
            return mInstance;
        }
    }

    private GoPayClient(Context context, String serverHost, int serverPort, String clientId) {
        this.mContext = context;
        this.serverHost = serverHost;
        this.serverPort = serverPort;
        this.clientId = clientId;
        this.taskQueue = new LinkedBlockingQueue<>();
        this.resultQueue = new LinkedBlockingQueue<>();
        this.sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        EventBus.getDefault().register(this);
        connectServer();

        HeartThread.setClient(this);
        HeartThread heartThread = HeartThread.mInstance;
        if (!heartThread.isAlive()) {
            heartThread.start();
        }
    }

    private volatile boolean isConnecting = false;
    private volatile boolean isConnected = false;

    private Channel channel;

    public Channel getChannel() {
        return channel;
    }

    public void closeChannel() {
        if (channel != null) {
            channel.close();
//            TheApp.getApplication().showToast("断开重连中！");
        }
    }

    private EventLoop mainEventLoop;

    public boolean isAlive() {
        return channel != null && channel.isActive();
    }

    private static long sleepTimeMill = 1000;

    private static long reconnectWait() {
        if (sleepTimeMill > 30000) {
            sleepTimeMill = 30000;
        }
        synchronized (GoPayClient.class) {
            sleepTimeMill = sleepTimeMill + 1000;
            return sleepTimeMill;
        }
    }

    private ChannelFuture serverChannelFuture = null;

    synchronized void connectServer() {
        Channel cmdChannelCopy = channel;
        if (cmdChannelCopy != null && cmdChannelCopy.isActive()) {
            Log.i(TAG, "cmd channel active, and close channel,heartbeat timeout ?");
            return;
        }
        if (isConnecting) {
            Log.w(TAG, "connect event fire already");
            return;
        }
        isConnecting = true;
        Log.i(TAG, "connect to gopay server... -> " + serverHost + ":" + serverPort);
//        Toast.makeText(mContext, "连接成功！", Toast.LENGTH_LONG).show();
        serverChannelFuture = clientBootstrap.connect(serverHost, serverPort);
        serverChannelFuture.channel().attr(GOPAY_CLIENT_KEY).set(this);

        if (mainEventLoop == null) {
            mainEventLoop = serverChannelFuture.channel().eventLoop();
        }

        serverChannelFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture) {
                isConnecting = false;
                if (!channelFuture.isSuccess()) {
                    Log.w(TAG, "connect to gopay server failed", channelFuture.cause());
                    channelFuture.channel().eventLoop().schedule(new Runnable() {
                        @Override
                        public void run() {
                            Log.i(TAG, "connect to gopay server failed, reconnect by scheduler task start");
                            connectServer();
                        }
                    }, reconnectWait(), TimeUnit.MILLISECONDS);
                    return;
                }


                sleepTimeMill = 1000;
                channel = channelFuture.channel();
                channel.closeFuture().addListener(new ChannelFutureListener() {
                    @Override
                    public void operationComplete(ChannelFuture future) {
                        final Channel ch = future.channel();

                        Log.w(TAG, "client disconnected: " + ch + "  prepare to reconnect");
                        isConnected = false;
                        ch.eventLoop().schedule(new Runnable() {
                            @Override
                            public void run() {
                                GoPayClient.get(ch).connectServer();
                            }
                        }, 1500, TimeUnit.MILLISECONDS);
                    }
                });

                Log.i(TAG, "connect to gopay server success:" + channel);
                isConnected = true;
                channel.writeAndFlush(
                        Unpooled.copiedBuffer(
                                RSAUtil.publicEncrypt(
                                        GsonUtil.toJson(
                                                new NettyMsgRequest(clientId, NettyMsgRequest.MSG_TYPE_REGISTER)
                                        )
                                )
                        )
                );
            }
        });
    }

    private static final AttributeKey<GoPayClient> GOPAY_CLIENT_KEY = AttributeKey.newInstance("GOPAY_CLIENT_KEY");

    public static GoPayClient get(Channel channel) {
        return channel.attr(GOPAY_CLIENT_KEY).get();
    }

    private static final NioEventLoopGroup workerGroup = new NioEventLoopGroup(
            0,
            new DefaultThreadFactory("gopay-endpoint-group" + DefaultThreadFactory.toPoolName(NioEventLoopGroup.class))
    );
    private static final Bootstrap clientBootstrap;

    static {
        clientBootstrap = new Bootstrap();
        clientBootstrap.group(workerGroup);
        clientBootstrap.channel(NioSocketChannel.class);
        clientBootstrap.handler(new ChannelInitializer<SocketChannel>() {

            @Override
            public void initChannel(final SocketChannel ch) {
                ch.pipeline().addLast(new LineBasedFrameDecoder(1048576));
                ch.pipeline().addLast(new LineEncoder(LineSeparator.WINDOWS, StandardCharsets.UTF_8));
                ch.pipeline().addLast(new GoPayServerHandler());
            }
        });
    }

    public void sync() {
        if (serverChannelFuture == null) {
            return;
        }

        try {
            serverChannelFuture.sync();
        } catch (InterruptedException interruptedException) {
            Log.e(TAG, "sync interrupted", interruptedException);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(OrderEvent event) {
        taskQueue.add(event.order);
    }

    public String getOrder() {
        return taskQueue.poll();
    }

    public boolean isConnected() {
        return isConnected;
    }

    public String getDeviceTime() {
        return sdf.format(new Date());
    }

    public void sendOrderResult(String walletNo, String walletType, String orderId, String transactionId, int operationType, int result, String message, String balance) {
        NettyMsgRequest resultReq = new NettyMsgRequest(walletNo, walletType, orderId, transactionId, NettyMsgRequest.MSG_TYPE_TRANSFER_RESULT, operationType, result, message, balance);
        resultReq.setSim(getClientId());
        Log.i(TAG, "sendOrderResult : " + resultReq);
        final String resultStr = new String(RSAUtil.publicEncrypt(GsonUtil.toJson(resultReq)), StandardCharsets.UTF_8);
        resultQueue.add(resultStr);
        doSendResult(resultStr);
//        getChannel().writeAndFlush(
//                Unpooled.copiedBuffer(RSAUtil.publicEncrypt(GsonUtil.toJson(resultReq)))
//        );
    }


    private int getSlotIndex(int subId) {
        int slotIndex = -1;
        SubscriptionManager sm = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP_MR1) {
            sm = (SubscriptionManager) mContext.getSystemService(TELEPHONY_SUBSCRIPTION_SERVICE);
            try {
                for (SubscriptionInfo si : sm.getActiveSubscriptionInfoList()) {
                    if (si.getSubscriptionId() == subId) {
                        slotIndex = si.getSimSlotIndex();
                        break;
                    }
                }
            } catch (SecurityException ignored) {
            }
        }
        return slotIndex;
    }

    public List<HashMap<String, Object>> getSMSList(String operator, String phone, int slotIndex, String time) {
        Uri uriSms = Uri.parse("content://sms/inbox");
        ContentResolver contentResolver = mContext.getContentResolver();

        List<HashMap<String, Object>> list = new ArrayList<>();
        Cursor cursor = contentResolver.query(uriSms, null, null, null, "date DESC");
        if (cursor != null) {
            boolean isQuit = false;
            while (cursor.moveToNext() && !isQuit) {
                @SuppressLint("Range") String address = cursor.getString(cursor.getColumnIndex("address"));
                @SuppressLint("Range") String body = cursor.getString(cursor.getColumnIndex("body"));
                @SuppressLint("Range") String date = cursor.getString(cursor.getColumnIndex("date"));
                @SuppressLint("Range") int sub_id = cursor.getInt(cursor.getColumnIndex("sub_id"));

                if (Long.parseLong(date) <= Long.parseLong(time)) {
                    isQuit = true;
                }
                // 根据需要处理短信内容
                if (address.contains(operator) && Long.parseLong(date) > Long.parseLong(time)) {
                    Log.e("GoPayClient", body);

                    if (getSlotIndex(sub_id) == slotIndex) {
                        HashMap<String, Object> map = new HashMap<>();
                        map.put("sim", phone);
                        map.put("content", body);
                        map.put("from", operator);
                        map.put("time", date);
                        list.add(map);
                    }
                }
            }
            cursor.close();
        }
        return list;
    }

    private void doSendResult(String result) {
        HttpManager.getInstance().SERVICE.resultUpload(result)
                .enqueue(new RequestCallback<HttpResult>() {
                    @Override
                    public void onSuccess(HttpResult response) {
                        resultQueue.remove(result);
                    }
                });
    }

    public void resendResultIfNeeded() {
        for (String result : resultQueue) {
            doSendResult(result);
        }
    }

    public void sendAccountState(String walletNo, String walletType, String message) {
        NettyMsgRequest resultReq = new NettyMsgRequest(walletNo, walletType, "", "", NettyMsgRequest.MSG_TYPE_ABNORMAL, 0, 0, message, "");
        resultReq.setSim(getClientId());
        Log.i(TAG, "sendAccountState : " + resultReq);
        getChannel().writeAndFlush(
                Unpooled.copiedBuffer(RSAUtil.publicEncrypt(GsonUtil.toJson(resultReq)))
        );
    }

    // 心跳任务定时器
    private static class HeartThread extends Thread {
        private static final HeartThread mInstance = new HeartThread();
        private static GoPayClient client;

        public static void setClient(GoPayClient client) {
            HeartThread.client = client;
        }

        @Override
        public void run() {
            while (Thread.currentThread().isAlive()) {
                try {
                    client.resendResultIfNeeded();
                    SystemClock.sleep(30 * 1000);
                    client.channel.writeAndFlush(
                            Unpooled.copiedBuffer(
                                    RSAUtil.publicEncrypt(
                                            GsonUtil.toJson(
                                                    new NettyMsgRequest(client.clientId, NettyMsgRequest.MSG_TYPE_REGISTER)
                                            )
                                    )
                            )
                    );
                } catch (Throwable t) {
                    Log.i(TAG, "GoPayClient HeartThread error : ", t);
                }
            }
        }
    }

}
