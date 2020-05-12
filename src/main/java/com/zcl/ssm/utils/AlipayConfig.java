package com.zcl.ssm.utils;

import java.io.FileWriter;
import java.io.IOException;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 *修改日期：2017-04-05
 *说明：  ksfxhw3818@sandbox.com   111111
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

public class AlipayConfig {
	
//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	// 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	public static String app_id = "2016101900721573";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKc79MwDcHOBvwVWGeAtukeLb53IeRviz9KdRRDJHbKckTb3GUJ8yqSww91G0KQM2qkCYof6a8T9QE6PLOfkwAFyIrLC8S7tSPuvCZv/q+TATDoVNh0BZ484hSIc7hoPemEf/g5clzlmS0HXgKSy8rf4aGe6DKqdqMAjHKdBXCHZsMJpIgjICNoNYPCiJpOiegJdkW+eOHLIqB19ZnMIjItIx2iMipCDsyMLH6b1kW+shpBH0H+uMscGjUyc/3w5CDD7+6lKulWAN0MVJS65QAbuRcJpJbbEp8OT5qI41VsOGSluMDwmEnOM7rd17eiXPlLAkgo2ROjscJLE0jWtnbAgMBAAECggEBALcW6Km7p8hymOnH/alOAl+DAE+FfmFy8PLfUnEeAgaHip52Ceyn9bMIfgCozRgZtSYMiUXU8/CX7TGnjnbqx0bJpRAQPF5N+ZQmxxL1CQnya9iUXHk4HCq0a9ODWbq5vV3GJ3e3uHE9UMOHZxlAF1+qS/nxcl/2LnyyO19Rjp/mUiYpdWHPEjjnuDu4AmAs4hbVBRRehg+MES8afcoijK/zngx30VqVVAQEwxWubQn0SWoOj+fiyk2RjFpbku+aD1AJ+5kTEYnnRsYQJQuVh9oHQTeiJJlG0Fxkr7hW6ghMwPxST0AJ4FxRX66MDjuafnLfC5boYxMJWyyhSIE1CykCgYEA/fbjfDTlB2KgGXVVrzf5RsyWERvh/G4bcOPez4wGlHPXGL+1xlK6J7TxXYYMWczn1vxJedO1OZ8coZU8DZUKVdr5t94Wj0JXCj6QHDNEy53KH3HgtCBL/k5qi2MZtAEnCTbyKvo34okNf6dFs4T8JIUlVzhKkm7FZhRisvAfjmcCgYEAzBMpBmZw5iF83AwZqL8ZCTRRTZMlpRTimqRlnlbsTB1VvoYdvx93+Zf2kRLuxC67QofnPOY6agA0KDmxWnMmWzpZUXP/WrbWc5LRmrH17Fhm8jZGCjQu64Dx5ZAls9MtOJdofhjIgUKqieR3e6PxvfFqZ12RedzLu1mxWm/ICG0CgYBZXUfdC+vPdnfpnW0iM+sGa7UenhYeMkx7o+NiWt5x3HVC4yq+d5vDnxsTkrjD3KNz9eCQ+tsZRJDZlt7D1L8HSP94ILEFhg2EsFEbazr4/zQBbpvoJjk3ajZ5h8yil4k559i9IMELeLiEQ8L2EYR8AVILZ+ZtsobJjcDRQEeKXwKBgH30IXD6zxmqd4bUzQ1yjMA6kyee9zARWN77MmDs40EDJgXGfxuUD5d0LFFT7xwUf61LdfQHYOxFnetp2EWsJnNN6wyz3Fof2PJSHp4s0k0CLt+1kbsAhCkEV8hJFIwNfa6c/Hg/UZk+DUW4ReqAwFZsZzDO9lfRZ8kFTco0jbBtAoGAbURyH7yZfz2bfKrpPBrBYjNROTb+8vHjs8xwyYP0atRQKkilAQuGval6Bm0K5cPN/CatmuY16BKzU34qNU7ITyVVfpLHn2h374LsNawvN4FWHnq4dVdGBl1ik4PFDeQLy2KECxP6PEdVOvTj6asA2FEakx0Kg6MSEqT3gAo7skk=";

	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    public static String alipay_public_key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAynO/TMA3Bzgb8FVhngLbpHi2+dyHkb4s/SnUUQyR2ynJE29xlCfMqksMPdRtCkDNqpAmKH+mvE/UBOjyzn5MABciKywvEu7Uj7rwmb/6vkwEw6FTYdAWePOIUiHO4aD3phH/4OXJc5ZktB14CksvK3+GhnugyqnajAIxynQVwh2bDCaSIIyAjaDWDwoiaTonoCXZFvnjhyyKgdfWZzCIyLSMdojIqQg7MjCx+m9ZFvrIaQR9B/rjLHBo1MnP98OQgw+/upSrpVgDdDFSUuuUAG7kXCaSW2xKfDk+aiONVbDhkpbjA8JhJzjO63de3olz5SwJIKNkTo7HCSxNI1rZ2wIDAQAB";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String notify_url = "http://工程公网访问地址/alipay.trade.page.pay-JAVA-UTF-8/notify_url.jsp";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String return_url = "http://localhost/ssm_hotel-1.0-SNAPSHOT/orders/afterOrdersPay";

	// 签名方式
	public static String sign_type = "RSA2";
	
	// 字符编码格式
	public static String charset = "utf-8";
	
	// 支付宝网关
	public static String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
	
	// 支付宝网关
	public static String log_path = "C:\\";


//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    /** 
     * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
     * @param sWord 要写入日志里的文本内容
     */
    public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_" + System.currentTimeMillis()+".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

