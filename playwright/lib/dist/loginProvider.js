"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.loginProvider = void 0;
/* eslint-disable @typescript-eslint/ban-types */
var kont_1 = require("kont");
var cookieCache = new Map();
/**
 * Creates a new context / "incognito tab" and logs in the specified user
 */
function loginProvider(opts) {
    var _this = this;
    return kont_1.provider()
        .name("login")
        .before(function () { return __awaiter(_this, void 0, void 0, function () {
        var context, page, cachedCookies, cookies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.newContext()];
                case 1:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 2:
                    page = _a.sent();
                    cachedCookies = cookieCache.get(opts.user);
                    if (!cachedCookies) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.addCookies(cachedCookies)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 4: return [4 /*yield*/, page.goto("http://localhost:8080/auth/login")];
                case 5:
                    _a.sent();
                    // Click input[name="email"]
                    return [4 /*yield*/, page.click('input[name="email"]')];
                case 6:
                    // Click input[name="email"]
                    _a.sent();
                    // Fill input[name="email"]
                    return [4 /*yield*/, page.fill('input[name="email"]', opts.user + "@example.com")];
                case 7:
                    // Fill input[name="email"]
                    _a.sent();
                    // Press Tab
                    return [4 /*yield*/, page.press('input[name="email"]', "Tab")];
                case 8:
                    // Press Tab
                    _a.sent();
                    // Fill input[name="password"]
                    return [4 /*yield*/, page.fill('input[name="password"]', opts.user)];
                case 9:
                    // Fill input[name="password"]
                    _a.sent();
                    // Press Enter
                    return [4 /*yield*/, page.press('input[name="password"]', "Enter")];
                case 10:
                    // Press Enter
                    _a.sent();
                    return [4 /*yield*/, page.waitForNavigation({
                            url: function (url) {
                                return !url.pathname.startsWith("/auth");
                            }
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, context.cookies()];
                case 12:
                    cookies = _a.sent();
                    cookieCache.set(opts.user, cookies);
                    _a.label = 13;
                case 13:
                    if (!opts.path) return [3 /*break*/, 15];
                    return [4 /*yield*/, page.goto("http://localhost:8080" + opts.path)];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15:
                    if (!opts.waitForSelector) return [3 /*break*/, 17];
                    return [4 /*yield*/, page.waitForSelector(opts.waitForSelector)];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17: return [2 /*return*/, {
                        page: page,
                        context: context
                    }];
            }
        });
    }); })
        .after(function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ((_a = ctx.page) === null || _a === void 0 ? void 0 : _a.close())];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, ((_b = ctx.context) === null || _b === void 0 ? void 0 : _b.close())];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); })
        .done();
}
exports.loginProvider = loginProvider;
