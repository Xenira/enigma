export default class HttpError extends Error {
	constructor(public status: number, message?: string, root?: Error | string) {
		super(message);
		this.stack = root?.toString();
	}
}
