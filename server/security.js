/** @module server/security */

const { randomUUID, 
        createHash, 
        createCipheriv, createDecipheriv,
        generateKeyPair,
        publicEncrypt, privateDecrypt} = await import('node:crypto');

/**
 * Create random string
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
 * Creates random UUID
 * @function
 * @returns {string}
 */
const securityUUIDCreate = () =>randomUUID();
/**
 * Creates request id using UUID and removes '-'
 * @function
 * @returns {string}
 */
const securityRequestIdCreate = () =>randomUUID().replaceAll('-','');
/**
 * Creates correlation id using MD5
 * @param {string} text 
 * @returns {string}
 */
const securityCorrelationIdCreate = text =>createHash('md5').update(text).digest('hex');

/**
 * Creates secret using SHA256
 * @function
 * @param {boolean} extra           some databases requires extra '!' and random A-Z character
 * @param {number|null} max_length  some databases requires maximum length
 * @returns {string}
 */
const securitySecretCreate = (extra=false, max_length=null) =>{
    if (extra){
        if (max_length)
            return createHash('sha256').update(securityCreateRandomString()).digest('hex').substring(0,max_length - 2) + 
                '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
        else{
            const secret = createHash('sha256').update(securityCreateRandomString()).digest('hex');
            return secret.substring(0,secret.length - 2) + '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
        }
    }
    else
        if (max_length)
            return createHash('sha256').update(securityCreateRandomString()).digest('hex').substring(0,max_length);
        else
            return createHash('sha256').update(securityCreateRandomString()).digest('hex');
};
/**
 * Creates password for IAM using aes-256-cbc and base64, encryption key parameter and init vector parameter from server config
 * @function
 * @param {string} password 
 * @returns {Promise.<string>}
 */
const securityPasswordCreate = async (password) => {
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    const AppPasswordEncryptionKey = fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_PASSWORD_ENCRYPTION_KEY');
    const AppPasswordInitializationVector = fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_PASSWORD_INIT_VECTOR');
    const cipher = createCipheriv('aes-256-cbc', AppPasswordEncryptionKey, AppPasswordInitializationVector);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

/**
 * Compares password for IAM using aes-256-cbc and base64, encryption key parameter and init vector parameter from server config
 * @function
 * @param {string} password 
 * @param {string} compare_password 
 * @returns {Promise.<boolean>}
 */
const securityPasswordCompare = async (password, compare_password) =>{
    /**@type{import('./db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    //admin uses different parameters than apps
    const AppPasswordEncryptionKey = fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_PASSWORD_ENCRYPTION_KEY');
    const AppPasswordInitializationVector = fileModelConfig.get('CONFIG_SERVER','SERVICE_IAM', 'ADMIN_PASSWORD_INIT_VECTOR');
    const decipher = createDecipheriv('aes-256-cbc', AppPasswordEncryptionKey, AppPasswordInitializationVector);
    const  decrypted = decipher.update(compare_password, 'base64', 'utf8'); //ERR_OSSL_WRONG_FINAL_BLOCK_LENGTH, Provider routines::wrong final block length
    try {
        return (decrypted + decipher.final('utf8')) == password;    
    } catch (error) {
        return false;
    }
};
/**
 * Creates key pair using 8192 bits giving 8192/8 - 11 = 1013 max characters length
 * to be used for external server communication when longer encrypted message must be used
 * function can take several seconds to execute
 * public : spki and pem format
 * private: pkcs8 and pem format
 * @function
 * @returns {Promise.<{ publicKey:string, privateKey:string }>}
 */
const securityKeyPairCreate = async () => {
    return new Promise((resolve, reject)=>{
        generateKeyPair('rsa', {
            modulusLength: 8192,
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
 * Encrypt with public key
 * @function
 * @param {string} publicKey 
 * @param {string} text 
 * @returns {string}
 */
const securityPublicEncrypt = (publicKey, text) => publicEncrypt(publicKey,Buffer.from(text)).toString('base64');
/**
 * Decrypt with private key
 * @param {string} privateKey 
 * @param {string} text 
 * @returns {string}
 */
const securityPrivateDecrypt = (privateKey, text) => privateDecrypt(privateKey,
                                                            /**@ts-ignore */
                                                            Buffer.from(text, 'base64')).toString('utf-8');

export {securityUUIDCreate, securityRequestIdCreate, securityCorrelationIdCreate, securitySecretCreate, securityPasswordCreate, securityPasswordCompare, securityKeyPairCreate, securityPublicEncrypt, securityPrivateDecrypt };