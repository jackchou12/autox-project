"ui";
ui.layout(
    <vertical id="parent">
        <appbar>
            <toolbar id="toolbar" title="GoPay Ltd" layout_height="40" />
        </appbar>

        <ScrollView>
            <vertical margin="10 0">
                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="10 8" h="auto">
                        <linear>
                            <text id="deviceId" text="设备ID：{{device.getAndroidId()}}" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                            <text text="版本：{{app.versionName}}" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                        </linear>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>

                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="18 8" h="auto">
                        <linear>
                            <Switch margin="12 0" layout_weight="1" id="autoService" text="无障碍服务" checked="{{auto.service != null}}" />
                            <Switch margin="12 0" layout_weight="1" id="floatyService" text="悬浮窗权限" checked="false" />
                        </linear>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>

                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="18 8" h="auto">
                        <linear>
                            <Switch margin="12 0" layout_weight="1" id="checkRecord" text="是否查单" checked="true" />
                            <View margin="12 0" layout_weight="1" w="100" h="auto" />
                        </linear>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>

                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="18 8" h="auto">
                        <linear>
                            <text margin="12 0" text="选择运营商" textColor="#222222" w="auto" />
                            <Spinner margin="12 0" id="selectOpt" />
                        </linear>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>

                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="8 0" h="auto">
                        <linear>
                            <Button layout_weight="1" id="console" text="打开日志" style="Widget.AppCompat.Button.Colored" />
                            <Button layout_weight="1" id="start" text="开始任务" style="Widget.AppCompat.Button.Colored" />
                        </linear>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>

                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="18 8" marginBottom="2" h="auto">
                        <text text="Nagad:" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                        <vertical id="nagadContainer"></vertical>

                        <linear>
                            <button id="editNagad" text="开始编辑" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                            <button id="saveNagad" text="保存" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                        </linear>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>

                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="18 8" marginBottom="2" h="auto">
                        <text text="bKash:" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                        <vertical id="bkashContainer"></vertical>

                        <linear>
                            <button id="editbKash" text="开始编辑" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                            <button id="savebKash" text="保存" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                            <button id="addbKash" text="新增" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                        </linear>

                        <vertical id="addbKashPanel" padding="18 8" marginBottom="2" h="auto" visibility="gone">
                            <horizontal>
                                <text text="应用名：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                                <input id="name" inputType="text" text="" w="*" color="#666666" />
                            </horizontal>
                            <horizontal>
                                <text text="账号：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                                <input id="account" inputType="number" text="" w="*" color="#666666" />
                            </horizontal>
                            <horizontal>
                                <text text="pin码：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                                <input id="pin" inputType="number" text="" w="*" color="#666666" />
                            </horizontal>

                            <linear>
                                <button id="cancel" text="取消" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                                <button id="confirm" text="确定" layout_weight="1" style="Widget.AppCompat.Button.Colored" />
                            </linear>
                        </vertical>
                    </vertical>
                    <View bg="#36a4a1" h="*" w="5" />
                </card>
            </vertical>
        </ScrollView>
    </vertical>
)

setFloatyService()

function setFloatyService() {
    try {
        ui.floatyService.checked = (new android.provider.Settings).canDrawOverlays(context)
    } catch (error) {
        ui.floatyService.checked = true
    }
}

ui.autoService.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        })
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf()
    }
})

ui.floatyService.on("check", function (checked) {
    try {
        app.startActivity({
            action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
        })
    } catch (error) {
        toast('当前设备不支持跳转设置,请手动开启权限!')
    }
})

ui.emitter.on("resume", function () {
    ui.autoService.checked = auto.service != null;
    try {
        ui.floatyService.checked = (new android.provider.Settings).canDrawOverlays(context)
    } catch (error) {
        ui.floatyService.checked = true
    }
})

ui.deviceId.click(function () {
    setClip(deviceId)
    toast("已复制: " + deviceId)
})

var storage = storages.create("Account")

var checkRecord = storage.get("checkRecord", true)
ui.checkRecord.checked = checkRecord
ui.checkRecord.on("check", function (checked) {
    checkRecord = checked
    storage.put("checkRecord", checked)
    toast(checked ? '查账已开启' : '查账已关闭')
})

var entries = ["Airtel", "Bangla link", "Graminphone", "RobiAirtel", "Telitalk"]
var selectOption = storage.get("selectOption", "")

ui.post(function () {
    let adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, entries)
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
    ui.selectOpt.setAdapter(adapter);
    ui.selectOpt.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener({
        onItemSelected: function(parent, view, position, id) {
            var option = parent.getItemAtPosition(position)
            // 处理选中项
            console.log("选中的项: " + option);
            storage.put("selectOption", option)
        },
        onNothingSelected: function(parent) {
            // 处理未选中项
        }
    }));
    var i = entries.indexOf(selectOption)
    if (i < 0) {
        i = 0
    }
    ui.selectOpt.setSelection(i)
})


ui.console.click(function () {
    app.startActivity("console")
})

const VISIBLE = 0
const INVISIBLE = 4
const GONE = 8
ui.editNagad.click(function () {
    switchNagadEdit(!(ui.editNagad.text() != "开始编辑"))
})

function switchNagadEdit(isEdit) {
    ui.editNagad.setText(isEdit ? "结束编辑" : "开始编辑")
    for (let i = 0; i < nagadItems.length; i++) {
        ui.nagadContainer.getChildAt(i).account.setVisibility(isEdit ? VISIBLE : GONE)
        if (!isEdit && i == 0) {
            ui.nagadContainer.getChildAt(i).account.hideInput()
        }
        ui.nagadContainer.getChildAt(i).accountTxt.setVisibility(isEdit ? GONE : VISIBLE)
        ui.nagadContainer.getChildAt(i).pin.setVisibility(isEdit ? VISIBLE : GONE)
        ui.nagadContainer.getChildAt(i).pinTxt.setVisibility(isEdit ? GONE : VISIBLE)
    }
}

ui.saveNagad.click(function () {
    for (let i = 0; i < nagadItems.length; i++) {
        nagadItems[i].isLock = ui.nagadContainer.getChildAt(i).lock.checked
        nagadItems[i].launchFailCount = 0
        nagadItems[i].account = ui.nagadContainer.getChildAt(i).account.text()
        ui.nagadContainer.getChildAt(i).accountTxt.setText(nagadItems[i].account)
        nagadItems[i].pin = ui.nagadContainer.getChildAt(i).pin.text()
        ui.nagadContainer.getChildAt(i).pinTxt.setText(nagadItems[i].pin)
    }
    switchNagadEdit(false)
    storage.put("nagadItems", nagadItems)
    toast('Nagad信息已保存!')
})

ui.editbKash.click(function () {
    switchbKashEdit(!(ui.editbKash.text() != "开始编辑"))
})

function switchbKashEdit(isEdit) {
    ui.editbKash.setText(isEdit ? "结束编辑" : "开始编辑")
    for (let i = 0; i < bkashItems.length; i++) {
        ui.bkashContainer.getChildAt(i).account.setVisibility(isEdit ? VISIBLE : GONE)
        if (!isEdit && i == 0) {
            ui.bkashContainer.getChildAt(i).account.hideInput()
        }
        ui.bkashContainer.getChildAt(i).accountTxt.setVisibility(isEdit ? GONE : VISIBLE)
        ui.bkashContainer.getChildAt(i).pin.setVisibility(isEdit ? VISIBLE : GONE)
        ui.bkashContainer.getChildAt(i).pinTxt.setVisibility(isEdit ? GONE : VISIBLE)
    }
}

ui.savebKash.click(function () {
    for (let i = 0; i < bkashItems.length; i++) {
        bkashItems[i].isLock = ui.bkashContainer.getChildAt(i).lock.checked
        bkashItems[i].launchFailCount = 0
        bkashItems[i].account = ui.bkashContainer.getChildAt(i).account.text()
        ui.bkashContainer.getChildAt(i).accountTxt.setText(bkashItems[i].account)
        bkashItems[i].pin = ui.bkashContainer.getChildAt(i).pin.text()
        ui.bkashContainer.getChildAt(i).pinTxt.setText(bkashItems[i].pin)
    }
    switchbKashEdit(false)
    storage.put("bkashItems", bkashItems)
    toast('bKash信息已保存!')
})

ui.addbKash.click(function () {
    ui.addbKashPanel.name.setText("")
    ui.addbKashPanel.account.setText("")
    ui.addbKashPanel.pin.setText("")
    ui.addbKashPanel.setVisibility(VISIBLE)
})

ui.addbKashPanel.cancel.click(function () {
    ui.addbKashPanel.account.hideInput()
    ui.addbKashPanel.setVisibility(GONE)
})

ui.addbKashPanel.confirm.click(function () {
    if (!ui.addbKashPanel.name.text()) {
        toast('应用名不能为空!')
        return
    }
    let p = {
        account: ui.addbKashPanel.account.text(),
        appName: ui.addbKashPanel.name.text(),
        packageName: "com.pengyou.cloneapp-" + ui.addbKashPanel.name.text(),
        pin: ui.addbKashPanel.pin.text(),
        lastId: "",
        pinErrorCount: 0,
        launchFailCount: 0,
        isLock: false,
        isClone: true,
    }
    bkashItems.push(p)
    addbKashItemView(p)
    storage.put("bkashItems", bkashItems)
    toast('已添加!')
    ui.addbKashPanel.account.hideInput()
    ui.addbKashPanel.setVisibility(GONE)
})

ui.start.click(function () {
    if (isTaskPausing) return

    if (isTaskRunning) {
        isTaskPausing = true
        ui.start.setText("任务暂停中...")
    } else {
        isTaskRunning = true
        ui.start.setText(isGoPayConnected ? "停止任务" : "连接中断，暂停中")
    }
})

events.observeKey()
events.onKeyDown("volume_down", function (event) {
    if (!isTaskPausing && isTaskRunning) {
        isTaskPausing = true
        ui.start.setText("任务暂停中...")
    }
})
events.on("exit", function () {
    log("exit 脚本结束")
    quit = true
    taskThread.interrupt()
    threads.shutDownAll()
})

function getPkgItems(name) {
    var items = []
    let pkgList = getPackageNameList(name)
    pkgList.forEach(p => {
        items.push({
            account: "",
            appName: getAppName(p),
            packageName: p,
            pin: "",
            lastId: "",
            pinErrorCount: 0,
            launchFailCount: 0,
            isLock: false,
            isClone: false,
        })
    })
    items.sort((a, b) => a.appName.localeCompare(b.appName))

    return items
}

var nagadItems = storage.get("nagadItems", getPkgItems("Nagad"))
nagadItems.forEach(p => {
    let itemView = ui.inflate(
        <vertical padding="18 8" marginBottom="2" h="auto">
            <horizontal>
                <text id="name" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                <checkbox id="lock" text="禁用" marginLeft="4" marginRight="6" />
            </horizontal>
            <horizontal>
                <text text="账号：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                <text id="accountTxt" text="" w="*" color="#666666" />
                <input id="account" inputType="number" text="" w="*" color="#666666" visibility="gone" />
            </horizontal>
            <horizontal>
                <text text="pin码：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                <text id="pinTxt" text="" w="*" color="#666666" />
                <input id="pin" inputType="number" text="" w="*" color="#666666" visibility="gone" />
            </horizontal>
        </vertical>
        , ui.nagadContainer)
    itemView.name.setText(p.appName)
    itemView.lock.checked = p.isLock == true
    itemView.account.setText(p.account)
    itemView.accountTxt.setText(p.account)
    itemView.pin.setText(p.pin)
    itemView.pinTxt.setText(p.pin)
    ui.nagadContainer.addView(itemView)
})
var bkashItems = storage.get("bkashItems", getPkgItems("bKash"))
bkashItems.forEach(p => {
    addbKashItemView(p)
})

function addbKashItemView(p) {
    let itemView = ui.inflate(
        <vertical padding="18 8" marginBottom="2" h="auto">
            <horizontal>
                <text id="name" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                <checkbox id="lock" text="禁用" marginLeft="4" marginRight="6" />
            </horizontal>
            <horizontal>
                <text text="账号：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                <text id="accountTxt" text="" w="*" color="#666666" />
                <input id="account" inputType="number" text="" w="*" color="#666666" visibility="gone" />
            </horizontal>
            <horizontal>
                <text text="pin码：" marginLeft="5" textColor="black" w="auto" textStyle="bold" marginRight="10" />
                <text id="pinTxt" text="" w="*" color="#666666" />
                <input id="pin" inputType="number" text="" w="*" color="#666666" visibility="gone" />
            </horizontal>
        </vertical>
        , ui.bkashContainer)
    itemView.name.setText(p.appName)
    itemView.lock.checked = p.isLock == true
    itemView.account.setText(p.account)
    itemView.accountTxt.setText(p.account)
    itemView.pin.setText(p.pin)
    itemView.pinTxt.setText(p.pin)
    ui.bkashContainer.addView(itemView)
}

function updateNagadLockStateIfNeeded(pkg, isError, isFail) {
    ui.run(function () {
        for (let i = 0; i < nagadItems.length; i++) {
            if (nagadItems[i].packageName == pkg) {
                if (isError) {
                    nagadItems[i].pinErrorCount = (nagadItems[i].pinErrorCount != undefined ? (nagadItems[i].pinErrorCount + 1) : 1)
                } else {
                    nagadItems[i].pinErrorCount = 0
                }
                if (isFail) {
                    nagadItems[i].launchFailCount = (nagadItems[i].launchFailCount != undefined ? (nagadItems[i].launchFailCount + 1) : 1)
                } else {
                    nagadItems[i].launchFailCount = 0
                }
                let isLock = (nagadItems[i].pinErrorCount >= 2 || nagadItems[i].launchFailCount >= 5)
                if (isLock) {
                    gopay.sendAccountState(nagadItems[i].account, "Nagad", nagadItems[i].pinErrorCount >= 2 ? "连续两次输入pin码错误" : "连续五次打开失败")
                    log("Nagad账号异常: %s %s, %d次连续输入pin码错误; %d次连续打开失败", nagadItems[i].appName, nagadItems[i].account, nagadItems[i].pinErrorCount, nagadItems[i].launchFailCount)
                }
                nagadItems[i].isLock = isLock
                storage.put("nagadItems", nagadItems)
                ui.nagadContainer.getChildAt(i).lock.checked = isLock
                break
            }
        }
    })
}

function updatebKashLockStateIfNeeded(pkg, isError, isFail) {
    ui.run(function () {
        for (let i = 0; i < bkashItems.length; i++) {
            if (bkashItems[i].packageName == pkg) {
                if (isError) {
                    bkashItems[i].pinErrorCount = (bkashItems[i].pinErrorCount != undefined ? (bkashItems[i].pinErrorCount + 1) : 1)
                } else {
                    bkashItems[i].pinErrorCount = 0
                }
                if (isFail) {
                    bkashItems[i].launchFailCount = (bkashItems[i].launchFailCount != undefined ? (bkashItems[i].launchFailCount + 1) : 1)
                } else {
                    bkashItems[i].launchFailCount = 0
                }
                let isLock = (bkashItems[i].pinErrorCount >= 2 || bkashItems[i].launchFailCount >= 5)
                if (isLock) {
                    gopay.sendAccountState(bkashItems[i].account, "bKash", bkashItems[i].pinErrorCount >= 2 ? "连续两次输入pin码错误" : "连续五次打开失败")
                    log("bKash账号异常: %s %s, %d次连续输入pin码错误; %d次连续打开失败", bkashItems[i].appName, bkashItems[i].account, bkashItems[i].pinErrorCount, bkashItems[i].launchFailCount)
                }
                bkashItems[i].isLock = isLock
                storage.put("bkashItems", bkashItems)
                ui.bkashContainer.getChildAt(i).lock.checked = isLock
                break
            }
        }

    })
}

let myPkg = "org.autojs.autoxjs.inrt"
let deviceId = device.getAndroidId()

log("脚本开始")

//setInterval(function () {
//    var configs = {
//        deviceId: deviceId,
//        isTaskRunning: isTaskRunning,
//        checkRecord: checkRecord,
//        nagads: nagadItems,
//        bKashs: bkashItems,
//    }
//    sendConfigs(configs)
//}, 5 * 60 * 1000);

function sendConfigs(configs) {
    threads.start(function () {
        log("上传脚本配置")
        var res = http.postJson("https://api.go-pay.live/api/walletConfig/check", configs)
        log("上传脚本配置 : 返回 " + res.statusCode)
    })
}

let taskThread = threads.start(doTask)

var transferCount = 0
var quit = false
var isTaskRunning = false
var isTaskPausing = false

function pauseIfNeeded() {
    if (isTaskPausing) {
        ui.run(function () {
            isTaskRunning = false
            isTaskPausing = false
            ui.start.setText("开始任务")
            toast("任务已暂停")
        })
        return true
    }

    return false
}

var isGoPayConnected = false

function checkGopayConnect() {
    let isConnected = true
    //    if (isTaskRunning) {
    //        try {
    //            var res = http.postJson("https://api.go-pay.live/api/time/check", {
    //                deviceId: deviceId,
    //                deviceTime: gopay.getDeviceTime()
    //            })
    //            if (res.statusCode == 200) {
    //                isConnected = res.body.json().data
    //                if (!isConnected) {
    //                    log("时间和IP检查不通过")
    //                }
    //            }
    //        } catch (error) {
    //        }
    //    }

    isConnected = isConnected && gopay.isConnected()
    if (isConnected != isGoPayConnected) {
        isGoPayConnected = isConnected
        if (isTaskRunning) {
            ui.run(function () {
                if (isTaskRunning) {
                    ui.start.setText(isConnected ? "停止任务" : "连接中断，暂停中")
                    toast(isConnected ? "已连接，继续执行" : "连接中断，暂停执行")
                }
            })
        }
    }

    return isConnected

}

function doTask() {
    while (!quit) {
        if (pauseIfNeeded() || !checkGopayConnect()) {
            sleep(500)
            continue
        }
        if (isTaskRunning) {
            if (auto.service) {
                if (checkRecord) {
                    if (transferCount >= 3) {
                        doGetRecordsTask()
                    } else {
                        let str = gopay.getOrder();
                        if (str) {
                            doTransferTask(str)
                        } else {
                            doGetRecordsTask()
                        }
                    }
                } else {
                    let str = gopay.getOrder();
                    if (str) {
                        doTransferTask(str)
                    }
                }
                sleep(500)
            } else {
                toast("请先开启无障碍服务！")
                sleep(5000)
            }
        } else {
            sleep(5000)
        }
    }
}

function doGetRecordsTask() {
    log("开始获取流水")
    transferCount = 0

    if (!auto.service) {
        log("无障碍服务未开启，获取流水结束")
        return
    }

    for (var i = 0; i < nagadItems.length; i++) {
        if (pauseIfNeeded() || quit || !checkRecord || !checkGopayConnect()) return
        if (nagadItems[i].account && nagadItems[i].pin && nagadItems[i].isLock != true) {
            log("开始获取流水 %s", nagadItems[i].appName)
            getNagadRecords(i)
        }
    }

    for (var i = 0; i < bkashItems.length; i++) {
        if (pauseIfNeeded() || quit || !checkRecord || !checkGopayConnect()) return
        if (bkashItems[i].account && bkashItems[i].pin && bkashItems[i].isLock != true) {
            log("开始获取流水 %s", bkashItems[i].appName)
            getbKashRecords(i)
        }
    }

    log("获取流水结束")
}

function getNagadRecords(i) {
    let receiveAccount = nagadItems[i].account
    let pin = nagadItems[i].pin
    let pkg = nagadItems[i].packageName
    let lastId = nagadItems[i].lastId
    log("开始获取流水 %s %s: %s, %s", nagadItems[i].appName, receiveAccount, pkg, lastId)
    var records = []
    var newLastId = ""

    if (nagadHome(pkg, receiveAccount, pin)) {
        let tranNode = id(getNagadPkgPrefix(pkg) + "bottom_nav_item_transactions").findOne(200)
        if (tranNode) {
            clickS(tranNode) && sleep(1000)
            let inNode = text("IN").findOne(1000)
            if (inNode) {
                //                clickS(inNode) && sleep(6000)
                swipeS(310, 850, 310, 1150, 800)
                sleep(10000)
                let lastNode = ''
                let next = true
                let prevId = ""
                let idSet = new Set()
                while (next) {
                    let nodesP = className("androidx.recyclerview.widget.RecyclerView").findOne(1000)
                    let startTime = +new Date()
                    while (!nodesP) {
                        if (+new Date() - startTime >= 6 * 1000) {
                            nagadFinishRecord(pkg, i, newLastId, records)
                            return
                        }
                        nodesP = className("androidx.recyclerview.widget.RecyclerView").findOne(1000)
                    }
                    log("获取到列表")
                    let nodes = nodesP.children()
                    if (!nodes) {
                        sleep(1000)
                        nodes = nodesP.children()
                        if (!nodes) {
                            nagadFinishRecord(pkg, i, newLastId, records)
                            return
                        }
                    }
                    log("获取到所有列表项")
                    let count = nodes.length
                    nodes.forEach((child, index) => {
                        if (!next || !child) return
                        var target = child.child(0)
                        if (target) {
                            log("获得列表一项0 target : %s", target.text())
                            if (!target.text()) {
                                log("target为空")
                                return
                            }
                            let timeNode = child.child(3)
                            if (timeNode && !timeNode.text().startsWith("Today") && !timeNode.text().startsWith("Yesterday")) {
                                log("首次查询到非当天或昨天结束")
                                next = false
                                return
                            }

                            let notReceive = false
                            if (target.text().startsWith("Send Money")) {
                                log("查询到代付记录结束")
                                next = false
                                return
                            }
                            if (target.text().startsWith("Transfer Money")) {
                                if (index == count - 1) {
                                    notReceive = true
                                } else {
                                    return
                                }
                            }
                            if (!notReceive) {
                                target = child.child(2)
                                if (target && target.text().startsWith("#")) {
                                    if (index == count - 1) {
                                        notReceive = true
                                    } else {
                                        return
                                    }
                                }
                            }

                            log("点击列表项")
                            clickS(child) && sleep(1000)
                            let tidNode = id(getNagadPkgPrefix(pkg) + "tx_ref_view").findOne(2000)
                            if (tidNode) {
                                let currId = tidNode.text()
                                log("tidNode : %s", currId)
                                lastNode = tidNode
                                if (notReceive) {
                                    let closeBtn = id(getNagadPkgPrefix(pkg) + "close_action_view").findOne(1000)
                                    if (closeBtn) clickS(closeBtn) && sleep(1500)
                                    return
                                }
                                if (!newLastId) {
                                    newLastId = currId
                                }
                                if (idSet.has(currId)) {
                                    let closeBtn = id(getNagadPkgPrefix(pkg) + "close_action_view").findOne(1000)
                                    if (closeBtn) clickS(closeBtn) && sleep(1500)
                                    return
                                } else {
                                    idSet.add(currId)
                                }

                                if (lastId == currId) {
                                    next = false
                                    let closeBtn = id(getNagadPkgPrefix(pkg) + "close_action_view").findOne(1000)
                                    if (closeBtn) clickS(closeBtn) && sleep(1500)
                                    return
                                } else {
                                    let accountNode = id(getNagadPkgPrefix(pkg) + "account_no_view").findOne(1000)
                                    let moneyNode = id(getNagadPkgPrefix(pkg) + "amount_view").findOne(1000)
                                    let timeNode = id(getNagadPkgPrefix(pkg) + "transfer_date_view").findOne(1000)
                                    if (accountNode && moneyNode && tidNode && timeNode) {
                                        records.push({
                                            accountType: "Nagad",
                                            receiveAccount: receiveAccount,
                                            payAccount: accountNode.text().replace("-", ""),
                                            amount: moneyNode.text().replace(" Tk.", ""),
                                            date: timeNode.text(),
                                            transactionId: tidNode.text(),
                                            type: 2
                                        })
                                    }

                                    let closeBtn = id(getNagadPkgPrefix(pkg) + "close_action_view").findOne(1000)
                                    if (closeBtn) clickS(closeBtn) && sleep(1500)
                                }
                            }
                        }
                    })

                    log("lastNode = %s, prevId = %s", lastNode, prevId)
                    if (!lastNode || (lastNode && lastNode.text() == prevId)) next = false // 连续两次获取的最后节点相同说明到底了
                    if (lastNode) prevId = lastNode.text()
                    if (next) {
                        let x1 = 300
                        let x2 = 300
                        let y1 = 400
                        let y2 = 800

                        let slp = random(1000, 2000)
                        swipeS(x2, y2, x1, y1, 600) && sleep(slp)
                        swipeS(x2, y2, x1, y1, 600) && sleep(slp)
                        swipeS(x2, y2, x1, y1, 600) && sleep(slp)
                        swipeS(x2, y2, x1, y1, 600) && sleep(slp)
                        log("滑动结束")
                        sleep(5000)
                    }
                }
            }
        }
    }

    nagadFinishRecord(pkg, i, newLastId, records)
}

function nagadFinishRecord(pkg, i, newLastId, records) {
    if (records.length != 0) {
        sendRecords(i, "Nagad", newLastId, records)
    }
    nagadReset(pkg)
}

function nagadReset(pkg) {
    let homeNode = id(getNagadPkgPrefix(pkg) + "bottom_nav_item_home").findOne(1000)
    if (homeNode) clickS(homeNode) && sleep(1000)
    launchPackage(myPkg)
    waitForText(myPkg + ':id/.*')
}

function getbKashRecords(i) {
    let receiveAccount = bkashItems[i].account
    let pin = bkashItems[i].pin
    let pkg = bkashItems[i].packageName
    let lastId = bkashItems[i].lastId
    log("开始获取流水 %s %s: %s, %s", bkashItems[i].appName, receiveAccount, pkg, lastId)
    var records = []

    if (bkashHome(pkg, receiveAccount, pin, bkashItems[i].appName, bkashItems[i].isClone)) {
        log('enter bKashAgentHome')
        let tranNode = text("Statements").findOne(600)
        if (tranNode) {
            clickS(tranNode) && sleep(1000)
            let inNode = textStartsWith('Transaction').findOne(1000)
            if (inNode) {
                log("enter transaction history")
                clickS(inNode) && sleep(10000)

                let next = true
                let curSize = -1
                let tempCurId = ""
                let idSet = new Set()
                text('In').clickable().findOne(600)
                log('filter type In')
                while (next) {
                    inNode = textStartsWith('Transaction').findOne(1000)
                    if (!inNode) {
                        bkashReset()
                        return
                    }
                    let icons = desc('transaction icon').find()
                    log("collect current visible item, length = " + icons.length)
                    if (icons.length == 0) {
                        bkashReset()
                        return
                    }
                    let tempIndex = 0
                    icons.forEach(iv => {
                        clickS(iv) && sleep(2000)
                        let closeNode = text('Close').findOne(600)
                        if (closeNode == null) {
                            log('closeNode' + closeNode)
                            return
                        }

                        let aNode = text('Amount').findOne(600)
                        let account = aNode.parent().child(1).child(0).text()
                        let amount = aNode.parent().child(3).child(0).text()
                        let time = text('Time').findOne(600).parent().child(3).child(0).text()
                        let transId = desc('Click to copy').findOne(600).parent().child(0).text()
                        log('transId:%s', transId)

                        if (lastId == transId) {
                            next = false
                            clickS(closeNode) && sleep(600)
                            return
                        }

                        if (idSet.has(transId)) {
                            clickS(closeNode) && sleep(600)
                            return
                        } else {
                            idSet.add(transId)
                        }

                        records.push({
                            accountType: "bKashAgent",
                            receiveAccount: receiveAccount,
                            payAccount: account,
                            amount: amount,
                            date: time,
                            transactionId: transId,
                            type: 2
                        })
                        clickS(closeNode) && sleep(600)
                    })

                    if (curSize == records.length) {
                        log('loop end')
                        next = false
                    } else {
                        curSize = records.length
                    }

                    if (next) {
                        let x1 = 300
                        let x2 = 300
                        let y1 = 100
                        let y2 = 1300

                        swipeS(x2, y2, x1, y1, 5000)
                    }
                }
            }
        }
    }

    if (records.length > 0) {
        sendRecords(i, "bKashAgent", records)
    }
    bkashReset()
}

function bkashReset() {
    let homeNode = text("Home").findOne(1000)
    if (homeNode) clickS(homeNode) && sleep(1000)
    launchPackage(myPkg)
    waitForText(myPkg + ':id/.*')
}

function sendRecords(i, walletType, records) {
    threads.start(function () {
        //在新线程执行的代码
        var res = http.postJson("https://api.go-pay.live/api/transaction/batchUpload", records)
        log(JSON.stringify(res))
        if (res.statusCode == 200) {
            if (walletType == "Nagad") {
                nagadItems[i].lastId = newLastId
                storage.put("nagadItems", nagadItems)
            } else {
                bkashItems[i].lastId = records[0].transactionId
                storage.put("bkashItems", bkashItems)
            }
        }
    })
}

function doTransferTask(str) {
    log("开始转账：%s", str)
    transferCount++
    let order = JSON.parse(str)
    //           order.receiveWalletNo = "01985694586"
    //           order.amount = "110"
    //    order.pin = "22580"
    //    order.walletNo = '01828954443'
    //    order.operationType = 1
    var transactionId = ""
    var result = 0
    var message = ""
    var balance = ""

    if (auto.service) {
        if (order.walletType == "Nagad") {
            for (var i = 0; i < nagadItems.length; i++) {
                log("开始转账 %s", nagadItems[i].appName)
                if (nagadItems[i].account == order.walletNo && nagadItems[i].isLock != true) {
                    execNagadSystemCallTransfer(order)
                    return
                }
            }
        } else {
            for (var i = 0; i < bkashItems.length; i++) {
                log("开始转账 %s", bkashItems[i].appName)
                if (bkashItems[i].account == order.walletNo && bkashItems[i].isLock != true) {
                    execBKashSystemCallTransfer(order)
                    return
                }
            }
        }
    } else {
        result = 2
        message = "辅助服务未开启"
    }

    gopay.sendOrderResult(order.walletNo, order.walletType, order.orderId, transactionId, order.operationType, result, message, balance)
    log("转账结束: %s, operationType = %d, result = %d, transactionId = %s, message = %s, balance=%s", order.orderId, order.operationType, result, transactionId, message, balance)
}

function execNagadSystemCallTransfer(order) {
    closeTips()
    // 转账和查询余额 才继续执行
    if (order.operationType != 1 && order.operationType != 3) {
        return
    }
    var result = 0
    var message = ""
    launchSysCall("tel:*167")
    //    launchPackage("com.android.contacts")
    sleep(2000)
    //    let btnStar = id("com.android.contacts:id/star").findOne(500)
    //    let btnTwo = id("com.android.contacts:id/two").findOne(500)
    //    let btnFour = id("com.android.contacts:id/four").findOne(500)
    //    let btnSeven = id("com.android.contacts:id/seven").findOne(500)
    let btnPound = id("com.android.contacts:id/pound").findOne(500)
    //
    //    clickS(btnStar) && sleep(500)
    //    clickS(btnTwo) && sleep(500)
    //    clickS(btnFour) && sleep(500)
    //    clickS(btnSeven) && sleep(500)
    clickS(btnPound) && sleep(500)

    let call = id("com.android.contacts:id/call_sim1").findOne(500)
    if (!call)
        call = id("com.android.contacts:id/single_call_button").findOne(500)
    if (call) {
        clickS(call) && sleep(4000)
    } else {
        result = 2
        message = "未找到拨号按钮！"
    }
    //输入类型 1 cash in 
    if (result == 0) {
        let dialog1_input = id("com.android.phone:id/input_field").findOne(500)
        let dialog1_button = id("android:id/button1").findOne(500)
        if (dialog1_input && dialog1_button) {
            if (order.operationType == 1)
                dialog1_input.setText("1")
            else
                dialog1_input.setText("4")
            clickS(dialog1_button) && sleep(4000)
        } else {
            result = 2
            message = "拨号失败或者拨号超时，Carrier info选择弹窗未找到！"
        }
    }

    if (order.operationType == 1) {
        // 转账的中间步骤
        if (result == 0) {
            let dialog2_input = id("com.android.phone:id/input_field").findOne(500)
            let dialog2_button = id("android:id/button1").findOne(500)
            if (dialog2_input && dialog2_button) {
                dialog2_input.setText(order.receiveWalletNo)
                clickS(dialog2_button) && sleep(4000)
            } else {
                result = 2
                message = "输入转入账号出错！"
            }
        }

        if (result == 0) {
            let dialog3_input = id("com.android.phone:id/input_field").findOne(500)
            let dialog3_button = id("android:id/button1").findOne(500)
            if (dialog3_input && dialog3_button) {
                dialog3_input.setText(order.amount)
                clickS(dialog3_button) && sleep(4000)
            } else {
                result == 2
                message = "输入转入金额出错！"
            }
        }
    } else {
        // 查询余额的中间步骤
        if (result == 0) {
            let dialog2_input = id("com.android.phone:id/input_field").findOne(500)
            let dialog2_button = id("android:id/button1").findOne(500)
            if (dialog2_input && dialog2_button) {
                dialog2_input.setText("1")
                clickS(dialog2_button) && sleep(4000)
            } else {
                result = 2
                message = "选择查询余额失败！"
            }
        }
    }

    if (result == 0) {
        let dialog4_input = id("com.android.phone:id/input_field").findOne(500)
        let dialog4_btton = id("android:id/button1").findOne(500)
        if (dialog4_input && dialog4_btton) {
            dialog4_input.setText(order.pin)
            clickS(dialog4_btton) && sleep(4000)
        } else {
            result = 2
            message = "输入pin码出错！"
        }
    }

    if (result == 0 && order.operationType == 3) {
        let message_tv = id("com.android.phone:id/ussd_message").findOne(500)
        let cancel_button = id("android:id/button2").findOne(500)
        if (message_tv && cancel_button) {
            result = 3
            message = message_tv.text()
            clickS(cancel_button)
        } else {
            result = 2
            message = "获取余额失败！"
        }
    }

    if (result == 0 && order.operationType == 1) {
        let findResult = id("com.android.phone:id/ussd_message").findOne(500)
        let cancel_button = id("android:id/button2").findOne(500)

        if (findResult && ok_button) {
            message = findResult.text()
            clickS(cancel_button) && sleep(2000)
        } else {
            result = 2
            message = "回执弹窗未找到！"
        }

    }
    closeTips()
    gopay.sendOrderResult(order.walletNo, order.walletType, order.orderId, "", order.operationType, result, message, "")

    launchPackage(myPkg)
    waitForText(myPkg + ':id/.*')
}


function execBKashSystemCallTransfer(order) {
    closeTips()
    // 转账和查询余额 才继续执行
    if (order.operationType != 1 && order.operationType != 3) {
        return
    }
    var result = 0
    var message = ""
    var balance = ""
    var transId = ""
    launchSysCall("tel:*247")
    //    launchPackage("com.android.contacts")
    sleep(2000)
    let btnPound = id("com.android.contacts:id/pound").findOne(500)
    clickS(btnPound) && sleep(1500)

    let inputNode = id("com.android.contacts:id/digits").findOne(500)
    if (inputNode && inputNode.text() == '')
        inputNode.setText('*247#')
    //    let btnStar = id("com.android.contacts:id/star").findOne(500)
    //    let btnTwo = id("com.android.contacts:id/two").findOne(500)
    //    let btnFour = id("com.android.contacts:id/four").findOne(500)
    //    let btnSeven = id("com.android.contacts:id/seven").findOne(500)
    //    let btnPound = id("com.android.contacts:id/pound").findOne(500)
    //
    //    clickS(btnStar) && sleep(500)
    //    clickS(btnTwo) && sleep(500)
    //    clickS(btnFour) && sleep(500)
    //    clickS(btnSeven) && sleep(500)
    //    clickS(btnPound) && sleep(500)

    let call = id("com.android.contacts:id/call_sim1").findOne(500)
    if (!call)
        call = id("com.android.contacts:id/single_call_button").findOne(500)
    if (call) {
        clickS(call) && sleep(4000)
    } else {
        result = 2
        message = "未找到拨号按钮！"
    }

    if (result == 0) {
        let dialog1_input = id("com.android.phone:id/input_field").findOne(500)
        let dialog1_button = id("android:id/button1").findOne(500)
        if (dialog1_input && dialog1_button) {
            if (order.operationType == 1)
                dialog1_input.setText("1")
            else
                dialog1_input.setText("4")
            clickS(dialog1_button) && sleep(4000)
        } else {
            result = 2
            message = "拨号失败或者拨号超时，Carrier info选择弹窗未找到！"
        }
    }

    if (order.operationType == 1) {
        // 转账的中间步骤
        if (result == 0) {
            let dialog2_input = id("com.android.phone:id/input_field").findOne(500)
            let dialog2_button = id("android:id/button1").findOne(500)
            if (dialog2_input && dialog2_button) {
                dialog2_input.setText(order.receiveWalletNo)
                clickS(dialog2_button) && sleep(4000)
            } else {
                result = 2
                message = "输入转入账号出错！"
            }
        }

        if (result == 0) {
            let dialog3_input = id("com.android.phone:id/input_field").findOne(500)
            let dialog3_button = id("android:id/button1").findOne(500)
            if (dialog3_input && dialog3_button) {
                dialog3_input.setText(order.amount)
                clickS(dialog3_button) && sleep(4000)
            } else {
                result == 2
                message = "输入转入金额出错！"
            }
        }
    } else {
        // 查询余额的中间步骤
        if (result == 0) {
            let dialog2_input = id("com.android.phone:id/input_field").findOne(500)
            let dialog2_button = id("android:id/button1").findOne(500)
            if (dialog2_input && dialog2_button) {
                dialog2_input.setText("1")
                clickS(dialog2_button) && sleep(4000)
            } else {
                result = 2
                message = "选择查询余额失败！"
            }
        }
    }

    if (result == 0) {
        let dialog4_input = id("com.android.phone:id/input_field").findOne(500)
        let dialog4_btton = id("android:id/button1").findOne(500)
        if (dialog4_input && dialog4_btton) {
            dialog4_input.setText(order.pin)
            clickS(dialog4_btton) && sleep(4000)
        } else {
            result = 2
            message = "输入pin码出错！"
        }
    }

    if (result == 0 && order.operationType == 3) {
        let message_tv = id("com.android.phone:id/ussd_message").findOne(500)
        let cancel_button = id("android:id/button2").findOne(500)
        if (message_tv && cancel_button) {
            result = 1
            message = message_tv.text()
            balance = message.substring(message.indexOf('Current balance ')).replace('Current balance ', '')
            balance = balance.substring(0, balance.indexOf('. '))
            message = ""
            clickS(cancel_button)
        } else {
            result = 2
            message = "获取余额失败！"
        }
    }

    if (result == 0 && order.operationType == 1) {
        let findResult = className('android.widget.TextView').visibleToUser(true).find()
        let ok_button = id("android:id/button1").findOne(500)

        if (findResult && ok_button) {
            if (findResult.length > 1) {
                if (result == 0) {
                    message = findResult[1].text()
                    if (message.includes('TrxID ')) {
                        transId = getTransId(message)
                        balance = getBalance(message)
                        result = 1
                        message = ""
                    } else {
                        result = 2
                        message = message.substring(0, 15)
                    }
                }
            }
            clickS(ok_button) && sleep(2000)
        } else {
            result = 2
            message = "回执弹窗未找到！"
        }

    }
    closeTips()
    gopay.sendOrderResult(order.walletNo, order.walletType, order.orderId, transId, order.operationType, result, message, balance)

    launchPackage(myPkg)
    waitForText(myPkg + ':id/.*')
}

function closeTips() {
    let ok_button = id("android:id/button1").findOne(500)
    if (ok_button) {
        clickS(ok_button)
    }
}

function getTransId(message) {
    var ss = message.substring(message.indexOf('TrxID ')).replace('TrxID ', '')
    return ss.substring(0, ss.indexOf(' '))
}

function getBalance(message) {
    var balance = message.substring(message.indexOf('Balance ')).replace('Balance ', '')
    return balance.substring(0, balance.indexOf('. '))
}

function nagadTransfer(i, order) {
    let pkg = nagadItems[i].packageName
    var transactionId = ""
    var result = 0
    var message = ""
    var balance = ""

    if (nagadHome(pkg, order.walletNo, order.pin)) {
        if (order.operationType == 1) { // 钱包转账
            let sendNode = id(getNagadPkgPrefix(pkg) + 'item_send_money').findOne(2000)
            if (sendNode) {
                clickS(sendNode) && sleep(600)
                let recipientNode = id(getNagadPkgPrefix(pkg) + 'recipient_number_input_view').findOne(200)
                if (recipientNode) {
                    recipientNode.setText(order.receiveWalletNo) && sleep(1000)
                    let nextNode = id(getNagadPkgPrefix(pkg) + 'next_screen_indicator_img_btn').clickable().findOne(200)
                    if (nextNode) {
                        clickS(nextNode) && sleep(1000)
                        let amountNode = id(getNagadPkgPrefix(pkg) + 'amount_input_view').findOne(200)
                        if (amountNode) {
                            amountNode.setText(order.amount) && sleep(5000)
                            let blcNode = id(getNagadPkgPrefix(pkg) + 'balance_tv').findOne(200)
                            if (blcNode) {
                                balance = blcNode.text()
                            }
                            let nextBtnNode = id(getNagadPkgPrefix(pkg) + 'next_btn').clickable().findOne(5000)
                            if (nextBtnNode) {
                                clickS(nextBtnNode) && sleep(1000)
                                let pinNode = id(getNagadPkgPrefix(pkg) + 'pin_input_view').findOne(6000)
                                if (pinNode) {
                                    clickS(pinNode) && sleep(600)
                                    var pss = order.pin.split("")
                                    for (let pnum of pss) {
                                        pinClick(pnum)
                                    }
                                    let next2Node = id(getNagadPkgPrefix(pkg) + 'next_btn_pin_fgmt').clickable().findOne(200)
                                    if (next2Node) {
                                        clickS(next2Node) && sleep(1000)
                                        let confirmNode = id(getNagadPkgPrefix(pkg) + 'confirmation_progress_fl').findOne(200)
                                        if (confirmNode) {
                                            pressS(confirmNode, 6000)
                                            let successNode = text('Send Money Successful').findOne(8000)
                                            if (successNode) {
                                                let tranNode = id(getNagadPkgPrefix(pkg) + 'row_tx_id_content_tv').findOne(200)
                                                transactionId = tranNode.text()
                                                result = 1

                                                let backNode = text('BACK TO HOME').clickable().findOne(200)
                                                if (backNode) {
                                                    clickS(backNode) && sleep(600)
                                                }
                                            } else {
                                                result = 0
                                                message = "确认付款结果超时"
                                            }
                                        } else {
                                            result = 2
                                            message = "确认pin码失败"
                                        }
                                    } else {
                                        result = 2
                                        message = "确认pin码失败"
                                    }
                                } else {
                                    result = 2
                                    message = "输入pin码失败"
                                }
                            } else {
                                result = 2
                                message = "确认金额失败"
                            }
                        } else {
                            result = 2
                            message = "输入金额失败"
                        }
                    } else {
                        result = 2
                        message = "输入收款账号失败"
                    }
                } else {
                    result = 2
                    message = "获取收款账号输入框失败"
                }
            } else {
                result = 2
                message = "点击转账失败"
            }
        } else if (order.operationType == 2) { // 银行转账
            let sendNode = id(getNagadPkgPrefix(pkg) + 'item_transfer_money').findOne(5000)
            if (sendNode) {
                clickS(sendNode) && sleep(5000)
                let cardNode = text('VISA DEBIT CARD').findOne(10000)
                if (cardNode) {
                    clickS(cardNode) && sleep(3000)
                    let recipientNode = id(getNagadPkgPrefix(pkg) + 'sdkCardNumber').findOne(15000)
                    if (recipientNode) {
                        recipientNode.setText(order.bankAccount.accountNo) && sleep(1000)
                        let nextNode = id(getNagadPkgPrefix(pkg) + 'sdkProceedButton').clickable().findOne(15000)
                        if (nextNode) {
                            clickS(nextNode) && sleep(2000)
                            let amountNode = id(getNagadPkgPrefix(pkg) + 'amount_input_view').findOne(10000)
                            if (amountNode) {
                                amountNode.setText(order.amount) && sleep(1000)
                                let blcNode = id(getNagadPkgPrefix(pkg) + 'balance_tv').findOne(200)
                                if (blcNode) {
                                    balance = blcNode.text()
                                }
                                let nextBtnNode = id(getNagadPkgPrefix(pkg) + 'progress_btn').clickable().findOne(15000)
                                if (nextBtnNode) {
                                    clickS(nextBtnNode) && sleep(3000)
                                    let pinNode = id(getNagadPkgPrefix(pkg) + 'pin_input_view').findOne(1000)
                                    if (pinNode) {
                                        clickS(pinNode) && sleep(600)
                                        var pss = order.pin.split("")
                                        for (let pnum of pss) {
                                            pinClick(pnum)
                                        }
                                        let next2Node = id(getNagadPkgPrefix(pkg) + 'progress_btn').clickable().findOne(2000)
                                        if (next2Node) {
                                            clickS(next2Node) && sleep(1000)
                                            let confirmNode = id(getNagadPkgPrefix(pkg) + 'confirmation_progress_fl').findOne(5000)
                                            if (confirmNode) {
                                                pressS(confirmNode, 6000)
                                                let successNode = text('Transfer Money Successful').findOne(15000)
                                                if (successNode) {
                                                    let tranNode = id(getNagadPkgPrefix(pkg) + 'row_tx_id_content_tv').findOne(200)
                                                    transactionId = tranNode.text()
                                                    result = 1

                                                    let backNode = text('BACK TO HOME').clickable().findOne(200)
                                                    if (backNode) {
                                                        clickS(backNode) && sleep(600)
                                                    }
                                                } else {
                                                    result = 0
                                                    message = "确认付款结果超时"
                                                }
                                            } else {
                                                result = 2
                                                message = "确认pin码失败"
                                            }
                                        } else {
                                            result = 2
                                            message = "确认pin码失败"
                                        }
                                    } else {
                                        result = 2
                                        message = "输入pin码失败"
                                    }
                                } else {
                                    result = 2
                                    message = "确认金额失败"
                                }
                            } else {
                                result = 2
                                message = "输入金额失败"
                            }
                        } else {
                            result = 2
                            message = "输入银行卡号失败"
                        }
                    } else {
                        result = 2
                        message = "输入银行卡号失败"
                    }
                } else {
                    result = 2
                    message = "点击银行卡失败"
                }
            } else {
                result = 2
                message = "点击转账失败"
            }
        } else if (order.operationType == 3) { // 查询余额
            let balanceNode = id(getNagadPkgPrefix(pkg) + 'balance_inquiry_text').findOne(200)
            if (balanceNode) {
                var tryCount = 0
                do {
                    clickS(balanceNode) && sleep(2000)
                    let bNode = id(getNagadPkgPrefix(pkg) + 'balance_inquiry_text').findOne(5000)
                    log("bNode = %s", bNode)
                    if (bNode) {
                        let bTxt = bNode.text()
                        if (bTxt && bTxt.indexOf("Tk") > 0) {
                            balance = bTxt
                            break
                        }
                    }
                    tryCount++
                } while (tryCount < 4)
                if (balance) {
                    result = 1
                } else {
                    result = 2
                    message = "获取余额失败"
                }
            } else {
                result = 2
                message = "点击获取余额失败"
            }
        } else {
            result = 2
            message = "未知操作"
        }
    } else {
        result = 2
        message = "打开首页失败"
    }

    gopay.sendOrderResult(order.walletNo, order.walletType, order.orderId, transactionId, order.operationType, result, message, balance)
    log("Nagad转账结束: %s, operationType = %d, result = %d, transactionId = %s, message = %s, balance=%s", order.orderId, order.operationType, result, transactionId, message, balance)

    launchPackage(myPkg)
    waitForText(myPkg + ':id/.*')
}

function bkashTransfer(i, order) {
    var transactionId = ""
    var result = 0
    var message = ""
    var balance = ""

    if (bkashHome(bkashItems[i].packageName, order.walletNo, order.pin, bkashItems[i].appName, bkashItems[i].isClone)) {
        if (order.operationType == 1) { // 钱包转账
            let sendNode = desc('Send Money').findOne(200)
            if (sendNode) {
                clickS(sendNode) && sleep(8000)
                let recipientNode = bounds(85, 355, 900, 487).clickable().findOne(2000)
                if (!recipientNode) recipientNode = bounds(162, 295, 1000, 427).clickable().findOne(500)
                if (!recipientNode) recipientNode = bounds(162, 277, 1000, 409).clickable().findOne(500)
                if (!recipientNode) recipientNode = bounds(166, 278, 998, 413).clickable().findOne(500)
                if (recipientNode) {
                    clickS(recipientNode) && sleep(600)
                    keyInput(order.receiveWalletNo)
                    sleep(1000)
                    let nextNode = bounds(900, 355, 1036, 487).clickable().findOne(200)
                    if (!nextNode) {
                        nextNode = desc('Tap to continue').findOne(1000)
                        if (!nextNode) {
                            nextNode = descStartsWith('0\n').findOne(1000)
                        }
                    }
                    if (nextNode) {
                        clickS(nextNode) && sleep(2000)
                        let correctNode = desc('Yes, the number is correct').findOne(1000)
                        if (correctNode) {
                            clickS(correctNode) && sleep(2000)
                        }
                        sleep(4000)
                        let amountNode = bounds(176, 614, 857, 826).clickable().findOne(5000)
                        if (!amountNode) amountNode = bounds(14, 669, 1066, 853).clickable().findOne(500)
                        if (!amountNode) amountNode = bounds(14, 651, 1066, 835).clickable().findOne(500)
                        if (!amountNode) amountNode = bounds(14, 661, 1066, 849).clickable().findOne(500)
                        if (amountNode) {
                            clickS(amountNode) && sleep(600)
                            keyNumInput(order.amount)
                            let blcNode = descContains("Available Balance").findOne(1000)
                            if (blcNode) {
                                let bNote = blcNode.desc()
                                if (bNote) {
                                    let strArr = bNote.split("\n")
                                    if (strArr.length > 5 && strArr[4].startsWith("Available Balance")) {
                                        balance = strArr[5]
                                    } else {
                                        let pbNode = blcNode.parent()
                                        if (pbNode) pbNode = pbNode.child(5)
                                        if (pbNode) {
                                            balance = pbNode.desc()
                                        }
                                    }
                                }
                            }
                            let recNode = descContains(order.receiveWalletNo).findOne(1000)
                            let amtNode = textStartsWith("৳").findOne(1000)
                            if (recNode && amtNode && amtNode.text() == ("৳" + order.amount)) {
                                let nextBtnNode = bounds(871, 614, 1036, 826).clickable().findOne(1000)
                                if (!nextBtnNode) {
                                    nextBtnNode = desc('Proceed').clickable().findOne(1000)
                                }
                                if (nextBtnNode) {
                                    clickS(nextBtnNode) && sleep(6000)
                                    let pinNode = bounds(193, 1030, 915, 1124).findOne(10000)
                                    if (!pinNode) pinNode = bounds(149, 1032, 932, 1084).findOne(1000)
                                    if (!pinNode) pinNode = bounds(149, 1014, 932, 1066).findOne(1000)
                                    if (!pinNode) pinNode = bounds(152, 1032, 928, 1086).findOne(1000)
                                    if (pinNode) {
                                        clickS(pinNode) && sleep(600)
                                        var pss = order.pin.split("")
                                        for (let pnum of pss) {
                                            pinClick(pnum)
                                        }
                                        let next2Node = bounds(915, 1030, 1036, 1124).clickable().findOne(2000)
                                        if (!next2Node) {
                                            next2Node = desc('Confirm PIN').clickable().findOne(1000)
                                        }
                                        if (next2Node) {
                                            clickS(next2Node) && sleep(1000)
                                            let confirmNode = desc('Tap and hold for Send Money').findOne(2000)
                                            if (confirmNode) {
                                                pressS(confirmNode, 6000)
                                                let successNode = descStartsWith('Your Send Money').findOne(10000)
                                                if (successNode && (successNode.desc() == 'Your Send Money is\nsuccessful'
                                                    || successNode.desc() == 'Your Send Money is successful'
                                                    || successNode.desc() == 'Your Send Money request\nis accepted for processing')) {
                                                    //                                                    let sp = successNode.parent()
                                                    //                                                    if (sp) {
                                                    //                                                        sp.children()
                                                    //                                                            .forEach(function(child){
                                                    //                                                                log(child);
                                                    //                                                            });
                                                    //                                                    }
                                                    if (!transactionId) {
                                                        let tmpNode = bounds(33, 815, 1047, 2100).findOne(200)
                                                        if (!tmpNode) tmpNode = bounds(0, 738, 1080, 2138).findOne(200)
                                                        if (!tmpNode) tmpNode = bounds(0, 720, 1080, 2146).findOne(200)
                                                        if (!tmpNode) tmpNode = bounds(0, 731, 1080, 2130).findOne(200)
                                                        if (tmpNode) {
                                                            tranNode = tmpNode.child(3)
                                                            if (tranNode) transactionId = tranNode.desc()
                                                        }
                                                    }
                                                    if (transactionId) {
                                                        transactionId = transactionId.replace(/[^\x00-\x7F]/g, "")
                                                    }
                                                    log("transactionId : %s", transactionId)
                                                    result = 1

                                                    let backNode = desc('Back to Home').clickable().findOne(200)
                                                    if (backNode) {
                                                        clickS(backNode) && sleep(600)
                                                    }
                                                } else {
                                                    result = 0
                                                    message = "确认付款结果超时"
                                                }
                                            } else {
                                                result = 2
                                                message = "确认pin码失败"
                                            }
                                        } else {
                                            result = 2
                                            message = "确认pin码失败"
                                        }
                                    } else {
                                        let errorNode = bounds(948, 105, 1080, 237).clickable().findOne(2000)
                                        if (!errorNode) errorNode = bounds(948, 87, 1080, 219).clickable().findOne(500)
                                        if (!errorNode) errorNode = bounds(945, 84, 1080, 219).clickable().findOne(500)
                                        if (errorNode && errorNode.className() == 'android.widget.Button') {
                                            clickS(errorNode) && sleep(2000)
                                        }
                                        result = 2
                                        message = "输入pin码失败"
                                    }
                                } else {
                                    result = 2
                                    message = "确认金额失败"
                                }
                            } else {
                                log("校验金额失败 %s : %s", order.amount, amtNode ? amtNode.text() : null)
                                result = 2
                                message = "校验金额失败"
                            }
                        } else {
                            result = 2
                            message = "输入金额失败"
                        }
                    } else {
                        result = 2
                        message = "输入收款账号失败"
                    }
                } else {
                    result = 2
                    message = "获取收款账号输入框失败"
                }
            } else {
                result = 2
                message = "点击转账失败"
            }
        } else if (order.operationType == 2) { // 银行转账
            let moreNode = desc('See More').findOne(2000)
            if (moreNode) {
                clickS(moreNode) && sleep(1000)
            }
            let sendNode = desc('bKash to Bank').findOne(200)
            if (sendNode) {
                clickS(sendNode) && sleep(2000)
                let bankNode = desc('Bank Account').findOne(5000)
                if (bankNode) {
                    clickS(bankNode) && sleep(6000)
                    let cbNode = desc('City Bank').findOne(5000)
                    if (cbNode) {
                        clickS(cbNode) && sleep(3000)
                        let accountNo = order.bankAccount.accountNo
                        let addAccountNode = desc('Add Bank Account').clickable().findOne(5000)
                        if (addAccountNode) {
                            clickS(addAccountNode) && sleep(3000)
                            let bankAccountNode = bounds(131, 633, 1014, 765).clickable().findOne(2000)
                            if (!bankAccountNode) bankAccountNode = bounds(131, 615, 1014, 747).clickable().findOne(500)
                            if (!bankAccountNode) bankAccountNode = bounds(134, 624, 1013, 759).clickable().findOne(500)
                            if (bankAccountNode) {
                                clickS(bankAccountNode) && sleep(600)
                                keyNumInput(accountNo)
                                let tmpNumNode = text(accountNo).findOne(1000)
                                let proceedNode = tmpNumNode && desc('Proceed').clickable().findOne(2000)
                                if (proceedNode) {
                                    clickS(proceedNode) && sleep(2000)
                                    let accountTitleNode = bounds(105, 694, 976, 826).clickable().findOne(8000)
                                    if (!accountTitleNode) accountTitleNode = bounds(61, 650, 1020, 782).clickable().findOne(500)
                                    if (!accountTitleNode) accountTitleNode = bounds(61, 632, 1020, 764).clickable().findOne(500)
                                    if (!accountTitleNode) accountTitleNode = bounds(62, 641, 1018, 776).clickable().findOne(500)
                                    if (accountTitleNode) {
                                        clickS(accountTitleNode) && sleep(600)
                                        keyInput(accountNo)
                                        sleep(1000)
                                        let tmpNameNode = text(accountNo).findOne(1000)
                                        let accountPinNode = tmpNameNode && bounds(182, 904, 915, 997).findOne(1000)
                                        if (!accountPinNode) accountPinNode = tmpNameNode && bounds(182, 886, 915, 979).findOne(500)
                                        if (!accountPinNode) accountPinNode = tmpNameNode && bounds(141, 877, 928, 931).findOne(500)
                                        if (!accountPinNode && tmpNameNode) {
                                            accountPinNode = tmpNameNode.parent()
                                            if (accountPinNode) accountPinNode = accountPinNode.child(6)
                                        }
                                        if (accountPinNode) {
                                            clickS(accountPinNode) && sleep(600)
                                            var pss = order.pin.split("")
                                            for (let pnum of pss) {
                                                pinClick(pnum)
                                            }
                                            let goNode = bounds(915, 904, 1036, 997).clickable().findOne(2000)
                                            if (!goNode) {
                                                goNode = desc('Confirm PIN').clickable().findOne(500)
                                            }
                                            if (goNode) {
                                                clickS(goNode) && sleep(1000)
                                                let sendMoneyNode = desc("Send money to Bank Account").findOne(8000)
                                                if (sendMoneyNode) {
                                                    clickS(sendMoneyNode) && sleep(3000)
                                                    let amountNode = bounds(285, 827, 857, 1039).clickable().findOne(10000)
                                                    if (!amountNode) amountNode = bounds(286, 827, 857, 1039).clickable().findOne(5000)
                                                    if (!amountNode) amountNode = bounds(288, 841, 813, 1025).clickable().findOne(500)
                                                    if (!amountNode) amountNode = bounds(288, 823, 813, 1007).clickable().findOne(500)
                                                    if (!amountNode) amountNode = bounds(295, 837, 807, 1025).clickable().findOne(500)
                                                    if (amountNode) {
                                                        clickS(amountNode) && sleep(600)
                                                        keyNumInput(order.amount)
                                                        sleep(2000)
                                                        let nextBtnNode = bounds(871, 827, 1036, 1039).clickable().findOne(1000)
                                                        if (!nextBtnNode) nextBtnNode = bounds(827, 841, 992, 1025).clickable().findOne(500)
                                                        if (!nextBtnNode) nextBtnNode = bounds(827, 823, 992, 1007).clickable().findOne(500)
                                                        if (!nextBtnNode) nextBtnNode = bounds(821, 837, 990, 1025).clickable().findOne(500)
                                                        if (nextBtnNode) {
                                                            clickS(nextBtnNode) && sleep(6000)
                                                            let pinNode = bounds(176, 984, 921, 1077).findOne(10000)
                                                            if (!pinNode) pinNode = bounds(138, 1043, 932, 1095).clickable().findOne(500)
                                                            if (!pinNode) pinNode = bounds(138, 1025, 932, 1077).clickable().findOne(500)
                                                            if (!pinNode) pinNode = bounds(141, 1043, 928, 1097).clickable().findOne(500)
                                                            if (pinNode) {
                                                                clickS(pinNode) && sleep(600)
                                                                var pss = order.pin.split("")
                                                                for (let pnum of pss) {
                                                                    pinClick(pnum)
                                                                }
                                                                let next2Node = bounds(921, 984, 1042, 1077).clickable().findOne(200)
                                                                if (!next2Node) {
                                                                    next2Node = desc('Confirm PIN').clickable().findOne(500)
                                                                }
                                                                if (next2Node) {
                                                                    clickS(next2Node) && sleep(1000)
                                                                    let confirmNode = desc('Tap and hold for bKash to Bank').findOne(2000)
                                                                    if (confirmNode) {
                                                                        pressS(confirmNode, 6000)
                                                                        let successNode = desc('Send money from\nbKash to Bank is Successful').findOne(10000)
                                                                        if (successNode) {
                                                                            var tranNode = bounds(595, 815, 917, 859).findOne(2000)
                                                                            log("tranNode0 : %s", tranNode)
                                                                            if (tranNode) transactionId = tranNode.desc()
                                                                            if (!transactionId) {
                                                                                let tmpNode = bounds(33, 721, 1047, 2100).findOne(200)
                                                                                if (!tmpNode) tmpNode = bounds(0, 727, 1080, 2138).findOne(200)
                                                                                if (!tmpNode) tmpNode = bounds(0, 709, 1080, 2146).findOne(200)
                                                                                if (!tmpNode) tmpNode = bounds(0, 720, 1080, 2130).findOne(200)
                                                                                if (tmpNode) {
                                                                                    tranNode = tmpNode.child(3)
                                                                                    if (tranNode) transactionId = tranNode.desc()
                                                                                }
                                                                            }
                                                                            if (transactionId) {
                                                                                transactionId = transactionId.replace(/[^\x00-\x7F]/g, "")
                                                                            }
                                                                            log("transactionId : %s", transactionId)
                                                                            result = 1

                                                                            let backNode = desc('Back to Home').clickable().findOne(200)
                                                                            if (backNode) {
                                                                                clickS(backNode) && sleep(600)
                                                                            }
                                                                        } else {
                                                                            result = 0
                                                                            message = "确认付款结果超时"
                                                                        }
                                                                    } else {
                                                                        result = 2
                                                                        message = "确认pin码失败"
                                                                    }
                                                                } else {
                                                                    result = 2
                                                                    message = "确认pin码失败"
                                                                }
                                                            } else {
                                                                result = 2
                                                                message = "输入pin码失败"
                                                            }
                                                        } else {
                                                            result = 2
                                                            message = "确认金额失败"
                                                        }
                                                    } else {
                                                        result = 2
                                                        message = "输入金额失败"
                                                    }
                                                } else {
                                                    result = 2
                                                    message = "点击转账失败"
                                                }
                                            } else {
                                                result = 2
                                                message = "添加账号输入pin码失败"
                                            }
                                        } else {
                                            result = 2
                                            message = "添加账号输入pin码失败"
                                        }
                                    } else {
                                        result = 2
                                        message = "点击添加账号名失败"
                                    }
                                } else {
                                    result = 2
                                    message = "点击添加账号失败"
                                }
                            } else {
                                result = 2
                                message = "点击添加账号失败"
                            }
                        } else {
                            let accountNode = descStartsWith(accountNo + '\n').findOne(5000)
                            if (accountNode) {
                                clickS(accountNode) && sleep(3000)
                                let amountNode = bounds(285, 827, 857, 1039).clickable().findOne(10000)
                                if (!amountNode) amountNode = bounds(286, 827, 857, 1039).clickable().findOne(5000)
                                if (!amountNode) amountNode = bounds(288, 841, 813, 1025).clickable().findOne(500)
                                if (!amountNode) amountNode = bounds(288, 823, 813, 1007).clickable().findOne(500)
                                if (!amountNode) amountNode = bounds(295, 837, 807, 1025).clickable().findOne(500)
                                if (amountNode) {
                                    clickS(amountNode) && sleep(600)
                                    keyNumInput(order.amount)
                                    sleep(2000)
                                    let nextBtnNode = bounds(871, 827, 1036, 1039).clickable().findOne(1000)
                                    if (!nextBtnNode) nextBtnNode = bounds(827, 841, 992, 1025).clickable().findOne(500)
                                    if (!nextBtnNode) nextBtnNode = bounds(827, 823, 992, 1007).clickable().findOne(500)
                                    if (!nextBtnNode) nextBtnNode = bounds(821, 837, 990, 1025).clickable().findOne(500)
                                    if (nextBtnNode) {
                                        clickS(nextBtnNode) && sleep(6000)
                                        let pinNode = bounds(176, 984, 921, 1077).findOne(10000)
                                        if (!pinNode) pinNode = bounds(138, 1043, 932, 1095).clickable().findOne(500)
                                        if (!pinNode) pinNode = bounds(138, 1025, 932, 1077).clickable().findOne(500)
                                        if (!pinNode) pinNode = bounds(141, 1043, 928, 1097).clickable().findOne(500)
                                        if (pinNode) {
                                            clickS(pinNode) && sleep(600)
                                            var pss = order.pin.split("")
                                            for (let pnum of pss) {
                                                pinClick(pnum)
                                            }
                                            let next2Node = bounds(921, 984, 1042, 1077).clickable().findOne(200)
                                            if (!next2Node) {
                                                next2Node = desc('Confirm PIN').clickable().findOne(500)
                                            }
                                            if (next2Node) {
                                                clickS(next2Node) && sleep(1000)
                                                let confirmNode = desc('Tap and hold for bKash to Bank').findOne(2000)
                                                if (confirmNode) {
                                                    pressS(confirmNode, 6000)
                                                    let successNode = desc('Send money from\nbKash to Bank is Successful').findOne(10000)
                                                    if (successNode) {
                                                        var tranNode = bounds(595, 815, 917, 859).findOne(2000)
                                                        log("tranNode0 : %s", tranNode)
                                                        if (tranNode) transactionId = tranNode.desc()
                                                        if (!transactionId) {
                                                            let tmpNode = bounds(33, 721, 1047, 2100).findOne(200)
                                                            if (!tmpNode) tmpNode = bounds(0, 727, 1080, 2138).findOne(200)
                                                            if (!tmpNode) tmpNode = bounds(0, 709, 1080, 2146).findOne(200)
                                                            if (!tmpNode) tmpNode = bounds(0, 720, 1080, 2130).findOne(200)
                                                            if (tmpNode) {
                                                                tranNode = tmpNode.child(3)
                                                                if (tranNode) transactionId = tranNode.desc()
                                                            }
                                                        }
                                                        if (transactionId) {
                                                            transactionId = transactionId.replace(/[^\x00-\x7F]/g, "")
                                                        }
                                                        log("transactionId : %s", transactionId)
                                                        result = 1

                                                        let backNode = desc('Back to Home').clickable().findOne(200)
                                                        if (backNode) {
                                                            clickS(backNode) && sleep(600)
                                                        }
                                                    } else {
                                                        result = 0
                                                        message = "确认付款结果超时"
                                                    }
                                                } else {
                                                    result = 2
                                                    message = "确认pin码失败"
                                                }
                                            } else {
                                                result = 2
                                                message = "确认pin码失败"
                                            }
                                        } else {
                                            result = 2
                                            message = "输入pin码失败"
                                        }
                                    } else {
                                        result = 2
                                        message = "确认金额失败"
                                    }
                                } else {
                                    result = 2
                                    message = "输入金额失败"
                                }
                            } else {
                                let addNode = desc('Add').clickable().findOne(1000)
                                if (addNode) {
                                    clickS(addNode) && sleep(3000)
                                    let bankAccountNode = bounds(131, 633, 1014, 765).clickable().findOne(2000)
                                    if (!bankAccountNode) bankAccountNode = bounds(131, 615, 1014, 747).clickable().findOne(500)
                                    if (!bankAccountNode) bankAccountNode = bounds(134, 624, 1013, 759).clickable().findOne(500)
                                    if (bankAccountNode) {
                                        clickS(bankAccountNode) && sleep(600)
                                        keyNumInput(accountNo)
                                        let tmpNumNode = text(accountNo).findOne(1000)
                                        let proceedNode = tmpNumNode && desc('Proceed').clickable().findOne(2000)
                                        if (proceedNode) {
                                            clickS(proceedNode) && sleep(2000)
                                            let accountTitleNode = bounds(105, 694, 976, 826).clickable().findOne(8000)
                                            if (!accountTitleNode) accountTitleNode = bounds(61, 650, 1020, 782).clickable().findOne(500)
                                            if (!accountTitleNode) accountTitleNode = bounds(61, 632, 1020, 764).clickable().findOne(500)
                                            if (!accountTitleNode) accountTitleNode = bounds(62, 641, 1018, 776).clickable().findOne(500)
                                            if (accountTitleNode) {
                                                clickS(accountTitleNode) && sleep(600)
                                                keyInput(accountNo)
                                                sleep(1000)
                                                let tmpNameNode = text(accountNo).findOne(1000)
                                                let accountPinNode = tmpNameNode && bounds(182, 904, 915, 997).findOne(1000)
                                                if (!accountPinNode) accountPinNode = tmpNameNode && bounds(182, 886, 915, 979).findOne(500)
                                                if (!accountPinNode) accountPinNode = tmpNameNode && bounds(141, 877, 928, 931).findOne(500)
                                                if (!accountPinNode && tmpNameNode) {
                                                    accountPinNode = tmpNameNode.parent()
                                                    if (accountPinNode) accountPinNode = accountPinNode.child(6)
                                                }
                                                if (accountPinNode) {
                                                    clickS(accountPinNode) && sleep(600)
                                                    var pss = order.pin.split("")
                                                    for (let pnum of pss) {
                                                        pinClick(pnum)
                                                    }
                                                    let goNode = bounds(915, 904, 1036, 997).clickable().findOne(2000)
                                                    if (!goNode) {
                                                        goNode = desc('Confirm PIN').clickable().findOne(500)
                                                    }
                                                    if (goNode) {
                                                        clickS(goNode) && sleep(1000)
                                                        let sendMoneyNode = desc("Send money to Bank Account").findOne(8000)
                                                        if (sendMoneyNode) {
                                                            clickS(sendMoneyNode) && sleep(3000)
                                                            let amountNode = bounds(285, 827, 857, 1039).clickable().findOne(10000)
                                                            if (!amountNode) amountNode = bounds(286, 827, 857, 1039).clickable().findOne(5000)
                                                            if (!amountNode) amountNode = bounds(288, 841, 813, 1025).clickable().findOne(500)
                                                            if (!amountNode) amountNode = bounds(288, 823, 813, 1007).clickable().findOne(500)
                                                            if (!amountNode) amountNode = bounds(295, 837, 807, 1025).clickable().findOne(500)
                                                            if (amountNode) {
                                                                clickS(amountNode) && sleep(600)
                                                                keyNumInput(order.amount)
                                                                sleep(2000)
                                                                let nextBtnNode = bounds(871, 827, 1036, 1039).clickable().findOne(1000)
                                                                if (!nextBtnNode) nextBtnNode = bounds(827, 841, 992, 1025).clickable().findOne(500)
                                                                if (!nextBtnNode) nextBtnNode = bounds(827, 823, 992, 1007).clickable().findOne(500)
                                                                if (!nextBtnNode) nextBtnNode = bounds(821, 837, 990, 1025).clickable().findOne(500)
                                                                if (nextBtnNode) {
                                                                    clickS(nextBtnNode) && sleep(6000)
                                                                    let pinNode = bounds(176, 984, 921, 1077).findOne(10000)
                                                                    if (!pinNode) pinNode = bounds(138, 1043, 932, 1095).clickable().findOne(500)
                                                                    if (!pinNode) pinNode = bounds(138, 1025, 932, 1077).clickable().findOne(500)
                                                                    if (!pinNode) pinNode = bounds(141, 1043, 928, 1097).clickable().findOne(500)
                                                                    if (pinNode) {
                                                                        clickS(pinNode) && sleep(600)
                                                                        var pss = order.pin.split("")
                                                                        for (let pnum of pss) {
                                                                            pinClick(pnum)
                                                                        }
                                                                        let next2Node = bounds(921, 984, 1042, 1077).clickable().findOne(200)
                                                                        if (!next2Node) {
                                                                            next2Node = desc('Confirm PIN').clickable().findOne(500)
                                                                        }
                                                                        if (next2Node) {
                                                                            clickS(next2Node) && sleep(1000)
                                                                            let confirmNode = desc('Tap and hold for bKash to Bank').findOne(2000)
                                                                            if (confirmNode) {
                                                                                pressS(confirmNode, 6000)
                                                                                let successNode = desc('Send money from\nbKash to Bank is Successful').findOne(10000)
                                                                                if (successNode) {
                                                                                    var tranNode = bounds(595, 815, 917, 859).findOne(2000)
                                                                                    log("tranNode0 : %s", tranNode)
                                                                                    if (tranNode) transactionId = tranNode.desc()
                                                                                    if (!transactionId) {
                                                                                        let tmpNode = bounds(33, 721, 1047, 2100).findOne(200)
                                                                                        if (!tmpNode) tmpNode = bounds(0, 727, 1080, 2138).findOne(200)
                                                                                        if (!tmpNode) tmpNode = bounds(0, 709, 1080, 2146).findOne(200)
                                                                                        if (!tmpNode) tmpNode = bounds(0, 720, 1080, 2130).findOne(200)
                                                                                        if (tmpNode) {
                                                                                            tranNode = tmpNode.child(3)
                                                                                            if (tranNode) transactionId = tranNode.desc()
                                                                                        }
                                                                                    }
                                                                                    if (transactionId) {
                                                                                        transactionId = transactionId.replace(/[^\x00-\x7F]/g, "")
                                                                                    }
                                                                                    log("transactionId : %s", transactionId)
                                                                                    result = 1

                                                                                    let backNode = desc('Back to Home').clickable().findOne(200)
                                                                                    if (backNode) {
                                                                                        clickS(backNode) && sleep(600)
                                                                                    }
                                                                                } else {
                                                                                    result = 0
                                                                                    message = "确认付款结果超时"
                                                                                }
                                                                            } else {
                                                                                result = 2
                                                                                message = "确认pin码失败"
                                                                            }
                                                                        } else {
                                                                            result = 2
                                                                            message = "确认pin码失败"
                                                                        }
                                                                    } else {
                                                                        result = 2
                                                                        message = "输入pin码失败"
                                                                    }
                                                                } else {
                                                                    result = 2
                                                                    message = "确认金额失败"
                                                                }
                                                            } else {
                                                                result = 2
                                                                message = "输入金额失败"
                                                            }
                                                        } else {
                                                            result = 2
                                                            message = "点击转账失败"
                                                        }
                                                    } else {
                                                        result = 2
                                                        message = "添加账号输入pin码失败"
                                                    }
                                                } else {
                                                    result = 2
                                                    message = "添加账号输入pin码失败"
                                                }
                                            } else {
                                                result = 2
                                                message = "点击添加账号名失败"
                                            }
                                        } else {
                                            result = 2
                                            message = "点击添加账号失败"
                                        }
                                    } else {
                                        result = 2
                                        message = "点击添加账号失败"
                                    }
                                } else {
                                    result = 2
                                    message = "没找到相应银行账号"
                                }
                            }
                        }
                    } else {
                        result = 2
                        message = "点击银行账号失败"
                    }
                } else {
                    result = 2
                    message = "点击银行账号失败"
                }
            } else {
                result = 2
                message = "点击转账失败"
            }
        } else if (order.operationType == 3) { // 查询余额
            result = 2
            message = "点击获取余额失败"
            let cashNode = desc('Cash Out').findOne(200)
            if (cashNode) {
                clickS(cashNode) && sleep(1000)
                let atmNode = desc("ATM\nTab 2 of 2").findOne(10000)
                if (atmNode) {
                    clickS(atmNode) && sleep(3000)
                    let tranNode = descContains("Available Balance").findOne(10000)
                    if (tranNode) {
                        let note = tranNode.desc()
                        if (note) {
                            let strArr = note.split("\n")
                            if (strArr.length > 3 && strArr[2].startsWith("Available Balance")) {
                                balance = strArr[3]
                            } else {
                                let bNode = descStartsWith('৳').findOne(1000)
                                if (bNode) {
                                    balance = bNode.desc()
                                }
                            }
                        }
                        if (balance) {
                            result = 1
                            message = ""
                        }
                    }
                }
                let backBtn = desc('Back').clickable().findOne(5000)
                log("backBtn : %s", backBtn)
                if (backBtn) {
                    clickS(backBtn) && sleep(500)
                }
            }
        } else {
            result = 2
            message = "未知操作"
        }
    } else {
        result = 2
        message = "打开首页失败"
    }

    gopay.sendOrderResult(order.walletNo, order.walletType, order.orderId, transactionId, order.operationType, result, message, balance)
    log("bKash转账结束: %s, operationType = %d, result = %d, transactionId = %s, message = %s, balance=%s", order.orderId, order.operationType, result, transactionId, message, balance)

    launchPackage(myPkg)
    waitForText(myPkg + ':id/.*')
}

function getNagadPkgPrefix(pkg) {
    return pkg.startsWith("com.konasl") ? (pkg + ":id/") : "com.konasl.nagad:id/"
}

function bKashAgentId(id) {
    return "com.bkash.businessapp:id/" + id
}

function findBKashAgentNode(idStr, delay) {
    return id(bKashAgentId(idStr)).findOne(delay)
}

function nagadHome(pkg, mobile, pin) {
    try {
        let isIndex = true
        let isError = false
        if (!packageName(pkg).findOne(1000)) {
            log('launchPackage %s', pkg)
            launchPackage(pkg)
            waitForText(getNagadPkgPrefix(pkg) + '.*')
        }
        sleep(3000)
        let startTime = +new Date()
        let balanceTxt = text('Tap for Balance').findOne(1000)
        while (!balanceTxt) {
            if (+new Date() - startTime >= 60 * 1000) {
                isIndex = false
                break
            }
            log('未找到app首页')

            let backNode = text('BACK TO HOME').clickable().findOne(200)
            if (backNode) {
                clickS(backNode) && sleep(600)
            }

            let closeBtn = id(getNagadPkgPrefix(pkg) + "close_action_view").findOne(200)
            if (closeBtn) clickS(closeBtn) && sleep(600)

            let noBtn = text('NO').findOne(1000)
            if (noBtn) {
                clickS(noBtn) && sleep(1000)
            }

            let okBtn = text('OK').findOne(1000)  //text("OK")
            if (okBtn) clickS(okBtn) && sleep(1000)

            let loginBtn = text('LOGIN').findOne(1000)
            if (loginBtn) {
                let mobileNode = id(getNagadPkgPrefix(pkg) + 'mobile_no_tv').findOne(1200)
                if (mobileNode) {
                    if (mobileNode.text().replace('-', '') != mobile) {
                        log('账号不一致，%s != %s', mobileNode.text().replace('-', ''), mobile)
                        isIndex = false
                        break
                    }
                    let pinNode = id(getNagadPkgPrefix(pkg) + 'pin_input_view').findOne(200)
                    if (pinNode) {
                        clickS(pinNode) && sleep(600)
                        var pss = pin.split("")
                        for (let pnum of pss) {
                            pinClick(pnum)
                        }
                    }
                    sleep(600)
                    clickS(loginBtn)
                    sleep(5000)
                }
            }

            let incorrectNode = text('Wrong PIN. Please check and try again.').findOne(2000)
            if (incorrectNode) {
                isError = true
                sleep(1000)
                isIndex = false
                break
            }

            balanceTxt = text('Tap for Balance').findOne(1000)
            if (!balanceTxt) {
                let navBtn = desc('Navigate up').findOne(1000)
                if (navBtn) {
                    clickS(navBtn) && sleep(1000)
                } else {
                    let homeBtn = id(getNagadPkgPrefix(pkg) + "bottom_nav_item_home").findOne(1000)
                    if (homeBtn) {
                        clickS(homeBtn) && sleep(1000)
                    }
                }
            }
        }

        updateNagadLockStateIfNeeded(pkg, isError, !isIndex)
        sleep(1000)
        return isIndex
    } catch (error) {
        log('[错误]nagadHome', error.message + '---->' + error.stack)
        return false
    }
}

function getbKashRealPkg(pkg, appName, isClone) {
    return isClone == true ? pkg.substring(0, pkg.length - appName.length - 1) : pkg
}

function bkashHome(pkg, mobile, pin, appName, isClone) {
    try {
        let isIndex = true
        let isError = false
        if (!packageName(getbKashRealPkg(pkg, appName, isClone)).findOne(1000)) {
            launchPackage(getbKashRealPkg(pkg, appName, isClone))
        }
        if (isClone == true) {
            isIndex = false
            if (text('Clone App').findOne(10000)) {
                let appNode = text(appName).findOne(1000)
                if (appNode) {
                    if (clickS(appNode)) {
                        isIndex = true
                        sleep(5000)
                    }
                }
            }

            if (!isIndex) {
                log('Clone App启动失败')
                updatebKashLockStateIfNeeded(pkg, isError, !isIndex)
                sleep(1000)
                return isIndex
            }
        }
        let startTime = +new Date()
        let balanceTxt = text('Tap for Balance').findOne(1000)
        while (!balanceTxt) {
            if (+new Date() - startTime >= 60 * 1000) {
                isIndex = false
                break
            }
            log('未找到app首页')
            let loginBtn = text('Log in').findOne(2000)
            if (!loginBtn) {

            }
            log("loginBtn : %s", loginBtn)
            if (loginBtn) {
                let mobileNode = id(bKashAgentId('tvEntryAccountNumber')).findOne(600)
                log("mobileNode : %s", mobileNode.text())

                if (mobileNode) {
                    mobileNode.setText(mobile)
                    if (mobileNode && mobileNode.text() != mobile) {
                        log('账号不一致，%s != %s', mobileNode.text(), mobile)
                        isIndex = false
                        break
                    }
                    log('账号一致，下一步输入pin')
                    var pss = pin.split('')
                    for (let pnum of pss) {
                        let pNode = id(bKashAgentId('pinpad_button_' + pnum)).findOne(600)
                        clickS(pNode) && sleep(600)
                    }
                    log('pin input complete, execute login')
                    clickS(loginBtn) && sleep(5000)

                    let incorrectNode = text('Incorrect PIN').findOne(1000)
                    if (!incorrectNode) {
                        incorrectNode = text('Attention! One more incorrect attempt will lock your PIN').findOne(1000)
                    }
                    if (incorrectNode) {
                        isError = true
                        sleep(1000)
                        isIndex = false
                    }
                }
            }

            balanceTxt = text('Tap for Balance').findOne(1000)
            if (!balanceTxt) {
                let homeNode = text("Home").findOne(1000)
                if (homeNode) {
                    clickS(homeNode) && sleep(1000)
                }
            }
        }

        updatebKashLockStateIfNeeded(pkg, isError, !isIndex)
        sleep(1000)
        return isIndex
    } catch (error) {
        log('[错误]bkashHome', error.message + '---->' + error.stack)
        return false
    }
}

function pinClick(num) {
    x = 0 // 0~1080
    y = 0 //2270,160
    var heightSingle = 180
    let width = random(-1, 1)
    let height = random(-1, 1)
    if (num == '-1') {
        for (var i = 0; i < 10; i++) {
            x = 1080 / 6 + width
            y = 2270 - 94 + height
            click(x, y) && sleep(200)
        }
        return ~sleep(500)
    }
    if (num * 1 == 1 || num * 1 == 4 || num * 1 == 7) {
        x = 1080 / 6 + width
    } else if (num * 1 == 2 || num * 1 == 5 || num * 1 == 8 || num * 1 == 0) {
        x = 1080 / 6 + 1080 / 3 + width
    } else if (num * 1 == 3 || num * 1 == 6 || num * 1 == 9) {
        x = 1080 / 6 + 1080 / 3 + 1080 / 3 + width
    }

    if (num * 1 == 1 || num * 1 == 2 || num * 1 == 3) {
        y = 2270 - heightSingle * 3 - heightSingle / 2 + height
    } else if (num * 1 == 4 || num * 1 == 5 || num * 1 == 6) {
        y = 2270 - heightSingle * 2 - heightSingle / 2 + height
    } else if (num * 1 == 7 || num * 1 == 8 || num * 1 == 9) {
        y = 2270 - heightSingle - heightSingle / 2 + height
    } else if (num * 1 == 0) {
        y = 2270 - heightSingle / 2 + height
    }
    let time = random(500, 600)
    click(x, y) && sleep(time)
}

function keyInput(num) {
    //    click(85, 2185) && sleep(random(200, 300))

    let pss = num.split("")
    for (let p of pss) {
        if (p == "0") {
            click(1020, 1655) && sleep(random(200, 300))
        } else if (p == "1") {
            click(65, 1655) && sleep(random(200, 300))
        } else if (p == "2") {
            click(160, 1655) && sleep(random(200, 300))
        } else if (p == "3") {
            click(265, 1655) && sleep(random(200, 300))
        } else if (p == "4") {
            click(375, 1655) && sleep(random(200, 300))
        } else if (p == "5") {
            click(480, 1655) && sleep(random(200, 300))
        } else if (p == "6") {
            click(585, 1655) && sleep(random(200, 300))
        } else if (p == "7") {
            click(690, 1655) && sleep(random(200, 300))
        } else if (p == "8") {
            click(805, 1655) && sleep(random(200, 300))
        } else if (p == "9") {
            click(910, 1655) && sleep(random(200, 300))
        }
    }
}

function keyNumInput(num) {
    let pss = num.split("")
    for (let p of pss) {
        if (p == "0") {
            click(400, 2190) && sleep(random(200, 300))
        } else if (p == "1") {
            click(130, 1775) && sleep(random(200, 300))
        } else if (p == "2") {
            click(405, 1775) && sleep(random(200, 300))
        } else if (p == "3") {
            click(670, 1775) && sleep(random(200, 300))
        } else if (p == "4") {
            click(130, 1915) && sleep(random(200, 300))
        } else if (p == "5") {
            click(405, 1915) && sleep(random(200, 300))
        } else if (p == "6") {
            click(670, 1915) && sleep(random(200, 300))
        } else if (p == "7") {
            click(130, 2045) && sleep(random(200, 300))
        } else if (p == "8") {
            click(405, 2045) && sleep(random(200, 300))
        } else if (p == "9") {
            click(670, 2045) && sleep(random(200, 300))
        }
    }
}

// common util functions
//
function findText(re, mode) {
    let classOf = o => Object.prototype.toString.call(o).slice(8, -1)
    let findResult, firstNode
    let finalResult = new Array()

    if (/.*:id\/.*/.test(re)) {
        findResult = idMatches(re).visibleToUser(true).boundsInside(0, 0, device.width, device.height).find()
        if (!findResult.empty()) {
            firstNode = findResult[0]
            if (mode === true && clickS(firstNode)) return firstNode
            else if (mode === 1) finalResult = findResult
            else return findResult[0]
        }
    } else {
        findResult = classOf(re) == 'RegExp' ? textMatches(re).visibleToUser(true).boundsInside(0, 0, device.width, device.height).find() : text(re).visibleToUser(true).boundsInside(0, 0, device.width, device.height).find()
        if (!findResult.empty()) {
            firstNode = findResult[0]
            if (mode === true && clickS(firstNode)) return firstNode
            else if (mode === 1) finalResult = findResult
            else return findResult[0]
        } else {
            findResult = classOf(re) == 'RegExp' ? descMatches(re).visibleToUser(true).find() : desc(re).visibleToUser(true).find()
            if (!findResult.empty()) {
                firstNode = findResult[0]
                if (mode === true && clickS(firstNode)) return firstNode
                else if (mode === 1) finalResult = findResult
                else return findResult[0]
            }
        }
    }
    return finalResult.length >= 1 ? finalResult : null
}

function findNode(node, mode) {
    let classOf = o => Object.prototype.toString.call(o).slice(8, -1)
    if (classOf(node) != 'JavaObject') return null
    let finalResult = new Array()
    let leftX = node.bounds().left
    let rightX = node.bounds().right
    let topY = node.bounds().top
    let bottomY = node.bounds().bottom

    let allNodeArr = bounds(leftX, topY, rightX, bottomY).visibleToUser(true).find()
    if (!allNodeArr) return null;
    for (let item of allNodeArr) {
        if (!checkNode(item)) continue;
        if (mode === true && clickS(item)) return item
        else if (mode === 1) finalResult.push(item)
        else return item
    }
    return finalResult.length >= 1 ? finalResult : null
}

function findEditText(index) {
    let findResult = new Array()
    findResult = className('android.widget.EditText').visibleToUser(true).find()
    if (!findResult.empty()) {
        if (index === true) {
            return findResult
        } else {
            if (index < 0) {
                findResult.reverse()
                index = Math.abs(index)
            }
            if (index <= findResult.length) return findResult[index - 1]
        }
    }
}

function editTextInput(index, content) {
    if (typeof (index) == "string" && content == undefined) {
        content = index
        index = 1
    }
    let findResult = findEditText(index)
    if (!findResult) return false;
    if (findResult.setText(content)) return ~sleep(300)
    clickS(findResult)
    Text(content)
    sleep(300)
    return true
}

function waitForText(reStr, timeout, isClick) {
    let _timeout = timeout || 10
    let _isClick = isClick || false
    for (let i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] == "number") _timeout = arguments[i]
        if (typeof arguments[i] == "boolean") _isClick = arguments[i]
    }
    let startTime = +new Date()
    while (+new Date() - startTime < _timeout * 1000 && ~sleep(400)) {
        let findResult = findText(reStr, _isClick)
        if (findResult) return findResult
    }
}

function clickS(aim) {
    try {
        let num = arguments.length
        if (num == 0) return false
        if (num == 2) { // 坐标
            let x = arguments[0]
            let y = arguments[1]
            if (typeof (x) != 'number' || typeof (y) != 'number') return false;
            x += random(-5, 5)
            y += random(-5, 5)
            if (click(x, y)) return ~sleep(400)
        }
        if (num == 1) { // 节点
            let node = arguments[0]
            if (typeof (node) != "object") return false
            if (node.clickable()) return node.click() && ~sleep(400)
            let x = node.bounds().centerX()
            let y = node.bounds().centerY()
            x += random(-5, 5)
            y += random(-5, 5)
            return click(x, y) && ~sleep(400)
        }
    } catch (error) {
        log('[错误]点击', error.message + '\n\r' + error.stack)
    }
}

function pressS(aim) {
    try {
        let num = arguments.length
        if (num == 1) return false
        if (num == 3) { // 坐标
            let x = arguments[0]
            let y = arguments[1]
            if (typeof (x) != 'number' || typeof (y) != 'number') return false
            x += random(-5, 5)
            y += random(-5, 5)
            return press(x, y, arguments[2])
        }
        if (num == 2) { // 节点
            let node = arguments[0]
            if (typeof (node) != "object") return false
            let x = node.bounds().centerX();
            let y = node.bounds().centerY();
            x += random(-5, 5)
            y += random(-5, 5)
            return press(x, y, arguments[1])
        }
    } catch (error) {
        log('[错误]长按', error.message + '\n\r' + error.stack)
    }
}

function swipeS(x1, y1, x2, y2, duration) {
    try {
        if (typeof (x1) != 'number' || typeof (x2) != 'number' || typeof (y1) != 'number' || typeof (y2) != 'number') {
            return false
        }
        if (typeof (duration) != 'number') duration = 600
        return swipe(x1, y1, x2, y2, duration)
    } catch (error) {
        log('[错误]滑动', error.message + '\n\r' + error.stack)
    }
}