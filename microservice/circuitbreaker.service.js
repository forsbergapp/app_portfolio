/** @module microservice/cirtcuitbreaker */

/**@type{import('./registry.service.js')} */
const {CONFIG} = await import(`file://${process.cwd()}/microservice/registry.service.js`);

/**
 * Circuit breaker
 * Uses circuit states CLOSED, HALF, OPEN
 * Origin   Timeout
 * server   1 second
 * admin    1 minute * CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES or default 60 minutes
 * app      1 second * CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS or default 20 seconds
 * 
 * Failure threshold    CONFIG.CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS or default 5 seconds
 * Cooldown period      CONFIG.CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS or default 10 seconds
 */
class CircuitBreaker {
    constructor() {
        /**@type{[index:any][*]} */
        this.states = {};
        this.failureThreshold = CONFIG?CONFIG.CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS:5;
        this.cooldownPeriod = CONFIG?CONFIG.CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS:10;
        this.requestTimetout = CONFIG?CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS:20;
    }
    /**
     * Call microservice
     * @param {function} function_httpRequest
     * @param {boolean} admin 
     * @param {string} path 
     * @param {string} query
     * @param {string} method 
     * @param {string} client_ip 
     * @param {string} authorization 
     * @param {string} headers_user_agent 
     * @param {string} headers_accept_language 
     * @param {object} body 
     * @param {boolean} server_app_timeout
     * @returns {Promise.<string>}
     */
    async MicroServiceCall(function_httpRequest, admin, path, query, method, client_ip, authorization, headers_user_agent, headers_accept_language, body, server_app_timeout){
        const service = (path?path.split('/')[1]:'').toUpperCase();
        if (!this.canRequest(service))
            return '';
        try {
            let timeout;
            if (server_app_timeout){
                //wait max 1 second when service called from SERVER_APP to speed up app start
                timeout = 1000;
            }
            else
                if (admin)
                    timeout = 60 * 1000 * (CONFIG?CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES:60);
                else
                    timeout = this.requestTimetout * 1000;
            const response = await function_httpRequest (service, path, query, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language, body);
            this.onSuccess(service);
            return response;    
        } catch (error) {
            this.onFailure(service);
            throw error;
        }
    }
    /**
     * Circuitbreaker on success
     * @param {string} service
     */
    onSuccess(service){
        this.initState(service);
    }
    /**
     * Circuitbreaker on failure
     * @param {string} service 
     */
    onFailure(service){
        const state = this.states[service];
        state.failures +=1;
        if (state.failures > this.failureThreshold){
            state.circuit = 'OPEN';
            state.nexttry = +new Date() / 1000 + this.cooldownPeriod;
        }
    }
    /**
     * Circuitbreaker can request
     * @param {string} service
     * @returns 
     */
    canRequest (service){
        if (!this.states[service]) this.initState(service);
        const state = this.states[service];
        if (state.circuit==='CLOSED') return true;
        const now = +new Date() / 1000;
        if (state.nexttry <= now){
            state.circuit='HALF';
            return true;
        }
        return false;
    }
    /**
     * Circuitbreaker init
     * @param {string} service 
     */
    initState(service){
        this.states[service]={
            failures: 0,
            cooldownPeriod: this.cooldownPeriod,
            circuit: 'CLOSED',
            nexttry: 0,
        };
    }
}
const microservice_circuitbreak = new CircuitBreaker();

export {microservice_circuitbreak};