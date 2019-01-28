var YK;
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
var YK;
(function (YK) {
    class EventListenerMgr {
        constructor(dis = null) {
            this.mOwner = null;
            this.mListener = new Array();
            this.mOwner = dis;
        }
        addListener(type, callback, thisObj, _priority = 0, _dispatchOnce = false) {
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
var YK;
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
var YK;
(function (YK) {
    class NetMgr extends YK.DispatchEventNode {
        constructor() {
            super();
            this.httpUrl = "http://39.107.84.87:9100/?";
            this.mTimeout = 10;
            this.mHeartTimeout = 10;
            this.ip = 'ws://39.107.84.87:9023';
            this.socket = null;
            this.mMsgId = 0;
            this.mSendQueue = new Array();
            if (NetMgr.mInstance == null)
                NetMgr.mInstance = this;
            YK.TimeDelay.Instance.Add(1, 0, this.CheckSendTimeOut, this);
            this.socket = new Laya.Socket(null, null, Laya.Byte);
            this.socket.on(Laya.Event.OPEN, this, this.onopen);
            this.socket.on(Laya.Event.CLOSE, this, this.onclose);
            this.socket.on(Laya.Event.MESSAGE, this, this.onmessage);
            this.socket.on(Laya.Event.ERROR, this, this.onerror);
        }
        static get Instance() {
            if (this.mInstance == null)
                new NetMgr();
            return this.mInstance;
        }
        onDestroy() {
            YK.TimeDelay.Instance.Remove(this.CheckSendTimeOut, this);
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
        AddProto(pbName, protoNames) {
            let roots = protobuf.roots["default"][pbName];
            for (let key in protoNames) {
                let protoName = protoNames[key];
                let _class = roots[protoName];
                YK.ProtoMap.Add(protoName, _class);
            }
        }
        connect(wsurl = null) {
            wsurl = wsurl == null ? this.ip : wsurl;
            if (this.socket.connected) {
                this.onopen(null);
            }
            else {
                this.socket.connectByUrl(wsurl);
            }
        }
        onopen(ev) {
            console.log("链接服务器成功");
            YK.TimeDelay.Instance.Remove(this.sendHeartbeat, this);
            YK.TimeDelay.Instance.Remove(this.checkHeartbeat, this);
            YK.TimeDelay.Instance.Add(3, 0, this.sendHeartbeat, this);
            YK.TimeDelay.Instance.Add(3, 0, this.checkHeartbeat, this);
            this.lastActivityTime = Date.now();
            this.DispatchEventByType(NetMgrEventDef.onopen);
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
            YK.TimeDelay.Instance.Remove(this.sendHeartbeat, this);
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
        onmessage(data) {
            let head;
            {
                head = YK.ProtoMap.UnPackHead(data);
                if (head != null) {
                    this.lastActivityTime = Date.now();
                    if (head.cmd != 1) {
                        this.distributeMsg(head);
                    }
                    else {
                    }
                }
                else {
                    console.error("协议解析失败");
                }
            }
        }
        get Msgid() {
            return this.mMsgId++;
        }
        sendHeartbeat() {
            if (this.isConnect()) {
                this.Send(1);
            }
        }
        checkHeartbeat() {
            if (Date.now() - this.lastActivityTime > 10 * 1000) {
                this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
            }
        }
        msgTimeOut(head) {
            if (head.cmd == 1) {
                this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时");
            }
            else {
                let ev = new YK.ResponseMessageEvent(head.cmd.toString());
                head.errorcode = -1;
                ev.SetData(head, null);
                console.error("消息返回超时id=" + head.cmd);
                this.DispatchEvent(ev);
            }
        }
        SendGet(url, callback) {
            url = this.httpUrl + url;
            console.log(url);
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
        Send(id, data = null) {
            let head = new YK.PackBase();
            head.cmd = id;
            head.errorcode = 0;
            head.msgid = this.Msgid;
            let sendData = {
                head: head,
                sendTime: Date.now()
            };
            if (this.isConnect()) {
                let buffer = YK.ProtoMap.Pack(head, data);
                if (id != 1) {
                    console.log("发送消息给服务器》");
                    console.log(head);
                    console.log(data);
                    this.mSendQueue.push(sendData);
                }
                this.socket.send(buffer);
            }
            else {
                console.error("网络断开无法发送消息");
            }
        }
        distributeMsg(head) {
            let msg = YK.ProtoMap.UnPack(head);
            console.log("收到服务返回的消息信息头：");
            console.log(head);
            if (head.errorcode != null && head.errorcode != 0) {
                console.warn("服务器返回错误码  消息id：" + head.cmd + "/errorcode=" + head.errorcode);
            }
            if (head == null || head.cmd == null) {
                console.warn("服务器返回无效的cmdid");
            }
            else {
                let index = this.mSendQueue.findIndex((obj, index, any) => {
                    return obj.head.msgid == head.msgid && obj.head.cmd == head.cmd;
                });
                if (index != -1) {
                    this.mSendQueue.splice(index, 1);
                }
                let ev = new YK.ResponseMessageEvent(head.cmd.toString());
                ev.SetData(head, msg);
                this.DispatchEvent(ev);
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
var YK;
(function (YK) {
    class PackBase {
        constructor() {
            this.cmd = 0;
            this.msgid = 0;
            this.errorcode = 0;
            this.contentBuff = null;
        }
    }
    YK.PackBase = PackBase;
})(YK || (YK = {}));
var YK;
(function (YK) {
    class ProtoMap {
        static Add(key, type) {
            this.classMap[key] = type;
        }
        static Pack(head, data = null) {
            let proto = this.protos[head.cmd];
            if (proto == null) {
                console.error("尝试封包一个没有注册的消息 id=" + head.cmd);
                return null;
            }
            let _c = proto.request;
            if (_c != null && data != null) {
                head.contentBuff = this.PackByClasName(_c, data);
            }
            return this.PackByClasName("packbase", head);
        }
        static UnPack(head, buff = null) {
            let proto = this.protos[head.cmd];
            if (proto == null) {
                console.error("尝试解包一个没有注册的消息 id=" + head.cmd);
                return null;
            }
            let _c = proto.response;
            if (_c != null) {
                buff = buff == null ? head.contentBuff : buff;
                return this.UnPackByClasName(_c, buff);
            }
            else {
                return null;
            }
        }
        static UnPackHead(buffer) {
            if (buffer == null || buffer.byteLength == 0)
                return null;
            return this.UnPackByClasName("packbase", buffer);
        }
        static PackByClasName(cname, data) {
            let c = this.classMap[cname];
            if (c != null) {
                let obj = new c(data);
                return c.encode(obj).finish();
            }
            else {
                console.error("反序列化一条没有实现的消息id：" + cname);
            }
            return null;
        }
        static UnPackByClasName(cname, buff) {
            let c = this.classMap[cname];
            if (c != null && buff != null) {
                let bf = new Uint8Array(buff);
                return c.decode(bf);
            }
            if (c == null) {
                console.error("反序列化一条没有实现的消息id：" + cname);
            }
            return null;
        }
        static AddProto(proto) {
            if (this.protos[proto.id] != null) {
                console.log(this.protos);
                console.error("不能重复注册消息  id=" + proto.id);
            }
            this.protos[proto.id] = proto;
        }
    }
    ProtoMap.protos = {
        1: {
            id: 1,
            request: null,
            response: null,
        },
    };
    ProtoMap.classMap = {};
    YK.ProtoMap = ProtoMap;
})(YK || (YK = {}));
var YK;
(function (YK) {
    class ResponseMessageEvent extends YK.EventData {
        constructor(type) {
            super(type, null);
            this.data = null;
        }
        SetData(head, msg) {
            this.cmd = head.cmd.toString();
            this.data = { head: head, msg: msg };
        }
        get Data() {
            return this.data;
        }
    }
    YK.ResponseMessageEvent = ResponseMessageEvent;
})(YK || (YK = {}));
var YK;
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
var YK;
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
            if (this.mLoaded && this.mTaskFinished) {
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
var YK;
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
var YK;
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
            console.log("msg =" + msg);
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
            this.isNeedShowAnimation = false;
            this.isNeedHideAnimation = false;
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
var YK;
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
var YK;
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
var YK;
(function (YK) {
    class Log {
    }
    Log.Log = console.log;
    Log.Error = console.error;
    Log.Warn = console.warn();
    YK.Log = Log;
})(YK || (YK = {}));
var YK;
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
