import { fhirclient } from "../types";

interface RequestWithSession {
    session: fhirclient.JsonObject;
}

export default class ServerStorage
{
    public request: RequestWithSession;

    /**
     * @param request The HTTP request that is expected to have a
     * "session" object property.
     */
    constructor(request: RequestWithSession)
    {
        this.request = request;
    }

    /**
     * Gets the value at `key`. Returns a promise that will be resolved
     * with that value (or undefined for missing keys).
     */
    public async get(key: string): Promise<any>
    {
        return this.request.session[key];
    }

    /**
     * Sets the `value` on `key` and returns a promise that will be resolved
     * with the value that was set.
     */
    public async set(key: string, value: any): Promise<any>
    {
        this.request.session[key] = value;
        return value;
    }

    /**
     * Deletes the value at `key`. Returns a promise that will be resolved
     * with true if the key was deleted or with false if it was not (eg. if
     * did not exist).
     */
    public async unset(key: string): Promise<boolean>
    {
        if (Object.prototype.hasOwnProperty.call(this.request.session, key)) {
            delete this.request.session[key];
            return true;
        }
        return false;
    }

}
