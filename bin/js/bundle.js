var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// module netpack
// {
class ProtocolDef {
}
ProtocolDef.ProtocolNames = [
    "test",
    "packbase",
    "UserData",
    "loginReq",
    "loginResp",
    "tickOutEvent",
    "ParamConfig",
    "PrivateRoomInfo",
    "roomIdData",
    "PrivateDeskInfoReply",
    "MatchPlayer",
    "CallOpInfo",
    "OpReq",
    "OpEvent",
    "GameStartEvent",
    "opData",
    "DissRoleRep",
    "DissRoomData",
    "GameOverPlayerData",
    "ParamConfigList",
];
ProtocolDef.Protocols = [
    {
        id: 100,
        request: "test",
        response: "test",
    },
    {
        id: 101,
        request: "test",
        response: "",
    },
    {
        id: 200,
        request: "loginReq",
        response: "loginResp",
    },
    {
        id: 201,
        request: null,
        response: "tickOutEvent",
    },
    {
        id: 401,
        request: "ParamConfigList",
        response: "PrivateDeskInfoReply",
    },
    {
        id: 402,
        request: "roomIdData",
        response: "PrivateDeskInfoReply",
    },
    {
        id: 403,
        request: null,
        response: null,
    },
    {
        id: 404,
        request: null,
        response: "CallOpInfo",
    },
    {
        id: 405,
        request: null,
        response: "GameStartEvent",
    },
    {
        id: 406,
        request: "OpReq",
        response: null,
    },
    {
        id: 407,
        request: null,
        response: "OpEvent",
    },
    {
        id: 408,
        request: "roomIdData",
        response: "opData",
    },
    {
        id: 409,
        request: null,
        response: "DissRoomData",
    },
    {
        id: 410,
        request: null,
        response: "CallOpInfo",
    },
    {
        id: 411,
        request: null,
        response: null,
    },
    {
        id: 412,
        request: null,
        response: null,
    },
    {
        id: 413,
        request: null,
        response: "MatchPlayer",
    },
];
exports.default = ProtocolDef;
class ActionType {
}
ActionType.test = 100;
ActionType.TestUserData = 101;
ActionType.login = 200;
ActionType.tickOutPlayer = 201;
ActionType.CreatePrivRoomReq = 401;
ActionType.LoginPirvRoom = 402;
ActionType.userReady = 403;
ActionType.userReadyEvent = 404;
ActionType.PrivGameStart = 405;
ActionType.PrivOp = 406;
ActionType.PrivOpEvent = 407;
ActionType.userReturn = 408;
ActionType.userDissEvent = 409;
ActionType.userReturnEvent = 410;
ActionType.privGameOverEvent = 411;
ActionType.privGameEndEvent = 412;
ActionType.loginPirvRoomEvent = 413;
exports.ActionType = ActionType;
class ErrorCode {
    static Add(id, msg) {
        ErrorCode.errorDic.set(id, msg);
        return id;
    }
    static Get(id) {
        if (ErrorCode.errorDic.has(id))
            return ErrorCode.Get(id);
        return "未知错误：id=" + id;
    }
}
ErrorCode.errorDic = new Map();
ErrorCode.SystemError = {
    success: ErrorCode.Add(0, "请求成功"),
    unknow: ErrorCode.Add(1, "未知错误"),
    argument: ErrorCode.Add(2, "参数错误"),
    protoNotExists: ErrorCode.Add(3, "不存在此协议"),
    serviceIsStoped: ErrorCode.Add(4, "服务故障"),
    sessionNotExists: ErrorCode.Add(5, "不存在此Session"),
    moduleNotImpl: ErrorCode.Add(6, "此模块未实现"),
    protoNotImpl: ErrorCode.Add(7, "此协议未实现"),
    noLogin: ErrorCode.Add(8, "尚未登录"),
    packHeaderNil: ErrorCode.Add(9, "包头是空的"),
    forward: ErrorCode.Add(10, "重定向"),
    serverMaintenance: ErrorCode.Add(11, "服务器维护"),
    busy: ErrorCode.Add(12, "服务忙"),
    logined: ErrorCode.Add(13, "已登录"),
    dbServerStoped: ErrorCode.Add(14, "数据服务故障"),
    noLoginGame: ErrorCode.Add(15, "未进入游戏"),
    notOnline: ErrorCode.Add(16, "玩家不在线"),
    saveCacheFailed: ErrorCode.Add(17, "写入缓存失败"),
    logoutingGame: ErrorCode.Add(18, "正在退出游戏中"),
    noUseableService: ErrorCode.Add(19, "没有可用的服务"),
    sessionInvalid: ErrorCode.Add(20, "此session是非法的"),
    sessionTimeout: ErrorCode.Add(21, "此session已过期"),
    sessionNoMatch: ErrorCode.Add(22, "会话不匹配"),
    serviceNotImpl: ErrorCode.Add(23, "此服务未实现"),
    functionNotOpen: ErrorCode.Add(24, "此功能尚未开放"),
    serviceIsOpened: ErrorCode.Add(25, "服务已开放"),
    serviceIsClosed: ErrorCode.Add(26, "服务已关闭"),
    serviceIsOffline: ErrorCode.Add(27, "服务已下线"),
    msgTimeOut: ErrorCode.Add(-1, "超时"),
};
ErrorCode.authError = {
    loginAccountFill: ErrorCode.Add(1001, "账号或者密码错误"),
    accountExist: ErrorCode.Add(1002, "账号重复"),
    accountAndPwdIsNull: ErrorCode.Add(1003, "账号或者密码不能为空"),
    roleIdNoExist: ErrorCode.Add(1004, "无效的用户id或者token无效"),
};
exports.ErrorCode = ErrorCode;
// }

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleMode extends YK.IMode {
    constructor() {
        super(...arguments);
        this.accountInfo = { userid: 0, token: "" };
    }
    OnInitData(param) {
        this.eventMgr.setNetCallback(this.OnNetEvenet, 99);
        this.eventMgr.addNetEvent(200);
    }
    OnClear() {
    }
    OnDestroy() {
        super.OnDestroy();
    }
    OnNetEvenet(ev) {
        if (ev.Data.head.errorcode == 0) {
            if (ev.Data.head.cmd == 200) {
                this.OnLoginResp(ev.Data.msg);
            }
        }
    }
    SendHttpLogin(account, pwd, callBack) {
        YK.NetMgr.Instance.SendGet("modeName=account&api=login&account=" + account + "&pwd=" + pwd, new YK.Func(this, (res) => {
            if (res != null && res.errorcode == 0) {
                this.accountInfo.token = res.data.token;
                this.accountInfo.userid = res.data.userid;
            }
            if (callBack != null) {
                callBack.Invoke(res);
            }
        }));
    }
    /**
     * 发送登陆
     * @param userid 用户id
     * @param token 账号token
     */
    SendLogin() {
        let sendData = { token: this.accountInfo.token, roleid: this.accountInfo.userid };
        YK.NetMgr.Instance.Send(200, sendData);
    }
    /**
     * 登陆返回
     * @param loginResp 登陆的返回信息
     */
    OnLoginResp(loginResp) {
        this.roleInfo = loginResp.roleinfo;
    }
}
exports.default = RoleMode;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProtocolDef_1 = require("../Defs/ProtocolDef");
var SceneBase = YK.SceneBase;
const LoginScene_1 = require("./LoginScene");
const WaitWind_1 = require("../Winds/WaitWind");
const LoadingWind_1 = require("../Winds/LoadingWind");
class LoadingScene extends SceneBase {
    OnInit(param) {
        super.OnInit(param);
        this.needLoadRes.add("res/source/Loading_atlas_vckm32.jpg", Laya.Loader.IMAGE, true)
            .add("res/source/Loading_atlas0.png", Laya.Loader.IMAGE, true)
            .add("res/source/Loading.bin", Laya.Loader.BUFFER, true, true);
        this.initNeedLoadTask = new YK.LoadGruopInfo();
        this.initNeedLoadTask.add("res/external/BasePack_atlas0.png", Laya.Loader.IMAGE, true)
            .add("res/external/BasePack.bin", Laya.Loader.BUFFER, true, true)
            .onItemCompletion(this.loadItemCompletion, this)
            .onCompletion(this.loadGameResFinish, this);
    }
    loadItemCompletion() {
        console.log(this.initNeedLoadTask.Progress);
        let ev = new LoadingProgressEvenet();
        ev.Progress = this.initNeedLoadTask.Progress;
        YK.UIMgr.Instance.DispatchEvent(ev);
    }
    /**
     * 资源加载完成
     */
    loadGameResFinish() {
        fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIConfig.globalModalWaiting, WaitWind_1.default);
        this.AddProto();
        ProtocolDef_1.default.Protocols.forEach(element => {
            YK.ProtoMap.AddProto(element);
        });
    }
    AddProto() {
        YK.NetMgr.Instance.AddProto("netpack", ProtocolDef_1.default.ProtocolNames);
        this.StartGame();
    }
    StartGame() {
        let ev = new LoadingProgressEvenet();
        ev.Progress = 100;
        YK.UIMgr.Instance.DispatchEvent(ev);
        YK.SceneMgr.Instance.GoToScene(LoginScene_1.default);
    }
    OnEnter(param) {
        super.OnEnter(param);
        YK.UIMgr.Instance.ShowWind(LoadingWind_1.default);
        this.initNeedLoadTask.start();
    }
    OnHandler(ev) {
        super.OnHandler(ev);
    }
    OnLeave() {
        super.OnLeave();
    }
    OnDestroy() {
        super.OnDestroy();
    }
    OnLoaded() {
        super.OnLoaded();
    }
    OnTaskFinished() {
        super.OnTaskFinished();
    }
}
exports.default = LoadingScene;

},{"../Defs/ProtocolDef":1,"../Winds/LoadingWind":6,"../Winds/WaitWind":10,"./LoginScene":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneBase = YK.SceneBase;
const LoginWind_1 = require("../Winds/LoginWind");
class LoginScene extends SceneBase {
    constructor() {
        super(...arguments);
        this.firstWind = LoginWind_1.default;
    }
    OnInit(param) {
        super.OnInit(param);
        this.needLoadRes
            .add("res/external/LoginPack.bin", Laya.Loader.BUFFER, true, true)
            .add("res/external/BasePack.bin", Laya.Loader.BUFFER, true, true)
            .add("res/external/BasePack_atlas0.png", Laya.Loader.IMAGE, true);
    }
    OnEnter(param) {
        super.OnEnter(param);
    }
    OnHandler(ev) {
        super.OnHandler(ev);
    }
    OnLeave() {
        super.OnLeave();
    }
    OnDestroy() {
        super.OnDestroy();
    }
    OnLoaded() {
        super.OnLoaded();
    }
    OnTaskFinished() {
        super.OnTaskFinished();
    }
}
exports.default = LoginScene;

},{"../Winds/LoginWind":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainWind_1 = require("../Winds/MainWind");
class MainScene extends YK.SceneBase {
    constructor() {
        super(...arguments);
        this.firstWind = MainWind_1.default;
    }
    OnInit(param) {
        super.OnInit(param);
        this.needLoadRes.add("res/external/MainPack_atlas0.png", Laya.Loader.IMAGE, true);
        this.needLoadRes.add("res/external/MainPack.bin", Laya.Loader.BUFFER, true, true);
    }
    OnEnter(param) {
        super.OnEnter(param);
    }
    OnHandler(ev) {
        super.OnHandler(ev);
    }
    OnLeave() {
        super.OnLeave();
    }
    OnDestroy() {
        super.OnDestroy();
    }
    OnLoaded() {
        super.OnLoaded();
    }
    OnTaskFinished() {
        super.OnTaskFinished();
    }
}
exports.default = MainScene;

},{"../Winds/MainWind":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoadingWind extends YK.BaseUI {
    constructor() {
        super(...arguments);
        this.packName = "Loading";
        this.resName = "loadingWind";
        this.modal = false;
        this.dontDel = true;
        this.btnNameStartsWith = "Btn";
        this.isNeedShowAnimation = false;
        this.isNeedHideAnimation = false;
        this.mProgress = 0;
        this.mShowInfoString = "正在加载...";
    }
    OninitWind() {
        this.mlabelProgress = this.UIObj.get("labelProgress");
        this.mlablMsg = this.UIObj.get("lablMsg");
        this.mlabelProgress.text = "0%";
    }
    OnShowWind() {
        this.eventMgr.addUIEvent(LoadingProgressEvenet.EventID);
        this.mProgress = 0;
        this.mShowInfoString = "正在加载...";
        this.mlabelProgress.text = this.mProgress.toFixed() + "%";
    }
    OnHideWind() {
    }
    OnHandler(ev) {
        switch (ev.cmd) {
            case LoadingProgressEvenet.EventID:
                this.RefreshInfo(ev);
                break;
        }
    }
    RefreshInfo(ev) {
        this.mProgress = ev.data.progress;
        this.mlabelProgress.text = this.mProgress.toFixed() + "%";
    }
}
exports.default = LoadingWind;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoleMode_1 = require("../Modes/RoleMode");
const LoadingWind_1 = require("./LoadingWind");
const MessageBox_1 = require("./MessageBox");
const MainScene_1 = require("../Scenes/MainScene");
class LoginWind extends YK.BaseUI {
    constructor() {
        super(...arguments);
        this.packName = "LoginPack";
        this.resName = "LoginWindow";
        this.modal = false;
        this.dontDel = true;
        this.btnNameStartsWith = "Btn";
        this.isNeedShowAnimation = false;
        this.isNeedHideAnimation = false;
    }
    OninitWind() {
        this.eventMgr.setNetCallback(this.OnNetMsg);
        this.mLabelAcc = this.UIObj.get("LabelAcc");
        this.mLabelPass = this.UIObj.get("LabelPass");
    }
    OnShowWind() {
        YK.UIMgr.Instance.HideWind(LoadingWind_1.default);
        this.eventMgr.addNetEvent(200);
        this.eventMgr.addNetEvent(YK.NetMgrEventDef.onopen);
        this.eventMgr.addNetEvent(YK.NetMgrEventDef.onerror);
        this.eventMgr.addModeEvent(YK.ModeMgr.EventType.SENDINITMSGOK);
    }
    OnHideWind() {
    }
    OnBtnClick(ev) {
        super.OnBtnClick(ev);
        if (ev.name == "BtnLogin") {
            this.HttpLogin();
        }
    }
    HttpLogin() {
        if (this.mLabelAcc.text == "" || this.mLabelPass.text == "") {
            MessageBox_1.default.Create("请输入账号密码").Show();
        }
        else {
            YK.UIMgr.Instance.ShowModalWait();
            YK.ModeMgr.Instance.GetMode(RoleMode_1.default).SendHttpLogin(this.mLabelAcc.text, this.mLabelPass.text, new YK.Func(this, (res) => {
                if (res != null) {
                    if (res.errorcode == 0) {
                        this.ConnectServer();
                    }
                    else {
                        YK.UIMgr.Instance.CloseModalWait();
                        MessageBox_1.default.Create(res.msg).Show();
                    }
                }
                else {
                    YK.UIMgr.Instance.CloseModalWait();
                    MessageBox_1.default.Create("登陆失败尝试重新登陆").Show();
                }
            }));
        }
    }
    ConnectServer() {
        YK.NetMgr.Instance.connect();
    }
    OnConnetServer() {
        YK.ModeMgr.Instance.GetMode(RoleMode_1.default).SendLogin();
    }
    OnLogin(ev) {
        YK.UIMgr.Instance.CloseModalWait();
        if (ev.head.errorcode == 0) {
            YK.UIMgr.Instance.ShowModalWait();
            YK.ModeMgr.Instance.SendInitMsg();
        }
        else {
            MessageBox_1.default.Create(ev.msg).Show();
        }
    }
    OnInitMsged() {
        console.error("开始游戏");
        YK.UIMgr.Instance.CloseModalWait();
        YK.SceneMgr.Instance.GoToScene(MainScene_1.default);
    }
    OnConnetServerError(error) {
        MessageBox_1.default.Create("链接服务器失败，尝试重连")
            .SetBtnConfirmCallBack(new YK.Func(this, () => {
            this.ConnectServer();
        }), "重试")
            .Show();
    }
    OnNetMsg(ev) {
        if (ev.cmd == YK.NetMgrEventDef.onopen) {
            this.OnConnetServer();
        }
        else if (ev.cmd == YK.NetMgrEventDef.onerror
            || ev.cmd == YK.NetMgrEventDef.onclose) {
            this.OnConnetServerError(ev.data);
        }
        else {
            if (ev.Data.head.cmd == 200) {
                this.OnLogin(ev.Data);
            }
        }
    }
    OnHandler(ev) {
        if (ev.cmd == YK.ModeMgr.EventType.SENDINITMSGOK) {
            this.OnInitMsged();
        }
    }
}
exports.default = LoginWind;

},{"../Modes/RoleMode":2,"../Scenes/MainScene":5,"./LoadingWind":6,"./MessageBox":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MainWind extends YK.BaseUI {
    constructor() {
        super(...arguments);
        this.packName = "MainPack";
        this.resName = "MainWindow";
        this.modal = false;
        this.btnNameStartsWith = "Btn";
        this.isNeedShowAnimation = false;
        this.isNeedHideAnimation = false;
    }
    OninitWind() {
    }
    OnShowWind() {
    }
    OnHideWind() {
    }
    OnHandler(ev) {
    }
}
exports.default = MainWind;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageBox extends YK.BaseUI {
    constructor() {
        super(...arguments);
        this.modal = true;
        this.dontDel = true;
        this.packName = "BasePack";
        this.resName = "MessageBox";
        this.clickBbackgroundClose = false;
        this.mData = null;
    }
    static Create(content) {
        if (this.mMessageBoxDataPools.length > 0) {
            let da = this.mMessageBoxDataPools.pop();
            da.SetContent(content);
            return da;
        }
        return new MessageBoxData(content);
    }
    dispose() {
        super.dispose();
        MessageBox.mMessageBoxDataPools.splice(0, MessageBox.mMessageBoxDataPools.length);
    }
    OnBtnClick(ev) {
        super.OnBtnClick(ev);
        if (ev == this.BtnOK) {
            if (this.mData.BtnOkCallBack != null)
                this.mData.BtnOkCallBack.Invoke();
            this.OnBtnClose();
        }
        else if (ev == this.BtnCancel) {
            if (this.mData.BtnCancelCallBack != null)
                this.mData.BtnCancelCallBack.Invoke();
            this.OnBtnClose();
        }
        else if (ev == this.BtnConfirm) {
            if (this.mData.BtnBtnConfirmCallBack != null)
                this.mData.BtnBtnConfirmCallBack.Invoke();
            this.OnBtnClose();
        }
    }
    OninitWind() {
        this.BtnOK = this.UIObj.get("BtnOK");
        this.BtnCancel = this.UIObj.get("BtnCancel");
        this.BtnConfirm = this.UIObj.get("BtnConfirm");
        this.labelMsg = this.UIObj.get("labelMsg");
    }
    OnShowWind() {
        this.mData = this.data;
        if (this.mData.type == MessageBoxType.None) {
        }
        else if (this.mData.type == MessageBoxType.ShowConfirm) {
            this.BtnConfirm.text = this.mData.labBtnConfirmStr;
        }
        else {
            this.BtnOK.text = this.mData.labBtnOkStr;
            this.BtnCancel.text = this.mData.labBtnCancelStr;
        }
        this.UICtrls.get("stateCtrl").selectedIndex = this.mData.type;
        this.labelMsg.text = this.mData.content;
    }
    OnHideWind() {
        if (this.mData != null) {
            this.mData.reset();
            MessageBox.mMessageBoxDataPools.push(this.mData);
            this.mData = null;
        }
    }
}
MessageBox.mMessageBoxDataPools = new Array();
exports.default = MessageBox;
var MessageBoxType;
(function (MessageBoxType) {
    MessageBoxType[MessageBoxType["None"] = 0] = "None";
    MessageBoxType[MessageBoxType["ShowConfirm"] = 1] = "ShowConfirm";
    MessageBoxType[MessageBoxType["ShowOkAndCancel"] = 2] = "ShowOkAndCancel";
})(MessageBoxType || (MessageBoxType = {}));
class MessageBoxData {
    constructor(content) {
        this.content = null;
        this.BtnOkCallBack = null;
        this.labBtnOkStr = null;
        this.BtnCancelCallBack = null;
        this.labBtnCancelStr = null;
        this.BtnBtnConfirmCallBack = null;
        this.labBtnConfirmStr = null;
        this.content = content;
    }
    get type() {
        let t = MessageBoxType.None;
        if (this.BtnBtnConfirmCallBack != null) {
            t = MessageBoxType.ShowConfirm;
        }
        else if (this.BtnOkCallBack != null || this.BtnCancelCallBack != null) {
            t = MessageBoxType.ShowOkAndCancel;
        }
        return t;
    }
    SetBtnOkAndCancelCallBack(okCallBack, okStr = "好的", cancelCallBack = null, cancelStr = "好的") {
        this.BtnOkCallBack = okCallBack;
        this.labBtnOkStr = okStr;
        this.BtnCancelCallBack = cancelCallBack;
        this.labBtnCancelStr = cancelStr;
        return this;
    }
    SetBtnConfirmCallBack(callBack, labStr = "确定") {
        this.BtnBtnConfirmCallBack = callBack;
        this.labBtnConfirmStr = labStr;
        this.BtnOkCallBack = null;
        this.labBtnOkStr = null;
        this.BtnCancelCallBack = null;
        this.labBtnCancelStr = null;
        return this;
    }
    SetContent(content) {
        this.content = content;
    }
    reset() {
        this.BtnOkCallBack = null;
        this.labBtnOkStr = null;
        this.BtnCancelCallBack = null;
        this.labBtnCancelStr = null;
        this.BtnBtnConfirmCallBack = null;
        this.labBtnConfirmStr = null;
        this.content = null;
    }
    Show() {
        YK.UIMgr.Instance.ShowWind(MessageBox, this);
    }
}

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WaitWind extends fairygui.GComponent {
    constructor() {
        super();
    }
    constructFromXML(xml) {
        super.constructFromXML(xml);
        this.displayObject.on(Laya.Event.DISPLAY, this, this.__onShown);
        this.displayObject.on(Laya.Event.UNDISPLAY, this, this.__onHidden);
        this.lablMsg = this.getChild("lablMsg").asTextField;
        this.lablMsg = this.getChild("lablMsg").asTextField;
        this.state = this.getController("c1");
    }
    set text(value) {
        if (value != null) {
            this.lablMsg.text = value;
        }
        else {
            this.lablMsg.text = "";
        }
    }
    __onShown() {
        YK.TimeDelay.Instance.Remove(this.ShownLoadingRing, this);
        YK.TimeDelay.Instance.Remove(this.TimeOut, this);
        YK.TimeDelay.Instance.Add(1, 1, this.ShownLoadingRing, this);
        YK.TimeDelay.Instance.Add(10, 1, this.TimeOut, this);
        this.state.selectedIndex = 1;
    }
    __onHidden() {
        YK.TimeDelay.Instance.Remove(this.ShownLoadingRing, this);
        YK.TimeDelay.Instance.Remove(this.TimeOut, this);
    }
    ShownLoadingRing() {
        this.state.selectedIndex = 0;
    }
    /**
     * 十秒自动关闭
     */
    TimeOut() {
        fairygui.GRoot.inst.closeModalWait();
    }
}
exports.default = WaitWind;

},{}],11:[function(require,module,exports){
"use strict";
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏初始化配置;
*/
class GameConfig {
    constructor() { }
    static init() {
        var reg = Laya.ClassUtils.regClass;
    }
}
GameConfig.width = 640;
GameConfig.height = 1136;
GameConfig.scaleMode = "fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;
exports.default = GameConfig;
GameConfig.init();

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameConfig_1 = require("./GameConfig");
const ProtocolDef_1 = require("./Game/Defs/ProtocolDef");
const RoleMode_1 = require("./Game/Modes/RoleMode");
const LoadingScene_1 = require("./Game/Scenes/LoadingScene");
class Main {
    constructor() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    onVersionLoaded() {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    }
    onConfigLoaded() {
        fairygui.UIConfig.packageFileExtension = "bin";
        fairygui.UIConfig.bringWindowToFrontOnClick = false;
        //加载IDE指定的场景
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
        this.initGame();
    }
    initGame() {
        fairygui.UIConfig.globalModalWaiting = "ui://Loading/waitWind";
        YK.NetMgr.Instance.AddProto("netpack", ProtocolDef_1.default.ProtocolNames);
        YK.ModeMgr.Instance.AddMode(RoleMode_1.default);
        YK.ModeMgr.Instance.InitData();
        YK.SceneMgr.Instance.GoToScene(LoadingScene_1.default);
    }
}
//激活启动类
new Main();

},{"./Game/Defs/ProtocolDef":1,"./Game/Modes/RoleMode":2,"./Game/Scenes/LoadingScene":3,"./GameConfig":11}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFLmFwcC9Db250ZW50cy9SZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvR2FtZS9EZWZzL1Byb3RvY29sRGVmLnRzIiwic3JjL0dhbWUvTW9kZXMvUm9sZU1vZGUudHMiLCJzcmMvR2FtZS9TY2VuZXMvTG9hZGluZ1NjZW5lLnRzIiwic3JjL0dhbWUvU2NlbmVzL0xvZ2luU2NlbmUudHMiLCJzcmMvR2FtZS9TY2VuZXMvTWFpblNjZW5lLnRzIiwic3JjL0dhbWUvV2luZHMvTG9hZGluZ1dpbmQudHMiLCJzcmMvR2FtZS9XaW5kcy9Mb2dpbldpbmQudHMiLCJzcmMvR2FtZS9XaW5kcy9NYWluV2luZC50cyIsInNyYy9HYW1lL1dpbmRzL01lc3NhZ2VCb3gudHMiLCJzcmMvR2FtZS9XaW5kcy9XYWl0V2luZC50cyIsInNyYy9HYW1lQ29uZmlnLnRzIiwic3JjL01haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkEsaUJBQWlCO0FBQ2pCLElBQUk7QUFDSDs7QUFFZSx5QkFBYSxHQUMzQjtJQUNDLE1BQU07SUFDTixVQUFVO0lBQ1YsVUFBVTtJQUNWLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztJQUNkLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsWUFBWTtJQUNaLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsWUFBWTtJQUNaLE9BQU87SUFDUCxTQUFTO0lBQ1QsZ0JBQWdCO0lBQ2hCLFFBQVE7SUFDUixhQUFhO0lBQ2IsY0FBYztJQUNkLG9CQUFvQjtJQUNwQixpQkFBaUI7Q0FFakIsQ0FBQTtBQUNhLHFCQUFTLEdBQWU7SUFDckM7UUFDQyxFQUFFLEVBQUUsR0FBRztRQUNQLE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxF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QUFDO0NBQ0o7QUFDRCxPQUFPO0FBQ1AsSUFBSSxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgbmV0cGFja1xuLy8ge1xuXHRleHBvcnQgZGVmYXVsdCAgY2xhc3MgUHJvdG9jb2xEZWYgXG5cdHtcblx0XHRwdWJsaWMgc3RhdGljIFByb3RvY29sTmFtZXMgPVxuXHRcdFtcblx0XHRcdFwidGVzdFwiLFxuXHRcdFx0XCJwYWNrYmFzZVwiLFxuXHRcdFx0XCJVc2VyRGF0YVwiLFxuXHRcdFx0XCJsb2dpblJlcVwiLFxuXHRcdFx0XCJsb2dpblJlc3BcIixcblx0XHRcdFwidGlja091dEV2ZW50XCIsXG5cdFx0XHRcIlBhcmFtQ29uZmlnXCIsXG5cdFx0XHRcIlByaXZhdGVSb29tSW5mb1wiLFxuXHRcdFx0XCJyb29tSWREYXRhXCIsXG5cdFx0XHRcIlByaXZhdGVEZXNrSW5mb1JlcGx5XCIsXG5cdFx0XHRcIk1hdGNoUGxheWVyXCIsXG5cdFx0XHRcIkNhbGxPcEluZm9cIixcblx0XHRcdFwiT3BSZXFcIixcblx0XHRcdFwiT3BFdmVudFwiLFxuXHRcdFx0XCJHYW1lU3RhcnRFdmVudFwiLFxuXHRcdFx0XCJvcERhdGFcIixcblx0XHRcdFwiRGlzc1JvbGVSZXBcIixcblx0XHRcdFwiRGlzc1Jvb21EYXRhXCIsXG5cdFx0XHRcIkdhbWVPdmVyUGxheWVyRGF0YVwiLFxuXHRcdFx0XCJQYXJhbUNvbmZpZ0xpc3RcIixcblxuXHRcdF1cblx0XHRwdWJsaWMgc3RhdGljIFByb3RvY29sczogQXJyYXk8YW55PiA9IFtcblx0XHRcdHtcblx0XHRcdFx0aWQ6IDEwMCxcblx0XHRcdFx0cmVxdWVzdDogXCJ0ZXN0XCIsXG5cdFx0XHRcdHJlc3BvbnNlOiBcInRlc3RcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiAxMDEsXG5cdFx0XHRcdHJlcXVlc3Q6IFwidGVzdFwiLFxuXHRcdFx0XHRyZXNwb25zZTogXCJcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiAyMDAsXG5cdFx0XHRcdHJlcXVlc3Q6IFwibG9naW5SZXFcIixcblx0XHRcdFx0cmVzcG9uc2U6IFwibG9naW5SZXNwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogMjAxLFxuXHRcdFx0XHRyZXF1ZXN0OiBudWxsLFxuXHRcdFx0XHRyZXNwb25zZTogXCJ0aWNrT3V0RXZlbnRcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiA0MDEsXG5cdFx0XHRcdHJlcXVlc3Q6IFwiUGFyYW1Db25maWdMaXN0XCIsXG5cdFx0XHRcdHJlc3BvbnNlOiBcIlByaXZhdGVEZXNrSW5mb1JlcGx5XCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogNDAyLFxuXHRcdFx0XHRyZXF1ZXN0OiBcInJvb21JZERhdGFcIixcblx0XHRcdFx0cmVzcG9uc2U6IFwiUHJpdmF0ZURlc2tJbmZvUmVwbHlcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiA0MDMsXG5cdFx0XHRcdHJlcXVlc3Q6IG51bGwsXG5cdFx0XHRcdHJlc3BvbnNlOiBudWxsLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0aWQ6IDQwNCxcblx0XHRcdFx0cmVxdWVzdDogbnVsbCxcblx0XHRcdFx0cmVzcG9uc2U6IFwiQ2FsbE9wSW5mb1wiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0aWQ6IDQwNSxcblx0XHRcdFx0cmVxdWVzdDogbnVsbCxcblx0XHRcdFx0cmVzcG9uc2U6IFwiR2FtZVN0YXJ0RXZlbnRcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiA0MDYsXG5cdFx0XHRcdHJlcXVlc3Q6IFwiT3BSZXFcIixcblx0XHRcdFx0cmVzcG9uc2U6IG51bGwsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogNDA3LFxuXHRcdFx0XHRyZXF1ZXN0OiBudWxsLFxuXHRcdFx0XHRyZXNwb25zZTogXCJPcEV2ZW50XCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogNDA4LFxuXHRcdFx0XHRyZXF1ZXN0OiBcInJvb21JZERhdGFcIixcblx0XHRcdFx0cmVzcG9uc2U6IFwib3BEYXRhXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogNDA5LFxuXHRcdFx0XHRyZXF1ZXN0OiBudWxsLFxuXHRcdFx0XHRyZXNwb25zZTogXCJEaXNzUm9vbURhdGFcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiA0MTAsXG5cdFx0XHRcdHJlcXVlc3Q6IG51bGwsXG5cdFx0XHRcdHJlc3BvbnNlOiBcIkNhbGxPcEluZm9cIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiA0MTEsXG5cdFx0XHRcdHJlcXVlc3Q6IG51bGwsXG5cdFx0XHRcdHJlc3BvbnNlOiBudWxsLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0aWQ6IDQxMixcblx0XHRcdFx0cmVxdWVzdDogbnVsbCxcblx0XHRcdFx0cmVzcG9uc2U6IG51bGwsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRpZDogNDEzLFxuXHRcdFx0XHRyZXF1ZXN0OiBudWxsLFxuXHRcdFx0XHRyZXNwb25zZTogXCJNYXRjaFBsYXllclwiLFxuXHRcdFx0fSxcblxuXHRcdF1cblxuXHR9XG5cdGV4cG9ydCBjbGFzcyBBY3Rpb25UeXBlXG5cdHtcblx0XHRwdWJsaWMgc3RhdGljIHRlc3QgPSAxMDA7XG5cdFx0cHVibGljIHN0YXRpYyBUZXN0VXNlckRhdGEgPSAxMDE7XG5cdFx0cHVibGljIHN0YXRpYyBsb2dpbiA9IDIwMDtcblx0XHRwdWJsaWMgc3RhdGljIHRpY2tPdXRQbGF5ZXIgPSAyMDE7XG5cdFx0cHVibGljIHN0YXRpYyBDcmVhdGVQcml2Um9vbVJlcSA9IDQwMTtcblx0XHRwdWJsaWMgc3RhdGljIExvZ2luUGlydlJvb20gPSA0MDI7XG5cdFx0cHVibGljIHN0YXRpYyB1c2VyUmVhZHkgPSA0MDM7XG5cdFx0cHVibGljIHN0YXRpYyB1c2VyUmVhZHlFdmVudCA9IDQwNDtcblx0XHRwdWJsaWMgc3RhdGljIFByaXZHYW1lU3RhcnQgPSA0MDU7XG5cdFx0cHVibGljIHN0YXRpYyBQcml2T3AgPSA0MDY7XG5cdFx0cHVibGljIHN0YXRpYyBQcml2T3BFdmVudCA9IDQwNztcblx0XHRwdWJsaWMgc3RhdGljIHVzZXJSZXR1cm4gPSA0MDg7XG5cdFx0cHVibGljIHN0YXRpYyB1c2VyRGlzc0V2ZW50ID0gNDA5O1xuXHRcdHB1YmxpYyBzdGF0aWMgdXNlclJldHVybkV2ZW50ID0gNDEwO1xuXHRcdHB1YmxpYyBzdGF0aWMgcHJpdkdhbWVPdmVyRXZlbnQgPSA0MTE7XG5cdFx0cHVibGljIHN0YXRpYyBwcml2R2FtZUVuZEV2ZW50ID0gNDEyO1xuXHRcdHB1YmxpYyBzdGF0aWMgbG9naW5QaXJ2Um9vbUV2ZW50ID0gNDEzO1xuXG5cdH1cblx0ZXhwb3J0IGNsYXNzIEVycm9yQ29kZVxuXHR7XG5cdFx0cHVibGljIHN0YXRpYyBlcnJvckRpYzogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KClcblxuXHRcdHByaXZhdGUgc3RhdGljIEFkZChpZDogbnVtYmVyLCBtc2c6IHN0cmluZyk6IG51bWJlclxuXHRcdHtcblx0XHRcdEVycm9yQ29kZS5lcnJvckRpYy5zZXQoaWQsIG1zZylcblx0XHRcdHJldHVybiBpZFxuXHRcdH1cblxuXHRcdHB1YmxpYyBzdGF0aWMgR2V0KGlkKVxuXHRcdHtcblx0XHRcdGlmIChFcnJvckNvZGUuZXJyb3JEaWMuaGFzKGlkKSlcblx0XHRcdFx0cmV0dXJuIEVycm9yQ29kZS5HZXQoaWQpXG5cdFx0XHRyZXR1cm4gXCLmnKrnn6XplJnor6/vvJppZD1cIiArIGlkXG5cdFx0fVxuXHRcdHB1YmxpYyBzdGF0aWMgU3lzdGVtRXJyb3IgPVxuXHRcdHtcblx0XHRcdHN1Y2Nlc3M6IEVycm9yQ29kZS5BZGQoMCwgXCLor7fmsYLmiJDlip9cIiksXG5cdFx0XHR1bmtub3c6IEVycm9yQ29kZS5BZGQoMSwgXCLmnKrnn6XplJnor69cIiksXG5cdFx0XHRhcmd1bWVudDogRXJyb3JDb2RlLkFkZCgyLCBcIuWPguaVsOmUmeivr1wiKSxcblx0XHRcdHByb3RvTm90RXhpc3RzOiBFcnJvckNvZGUuQWRkKDMsIFwi5LiN5a2Y5Zyo5q2k5Y2P6K6uXCIpLFxuXHRcdFx0c2VydmljZUlzU3RvcGVkOiBFcnJvckNvZGUuQWRkKDQsIFwi5pyN5Yqh5pWF6ZqcXCIpLFxuXHRcdFx0c2Vzc2lvbk5vdEV4aXN0czogRXJyb3JDb2RlLkFkZCg1LCBcIuS4jeWtmOWcqOatpFNlc3Npb25cIiksXG5cdFx0XHRtb2R1bGVOb3RJbXBsOiBFcnJvckNvZGUuQWRkKDYsIFwi5q2k5qih5Z2X5pyq5a6e546wXCIpLFxuXHRcdFx0cHJvdG9Ob3RJbXBsOiBFcnJvckNvZGUuQWRkKDcsIFwi5q2k5Y2P6K6u5pyq5a6e546wXCIpLFxuXHRcdFx0bm9Mb2dpbjogRXJyb3JDb2RlLkFkZCg4LCBcIuWwmuacqueZu+W9lVwiKSxcblx0XHRcdHBhY2tIZWFkZXJOaWw6IEVycm9yQ29kZS5BZGQoOSwgXCLljIXlpLTmmK/nqbrnmoRcIiksXG5cdFx0XHRmb3J3YXJkOiBFcnJvckNvZGUuQWRkKDEwLCBcIumHjeWumuWQkVwiKSxcblx0XHRcdHNlcnZlck1haW50ZW5hbmNlOiBFcnJvckNvZGUuQWRkKDExLCBcIuacjeWKoeWZqOe7tOaKpFwiKSxcblx0XHRcdGJ1c3k6IEVycm9yQ29kZS5BZGQoMTIsIFwi5pyN5Yqh5b+ZXCIpLFxuXHRcdFx0bG9naW5lZDogRXJyb3JDb2RlLkFkZCgxMywgXCLlt7LnmbvlvZVcIiksXG5cdFx0XHRkYlNlcnZlclN0b3BlZDogRXJyb3JDb2RlLkFkZCgxNCwgXCLmlbDmja7mnI3liqHmlYXpmpxcIiksXG5cdFx0XHRub0xvZ2luR2FtZTogRXJyb3JDb2RlLkFkZCgxNSwgXCLmnKrov5vlhaXmuLjmiI9cIiksXG5cdFx0XHRub3RPbmxpbmU6IEVycm9yQ29kZS5BZGQoMTYsIFwi546p5a625LiN5Zyo57q/XCIpLFxuXHRcdFx0c2F2ZUNhY2hlRmFpbGVkOiBFcnJvckNvZGUuQWRkKDE3LCBcIuWGmeWFpee8k+WtmOWksei0pVwiKSxcblx0XHRcdGxvZ291dGluZ0dhbWU6IEVycm9yQ29kZS5BZGQoMTgsIFwi5q2j5Zyo6YCA5Ye65ri45oiP5LitXCIpLFxuXHRcdFx0bm9Vc2VhYmxlU2VydmljZTogRXJyb3JDb2RlLkFkZCgxOSwgXCLmsqHmnInlj6/nlKjnmoTmnI3liqFcIiksXG5cdFx0XHRzZXNzaW9uSW52YWxpZDogRXJyb3JDb2RlLkFkZCgyMCwgXCLmraRzZXNzaW9u5piv6Z2e5rOV55qEXCIpLFxuXHRcdFx0c2Vzc2lvblRpbWVvdXQ6IEVycm9yQ29kZS5BZGQoMjEsIFwi5q2kc2Vzc2lvbuW3sui/h+acn1wiKSxcblx0XHRcdHNlc3Npb25Ob01hdGNoOiBFcnJvckNvZGUuQWRkKDIyLCBcIuS8muivneS4jeWMuemFjVwiKSxcblx0XHRcdHNlcnZpY2VOb3RJbXBsOiBFcnJvckNvZGUuQWRkKDIzLCBcIuatpOacjeWKoeacquWunueOsFwiKSxcblx0XHRcdGZ1bmN0aW9uTm90T3BlbjogRXJyb3JDb2RlLkFkZCgyNCwgXCLmraTlip/og73lsJrmnKrlvIDmlL5cIiksXG5cdFx0XHRzZXJ2aWNlSXNPcGVuZWQ6IEVycm9yQ29kZS5BZGQoMjUsIFwi5pyN5Yqh5bey5byA5pS+XCIpLFxuXHRcdFx0c2VydmljZUlzQ2xvc2VkOiBFcnJvckNvZGUuQWRkKDI2LCBcIuacjeWKoeW3suWFs+mXrVwiKSxcblx0XHRcdHNlcnZpY2VJc09mZmxpbmU6IEVycm9yQ29kZS5BZGQoMjcsIFwi5pyN5Yqh5bey5LiL57q/XCIpLFxuXHRcdFx0bXNnVGltZU91dDogRXJyb3JDb2RlLkFkZCgtMSwgXCLotoXml7ZcIiksXG5cdFx0fVxuXHRcdHB1YmxpYyBzdGF0aWMgYXV0aEVycm9yID1cblx0XHR7XG5cdFx0XHRsb2dpbkFjY291bnRGaWxsOiBFcnJvckNvZGUuQWRkKDEwMDEsIFwi6LSm5Y+35oiW6ICF5a+G56CB6ZSZ6K+vXCIpLFxuXHRcdFx0YWNjb3VudEV4aXN0OiBFcnJvckNvZGUuQWRkKDEwMDIsIFwi6LSm5Y+36YeN5aSNXCIpLFxuXHRcdFx0YWNjb3VudEFuZFB3ZElzTnVsbDogRXJyb3JDb2RlLkFkZCgxMDAzLCBcIui0puWPt+aIluiAheWvhueggeS4jeiDveS4uuepulwiKSxcblx0XHRcdHJvbGVJZE5vRXhpc3Q6IEVycm9yQ29kZS5BZGQoMTAwNCwgXCLml6DmlYjnmoTnlKjmiLdpZOaIluiAhXRva2Vu5peg5pWIXCIpLFxuXHRcdH1cblxuXHR9XG4vLyB9IiwiXG5leHBvcnQgZGVmYXVsdCAgY2xhc3MgIFJvbGVNb2RlIGV4dGVuZHMgWUsuSU1vZGVcbntcbiAgICBwdWJsaWMgYWNjb3VudEluZm8gPSB7IHVzZXJpZDogMCwgdG9rZW46IFwiXCIgfVxuICAgIHB1YmxpYyByb2xlSW5mbzogbmV0cGFjay5Vc2VyRGF0YVxuICAgIHB1YmxpYyBPbkluaXREYXRhKHBhcmFtOiBhbnkpOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmV2ZW50TWdyLnNldE5ldENhbGxiYWNrKHRoaXMuT25OZXRFdmVuZXQsIDk5KVxuICAgICAgICB0aGlzLmV2ZW50TWdyLmFkZE5ldEV2ZW50KDIwMCk7XG4gICAgfVxuICAgIHB1YmxpYyBPbkNsZWFyKCk6IHZvaWRcbiAgICB7XG4gICAgfVxuXG4gICAgcHVibGljIE9uRGVzdHJveSgpOiB2b2lkXG4gICAge1xuICAgICAgICBzdXBlci5PbkRlc3Ryb3koKVxuICAgIH1cblxuICAgIHB1YmxpYyBPbk5ldEV2ZW5ldChldjogWUsuUmVzcG9uc2VNZXNzYWdlRXZlbnQpXG4gICAge1xuICAgICAgICBpZiAoZXYuRGF0YS5oZWFkLmVycm9yY29kZSA9PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoZXYuRGF0YS5oZWFkLmNtZCA9PSAyMDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbkxvZ2luUmVzcChldi5EYXRhLm1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIFNlbmRIdHRwTG9naW4oYWNjb3VudDogc3RyaW5nLCBwd2Q6IHN0cmluZywgY2FsbEJhY2s6IFlLLkZ1bmMpXG4gICAge1xuICAgICAgICBZSy5OZXRNZ3IuSW5zdGFuY2UuU2VuZEdldChcIm1vZGVOYW1lPWFjY291bnQmYXBpPWxvZ2luJmFjY291bnQ9XCIgKyBhY2NvdW50ICsgXCImcHdkPVwiICsgcHdkLCBuZXcgWUsuRnVuYyh0aGlzLCAocmVzOiBZSy5IdHRwUmVzcERhdGEpID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCAmJiByZXMuZXJyb3Jjb2RlID09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY2NvdW50SW5mby50b2tlbiA9IHJlcy5kYXRhLnRva2VuXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NvdW50SW5mby51c2VyaWQgPSByZXMuZGF0YS51c2VyaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsQmFjayAhPSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhbGxCYWNrLkludm9rZShyZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlj5HpgIHnmbvpmYZcbiAgICAgKiBAcGFyYW0gdXNlcmlkIOeUqOaIt2lkXG4gICAgICogQHBhcmFtIHRva2VuIOi0puWPt3Rva2VuXG4gICAgICovXG4gICAgcHVibGljIFNlbmRMb2dpbigpOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgc2VuZERhdGE6IG5ldHBhY2subG9naW5SZXEgPSB7IHRva2VuOiB0aGlzLmFjY291bnRJbmZvLnRva2VuLCByb2xlaWQ6IHRoaXMuYWNjb3VudEluZm8udXNlcmlkIH1cbiAgICAgICAgWUsuTmV0TWdyLkluc3RhbmNlLlNlbmQoMjAwLCBzZW5kRGF0YSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnmbvpmYbov5Tlm55cbiAgICAgKiBAcGFyYW0gbG9naW5SZXNwIOeZu+mZhueahOi/lOWbnuS/oeaBr1xuICAgICAqL1xuICAgIHB1YmxpYyBPbkxvZ2luUmVzcChsb2dpblJlc3A6IG5ldHBhY2subG9naW5SZXNwKVxuICAgIHtcbiAgICAgICAgdGhpcy5yb2xlSW5mbyA9IGxvZ2luUmVzcC5yb2xlaW5mbyBhcyBuZXRwYWNrLlVzZXJEYXRhXG4gICAgfVxufSIsImltcG9ydCBQcm90b2NvbERlZiBmcm9tIFwiLi4vRGVmcy9Qcm90b2NvbERlZlwiO1xuaW1wb3J0IFNjZW5lQmFzZSA9IFlLLlNjZW5lQmFzZVxuaW1wb3J0IEV2ZW50RGF0YSA9IFlLLkV2ZW50RGF0YVxuaW1wb3J0IExvZ2luU2NlbmUgZnJvbSBcIi4vTG9naW5TY2VuZVwiO1xuaW1wb3J0IFdhaXRXaW5kIGZyb20gXCIuLi9XaW5kcy9XYWl0V2luZFwiO1xuaW1wb3J0IExvYWRpbmdXaW5kIGZyb20gXCIuLi9XaW5kcy9Mb2FkaW5nV2luZFwiO1xuZXhwb3J0IGRlZmF1bHQgIGNsYXNzIExvYWRpbmdTY2VuZSBleHRlbmRzIFNjZW5lQmFzZVxue1xuICAgIHByaXZhdGUgaW5pdE5lZWRMb2FkVGFzazogWUsuTG9hZEdydW9wSW5mb1xuICAgIHByb3RlY3RlZCBPbkluaXQocGFyYW06IGFueSlcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uSW5pdChwYXJhbSlcbiAgICAgICAgdGhpcy5uZWVkTG9hZFJlcy5hZGQoXCJyZXMvc291cmNlL0xvYWRpbmdfYXRsYXNfdmNrbTMyLmpwZ1wiLCBMYXlhLkxvYWRlci5JTUFHRSwgdHJ1ZSlcbiAgICAgICAgICAgIC5hZGQoXCJyZXMvc291cmNlL0xvYWRpbmdfYXRsYXMwLnBuZ1wiLCBMYXlhLkxvYWRlci5JTUFHRSwgdHJ1ZSlcbiAgICAgICAgICAgIC5hZGQoXCJyZXMvc291cmNlL0xvYWRpbmcuYmluXCIsIExheWEuTG9hZGVyLkJVRkZFUiwgdHJ1ZSwgdHJ1ZSlcblxuICAgICAgICB0aGlzLmluaXROZWVkTG9hZFRhc2sgPSBuZXcgWUsuTG9hZEdydW9wSW5mbygpXG5cbiAgICAgICAgdGhpcy5pbml0TmVlZExvYWRUYXNrLmFkZChcInJlcy9leHRlcm5hbC9CYXNlUGFja19hdGxhczAucG5nXCIsIExheWEuTG9hZGVyLklNQUdFLCB0cnVlKVxuICAgICAgICAgICAgLmFkZChcInJlcy9leHRlcm5hbC9CYXNlUGFjay5iaW5cIiwgTGF5YS5Mb2FkZXIuQlVGRkVSLCB0cnVlLCB0cnVlKVxuICAgICAgICAgICAgLm9uSXRlbUNvbXBsZXRpb24odGhpcy5sb2FkSXRlbUNvbXBsZXRpb24sIHRoaXMpXG4gICAgICAgICAgICAub25Db21wbGV0aW9uKHRoaXMubG9hZEdhbWVSZXNGaW5pc2gsIHRoaXMpXG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGxvYWRJdGVtQ29tcGxldGlvbigpXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmluaXROZWVkTG9hZFRhc2suUHJvZ3Jlc3MpXG4gICAgICAgIGxldCBldiA9IG5ldyBMb2FkaW5nUHJvZ3Jlc3NFdmVuZXQoKTtcbiAgICAgICAgZXYuUHJvZ3Jlc3MgPSB0aGlzLmluaXROZWVkTG9hZFRhc2suUHJvZ3Jlc3NcbiAgICAgICAgWUsuVUlNZ3IuSW5zdGFuY2UuRGlzcGF0Y2hFdmVudChldilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDotYTmupDliqDovb3lrozmiJBcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRHYW1lUmVzRmluaXNoKClcbiAgICB7XG4gICAgICAgIGZhaXJ5Z3VpLlVJT2JqZWN0RmFjdG9yeS5zZXRQYWNrYWdlSXRlbUV4dGVuc2lvbihmYWlyeWd1aS5VSUNvbmZpZy5nbG9iYWxNb2RhbFdhaXRpbmcsV2FpdFdpbmQpXG4gICAgICAgIHRoaXMuQWRkUHJvdG8oKVxuICAgICAgICBcbiAgICAgICAgUHJvdG9jb2xEZWYuUHJvdG9jb2xzLmZvckVhY2goZWxlbWVudCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBZSy5Qcm90b01hcC5BZGRQcm90byhlbGVtZW50KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIEFkZFByb3RvKClcbiAgICB7XG4gICAgICAgIFlLLk5ldE1nci5JbnN0YW5jZS5BZGRQcm90byhcIm5ldHBhY2tcIiwgUHJvdG9jb2xEZWYuUHJvdG9jb2xOYW1lcylcbiAgICAgICAgdGhpcy5TdGFydEdhbWUoKVxuICAgIH1cblxuXG4gICAgcHVibGljIFN0YXJ0R2FtZSgpXG4gICAge1xuICAgICAgICBsZXQgZXYgPSBuZXcgTG9hZGluZ1Byb2dyZXNzRXZlbmV0KCk7XG4gICAgICAgIGV2LlByb2dyZXNzID0gMTAwXG4gICAgICAgIFlLLlVJTWdyLkluc3RhbmNlLkRpc3BhdGNoRXZlbnQoZXYpXG4gICAgICAgIFlLLiBTY2VuZU1nci5JbnN0YW5jZS5Hb1RvU2NlbmUoTG9naW5TY2VuZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25FbnRlcihwYXJhbTogYW55KVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25FbnRlcihwYXJhbSlcbiAgICAgICAgWUsuVUlNZ3IuSW5zdGFuY2UuU2hvd1dpbmQoTG9hZGluZ1dpbmQpXG4gICAgICAgIHRoaXMuaW5pdE5lZWRMb2FkVGFzay5zdGFydCgpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uSGFuZGxlcihldjogWUsuRXZlbnREYXRhKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25IYW5kbGVyKGV2KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkxlYXZlKClcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uTGVhdmUoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25EZXN0cm95KClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25Mb2FkZWQoKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25Mb2FkZWQoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPblRhc2tGaW5pc2hlZCgpXG4gICAge1xuICAgICAgICBzdXBlci5PblRhc2tGaW5pc2hlZCgpXG4gICAgfVxufVxuIiwiaW1wb3J0IFNjZW5lQmFzZSA9IFlLLlNjZW5lQmFzZVxuaW1wb3J0IEV2ZW50RGF0YSA9IFlLLkV2ZW50RGF0YVxuaW1wb3J0IExvZ2luV2luZCBmcm9tIFwiLi4vV2luZHMvTG9naW5XaW5kXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luU2NlbmUgZXh0ZW5kcyBTY2VuZUJhc2VcbntcbiAgICBwcm90ZWN0ZWQgZmlyc3RXaW5kOiBhbnkgPSBMb2dpbldpbmRcbiAgICBwcm90ZWN0ZWQgT25Jbml0KHBhcmFtOiBhbnkpXG4gICAge1xuICAgICAgICBzdXBlci5PbkluaXQocGFyYW0pXG4gICAgICAgIHRoaXMubmVlZExvYWRSZXNcbiAgICAgICAgLmFkZChcInJlcy9leHRlcm5hbC9Mb2dpblBhY2suYmluXCIsIExheWEuTG9hZGVyLkJVRkZFUiwgdHJ1ZSwgdHJ1ZSlcbiAgICAgICAgLmFkZChcInJlcy9leHRlcm5hbC9CYXNlUGFjay5iaW5cIiwgTGF5YS5Mb2FkZXIuQlVGRkVSLCB0cnVlLCB0cnVlKVxuICAgICAgICAuYWRkKFwicmVzL2V4dGVybmFsL0Jhc2VQYWNrX2F0bGFzMC5wbmdcIiwgTGF5YS5Mb2FkZXIuSU1BR0UsIHRydWUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uRW50ZXIocGFyYW06IGFueSlcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uRW50ZXIocGFyYW0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uSGFuZGxlcihldjogRXZlbnREYXRhKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25IYW5kbGVyKGV2KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkxlYXZlKClcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uTGVhdmUoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25EZXN0cm95KClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25Mb2FkZWQoKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25Mb2FkZWQoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPblRhc2tGaW5pc2hlZCgpXG4gICAge1xuICAgICAgICBzdXBlci5PblRhc2tGaW5pc2hlZCgpXG4gICAgfVxufVxuIiwiaW1wb3J0IE1haW5XaW5kIGZyb20gXCIuLi9XaW5kcy9NYWluV2luZFwiO1xuXG5leHBvcnQgZGVmYXVsdCAgY2xhc3MgTWFpblNjZW5lIGV4dGVuZHMgWUsuU2NlbmVCYXNlXG57XG4gICAgcHJvdGVjdGVkIGZpcnN0V2luZDogYW55ID0gTWFpbldpbmRcbiAgICBwcm90ZWN0ZWQgT25Jbml0KHBhcmFtOiBhbnkpXG4gICAge1xuICAgICAgICBzdXBlci5PbkluaXQocGFyYW0pXG4gICAgICAgIHRoaXMubmVlZExvYWRSZXMuYWRkKFwicmVzL2V4dGVybmFsL01haW5QYWNrX2F0bGFzMC5wbmdcIlxuICAgICAgICAgICAgLCBMYXlhLkxvYWRlci5JTUFHRSwgdHJ1ZSlcblxuICAgICAgICB0aGlzLm5lZWRMb2FkUmVzLmFkZChcInJlcy9leHRlcm5hbC9NYWluUGFjay5iaW5cIlxuICAgICAgICAgICAgLCBMYXlhLkxvYWRlci5CVUZGRVIsIHRydWUsIHRydWUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uRW50ZXIocGFyYW06IGFueSlcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uRW50ZXIocGFyYW0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uSGFuZGxlcihldjogWUsuRXZlbnREYXRhKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25IYW5kbGVyKGV2KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkxlYXZlKClcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uTGVhdmUoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25EZXN0cm95KClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25Mb2FkZWQoKVxuICAgIHtcbiAgICAgICAgc3VwZXIuT25Mb2FkZWQoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPblRhc2tGaW5pc2hlZCgpXG4gICAge1xuICAgICAgICBzdXBlci5PblRhc2tGaW5pc2hlZCgpXG4gICAgfVxufSIsImltcG9ydCBCYXNlVUkgPSBZSy5CYXNlVUlcbmV4cG9ydCBkZWZhdWx0ICBjbGFzcyBMb2FkaW5nV2luZCBleHRlbmRzIFlLLkJhc2VVSVxue1xuICAgIHByb3RlY3RlZCBwYWNrTmFtZSA9IFwiTG9hZGluZ1wiXG4gICAgcHJvdGVjdGVkIHJlc05hbWUgPSBcImxvYWRpbmdXaW5kXCJcbiAgICBwdWJsaWMgbW9kYWw6IGJvb2xlYW4gPSBmYWxzZVxuICAgIHB1YmxpYyBkb250RGVsOiBib29sZWFuID0gdHJ1ZVxuICAgIHByb3RlY3RlZCBidG5OYW1lU3RhcnRzV2l0aDogc3RyaW5nID0gXCJCdG5cIlxuICAgIHByb3RlY3RlZCBpc05lZWRTaG93QW5pbWF0aW9uOiBib29sZWFuID0gZmFsc2VcbiAgICBwcm90ZWN0ZWQgaXNOZWVkSGlkZUFuaW1hdGlvbjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICBwcm90ZWN0ZWQgbWxhYmVsUHJvZ3Jlc3M6IGZhaXJ5Z3VpLkdUZXh0RmllbGRcbiAgICBwcm90ZWN0ZWQgbWxhYmxNc2c6IGZhaXJ5Z3VpLkdUZXh0RmllbGRcbiAgICBwcml2YXRlIG1Qcm9ncmVzczogbnVtYmVyID0gMFxuICAgIHByaXZhdGUgbVNob3dJbmZvU3RyaW5nOiBzdHJpbmcgPSBcIuato+WcqOWKoOi9vS4uLlwiXG5cbiAgICBwcm90ZWN0ZWQgT25pbml0V2luZCgpXG4gICAge1xuICAgICAgICB0aGlzLm1sYWJlbFByb2dyZXNzID0gdGhpcy5VSU9iai5nZXQoXCJsYWJlbFByb2dyZXNzXCIpXG4gICAgICAgIHRoaXMubWxhYmxNc2cgPSB0aGlzLlVJT2JqLmdldChcImxhYmxNc2dcIilcbiAgICAgICAgdGhpcy5tbGFiZWxQcm9ncmVzcy50ZXh0ID0gXCIwJVwiXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25TaG93V2luZCgpXG4gICAge1xuICAgICAgICB0aGlzLmV2ZW50TWdyLmFkZFVJRXZlbnQoTG9hZGluZ1Byb2dyZXNzRXZlbmV0LkV2ZW50SUQpXG5cbiAgICAgICAgdGhpcy5tUHJvZ3Jlc3MgPSAwXG4gICAgICAgIHRoaXMubVNob3dJbmZvU3RyaW5nID0gXCLmraPlnKjliqDovb0uLi5cIlxuICAgICAgICB0aGlzLm1sYWJlbFByb2dyZXNzLnRleHQgPSB0aGlzLm1Qcm9ncmVzcy50b0ZpeGVkKCkgKyBcIiVcIlxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkhpZGVXaW5kKClcbiAgICB7XG5cbiAgICB9XG4gICAgcHJvdGVjdGVkIE9uSGFuZGxlcihldjogWUsuRXZlbnREYXRhKVxuICAgIHtcbiAgICAgICAgc3dpdGNoIChldi5jbWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgTG9hZGluZ1Byb2dyZXNzRXZlbmV0LkV2ZW50SUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5SZWZyZXNoSW5mbyhldiBhcyBMb2FkaW5nUHJvZ3Jlc3NFdmVuZXQpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgUmVmcmVzaEluZm8oZXY6IExvYWRpbmdQcm9ncmVzc0V2ZW5ldClcbiAgICB7XG4gICAgICAgIHRoaXMubVByb2dyZXNzID0gZXYuZGF0YS5wcm9ncmVzc1xuICAgICAgICB0aGlzLm1sYWJlbFByb2dyZXNzLnRleHQgPSB0aGlzLm1Qcm9ncmVzcy50b0ZpeGVkKCkgKyBcIiVcIlxuICAgIH1cbn0iLCJpbXBvcnQgUm9sZU1vZGUgZnJvbSBcIi4uL01vZGVzL1JvbGVNb2RlXCI7XG5pbXBvcnQgTG9hZGluZ1dpbmQgZnJvbSBcIi4vTG9hZGluZ1dpbmRcIjtcbmltcG9ydCBNZXNzYWdlQm94IGZyb20gXCIuL01lc3NhZ2VCb3hcIjtcbmltcG9ydCBNYWluU2NlbmUgZnJvbSBcIi4uL1NjZW5lcy9NYWluU2NlbmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgICBjbGFzcyBMb2dpbldpbmQgZXh0ZW5kcyBZSy5CYXNlVUlcbntcbiAgICBwcm90ZWN0ZWQgcGFja05hbWUgPSBcIkxvZ2luUGFja1wiXG4gICAgcHJvdGVjdGVkIHJlc05hbWUgPSBcIkxvZ2luV2luZG93XCJcbiAgICBwdWJsaWMgbW9kYWw6IGJvb2xlYW4gPSBmYWxzZVxuICAgIHB1YmxpYyBkb250RGVsOiBib29sZWFuID0gdHJ1ZVxuICAgIHByb3RlY3RlZCBidG5OYW1lU3RhcnRzV2l0aDogc3RyaW5nID0gXCJCdG5cIlxuICAgIHByb3RlY3RlZCBpc05lZWRTaG93QW5pbWF0aW9uOiBib29sZWFuID0gZmFsc2VcbiAgICBwcm90ZWN0ZWQgaXNOZWVkSGlkZUFuaW1hdGlvbjogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICBwcml2YXRlIG1MYWJlbEFjYzogZmFpcnlndWkuR1RleHRGaWVsZFxuICAgIHByaXZhdGUgbUxhYmVsUGFzczogZmFpcnlndWkuR1RleHRGaWVsZFxuXG4gICAgcHJvdGVjdGVkIE9uaW5pdFdpbmQoKVxuICAgIHtcbiAgICAgICAgdGhpcy5ldmVudE1nci5zZXROZXRDYWxsYmFjayh0aGlzLk9uTmV0TXNnKVxuICAgICAgICB0aGlzLm1MYWJlbEFjYyA9IHRoaXMuVUlPYmouZ2V0KFwiTGFiZWxBY2NcIilcbiAgICAgICAgdGhpcy5tTGFiZWxQYXNzID0gdGhpcy5VSU9iai5nZXQoXCJMYWJlbFBhc3NcIilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25TaG93V2luZCgpXG4gICAge1xuICAgICAgICBZSy5VSU1nci5JbnN0YW5jZS5IaWRlV2luZChMb2FkaW5nV2luZClcbiAgICAgICAgdGhpcy5ldmVudE1nci5hZGROZXRFdmVudCgyMDApO1xuICAgICAgICB0aGlzLmV2ZW50TWdyLmFkZE5ldEV2ZW50KFlLLk5ldE1nckV2ZW50RGVmLm9ub3BlbilcbiAgICAgICAgdGhpcy5ldmVudE1nci5hZGROZXRFdmVudChZSy5OZXRNZ3JFdmVudERlZi5vbmVycm9yKVxuICAgICAgICB0aGlzLmV2ZW50TWdyLmFkZE1vZGVFdmVudChZSy5Nb2RlTWdyLkV2ZW50VHlwZS5TRU5ESU5JVE1TR09LKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbkhpZGVXaW5kKClcbiAgICB7XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25CdG5DbGljayhldjogZmFpcnlndWkuR0J1dHRvbilcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uQnRuQ2xpY2soZXYpXG4gICAgICAgIGlmIChldi5uYW1lID09IFwiQnRuTG9naW5cIilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5IdHRwTG9naW4oKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgSHR0cExvZ2luKClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLm1MYWJlbEFjYy50ZXh0ID09IFwiXCIgfHwgdGhpcy5tTGFiZWxQYXNzLnRleHQgPT0gXCJcIilcbiAgICAgICAge1xuICAgICAgICAgICAgTWVzc2FnZUJveC5DcmVhdGUoXCLor7fovpPlhaXotKblj7flr4bnoIFcIikuU2hvdygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBZSy5VSU1nci5JbnN0YW5jZS5TaG93TW9kYWxXYWl0KClcbiAgICAgICAgICAgIFlLLiBNb2RlTWdyLkluc3RhbmNlLkdldE1vZGU8Um9sZU1vZGU+KFJvbGVNb2RlKS5TZW5kSHR0cExvZ2luKHRoaXMubUxhYmVsQWNjLnRleHQsXG4gICAgICAgICAgICAgICAgdGhpcy5tTGFiZWxQYXNzLnRleHQsXG4gICAgICAgICAgICAgICAgbmV3IFlLLkZ1bmModGhpcywgKHJlczogWUsuSHR0cFJlc3BEYXRhKSA9PlxuICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZXJyb3Jjb2RlID09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db25uZWN0U2VydmVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBZSy5VSU1nci5JbnN0YW5jZS5DbG9zZU1vZGFsV2FpdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVzc2FnZUJveC5DcmVhdGUocmVzLm1zZykuU2hvdygpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBZSy5VSU1nci5JbnN0YW5jZS5DbG9zZU1vZGFsV2FpdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXNzYWdlQm94LkNyZWF0ZShcIueZu+mZhuWksei0peWwneivlemHjeaWsOeZu+mZhlwiKS5TaG93KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIENvbm5lY3RTZXJ2ZXIoKVxuICAgIHtcbiAgICAgICAgWUsuTmV0TWdyLkluc3RhbmNlLmNvbm5lY3QoKVxuICAgIH1cblxuICAgIHB1YmxpYyBPbkNvbm5ldFNlcnZlcigpXG4gICAge1xuICAgICAgICBZSy4gTW9kZU1nci5JbnN0YW5jZS5HZXRNb2RlPFJvbGVNb2RlPihSb2xlTW9kZSkuU2VuZExvZ2luKClcbiAgICB9XG5cbiAgICBwdWJsaWMgT25Mb2dpbihldjogWUsuUmVzcG9uc2VEYXRhSW5mbylcbiAgICB7XG4gICAgICAgIFlLLlVJTWdyLkluc3RhbmNlLkNsb3NlTW9kYWxXYWl0KClcbiAgICAgICAgaWYgKGV2LmhlYWQuZXJyb3Jjb2RlID09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIFlLLlVJTWdyLkluc3RhbmNlLlNob3dNb2RhbFdhaXQoKVxuICAgICAgICAgICAgWUsuTW9kZU1nci5JbnN0YW5jZS5TZW5kSW5pdE1zZygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBNZXNzYWdlQm94LkNyZWF0ZShldi5tc2cpLlNob3coKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgT25Jbml0TXNnZWQoKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIuW8gOWni+a4uOaIj1wiKVxuICAgICAgICBZSy5VSU1nci5JbnN0YW5jZS5DbG9zZU1vZGFsV2FpdCgpXG5cbiAgICAgICAgWUsuU2NlbmVNZ3IuSW5zdGFuY2UuR29Ub1NjZW5lKE1haW5TY2VuZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgT25Db25uZXRTZXJ2ZXJFcnJvcihlcnJvcjogc3RyaW5nKVxuICAgIHtcbiAgICAgICAgTWVzc2FnZUJveC5DcmVhdGUoXCLpk77mjqXmnI3liqHlmajlpLHotKXvvIzlsJ3or5Xph43ov55cIilcbiAgICAgICAgICAgIC5TZXRCdG5Db25maXJtQ2FsbEJhY2sobmV3IFlLLkZ1bmModGhpcywgKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbm5lY3RTZXJ2ZXIoKVxuICAgICAgICAgICAgfSksIFwi6YeN6K+VXCIpXG4gICAgICAgICAgICAuU2hvdygpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uTmV0TXNnKGV2OiBZSy5SZXNwb25zZU1lc3NhZ2VFdmVudClcbiAgICB7XG4gICAgICAgIGlmIChldi5jbWQgPT0gWUsuTmV0TWdyRXZlbnREZWYub25vcGVuKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLk9uQ29ubmV0U2VydmVyKClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldi5jbWQgPT0gWUsuTmV0TWdyRXZlbnREZWYub25lcnJvclxuICAgICAgICAgICAgfHwgZXYuY21kID09IFlLLk5ldE1nckV2ZW50RGVmLm9uY2xvc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuT25Db25uZXRTZXJ2ZXJFcnJvcihldi5kYXRhKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGV2LkRhdGEuaGVhZC5jbWQgPT0gMjAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25Mb2dpbihldi5EYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uSGFuZGxlcihldjogWUsuRXZlbnREYXRhKVxuICAgIHtcbiAgICAgICAgaWYgKGV2LmNtZCA9PVlLLiBNb2RlTWdyLkV2ZW50VHlwZS5TRU5ESU5JVE1TR09LKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLk9uSW5pdE1zZ2VkKClcbiAgICAgICAgfVxuICAgIH1cbn0iLCJcbmV4cG9ydCBkZWZhdWx0ICBjbGFzcyBNYWluV2luZCBleHRlbmRzIFlLLkJhc2VVSVxue1xuICAgIHByb3RlY3RlZCBwYWNrTmFtZSA9IFwiTWFpblBhY2tcIlxuICAgIHByb3RlY3RlZCByZXNOYW1lID0gXCJNYWluV2luZG93XCJcbiAgICBwdWJsaWMgbW9kYWw6IGJvb2xlYW4gPSBmYWxzZVxuICAgIHByb3RlY3RlZCBidG5OYW1lU3RhcnRzV2l0aDogc3RyaW5nID0gXCJCdG5cIlxuICAgIHByb3RlY3RlZCBpc05lZWRTaG93QW5pbWF0aW9uOiBib29sZWFuID0gZmFsc2VcbiAgICBwcm90ZWN0ZWQgaXNOZWVkSGlkZUFuaW1hdGlvbjogYm9vbGVhbiA9IGZhbHNlXG4gICAgcHJvdGVjdGVkIE9uaW5pdFdpbmQoKVxuICAgIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uU2hvd1dpbmQoKVxuICAgIHtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25IaWRlV2luZCgpXG4gICAge1xuXG4gICAgfVxuICAgIHByb3RlY3RlZCBPbkhhbmRsZXIoZXY6IFlLLkV2ZW50RGF0YSlcbiAgICB7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0ICBjbGFzcyBNZXNzYWdlQm94IGV4dGVuZHMgWUsuQmFzZVVJXG57XG4gICAgcHVibGljIG1vZGFsOiBib29sZWFuID0gdHJ1ZVxuICAgIHB1YmxpYyBkb250RGVsOiBib29sZWFuID0gdHJ1ZVxuICAgIHByb3RlY3RlZCBwYWNrTmFtZSA9IFwiQmFzZVBhY2tcIlxuICAgIHByb3RlY3RlZCByZXNOYW1lID0gXCJNZXNzYWdlQm94XCJcbiAgICBwcm90ZWN0ZWQgY2xpY2tCYmFja2dyb3VuZENsb3NlID0gZmFsc2VcblxuICAgIHByb3RlY3RlZCBsYWJlbE1zZzogZmFpcnlndWkuR1RleHRGaWVsZFxuXG4gICAgcHJpdmF0ZSBCdG5PSzogZmFpcnlndWkuR0J1dHRvblxuXG4gICAgcHJpdmF0ZSBCdG5DYW5jZWw6IGZhaXJ5Z3VpLkdCdXR0b25cblxuICAgIHByaXZhdGUgQnRuQ29uZmlybTogZmFpcnlndWkuR0J1dHRvblxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbU1lc3NhZ2VCb3hEYXRhUG9vbHM6IEFycmF5PE1lc3NhZ2VCb3hEYXRhPiA9IG5ldyBBcnJheTxNZXNzYWdlQm94RGF0YT4oKVxuXG4gICAgcHVibGljIHN0YXRpYyBDcmVhdGUoY29udGVudDogc3RyaW5nKTogTWVzc2FnZUJveERhdGFcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLm1NZXNzYWdlQm94RGF0YVBvb2xzLmxlbmd0aCA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCBkYSA9IHRoaXMubU1lc3NhZ2VCb3hEYXRhUG9vbHMucG9wKClcbiAgICAgICAgICAgIGRhLlNldENvbnRlbnQoY29udGVudClcbiAgICAgICAgICAgIHJldHVybiBkYVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgTWVzc2FnZUJveERhdGEoY29udGVudClcbiAgICB9XG5cblxuICAgIHB1YmxpYyBkaXNwb3NlKClcbiAgICB7XG4gICAgICAgIHN1cGVyLmRpc3Bvc2UoKVxuICAgICAgICBNZXNzYWdlQm94Lm1NZXNzYWdlQm94RGF0YVBvb2xzLnNwbGljZSgwLCBNZXNzYWdlQm94Lm1NZXNzYWdlQm94RGF0YVBvb2xzLmxlbmd0aClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgT25CdG5DbGljayhldjogZmFpcnlndWkuR0J1dHRvbilcbiAgICB7XG4gICAgICAgIHN1cGVyLk9uQnRuQ2xpY2soZXYpXG4gICAgICAgIGlmIChldiA9PSB0aGlzLkJ0bk9LKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5tRGF0YS5CdG5Pa0NhbGxCYWNrICE9IG51bGwpXG4gICAgICAgICAgICAgICAgdGhpcy5tRGF0YS5CdG5Pa0NhbGxCYWNrLkludm9rZSgpXG4gICAgICAgICAgICB0aGlzLk9uQnRuQ2xvc2UoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ID09IHRoaXMuQnRuQ2FuY2VsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5tRGF0YS5CdG5DYW5jZWxDYWxsQmFjayAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMubURhdGEuQnRuQ2FuY2VsQ2FsbEJhY2suSW52b2tlKClcbiAgICAgICAgICAgIHRoaXMuT25CdG5DbG9zZSgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXYgPT0gdGhpcy5CdG5Db25maXJtKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5tRGF0YS5CdG5CdG5Db25maXJtQ2FsbEJhY2sgIT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLm1EYXRhLkJ0bkJ0bkNvbmZpcm1DYWxsQmFjay5JbnZva2UoKVxuICAgICAgICAgICAgdGhpcy5PbkJ0bkNsb3NlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBPbmluaXRXaW5kKClcbiAgICB7XG4gICAgICAgIHRoaXMuQnRuT0sgPSB0aGlzLlVJT2JqLmdldChcIkJ0bk9LXCIpXG4gICAgICAgIHRoaXMuQnRuQ2FuY2VsID0gdGhpcy5VSU9iai5nZXQoXCJCdG5DYW5jZWxcIilcbiAgICAgICAgdGhpcy5CdG5Db25maXJtID0gdGhpcy5VSU9iai5nZXQoXCJCdG5Db25maXJtXCIpXG4gICAgICAgIHRoaXMubGFiZWxNc2cgPSB0aGlzLlVJT2JqLmdldChcImxhYmVsTXNnXCIpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIE9uU2hvd1dpbmQoKVxuICAgIHtcbiAgICAgICAgdGhpcy5tRGF0YSA9IHRoaXMuZGF0YSBhcyBNZXNzYWdlQm94RGF0YVxuICAgICAgICBpZiAodGhpcy5tRGF0YS50eXBlID09IE1lc3NhZ2VCb3hUeXBlLk5vbmUpXG4gICAgICAgIHtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm1EYXRhLnR5cGUgPT0gTWVzc2FnZUJveFR5cGUuU2hvd0NvbmZpcm0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuQnRuQ29uZmlybS50ZXh0ID0gdGhpcy5tRGF0YS5sYWJCdG5Db25maXJtU3RyXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkJ0bk9LLnRleHQgPSB0aGlzLm1EYXRhLmxhYkJ0bk9rU3RyXG4gICAgICAgICAgICB0aGlzLkJ0bkNhbmNlbC50ZXh0ID0gdGhpcy5tRGF0YS5sYWJCdG5DYW5jZWxTdHJcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuVUlDdHJscy5nZXQoXCJzdGF0ZUN0cmxcIikuc2VsZWN0ZWRJbmRleCA9IHRoaXMubURhdGEudHlwZVxuICAgICAgICB0aGlzLmxhYmVsTXNnLnRleHQgPSB0aGlzLm1EYXRhLmNvbnRlbnRcbiAgICB9XG5cbiAgICBwcml2YXRlIG1EYXRhOiBNZXNzYWdlQm94RGF0YSA9IG51bGxcbiAgICBwcm90ZWN0ZWQgT25IaWRlV2luZCgpXG4gICAge1xuXG4gICAgICAgIGlmICh0aGlzLm1EYXRhICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubURhdGEucmVzZXQoKVxuICAgICAgICAgICAgTWVzc2FnZUJveC5tTWVzc2FnZUJveERhdGFQb29scy5wdXNoKHRoaXMubURhdGEpXG4gICAgICAgICAgICB0aGlzLm1EYXRhID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxufVxuXG5lbnVtIE1lc3NhZ2VCb3hUeXBlXG57XG4gICAgTm9uZSxcbiAgICBTaG93Q29uZmlybSxcbiAgICBTaG93T2tBbmRDYW5jZWwsXG59XG5jbGFzcyBNZXNzYWdlQm94RGF0YVxue1xuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb250ZW50KVxuICAgIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gY29udGVudFxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBNZXNzYWdlQm94VHlwZVxuICAgIHtcbiAgICAgICAgbGV0IHQgPSBNZXNzYWdlQm94VHlwZS5Ob25lO1xuICAgICAgICBpZiAodGhpcy5CdG5CdG5Db25maXJtQ2FsbEJhY2sgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdCA9IE1lc3NhZ2VCb3hUeXBlLlNob3dDb25maXJtXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5CdG5Pa0NhbGxCYWNrICE9IG51bGwgfHwgdGhpcy5CdG5DYW5jZWxDYWxsQmFjayAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0ID0gTWVzc2FnZUJveFR5cGUuU2hvd09rQW5kQ2FuY2VsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRcbiAgICB9XG5cbiAgICBwdWJsaWMgY29udGVudDogc3RyaW5nID0gbnVsbFxuXG4gICAgcHVibGljIEJ0bk9rQ2FsbEJhY2s6IFlLLkZ1bmMgPSBudWxsXG4gICAgcHVibGljIGxhYkJ0bk9rU3RyOiBzdHJpbmcgPSBudWxsXG5cbiAgICBwdWJsaWMgQnRuQ2FuY2VsQ2FsbEJhY2s6IFlLLkZ1bmMgPSBudWxsXG4gICAgcHVibGljIGxhYkJ0bkNhbmNlbFN0cjogc3RyaW5nID0gbnVsbFxuXG4gICAgcHVibGljIEJ0bkJ0bkNvbmZpcm1DYWxsQmFjazogWUsuRnVuYyA9IG51bGxcbiAgICBwdWJsaWMgbGFiQnRuQ29uZmlybVN0cjogc3RyaW5nID0gbnVsbFxuXG4gICAgcHVibGljIFNldEJ0bk9rQW5kQ2FuY2VsQ2FsbEJhY2sob2tDYWxsQmFjazogWUsuRnVuYywgb2tTdHI6IHN0cmluZyA9IFwi5aW955qEXCIsXG4gICAgICAgIGNhbmNlbENhbGxCYWNrOiBZSy5GdW5jID0gbnVsbCwgY2FuY2VsU3RyOiBzdHJpbmcgPSBcIuWlveeahFwiKVxuICAgIHtcbiAgICAgICAgdGhpcy5CdG5Pa0NhbGxCYWNrID0gb2tDYWxsQmFja1xuICAgICAgICB0aGlzLmxhYkJ0bk9rU3RyID0gb2tTdHJcbiAgICAgICAgdGhpcy5CdG5DYW5jZWxDYWxsQmFjayA9IGNhbmNlbENhbGxCYWNrXG4gICAgICAgIHRoaXMubGFiQnRuQ2FuY2VsU3RyID0gY2FuY2VsU3RyXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcHVibGljIFNldEJ0bkNvbmZpcm1DYWxsQmFjayhjYWxsQmFjazogWUsuRnVuYywgbGFiU3RyOiBzdHJpbmcgPSBcIuehruWumlwiKVxuICAgIHtcbiAgICAgICAgdGhpcy5CdG5CdG5Db25maXJtQ2FsbEJhY2sgPSBjYWxsQmFja1xuICAgICAgICB0aGlzLmxhYkJ0bkNvbmZpcm1TdHIgPSBsYWJTdHJcblxuICAgICAgICB0aGlzLkJ0bk9rQ2FsbEJhY2sgPSBudWxsXG4gICAgICAgIHRoaXMubGFiQnRuT2tTdHIgPSBudWxsXG4gICAgICAgIHRoaXMuQnRuQ2FuY2VsQ2FsbEJhY2sgPSBudWxsXG4gICAgICAgIHRoaXMubGFiQnRuQ2FuY2VsU3RyID0gbnVsbFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHB1YmxpYyBTZXRDb250ZW50KGNvbnRlbnQ6IHN0cmluZylcbiAgICB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnRcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKVxuICAgIHtcbiAgICAgICAgdGhpcy5CdG5Pa0NhbGxCYWNrID0gbnVsbFxuICAgICAgICB0aGlzLmxhYkJ0bk9rU3RyID0gbnVsbFxuICAgICAgICB0aGlzLkJ0bkNhbmNlbENhbGxCYWNrID0gbnVsbFxuICAgICAgICB0aGlzLmxhYkJ0bkNhbmNlbFN0ciA9IG51bGxcbiAgICAgICAgdGhpcy5CdG5CdG5Db25maXJtQ2FsbEJhY2sgPSBudWxsXG4gICAgICAgIHRoaXMubGFiQnRuQ29uZmlybVN0ciA9IG51bGxcbiAgICAgICAgdGhpcy5jb250ZW50ID0gbnVsbFxuICAgIH1cblxuICAgIHB1YmxpYyBTaG93KClcbiAgICB7XG4gICAgICAgIFlLLlVJTWdyLkluc3RhbmNlLlNob3dXaW5kKE1lc3NhZ2VCb3gsIHRoaXMpXG4gICAgfVxufSIsIlxuZXhwb3J0IGRlZmF1bHQgIGNsYXNzIFdhaXRXaW5kIGV4dGVuZHMgZmFpcnlndWkuR0NvbXBvbmVudFxue1xuICAgIHByaXZhdGUgbGFibE1zZzogZmFpcnlndWkuR1RleHRGaWVsZFxuICAgIHByaXZhdGUgc3RhdGU6IGZhaXJ5Z3VpLkNvbnRyb2xsZXJcbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICBzdXBlcigpXG5cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZFxuICAgIHtcbiAgICAgICAgc3VwZXIuY29uc3RydWN0RnJvbVhNTCh4bWwpO1xuICAgICAgICB0aGlzLmRpc3BsYXlPYmplY3Qub24oTGF5YS5FdmVudC5ESVNQTEFZLCB0aGlzLCB0aGlzLl9fb25TaG93bik7XG4gICAgICAgIHRoaXMuZGlzcGxheU9iamVjdC5vbihMYXlhLkV2ZW50LlVORElTUExBWSwgdGhpcywgdGhpcy5fX29uSGlkZGVuKTtcbiAgICAgICAgdGhpcy5sYWJsTXNnID0gdGhpcy5nZXRDaGlsZChcImxhYmxNc2dcIikuYXNUZXh0RmllbGRcbiAgICAgICAgdGhpcy5sYWJsTXNnID0gdGhpcy5nZXRDaGlsZChcImxhYmxNc2dcIikuYXNUZXh0RmllbGRcblxuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRDb250cm9sbGVyKFwiYzFcIilcblxuXG4gICAgfVxuXG4gICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpXG4gICAge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sYWJsTXNnLnRleHQgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sYWJsTXNnLnRleHQgPSBcIlwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX19vblNob3duKClcbiAgICB7XG5cbiAgICAgICAgWUsuVGltZURlbGF5Lkluc3RhbmNlLlJlbW92ZSh0aGlzLlNob3duTG9hZGluZ1JpbmcsIHRoaXMpXG4gICAgICAgIFlLLlRpbWVEZWxheS5JbnN0YW5jZS5SZW1vdmUodGhpcy5UaW1lT3V0LCB0aGlzKVxuXG4gICAgICAgIFlLLlRpbWVEZWxheS5JbnN0YW5jZS5BZGQoMSwgMSwgdGhpcy5TaG93bkxvYWRpbmdSaW5nLCB0aGlzKVxuICAgICAgICBZSy5UaW1lRGVsYXkuSW5zdGFuY2UuQWRkKDEwLCAxLCB0aGlzLlRpbWVPdXQsIHRoaXMpXG4gICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCA9IDFcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX19vbkhpZGRlbigpXG4gICAge1xuICAgICAgICBZSy5UaW1lRGVsYXkuSW5zdGFuY2UuUmVtb3ZlKHRoaXMuU2hvd25Mb2FkaW5nUmluZywgdGhpcylcbiAgICAgICAgWUsuVGltZURlbGF5Lkluc3RhbmNlLlJlbW92ZSh0aGlzLlRpbWVPdXQsIHRoaXMpXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgU2hvd25Mb2FkaW5nUmluZygpXG4gICAge1xuICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXggPSAwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y2B56eS6Ieq5Yqo5YWz6ZetXG4gICAgICovXG4gICAgcHVibGljIFRpbWVPdXQoKVxuICAgIHtcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5jbG9zZU1vZGFsV2FpdCgpXG4gICAgfVxuXG59IiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5cbi8qXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xuICAgIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwiXCI7XG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xuICAgIGNvbnN0cnVjdG9yKCl7fVxuICAgIHN0YXRpYyBpbml0KCl7XG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xuXG4gICAgfVxufVxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xuaW1wb3J0IFByb3RvY29sRGVmIGZyb20gXCIuL0dhbWUvRGVmcy9Qcm90b2NvbERlZlwiXG5pbXBvcnQgUm9sZU1vZGUgZnJvbSBcIi4vR2FtZS9Nb2Rlcy9Sb2xlTW9kZVwiO1xuaW1wb3J0IExvYWRpbmdTY2VuZSBmcm9tIFwiLi9HYW1lL1NjZW5lcy9Mb2FkaW5nU2NlbmVcIjtcblxuY2xhc3MgTWFpbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pIExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xuXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcblxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcblx0fVxuXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxuXHRcdExheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XG5cdH1cblxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcblx0XHRmYWlyeWd1aS5VSUNvbmZpZy5wYWNrYWdlRmlsZUV4dGVuc2lvbiA9IFwiYmluXCJcblx0XHRmYWlyeWd1aS5VSUNvbmZpZy5icmluZ1dpbmRvd1RvRnJvbnRPbkNsaWNrID0gZmFsc2Vcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xuXHRcdEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcblx0XHR0aGlzLmluaXRHYW1lKClcblx0fVxuXHRpbml0R2FtZSgpXG4gICAge1xuXHRcdFxuICAgICAgICBmYWlyeWd1aS5VSUNvbmZpZy5nbG9iYWxNb2RhbFdhaXRpbmcgPSBcInVpOi8vTG9hZGluZy93YWl0V2luZFwiXG5cdFx0WUsuTmV0TWdyLkluc3RhbmNlLkFkZFByb3RvKFwibmV0cGFja1wiLCBQcm90b2NvbERlZi5Qcm90b2NvbE5hbWVzKVxuICAgICAgICBZSy5Nb2RlTWdyLkluc3RhbmNlLkFkZE1vZGU8Um9sZU1vZGU+KFJvbGVNb2RlKVxuICAgICAgICBZSy5Nb2RlTWdyLkluc3RhbmNlLkluaXREYXRhKClcblx0XHRZSy5TY2VuZU1nci5JbnN0YW5jZS5Hb1RvU2NlbmUoTG9hZGluZ1NjZW5lKSBcblx0XHRcbiAgICB9XG59XG4vL+a/gOa0u+WQr+WKqOexu1xubmV3IE1haW4oKTtcbiJdfQ==
