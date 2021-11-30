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
var dayjs_1 = require("dayjs");
var kont_1 = require("kont");
var loginProvider_1 = require("./lib/loginProvider");
var testUtils_1 = require("./lib/testUtils");
jest.setTimeout(60e3);
jest.retryTimes(3);
describe("webhooks", function () {
    var ctx = kont_1.kont()
        .useBeforeEach(loginProvider_1.loginProvider({
        user: "pro",
        path: "/integrations",
        waitForSelector: '[data-testid="new_webhook"]'
    }))
        .done();
    test("add webhook & test that creating an event triggers a webhook call", function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, webhookReceiver, tomorrow, tomorrowFormatted, request, body, dynamic, _i, _a, attendee;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    page = ctx.page;
                    webhookReceiver = testUtils_1.createHttpServer();
                    // --- add webhook
                    return [4 /*yield*/, page.click('[data-testid="new_webhook"]')];
                case 1:
                    // --- add webhook
                    _b.sent();
                    return [4 /*yield*/, expect(page).toHaveSelector("[data-testid='WebhookDialogForm']")];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.fill('[name="subscriberUrl"]', webhookReceiver.url)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.click("[type=submit]")];
                case 4:
                    _b.sent();
                    // dialog is closed
                    return [4 /*yield*/, expect(page).not.toHaveSelector("[data-testid='WebhookDialogForm']")];
                case 5:
                    // dialog is closed
                    _b.sent();
                    // page contains the url
                    return [4 /*yield*/, expect(page).toHaveSelector("text='" + webhookReceiver.url + "'")];
                case 6:
                    // page contains the url
                    _b.sent();
                    tomorrow = dayjs_1["default"]().add(1, "day");
                    tomorrowFormatted = tomorrow.format("YYYY-MM-DDZZ");
                    return [4 /*yield*/, page.goto("http://localhost:8080/pro/30min?date=" + encodeURIComponent(tomorrowFormatted))];
                case 7:
                    _b.sent();
                    // click first time available
                    return [4 /*yield*/, page.click("[data-testid=time]")];
                case 8:
                    // click first time available
                    _b.sent();
                    // --- fill form
                    return [4 /*yield*/, page.fill('[name="name"]', "Test Testson")];
                case 9:
                    // --- fill form
                    _b.sent();
                    return [4 /*yield*/, page.fill('[name="email"]', "test@example.com")];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, page.press('[name="email"]', "Enter")];
                case 11:
                    _b.sent();
                    // --- check that webhook was called
                    return [4 /*yield*/, testUtils_1.waitFor(function () {
                            expect(webhookReceiver.requestList.length).toBe(1);
                        })];
                case 12:
                    // --- check that webhook was called
                    _b.sent();
                    request = webhookReceiver.requestList[0];
                    body = request.body;
                    dynamic = "[redacted/dynamic]";
                    body.createdAt = dynamic;
                    body.payload.startTime = dynamic;
                    body.payload.endTime = dynamic;
                    for (_i = 0, _a = body.payload.attendees; _i < _a.length; _i++) {
                        attendee = _a[_i];
                        attendee.timeZone = dynamic;
                    }
                    body.payload.organizer.timeZone = dynamic;
                    body.payload.uid = dynamic;
                    // if we change the shape of our webhooks, we can simply update this by clicking `u`
                    // console.log("BODY", body);
                    expect(body).toMatchInlineSnapshot("\n    Object {\n      \"createdAt\": \"[redacted/dynamic]\",\n      \"payload\": Object {\n        \"attendees\": Array [\n          Object {\n            \"email\": \"test@example.com\",\n            \"name\": \"Test Testson\",\n            \"timeZone\": \"[redacted/dynamic]\",\n          },\n        ],\n        \"description\": \"\",\n        \"endTime\": \"[redacted/dynamic]\",\n        \"organizer\": Object {\n          \"email\": \"pro@example.com\",\n          \"name\": \"Pro Example\",\n          \"timeZone\": \"[redacted/dynamic]\",\n        },\n        \"startTime\": \"[redacted/dynamic]\",\n        \"title\": \"30min between Pro Example and Test Testson\",\n        \"type\": \"30min\",\n        \"uid\": \"[redacted/dynamic]\",\n      },\n      \"triggerEvent\": \"BOOKING_CREATED\",\n    }\n  ");
                    webhookReceiver.close();
                    return [2 /*return*/];
            }
        });
    }); });
});
