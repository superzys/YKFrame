import GameConfig from "./GameConfig";
import ProtocolDef from "./Game/Defs/ProtocolDef"
import RoleMode from "./Game/Modes/RoleMode";
import LoadingScene from "./Game/Scenes/LoadingScene";

class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
		fairygui.UIConfig.packageFileExtension = "bin"
		fairygui.UIConfig.bringWindowToFrontOnClick = false
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		this.initGame()

		// Laya.loader.load([
		//     { url: "res/external/BasePack_atlas0.png", type: Laya.Loader.IMAGE },
		//     { url: "res/external/BasePack.bin", type:Laya. Loader.BUFFER },
		//     { url: "res/source/Loading_atlas_vckm32.jpg", type: Laya.Loader.IMAGE },
		//     { url: "res/source/Loading_atlas0.png", type: Laya.Loader.IMAGE },
		//     { url: "res/source/Loading.bin", type:Laya. Loader.BUFFER },
		//     { url: "res/external/GamePack_atlas0.png", type: Laya.Loader.IMAGE },
		//     { url: "res/external/GamePack.bin", type:Laya. Loader.BUFFER },
		//     { url: "res/external/LoginPack.bin", type:Laya. Loader.BUFFER }
		// ], Laya.Handler.create(this, this.onLoaded));
	}
	//直接fgui测试 是没问题的
	// onLoaded(){
	// 	Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
	// 	fairygui.UIPackage.addPackage("res/external/BasePack");
	// 	fairygui.UIPackage.addPackage("res/source/Loading");
	// 	fairygui.UIPackage.addPackage("res/external/GamePack");
	// 	fairygui.UIPackage.addPackage("res/external/LoginPack");

	// 	let _view = fairygui.UIPackage.createObject("LoginPack", "LoginWindow");
	//     _view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
	//     fairygui.GRoot.inst.addChild(_view);

	// }
	initGame()  {

		fairygui.UIConfig.globalModalWaiting = "ui://Loading/waitWind"
		YK.NetMgr.Instance.AddProto("netpack", ProtocolDef.ProtocolNames)
		YK.ModeMgr.Instance.AddMode<RoleMode>(RoleMode)
		YK.ModeMgr.Instance.InitData()
		YK.SceneMgr.Instance.GoToScene(LoadingScene)

	}
}
//激活启动类
new Main();
