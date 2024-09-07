package com.stardust.autojs.gopay;

import android.util.Base64;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;

/**
 * RSA加密工具类
 */
public class RSAUtil {
    /**
     * 数字签名
     * 密钥算法
     */
    public static final String KEY_ALGORITHM = "RSA";

    /**
     * 数字签名
     * 签名/验证算法
     */
    public static final String SIGNATURE_ALGORITHM = "SHA1withRSA";

    /**
     * 公钥
     */
    private static final String PUBLIC_KEY = "RSAPublicKey";

    /**
     * 私钥
     */
    private static final String PRIVATE_KEY = "RSAPrivateKey";

    /**
     * RSA密钥长度 默认1024位，
     * 密钥长度必须是64的倍数，
     * 范围在512至65536位之间。
     */
    private static final int KEY_SIZE = 2048;

    private static final String DEFAULT_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlyvkD1Exs6I/nh6lqUKRxAJyRvPn5TQ8EWSN2c7lXOdyZ2IpmEoOV/q6dm2OMw3FAAL2ud3g8a5miU4or19cTxV3SXo4roKfJGdcpK2cMqd8MTebs3Qua9REuE2ncXMUsvseDFcYKHVa5FvCObRkJ9gaG+qma4UWlfnSG856jUy2CgcR5wfNvzhKdSt4rJ3YTpI6rvuPHRKnIHubBuLWGczfzJIYjxAsbiiphvuVEJGkk1LLi51bzKmIcI1bFcN/fhigR8f5/+P3mFmvwc3MoAf59iPc3y337VNpdt/u15HfOUaRn9Dl9VeG7vBW/rHPgjLlK8ZpDv33Z0vJ2AyR0QIDAQAB";

    public static String sign(String data, String privateKey) throws Exception {
        return sign(data, privateKey, SIGNATURE_ALGORITHM);
    }

    public static String sign(String data, String privateKey, String algorithm) throws Exception {
        return new String(Base64.encode(sign(data.getBytes(StandardCharsets.UTF_8), Base64.decode(privateKey, Base64.NO_WRAP), algorithm), Base64.NO_WRAP));
    }

    /**
     * 签名
     *
     * @param data       待签名数据
     * @param privateKey 私钥
     * @return byte[] 数字签名
     * @throws Exception 异常
     */
    public static byte[] sign(byte[] data, byte[] privateKey, String algorithm) throws Exception {

        // 转换私钥材料
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(privateKey);

        // 实例化密钥工厂
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);

        // 取私钥匙对象
        PrivateKey priKey = keyFactory.generatePrivate(pkcs8KeySpec);

        // 实例化Signature
        Signature signature = Signature.getInstance(algorithm);

        // 初始化Signature
        signature.initSign(priKey);

        // 更新
        signature.update(data);

        // 签名
        return signature.sign();
    }

    public static boolean verify(String data, String publicKey, String sign) throws Exception {
        return verify(data, publicKey, sign, SIGNATURE_ALGORITHM);
    }


    public static boolean verify(String data, String publicKey, String sign, String algorithm) throws Exception {
        return verify(data.getBytes(), Base64.decode(publicKey, Base64.NO_WRAP), Base64.decode(sign, Base64.NO_WRAP), algorithm);
    }

    /**
     * 校验
     *
     * @param data      待校验数据
     * @param publicKey 公钥
     * @param sign      数字签名
     * @return boolean 校验成功返回true 失败返回false
     * @throws Exception 异常
     */
    public static boolean verify(byte[] data, byte[] publicKey, byte[] sign, String algorithm)
            throws Exception {

        // 转换公钥材料
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKey);

        // 实例化密钥工厂
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);

        // 生成公钥
        PublicKey pubKey = keyFactory.generatePublic(keySpec);

        // 实例化Signature
        Signature signature = Signature.getInstance(algorithm);

        // 初始化Signature
        signature.initVerify(pubKey);

        // 更新
        signature.update(data);

        // 验证
        return signature.verify(sign);
    }

    /**
     * 取得私钥
     */
    public static byte[] getPrivateKey(Map<String, Object> keyMap) throws Exception {
        Key key = (Key) keyMap.get(PRIVATE_KEY);
        return key.getEncoded();
    }

    /**
     * 取得公钥
     */
    public static byte[] getPublicKey(Map<String, Object> keyMap) throws Exception {
        Key key = (Key) keyMap.get(PUBLIC_KEY);
        return key.getEncoded();
    }

    /**
     * 初始化密钥
     */
    public static Map<String, Object> initKey() throws Exception {

        // 实例化密钥对儿生成器
        KeyPairGenerator keyPairGen = KeyPairGenerator
                .getInstance(KEY_ALGORITHM);

        // 初始化密钥对儿生成器
        keyPairGen.initialize(KEY_SIZE);

        // 生成密钥对儿
        KeyPair keyPair = keyPairGen.generateKeyPair();

        // 公钥
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();

        // 私钥
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        // 封装密钥
        Map<String, Object> keyMap = new HashMap<String, Object>(2);

        keyMap.put(PUBLIC_KEY, publicKey);
        keyMap.put(PRIVATE_KEY, privateKey);

        return keyMap;
    }


    public static RSAPrivateKey getPrivateKey(String privateKey) throws Exception {
        // 转换私钥材料
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(Base64.decode(privateKey, Base64.NO_WRAP));

        // 实例化密钥工厂
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);

        // 取私钥匙对象
        return (RSAPrivateKey) keyFactory.generatePrivate(pkcs8KeySpec);
    }

    public static RSAPublicKey getPublicKey(String publicKey) throws Exception {
        // 转换公钥材料
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(Base64.decode(publicKey, Base64.NO_WRAP));

        // 实例化密钥工厂
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);

        // 取私钥匙对象
        return (RSAPublicKey) keyFactory.generatePublic(x509KeySpec);
    }

    /**
     * 公钥加密
     */
    public static String publicEncrypt(String data, RSAPublicKey publicKey) {
        try {
            Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            return new String(Base64.encode(cipher.doFinal(data.getBytes(StandardCharsets.UTF_8)), Base64.NO_WRAP));
        } catch (Exception e) {
            throw new RuntimeException("加密字符串[" + data + "]时遇到异常", e);
        }
    }

    /**
     * 公钥加密
     */
    public static byte[] publicEncrypt(String data, String publicKey, String mode) {
        try {
            RSAPublicKey key = getPublicKey(publicKey);
            Cipher cipher = Cipher.getInstance(mode);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.encode(cipher.doFinal(data.getBytes(StandardCharsets.UTF_8)), Base64.NO_WRAP);
        } catch (Exception e) {
            System.out.println(e.toString());
            throw new RuntimeException("加密字符串[" + data + "]时遇到异常", e);
        }
    }

    public static byte[] publicEncrypt(String data) {
        return publicEncrypt(data, DEFAULT_PUBLIC_KEY, "RSA/ECB/PKCS1Padding");
    }

    /**
     * 私钥解密
     */

    public static String privateDecrypt(String data, RSAPrivateKey privateKey) {
        try {
            Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            return new String(cipher.doFinal(Base64.decode(data, Base64.NO_WRAP)), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("解密字符串[" + data + "]时遇到异常", e);
        }
    }

    /**
     * 私钥解密
     */

    public static String privateDecrypt(String data, String privateKey, String mode) {
        try {
            RSAPrivateKey key = getPrivateKey(privateKey);
            Cipher cipher = Cipher.getInstance(mode);
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(Base64.decode(data, Base64.NO_WRAP)), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("解密字符串[" + data + "]时遇到异常", e);
        }
    }

    public static String privateEncrypt(String data, String privateKey) throws Exception {
        return privateEncrypt(data, getPrivateKey(privateKey));
    }

    /**
     * 私钥加密
     */

    public static String privateEncrypt(String data, RSAPrivateKey privateKey) {
        try {
            Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
            //每个Cipher初始化方法使用一个模式参数opmod，并用此模式初始化Cipher对象。此外还有其他参数，包括密钥key、包含密钥的证书certificate、算法参数params和随机源random。
            cipher.init(Cipher.ENCRYPT_MODE, privateKey);
            return new String(Base64.encode(cipher.doFinal(data.getBytes(StandardCharsets.UTF_8)), Base64.NO_WRAP));
        } catch (Exception e) {
            throw new RuntimeException("加密字符串[" + data + "]时遇到异常", e);
        }
    }

    /**
     * 公钥解密
     */

    public static String publicDecrypt(String data, RSAPublicKey publicKey) {
        try {
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.DECRYPT_MODE, publicKey);
            return new String(cipher.doFinal(Base64.decode(data, Base64.NO_WRAP)), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("解密字符串[" + data + "]时遇到异常", e);
        }
    }

    public static String publicDecrypt(String data, String publicKey) throws Exception {
        return publicDecrypt(data, getPublicKey(publicKey));
    }

    public static String publicDecrypt(String data) throws Exception {
        return publicDecrypt(data, DEFAULT_PUBLIC_KEY);
    }

    /**
     * 私钥签名 私钥需要用pkcs8格式
     *
     * @param src
     * @param priKey
     * @return
     */
    public static String generateSHA1withRSASigature(String src, String priKey) {
        try {
            Signature sigEng = Signature.getInstance("SHA1withRSA");
            byte[] pribyte = Base64.decode(priKey, Base64.NO_WRAP);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(pribyte);
            KeyFactory fac = KeyFactory.getInstance("RSA");
            RSAPrivateKey privateKey = (RSAPrivateKey) fac.generatePrivate(keySpec);
            sigEng.initSign(privateKey);
            sigEng.update(src.getBytes());
            byte[] signature = sigEng.sign();
            return new String(Base64.encode(signature, Base64.NO_WRAP));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 公钥验签
     *
     * @param content
     * @param sign
     * @param publicKey
     * @return
     */
    public static boolean checkSign(String content, String sign, String publicKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            byte[] encodedKey = Base64.decode(publicKey, Base64.NO_WRAP);
            PublicKey pubKey = keyFactory.generatePublic(new X509EncodedKeySpec(encodedKey));
            Signature signature = Signature.getInstance("SHA1WithRSA");
            signature.initVerify(pubKey);
            signature.update(content.getBytes());
            boolean bverify = signature.verify(Base64.decode(sign, Base64.NO_WRAP));
            return bverify;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
