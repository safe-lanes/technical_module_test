import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
var alertTypeLabels = {
    maintenance_due: 'Maintenance Due',
    critical_inventory: 'Critical Inventory',
    running_hours: 'Running Hours Threshold',
    certificate_expiration: 'Certificate Expiration',
    system_backup: 'System Backup',
};
var roleOptions = [
    'Chief Engineer',
    '2nd Engineer',
    '3rd Engineer',
    'Tech Superintendent',
    'Office',
    'Captain',
    'Chief Officer',
];
var certificateTypes = [
    'Class Certificates',
    'Flag',
    'Insurance',
    'Survey',
    'ISM',
    'ISPS',
    'MLC',
];
var componentCategories = [
    'Ship General',
    'Hull',
    'Equipment for Cargo',
    "Ship's Equipment",
    'Equipment for Crew & Passengers',
    'Machinery Main Components',
    'Systems for Machinery Main Components',
    'Ship Common Systems',
];
export default function AlertPolicyDrawer(_a) {
    var _this = this;
    var policy = _a.policy, open = _a.open, onOpenChange = _a.onOpenChange, onSave = _a.onSave;
    var toast = useToast().toast;
    var _b = useState(policy), localPolicy = _b[0], setLocalPolicy = _b[1];
    var _c = useState({}), thresholds = _c[0], setThresholds = _c[1];
    var _d = useState({}), scopeFilters = _d[0], setScopeFilters = _d[1];
    var _e = useState({ roles: [], users: [] }), recipients = _e[0], setRecipients = _e[1];
    useEffect(function () {
        setLocalPolicy(policy);
        try {
            setThresholds(JSON.parse(policy.thresholds || '{}'));
            setScopeFilters(JSON.parse(policy.scopeFilters || '{}'));
            setRecipients(JSON.parse(policy.recipients || '{"roles":[],"users":[]}'));
        }
        catch (e) {
            console.error('Error parsing policy data:', e);
        }
    }, [policy]);
    var handleSave = function () {
        var updatedPolicy = __assign(__assign({}, localPolicy), { thresholds: JSON.stringify(thresholds), scopeFilters: JSON.stringify(scopeFilters), recipients: JSON.stringify(recipients) });
        onSave(updatedPolicy);
    };
    var handleSendTest = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('/api/alerts/test', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                policyId: policy.id,
                                userId: 'user1',
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to send test alert');
                    toast({
                        title: 'Test Alert Sent',
                        description: 'A test alert has been sent to your configured channels.',
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    toast({
                        title: 'Test Failed',
                        description: 'Failed to send test alert. Please try again.',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var renderThresholdFields = function () {
        switch (policy.alertType) {
            case 'maintenance_due':
                return (<>
            <div className='space-y-2'>
              <Label htmlFor='days-before'>Days Before Due</Label>
              <Input id='days-before' type='number' value={thresholds.daysBeforeDue || 7} onChange={function (e) {
                        return setThresholds(__assign(__assign({}, thresholds), { daysBeforeDue: parseInt(e.target.value) }));
                    }}/>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox id='pending-approval' checked={thresholds.includePendingApproval || false} onCheckedChange={function (checked) {
                        return setThresholds(__assign(__assign({}, thresholds), { includePendingApproval: checked }));
                    }}/>
              <Label htmlFor='pending-approval'>Include Pending Approval</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox id='only-critical' checked={thresholds.onlyCritical || false} onCheckedChange={function (checked) {
                        return setThresholds(__assign(__assign({}, thresholds), { onlyCritical: checked }));
                    }}/>
              <Label htmlFor='only-critical'>Only Critical Items</Label>
            </div>
          </>);
            case 'running_hours':
                return (<>
            <div className='space-y-2'>
              <Label htmlFor='hours-before'>Hours Before Service</Label>
              <Input id='hours-before' type='number' value={thresholds.hoursBeforeService || 100} onChange={function (e) {
                        return setThresholds(__assign(__assign({}, thresholds), { hoursBeforeService: parseInt(e.target.value) }));
                    }}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='utilization-spike'>
                Utilization Spike % (Optional)
              </Label>
              <Input id='utilization-spike' type='number' value={thresholds.utilizationSpikePercent || ''} onChange={function (e) {
                        return setThresholds(__assign(__assign({}, thresholds), { utilizationSpikePercent: e.target.value
                                ? parseInt(e.target.value)
                                : null }));
                    }} placeholder='Leave empty to disable'/>
            </div>
          </>);
            case 'critical_inventory':
                return (<>
            <div className='space-y-2'>
              <Label htmlFor='buffer-qty'>Buffer Quantity</Label>
              <Input id='buffer-qty' type='number' value={thresholds.bufferQty || 0} onChange={function (e) {
                        return setThresholds(__assign(__assign({}, thresholds), { bufferQty: parseInt(e.target.value) }));
                    }}/>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox id='include-non-critical' checked={thresholds.includeNonCritical || false} onCheckedChange={function (checked) {
                        return setThresholds(__assign(__assign({}, thresholds), { includeNonCritical: checked }));
                    }}/>
              <Label htmlFor='include-non-critical'>
                Include Non-Critical Items
              </Label>
            </div>
          </>);
            case 'certificate_expiration':
                return (<>
            <div className='space-y-2'>
              <Label htmlFor='days-expiry'>Days Before Expiry</Label>
              <Input id='days-expiry' type='number' value={thresholds.daysBeforeExpiry || 30} onChange={function (e) {
                        return setThresholds(__assign(__assign({}, thresholds), { daysBeforeExpiry: parseInt(e.target.value) }));
                    }}/>
            </div>
            <div className='space-y-2'>
              <Label>Certificate Types</Label>
              <div className='space-y-2'>
                {certificateTypes.map(function (type) { return (<div key={type} className='flex items-center space-x-2'>
                    <Checkbox id={"cert-".concat(type)} checked={(thresholds.types || []).includes(type)} onCheckedChange={function (checked) {
                            var types = thresholds.types || [];
                            if (checked) {
                                setThresholds(__assign(__assign({}, thresholds), { types: __spreadArray(__spreadArray([], types, true), [type], false) }));
                            }
                            else {
                                setThresholds(__assign(__assign({}, thresholds), { types: types.filter(function (t) { return t !== type; }) }));
                            }
                        }}/>
                    <Label htmlFor={"cert-".concat(type)}>{type}</Label>
                  </div>); })}
              </div>
            </div>
          </>);
            case 'system_backup':
                return (<>
            <div className='flex items-center space-x-2'>
              <Checkbox id='daily-success' checked={thresholds.requireDailySuccess || true} onCheckedChange={function (checked) {
                        return setThresholds(__assign(__assign({}, thresholds), { requireDailySuccess: checked }));
                    }}/>
              <Label htmlFor='daily-success'>Require Daily Success</Label>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='max-age'>Max Age (Hours)</Label>
              <Input id='max-age' type='number' value={thresholds.maxAgeHours || 26} onChange={function (e) {
                        return setThresholds(__assign(__assign({}, thresholds), { maxAgeHours: parseInt(e.target.value) }));
                    }}/>
            </div>
          </>);
            default:
                return null;
        }
    };
    return (<Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[600px] sm:max-w-[600px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>
            {alertTypeLabels[policy.alertType] || policy.alertType}
          </SheetTitle>
          <SheetDescription>
            Configure alert settings, thresholds, and recipients
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue='general' className='mt-6'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='thresholds'>Thresholds</TabsTrigger>
            <TabsTrigger value='scope'>Scope</TabsTrigger>
            <TabsTrigger value='recipients'>Recipients</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='enabled'>Enabled</Label>
              <Switch id='enabled' checked={localPolicy.enabled} onCheckedChange={function (checked) {
            return setLocalPolicy(__assign(__assign({}, localPolicy), { enabled: checked }));
        }}/>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='priority'>Priority</Label>
              <Select value={localPolicy.priority || 'medium'} onValueChange={function (value) {
            return setLocalPolicy(__assign(__assign({}, localPolicy), { priority: value }));
        }}>
                <SelectTrigger id='priority'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-4'>
              <Label>Channels</Label>
              <div className='flex items-center justify-between'>
                <Label htmlFor='email-channel'>Email</Label>
                <Switch id='email-channel' checked={localPolicy.emailEnabled} onCheckedChange={function (checked) {
            return setLocalPolicy(__assign(__assign({}, localPolicy), { emailEnabled: checked }));
        }}/>
              </div>
              <div className='flex items-center justify-between'>
                <Label htmlFor='app-channel'>In-App</Label>
                <Switch id='app-channel' checked={localPolicy.inAppEnabled} onCheckedChange={function (checked) {
            return setLocalPolicy(__assign(__assign({}, localPolicy), { inAppEnabled: checked }));
        }}/>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='thresholds' className='space-y-4'>
            {renderThresholdFields()}
          </TabsContent>

          <TabsContent value='scope' className='space-y-4'>
            {(policy.alertType === 'maintenance_due' ||
            policy.alertType === 'running_hours') && (<div className='space-y-2'>
                <Label>Component Categories</Label>
                <div className='space-y-2 max-h-60 overflow-y-auto'>
                  {componentCategories.map(function (category) { return (<div key={category} className='flex items-center space-x-2'>
                      <Checkbox id={"cat-".concat(category)} checked={(scopeFilters.categories || []).includes(category)} onCheckedChange={function (checked) {
                    var categories = scopeFilters.categories || [];
                    if (checked) {
                        setScopeFilters(__assign(__assign({}, scopeFilters), { categories: __spreadArray(__spreadArray([], categories, true), [category], false) }));
                    }
                    else {
                        setScopeFilters(__assign(__assign({}, scopeFilters), { categories: categories.filter(function (c) { return c !== category; }) }));
                    }
                }}/>
                      <Label htmlFor={"cat-".concat(category)}>{category}</Label>
                    </div>); })}
                </div>
                <p className='text-sm text-gray-600'>
                  Leave unchecked to include all categories
                </p>
              </div>)}

            {policy.alertType === 'critical_inventory' && (<div className='space-y-2'>
                <Label htmlFor='location'>Location Filter (Optional)</Label>
                <Input id='location' value={scopeFilters.location || ''} onChange={function (e) {
                return setScopeFilters(__assign(__assign({}, scopeFilters), { location: e.target.value }));
            }} placeholder='e.g., Engine Room'/>
              </div>)}
          </TabsContent>

          <TabsContent value='recipients' className='space-y-4'>
            <div className='space-y-2'>
              <Label>Roles/Ranks</Label>
              <div className='space-y-2'>
                {roleOptions.map(function (role) { return (<div key={role} className='flex items-center space-x-2'>
                    <Checkbox id={"role-".concat(role)} checked={(recipients.roles || []).includes(role)} onCheckedChange={function (checked) {
                var roles = recipients.roles || [];
                if (checked) {
                    setRecipients(__assign(__assign({}, recipients), { roles: __spreadArray(__spreadArray([], roles, true), [role], false) }));
                }
                else {
                    setRecipients(__assign(__assign({}, recipients), { roles: roles.filter(function (r) { return r !== role; }) }));
                }
            }}/>
                    <Label htmlFor={"role-".concat(role)}>{role}</Label>
                  </div>); })}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='specific-users'>
                Specific Users (comma-separated)
              </Label>
              <Input id='specific-users' value={(recipients.users || []).join(', ')} onChange={function (e) {
            var users = e.target.value
                .split(',')
                .map(function (u) { return u.trim(); })
                .filter(function (u) { return u; });
            setRecipients(__assign(__assign({}, recipients), { users: users }));
        }} placeholder='e.g., john.doe, jane.smith'/>
            </div>
          </TabsContent>
        </Tabs>

        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Preview & Test</CardTitle>
            <CardDescription>
              Preview the alert message and send a test
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='font-medium mb-2'>Sample Alert Message:</p>
              <p className='text-sm text-gray-600'>
                {policy.alertType === 'maintenance_due' &&
            "Maintenance is due in ".concat(thresholds.daysBeforeDue || 7, " days for Main Engine. Please schedule the maintenance task.")}
                {policy.alertType === 'critical_inventory' &&
            "Critical inventory alert: Spare part \"Filter Element\" is below minimum stock level. Current: 2, Minimum: 5."}
                {policy.alertType === 'running_hours' &&
            "Component \"Main Engine\" is approaching service threshold. Current hours: 12,480, Service due at: 12,500."}
                {policy.alertType === 'certificate_expiration' &&
            "Certificate \"Class Certificate\" is expiring in ".concat(thresholds.daysBeforeExpiry || 30, " days. Please arrange renewal.")}
                {policy.alertType === 'system_backup' &&
            "System backup completed successfully. Last backup: 2 hours ago."}
              </p>
            </div>

            <Button onClick={handleSendTest} variant='outline' className='w-full'>
              <Send className='mr-2 h-4 w-4'/>
              Send Test Alert to Me
            </Button>
          </CardContent>
        </Card>

        <SheetFooter className='mt-6'>
          <Button variant='outline' onClick={function () { return onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>);
}
//# sourceMappingURL=AlertPolicyDrawer.jsx.map