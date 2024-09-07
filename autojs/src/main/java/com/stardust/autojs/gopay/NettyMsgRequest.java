package com.stardust.autojs.gopay;

public class NettyMsgRequest {
    public static final int MSG_TYPE_REGISTER = 0;
    public static final int MSG_TYPE_TRANSFER_RESULT = 1;
    public static final int MSG_TYPE_ABNORMAL = 2;

    public static final int TRANSFER_RESULT_PENDING = 0;
    public static final int TRANSFER_RESULT_SUCCESS = 1;
    public static final int TRANSFER_RESULT_FAIL = 2;

    private String sim;
    private String walletNo;
    private String walletType;
    private String orderId;
    private String transactionId;
    private int msgType;
    private int operationType;
    private int result;
    private String message;
    private String balance;

    @Override
    public String toString() {
        return "NettyMsgRequest{" +
                "sim='" + sim + '\'' +
                ", walletNo='" + walletNo + '\'' +
                ", walletType='" + walletType + '\'' +
                ", orderId='" + orderId + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", msgType=" + msgType +
                ", operationType=" + operationType +
                ", result=" + result +
                ", message='" + message + '\'' +
                ", balance='" + balance + '\'' +
                '}';
    }

    public NettyMsgRequest(String walletNo, String walletType, String orderId, String transactionId, int msgType, int operationType, int result, String message, String balance) {
        this.walletNo = walletNo;
        this.walletType = walletType;
        this.orderId = orderId;
        this.transactionId = transactionId;
        this.msgType = msgType;
        this.operationType = operationType;
        this.result = result;
        this.message = message;
        this.balance = balance;
    }

    public NettyMsgRequest(String sim, int msgType) {
        this.sim = sim;
        this.msgType = msgType;
    }

    public void setSim(String sim) {
        this.sim = sim;
    }
}
