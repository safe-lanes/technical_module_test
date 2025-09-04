import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
export function TableSelector(_a) {
    var category = _a.category, items = _a.items, selectedItem = _a.selectedItem, onSelect = _a.onSelect, searchQuery = _a.searchQuery, onSearchChange = _a.onSearchChange;
    var _b = useState('all'), criticalityFilter = _b[0], setCriticalityFilter = _b[1];
    var _c = useState('all'), stockFilter = _c[0], setStockFilter = _c[1];
    var filterItems = function () {
        if (!items)
            return [];
        var filtered = items;
        var lowerQuery = searchQuery.toLowerCase();
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(function (item) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                if (category === 'work_orders') {
                    return (((_a = item.woNo) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(lowerQuery)) ||
                        ((_b = item.jobTitle) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(lowerQuery)) ||
                        ((_c = item.componentName) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(lowerQuery)));
                }
                else if (category === 'spares') {
                    return (((_d = item.partCode) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(lowerQuery)) ||
                        ((_e = item.partName) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes(lowerQuery)) ||
                        ((_f = item.componentName) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(lowerQuery)));
                }
                else if (category === 'stores') {
                    return (((_g = item.itemCode) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes(lowerQuery)) ||
                        ((_h = item.itemName) === null || _h === void 0 ? void 0 : _h.toLowerCase().includes(lowerQuery)) ||
                        ((_j = item.storesCategory) === null || _j === void 0 ? void 0 : _j.toLowerCase().includes(lowerQuery)));
                }
                return false;
            });
        }
        // Apply criticality filter for work orders and spares
        if (criticalityFilter !== 'all' &&
            (category === 'work_orders' || category === 'spares')) {
            filtered = filtered.filter(function (item) {
                if (criticalityFilter === 'critical') {
                    return item.critical === true || item.critical === 'Critical';
                }
                else {
                    return item.critical === false || item.critical === 'No';
                }
            });
        }
        // Apply stock filter for spares and stores
        if (stockFilter !== 'all' &&
            (category === 'spares' || category === 'stores')) {
            filtered = filtered.filter(function (item) {
                var stockStatus = getStockStatus(item.rob, item.min);
                return stockStatus === stockFilter;
            });
        }
        return filtered;
    };
    var getStockStatus = function (rob, min) {
        if (rob <= 0)
            return 'out';
        if (rob <= min)
            return 'minimum';
        if (rob <= min * 1.5)
            return 'low';
        return 'ok';
    };
    var getStockBadge = function (rob, min) {
        var status = getStockStatus(rob, min);
        switch (status) {
            case 'out':
                return <Badge variant='destructive'>Out of Stock</Badge>;
            case 'minimum':
                return <Badge variant='destructive'>Minimum</Badge>;
            case 'low':
                return <Badge className='bg-orange-500 text-white'>Low</Badge>;
            case 'ok':
                return <Badge className='bg-green-500 text-white'>OK</Badge>;
            default:
                return null;
        }
    };
    var filteredItems = filterItems();
    return (<div className='h-full flex flex-col'>
      <div className='p-4 border-b space-y-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4'/>
          <Input type='text' placeholder={"Search ".concat(category.replace('_', ' '), "...")} value={searchQuery} onChange={function (e) { return onSearchChange(e.target.value); }} className='pl-10'/>
        </div>

        <div className='flex gap-2'>
          {(category === 'work_orders' || category === 'spares') && (<Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Criticality'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='critical'>Critical</SelectItem>
                <SelectItem value='non-critical'>Non-Critical</SelectItem>
              </SelectContent>
            </Select>)}

          {(category === 'spares' || category === 'stores') && (<Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Stock Status'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='ok'>OK</SelectItem>
                <SelectItem value='low'>Low</SelectItem>
                <SelectItem value='minimum'>Minimum</SelectItem>
                <SelectItem value='out'>Out of Stock</SelectItem>
              </SelectContent>
            </Select>)}
        </div>
      </div>

      <ScrollArea className='flex-1'>
        {filteredItems.length > 0 ? (<Table>
            <TableHeader>
              <TableRow>
                {category === 'work_orders' && (<>
                    <TableHead>WO No</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                  </>)}
                {category === 'spares' && (<>
                    <TableHead>Part Code</TableHead>
                    <TableHead>Part Name</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Min/ROB</TableHead>
                    <TableHead>Stock</TableHead>
                  </>)}
                {category === 'stores' && (<>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Min/ROB</TableHead>
                    <TableHead>Stock</TableHead>
                  </>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(function (item) { return (<TableRow key={item.id || item.woNo || item.partCode || item.itemCode} className={"cursor-pointer hover:bg-gray-50 ".concat((selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id) === item.id ||
                    (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.woNo) === item.woNo ||
                    (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.partCode) === item.partCode ||
                    (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.itemCode) === item.itemCode
                    ? 'bg-blue-50'
                    : '')} onClick={function () { return onSelect(item); }}>
                  {category === 'work_orders' && (<>
                      <TableCell className='font-mono'>{item.woNo}</TableCell>
                      <TableCell>{item.jobTitle}</TableCell>
                      <TableCell>
                        {item.componentName ? (<div>
                            <div className='text-sm'>{item.componentName}</div>
                            <div className='text-xs text-gray-500'>
                              {item.componentCode}
                            </div>
                          </div>) : ('-')}
                      </TableCell>
                      <TableCell>
                        {item.frequencyType} {item.frequencyValue}{' '}
                        {item.frequencyUnit}
                      </TableCell>
                      <TableCell>{item.assignedTo || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={item.priority === 'High'
                        ? 'destructive'
                        : 'secondary'}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                    </>)}
                  {category === 'spares' && (<>
                      <TableCell className='font-mono'>
                        {item.partCode}
                      </TableCell>
                      <TableCell>{item.partName}</TableCell>
                      <TableCell>
                        {item.componentName ? (<div>
                            <div className='text-sm'>{item.componentName}</div>
                            <div className='text-xs text-gray-500'>
                              {item.componentCode}
                            </div>
                          </div>) : ('-')}
                      </TableCell>
                      <TableCell>{item.uom || '-'}</TableCell>
                      <TableCell>
                        {item.min}/{item.rob}
                      </TableCell>
                      <TableCell>{getStockBadge(item.rob, item.min)}</TableCell>
                    </>)}
                  {category === 'stores' && (<>
                      <TableCell className='font-mono'>
                        {item.itemCode}
                      </TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.storesCategory || '-'}</TableCell>
                      <TableCell>{item.uom || '-'}</TableCell>
                      <TableCell>
                        {item.min}/{item.rob}
                      </TableCell>
                      <TableCell>{getStockBadge(item.rob, item.min)}</TableCell>
                    </>)}
                </TableRow>); })}
            </TableBody>
          </Table>) : (<div className='text-center text-gray-500 py-8'>No items found</div>)}
      </ScrollArea>
    </div>);
}
//# sourceMappingURL=TableSelector.jsx.map