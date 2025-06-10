/** @module serviceregistry/microservice/cirtcuitbreaker */

const ConfigServer = await import('../server/db/ConfigServer.js');
/**
 * @name circuitBreakerClass
 * @description Circuit breaker
 *              Uses circuit states CLOSED, HALF, OPEN
 *              Origin   Timeout
 *              server   1 second
 *              admin    1 minute * CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES or default 60 minutes
 *              app      1 second * CONFIG.CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS or default 20 seconds
 * 
 *              Failure threshold    CONFIG.CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS or default 5 seconds
 *              Cooldown period      CONFIG.CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS or default 10 seconds
 * @class
 */
class circuitBreakerClass {
    constructor() {
        /**@type{[index:any][*]} */
        this.states = {};
                                                        
        this.failureThreshold = ConfigServer.get({app_id:0, data:{ config_group:'SERVICE_MICROSERVICE', parameter:'CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS'}}).result ?? 5;
        this.cooldownPeriod = ConfigServer.get({app_id:0, data:{ config_group:'SERVICE_MICROSERVICE', parameter:'CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS'}}).result ?? 10;
        this.requestTimeout = ConfigServer.get({app_id:0, data:{ config_group:'SERVICE_MICROSERVICE', parameter:'CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS'}}).result ?? 20;
    }
    /**
     * @name MicroServiceCall
     * @description Call microservice
     * @method
     * @param {function} function_httpRequest
     * @param {string} service 
     * @param {boolean} admin 
     * @param {string} path 
     * @param {string} query
     * @param {{}|null} body
     * @param {string} method 
     * @param {string} client_ip 
     * @param {string} authorization 
     * @param {string} headers_user_agent 
     * @param {string} headers_accept_language 
     
     * @param {boolean} server_app_timeout
     * @returns {Promise.<string>}
     */
    async MicroServiceCall(function_httpRequest, service, admin, path, query, body, method, client_ip, authorization, headers_user_agent, headers_accept_language, server_app_timeout){
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
                    timeout = 60 * 1000 * (ConfigServer.get({app_id:0, data:{ config_group:'SERVICE_MICROSERVICE', parameter:'CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES'}}).result ?? 60);
                else
                    timeout = this.requestTimeout * 1000;
            const response = await function_httpRequest (service, path, query, body, method, timeout, client_ip, authorization, headers_user_agent, headers_accept_language);
            this.onSuccess(service);
            return response;    
        } catch (error) {
            this.onFailure(service);
            throw error;
        }
    }
    /**
     * @name onSuccess
     * @description Circuitbreaker on success
     * @method
     * @param {string} service
     */
    onSuccess(service){
        this.initState(service);
    }
    /**
     * @name onFailure
     * @description Circuitbreaker on failure
     * @method
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
     * @name canRequest
     * @description Circuitbreaker can request
     * @method
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
     * @name initState
     * @description Circuitbreaker init
     * @method
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
const circuitBreaker = new circuitBreakerClass();

export {circuitBreaker};