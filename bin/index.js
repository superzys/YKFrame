/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js");
loadLib("libs/laya.webgl.js");
loadLib("libs/laya.ui.js");
loadLib("libs/laya.physics.js");

loadLib("libs/rawinflate/rawinflate.min.js");
loadLib("libs/fairygui/fairygui.min.js");
loadLib("../protobuf/library/protobuf-library.js");
loadLib("../protobuf/bundles/protobuf-bundles.js");
//-----libs-end-------
loadLib("js/ykLib.js");
loadLib("js/bundle.js");
