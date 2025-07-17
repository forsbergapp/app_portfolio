/** @module server/security */

/**
 * @import {server_db_document_ConfigServer, server_security_jwt_complete, server_security_jwt_payload} from './types.js'}
 */
const Crypto = await import('node:crypto');

/**
 * @name securityCreateRandomString
 * @description Create random string
 * @function
 * @returns {string}
 */
 const securityCreateRandomString =()=>{
    let randomstring = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    for (let i = 0; i < 256; i++) {
        randomstring += chars[Math.floor(Math.random() * chars.length)] + Math.floor(1 + Math.random() * 10);
    }
    return randomstring;
};

/**
 * @name securityUUIDCreate
 * @description Creates random UUID
 * @function
 * @returns {string}
 */
const securityUUIDCreate = () =>Crypto.randomUUID();
/**
 * @name securityRequestIdCreate
 * @description Creates request id using UUID and removes '-'
 * @function
 * @returns {string}
 */
const securityRequestIdCreate = () =>Crypto.randomUUID().replaceAll('-','');
/**
 * @name securityCorrelationIdCreate
 * @description Creates correlation id using MD5
 * @function
 * @param {string} text 
 * @returns {string}
 */
const securityCorrelationIdCreate = text =>Crypto.createHash('md5').update(text).digest('hex');

/**
 * @name securitySecretCreate
 * @description Creates secret using SHA256
 * @function
 * @param {boolean} extra           some databases requires extra '!' and random A-Z character
 * @param {number|null} max_length  some databases requires maximum length
 * @returns {string}
 */
const securitySecretCreate = (extra=false, max_length=null) =>{
    if (extra){
        if (max_length)
            return Crypto.createHash('sha256').update(securityCreateRandomString()).digest('hex').substring(0,max_length - 2) + 
                '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
        else{
            const secret = Crypto.createHash('sha256').update(securityCreateRandomString()).digest('hex');
            return secret.substring(0,secret.length - 2) + '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
        }
    }
    else
        if (max_length)
            return Crypto.createHash('sha256').update(securityCreateRandomString()).digest('hex').substring(0,max_length);
        else
            return Crypto.createHash('sha256').update(securityCreateRandomString()).digest('hex');
};

/**
 * @name securityOTPKeyCreate
 * @description Creates OTP KEy using base32encode and 
 * @function
 * @returns {string}
 */
const securityOTPKeyCreate = () =>{
    /**
     *  @param {Uint8Array} data
     */
    const base32Encode = data => {
        //Key can only use these characters and 20 characters:
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let binaryData = '';
        
        // Convert each byte to binary
        data.forEach(byte => {
            binaryData += byte.toString(2).padStart(8, '0');
        });
    
        // Pad with zeros if necessary
        while (binaryData.length % 5 !== 0) {
            binaryData += '0';
        }
    
        let encodedData = '';
        
        // Split into 5-bit chunks and map to Base32 characters
        for (let i = 0; i < binaryData.length; i += 5) {
            const chunk = binaryData.slice(i, i + 5);
            const index = parseInt(chunk, 2);
            encodedData += alphabet[index];
        }
    
        return encodedData;
    };
    const randomValues = new Uint8Array(16);
    return base32Encode(Crypto.getRandomValues(randomValues));

};
/**
 * @name securityOTPKeyValidate
 * @description Validates OTP key has correct format
 *              otp key should be a string, use 26 characters and use characters A-Z or digits 234567 only
 * @function
 * @param {string} otp_key
 * @returns {boolean}
 */
const securityOTPKeyValidate = otp_key =>
            otp_key !=null && 
            typeof otp_key=='string' && 
            otp_key.length==26 && 
            otp_key.length == Array.from(otp_key).filter(character=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(character)>-1).length;

/**
 * @name securityTOTPGenerate
 * @description Generates TOTP 6 digit value valid for 30 seconds using UTC timezone
 *              using HMAC and SHA256
 * @function
 * @param {string} otp_key
 * @returns {Promise<{  totp_value:string,
 *                      expire:number}|null>}
 */
const securityTOTPGenerate = async otp_key =>{
    if (securityOTPKeyValidate(otp_key)){
        const getTimeCounter = () =>{
            // Time step in seconds
            const timeStep = 30; 
            // Use current time to UTC seconds
            return Math.floor( Date.now() / 1000 / timeStep);
        };
    
        /**
         * @param {string} otp_key
         * @param {*} message
         */
        const hmacSHA256 = async (otp_key, message) => {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(otp_key);
            const msgData = encoder.encode(message);
    
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            );
    
            const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
            
            return new Uint8Array(signature);
        };
        const timeCounter = getTimeCounter();
        
        // Convert time counter to byte array
        const counterBytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
            counterBytes[7 - i] = (timeCounter >> (i * 8)) & 0xff;
        }
    
        // Generate HMAC-SHA256
        const hmacResult = await hmacSHA256(otp_key, counterBytes);
    
        // Extract dynamic binary code from HMAC result
        const offset = hmacResult[hmacResult.length - 1] & 0xf;
        
        // Create a binary code from the extracted bytes
        const binaryCode =
            ((hmacResult[offset] & 0x7f) << 24) |
            ((hmacResult[offset + 1] & 0xff) << 16) |
            ((hmacResult[offset + 2] & 0xff) << 8) |
            (hmacResult[offset + 3] & 0xff);
    
        // Modulo operation to get TOTP value within desired range
        const totpValue = binaryCode % Math.pow(10, 6); // For a six-digit code
    
        //const millisecondsuntilnext = Math.floor((((timeCounter +1) *30) -  Date.now() / 1000) * 1000);
        return {totp_value:totpValue.toString().padStart(6, '0'),// Return as string with leading zeros
                expire:(timeCounter +1) *30,
                }; 
    }
    else{
        //return null without any explication
        return null;
    }
};
/**
 * @name securityTOTPValidate
 * @description Validates totp value for given otp key
 * @function
 * @param {string} totp_value
 * @param {string} otp_key
 * @returns {Promise<boolean>}
 */
const securityTOTPValidate = async (totp_value, otp_key) =>totp_value == (await securityTOTPGenerate(otp_key))?.totp_value;

/**
 * @name securityPasswordCreate
 * @description Creates password for IAM using aes-256-cbc and base64, encryption key parameter and init vector parameter from server config
 * @function
 * @param {number} app_id
 * @param {string} password 
 * @returns {Promise.<string>}
 */
const securityPasswordCreate = async (app_id, password) => {
    const { user_password_encryption_key, 
            user_password_init_vector} = await securityParametersGet({app_id:app_id});
    const cipher = Crypto.createCipheriv('aes-256-cbc', user_password_encryption_key, user_password_init_vector);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

/**
 * @name securityPasswordCompare
 * @description Compares password for IAM using aes-256-cbc and base64, encryption key parameter and init vector parameter from server config
 * @function
 * @param {number} app_id
 * @param {string} password 
 * @param {string} compare_password 
 * @returns {Promise.<boolean>}
 */
const securityPasswordCompare = async (app_id, password, compare_password) =>{
    try {
        return await securityPasswordGet({app_id:app_id, password_encrypted:compare_password}) == password;    
    } catch (error) {
        return false;
    }
};

/**
 * @name securityParametersGet
 * @description Returns parameters
 *              Uses parameters
 *              ConfigServer
 *                  SERVICE_IAM
 *                      USER_PASSWORD_ENCRYPTION_KEY
 *              ConfigServer
 *                  SERVICE_IAM
 *                      USER_PASSWORD_INIT_VECTOR
 * @function
 * @param {{app_id:number}} parameters
 * @returns {Promise.<{ user_password_encryption_key:string,
 *                      user_password_init_vector:string}>} 
 */
const securityParametersGet = async parameters =>{
    const ConfigServer = await import('./db/ConfigServer.js');
    /**@type{server_db_document_ConfigServer['SERVICE_IAM']} */
    const configServer = ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_IAM'}}).result;
    return {user_password_encryption_key: configServer.filter(parameter=> 'USER_PASSWORD_ENCRYPTION_KEY' in parameter)[0].USER_PASSWORD_ENCRYPTION_KEY,
            user_password_init_vector : configServer.filter(parameter=> 'USER_PASSWORD_INIT_VECTOR' in parameter)[0].USER_PASSWORD_INIT_VECTOR
        };    
};

/**
 * @name securityPasswordGet
 * @description Returns decrypted
 * @function
 * @param {{app_id:number,
 *          password_encrypted:string}} parameters
 * @returns {Promise.<string|null>}
 */
const securityPasswordGet = async parameters =>{
    const { user_password_encryption_key, 
            user_password_init_vector} = await securityParametersGet({app_id:parameters.app_id});
    const decipher = Crypto.createDecipheriv('aes-256-cbc', user_password_encryption_key, user_password_init_vector);
    const  decrypted = decipher.update(parameters.password_encrypted, 'base64', 'utf8');
    try {
        return (decrypted + decipher.final('utf8'));
    } catch (error) {
        return null;
    }
};
/**
 * @name securityKeyPairCreate
 * @description Creates key pair using default 8192 bits giving 8192/8 - 11 = 1013 max characters length
 *              to be used for external server communication when longer encrypted message must be used
 *              function can take several seconds to execute
 *              public : spki and pem format
 *              private: pkcs8 and pem format
 * @function
 * @param{number} bits
 * @returns {Promise.<{ publicKey:string, privateKey:string }>}
 */
const securityKeyPairCreate = async (bits=8192) => {
    return new Promise((resolve, reject)=>{
        Crypto.generateKeyPair('rsa', {
            modulusLength: bits,
            publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
            privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }, (error, result_publicKey, result_privateKey)=>{
                if (error)
                    reject(error);
                else{
                    resolve ({publicKey:result_publicKey, privateKey:result_privateKey});
                }
        });
    });
};
/**
 * @name securityPublicEncrypt
 * @description Encrypt with public key
 * @function
 * @param {string} publicKey 
 * @param {string} text 
 * @returns {string}
 */
const securityPublicEncrypt = (publicKey, text) => Crypto.publicEncrypt(publicKey,Buffer.from(text)).toString('base64');
/**
 * @name securityPrivateDecrypt
 * @description Decrypt with private key
 * @function
 * @param {string} privateKey 
 * @param {string} text 
 * @returns {string}
 */
const securityPrivateDecrypt = (privateKey, text) => Crypto.privateDecrypt(privateKey,
                                                            /**@ts-ignore */
                                                            Buffer.from(text, 'base64')).toString('utf-8');

/**
 * @name Jwt
 * @description class with methods using jsonwebtoken pattern and RFC 7519
 * @class
 */
class Jwt {
    constructor() {
    }
    /**
     * @name fromBase64
     * @description static fromBase64
     * @method
     * @param {string} base64
     * @returns {string}
     */
    static fromBase64(base64) {
        return base64
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      }
    /**
     * @name signatureCompute
     * @description static signatureCompute
     * @method
     * @param {string} secret
     * @param {string} securedInput
     * @returns {string}
     */
    static signatureCompute (securedInput, secret) {
        const hmac = Crypto.createHmac('sha256', secret);
        return (hmac.update(JSON.stringify(securedInput)), hmac.digest('base64'));
    }
    /**
     * @name verify
     * @description verify jsonwebtoken pattern using RFC 7519
     * @method
     * @param {string} token
     * @param {string} secret
     * @param {{complete:boolean}|null} options
     * @returns  {server_security_jwt_complete|server_security_jwt_payload}
     */
    verify (token, secret, options=null) {
        const signature = token.split('.')[2];
        const securedInput = token.split('.', 2).join('.');

        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));

        //check expire, not before and return token object or throw error
        if (payload.exp > (Date.now()/1000))
            if (payload.nbf < (Date.now()/1000))
                if (signature == Jwt.fromBase64(Jwt.signatureCompute(securedInput, secret)))
                    return this.decode(token, options);
                else
                    throw 'JWTError';
            else
                throw 'JWTNotBeforeError';
        else
            throw 'JWTTokenExpiredError';
    }
    /**
     * @name sign
     * @description verify jsonwebtoken pattern using RFC 7519 and HS256 algorithm
     *              returns base64 encoded token with syntax: 
     *              [header].[payload].[encrypted signature]
     * @method
     * @param {Object.<string,*>} claim
     * @param {string} secret
     * @param {{expiresIn:string}} options
     * @returns  {string}
     */
    sign (claim, secret, options) {
        //calculate expire time
        const multiplier = Number((options?.expiresIn ?? '1').toLowerCase()
                                    .replace('d','')
                                    .replace('h','')
                                    .replace('m',''));
        const exp = Math.floor(options?.expiresIn.toLowerCase().indexOf('d')>-1?
                        ((Date.now()/1000) + (60*60*24*multiplier)):
                    options?.expiresIn.toLowerCase().indexOf('h')>-1?
                        ((Date.now()/1000) + (60*60*multiplier)):
                    options?.expiresIn.toLowerCase().indexOf('m')>-1?
                        ((Date.now()/1000) + (60*multiplier)):
                    //default 1 hour
                    (Date.now()/1000) + (60*60));

        const payload = {//Private claim names should not be any of registered claim names
                         ...claim,
                         ...{
                            //Registered claim names
                            //token id
                            jtid:Date.now(),
                            //issuer
                            iss:'APP_PORTFOLIO SERVER SECURITY',
                            //subject
                            sub:'APP_PORTFOLIO',
                            //audience
                            aud:'APP_PORTFOLIO USERS',
                            //expire timestamp in seconds    
                            exp: exp,
                            //issued at timestamp in seconds
                            iat:(Date.now()/1000),
                            //not before timestamp in seconds
                            nbf:(Date.now()/1000)
                            }
                        };
        //encode header and payload to base64
        const securedInput = //header
                             `${Buffer.from(JSON.stringify({'alg':'HS256','typ':'JWT'}), 'utf8').toString('base64')}` + '.' + 
                             //payload
                             `${Buffer.from(JSON.stringify(payload), 'utf8').toString('base64')}`;
        return Jwt.fromBase64(`${securedInput}.${Jwt.signatureCompute(Jwt.fromBase64(securedInput), secret)}`);
    }
    /**
     * @name verify
     * @description verify jsonwebtoken pattern using RFC 7519
     * @method
     * @param {string} token
     * @param {{complete:boolean}|null} options
     * @returns  {server_security_jwt_complete|server_security_jwt_payload}
     */
    decode (token, options=null ) {
        return options?.complete==true?
                    {header:JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString('utf8')),
                     payload:JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')),
                     signature:token.split('.')[2],
                    }:
                       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
    }
}
const jwt = new Jwt();

/**
 * @name securityTransportEncrypt
 * @description Encrypts a string for BFF using Web Crypto API pattern
 * @function
 * @param {{app_id: number,
 *          data:   string,
 *          jwk:    JsonWebKey,
 *          iv:     string}} parameters
 * @returns {Promise.<string>}
 */
const securityTransportEncrypt = async parameters => {
    const Crypto = await import('../apps/common/src/functions/common_crypto.js');
	return Crypto.subtle.encrypt({	
                        iv:     parameters.iv,
						key:    parameters.jwk.k, 
						data:   parameters.data, 
						});
};

/**
 * @name securityTransportDecrypt
 * @description Decrypts for BFF using Web Crypto API pattern
 *              Data to decrypt should be a base64 string
 * @function
 * @param {{app_id:     number,
 *          encrypted:  string,
 *          jwk:        JsonWebKey,
 *          iv:         string}} parameters
 * @returns {Promise.<*>} 
*/
const securityTransportDecrypt = async parameters =>{
    const Crypto = await import('../apps/common/src/functions/common_crypto.js');
	return Crypto.subtle.decrypt({	
                    iv:         parameters.iv,
					key:        parameters.jwk.k, 
					ciphertext: parameters.encrypted});
};
/**
 * @name securityTransportCreateSecrets
 * @description Creates jwk and iv for BFF using Web Crypto API pattern
 * @function
 * @returns {Promise.<{jwk:JsonWebKey, iv:string}>} 
 */
const securityTransportCreateSecrets = async () => {
    return {
            jwk : {	alg:'A256CFB', 
                    ext:true, 
                    k: securitySecretCreate(false, 32),
                    key_ops:['encrypt','decrypt'], 
                    kty:'oct'},
            iv  : securitySecretCreate(false, 16)
            };
    
};

export {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate, securitySecretCreate, 
        securityOTPKeyCreate,securityOTPKeyValidate, securityTOTPGenerate,securityTOTPValidate,
        securityPasswordCreate, securityPasswordCompare, securityPasswordGet,
        securityKeyPairCreate, securityPublicEncrypt, securityPrivateDecrypt,
        jwt,
        securityTransportEncrypt, securityTransportDecrypt, securityTransportCreateSecrets};