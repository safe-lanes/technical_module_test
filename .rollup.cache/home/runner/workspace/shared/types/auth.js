export var UserRole;
(function (UserRole) {
  UserRole['ADMIN'] = 'admin';
  UserRole['MASTER'] = 'master';
  UserRole['CHIEF_ENGINEER'] = 'chief_engineer';
  UserRole['OFFICER'] = 'officer';
  UserRole['CREW'] = 'crew';
  UserRole['SHORE_STAFF'] = 'shore_staff';
})(UserRole || (UserRole = {}));
export var Permission;
(function (Permission) {
  // Component permissions
  Permission['COMPONENTS_READ'] = 'components:read';
  Permission['COMPONENTS_WRITE'] = 'components:write';
  Permission['COMPONENTS_DELETE'] = 'components:delete';
  // Work Order permissions
  Permission['WORK_ORDERS_READ'] = 'work_orders:read';
  Permission['WORK_ORDERS_WRITE'] = 'work_orders:write';
  Permission['WORK_ORDERS_APPROVE'] = 'work_orders:approve';
  // Spares permissions
  Permission['SPARES_READ'] = 'spares:read';
  Permission['SPARES_WRITE'] = 'spares:write';
  Permission['SPARES_CONSUME'] = 'spares:consume';
  // Running Hours permissions
  Permission['RUNNING_HOURS_READ'] = 'running_hours:read';
  Permission['RUNNING_HOURS_WRITE'] = 'running_hours:write';
  // Reports permissions
  Permission['REPORTS_READ'] = 'reports:read';
  Permission['REPORTS_GENERATE'] = 'reports:generate';
  // Admin permissions
  Permission['PMS_ADMIN'] = 'pms:admin';
  Permission['USER_MANAGEMENT'] = 'user:management';
  Permission['SYSTEM_CONFIG'] = 'system:config';
  // Change Request permissions
  Permission['CHANGE_REQUESTS_READ'] = 'change_requests:read';
  Permission['CHANGE_REQUESTS_WRITE'] = 'change_requests:write';
  Permission['CHANGE_REQUESTS_APPROVE'] = 'change_requests:approve';
})(Permission || (Permission = {}));
//# sourceMappingURL=auth.js.map
