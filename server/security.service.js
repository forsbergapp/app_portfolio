/** @module server/security */

const { randomUUID, 
        createHash, 
        createCipheriv, createDecipheriv} = await import('node:crypto');

/**
 * Create random string
 * @returns {string}
 */
 const CreateRandomString =()=>{
    let randomstring = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    for (let i = 0; i < 256; i++) {
        randomstring += chars[Math.floor(Math.random() * chars.length)] + Math.floor(1 + Math.random() * 10);
    }
    return randomstring;
};

/**
 * 
 * @returns {string}
 */
const createUUID = () =>randomUUID();
/**
 * Creates request id using UUID
 * @returns {string}
 */
const createRequestId = () =>randomUUID().replaceAll('-','');
/**
 * Creates correlation id using MD5
 * @param {string} text 
 * @returns {string}
 */
const createCorrelationId = text =>createHash('md5').update(text).digest('hex');

/**
 * Creates secret using SHA256
 * @param {boolean} extra           some databases requires extra '!' and random A-Z character
 * @param {number|null} max_length  some databases requires maximum length
 * @returns {string}
 */
const createSecret = (extra=false, max_length=null) =>{
    if (extra){
        if (max_length)
            return createHash('sha256').update(CreateRandomString()).digest('hex').substring(0,max_length - 2) + 
                '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
        else{
            const secret = createHash('sha256').update(CreateRandomString()).digest('hex');
            return secret.substring(0,secret.length - 2) + '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
        }
    }
    else
        if (max_length)
            return createHash('sha256').update(CreateRandomString()).digest('hex').substring(0,max_length);
        else
            return createHash('sha256').update(CreateRandomString()).digest('hex');
};
/**
 * Creates password using aes-256-cbc 
 * @param {string} password 
 * @returns {Promise.<string>}
 */
const PasswordCreate = async (password) => {
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const AppPasswordEncryptionKey = ConfigGet('SERVICE_IAM', 'ADMIN_PASSWORD_ENCRYPTION_KEY');
    const AppPasswordInitializationVector = ConfigGet('SERVICE_IAM', 'ADMIN_PASSWORD_INIT_VECTOR');
    const cipher = createCipheriv('aes-256-cbc', AppPasswordEncryptionKey, AppPasswordInitializationVector);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

/**
 * 
 * @param {string} password 
 * @param {string} compare_password 
 * @returns {Promise.<boolean>}
 */
const PasswordCompare = async (password, compare_password) =>{
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    //system admin uses different parameters than apps
    const AppPasswordEncryptionKey = ConfigGet('SERVICE_IAM', 'ADMIN_PASSWORD_ENCRYPTION_KEY');
    const AppPasswordInitializationVector = ConfigGet('SERVICE_IAM', 'ADMIN_PASSWORD_INIT_VECTOR');
    const decipher = createDecipheriv('aes-256-cbc', AppPasswordEncryptionKey, AppPasswordInitializationVector);
    let  decrypted = decipher.update(compare_password, 'base64', 'utf8'); //ERR_OSSL_WRONG_FINAL_BLOCK_LENGTH, Provider routines::wrong final block length
    try {
        return (decrypted + decipher.final('utf8')) == password;    
    } catch (error) {
        return false;
    }
};

export {createUUID, createRequestId, createCorrelationId, createSecret, PasswordCreate, PasswordCompare };