import { __awaiter, __generator } from "tslib";
import { QueryClient } from '@tanstack/react-query';
function throwIfResNotOk(res) {
    return __awaiter(this, void 0, void 0, function () {
        var text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!res.ok) return [3 /*break*/, 2];
                    return [4 /*yield*/, res.text()];
                case 1:
                    text = (_a.sent()) || res.statusText;
                    throw new Error("".concat(res.status, ": ").concat(text));
                case 2: return [2 /*return*/];
            }
        });
    });
}
export function apiRequest(method, url, data) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: method,
                        headers: data ? { 'Content-Type': 'application/json' } : {},
                        body: data ? JSON.stringify(data) : undefined,
                        credentials: 'include',
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, throwIfResNotOk(res)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
export var getQueryFn = function (_a) {
    var unauthorizedBehavior = _a.on401;
    return function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var res;
        var queryKey = _b.queryKey;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch(queryKey[0], {
                        method: 'GET',
                        credentials: 'include',
                    })];
                case 1:
                    res = _c.sent();
                    if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, throwIfResNotOk(res)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, res.json()];
                case 3: return [2 /*return*/, _c.sent()];
            }
        });
    }); };
};
export var queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: 'throw' }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
//# sourceMappingURL=queryClient.js.map