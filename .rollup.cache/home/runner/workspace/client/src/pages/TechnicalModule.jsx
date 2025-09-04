import React, { useState, useEffect } from 'react';
import { TopMenuBar } from '@/components/TopMenuBar';
import { SideMenuBar } from '@/components/SideMenuBar';
import Components from './pms/Components';
import WorkOrders from './pms/WorkOrders';
import RunningHours from './pms/RunningHours';
import { ModifyPMS } from '@/components/modifyPms/ModifyPMS';
import Spares from './spares/SparesNew';
import Stores from './stores/Stores';
import AdminPanel from './admin/AdminPanel';
import Alerts from './admin/Alerts';
import { useLocation, useParams } from 'wouter';
export var TechnicalModule = function () {
  var location = useLocation()[0];
  var params = useParams();
  // Derive state from URL
  var getStateFromUrl = function () {
    if (location.startsWith('/admin/')) {
      var subpage = location.replace('/admin/', '');
      return { subModule: 'admin', menuItem: subpage };
    } else if (location.startsWith('/pms/')) {
      var subpage = location.replace('/pms/', '');
      return { subModule: 'pms', menuItem: subpage };
    } else if (location.startsWith('/spares')) {
      return { subModule: 'pms', menuItem: 'spares' };
    } else if (location.startsWith('/stores')) {
      return { subModule: 'pms', menuItem: 'stores' };
    }
    return { subModule: 'pms', menuItem: 'dashboard' };
  };
  var _a = getStateFromUrl(),
    subModule = _a.subModule,
    menuItem = _a.menuItem;
  var _b = useState(subModule),
    selectedSubModule = _b[0],
    setSelectedSubModule = _b[1];
  var _c = useState(menuItem),
    selectedMenuItem = _c[0],
    setSelectedMenuItem = _c[1];
  // Update state when URL changes
  useEffect(
    function () {
      var _a = getStateFromUrl(),
        subModule = _a.subModule,
        menuItem = _a.menuItem;
      setSelectedSubModule(subModule);
      setSelectedMenuItem(menuItem);
    },
    [location]
  );
  var handleSubModuleChange = function (subModule) {
    setSelectedSubModule(subModule);
    // Set default menu item based on submodule
    if (subModule === 'admin') {
      setSelectedMenuItem('alerts'); // Default to alerts for admin
    } else {
      setSelectedMenuItem('dashboard'); // Default to dashboard for other modules
    }
  };
  var handleMenuItemSelect = function (item) {
    setSelectedMenuItem(item);
  };
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Menu Bar */}
      <TopMenuBar
        selectedSubModule={selectedSubModule}
        onSubModuleChange={handleSubModuleChange}
      />

      <div className='flex'>
        {/* Side Menu Bar */}
        <SideMenuBar
          subModule={selectedSubModule}
          selectedItem={selectedMenuItem}
          onItemSelect={handleMenuItemSelect}
        />

        {/* Main Content Area */}
        <div className='flex-1'>
          {selectedSubModule === 'pms' && selectedMenuItem === 'components' ? (
            <Components />
          ) : selectedSubModule === 'pms' &&
            selectedMenuItem === 'work-orders' ? (
            <WorkOrders />
          ) : selectedSubModule === 'pms' &&
            selectedMenuItem === 'running-hrs' ? (
            <RunningHours />
          ) : selectedSubModule === 'pms' && selectedMenuItem === 'spares' ? (
            <Spares />
          ) : selectedSubModule === 'pms' && selectedMenuItem === 'stores' ? (
            <Stores />
          ) : selectedSubModule === 'pms' &&
            selectedMenuItem === 'modify-pms' ? (
            <ModifyPMS />
          ) : selectedSubModule === 'pms' && selectedMenuItem === 'admin' ? (
            <AdminPanel />
          ) : selectedSubModule === 'admin' && selectedMenuItem === 'alerts' ? (
            <Alerts />
          ) : (
            <div className='p-6'>
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                  {selectedSubModule.toUpperCase()} -{' '}
                  {selectedMenuItem.replace(/-/g, ' ').toUpperCase()}
                </h2>
                <p className='text-gray-600'>
                  Content for {selectedSubModule} module, {selectedMenuItem}{' '}
                  section will be displayed here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
//# sourceMappingURL=TechnicalModule.jsx.map
