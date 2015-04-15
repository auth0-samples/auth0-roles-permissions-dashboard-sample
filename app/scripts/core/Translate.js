let labels = {
	'applications.load': 'Loading applications...',
	'applications.load.error': 'Error loading applications.',
	'applications.load.success': 'Applications loaded.',

	'permissions.load': 'Loading permissions...',
	'permissions.load.error': 'Error loading permissions.',
	'permissions.load.success': 'Permissions loaded.',

	'permission.save': 'Saving permission...',
	'permission.save.error': 'Error saving permission.',
	'permission.save.success': 'Permission saved.',

	'permission.delete': 'Deleting permission...',
	'permission.delete.error': 'Error deleting permission.',
	'permission.delete.success': 'Permission deleted.',

	'roles.load': 'Loading roles...',
	'roles.load.error': 'Error loading roles.',
	'roles.load.success': 'Roles loaded.',

	'role.save': 'Saving role...',
	'role.save.error': 'Error saving role.',
	'role.save.success': 'Role saved.',

	'role.delete': 'Deleting role...',
	'role.delete.error': 'Error deleting role.',
	'role.delete.success': 'Role deleted.',

	'role_permissions.add': 'Adding role permissions...',
	'role_permissions.add.error': 'Error adding role permissions.',
	'role_permissions.add.success': 'Role permissions added.',

	'role_permission.delete': 'Deleting role permissions...',
	'role_permission.delete.error': 'Error deleting role permissions.',
	'role_permission.delete.success': 'Role permissions deleted.',

	'users.load': 'Loading users...',
	'users.load.error': 'Error loading users.',
	'users.load.success': 'Users loaded.',

	'user.save': 'Saving user...',
	'user.save.error': 'Error saving user.',
	'user.save.success': 'User saved.',

	'user_roles.add': 'Adding user roles...',
	'user_roles.add.error': 'Error adding user roles.',
	'user_roles.add.success': 'User roles added.',

	'user_effective_permissions.load': 'Loading effective permissions...',
	'user_effective_permissions.load.error': 'Error loading effective permissions.',
	'user_effective_permissions.load.success': 'Effective permissions loaded.',

	'user_roles.delete': 'Deleting user role...',
	'user_roles.delete.error': 'Error deleting user role.',
	'user_roles.delete.success': 'User role deleted.',
}

export default function(label) {
	return labels[label] || label;
}