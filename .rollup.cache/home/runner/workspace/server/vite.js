import { __assign, __awaiter, __generator } from 'tslib';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer, createLogger } from 'vite';
import viteConfig from '../vite.config';
import { nanoid } from 'nanoid';
var viteLogger = createLogger();
export function log(message, source) {
  if (source === void 0) {
    source = 'express';
  }
  var formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  console.log(
    ''.concat(formattedTime, ' [').concat(source, '] ').concat(message)
  );
}
export function setupVite(app, server) {
  return __awaiter(this, void 0, void 0, function () {
    var serverOptions, vite;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          serverOptions = {
            middlewareMode: true,
            hmr: { server: server },
            allowedHosts: true,
          };
          return [
            4 /*yield*/,
            createViteServer(
              __assign(__assign({}, viteConfig), {
                configFile: false,
                customLogger: __assign(__assign({}, viteLogger), {
                  error: function (msg, options) {
                    viteLogger.error(msg, options);
                    process.exit(1);
                  },
                }),
                server: serverOptions,
                appType: 'custom',
              })
            ),
          ];
        case 1:
          vite = _a.sent();
          app.use(vite.middlewares);
          app.use('*', function (req, res, next) {
            return __awaiter(_this, void 0, void 0, function () {
              var url, clientTemplate, template, page, e_1;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    url = req.originalUrl;
                    _a.label = 1;
                  case 1:
                    _a.trys.push([1, 4, , 5]);
                    clientTemplate = path.resolve(
                      import.meta.dirname,
                      '..',
                      'client',
                      'index.html'
                    );
                    return [
                      4 /*yield*/,
                      fs.promises.readFile(clientTemplate, 'utf-8'),
                    ];
                  case 2:
                    template = _a.sent();
                    template = template.replace(
                      'src="/src/main.tsx"',
                      'src="/src/main.tsx?v='.concat(nanoid(), '"')
                    );
                    return [
                      4 /*yield*/,
                      vite.transformIndexHtml(url, template),
                    ];
                  case 3:
                    page = _a.sent();
                    res
                      .status(200)
                      .set({ 'Content-Type': 'text/html' })
                      .end(page);
                    return [3 /*break*/, 5];
                  case 4:
                    e_1 = _a.sent();
                    vite.ssrFixStacktrace(e_1);
                    next(e_1);
                    return [3 /*break*/, 5];
                  case 5:
                    return [2 /*return*/];
                }
              });
            });
          });
          return [2 /*return*/];
      }
    });
  });
}
export function serveStatic(app) {
  var distPath = path.resolve(import.meta.dirname, 'public');
  if (!fs.existsSync(distPath)) {
    throw new Error(
      'Could not find the build directory: '.concat(
        distPath,
        ', make sure to build the client first'
      )
    );
  }
  app.use(express.static(distPath));
  // fall through to index.html if the file doesn't exist
  app.use('*', function (_req, res) {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}
//# sourceMappingURL=vite.js.map
