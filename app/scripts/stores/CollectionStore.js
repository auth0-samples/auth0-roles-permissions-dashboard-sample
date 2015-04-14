import _ from 'lodash';
import { Map } from 'immutable';

import DispatchStore from './DispatchStore';

export default class CollectionStore extends DispatchStore {

	constructor() {
		super();
		this.items = Map();
	}

	isEmpty() {
		return this.items.isEmpty();
	}

	delete(item) {
		this.items = this.items.delete(this.getId(item));
	}

	set(item) {
		this.items = this.items.set(this.getId(item), item);
	}

	setAll(data) {
		this.clear();

		if (data) {
			data.forEach(item => { this.items = this.items.set(this.getId(item), item); });
		}
	}

	get(key) {
		return this.items.get(key);
	}

	tryGet(key) {
		return this.items.get(key) || { };
	}

	getAll() {
		return this.items.toArray();
	}

	getAllSorted() {
		return _.sortBy(this.getAll(), (item) => (this.getSortValue(item)));
	}

	getFiltered(query) {
		var items = this.getAllSorted();
		if (query) { 
			return _.filter(items, this.getFilter(query));  
		} else {
			return items;
		}
	}

	getId(item) {
    	throw new Error("Not Implemented: getId(item)");
	} 

	getFilter(query) {
    	throw new Error("Not Implemented: getFilter(query)");
	} 

	getSortValue(item) {
		return item;
	}

	clear() {
		this.items = this.items.clear();
	}
}