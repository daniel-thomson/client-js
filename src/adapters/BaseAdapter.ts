import { ready, authorize, init } from "../smart";
import Client from "../Client";
import { fhirclient } from "../types";

/**
 * This is the abstract base class that adapters must inherit. It just a
 * collection of environment-specific methods that subclasses have to implement.
 */
export default abstract class BaseAdapter
{
    public options: fhirclient.fhirSettings;

    /**
     * @param options Environment-specific options
     */
    public constructor(options: fhirclient.fhirSettings = {})
    {
        this.options = {
            // Replaces the browser's current URL
            // using window.history.replaceState API or by reloading.
            replaceBrowserHistory: true,

            // When set to true, this variable will fully utilize
            // HTML5 sessionStorage API.
            // This variable can be overridden to false by setting
            // FHIR.oauth2.settings.fullSessionStorageSupport = false.
            // When set to false, the sessionStorage will be keyed
            // by a state variable. This is to allow the embedded IE browser
            // instances instantiated on a single thread to continue to
            // function without having sessionStorage data shared
            // across the embedded IE instances.
            fullSessionStorageSupport: true,

            ...options
        };
    }


    public abstract getUrl(): URL;
    public abstract getStorage(): fhirclient.Storage;
    public abstract redirect(to: string): void | Promise<any>;

    public relative(path: string): string
    {
        return new URL(path, this.getUrl().href).href;
    }

    /**
     * Creates and returns adapter-aware SMART api. Not that while the shape of
     * the returned object is well known, the arguments to this function are not.
     * Those who override this method are free to require any environment-specific
     * arguments. For example in node we will need a request, a response and
     * optionally a storage or storage factory function.
     */
    public getSmartApi(): fhirclient.SMART
    {
        return {
            ready    : (...args) => ready(this, ...args),
            authorize: options   => authorize(this, options),
            init     : (...args) => init(this, ...args),
            client   : (state: fhirclient.ClientState) => new Client(this, state),
            options  : this.options
        };
    }
}
