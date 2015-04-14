import Logdown from 'logdown';
export default new Logdown({ prefix: 'app' });

export function LogFactory(prefix) {
	return new Logdown({ prefix: prefix });
}