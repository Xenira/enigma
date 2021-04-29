export abstract class View<T> {
	constructor(model?: T) {
		if (model) {
			this.fromModle(model);
		}
	}

	protected abstract fromModle(model: T): void;
}
