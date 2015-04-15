# Auth0 Roles & Permissions Dashboard

Dashboard that allows you to manage roles and permissions for your Auth0 users

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

## Setup

### Dashboard

To run the dashboard you first need to create an application in Auth0 in which you set the `Allowed Callback URL` to the URL of  your application (eg: http://localhost:2500/).

Then you'll need to go to the [APIv2 explorer](https://auth0.com/docs/apiv2) and generate a token with the following permissions:

- read:clients
- read:users
- read:users_app_metadata
- update:users_app_metadata
- delete:users_app_metadata
- create:users_app_metadata

Finally add the following settings as environment variables or in a **config.json** file:

```
{
	"AUTH0_DOMAIN": "you.auth0.com",
	"AUTH0_CLIENT_ID": "YOUR_CLIENT_ID",
	"AUTH0_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
	"AUTH0_APIV2_TOKEN": "eyJhbGc...",
	"PORT": 2500,
	"ENV": "development"
}
```

**Note:** For now all of this data is stored in a config.json file.

### Rule

The following rule will call out to the dashboard's API and add the permissions to the user's token:

```
function (user, context, callback) {
  if (!user.roles || user.roles.length === 0) { 
    return callback(null, user, context);
  }

  request.post({
    url: configuration.PERMISSIONS_API_BASE_URL + 
            '/api/apps/' + context.clientID + '/permissions',
    json: {
      roles: user.roles
    },
    timeout: 5000
  }, function(err, response, body) {
    if (err) 
      return callback(new Error(err));
    user.permissions = body.permissions;
    return callback(null, user, context);
  });
}
```

In order for this to work add a configuration setting in the [Auth0 dashboard](https://manage.auth0.com/#/rules) that points to the base url of where the dashboard is deployed. Eg:

`PERMISSIONS_API_BASE_URL` = `https://fabrikam-roles-permissions.azurewebsites.net`

## Debugging

To run this application locally execute the following commands:

```
npm install
npm install -g gulp
gulp start
```

## Deploy 

### Virtual Machine

Run the following commands:

```
npm install
npm install -g gulp
gulp build
node server
```

### Microsoft Azure Web Sites

TODO

