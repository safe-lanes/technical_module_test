import { __awaiter, __generator, __spreadArray } from "tslib";
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    var start = Date.now();
    var path = req.path;
    var capturedJsonResponse = undefined;
    var originalResJson = res.json;
    res.json = function (bodyJson) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, __spreadArray([bodyJson], args, true));
    };
    res.on("finish", function () {
        var duration = Date.now() - start;
        if (path.startsWith("/api")) {
            var logLine = "".concat(req.method, " ").concat(path, " ").concat(res.statusCode, " in ").concat(duration, "ms");
            if (capturedJsonResponse) {
                logLine += " :: ".concat(JSON.stringify(capturedJsonResponse));
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            log(logLine);
        }
    });
    next();
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var server, port;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, registerRoutes(app)];
            case 1:
                server = _a.sent();
                app.use(function (err, _req, res, _next) {
                    var status = err.status || err.statusCode || 500;
                    var message = err.message || "Internal Server Error";
                    res.status(status).json({ message: message });
                    throw err;
                });
                if (!(app.get("env") === "development")) return [3 /*break*/, 3];
                return [4 /*yield*/, setupVite(app, server)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                serveStatic(app);
                _a.label = 4;
            case 4:
                port = 5000;
                server.listen({
                    port: port,
                    host: "0.0.0.0",
                    reusePort: true,
                }, function () {
                    log("serving on port ".concat(port));
                });
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map