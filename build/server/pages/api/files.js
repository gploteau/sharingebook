"use strict";
(() => {
var exports = {};
exports.id = 209;
exports.ids = [209];
exports.modules = {

/***/ 1108:
/***/ ((module) => {

module.exports = require("get-audio-duration");

/***/ }),

/***/ 1490:
/***/ ((module) => {

module.exports = require("md5");

/***/ }),

/***/ 3916:
/***/ ((module) => {

module.exports = import("music-metadata");;

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 7109:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var music_metadata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3916);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([music_metadata__WEBPACK_IMPORTED_MODULE_2__]);
music_metadata__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const { getAudioDurationInSeconds } = __webpack_require__(1108);
const md5 = __webpack_require__(1490);
const getTracks = async ()=>{
    const dirRelativeToPublicFolder = "sound";
    const db_file = path__WEBPACK_IMPORTED_MODULE_1___default().resolve("./public", "db.json");
    let db = [];
    if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(db_file)) {
        db = JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(db_file));
    }
    const dir = path__WEBPACK_IMPORTED_MODULE_1___default().resolve("./public", dirRelativeToPublicFolder);
    const filenames = fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(dir);
    if (filenames.length === db.length) {
        return db;
    }
    const tracks = await Promise.all(filenames.map((name)=>{
        path__WEBPACK_IMPORTED_MODULE_1___default().join("/", dirRelativeToPublicFolder, name);
        const metaData = music_metadata__WEBPACK_IMPORTED_MODULE_2__.parseFile(path__WEBPACK_IMPORTED_MODULE_1___default().join(dir, name));
        const duration = getAudioDurationInSeconds(path__WEBPACK_IMPORTED_MODULE_1___default().join(dir, name));
        return duration.then((duration)=>{
            return metaData.then((metadata)=>{
                let cover = metadata.common.picture ? "data:" + metadata.common.picture[0].format + ";base64," + Buffer.from(metadata.common.picture[0].data).toString("base64") : "";
                return {
                    id: md5(name),
                    duration: duration,
                    file: path__WEBPACK_IMPORTED_MODULE_1___default().join("/", dirRelativeToPublicFolder, name),
                    title: metadata.common.title || name,
                    author: metadata.common.artist,
                    cover: cover
                };
            });
        });
    }));
    fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(db_file, JSON.stringify(tracks));
    return tracks;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{
    const images = await getTracks();
    return res.status(200).json(images);
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(7109));
module.exports = __webpack_exports__;

})();