import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
var router = Router();
var upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});
// Store dry-run results temporarily (in production, use Redis or similar)
var dryRunCache = new Map();
// Component categories from existing system
var COMPONENT_CATEGORIES = [
    "Ship's Structure",
    'Deck Machinery',
    'Engine Department',
    'Safety Equipment',
    'Accommodation',
    'Hull',
    'Equipment for Cargo',
    'Ship General',
];
// UOM list
var UOM_LIST = [
    'pcs',
    'set',
    'ltr',
    'kg',
    'm',
    'box',
    'roll',
    'pack',
    'kit',
    'other',
];
// Stores categories
var STORES_CATEGORIES = [
    'General Stores',
    'Electrical',
    'Mechanical',
    'Safety',
    'Consumables',
];
// Generate template based on type
router.get('/template', function (req, res) {
    var type = req.query.type;
    if (!['components', 'spares', 'stores'].includes(type)) {
        return res.status(400).json({ error: 'Invalid template type' });
    }
    var workbook = XLSX.utils.book_new();
    var headers = [];
    var validValues = [];
    var example = [];
    switch (type) {
        case 'components':
            headers = __spreadArray(__spreadArray(__spreadArray([
                // Section A
                'Component Code',
                'Component Name',
                'Component Category',
                'Maker',
                'Model',
                'Serial No',
                'Drawing No',
                'Location',
                'Critical (Yes/No)',
                'Condition Based (Yes/No)',
                'Installation Date',
                'Commissioned Date',
                'Rating',
                'No of Units',
                'Eqpt / System Department',
                'Parent Component Code',
                'Dimensions/Size',
                'Notes',
                // Section B
                'Running Hours',
                'Date Updated'
            ], Array.from({ length: 5 }, function (_, i) { return [
                "Metric".concat(i + 1, " Name"),
                "Metric".concat(i + 1, " Value"),
                "Metric".concat(i + 1, " Unit"),
            ]; }).flat(), true), Array.from({ length: 10 }, function (_, i) { return [
                "WO".concat(i + 1, " Title"),
                "WO".concat(i + 1, " Frequency Type (Calendar/Running Hours)"),
                "WO".concat(i + 1, " Frequency Value"),
                "WO".concat(i + 1, " Initial Next Due (Date)"),
                "WO".concat(i + 1, " Assigned To (Rank)"),
            ]; }).flat(), true), Array.from({ length: 10 }, function (_, i) { return [
                "SP".concat(i + 1, " Part Code"),
                "SP".concat(i + 1, " Part Name"),
                "SP".concat(i + 1, " Min"),
                "SP".concat(i + 1, " Critical (Yes/No)"),
                "SP".concat(i + 1, " Location"),
            ]; }).flat(), true);
            validValues = __spreadArray(__spreadArray(__spreadArray([
                'Required, Unique',
                'Text',
                COMPONENT_CATEGORIES.join('|'),
                'Text',
                'Text',
                'Text',
                'Text',
                'Text',
                'Yes/No',
                'Yes/No',
                'DD-MM-YYYY',
                'DD-MM-YYYY',
                'Text',
                'Number >= 0',
                'Text',
                'Existing Code or blank',
                'Text',
                'Text',
                'Number >= 0',
                'DD-MM-YYYY'
            ], Array.from({ length: 5 }, function () { return ['Text', 'Number', 'Text']; }).flat(), true), Array.from({ length: 10 }, function () { return [
                'Text',
                'Calendar/Running Hours',
                'Number > 0',
                'DD-MM-YYYY',
                'Text',
            ]; }).flat(), true), Array.from({ length: 10 }, function () { return [
                'Text',
                'Text',
                'Number >= 0',
                'Yes/No',
                'Text',
            ]; }).flat(), true);
            example = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                '1.1.1',
                'Main Engine',
                'Engine Department',
                'MAN B&W',
                'S60MC-C',
                '12345',
                'DRW-001',
                'Engine Room',
                'Yes',
                'Yes',
                '01-01-2020',
                '15-03-2020',
                '15000 kW',
                '1',
                'Engineering',
                '',
                '10m x 5m x 8m',
                'Main propulsion engine',
                '25000',
                '15-01-2024'
            ], Array.from({ length: 5 }, function () { return ['', '', '']; }).flat(), true), [
                'Cylinder Head Overhaul',
                'Running Hours',
                '8000',
                '01-06-2024',
                'Chief Engineer'
            ], false), Array.from({ length: 9 }, function () { return ['', '', '', '', '']; }).flat(), true), [
                'SP-001',
                'Cylinder Head Gasket',
                '2',
                'Yes',
                'Store Room A'
            ], false), Array.from({ length: 9 }, function () { return ['', '', '', '', '']; }).flat(), true);
            break;
        case 'spares':
            headers = [
                'Part Code',
                'Part Name',
                'Component Code',
                'UOM',
                'Min',
                'Critical (Yes/No)',
                'ROB',
                'Location',
                'Maker',
                'Model',
                'Remarks',
            ];
            validValues = [
                'Required, Unique',
                'Required',
                'Required, Must exist',
                UOM_LIST.join('|'),
                'Number >= 0',
                'Yes/No',
                'Number >= 0',
                'Text',
                'Text',
                'Text',
                'Text',
            ];
            example = [
                'SP-001',
                'Cylinder Head Gasket',
                '1.1.1',
                'pcs',
                '2',
                'Yes',
                '5',
                'Store Room A',
                'MAN B&W',
                'GS-12345',
                'For main engine only',
            ];
            break;
        case 'stores':
            headers = [
                'Item Code',
                'Item Name',
                'Type',
                'Stores Category',
                'UOM',
                'ROB',
                'Min',
                'Location',
                'Application Area',
                'Remarks',
            ];
            validValues = [
                'Required, Unique',
                'Required',
                'Stores|Lubes|Chemicals|Others',
                STORES_CATEGORIES.join('|'),
                UOM_LIST.join('|'),
                'Number >= 0',
                'Number >= 0',
                'Text',
                'Text',
                'Text',
            ];
            example = [
                'ST-001',
                'Welding Electrodes',
                'Stores',
                'General Stores',
                'kg',
                '50',
                '20',
                'Workshop Store',
                'Deck & Engine',
                'AWS E6013 specification',
            ];
            break;
    }
    // Create main sheet
    var mainSheet = XLSX.utils.aoa_to_sheet([headers, validValues, example]);
    XLSX.utils.book_append_sheet(workbook, mainSheet, 'Data');
    // Create meta sheet
    var metaData = [
        ['Template Type', type],
        ['Template Version', '1.0'],
        ['Generated At', new Date().toISOString()],
        [''],
        __spreadArray(['Component Categories'], COMPONENT_CATEGORIES, true),
        __spreadArray(['UOM List'], UOM_LIST, true),
        __spreadArray(['Stores Categories'], STORES_CATEGORIES, true),
    ];
    var metaSheet = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(workbook, metaSheet, 'Meta');
    // Send file
    var buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', "attachment; filename=\"".concat(type, "_template.xlsx\""));
    res.send(buffer);
});
// Dry-run validation
router.post('/dry-run', upload.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, mode, archiveMissing, vesselId, file, data, ext, csvText, parsed, workbook, firstSheet, results, fileToken, oneHourAgo_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, type = _a.type, mode = _a.mode, archiveMissing = _a.archiveMissing, vesselId = _a.vesselId;
                file = req.file;
                if (!file) {
                    return [2 /*return*/, res.status(400).json({ error: 'No file uploaded' })];
                }
                if (!['components', 'spares', 'stores'].includes(type)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid type' })];
                }
                if (!['add', 'update', 'upsert'].includes(mode)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid mode' })];
                }
                data = [];
                ext = path.extname(file.originalname).toLowerCase();
                if (ext === '.csv') {
                    csvText = file.buffer.toString('utf-8');
                    parsed = Papa.parse(csvText, {
                        header: true,
                        skipEmptyLines: true,
                    });
                    data = parsed.data;
                }
                else if (['.xlsx', '.xls'].includes(ext)) {
                    workbook = XLSX.read(file.buffer);
                    firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    data = XLSX.utils.sheet_to_json(firstSheet);
                }
                else {
                    return [2 /*return*/, res.status(400).json({ error: 'Unsupported file format' })];
                }
                return [4 /*yield*/, validateData(type, data, mode, vesselId)];
            case 1:
                results = _b.sent();
                fileToken = uuidv4();
                // Cache the results and file for import
                dryRunCache.set(fileToken, {
                    type: type,
                    mode: mode,
                    archiveMissing: archiveMissing === 'true',
                    vesselId: vesselId,
                    data: data,
                    results: results,
                    file: file.buffer,
                    originalName: file.originalname,
                    timestamp: Date.now(),
                });
                oneHourAgo_1 = Date.now() - 3600000;
                Array.from(dryRunCache.entries()).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (value.timestamp < oneHourAgo_1) {
                        dryRunCache.delete(key);
                    }
                });
                res.json({
                    fileToken: fileToken,
                    columns: results.columns,
                    summary: results.summary,
                    rows: results.rows.slice(0, 100), // Limit preview to 100 rows
                    errorReportUrl: results.summary.errors > 0
                        ? "/api/bulk/history/tmp/".concat(fileToken, "/errors.csv")
                        : undefined,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Dry-run error:', error_1);
                res.status(500).json({ error: 'Failed to process file' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Actual import
router.post('/import', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fileToken, type, mode, archiveMissing, vesselId, cachedData, importResult, historyId, error_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, fileToken = _a.fileToken, type = _a.type, mode = _a.mode, archiveMissing = _a.archiveMissing, vesselId = _a.vesselId;
                cachedData = dryRunCache.get(fileToken);
                if (!cachedData) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid or expired file token' })];
                }
                // Check if there are errors
                if (cachedData.results.summary.errors > 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'Cannot import file with errors' })];
                }
                return [4 /*yield*/, performImport(type, cachedData.data, mode, archiveMissing, vesselId, ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || 'system')];
            case 1:
                importResult = _d.sent();
                historyId = uuidv4();
                return [4 /*yield*/, storeImportHistory(__assign(__assign({ id: historyId, type: type, mode: mode, archiveMissing: archiveMissing, userId: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || 'system', vesselId: vesselId }, importResult), { startedAt: new Date(), finishedAt: new Date(), status: 'success', originalFile: cachedData.file, originalName: cachedData.originalName }))];
            case 2:
                _d.sent();
                // Clean up cache
                dryRunCache.delete(fileToken);
                res.json(__assign(__assign({}, importResult), { historyId: historyId }));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _d.sent();
                console.error('Import error:', error_2);
                res.status(500).json({ error: 'Failed to import data' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get import history
router.get('/history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, _b, limit, _c, offset, history_1, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, type = _a.type, _b = _a.limit, limit = _b === void 0 ? 20 : _b, _c = _a.offset, offset = _c === void 0 ? 0 : _c;
                return [4 /*yield*/, getImportHistory(type, parseInt(limit), parseInt(offset))];
            case 1:
                history_1 = _d.sent();
                res.json(history_1);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _d.sent();
                console.error('History error:', error_3);
                res.status(500).json({ error: 'Failed to fetch history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Download history files
router.get('/history/:id/:fileType', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, fileType, file, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, id = _a.id, fileType = _a.fileType;
                return [4 /*yield*/, getHistoryFile(id, fileType)];
            case 1:
                file = _b.sent();
                if (!file) {
                    return [2 /*return*/, res.status(404).json({ error: 'File not found' })];
                }
                res.setHeader('Content-Type', file.mimeType);
                res.setHeader('Content-Disposition', "attachment; filename=\"".concat(file.name, "\""));
                res.send(file.data);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('File download error:', error_4);
                res.status(500).json({ error: 'Failed to download file' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Validation function
function validateData(type, data, mode, vesselId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _loop_1, i;
        return __generator(this, function (_a) {
            results = {
                columns: [],
                summary: { ok: 0, warnings: 0, errors: 0 },
                rows: [],
            };
            if (data.length === 0) {
                results.summary.errors = 1;
                return [2 /*return*/, results];
            }
            // Get columns from first row
            results.columns = Object.keys(data[0]);
            _loop_1 = function (i) {
                var row = data[i];
                var rowNum = i + 2; // Excel rows start at 1, plus header
                var errors = [];
                var warnings = [];
                var normalized = {};
                if (type === 'components') {
                    // Validate component
                    if (!row['Component Code']) {
                        errors.push("Row ".concat(rowNum, ": Component Code is required"));
                    }
                    else {
                        normalized['Component Code'] = row['Component Code'].trim();
                    }
                    if (!row['Component Category']) {
                        errors.push("Row ".concat(rowNum, ": Component Category is required"));
                    }
                    else if (!COMPONENT_CATEGORIES.includes(row['Component Category'])) {
                        errors.push("Row ".concat(rowNum, ": Invalid Component Category. Allowed: ").concat(COMPONENT_CATEGORIES.join(', ')));
                    }
                    else {
                        normalized['Component Category'] = row['Component Category'];
                    }
                    // Validate Yes/No fields
                    ['Critical (Yes/No)', 'Condition Based (Yes/No)'].forEach(function (field) {
                        if (row[field]) {
                            var value = row[field].toString().toLowerCase();
                            if (!['yes', 'no'].includes(value)) {
                                errors.push("Row ".concat(rowNum, ": ").concat(field, " must be Yes or No"));
                            }
                            else {
                                normalized[field] = value === 'yes' ? 'Yes' : 'No';
                            }
                        }
                    });
                    // Validate numbers
                    ['No of Units', 'Running Hours'].forEach(function (field) {
                        if (row[field]) {
                            var num = parseFloat(row[field]);
                            if (isNaN(num) || num < 0) {
                                errors.push("Row ".concat(rowNum, ": ").concat(field, " must be a non-negative number"));
                            }
                            else {
                                normalized[field] = num;
                            }
                        }
                    });
                    // Copy other fields
                    Object.keys(row).forEach(function (key) {
                        if (!normalized[key]) {
                            normalized[key] = row[key];
                        }
                    });
                }
                else if (type === 'spares') {
                    // Validate spare
                    if (!row['Part Code']) {
                        errors.push("Row ".concat(rowNum, ": Part Code is required"));
                    }
                    else {
                        normalized['Part Code'] = row['Part Code'].trim();
                    }
                    if (!row['Part Name']) {
                        errors.push("Row ".concat(rowNum, ": Part Name is required"));
                    }
                    else {
                        normalized['Part Name'] = row['Part Name'].trim();
                    }
                    if (!row['Component Code']) {
                        errors.push("Row ".concat(rowNum, ": Component Code is required"));
                    }
                    else {
                        normalized['Component Code'] = row['Component Code'].trim();
                        // TODO: Check if component exists
                    }
                    if (row['UOM'] && !UOM_LIST.includes(row['UOM'].toLowerCase())) {
                        errors.push("Row ".concat(rowNum, ": Invalid UOM. Allowed: ").concat(UOM_LIST.join(', ')));
                    }
                    else if (row['UOM']) {
                        normalized['UOM'] = row['UOM'].toLowerCase();
                    }
                    // Validate numbers
                    ['Min', 'ROB'].forEach(function (field) {
                        if (row[field]) {
                            var num = parseFloat(row[field]);
                            if (isNaN(num) || num < 0) {
                                errors.push("Row ".concat(rowNum, ": ").concat(field, " must be a non-negative number"));
                            }
                            else {
                                normalized[field] = num;
                            }
                        }
                    });
                    // Validate Critical
                    if (row['Critical (Yes/No)']) {
                        var value = row['Critical (Yes/No)'].toString().toLowerCase();
                        if (!['yes', 'no'].includes(value)) {
                            errors.push("Row ".concat(rowNum, ": Critical must be Yes or No"));
                        }
                        else {
                            normalized['Critical (Yes/No)'] = value === 'yes' ? 'Yes' : 'No';
                        }
                    }
                    // Copy other fields
                    Object.keys(row).forEach(function (key) {
                        if (!normalized[key]) {
                            normalized[key] = row[key];
                        }
                    });
                }
                else if (type === 'stores') {
                    // Validate stores
                    if (!row['Item Code']) {
                        errors.push("Row ".concat(rowNum, ": Item Code is required"));
                    }
                    else {
                        normalized['Item Code'] = row['Item Code'].trim();
                    }
                    if (!row['Item Name']) {
                        errors.push("Row ".concat(rowNum, ": Item Name is required"));
                    }
                    else {
                        normalized['Item Name'] = row['Item Name'].trim();
                    }
                    if (row['Type'] &&
                        !['Stores', 'Lubes', 'Chemicals', 'Others'].includes(row['Type'])) {
                        errors.push("Row ".concat(rowNum, ": Invalid Type. Allowed: Stores, Lubes, Chemicals, Others"));
                    }
                    else if (row['Type']) {
                        normalized['Type'] = row['Type'];
                    }
                    if (row['UOM'] && !UOM_LIST.includes(row['UOM'].toLowerCase())) {
                        errors.push("Row ".concat(rowNum, ": Invalid UOM. Allowed: ").concat(UOM_LIST.join(', ')));
                    }
                    else if (row['UOM']) {
                        normalized['UOM'] = row['UOM'].toLowerCase();
                    }
                    // Validate numbers
                    ['ROB', 'Min'].forEach(function (field) {
                        if (row[field]) {
                            var num = parseFloat(row[field]);
                            if (isNaN(num) || num < 0) {
                                errors.push("Row ".concat(rowNum, ": ").concat(field, " must be a non-negative number"));
                            }
                            else {
                                normalized[field] = num;
                            }
                        }
                    });
                    // Copy other fields
                    Object.keys(row).forEach(function (key) {
                        if (!normalized[key]) {
                            normalized[key] = row[key];
                        }
                    });
                }
                // Determine status
                var status_1 = 'ok';
                if (errors.length > 0) {
                    status_1 = 'error';
                    results.summary.errors++;
                }
                else if (warnings.length > 0) {
                    status_1 = 'warning';
                    results.summary.warnings++;
                }
                else {
                    results.summary.ok++;
                }
                results.rows.push({
                    row: rowNum,
                    status: status_1,
                    errors: __spreadArray(__spreadArray([], errors, true), warnings, true),
                    normalized: normalized,
                });
            };
            // Validate each row based on type
            for (i = 0; i < data.length; i++) {
                _loop_1(i);
            }
            return [2 /*return*/, results];
        });
    });
}
// Perform actual import
function performImport(type, data, mode, archiveMissing, vesselId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, _i, data_1, row, exists;
        return __generator(this, function (_a) {
            result = {
                created: 0,
                updated: 0,
                skipped: 0,
                archived: 0,
            };
            // TODO: Implement actual database operations
            // This is a placeholder that simulates the import
            for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                row = data_1[_i];
                if (mode === 'add') {
                    // Check if exists, if yes skip, else create
                    result.created++;
                }
                else if (mode === 'update') {
                    // Check if exists, if yes update, else skip
                    result.updated++;
                }
                else if (mode === 'upsert') {
                    exists = Math.random() > 0.5;
                    if (exists) {
                        result.updated++;
                    }
                    else {
                        result.created++;
                    }
                }
            }
            if (archiveMissing) {
                // Archive records not in the file
                result.archived = Math.floor(Math.random() * 5); // Simulated
            }
            return [2 /*return*/, result];
        });
    });
}
// Store import history
function storeImportHistory(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Store in database
            // For now, using in-memory storage
            if (!global.importHistory) {
                global.importHistory = [];
            }
            global.importHistory.push(data);
            return [2 /*return*/];
        });
    });
}
// Get import history
function getImportHistory(type, limit, offset) {
    return __awaiter(this, void 0, void 0, function () {
        var history, filtered;
        return __generator(this, function (_a) {
            history = global.importHistory || [];
            filtered = history;
            if (type) {
                filtered = history.filter(function (h) { return h.type === type; });
            }
            return [2 /*return*/, {
                    items: filtered.slice(offset, offset + limit).map(function (h) { return ({
                        id: h.id,
                        date: h.startedAt,
                        user: h.userId,
                        mode: h.mode,
                        created: h.created,
                        updated: h.updated,
                        skipped: h.skipped,
                        archived: h.archived,
                    }); }),
                    total: filtered.length,
                }];
        });
    });
}
// Get history file
function getHistoryFile(id, fileType) {
    return __awaiter(this, void 0, void 0, function () {
        var history;
        return __generator(this, function (_a) {
            history = (global.importHistory || []).find(function (h) { return h.id === id; });
            if (!history)
                return [2 /*return*/, null];
            if (fileType === 'file') {
                return [2 /*return*/, {
                        data: history.originalFile,
                        mimeType: 'application/octet-stream',
                        name: history.originalName,
                    }];
            }
            // Generate error report or result map as needed
            return [2 /*return*/, null];
        });
    });
}
export default router;
//# sourceMappingURL=bulk.js.map