var YK=window.YK = {};
(function (YK) {
    class DispatchEventNode {
        constructor() {
            this.eventDataPools = new Array();
            this.eventDic = {};
        }
        createEventData(cmd, data) {
            let ev;
            if (this.eventDataPools.length > 0) {
                ev = this.eventDataPools.pop();
                ev.cmd = cmd;
                ev.data = data;
                ev.isSotp = false;
            }
            else {
                ev = new EventData(cmd, data);
            }
            return ev;
        }
        returnEventData(ev) {
            ev.data = null;
            ev.cmd = null;
            ev.isSotp = false;
            this.eventDataPools.push(ev);
        }
        addEventListener(type, callBack, target, priority = 0, once = false) {
            type = type.toString();
            let info = {
                callBack: callBack,
                target: target,
                priority: priority,
                once: once
            };
            let array = this.eventDic[type];
            let has = false;
            let pos = 0;
            if (array != null) {
                array.forEach(element => {
                    if (element.target == target && element.callBack == callBack) {
                        has = true;
                    }
                    if (element.priority > info.priority) {
                        pos++;
                    }
                });
            }
            else {
                array = new Array();
                this.eventDic[type] = array;
            }
            if (has) {
                console.error("重复注册消息：type=" + type);
            }
            else {
                array.splice(pos, 0, info);
            }
        }
        removeEventListener(type, callBack, target) {
            type = type.toString();
            let info = null;
            let array = this.eventDic[type];
            if (array != null) {
                let infoIndex = -1;
                array.every((value, index, array) => {
                    if (value.target == target && value.callBack == callBack) {
                        infoIndex = index;
                        info = value;
                        return false;
                    }
                    return true;
                });
                if (infoIndex != -1) {
                    array.splice(infoIndex, 1);
                }
            }
        }
        hasEventListener(type, callBack, target) {
            let flag = false;
            let array = this.eventDic[type];
            if (array) {
                let index = array.findIndex((obj, index, any) => {
                    return obj.target == target && obj.callBack == callBack;
                });
                flag = index != -1;
            }
            return flag;
        }
        DispatchEvent(ev) {
            this._DispatchEvent(ev);
        }
        DispatchEventByType(type, data = null) {
            let ev = this.createEventData(type, data);
            this._DispatchEvent(ev);
            if (ev != null) {
                this.returnEventData(ev);
            }
        }
        _DispatchEvent(ev) {
            let array = this.eventDic[ev.cmd];
            if (array != null) {
                for (let i = 0; i < array.length; i++) {
                    let info = array[i];
                    if (info.callBack != null) {
                        info.callBack.call(info.target, ev);
                    }
                    if (info.once) {
                        array.splice(i--, 1);
                    }
                    if (ev.isSotp) {
                        break;
                    }
                }
            }
        }
    }
    YK.DispatchEventNode = DispatchEventNode;
    class EventData {
        constructor(cmd, obj) {
            this.isSotp = false;
            this.cmd = cmd;
            this.data = obj;
            this.isSotp = false;
        }
        Stop() {
            this.isSotp = true;
        }
    }
    YK.EventData = EventData;
    class Func {
        constructor(thisObj, callBack) {
            this.mThisObj = thisObj;
            this.mCallBack = callBack;
        }
        Invoke(...args) {
            this.mCallBack.call(this.mThisObj, ...args);
        }
    }
    YK.Func = Func;
})(YK || (YK = {}));
;
(function (YK) {
    class EventListenerMgr {
        constructor(dis = null) {
            this.mOwner = null;
            this.mListener = new Array();
            this.mOwner = dis;
        }
        addListener(type, callback, thisObj, _priority = 0, _dispatchOnce = false) {
            if (type == undefined) {
                console.error("没有指定消息类型");
            }
            if (this.mOwner.hasEventListener(type, callback, thisObj)) {
                console.warn("重复注册消息 消息id" + type);
            }
            else {
                let listener = EventListenerData.CreateEventListenerData(this.mOwner, callback, thisObj, type.toString(), _priority, _dispatchOnce);
                listener.AttachListener();
                this.mListener.push(listener);
            }
        }
        removeListener(callback, thisObj, type) {
            if (this.mOwner.hasEventListener(type, callback, thisObj)) {
                let listener = null;
                let index = this.mListener.findIndex((value, index, array) => {
                    if (value.thisObj == thisObj && value.callback == callback) {
                        listener = value;
                        return true;
                    }
                    return false;
                });
                if (index != -1) {
                    listener.DetachListener();
                    this.mListener.splice(index, 1);
                }
            }
        }
        removeAllListener() {
            this.mListener.forEach(listener => {
                listener.DetachListener();
            });
            this.mListener.splice(0, this.mListener.length);
        }
    }
    YK.EventListenerMgr = EventListenerMgr;
    class InterchangeableEventListenerMgr {
        constructor(thisObj, defCallback = null) {
            this.otherEvents = new Array();
            this.networkEvnets = new EventListenerMgr(YK.NetMgr.Instance);
            this.sceneEvents = new EventListenerMgr(YK.SceneMgr.Instance);
            this.uiEvents = new EventListenerMgr(YK.UIMgr.Instance);
            this.modeEvents = new EventListenerMgr(YK.ModeMgr.Instance);
            this.mDefObj = thisObj;
            this.otherEvents = new Array();
            this.mDefCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mNetCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mModeCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mSceneCallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
            this.mUICallback = new EventListenerData(YK.NetMgr.Instance, defCallback, thisObj, null);
        }
        setDegCallback(callback, priority = 0) {
            this.mDefCallback.callback = callback;
            this.mDefCallback.priority = priority;
            return this;
        }
        setNetCallback(callback, priority = 0) {
            this.mNetCallback.callback = callback;
            this.mNetCallback.priority = priority;
            return this;
        }
        setModeCallback(callback, priority = 0) {
            this.mModeCallback.callback = callback;
            this.mModeCallback.priority = priority;
            return this;
        }
        setSceneCallback(callback, priority = 0) {
            this.mSceneCallback.callback = callback;
            this.mSceneCallback.priority = priority;
            return this;
        }
        setUICallback(callback, priority = 0) {
            this.mUICallback.callback = callback;
            this.mSceneCallback.priority = priority;
            return this;
        }
        addListener(dis, type, callback = null, thisObj = null, _priority = 0, _dispatchOnce = false) {
            if (dis == YK.NetMgr.Instance)
                this.addNetEvent(type, callback, thisObj);
            else if (dis == YK.SceneMgr.Instance)
                this.addSceneEvent(type, callback, thisObj);
            else if (dis == YK.UIMgr.Instance)
                this.addUIEvent(type, callback, thisObj);
            else if (dis == YK.ModeMgr.Instance)
                this.addModeEvent(type, callback, thisObj);
            else {
                if (callback == null)
                    callback = this.mDefCallback.callback;
                if (thisObj == null)
                    thisObj = this.mDefCallback.thisObj;
                if (_priority == 0)
                    _priority = this.mDefCallback.priority;
                let x = this.otherEvents.findIndex((value, index, obj) => {
                    if (value.dis == dis && type == value.type
                        && callback != value.callback
                        && thisObj == value.thisObj) {
                        x = index;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (x != -1) {
                    let data = EventListenerData.CreateEventListenerData(dis, callback, this, type.toString(), _priority, _dispatchOnce);
                    data.AttachListener();
                    this.otherEvents.push(data);
                }
            }
        }
        removeListener(dis, type, callback = null, thisObj = null) {
            if (dis == YK.NetMgr.Instance)
                this.removeNetEvent(type, callback, thisObj);
            else if (dis == YK.SceneMgr.Instance)
                this.removeSceneEvent(type, callback, thisObj);
            else if (dis == YK.UIMgr.Instance)
                this.removeUIEvent(type, callback, thisObj);
            else if (dis == YK.ModeMgr.Instance)
                this.removeModeEvent(type, callback, thisObj);
            else {
                if (callback == null)
                    callback = this.mDefCallback.callback;
                if (thisObj == null)
                    thisObj = this.mDefCallback.callback;
                let x = this.otherEvents.findIndex((value, index, obj) => {
                    if (value.dis == dis && type == value.type
                        && callback != value.callback
                        && thisObj == value.thisObj) {
                        x = index;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (x != -1) {
                    this.otherEvents[x].DetachListener();
                    this.otherEvents.splice(x, 1);
                }
            }
        }
        addNetEvent(type, callback = null, thisObj = null, _priority = 0, _dispatchOnce = false) {
            if (callback == null) {
                callback = this.mNetCallback.callback;
                thisObj = this.mNetCallback.thisObj;
            }
            if (_priority == 0) {
                _priority = this.mNetCallback.priority;
            }
            this.networkEvnets.addListener(type, callback, thisObj, _priority, _dispatchOnce);
        }
        removeNetEvent(type, callback = null, thisObj = null) {
            if (callback == null) {
                callback = this.mNetCallback.callback;
                thisObj = this.mDefCallback.thisObj;
            }
            this.networkEvnets.removeListener(callback, thisObj, type);
        }
        addUIEvent(type, callback = null, thisObj = null, _priority = 0, _dispatchOnce = false) {
            if (callback == null) {
                callback = this.mUICallback.callback;
                thisObj = this.mUICallback.thisObj;
            }
            if (_priority == 0) {
                _priority = this.mUICallback.priority;
            }
            this.uiEvents.addListener(type, callback, thisObj, _priority, _dispatchOnce);
        }
        removeUIEvent(type, callback = null, thisObj = null) {
            if (callback == null) {
                callback = this.mUICallback.callback;
                thisObj = this.mUICallback.thisObj;
            }
            this.uiEvents.removeListener(callback, thisObj, type);
        }
        addSceneEvent(type, callback = null, thisObj = null, _priority = 0, _dispatchOnce = false) {
            if (callback == null) {
                callback = this.mSceneCallback.callback;
                thisObj = this.mSceneCallback.thisObj;
            }
            if (_priority == 0) {
                _priority = this.mUICallback.priority;
            }
            this.sceneEvents.addListener(type, callback, thisObj, _priority, _dispatchOnce);
        }
        removeSceneEvent(type, callback = null, thisObj = null) {
            if (callback == null) {
                callback = this.mSceneCallback.callback;
                thisObj = this.mSceneCallback.thisObj;
            }
            this.sceneEvents.removeListener(callback, thisObj, type);
        }
        addModeEvent(type, callback = null, thisObj = null, _priority = 0, _dispatchOnce = false) {
            if (callback == null) {
                callback = this.mModeCallback.callback;
                thisObj = this.mModeCallback.thisObj;
            }
            this.modeEvents.addListener(type, callback, thisObj);
        }
        removeModeEvent(type, callback = null, thisObj = null) {
            if (callback == null) {
                callback = this.mModeCallback.callback;
                thisObj = this.mModeCallback.thisObj;
            }
            this.modeEvents.removeListener(callback, thisObj, type);
        }
        RemoveAll() {
            if (this.networkEvnets != null)
                this.networkEvnets.removeAllListener();
            if (this.sceneEvents != null)
                this.sceneEvents.removeAllListener();
            if (this.uiEvents != null)
                this.uiEvents.removeAllListener();
            if (this.modeEvents != null)
                this.modeEvents.removeAllListener();
            this.otherEvents.forEach(element => {
                element.DetachListener();
            });
            this.otherEvents.splice(0, this.otherEvents.length);
        }
    }
    YK.InterchangeableEventListenerMgr = InterchangeableEventListenerMgr;
    class EventListenerData {
        constructor(dis, callback, thisObj, type, _priority = 0, _dispatchOnce = false) {
            this.dispatchOnce = false;
            this.dis = dis;
            this.thisObj = thisObj;
            this.type = type;
            this.callback = callback;
            this.priority = _priority;
            this.dispatchOnce = _dispatchOnce;
        }
        static CreateEventListenerData(dis, callback, thisObj, type, _priority = 0, _dispatchOnce = false) {
            let listener = null;
            if (this.mEventListenerData.length > 0) {
                listener = this.mEventListenerData.pop();
                listener.dis = dis;
                listener.callback = callback;
                listener.thisObj = thisObj;
                listener.type = type;
                listener;
            }
            else {
                listener = new EventListenerData(dis, callback, thisObj, type, _priority, _dispatchOnce);
            }
            return listener;
        }
        static ReturnEventListenerData(listener) {
            if (listener) {
                listener.dis.removeEventListener(listener.type, listener.callback, listener.thisObj);
                listener.dis = null;
                listener.callback = null;
                listener.thisObj = null;
                listener.type = null;
                this.mEventListenerData.push(listener);
            }
        }
        AttachListener() {
            if (this.dis.hasEventListener(this.type, this.callback, this.thisObj)) {
                this.DetachListener();
                return false;
            }
            this.dis.addEventListener(this.type, this.callback, this.thisObj, this.priority, this.dispatchOnce);
            return true;
        }
        DetachListener() {
            EventListenerData.ReturnEventListenerData(this);
        }
    }
    EventListenerData.mEventListenerData = new Array();
    YK.EventListenerData = EventListenerData;
})(YK || (YK = {}));
;
(function (YK) {
    class ModeMgr extends YK.DispatchEventNode {
        constructor() {
            super();
            this.mModes = new Map();
            this.mIsLoginSendingFlag = false;
            if (ModeMgr.mInstance == null)
                ModeMgr.mInstance = this;
            YK.TimeDelay.Instance.AddUpdate(this.update, this);
        }
        static get Instance() {
            if (this.mInstance == null)
                new ModeMgr();
            return this.mInstance;
        }
        AddMode(type) {
            if (!this.mModes.has(type)) {
                this.mModes.set(type, new type());
            }
            return this.mModes.get(type);
        }
        GetMode(type) {
            if (this.mModes.has(type))
                return this.mModes.get(type);
            else
                return null;
        }
        InitData(param = null) {
            this.mIsLoginSendingFlag = false;
            this.mModes.forEach((value, key, map) => {
                value.initMsgRespOk = false;
                value.OnInitData(param);
            });
        }
        SendInitMsg() {
            this.mIsLoginSendingFlag = true;
            this.mModes.forEach((value, key, map) => {
                value.OnSendInitMsg();
            });
        }
        ClearData() {
            this.mModes.forEach((value, key, map) => {
                value.OnClear();
            });
        }
        onDestroy() {
            this.mModes.forEach((value, key, map) => {
                value.OnDestroy();
            });
            this.ClearData();
        }
        update(dt) {
            if (this.mIsLoginSendingFlag) {
                let isOk = true;
                this.mModes.forEach((value, key, map) => {
                    if (!value.initMsgRespOk) {
                        isOk = false;
                    }
                });
                if (isOk) {
                    this.DispatchEventByType(ModeMgr.EventType.SENDINITMSGOK);
                    this.mIsLoginSendingFlag = false;
                }
            }
        }
    }
    ModeMgr.EventType = {
        SENDINITMSGOK: "SENDINITMSGOK"
    };
    YK.ModeMgr = ModeMgr;
    class IMode {
        constructor() {
            this.initMsgRespOk = false;
            this.eventMgr = new YK.InterchangeableEventListenerMgr(this, this.OnHandler);
            this.eventMgr.setNetCallback(this.OnHandler, 99);
            this.eventMgr.setModeCallback(this.OnHandler, 99);
        }
        OnSendInitMsg() {
            this.initMsgRespOk = true;
        }
        OnHandler(ev) {
        }
        OnDestroy() {
            this.eventMgr.RemoveAll();
        }
    }
    YK.IMode = IMode;
})(YK || (YK = {}));
;
(function (YK) {
    var Handler = Laya.Handler;
    class ResInfo {
        constructor() {
            this.isKeepMemory = false;
            this.isFGUIPack = false;
        }
        get fullUrl() {
            if (this.isFGUIPack) {
                return this.url.replace("." + fairygui.UIConfig.packageFileExtension, "");
            }
            return this.url;
        }
    }
    class LoadGruopInfo {
        constructor() {
            this.Progress = 0;
            this.needLoad = new Array();
        }
        add(url, type, isKeepMemory = false, isFGUIPack = false) {
            let index = this.needLoad.findIndex((value, index, obj) => {
                return value.url == url;
            });
            if (index == -1) {
                let info = new ResInfo();
                info.isKeepMemory = isKeepMemory;
                info.url = url;
                info.type = type;
                info.isFGUIPack = isFGUIPack;
                this.needLoad.push(info);
            }
            return this;
        }
        onCompletion(callback, thisObjs) {
            this.finish = new YK.Func(thisObjs, callback);
            return this;
        }
        onItemCompletion(callback, thisObjs) {
            this.loadItem = new YK.Func(thisObjs, callback);
            return this;
        }
        start() {
            ResMgr.Instance.LoadGroup(this);
        }
    }
    YK.LoadGruopInfo = LoadGruopInfo;
    class ResMgr extends YK.DispatchEventNode {
        constructor() {
            super();
            this.mOldRes = new Array();
            this.resDic = new Map();
            if (ResMgr.mInstance == null)
                ResMgr.mInstance = this;
        }
        static get Instance() {
            if (this.mInstance == null)
                new ResMgr();
            return this.mInstance;
        }
        GetRes(url) {
            return Laya.loader.getRes(url);
        }
        LoadGroup(loads) {
            let urls = new Array();
            loads.needLoad.forEach(element => {
                urls.push({ url: element.url, type: element.type });
            });
            Laya.loader.load(urls, Handler.create(this, (success) => {
                if (success) {
                    for (let index = 0; index < loads.needLoad.length; index++) {
                        let info = loads.needLoad[index];
                        if (info.isFGUIPack) {
                            fairygui.UIPackage.addPackage(info.fullUrl);
                        }
                        if (!this.resDic.has(info.url)) {
                            this.resDic.set(info.url, info);
                        }
                    }
                    if (loads.finish != null) {
                        loads.finish.Invoke();
                    }
                }
                else {
                    console.error("加载资源失败：");
                    console.log(urls);
                }
            }), Handler.create(this, (progress) => {
                loads.Progress = progress * 100;
                if (loads.loadItem != null) {
                    loads.loadItem.Invoke();
                }
            }));
        }
        pop(forced = false) {
            if (forced) {
                this.mOldRes.splice(0, this.mOldRes.length);
                this.resDic.forEach((v, key) => {
                    this.mOldRes.push(key);
                });
            }
            while (this.mOldRes.length > 0) {
                let url = this.mOldRes.pop();
                let info = this.resDic.get(url);
                if (info != null) {
                    if (info.isFGUIPack)
                        fairygui.UIPackage.removePackage(info.fullUrl);
                    this.resDic.delete(info.url);
                }
                Laya.loader.clearRes(url);
            }
            if (forced) {
                this.resDic.clear();
            }
            else {
            }
        }
        push() {
            this.resDic.forEach((v, key) => {
                if (!v.isKeepMemory)
                    this.mOldRes.push(key);
            });
        }
    }
    ResMgr.mInstance = null;
    YK.ResMgr = ResMgr;
})(YK || (YK = {}));
;
(function (YK) {
    class NetMgr extends YK.DispatchEventNode {
        constructor() {
            super();
            this.httpUrl = "http://39.107.84.87:9100/?";
            this.mTimeout = 30;
            this.mHeartTimeout = 30;
            this.mRateIP = 'ws://127.0.0.1:10002';
            this.mGateIP = '';
            this.socket = null;
            this.MessageReveivedCallback = Laya.Handler.create(this, this.onMessageReveivedCallback, null, false);
            this.mRpcId = 1;
            this.mSendQueue = new Array();
            this.mNeedQueue = new Array();
            this.SendDataCallback = Laya.Handler.create(this, this.Send, null, false);
            if (NetMgr.mInstance == null)
                NetMgr.mInstance = this;
            this.socket = new Laya.Socket(null, null, Laya.Byte);
            this.socket.on(Laya.Event.OPEN, this, this.onopen);
            this.socket.on(Laya.Event.CLOSE, this, this.onclose);
            this.socket.on(Laya.Event.MESSAGE, this, this.onMessageReveived);
            this.socket.on(Laya.Event.ERROR, this, this.onerror);
            let protoMap = YK.ProtoMap.Instance;
        }
        static get Instance() {
            if (this.mInstance == null)
                new NetMgr();
            return this.mInstance;
        }
        onDestroy() {
            YK.TimeDelay.Instance.Remove(this.CheckSendTimeOut, this);
            YK.TimeDelay.Instance.Remove(this.SendDataToServer, this);
        }
        CheckSendTimeOut() {
            if (this.mSendQueue.length > 0) {
                let array = new Array();
                this.mSendQueue.forEach(element => {
                    if (Date.now() - element.sendTime > this.mTimeout * 1000) {
                        array.push(element);
                    }
                });
                array.forEach(element => {
                    let index = this.mSendQueue.indexOf(element);
                    if (index != -1) {
                        this.mSendQueue.splice(index, 1);
                    }
                    this.msgTimeOut(element.head);
                });
            }
        }
        connect(wsurl = null, isRateIp = true) {
            if (isRateIp) {
                wsurl = wsurl == null ? this.mRateIP : wsurl;
                this.mRateIP = wsurl;
            }
            else {
                wsurl = wsurl == null ? this.mGateIP : wsurl;
                this.mGateIP = wsurl;
            }
            if (this.socket.connected) {
                this.onopen(null);
            }
            else {
                this.socket.connectByUrl(wsurl);
            }
        }
        connectGate(url, data) {
            console.log("执行connectGate，要打开的地址是：", url);
            if (this.isConnect()) {
                this.disConnect("", "");
                console.log("断开Rate（" + this.mRateIP + "）网络，重新连接到Map服务器：" + url);
                this.connect(url, false);
                this.sendData(YK.ProtoIDNames.C2G_LoginFamilyGate, data);
            }
        }
        onopen(ev) {
            console.log("链接服务器成功");
            YK.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
            YK.TimeDelay.Instance.Add(3, 0, this.checkHeartbeat, this);
            this.lastActivityTime = Date.now();
            this.DispatchEventByType(NetMgrEventDef.onopen);
            YK.TimeDelay.Instance.Remove(this.SendDataToServer, this);
            YK.TimeDelay.Instance.Add(3, 0, this.SendDataToServer, this);
        }
        isConnect() {
            return this.socket != null && this.socket.connected;
        }
        disConnect(msgType, msg) {
            if (this.mSendQueue) {
                this.mSendQueue.splice(0, this.mSendQueue.length);
            }
            if (this.isConnect()) {
                this.socket.close();
                this.socket.cleanSocket();
            }
            YK.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
            let data = { type: msgType, msg: msg };
            this.DispatchEventByType(NetMgrEventDef.disConnect, data);
        }
        onerror(ev) {
            console.log("与服务器连接失败");
            this.disConnect(NetMgrEventDef.onerror, "与服务器连接失败");
        }
        onclose(ev) {
            console.log("与服务器连接断开");
            this.disConnect(NetMgrEventDef.onclose, "与服务器连接断开");
        }
        onMessageReveived(data) {
            YK.ProtoMap.UnPack(data, this.MessageReveivedCallback);
        }
        onMessageReveivedCallback(protoName, respone) {
            this.lastActivityTime = Date.now();
            if (respone.Error != undefined && respone.Error != 0) {
                console.warn("服务器返回错误码  消息 protoName：" + protoName + "/errorcode=" + respone.Error);
            }
            let index = this.mSendQueue.findIndex((obj, index, any) => {
                return obj.head.RpcId == respone.RpcId;
            });
            let head;
            if (index != -1) {
                head = this.mSendQueue[index];
                this.mSendQueue.splice(index, 1);
            }
            else {
                head = new YK.PackBase();
                head.Error = 0;
                head.RpcId = 0;
            }
            head.ProtoName = protoName;
            let ev = new YK.ResponseMessageEvent(protoName);
            ev.SetData(head, respone);
            this.DispatchEvent(ev);
        }
        get RpcId() {
            return this.mRpcId++;
        }
        checkHeartbeat() {
            if (Date.now() - this.lastActivityTime > this.mHeartTimeout * 1000) {
                this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
            }
        }
        msgTimeOut(head) {
            if (head.ProtoName == "C2M_HeartTest") {
                this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
            }
            else {
                let ev = new YK.ResponseMessageEvent(head.ProtoName.toString());
                head.Error = -1;
                ev.SetData(head, null);
                console.error("消息返回超时 ProtoName=" + head.ProtoName);
                this.DispatchEvent(ev);
            }
        }
        SendGet(url, callback) {
            url = this.httpUrl + url;
            console.log("调用 NetMgr----> SendGet, 地址数据是：", url);
            let flag = false;
            let request = new laya.net.HttpRequest();
            request.once(laya.events.Event.COMPLETE, this, (e) => {
                let respone = request.data;
                let data = null;
                if (respone != null) {
                    data = JSON.parse(respone);
                }
                callback.Invoke(data);
            });
            request.once(laya.events.Event.ERROR, this, (e) => {
                callback.Invoke(null);
            });
            request.send(url, null, "get");
        }
        sendData(name, data) {
            if (name == "OuterOpcode.C2G_PingRequest") {
                let index = this.mSendQueue.findIndex((obj, index, any) => {
                    return obj.head.ProtoName == name;
                });
                if (index >= 0) {
                    return;
                }
            }
            data.RpcId = this.RpcId;
            YK.ProtoMap.Pack(name, data, this.SendDataCallback);
        }
        Send(eventName, rpcId, buffer) {
            let head = new YK.PackBase();
            head.ProtoName = eventName;
            head.Error = 0;
            head.RpcId = rpcId;
            head.ContentBuff = buffer;
            let sendData = {
                head: head,
                sendTime: Date.now()
            };
            this.mNeedQueue.push(sendData);
        }
        SendDataToServer() {
            if (this.mNeedQueue.length > 0) {
                if (this.isConnect()) {
                    let sendData = this.mNeedQueue.shift();
                    this.socket.send(sendData.head.ContentBuff);
                    this.mSendQueue.push(sendData);
                }
                else {
                    console.error("网络断开无法发送消息");
                    this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
                    YK.TimeDelay.Instance.Remove(this.SendDataToServer, this);
                }
            }
        }
    }
    YK.NetMgr = NetMgr;
    class NetMgrEventDef {
    }
    NetMgrEventDef.disConnect = "disConnect";
    NetMgrEventDef.onerror = "onerror";
    NetMgrEventDef.onclose = "onclose";
    NetMgrEventDef.onopen = "onopen";
    NetMgrEventDef.HeartbeatTimeOut = "HeartbeatTimeOut";
    YK.NetMgrEventDef = NetMgrEventDef;
})(YK || (YK = {}));
;
(function (YK) {
    class PackBase {
        constructor() {
            this.ProtoName = "";
            this.RpcId = 0;
            this.Error = 0;
            this.ContentBuff = null;
        }
    }
    YK.PackBase = PackBase;
})(YK || (YK = {}));
;
(function (YK) {
    class ProtoIDNames {
    }
    ProtoIDNames.C2R_Login = "HotfixOpcode.C2R_Login";
    ProtoIDNames.R2C_Login = "HotfixOpcode.R2C_Login";
    ProtoIDNames.C2G_LoginGate = "HotfixOpcode.C2G_LoginGate";
    ProtoIDNames.G2C_LoginGate = "HotfixOpcode.G2C_LoginGate";
    ProtoIDNames.G2C_TestHotfixMessage = "HotfixOpcode.G2C_TestHotfixMessage";
    ProtoIDNames.C2M_TestActorRequest = "HotfixOpcode.C2M_TestActorRequest";
    ProtoIDNames.M2C_TestActorResponse = "HotfixOpcode.M2C_TestActorResponse";
    ProtoIDNames.C2M_HeartTest = "HotfixOpcode.C2M_HeartTest";
    ProtoIDNames.M2C_HeartTest = "HotfixOpcode.M2C_HeartTest";
    ProtoIDNames.C2G_PlayerInfo = "HotfixOpcode.C2G_PlayerInfo";
    ProtoIDNames.G2C_PlayerInfo = "HotfixOpcode.G2C_PlayerInfo";
    ProtoIDNames.C2R_Connent = "HotfixOpcode.C2R_Connent";
    ProtoIDNames.R2C_Connent = "HotfixOpcode.R2C_Connent";
    ProtoIDNames.C2R_LoginFamily = "HotfixOpcode.C2R_LoginFamily";
    ProtoIDNames.R2C_LoginFamily = "HotfixOpcode.R2C_LoginFamily";
    ProtoIDNames.C2G_LoginFamilyGate = "HotfixOpcode.C2G_LoginFamilyGate";
    ProtoIDNames.G2C_LoginFamilyGate = "HotfixOpcode.G2C_LoginFamilyGate";
    ProtoIDNames.G2M_ApplicationQuit = "HotfixOpcode.G2M_ApplicationQuit";
    ProtoIDNames.M2G_ApplicationQuit = "HotfixOpcode.M2G_ApplicationQuit";
    ProtoIDNames.C2R_Register = "HotfixOpcode.C2R_Register";
    ProtoIDNames.R2C_Register = "HotfixOpcode.R2C_Register";
    ProtoIDNames.R2C_Message = "HotfixOpcode.R2C_Message";
    ProtoIDNames.R2C_MapIcon = "HotfixOpcode.R2C_MapIcon";
    ProtoIDNames.R2C_ButtonControl = "HotfixOpcode.R2C_ButtonControl";
    ProtoIDNames.R2C_MapMenu = "HotfixOpcode.R2C_MapMenu";
    ProtoIDNames.R2C_Contract = "HotfixOpcode.R2C_Contract";
    ProtoIDNames.R2C_DDDW = "HotfixOpcode.R2C_DDDW";
    ProtoIDNames.R2C_SysParam = "HotfixOpcode.R2C_SysParam";
    ProtoIDNames.C2M_SetFirstName = "HotfixOpcode.C2M_SetFirstName";
    ProtoIDNames.M2C_SetFirstName = "HotfixOpcode.M2C_SetFirstName";
    ProtoIDNames.C2M_SetMyCountry = "HotfixOpcode.C2M_SetMyCountry";
    ProtoIDNames.M2C_SetMyCountry = "HotfixOpcode.M2C_SetMyCountry";
    ProtoIDNames.C2M_GetOtherCountry = "HotfixOpcode.C2M_GetOtherCountry";
    ProtoIDNames.M2C_GetOtherCountry = "HotfixOpcode.M2C_GetOtherCountry";
    ProtoIDNames.C2M_GetFamilyName = "HotfixOpcode.C2M_GetFamilyName";
    ProtoIDNames.M2C_GetFamilyName = "HotfixOpcode.M2C_GetFamilyName";
    ProtoIDNames.C2M_GetFamilyXY = "HotfixOpcode.C2M_GetFamilyXY";
    ProtoIDNames.M2C_FamilyXYList = "HotfixOpcode.M2C_FamilyXYList";
    ProtoIDNames.M2C_AncestralXYList = "HotfixOpcode.M2C_AncestralXYList";
    ProtoIDNames.C2M_SelectAreaFromServer = "HotfixOpcode.C2M_SelectAreaFromServer";
    ProtoIDNames.M2C_SelectAreaFromServer = "HotfixOpcode.M2C_SelectAreaFromServer";
    ProtoIDNames.C2M_CreateFamilyXY = "HotfixOpcode.C2M_CreateFamilyXY";
    ProtoIDNames.M2C_CreateFamilyXY = "HotfixOpcode.M2C_CreateFamilyXY";
    ProtoIDNames.C2M_GetFamily = "HotfixOpcode.C2M_GetFamily";
    ProtoIDNames.M2C_GetFamily = "HotfixOpcode.M2C_GetFamily";
    ProtoIDNames.C2M_SetUserPosition = "HotfixOpcode.C2M_SetUserPosition";
    ProtoIDNames.C2M_GetRelations = "HotfixOpcode.C2M_GetRelations";
    ProtoIDNames.M2C_GetRelations = "HotfixOpcode.M2C_GetRelations";
    ProtoIDNames.C2M_CreateRelation = "HotfixOpcode.C2M_CreateRelation";
    ProtoIDNames.M2C_CreateRelation = "HotfixOpcode.M2C_CreateRelation";
    ProtoIDNames.C2M_ApplyCreateRelation = "HotfixOpcode.C2M_ApplyCreateRelation";
    ProtoIDNames.M2C_ApplyCreateRelation = "HotfixOpcode.M2C_ApplyCreateRelation";
    ProtoIDNames.C2M_GetMailList = "HotfixOpcode.C2M_GetMailList";
    ProtoIDNames.M2C_GetMailList = "HotfixOpcode.M2C_GetMailList";
    ProtoIDNames.C2M_ChangeMailStatus = "HotfixOpcode.C2M_ChangeMailStatus";
    ProtoIDNames.M2C_ChangeMailStatus = "HotfixOpcode.M2C_ChangeMailStatus";
    ProtoIDNames.C2M_FindAncestralInCounty = "HotfixOpcode.C2M_FindAncestralInCounty";
    ProtoIDNames.M2C_FindAncestralInCounty = "HotfixOpcode.M2C_FindAncestralInCounty";
    ProtoIDNames.C2M_GetAncestral = "HotfixOpcode.C2M_GetAncestral";
    ProtoIDNames.M2C_GetAncestral = "HotfixOpcode.M2C_GetAncestral";
    ProtoIDNames.C2M_GetAncestralAdmin = "HotfixOpcode.C2M_GetAncestralAdmin";
    ProtoIDNames.M2C_GetAncestralAdmin = "HotfixOpcode.M2C_GetAncestralAdmin";
    ProtoIDNames.C2M_UpdateAncestral = "HotfixOpcode.C2M_UpdateAncestral";
    ProtoIDNames.M2C_UpdateAncestral = "HotfixOpcode.M2C_UpdateAncestral";
    ProtoIDNames.C2M_UpdateAncestralAdmin = "HotfixOpcode.C2M_UpdateAncestralAdmin";
    ProtoIDNames.M2C_UpdateAncestralAdmin = "HotfixOpcode.M2C_UpdateAncestralAdmin";
    ProtoIDNames.C2M_ContractRecord = "HotfixOpcode.C2M_ContractRecord";
    ProtoIDNames.C2M_AncestralSpace = "HotfixOpcode.C2M_AncestralSpace";
    ProtoIDNames.M2C_AncestralSpace = "HotfixOpcode.M2C_AncestralSpace";
    ProtoIDNames.C2M_FamilySpace = "HotfixOpcode.C2M_FamilySpace";
    ProtoIDNames.M2C_FamilySpace = "HotfixOpcode.M2C_FamilySpace";
    ProtoIDNames.C2M_GetDiary = "HotfixOpcode.C2M_GetDiary";
    ProtoIDNames.M2C_GetDiary = "HotfixOpcode.M2C_GetDiary";
    ProtoIDNames.C2M_GetGoodDeed = "HotfixOpcode.C2M_GetGoodDeed";
    ProtoIDNames.M2C_GetGoodDeed = "HotfixOpcode.M2C_GetGoodDeed";
    ProtoIDNames.C2M_SaveDetail = "HotfixOpcode.C2M_SaveDetail";
    ProtoIDNames.M2C_SaveDetail = "HotfixOpcode.M2C_SaveDetail";
    ProtoIDNames.C2M_GetCredentials = "HotfixOpcode.C2M_GetCredentials";
    ProtoIDNames.M2C_GetCredentials = "HotfixOpcode.M2C_GetCredentials";
    ProtoIDNames.C2M_DeleteDetail = "HotfixOpcode.C2M_DeleteDetail";
    ProtoIDNames.M2C_DeleteDetail = "HotfixOpcode.M2C_DeleteDetail";
    ProtoIDNames.Actor_Test = "OuterOpcode.Actor_Test";
    ProtoIDNames.C2M_TestRequest = "OuterOpcode.C2M_TestRequest";
    ProtoIDNames.M2C_TestResponse = "OuterOpcode.M2C_TestResponse";
    ProtoIDNames.Actor_TransferRequest = "OuterOpcode.Actor_TransferRequest";
    ProtoIDNames.Actor_TransferResponse = "OuterOpcode.Actor_TransferResponse";
    ProtoIDNames.C2G_EnterMap = "OuterOpcode.C2G_EnterMap";
    ProtoIDNames.G2C_EnterMap = "OuterOpcode.G2C_EnterMap";
    ProtoIDNames.M2C_CreateUnits = "OuterOpcode.M2C_CreateUnits";
    ProtoIDNames.Frame_ClickMap = "OuterOpcode.Frame_ClickMap";
    ProtoIDNames.M2C_PathfindingResult = "OuterOpcode.M2C_PathfindingResult";
    ProtoIDNames.C2R_Ping = "OuterOpcode.C2R_Ping";
    ProtoIDNames.R2C_Ping = "OuterOpcode.R2C_Ping";
    ProtoIDNames.G2C_Test = "OuterOpcode.G2C_Test";
    ProtoIDNames.C2M_Reload = "OuterOpcode.C2M_Reload";
    ProtoIDNames.M2C_Reload = "OuterOpcode.M2C_Reload";
    ProtoIDNames.C2G_EnterFamilyMap = "OuterOpcode.C2G_EnterFamilyMap";
    ProtoIDNames.G2C_EnterFamilyMap = "OuterOpcode.G2C_EnterFamilyMap";
    ProtoIDNames.C2G_PingRequest = "OuterOpcode.C2G_PingRequest";
    ProtoIDNames.G2C_PingResponse = "OuterOpcode.G2C_PingResponse";
    YK.ProtoIDNames = ProtoIDNames;
})(YK || (YK = {}));
;
(function (YK) {
    class ProtoIDs {
        static getMap() {
            let protoIDs = {};
            protoIDs[10001] = "HotfixOpcode.Relation";
            protoIDs["HotfixOpcode.Relation"] = 10001;
            protoIDs[10002] = "HotfixOpcode.Ancestral";
            protoIDs["HotfixOpcode.Ancestral"] = 10002;
            protoIDs[10003] = "HotfixOpcode.Space";
            protoIDs["HotfixOpcode.Space"] = 10003;
            protoIDs[10004] = "HotfixOpcode.AncestralSpace";
            protoIDs["HotfixOpcode.AncestralSpace"] = 10004;
            protoIDs[10005] = "HotfixOpcode.AncestralAdmin";
            protoIDs["HotfixOpcode.AncestralAdmin"] = 10005;
            protoIDs[10006] = "HotfixOpcode.AncestralImage";
            protoIDs["HotfixOpcode.AncestralImage"] = 10006;
            protoIDs[10007] = "HotfixOpcode.Contract";
            protoIDs["HotfixOpcode.Contract"] = 10007;
            protoIDs[10008] = "HotfixOpcode.SysParam";
            protoIDs["HotfixOpcode.SysParam"] = 10008;
            protoIDs[10009] = "HotfixOpcode.DDDW";
            protoIDs["HotfixOpcode.DDDW"] = 10009;
            protoIDs[10010] = "HotfixOpcode.ContractRecord";
            protoIDs["HotfixOpcode.ContractRecord"] = 10010;
            protoIDs[10011] = "HotfixOpcode.UserInfo";
            protoIDs["HotfixOpcode.UserInfo"] = 10011;
            protoIDs[10012] = "HotfixOpcode.UserSet";
            protoIDs["HotfixOpcode.UserSet"] = 10012;
            protoIDs[10013] = "HotfixOpcode.Message";
            protoIDs["HotfixOpcode.Message"] = 10013;
            protoIDs[10014] = "HotfixOpcode.Area";
            protoIDs["HotfixOpcode.Area"] = 10014;
            protoIDs[10015] = "HotfixOpcode.MyFamily";
            protoIDs["HotfixOpcode.MyFamily"] = 10015;
            protoIDs[10016] = "HotfixOpcode.FamilySpace";
            protoIDs["HotfixOpcode.FamilySpace"] = 10016;
            protoIDs[10017] = "HotfixOpcode.MyFamilyXY";
            protoIDs["HotfixOpcode.MyFamilyXY"] = 10017;
            protoIDs[10018] = "HotfixOpcode.AncestralXY";
            protoIDs["HotfixOpcode.AncestralXY"] = 10018;
            protoIDs[10019] = "HotfixOpcode.XY";
            protoIDs["HotfixOpcode.XY"] = 10019;
            protoIDs[10020] = "HotfixOpcode.MapIcon";
            protoIDs["HotfixOpcode.MapIcon"] = 10020;
            protoIDs[10021] = "HotfixOpcode.ButtonControl";
            protoIDs["HotfixOpcode.ButtonControl"] = 10021;
            protoIDs[10022] = "HotfixOpcode.MapMenu";
            protoIDs["HotfixOpcode.MapMenu"] = 10022;
            protoIDs[10023] = "HotfixOpcode.Mail";
            protoIDs["HotfixOpcode.Mail"] = 10023;
            protoIDs[10024] = "HotfixOpcode.MailReceiver";
            protoIDs["HotfixOpcode.MailReceiver"] = 10024;
            protoIDs[10025] = "HotfixOpcode.Diary";
            protoIDs["HotfixOpcode.Diary"] = 10025;
            protoIDs[10026] = "HotfixOpcode.GoodDeed";
            protoIDs["HotfixOpcode.GoodDeed"] = 10026;
            protoIDs[10027] = "HotfixOpcode.Detail";
            protoIDs["HotfixOpcode.Detail"] = 10027;
            protoIDs[10028] = "HotfixOpcode.C2R_Login";
            protoIDs["HotfixOpcode.C2R_Login"] = 10028;
            protoIDs[10029] = "HotfixOpcode.R2C_Login";
            protoIDs["HotfixOpcode.R2C_Login"] = 10029;
            protoIDs[10030] = "HotfixOpcode.C2G_LoginGate";
            protoIDs["HotfixOpcode.C2G_LoginGate"] = 10030;
            protoIDs[10031] = "HotfixOpcode.G2C_LoginGate";
            protoIDs["HotfixOpcode.G2C_LoginGate"] = 10031;
            protoIDs[10032] = "HotfixOpcode.G2C_TestHotfixMessage";
            protoIDs["HotfixOpcode.G2C_TestHotfixMessage"] = 10032;
            protoIDs[10033] = "HotfixOpcode.C2M_TestActorRequest";
            protoIDs["HotfixOpcode.C2M_TestActorRequest"] = 10033;
            protoIDs[10034] = "HotfixOpcode.M2C_TestActorResponse";
            protoIDs["HotfixOpcode.M2C_TestActorResponse"] = 10034;
            protoIDs[10035] = "HotfixOpcode.C2M_HeartTest";
            protoIDs["HotfixOpcode.C2M_HeartTest"] = 10035;
            protoIDs[10036] = "HotfixOpcode.M2C_HeartTest";
            protoIDs["HotfixOpcode.M2C_HeartTest"] = 10036;
            protoIDs[10037] = "HotfixOpcode.PlayerInfo";
            protoIDs["HotfixOpcode.PlayerInfo"] = 10037;
            protoIDs[10038] = "HotfixOpcode.C2G_PlayerInfo";
            protoIDs["HotfixOpcode.C2G_PlayerInfo"] = 10038;
            protoIDs[10039] = "HotfixOpcode.G2C_PlayerInfo";
            protoIDs["HotfixOpcode.G2C_PlayerInfo"] = 10039;
            protoIDs[10040] = "HotfixOpcode.C2R_Connent";
            protoIDs["HotfixOpcode.C2R_Connent"] = 10040;
            protoIDs[10041] = "HotfixOpcode.R2C_Connent";
            protoIDs["HotfixOpcode.R2C_Connent"] = 10041;
            protoIDs[10042] = "HotfixOpcode.C2R_LoginFamily";
            protoIDs["HotfixOpcode.C2R_LoginFamily"] = 10042;
            protoIDs[10043] = "HotfixOpcode.R2C_LoginFamily";
            protoIDs["HotfixOpcode.R2C_LoginFamily"] = 10043;
            protoIDs[10044] = "HotfixOpcode.C2G_LoginFamilyGate";
            protoIDs["HotfixOpcode.C2G_LoginFamilyGate"] = 10044;
            protoIDs[10045] = "HotfixOpcode.G2C_LoginFamilyGate";
            protoIDs["HotfixOpcode.G2C_LoginFamilyGate"] = 10045;
            protoIDs[10046] = "HotfixOpcode.G2M_ApplicationQuit";
            protoIDs["HotfixOpcode.G2M_ApplicationQuit"] = 10046;
            protoIDs[10047] = "HotfixOpcode.M2G_ApplicationQuit";
            protoIDs["HotfixOpcode.M2G_ApplicationQuit"] = 10047;
            protoIDs[10048] = "HotfixOpcode.C2R_Register";
            protoIDs["HotfixOpcode.C2R_Register"] = 10048;
            protoIDs[10049] = "HotfixOpcode.R2C_Register";
            protoIDs["HotfixOpcode.R2C_Register"] = 10049;
            protoIDs[10050] = "HotfixOpcode.R2C_Message";
            protoIDs["HotfixOpcode.R2C_Message"] = 10050;
            protoIDs[10051] = "HotfixOpcode.R2C_MapIcon";
            protoIDs["HotfixOpcode.R2C_MapIcon"] = 10051;
            protoIDs[10052] = "HotfixOpcode.R2C_ButtonControl";
            protoIDs["HotfixOpcode.R2C_ButtonControl"] = 10052;
            protoIDs[10053] = "HotfixOpcode.R2C_MapMenu";
            protoIDs["HotfixOpcode.R2C_MapMenu"] = 10053;
            protoIDs[10054] = "HotfixOpcode.R2C_Contract";
            protoIDs["HotfixOpcode.R2C_Contract"] = 10054;
            protoIDs[10055] = "HotfixOpcode.R2C_DDDW";
            protoIDs["HotfixOpcode.R2C_DDDW"] = 10055;
            protoIDs[10056] = "HotfixOpcode.R2C_SysParam";
            protoIDs["HotfixOpcode.R2C_SysParam"] = 10056;
            protoIDs[10057] = "HotfixOpcode.C2M_SetFirstName";
            protoIDs["HotfixOpcode.C2M_SetFirstName"] = 10057;
            protoIDs[10058] = "HotfixOpcode.M2C_SetFirstName";
            protoIDs["HotfixOpcode.M2C_SetFirstName"] = 10058;
            protoIDs[10059] = "HotfixOpcode.C2M_SetMyCountry";
            protoIDs["HotfixOpcode.C2M_SetMyCountry"] = 10059;
            protoIDs[10060] = "HotfixOpcode.M2C_SetMyCountry";
            protoIDs["HotfixOpcode.M2C_SetMyCountry"] = 10060;
            protoIDs[10061] = "HotfixOpcode.C2M_GetOtherCountry";
            protoIDs["HotfixOpcode.C2M_GetOtherCountry"] = 10061;
            protoIDs[10062] = "HotfixOpcode.M2C_GetOtherCountry";
            protoIDs["HotfixOpcode.M2C_GetOtherCountry"] = 10062;
            protoIDs[10063] = "HotfixOpcode.C2M_GetFamilyName";
            protoIDs["HotfixOpcode.C2M_GetFamilyName"] = 10063;
            protoIDs[10064] = "HotfixOpcode.M2C_GetFamilyName";
            protoIDs["HotfixOpcode.M2C_GetFamilyName"] = 10064;
            protoIDs[10065] = "HotfixOpcode.C2M_GetFamilyXY";
            protoIDs["HotfixOpcode.C2M_GetFamilyXY"] = 10065;
            protoIDs[10066] = "HotfixOpcode.M2C_FamilyXYList";
            protoIDs["HotfixOpcode.M2C_FamilyXYList"] = 10066;
            protoIDs[10067] = "HotfixOpcode.M2C_AncestralXYList";
            protoIDs["HotfixOpcode.M2C_AncestralXYList"] = 10067;
            protoIDs[10068] = "HotfixOpcode.C2M_SelectAreaFromServer";
            protoIDs["HotfixOpcode.C2M_SelectAreaFromServer"] = 10068;
            protoIDs[10069] = "HotfixOpcode.M2C_SelectAreaFromServer";
            protoIDs["HotfixOpcode.M2C_SelectAreaFromServer"] = 10069;
            protoIDs[10070] = "HotfixOpcode.C2M_CreateFamilyXY";
            protoIDs["HotfixOpcode.C2M_CreateFamilyXY"] = 10070;
            protoIDs[10071] = "HotfixOpcode.M2C_CreateFamilyXY";
            protoIDs["HotfixOpcode.M2C_CreateFamilyXY"] = 10071;
            protoIDs[10072] = "HotfixOpcode.C2M_GetFamily";
            protoIDs["HotfixOpcode.C2M_GetFamily"] = 10072;
            protoIDs[10073] = "HotfixOpcode.M2C_GetFamily";
            protoIDs["HotfixOpcode.M2C_GetFamily"] = 10073;
            protoIDs[10074] = "HotfixOpcode.C2M_SetUserPosition";
            protoIDs["HotfixOpcode.C2M_SetUserPosition"] = 10074;
            protoIDs[10075] = "HotfixOpcode.C2M_GetRelations";
            protoIDs["HotfixOpcode.C2M_GetRelations"] = 10075;
            protoIDs[10076] = "HotfixOpcode.M2C_GetRelations";
            protoIDs["HotfixOpcode.M2C_GetRelations"] = 10076;
            protoIDs[10077] = "HotfixOpcode.C2M_CreateRelation";
            protoIDs["HotfixOpcode.C2M_CreateRelation"] = 10077;
            protoIDs[10078] = "HotfixOpcode.M2C_CreateRelation";
            protoIDs["HotfixOpcode.M2C_CreateRelation"] = 10078;
            protoIDs[10079] = "HotfixOpcode.C2M_ApplyCreateRelation";
            protoIDs["HotfixOpcode.C2M_ApplyCreateRelation"] = 10079;
            protoIDs[10080] = "HotfixOpcode.M2C_ApplyCreateRelation";
            protoIDs["HotfixOpcode.M2C_ApplyCreateRelation"] = 10080;
            protoIDs[10081] = "HotfixOpcode.C2M_GetMailList";
            protoIDs["HotfixOpcode.C2M_GetMailList"] = 10081;
            protoIDs[10082] = "HotfixOpcode.M2C_GetMailList";
            protoIDs["HotfixOpcode.M2C_GetMailList"] = 10082;
            protoIDs[10083] = "HotfixOpcode.C2M_ChangeMailStatus";
            protoIDs["HotfixOpcode.C2M_ChangeMailStatus"] = 10083;
            protoIDs[10084] = "HotfixOpcode.M2C_ChangeMailStatus";
            protoIDs["HotfixOpcode.M2C_ChangeMailStatus"] = 10084;
            protoIDs[10085] = "HotfixOpcode.C2M_FindAncestralInCounty";
            protoIDs["HotfixOpcode.C2M_FindAncestralInCounty"] = 10085;
            protoIDs[10086] = "HotfixOpcode.M2C_FindAncestralInCounty";
            protoIDs["HotfixOpcode.M2C_FindAncestralInCounty"] = 10086;
            protoIDs[10087] = "HotfixOpcode.C2M_GetAncestral";
            protoIDs["HotfixOpcode.C2M_GetAncestral"] = 10087;
            protoIDs[10088] = "HotfixOpcode.M2C_GetAncestral";
            protoIDs["HotfixOpcode.M2C_GetAncestral"] = 10088;
            protoIDs[10089] = "HotfixOpcode.C2M_GetAncestralAdmin";
            protoIDs["HotfixOpcode.C2M_GetAncestralAdmin"] = 10089;
            protoIDs[10090] = "HotfixOpcode.M2C_GetAncestralAdmin";
            protoIDs["HotfixOpcode.M2C_GetAncestralAdmin"] = 10090;
            protoIDs[10091] = "HotfixOpcode.C2M_UpdateAncestral";
            protoIDs["HotfixOpcode.C2M_UpdateAncestral"] = 10091;
            protoIDs[10092] = "HotfixOpcode.M2C_UpdateAncestral";
            protoIDs["HotfixOpcode.M2C_UpdateAncestral"] = 10092;
            protoIDs[10093] = "HotfixOpcode.C2M_UpdateAncestralAdmin";
            protoIDs["HotfixOpcode.C2M_UpdateAncestralAdmin"] = 10093;
            protoIDs[10094] = "HotfixOpcode.M2C_UpdateAncestralAdmin";
            protoIDs["HotfixOpcode.M2C_UpdateAncestralAdmin"] = 10094;
            protoIDs[10095] = "HotfixOpcode.C2M_ContractRecord";
            protoIDs["HotfixOpcode.C2M_ContractRecord"] = 10095;
            protoIDs[10096] = "HotfixOpcode.C2M_AncestralSpace";
            protoIDs["HotfixOpcode.C2M_AncestralSpace"] = 10096;
            protoIDs[10097] = "HotfixOpcode.M2C_AncestralSpace";
            protoIDs["HotfixOpcode.M2C_AncestralSpace"] = 10097;
            protoIDs[10098] = "HotfixOpcode.C2M_FamilySpace";
            protoIDs["HotfixOpcode.C2M_FamilySpace"] = 10098;
            protoIDs[10099] = "HotfixOpcode.M2C_FamilySpace";
            protoIDs["HotfixOpcode.M2C_FamilySpace"] = 10099;
            protoIDs[10100] = "HotfixOpcode.C2M_GetDiary";
            protoIDs["HotfixOpcode.C2M_GetDiary"] = 10100;
            protoIDs[10101] = "HotfixOpcode.M2C_GetDiary";
            protoIDs["HotfixOpcode.M2C_GetDiary"] = 10101;
            protoIDs[10102] = "HotfixOpcode.C2M_GetGoodDeed";
            protoIDs["HotfixOpcode.C2M_GetGoodDeed"] = 10102;
            protoIDs[10103] = "HotfixOpcode.M2C_GetGoodDeed";
            protoIDs["HotfixOpcode.M2C_GetGoodDeed"] = 10103;
            protoIDs[10104] = "HotfixOpcode.C2M_SaveDetail";
            protoIDs["HotfixOpcode.C2M_SaveDetail"] = 10104;
            protoIDs[10105] = "HotfixOpcode.M2C_SaveDetail";
            protoIDs["HotfixOpcode.M2C_SaveDetail"] = 10105;
            protoIDs[10106] = "HotfixOpcode.C2M_GetCredentials";
            protoIDs["HotfixOpcode.C2M_GetCredentials"] = 10106;
            protoIDs[10107] = "HotfixOpcode.M2C_GetCredentials";
            protoIDs["HotfixOpcode.M2C_GetCredentials"] = 10107;
            protoIDs[10108] = "HotfixOpcode.C2M_DeleteDetail";
            protoIDs["HotfixOpcode.C2M_DeleteDetail"] = 10108;
            protoIDs[10109] = "HotfixOpcode.M2C_DeleteDetail";
            protoIDs["HotfixOpcode.M2C_DeleteDetail"] = 10109;
            protoIDs[101] = "OuterOpcode.Actor_Test";
            protoIDs["OuterOpcode.Actor_Test"] = 101;
            protoIDs[102] = "OuterOpcode.C2M_TestRequest";
            protoIDs["OuterOpcode.C2M_TestRequest"] = 102;
            protoIDs[103] = "OuterOpcode.M2C_TestResponse";
            protoIDs["OuterOpcode.M2C_TestResponse"] = 103;
            protoIDs[104] = "OuterOpcode.Actor_TransferRequest";
            protoIDs["OuterOpcode.Actor_TransferRequest"] = 104;
            protoIDs[105] = "OuterOpcode.Actor_TransferResponse";
            protoIDs["OuterOpcode.Actor_TransferResponse"] = 105;
            protoIDs[106] = "OuterOpcode.C2G_EnterMap";
            protoIDs["OuterOpcode.C2G_EnterMap"] = 106;
            protoIDs[107] = "OuterOpcode.G2C_EnterMap";
            protoIDs["OuterOpcode.G2C_EnterMap"] = 107;
            protoIDs[108] = "OuterOpcode.UnitInfo";
            protoIDs["OuterOpcode.UnitInfo"] = 108;
            protoIDs[109] = "OuterOpcode.M2C_CreateUnits";
            protoIDs["OuterOpcode.M2C_CreateUnits"] = 109;
            protoIDs[110] = "OuterOpcode.Frame_ClickMap";
            protoIDs["OuterOpcode.Frame_ClickMap"] = 110;
            protoIDs[111] = "OuterOpcode.M2C_PathfindingResult";
            protoIDs["OuterOpcode.M2C_PathfindingResult"] = 111;
            protoIDs[112] = "OuterOpcode.C2R_Ping";
            protoIDs["OuterOpcode.C2R_Ping"] = 112;
            protoIDs[113] = "OuterOpcode.R2C_Ping";
            protoIDs["OuterOpcode.R2C_Ping"] = 113;
            protoIDs[114] = "OuterOpcode.G2C_Test";
            protoIDs["OuterOpcode.G2C_Test"] = 114;
            protoIDs[115] = "OuterOpcode.C2M_Reload";
            protoIDs["OuterOpcode.C2M_Reload"] = 115;
            protoIDs[116] = "OuterOpcode.M2C_Reload";
            protoIDs["OuterOpcode.M2C_Reload"] = 116;
            protoIDs[117] = "OuterOpcode.C2G_EnterFamilyMap";
            protoIDs["OuterOpcode.C2G_EnterFamilyMap"] = 117;
            protoIDs[118] = "OuterOpcode.G2C_EnterFamilyMap";
            protoIDs["OuterOpcode.G2C_EnterFamilyMap"] = 118;
            protoIDs[119] = "OuterOpcode.C2G_PingRequest";
            protoIDs["OuterOpcode.C2G_PingRequest"] = 119;
            protoIDs[120] = "OuterOpcode.G2C_PingResponse";
            protoIDs["OuterOpcode.G2C_PingResponse"] = 120;
            return protoIDs;
        }
    }
    YK.ProtoIDs = ProtoIDs;
})(YK || (YK = {}));
;
(function (YK) {
    class ProtoMap {
        constructor() {
            ProtoMap._protoIDs = YK.ProtoIDs.getMap();
            // let protoBuf = Laya.Browser.window.protobuf;
            // ProtoMap._protoBuilderOuterMessageMap = protoBuf.load("res/proto/OuterMessage.proto");
            // ProtoMap._protoBuilderHotfixMessageMap = protoBuf.load("res/proto/HotfixMessage.proto");
        }
        static get Instance() {
            if (this.mInstance == null)
                new ProtoMap();
            return this.mInstance;
        }
        static Pack(name, data = null, callback) {
            let index = name.indexOf('.');
            let module = name.substring(0, index);
            let eventName = name.substring(index + 1);
            let that = this;
            if (!data || !eventName) {
                console.log(" send data not have name or data");
                return;
            }
            let protoBuilderMap;
            if (module == "HotfixOpcode") {
                protoBuilderMap = ProtoMap._protoBuilderHotfixMessageMap;
            }
            else {
                protoBuilderMap = ProtoMap._protoBuilderOuterMessageMap;
            }
            try {
                console.log("请求--->向服务器发送事件:" + name);
                protoBuilderMap.then((root) => {
                    let AwesomeMessage = root.lookup(eventName);
                    if (AwesomeMessage) {
                        let message = AwesomeMessage.create(data);
                        let errMsg = AwesomeMessage.verify(message);
                        if (errMsg) {
                            console.log(errMsg);
                            return;
                        }
                        let buffer = AwesomeMessage.encode(message).finish();
                        let pkg = new Laya.Byte();
                        pkg.writeUint8(0);
                        var id = ProtoMap._protoIDs[name];
                        pkg.writeUint16(id);
                        pkg.writeArrayBuffer(buffer);
                        callback.runWith([eventName, data.RpcId, pkg.buffer]);
                    }
                    else {
                        console.log("encode error ", name);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        static UnPack(data, callback) {
            let bytes = new Laya.Byte();
            bytes.writeArrayBuffer(data);
            bytes.pos = 0;
            let flag = bytes.getUint8();
            let nameId = bytes.getUint16();
            let name = ProtoMap._protoIDs[nameId];
            if (!name) {
                console.log('没有ID为' + nameId + '的协议!');
            }
            console.log("接收到信息：" + nameId + ", " + name);
            let index = name.indexOf('.');
            let module = name.substring(0, index);
            let eventName = name.substring(index + 1);
            let protoBuilderMap;
            if (module == "HotfixOpcode") {
                protoBuilderMap = ProtoMap._protoBuilderHotfixMessageMap;
            }
            else {
                protoBuilderMap = ProtoMap._protoBuilderOuterMessageMap;
            }
            try {
                protoBuilderMap.then((root) => {
                    let AwesomeMessage = root.lookup(eventName);
                    if (AwesomeMessage) {
                        var pos = 3;
                        var len = bytes.length - pos;
                        var arr = bytes.getUint8Array(pos, len);
                        let decodeData = AwesomeMessage.decode(arr, len);
                        callback.runWith([name, decodeData]);
                    }
                    else {
                        console.log("Can not find name : " + name + ", id = " + nameId + ", module:" + module + ",eventName:" + eventName);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    ProtoMap.classMap = {};
    YK.ProtoMap = ProtoMap;
})(YK || (YK = {}));
;
(function (YK) {
    class ResponseMessageEvent extends YK.EventData {
        constructor(type) {
            super(type, null);
            this.data = null;
        }
        SetData(head, msg) {
            this.data = { head: head, msg: msg };
        }
        get Data() {
            return this.data;
        }
    }
    YK.ResponseMessageEvent = ResponseMessageEvent;
})(YK || (YK = {}));
;
(function (YK) {
    class SceneBase {
        constructor() {
            this.firstWind = null;
            this.mLoaded = false;
            this.mTaskFinished = false;
            this.needLoadRes = new YK.LoadGruopInfo();
            this.needLoadRes.onCompletion(this.Loaded, this);
            this.tasks = new YK.TaskMgr(true, new YK.Func(this, this.TaskFinished));
            this.eventMgr = new YK.InterchangeableEventListenerMgr(this, this.OnHandler);
        }
        get ResouceLoaded() {
            if (this.needLoadRes.needLoad.length == 0 && !this.mLoaded) {
                this.mLoaded = true;
            }
            return this.mLoaded;
        }
        Enter(param) {
            YK.ResMgr.Instance.push();
            this.mLoaded = false;
            this.mTaskFinished = false;
            this.tasks.Stop();
            this.mParam = param;
            this.OnInit(param);
            this.needLoadRes.start();
            this.tasks.Execute();
        }
        Leave() {
            if (this.eventMgr != null)
                this.eventMgr.RemoveAll();
            if (this.tasks != null)
                this.tasks.Stop();
            this.OnLeave();
        }
        Destroy() {
            this.OnDestroy();
        }
        TaskFinished(error) {
            if (error != null) {
                console.error(error);
            }
            else {
                this.OnTaskFinished();
                this.mTaskFinished = true;
                this.ChechEnter();
            }
        }
        Loaded(error) {
            if (error != null) {
                console.error(error);
            }
            else {
                this.OnLoaded();
                this.mLoaded = true;
                this.ChechEnter();
            }
        }
        ChechEnter() {
            if (this.ResouceLoaded && this.mTaskFinished) {
                YK.UIMgr.Instance.HideAllWind(true);
                YK.ResMgr.Instance.pop();
                if (this.firstWind != null) {
                    YK.UIMgr.Instance.ShowWind(this.firstWind);
                }
                this.OnEnter(this.mParam);
            }
        }
        OnLoaded() {
        }
        OnTaskFinished() {
        }
        OnHandler(ev) {
        }
        OnInit(param) {
        }
        OnEnter(param) {
        }
        OnLeave() {
        }
        OnDestroy() {
        }
    }
    YK.SceneBase = SceneBase;
})(YK || (YK = {}));
;
(function (YK) {
    class SceneMgr extends YK.DispatchEventNode {
        constructor() {
            super();
            this.mScenes = new Map();
            this.mCurScene = null;
            if (SceneMgr.mInstance == null)
                SceneMgr.mInstance = this;
        }
        static get Instance() {
            if (this.mInstance == null)
                new SceneMgr();
            return this.mInstance;
        }
        GoToScene(script, param = null) {
            if (script.__proto__.name != "SceneBase") {
                console.error("设置的要跳转对象", script.__proto__.name, "不是场景类型！！");
                return;
            }
            if (!this.mScenes.has(script)) {
                if (this.mCurScene != null) {
                    this.mCurScene.Leave();
                }
                let scene = new script();
                this.mScenes.set(script, scene);
                this.mCurScene = scene;
                this.mCurScene.Enter(param);
            }
            else {
                let scene = this.mScenes.get(script);
                if (scene == this.mCurScene) {
                    console.error("当前场景与目标场景一样无法重新进入这个场景");
                    return;
                }
                else {
                    if (this.mCurScene != null) {
                        this.mCurScene.Leave();
                        this.mCurScene = this.mScenes.get(script);
                        this.mCurScene.Enter(param);
                    }
                }
            }
        }
    }
    SceneMgr.mInstance = null;
    YK.SceneMgr = SceneMgr;
})(YK || (YK = {}));
;
(function (YK) {
    class TaskMgr {
        constructor(failureStop, finished) {
            this.mTaskNum = 0;
            this.mFailureStop = true;
            this.mParallelTask = new Array();
            this.mSequence = new Array();
            this.mIsRuning = false;
            this.progress = 0;
            this.currentTask = null;
            this.isFinished = false;
            this.mFinished = finished;
            this.mParallelTask.splice(0, this.mParallelTask.length);
            this.mSequence.splice(0, this.mSequence.length);
            YK.TimeDelay.Instance.Remove(this.Update, this);
            YK.TimeDelay.Instance.AddUpdate(this.Update, this);
        }
        AddTask(task, isSequence = true) {
            let array;
            let ret = -1;
            if (isSequence) {
                array = this.mSequence;
            }
            else {
                array = this.mParallelTask;
            }
            let index = array.findIndex((value, index, obj) => {
                return value == task;
            });
            if (index == -1) {
                task.Id = this.mTaskNum;
                ret = task.Id;
                array.push(task);
                this.mTaskNum = this.mSequence.length + this.mParallelTask.length;
            }
            return ret;
        }
        Update() {
            if (!this.mIsRuning) {
                return;
            }
            this.OnUpdate();
        }
        OnUpdate() {
            for (var index = 0; index < this.mParallelTask.length; index++) {
                var element = this.mParallelTask[index];
                if (element.IsRuning && element.IsDone) {
                    this.mParallelTask.splice(index, 1);
                    index--;
                    this.progress = (this.mTaskNum - (this.mSequence.length + this.mParallelTask.length)) / this.mTaskNum * 100;
                    let error = element.Error;
                    if (error != null && this.mFailureStop) {
                        this.Finished(error);
                    }
                    else {
                        if (this.mTaskItemFinished) {
                            this.mTaskItemFinished.Invoke(element, this.progress);
                        }
                    }
                }
                else if (!element.IsRuning && !element.IsDone) {
                    element.OnExecute();
                    this.currentTask = element;
                }
            }
            for (var index = 0; index < this.mSequence.length; index++) {
                var element = this.mSequence[index];
                if (element.IsRuning) {
                    if (element.IsDone) {
                        this.mSequence.splice(index, 1);
                        index--;
                        let error = element.Error;
                        if (error != null && this.mFailureStop) {
                            this.Finished(error);
                        }
                        else {
                            this.progress = (this.mTaskNum - (this.mSequence.length + this.mParallelTask.length)) / this.mTaskNum * 100;
                            if (this.mTaskItemFinished) {
                                this.mTaskItemFinished.Invoke(element, this.progress);
                            }
                        }
                    }
                    break;
                }
                else if (!element.IsDone) {
                    this.currentTask = element;
                    element.OnExecute();
                }
            }
            if (this.mSequence.length + this.mParallelTask.length <= 0) {
                this.Finished();
            }
        }
        Finished(error = null) {
            this.isFinished = true;
            this.mIsRuning = false;
            this.progress = 100;
            if (this.mFinished != null) {
                this.mFinished.Invoke(error);
            }
            if (error) {
                YK.TimeDelay.Instance.Remove(this.Update, this);
            }
        }
        HasTask(id) {
            let index = this.mSequence.findIndex((value, index, obj) => {
                return value.Id == id;
            });
            index = this.mParallelTask.findIndex((value, index, obj) => {
                return value.Id == id;
            });
            return index != -1;
        }
        Stop() {
            this.mIsRuning = false;
        }
        Execute() {
            this.mIsRuning = true;
        }
    }
    YK.TaskMgr = TaskMgr;
    class TaskBase {
        constructor() {
            this.IsRuning = false;
            this.Id = 0;
            this.IsDone = false;
            this.Error = null;
        }
        TaskName() {
            return null;
        }
        OnExecute() {
            this.IsRuning = true;
        }
        Reset() {
            this.IsRuning = false;
        }
    }
    YK.TaskBase = TaskBase;
})(YK || (YK = {}));
;
(function (YK) {
    var Groot = fairygui.GRoot;
    var UIPackage = fairygui.UIPackage;
    class UIMgr extends YK.DispatchEventNode {
        constructor() {
            super();
            if (UIMgr.mInstance == null)
                UIMgr.mInstance = this;
        }
        static get Instance() {
            if (this.mInstance == null)
                new UIMgr();
            return this.mInstance;
        }
        GetAllWinds() {
            let array = new Array();
            for (var index = 0; index < Groot.inst.numChildren; index++) {
                var element = Groot.inst.getChildAt(index);
                if (element instanceof fairygui.Window) {
                    array.push(element);
                }
            }
            return array;
        }
        FindWind(type) {
            let array = this.GetAllWinds();
            return array.find((value, index, obj) => {
                return value instanceof type;
            });
        }
        ShowWind(type, param = null) {
            let wind = this.FindWind(type);
            if (wind == null) {
                wind = new type();
            }
            wind.data = param;
            fairygui.GRoot.inst.showWindow(wind);
        }
        HideWind(type) {
            let wind = this.FindWind(type);
            if (wind != null) {
                fairygui.GRoot.inst.hideWindow(wind);
            }
        }
        GetAllWind(isShow = false, containDotDel = true) {
            let keys = new Array();
            let array = this.GetAllWinds();
            array.forEach(((value, key, map) => {
                if (!isShow || value.isShowing) {
                    if (value instanceof BaseUI) {
                        let wind = value;
                        if (!value.dontDel || containDotDel) {
                            keys.push(value);
                        }
                    }
                    else {
                        keys.push(value);
                    }
                }
            }));
            return keys;
        }
        HideAllWind(dispose = false, containDotDel = false) {
            let winds = this.GetAllWind(false, containDotDel);
            winds.forEach(element => {
                if (dispose)
                    element.dispose();
                else
                    fairygui.GRoot.inst.hideWindowImmediately(element);
            });
            fairygui.GRoot.inst.hidePopup();
        }
        ShowModalWait(msg = null) {
            fairygui.GRoot.inst.showModalWait(msg);
        }
        CloseModalWait() {
            fairygui.GRoot.inst.closeModalWait();
        }
    }
    UIMgr.UIStartScale = 0.6;
    UIMgr.mInstance = null;
    YK.UIMgr = UIMgr;
    class BaseUI extends fairygui.Window {
        constructor() {
            super(...arguments);
            this.packName = "";
            this.resName = "Main";
            this.eventMgr = null;
            this.btnCloseNodeName = "BtnClose";
            this.modal = false;
            this.dontDel = false;
            this.UIObj = new Map();
            this.UICtrls = new Map();
            this.btnNameStartsWith = "Btn";
            this.isNeedShowAnimation = true;
            this.isNeedHideAnimation = true;
        }
        onInit() {
            super.onInit();
            this.eventMgr = new YK.InterchangeableEventListenerMgr(this, this.OnHandler);
            if (this.contentPane == null) {
                let windObj = UIPackage.createObject(this.packName, this.resName);
                windObj.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                this.contentPane = windObj.asCom;
            }
            this.center();
            this.UIObj.clear();
            this.UICtrls.clear();
            for (var index = 0; index < this.contentPane.numChildren; index++) {
                var element = this.contentPane.getChildAt(index);
                if (element.name.startsWith(this.btnNameStartsWith)) {
                    if (element.name == "BtnClose") {
                        element.onClick(this, this.OnBtnClose);
                    }
                    else {
                        let xx = element;
                        element.onClick(this, () => {
                            this.OnBtnClick(xx);
                        });
                    }
                }
                this.UIObj.set(element.name, element);
            }
            this.contentPane.controllers.forEach(element => {
                this.UICtrls.set(element.name, element);
            });
            this.setPivot(0.5, 0.5);
            this.OninitWind();
        }
        onHide() {
            this.data = null;
            this.eventMgr.RemoveAll();
            this.OnHideWind();
        }
        OnHandler(ev) {
        }
        doHideAnimation() {
            if (this.isNeedHideAnimation) {
                this.setScale(UIMgr.UIStartScale, UIMgr.UIStartScale);
                fairygui.tween.GTween.to(this.scaleX, 0, 0.3)
                    .onUpdate((v) => {
                    this.setScale(v.value.x, v.value.x);
                }, this)
                    .onComplete(() => {
                    super.doHideAnimation();
                }, this);
            }
            else {
                super.doHideAnimation();
            }
        }
        doShowAnimation() {
            if (this.isNeedHideAnimation) {
                this.scaleX = 0;
                this.scaleY = 0;
                fairygui.tween.GTween.to(this.scaleX, 1, 0.3)
                    .setEase(fairygui.tween.EaseType.BounceOut)
                    .onUpdate((v) => {
                    this.setScale(v.value.x, v.value.x);
                }, this)
                    .onComplete(() => {
                    super.doShowAnimation();
                }, this);
            }
            else {
                super.doShowAnimation();
            }
        }
        OnBtnClick(ev) {
        }
        OnBtnClose() {
            this.hide();
        }
        onShown() {
            super.onShown();
            this.OnShowWind();
        }
    }
    YK.BaseUI = BaseUI;
})(YK || (YK = {}));
;
(function (YK) {
    class GameFlag {
        constructor(flag = 0) {
            this.mValue = 0;
            this.mValue = flag;
        }
        get Value() {
            return this.mValue;
        }
        set Value(v) {
            this.mValue = v;
        }
        Add(flag) {
            this.mValue |= flag;
            return this;
        }
        Remove(flag) {
            this.mValue &= ~flag;
            return this;
        }
        Has(flag) {
            return (this.mValue & flag) != 0;
        }
    }
    YK.GameFlag = GameFlag;
})(YK || (YK = {}));
;
(function (YK) {
    class Log {
    }
    Log.Log = console.log;
    Log.Error = console.error;
    Log.Warn = console.warn();
    YK.Log = Log;
})(YK || (YK = {}));
;
(function (YK) {
    class TimeDelay {
        constructor() {
            this.repeat = 0;
            this.items = new Array();
            this.toAdd = new Array();
            this.toRemove = new Array();
            this.pool = new Array();
            this.lastTime = 0;
            this.deltaTime = 0;
            Laya.timer.frameLoop(0.01, this, this.update);
        }
        static get Instance() {
            if (this.mInstance == null) {
                this.mInstance = new TimeDelay();
            }
            return this.mInstance;
        }
        GetFromPool() {
            let t;
            if (this.pool.length > 0) {
                t = this.pool.pop();
            }
            else
                t = new TimeDelayData();
            return t;
        }
        ReturnToPool(t) {
            t.set(0, 0, null, null, null);
            t.elapsed = 0;
            t.deleted = false;
            this.pool.push(t);
        }
        Exists(callback, thisObj) {
            let t = this.toAdd.find((value, index, obj) => {
                return value.callback == callback && value.thisObj == thisObj;
            });
            if (t != null) {
                return true;
            }
            t = this.items.find((value, index, obj) => {
                return value.callback == callback && value.thisObj == thisObj;
            });
            if (t != null && !t.deleted) {
                return true;
            }
            return false;
        }
        Add(interval, repeat, callback, thisObj, callbackParam = null) {
            let t;
            t = this.items.find((value, index, obj) => {
                return value.callback == callback && value.thisObj == thisObj;
            });
            if (t == null) {
                t = this.toAdd.find((value, index, obj) => {
                    return value.callback == callback && value.thisObj == thisObj;
                });
            }
            if (t == null) {
                t = this.GetFromPool();
                this.toAdd.push(t);
            }
            t.set(interval, repeat, callback, thisObj, callbackParam);
            t.deleted = false;
            t.elapsed = 0;
        }
        AddUpdate(callback, thisObj, callbackParam = null) {
            this.Add(0.001, 0, callback, thisObj, callbackParam);
        }
        Remove(callback, thisObj) {
            let findindex = -1;
            let t = this.toAdd.find((value, index, obj) => {
                if (value.callback == callback && value.thisObj == thisObj) {
                    findindex = index;
                    return true;
                }
                else {
                    return false;
                }
            });
            if (t != null) {
                this.toAdd.splice(findindex, 1);
                this.ReturnToPool(t);
            }
            t = this.items.find((value, index, obj) => { return value.callback == callback && value.thisObj == thisObj; });
            if (t != null)
                t.deleted = true;
        }
        start() {
            this.lastTime = Laya.timer.currTimer;
        }
        update() {
            this.deltaTime = (Laya.timer.currTimer - this.lastTime) / 1000;
            this.lastTime = Laya.timer.currTimer;
            for (let index = 0; index < this.items.length; index++) {
                let t = this.items[index];
                if (t.deleted) {
                    this.toRemove.push(t);
                    continue;
                }
                t.elapsed += this.deltaTime;
                if (t.elapsed < t.interval) {
                    continue;
                }
                t.elapsed = 0;
                if (t.repeat > 0) {
                    t.repeat--;
                    if (t.repeat == 0) {
                        t.deleted = true;
                        this.toRemove.push(t);
                    }
                }
                this.repeat = t.repeat;
                if (t.callback != null) {
                    try {
                        t.callback.call(t.thisObj, t.param);
                    }
                    catch (error) {
                        t.deleted = true;
                    }
                }
            }
            let len = this.toRemove.length;
            while (len) {
                let t = this.toRemove.pop();
                let index = this.items.indexOf(t);
                if (t.deleted && index != -1) {
                    this.items.splice(index, 1);
                    this.ReturnToPool(t);
                }
                len--;
            }
            len = this.toAdd.length;
            while (len) {
                let t = this.toAdd.pop();
                this.items.push(t);
                len--;
            }
        }
    }
    TimeDelay.mInstance = null;
    YK.TimeDelay = TimeDelay;
    class TimeDelayData {
        set(interval, repeat, callback, thisObj, param) {
            this.interval = interval;
            this.repeat = repeat;
            this.callback = callback;
            this.param = param;
            this.thisObj = thisObj;
        }
    }
    YK.TimeDelayData = TimeDelayData;
})(YK || (YK = {}));