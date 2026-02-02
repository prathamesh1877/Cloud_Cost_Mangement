# TODO: Remake Application with Consolidated api.json

## Step 1: Consolidate Data into api.json
- [ ] Merge data from api.js (cloudData: dashboard, analytics, cloudUsage, settings, departments)
- [ ] Merge data from crudApi.js (departments, dashboard stats, analytics, settings, cloudUsage, budgets, alerts, resources, activityLogs)
- [ ] Merge data from users.json (users array)
- [ ] Update api.json with comprehensive structure

## Step 2: Create New apiService.js
- [ ] Create apiService.js in src/services/
- [ ] Implement functions for dashboard, analytics, cloudUsage, settings, users, departments, budgets, alerts, resources, activityLogs
- [ ] Include CRUD operations (create, read, update, delete) for users, departments, budgets, alerts, resources
- [ ] Simulate API responses with mock delays

## Step 3: Update Components to Use New Service
- [ ] Update CloudDashboard.jsx to import from apiService instead of crudApi
- [ ] Update UserDashboard.jsx to import from apiService instead of api
- [ ] Update Analytics.jsx to load data from apiService
- [ ] Update Settings.jsx to load data from apiService
- [ ] Update CloudStorage.jsx to load data from apiService
- [ ] Update App.jsx to pass data or remove data props if not needed

## Step 4: Update AuthContext
- [ ] Update AuthContext.jsx to import users from api.json instead of users.json
- [ ] Ensure login/register functions work with new data source

## Step 5: Remove Old Files
- [ ] Delete src/services/api.js
- [ ] Delete src/services/crudApi.js
- [ ] Delete jsondata/users.json

## Step 6: Test and Verify
- [ ] Test login functionality
- [ ] Test dashboard views
- [ ] Test CRUD operations in admin dashboard
- [ ] Verify all components load data correctly
