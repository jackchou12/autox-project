package com.stardust.autojs.gopay;

public class NettyMsgOrder {
    public String orderId;
    public String amount;
    public String receiveWalletNo;
    public String walletNo;
    public String walletType;
    public String pin;

    public NettyMsgOrder(String orderId, String amount, String receiveWalletNo, String pin) {
        this.orderId = orderId;
        this.amount = amount;
        this.receiveWalletNo = receiveWalletNo;
        this.pin = pin;
    }

    @Override
    public String toString() {
        return "NettyMsgOrder{" +
                "orderId='" + orderId + '\'' +
                ", amount='" + amount + '\'' +
                ", receiveWalletNo='" + receiveWalletNo + '\'' +
                ", walletNo='" + walletNo + '\'' +
                ", walletType='" + walletType + '\'' +
                ", pin='" + pin + '\'' +
                '}';
    }
}
