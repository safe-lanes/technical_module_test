import { __assign, __awaiter, __generator } from 'tslib';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Bell,
  AlertCircle,
  Clock,
  Package,
  Shield,
  HardDrive,
} from 'lucide-react';
import AlertPolicyDrawer from '@/components/alerts/AlertPolicyDrawer';
import AlertHistory from '@/components/alerts/AlertHistory';
var alertTypeInfo = {
  maintenance_due: {
    label: 'Maintenance Due',
    description: 'Alerts for upcoming maintenance tasks',
    icon: Clock,
    color: 'text-blue-600',
  },
  critical_inventory: {
    label: 'Critical Inventory',
    description: 'Alerts for low stock on critical items',
    icon: Package,
    color: 'text-red-600',
  },
  running_hours: {
    label: 'Running Hours Threshold',
    description: 'Alerts when components reach RH thresholds',
    icon: AlertCircle,
    color: 'text-orange-600',
  },
  certificate_expiration: {
    label: 'Certificate Expiration',
    description: 'Alerts for upcoming certificate expirations',
    icon: Shield,
    color: 'text-purple-600',
  },
  system_backup: {
    label: 'System Backup',
    description: 'Alerts for backup status and failures',
    icon: HardDrive,
    color: 'text-gray-600',
  },
};
export default function Alerts() {
  var _this = this;
  var toast = useToast().toast;
  var _a = useState(null),
    selectedPolicy = _a[0],
    setSelectedPolicy = _a[1];
  var _b = useState(false),
    drawerOpen = _b[0],
    setDrawerOpen = _b[1];
  var _c = useState([]),
    localPolicies = _c[0],
    setLocalPolicies = _c[1];
  var _d = useState(null),
    localConfig = _d[0],
    setLocalConfig = _d[1];
  // Fetch alert policies
  var _e = useQuery({
      queryKey: ['/api/alerts/policies'],
      queryFn: function () {
        return __awaiter(_this, void 0, void 0, function () {
          var response, data;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, fetch('/api/alerts/policies')];
              case 1:
                response = _a.sent();
                if (!response.ok) throw new Error('Failed to fetch policies');
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                setLocalPolicies(data);
                return [2 /*return*/, data];
            }
          });
        });
      },
    }),
    policies = _e.data,
    policiesLoading = _e.isLoading;
  // Fetch alert configuration
  var _f = useQuery({
      queryKey: ['/api/alerts/config/V001'],
      queryFn: function () {
        return __awaiter(_this, void 0, void 0, function () {
          var response, data;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, fetch('/api/alerts/config/V001')];
              case 1:
                response = _a.sent();
                if (!response.ok) throw new Error('Failed to fetch config');
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                setLocalConfig(data);
                return [2 /*return*/, data];
            }
          });
        });
      },
    }),
    config = _f.data,
    configLoading = _f.isLoading;
  // Batch update policies mutation
  var updatePoliciesMutation = useMutation({
    mutationFn: function (policies) {
      return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                fetch('/api/alerts/policies/batch-update', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ policies: policies }),
                }),
              ];
            case 1:
              response = _a.sent();
              if (!response.ok) throw new Error('Failed to update policies');
              return [2 /*return*/, response.json()];
          }
        });
      });
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/policies'] });
      toast({
        title: 'Alert Configuration Saved',
        description: 'Alert policies have been updated successfully.',
      });
    },
    onError: function () {
      toast({
        title: 'Update Failed',
        description: 'Failed to update alert policies. Please try again.',
        variant: 'destructive',
      });
    },
  });
  // Update config mutation
  var updateConfigMutation = useMutation({
    mutationFn: function (config) {
      return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                fetch('/api/alerts/config', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(config),
                }),
              ];
            case 1:
              response = _a.sent();
              if (!response.ok) throw new Error('Failed to update config');
              return [2 /*return*/, response.json()];
          }
        });
      });
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/config/V001'] });
      toast({
        title: 'Configuration Saved',
        description: 'Alert configuration has been updated successfully.',
      });
    },
    onError: function () {
      toast({
        title: 'Update Failed',
        description: 'Failed to update alert configuration. Please try again.',
        variant: 'destructive',
      });
    },
  });
  var handlePolicyToggle = function (policyId, field, value) {
    setLocalPolicies(function (prev) {
      return prev.map(function (p) {
        var _a;
        return p.id === policyId
          ? __assign(__assign({}, p), ((_a = {}), (_a[field] = value), _a))
          : p;
      });
    });
  };
  var handlePriorityChange = function (policyId, priority) {
    setLocalPolicies(function (prev) {
      return prev.map(function (p) {
        return p.id === policyId
          ? __assign(__assign({}, p), { priority: priority })
          : p;
      });
    });
  };
  var handleSaveConfiguration = function () {
    updatePoliciesMutation.mutate(localPolicies);
  };
  var handlePolicyClick = function (policy) {
    setSelectedPolicy(policy);
    setDrawerOpen(true);
  };
  var handlePolicyUpdate = function (updatedPolicy) {
    setLocalPolicies(function (prev) {
      return prev.map(function (p) {
        return p.id === updatedPolicy.id ? updatedPolicy : p;
      });
    });
    setDrawerOpen(false);
  };
  var handleConfigUpdate = function () {
    if (localConfig) {
      updateConfigMutation.mutate(localConfig);
    }
  };
  if (policiesLoading || configLoading) {
    return <div className='p-6'>Loading alert configuration...</div>;
  }
  return (
    <div className='p-6 space-y-6'>
      <div className='bg-white rounded-lg shadow-sm'>
        <div className='px-6 py-4 border-b'>
          <h1 className='text-2xl font-semibold'>Alert Configuration</h1>
          <p className='text-sm text-gray-600 mt-1'>
            Configure alert policies and notification preferences
          </p>
        </div>

        <Tabs defaultValue='policies' className='w-full'>
          <TabsList className='w-full justify-start px-6 py-0 h-12 bg-transparent border-b'>
            <TabsTrigger
              value='policies'
              className='data-[state=active]:border-b-2 data-[state=active]:border-blue-500'
            >
              Policies
            </TabsTrigger>
            <TabsTrigger
              value='history'
              className='data-[state=active]:border-b-2 data-[state=active]:border-blue-500'
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value='policies' className='p-6 space-y-6'>
            {/* Policies Table */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Policies</CardTitle>
                <CardDescription>
                  Configure which alerts are enabled and how they are delivered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b'>
                        <th className='text-left py-3 px-4'>Alert Type</th>
                        <th className='text-left py-3 px-4'>Description</th>
                        <th className='text-center py-3 px-4'>Email</th>
                        <th className='text-center py-3 px-4'>In-App</th>
                        <th className='text-center py-3 px-4'>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localPolicies.map(function (policy) {
                        var info = alertTypeInfo[policy.alertType];
                        var Icon =
                          (info === null || info === void 0
                            ? void 0
                            : info.icon) || Bell;
                        return (
                          <tr
                            key={policy.id}
                            className='border-b hover:bg-gray-50'
                          >
                            <td className='py-3 px-4'>
                              <button
                                onClick={function () {
                                  return handlePolicyClick(policy);
                                }}
                                className='flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium'
                              >
                                <Icon
                                  className={'h-4 w-4 '.concat(
                                    info === null || info === void 0
                                      ? void 0
                                      : info.color
                                  )}
                                />
                                {(info === null || info === void 0
                                  ? void 0
                                  : info.label) || policy.alertType}
                              </button>
                            </td>
                            <td className='py-3 px-4 text-sm text-gray-600'>
                              {info === null || info === void 0
                                ? void 0
                                : info.description}
                            </td>
                            <td className='py-3 px-4 text-center'>
                              <Switch
                                checked={policy.emailEnabled}
                                onCheckedChange={function (checked) {
                                  return handlePolicyToggle(
                                    policy.id,
                                    'emailEnabled',
                                    checked
                                  );
                                }}
                                disabled={!policy.enabled}
                              />
                            </td>
                            <td className='py-3 px-4 text-center'>
                              <Switch
                                checked={policy.inAppEnabled}
                                onCheckedChange={function (checked) {
                                  return handlePolicyToggle(
                                    policy.id,
                                    'inAppEnabled',
                                    checked
                                  );
                                }}
                                disabled={!policy.enabled}
                              />
                            </td>
                            <td className='py-3 px-4'>
                              <Select
                                value={policy.priority || 'medium'}
                                onValueChange={function (value) {
                                  return handlePriorityChange(policy.id, value);
                                }}
                                disabled={!policy.enabled}
                              >
                                <SelectTrigger className='w-32'>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='low'>Low</SelectItem>
                                  <SelectItem value='medium'>Medium</SelectItem>
                                  <SelectItem value='high'>High</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={handleSaveConfiguration}
                    disabled={updatePoliciesMutation.isPending}
                  >
                    {updatePoliciesMutation.isPending
                      ? 'Saving...'
                      : 'Save Alert Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours & Escalation */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Quiet Hours</CardTitle>
                  <CardDescription>
                    Configure when non-critical alerts should be held
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='quiet-hours'>Enable Quiet Hours</Label>
                    <Switch
                      id='quiet-hours'
                      checked={
                        (localConfig === null || localConfig === void 0
                          ? void 0
                          : localConfig.quietHoursEnabled) || false
                      }
                      onCheckedChange={function (checked) {
                        return setLocalConfig(function (prev) {
                          return prev
                            ? __assign(__assign({}, prev), {
                                quietHoursEnabled: checked,
                              })
                            : null;
                        });
                      }}
                    />
                  </div>

                  {(localConfig === null || localConfig === void 0
                    ? void 0
                    : localConfig.quietHoursEnabled) && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='quiet-start'>Start Time</Label>
                        <Input
                          id='quiet-start'
                          type='time'
                          value={
                            (localConfig === null || localConfig === void 0
                              ? void 0
                              : localConfig.quietHoursStart) || '22:00'
                          }
                          onChange={function (e) {
                            return setLocalConfig(function (prev) {
                              return prev
                                ? __assign(__assign({}, prev), {
                                    quietHoursStart: e.target.value,
                                  })
                                : null;
                            });
                          }}
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label htmlFor='quiet-end'>End Time</Label>
                        <Input
                          id='quiet-end'
                          type='time'
                          value={
                            (localConfig === null || localConfig === void 0
                              ? void 0
                              : localConfig.quietHoursEnd) || '06:00'
                          }
                          onChange={function (e) {
                            return setLocalConfig(function (prev) {
                              return prev
                                ? __assign(__assign({}, prev), {
                                    quietHoursEnd: e.target.value,
                                  })
                                : null;
                            });
                          }}
                          className='mt-1'
                        />
                      </div>
                    </div>
                  )}

                  <p className='text-sm text-gray-600'>
                    During quiet hours, only High priority alerts bypass. Others
                    are queued for daily digest.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Escalation</CardTitle>
                  <CardDescription>
                    Configure alert escalation for unacknowledged high priority
                    alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='escalation'>Enable Escalation</Label>
                    <Switch
                      id='escalation'
                      checked={
                        (localConfig === null || localConfig === void 0
                          ? void 0
                          : localConfig.escalationEnabled) || false
                      }
                      onCheckedChange={function (checked) {
                        return setLocalConfig(function (prev) {
                          return prev
                            ? __assign(__assign({}, prev), {
                                escalationEnabled: checked,
                              })
                            : null;
                        });
                      }}
                    />
                  </div>

                  {(localConfig === null || localConfig === void 0
                    ? void 0
                    : localConfig.escalationEnabled) && (
                    <div>
                      <Label htmlFor='escalation-hours'>
                        Escalate after (hours)
                      </Label>
                      <Input
                        id='escalation-hours'
                        type='number'
                        min={1}
                        max={24}
                        value={
                          (localConfig === null || localConfig === void 0
                            ? void 0
                            : localConfig.escalationHours) || 4
                        }
                        onChange={function (e) {
                          return setLocalConfig(function (prev) {
                            return prev
                              ? __assign(__assign({}, prev), {
                                  escalationHours: parseInt(e.target.value),
                                })
                              : null;
                          });
                        }}
                        className='mt-1 w-24'
                      />
                    </div>
                  )}

                  <p className='text-sm text-gray-600'>
                    If High alerts are not acknowledged within specified hours,
                    escalate to Tech Superintendent & Office via email.
                  </p>

                  <Button
                    onClick={handleConfigUpdate}
                    disabled={updateConfigMutation.isPending}
                    className='w-full'
                  >
                    {updateConfigMutation.isPending
                      ? 'Saving...'
                      : 'Save Configuration'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='history' className='p-6'>
            <AlertHistory />
          </TabsContent>
        </Tabs>
      </div>

      {/* Policy Drawer */}
      {selectedPolicy && (
        <AlertPolicyDrawer
          policy={selectedPolicy}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSave={handlePolicyUpdate}
        />
      )}
    </div>
  );
}
//# sourceMappingURL=Alerts.jsx.map
