export abstract class View<T> {
	constructor(model: T) {
		this.fromModle(model);
	}

	protected abstract fromModle(model: T): void;
}
