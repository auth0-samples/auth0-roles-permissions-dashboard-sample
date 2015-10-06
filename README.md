# Auth0 Roles & Permissions Dashboard

Dashboard that allows you to manage roles and permissions for your Auth0 users. Take a look at the [wiki](https://github.com/auth0/auth0-roles-permissions-dashboard-sample/wiki) for more information about deployment and sample integrations.

## Demo Environment

- Dashboard: http://perm-dashboard.azurewebsites.net/
- HR Tool (sample application): http://perm-hr.azurewebsites.net
- Log in as one of these users to the dashboard or HR tool:
  - john@fabrikamcorp.com `password`
  - mary@fabrikamcorp.com `password`
  - jake@fabrikamcorp.com `password`
  - kevin@fabrikamcorp.com `password`

## Overview

The dashboard allows you to manage permissions for the different applications you created in Auth0.

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-perm.png)

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-perm-edit.png)

In addition to that you can also create roles which can contain permissions and sub-roles. If a role contains sub-roles it will inherit all of the permissions contained in those sub-roles (recursively).

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-roles.png)

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-roles-edit.png)

Finally, these roles can be assigned to your users. This information will be persisted in the user's profile in Auth0.

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-users.png)

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-users-add.png)

And to test this you can view the user's effective permissions. This will calculate all the permissions that apply to this user by going over the user's roles and sub-roles (recursively).

![](http://cdn.auth0.com/docs/img/roles-perm-dashboard-users-effective.png)

## To utilise MongoDB as your store

1. Add a nconf variable called `MONGODB_CONNECTION_STRING`
2. In `lib/routes/api.js` on line 3 change `var db = require("../file");` to `var db = require("../db");`