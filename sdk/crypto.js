/**
 * @module sdk/crypto
 */

/**
 * @name Crypto
 * @description Crypto library
 * @constant
 */
const Crypto = (() =>{
    const CryptoObj = {};
    /**@type {*} */
    CryptoObj.AES = {};
    // Crypto utilities
    CryptoObj.util = {

        /**
         * @description Convert a byte array to big-endian 32-bit words
         * @param {[]} bytes
         * @returns {number[]}
         */
        bytesToWords: bytes => {
            /**@type{number[]} */
            const words = [];
            for (let i = 0, b = 0; i < bytes.length; i++, b += 8)
                words[b >>> 5] |= bytes[i] << (24 - b % 32);
            return words;
        },

        /**
         * @description Convert big-endian 32-bit words to a byte array
         * @param {number[]} words
         * @returns {number[]}
         */
        wordsToBytes: words => {
            /**@type{number[]} */
            const bytes = [];
            for (let b = 0; b < words.length * 32; b += 8)
                bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
            return bytes;
        },

        /**
         * @description Convert a byte array to a hex string
         * @param {number[]} bytes
         * @returns {string}
         */
        bytesToHex: bytes => {
            /**@type{string[]} */
            const hex = [];
            for (let i = 0; i < bytes.length; i++) {
                hex.push((bytes[i] >>> 4).toString(16));
                hex.push((bytes[i] & 0xF).toString(16));
            }
            return hex.join('');
        }

    };

    // Crypto character encodings
    CryptoObj.charenc = {};
    // UTF-8 encoding
    CryptoObj.charenc.UTF8 = {

        /**
         * @description Convert a string to a byte array
         * @param {*} str
         * @returns {*}
         */
        stringToBytes: str => {
            return CryptoObj.charenc.Binary.stringToBytes(str);
        },

        /**
         * @description Convert a byte array to a string
         * @param {number[]} bytes
         * @returns {string}
         */
        bytesToString: bytes => {
            return CryptoObj.charenc.Binary.bytesToString(bytes);
        }

    };
    // Binary encoding
    CryptoObj.charenc.Binary = {

        /**
         * @description Convert a string to a byte array
         * @param {string} str
         * @returns {number[]}
         */
        stringToBytes: str => {
            const bytes = [];
            for (let i = 0; i < str.length; i++)
                bytes.push(str.charCodeAt(i) & 0xFF);
            return bytes;
        },

        /**
         * @description Convert a byte array to a string
         * @param {number[]} bytes
         * @returns {string}
         */
        bytesToString: bytes => {
            const str = []; 
            for (let i = 0; i < bytes.length; i++)
                str.push(String.fromCharCode(bytes[i]));
            return str.join('');
        }

    };    

    /**
     * @description Create pad namespac
     * @type {*}
     */
    CryptoObj.pad = {};

    /**
     * @description Calculate the number of padding bytes required.
     * @param {*} cipher
     * @param {number[]} message
     * @returns {number}
     */
    const _requiredPadding = (cipher, message) =>{
        const blockSizeInBytes = cipher._blocksize * 4;
        const reqd = blockSizeInBytes - message.length % blockSizeInBytes;
        return reqd;
    };

    /**
     * @description Remove padding when the final byte gives the number of padding bytes.
     * @param {number[]} message
     */
    const _unpadLength = message => {
        const pad = message.pop();
        /**@ts-ignore */
        for (let i = 1; i < pad; i++) {
            message.pop();
        }
    };

    /**
     * @description No-operation padding, used for stream ciphers
     */
    CryptoObj.NoPadding = {
            /**
             * @param {*} cipher
             * @param {number[]} message
             */
            pad : (cipher,message)=> {cipher;message;},
            /**
             * @param {string} message
             */
            unpad : (message) => {message;}
        };

    /**
     * @description Zero Padding.
     *              If the message is not an exact number of blocks, the final block is
     *              completed with 0x00 bytes. There is no unpadding.
     */
    CryptoObj.ZeroPadding = {
        /**
         * @param {*} cipher
         * @param {number[]} message
         */
        pad : (cipher, message) => {
            const blockSizeInBytes = cipher._blocksize * 4;
            let reqd = message.length % blockSizeInBytes;
            if( reqd!=0 ) {
                for(reqd = blockSizeInBytes - reqd; reqd>0; reqd--) {
                    message.push(0x00);
                }
            }
        },
        /**
         * @param {number[]} message
         */
        unpad : message => {message;}
    };

    /**
     * @description ISO/IEC 7816-4 padding.
     *              Pads the plain text with an 0x80 byte followed by as many 0x00
     *              bytes are required to complete the block.
     */
    CryptoObj.iso7816 = {
        /**
         * @param {*} cipher
         * @param {number[]} message
         */
        pad : (cipher, message) => {
            let reqd = _requiredPadding(cipher, message);
            message.push(0x80);
            for (; reqd > 1; reqd--) {
                message.push(0x00);
            }
        },
        /**
         * @param {number[]} message
         */
        unpad : function (message) {
            while (message.pop() != 0x80) {message;}
        }
    };

    /**
     * @description ANSI X.923 padding
     *              The final block is padded with zeros except for the last byte of the
     *              last block which contains the number of padding bytes.
     */
    CryptoObj.ansix923 = {
        /**
         * @param {*} cipher
         * @param {number[]} message
         */
        pad : (cipher, message) => {
            const reqd = _requiredPadding(cipher, message);
            for (let i = 1; i < reqd; i++) {
                message.push(0x00);
            }
            message.push(reqd);
        },
        unpad : _unpadLength
    };

    /**
     * @description ISO 10126
     *              The final block is padded with random bytes except for the last
     *              byte of the last block which contains the number of padding bytes.
     */
    CryptoObj.iso10126 = {
        /**
         * @param {*} cipher
         * @param {number[]} message
         */
        pad : (cipher, message) => {
            const reqd = _requiredPadding(cipher, message);
            for (let i = 1; i < reqd; i++) {
                message.push(Math.floor(Math.random() * 256));
            }
            message.push(reqd);
        },

        unpad : _unpadLength
    };

    /**
     * @description PKCS7 padding
     *              PKCS7 is described in RFC 5652. Padding is in whole bytes. The
     *              value of each added byte is the number of bytes that are added,
     *              i.e. N bytes, each of value N are added.
     */
    CryptoObj.pkcs7 = {
        /**
         * @param {*} cipher
         * @param {number[]} message
         */
        pad : (cipher, message) => {
            const reqd = _requiredPadding(cipher, message);
            for (let i = 0; i < reqd; i++) {
                message.push(reqd);
            }
        },

        unpad : _unpadLength
    };

    /**
     * @description Create mode namespace
     * @type {*}
     */
    CryptoObj.mode = {};

    /**
     * @description Mode base "class".
     * @param {*}  padding
     * @type {*}
     */
    const Mode = CryptoObj.mode.Mode = function (padding=null) {
        if (padding) {
            this._padding = padding;
        }
    };
    
    Mode.prototype = {
        /**
         * @param {*} cipher
         * @param {*} m
         * @param {*} iv
         */
        encrypt: function (cipher, m, iv) {
            this._padding?.pad(cipher, m);
            /**@ts-ignore */
            this._doEncrypt(cipher, m, iv);
        },
        /**
         * @param {*} cipher
         * @param {*} m
         * @param {*} iv
         */
        decrypt: function (cipher, m, iv) {
            /**@ts-ignore */
            this._doDecrypt(cipher, m, iv);
            this._padding?.unpad(m);
        },

        /**
         * @description Default padding
         */
        _padding: CryptoObj.iso7816
    };


    /**
     * @description Electronic Code Book mode.
     *              ECB applies the cipher directly against each block of the input.
     *              ECB does not require an initialization vector.
     */
    const ECB = CryptoObj.mode.ECB = function () {
        // Call parent constructor
        Mode.apply(this, arguments);
    };

    /**
     * @description Inherit from Mode
     */
    const ECB_prototype = ECB.prototype = new Mode;

    /**
     * @description Concrete steps for Mode template
     * @param {*} cipher
     * @param {*} m
     * @param {*} iv
     */
    ECB_prototype._doEncrypt = (cipher, m, iv) => {
        iv;
        const blockSizeInBytes = cipher._blocksize * 4;
        // Encrypt each block
        for (let offset = 0; offset < m.length; offset += blockSizeInBytes) {
            cipher._encryptblock(m, offset);
        }
    };
    /**
     * @param {*} cipher
     * @param {*} c
     * @param {*} iv
     */
    ECB_prototype._doDecrypt = (cipher, c, iv) => {
        iv;
        const blockSizeInBytes = cipher._blocksize * 4;
        // Decrypt each block
        for (let offset = 0; offset < c.length; offset += blockSizeInBytes) {
            cipher._decryptblock(c, offset);
        }
    };

    /**
     * @description ECB never uses an IV
     * @param {*} options
     */
    ECB_prototype.fixOptions = options => {
        options.iv = [];
    };

    /**
     * @description Cipher block chaining
     *              The first block is XORed with the IV. Subsequent blocks are XOR with the
     *              previous cipher output.
     */
    const CBC = CryptoObj.mode.CBC = function () {
        // Call parent constructor
        Mode.apply(this, arguments);
    };

    /**
     * @description Inherit from Mode
     */
    const CBC_prototype = CBC.prototype = new Mode;

    /**
     * @description Concrete steps for Mode template
     * @param {*} cipher
     * @param {*} m
     * @param {*} iv
     */
    CBC_prototype._doEncrypt = (cipher, m, iv) => {
        const blockSizeInBytes = cipher._blocksize * 4;

        // Encrypt each block
        for (let offset = 0; offset < m.length; offset += blockSizeInBytes) {
            if (offset == 0) {
                // XOR first block using IV
                for (let i = 0; i < blockSizeInBytes; i++)
                m[i] ^= iv[i];
            } else {
                // XOR this block using previous crypted block
                for (let i = 0; i < blockSizeInBytes; i++)
                m[offset + i] ^= m[offset + i - blockSizeInBytes];
            }
            // Encrypt block
            cipher._encryptblock(m, offset);
        }
    };
    /**
     * @param {*} cipher
     * @param {*} c
     * @param {*} iv
     */
    CBC_prototype._doDecrypt = (cipher, c, iv) => {
        const blockSizeInBytes = cipher._blocksize * 4;

        // At the start, the previously crypted block is the IV
        let prevCryptedBlock = iv;

        // Decrypt each block
        for (let offset = 0; offset < c.length; offset += blockSizeInBytes) {
            // Save this crypted block
            const thisCryptedBlock = c.slice(offset, offset + blockSizeInBytes);
            // Decrypt block
            cipher._decryptblock(c, offset);
            // XOR decrypted block using previous crypted block
            for (let i = 0; i < blockSizeInBytes; i++) {
                c[offset + i] ^= prevCryptedBlock[i];
            }
            prevCryptedBlock = thisCryptedBlock;
        }
    };

    /**
     * @description Cipher feed back
     *              The cipher output is XORed with the plain text to produce the cipher output,
     *              which is then fed back into the cipher to produce a bit pattern to XOR the
     *              next block with.
     * 
     *              This is a stream cipher mode and does not require padding.
     */
    const CFB = CryptoObj.mode.CFB = function () {
        // Call parent constructor
        Mode.apply(this, arguments);
    };

    /**
     * @description Inherit from Mode
     */
    const CFB_prototype = CFB.prototype = new Mode;

    /**
     * @description Override padding
     */
    CFB_prototype._padding = CryptoObj.pad.NoPadding;

    /**
     * @description Concrete steps for Mode template
     * @param {*} cipher
     * @param {*} m
     * @param {*} iv
     */
    CFB_prototype._doEncrypt = (cipher, m, iv) => {
        const blockSizeInBytes = cipher._blocksize * 4,
            keystream = iv.slice(0);

        // Encrypt each byte
        for (let i = 0; i < m.length; i++) {

            const j = i % blockSizeInBytes;
            if (j == 0) cipher._encryptblock(keystream, 0);

            m[i] ^= keystream[j];
            keystream[j] = m[i];
        }
    };
    /**
     * @param {*} cipher
     * @param {*} c
     * @param {*} iv
     */
    CFB_prototype._doDecrypt = (cipher, c, iv) => {
        const blockSizeInBytes = cipher._blocksize * 4,
            keystream = iv.slice(0);

        // Encrypt each byte
        for (let i = 0; i < c.length; i++) {

            const j = i % blockSizeInBytes;
            if (j == 0) cipher._encryptblock(keystream, 0);

            const b = c[i];
            c[i] ^= keystream[j];
            keystream[j] = b;
        }
    };


    /**
     * @description Output feed back
     *              The cipher repeatedly encrypts its own output. The output is XORed with the
     *              plain text to produce the cipher text.
     *              This is a stream cipher mode and does not require padding.
     */
    const OFB = CryptoObj.mode.OFB = function () {
        // Call parent constructor
        Mode.apply(this, arguments);
    };

    /**
     * @description Inherit from Mode
     */
    const OFB_prototype = OFB.prototype = new Mode;

    /**
     * @description Override padding
     */
    OFB_prototype._padding = CryptoObj.NoPadding;

    /**
     * @description Concrete steps for Mode template
     * @param {*} cipher
     * @param {*} m
     * @param {*} iv
     */
    OFB_prototype._doEncrypt = (cipher, m, iv) => {

        const blockSizeInBytes = cipher._blocksize * 4,
            keystream = iv.slice(0);

        // Encrypt each byte
        for (let i = 0; i < m.length; i++) {

            // Generate keystream
            if (i % blockSizeInBytes == 0)
                cipher._encryptblock(keystream, 0);

            // Encrypt byte
            m[i] ^= keystream[i % blockSizeInBytes];

        }
    };
    OFB_prototype._doDecrypt = OFB_prototype._doEncrypt;

    /**
     * @description Counter
     *              After every block the last 4 bytes of the IV is increased by one
     *              with carry and that IV is used for the next block.
     *              This is a stream cipher mode and does not require padding.
     */
    const CTR = CryptoObj.mode.CTR = function () {
        // Call parent constructor
        Mode.apply(this, arguments);
    };

    /**
     * @description Inherit from Mode
     */
    const CTR_prototype = CTR.prototype = new Mode;

    /**
     * @description Override padding
     */
    CTR_prototype._padding = CryptoObj.NoPadding;
    /**
     * @param {*} cipher
     * @param {*} m
     * @param {*} iv
     */
    CTR_prototype._doEncrypt = (cipher, m, iv) => {
        const blockSizeInBytes = cipher._blocksize * 4;

        for (let i = 0; i < m.length;) {
            // do not lose iv
            const keystream = iv.slice(0);

            // Generate keystream for next block
            cipher._encryptblock(keystream, 0);

            // XOR keystream with block
            for (let j = 0; i < m.length && j < blockSizeInBytes; j++, i++) {
                m[i] ^= keystream[j];
            }

            // Increase IV
            if(++(iv[blockSizeInBytes-1]) == 256) {
                iv[blockSizeInBytes-1] = 0;
                if(++(iv[blockSizeInBytes-2]) == 256) {
                    iv[blockSizeInBytes-2] = 0;
                    if(++(iv[blockSizeInBytes-3]) == 256) {
                        iv[blockSizeInBytes-3] = 0;
                        ++(iv[blockSizeInBytes-4]);
                    }
                }
            }
        }
    };
    CTR_prototype._doDecrypt = CTR_prototype._doEncrypt;
    return CryptoObj;
})();

/**
 *
 * @name HMAC
 * @description HMAC
 * @function
 * @param {*} hasher
 * @param {*} message
 * @param {*} key
 * @param {*} options
 */
const HMAC = (hasher, message, key, options) =>{

    // Convert to byte arrays
    if (message.constructor == String) message = Crypto.charenc.UTF8.stringToBytes(message);
    if (key.constructor == String) key = Crypto.charenc.UTF8.stringToBytes(key);
    /* else, assume byte arrays already */

    // Allow arbitrary length keys
    if (key.length > hasher._blocksize * 4)
        key = hasher(key, { asBytes: true });

    // XOR keys with pad constants
    const okey = key.slice(0),
        ikey = key.slice(0);
    for (let i = 0; i < hasher._blocksize * 4; i++) {
        okey[i] ^= 0x5C;
        ikey[i] ^= 0x36;
    }

    const hmacbytes = hasher(okey.concat(hasher(ikey.concat(message), { asBytes: true })), { asBytes: true });

    return options && options.asBytes ? hmacbytes :
            options && options.asString ? Crypto.charenc.Binary.bytesToString(hmacbytes) :
            Crypto.util.bytesToHex(hmacbytes);

};
/**
 * @name PBKDF2
 * @description PBKDF2
 * @function
 * @param {*} password
 * @param {*} salt
 * @param {*} keylen
 * @param {*} options
 */
const PBKDF2 = (password, salt, keylen, options) =>{

	// Convert to byte arrays
	if (password.constructor == String) password = Crypto.charenc.UTF8.stringToBytes(password);
	if (salt.constructor == String) salt = Crypto.charenc.UTF8.stringToBytes(salt);
	/* else, assume byte arrays already */

	// Defaults
	const   hasher = options && options.hasher || SHA1,
            iterations = options && options.iterations || 1;

	/**
     * @description Pseudo-random function  
     * @param {*} password
     * @param {*} salt
     */
	const PRF = (password, salt) => HMAC(hasher, salt, password, { asBytes: true });

	// Generate key
    /**@type{number[]} */
	let derivedKeyBytes = [],
        blockindex = 1;
	while (derivedKeyBytes.length < keylen) {
		const block = PRF(password, salt.concat(Crypto.util.wordsToBytes([blockindex])));
		for (let u = block, i = 1; i < iterations; i++) {
			u = PRF(password, u);
			for (let j = 0; j < block.length; j++) block[j] ^= u[j];
		}
		derivedKeyBytes = derivedKeyBytes.concat(block);
		blockindex++;
	}

	// Truncate excess bytes
	derivedKeyBytes.length = keylen;

	return  options && options.asBytes ? derivedKeyBytes :
            options && options.asString ? Crypto.charenc.Binary.bytesToString(derivedKeyBytes) :
            Crypto.util.bytesToHex(derivedKeyBytes);

};
/**
 * @name SHA1
 * @description SHA1
 * @function
 * @param {*} message
 * @param {*} options
 */
const SHA1 = (message, options) => {
	const digestbytes = Crypto.util.wordsToBytes(SHA1._sha1(message));
	return options && options.asBytes ? digestbytes :
           options && options.asString ? Crypto.charenc.Binary.bytesToString(digestbytes) :
           Crypto.util.bytesToHex(digestbytes);
};

/**
 * @name SHA1._sha1
 * @description The core
 * @function
 * @param {*} message
 */
SHA1._sha1 = message => {

	// Convert to byte array
	if (message.constructor == String) message = Crypto.charenc.UTF8.stringToBytes(message);
	/* else, assume byte array already */

	const 
        m  = Crypto.util.bytesToWords(message),
        l  = message.length * 8,
        w  =  [];
    let H0 =  1732584193,
        H1 = -271733879,
        H2 = -1732584194,
        H3 =  271733878,
        H4 = -1009589776;

	// Padding
	m[l >> 5] |= 0x80 << (24 - l % 32);
	m[((l + 64 >>> 9) << 4) + 15] = l;

	for (let i = 0; i < m.length; i += 16) {

		const 
            a = H0,
            b = H1,
            c = H2,
            d = H3,
            e = H4;

		for (let j = 0; j < 80; j++) {

			if (j < 16) 
                w[j] = m[i + j];
			else {
                /**@type{*} */
				const n = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
				w[j] = (n << 1) | (n >>> 31);
			}

			const t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                    j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                    j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                    j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                             (H1 ^ H2 ^ H3) - 899497514);

			H4 =  H3;
			H3 =  H2;
			H2 = (H1 << 30) | (H1 >>> 2);
			H1 =  H0;
			H0 =  t;

		}

		H0 += a;
		H1 += b;
		H2 += c;
		H3 += d;
		H4 += e;

	}

	return [H0, H1, H2, H3, H4];

};

/**
 * @name SHA1._blocksize
 * @description Package private blocksize
 * @constant
 */
SHA1._blocksize = 16;

/**
 * @name SHA1._digestsize
 * @description Package private digestsize
 * @constant
 */
SHA1._digestsize = 20;

/**
 * @name SBOX
 * @description Precomputed SBOX
 * @constant
 */
const SBOX = [ 0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
             0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
             0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
             0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
             0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
             0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
             0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
             0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
             0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
             0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
             0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
             0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
             0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
             0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
             0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
             0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
             0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
             0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
             0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
             0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
             0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
             0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
             0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
             0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
             0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
             0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
             0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
             0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
             0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
             0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
             0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
             0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 ];

/**
 * @name INVSBOX
 * @description Compute inverse SBOX lookup table
 * @constant
 * @type{*[]}
 */
const INVSBOX = [];
for (let i = 0; i < 256; i++) INVSBOX[SBOX[i]] = i;

// Compute mulitplication in GF(2^8) lookup tables

/**
 * @name MULT2 MULT3 MULT9 MULTB MULTD MULTE
 * @description MULT2 MULT3 MULT9 MULTB MULTD MULTE
 * @constant
 */
const 
    /**@type{*[]} */
    MULT2 = [],
    /**@type{*[]} */
    MULT3 = [],
    /**@type{*[]} */
    MULT9 = [],
    /**@type{*[]} */
    MULTB = [],
    /**@type{*[]} */
    MULTD = [],
    /**@type{*[]} */
    MULTE = [];

/** 
 * @name xtime
 * @description xtime
 * @function
 * @param {*} a
 * @param {*} b
 */
const xtime = (a, b) => {
    let result = 0;
	for (let i = 0; i < 8; i++) {
		if (b & 1) 
            result ^= a;
		const hiBitSet = a & 0x80;
		a = (a << 1) & 0xFF;
		if (hiBitSet) a ^= 0x1b;
		b >>>= 1;
	}
	return result;
};

for (let i = 0; i < 256; i++) {
	MULT2[i] = xtime(i,2);
	MULT3[i] = xtime(i,3);
	MULT9[i] = xtime(i,9);
	MULTB[i] = xtime(i,0xB);
	MULTD[i] = xtime(i,0xD);
	MULTE[i] = xtime(i,0xE);
}

/**
 * @name RCON
 * @description Precomputed RCon lookup
 * @constant
 */
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

/**
 * @name state
 * @ddescription Inner state
 * @constant
 */
const state = [[], [], [], []];

let 
    /**@type {number} */
    keylength,
    /**@type {number} */
    nrounds,
    /**@type {[]} */
    keyschedule;

/**
 * @name AES
 * @description Encrypts and decrypts using Web Crypto API pattern,
 *              Uses AES algorithm created by Vincent Rijmen and Joan Daemen,
 *              CFB mode stream encryption without extra overhead of padding for performance 
 *	            and without any browser protocol restrictions.
 *              Use securityTransportCreateSecrets() to generate JsonWebKey (jwk) and initial vector (iv)
 *              the k key in jwk is used as key inparameter
 *	            Example 256 bit encryption: 
 *              uses 14 cycles for a 256 bit key where secret key is 32 characters and 
 *              initial vector is 16 characters
 *              
 *	            Each cycle consists of 4 steps
 *	            1. Byte subsititution
 *	            2. Shift row
 *	            3. Mix column
 *	            4. Add subkey
 *              Encrypt uses data string parameter to encrypt, returns ciphertext string in base64 format
 *              Decrypt uses ciphertext parameter from encrypt function and returns decrypted text string
 *              Supports Unicode and functions can be used in app and server without protocol restrictions
 * @constant
 */    
Crypto.AES = {
    /**
     * @param {{iv:string, key:string, data:string}} parameters
     */
	encrypt: parameters => {
        //all parameters must be strings and not '' or null
        if (parameters.iv.constructor == String && !['', null].includes(parameters.iv) &&
            parameters.key.constructor == String && !['', null].includes(parameters.key) &&
            parameters.data.constructor == String && !['', null].includes(parameters.data)
        ){
            const mode = new Crypto.mode.CFB;

            const m = new TextEncoder().encode(parameters.data);

            // Generate random IV
            const iv = parameters.iv.split('');
    
            // Generate key
            const k = PBKDF2(parameters.key, iv, 32, { asBytes: true });
    
            // Encrypt
            Crypto.AES._init(k);
            mode.encrypt(Crypto.AES, m, iv);
            
            // Return ciphertext, saves array to string to suppport Unicode
            return btoa(m.toString());
        }
        else
            throw '⛔';
	},
    /**
     * @param {{iv:string, key:string, ciphertext:string}} parameters
     */
	decrypt: parameters => {
        //all parameters must be strings and not '' or null
        if (parameters.iv.constructor == String && !['', null].includes(parameters.iv) &&
            parameters.key.constructor == String && !['', null].includes(parameters.key) &&
            parameters.ciphertext.constructor == String && !['', null].includes(parameters.ciphertext)
        ){
            const mode = new Crypto.mode.CFB;
        
            const
                // Convert to bytes by converting string with unicode codes to array
                /**@ts-ignore */
                c = new Uint8Array(atob(parameters.ciphertext).split(',')),
    
                // Convert IV to array
                iv = parameters.iv.split(''),
    
                // Generate key
                k = PBKDF2(parameters.key, iv, 32, { asBytes: true });
    
            // Decrypt
            Crypto.AES._init(k);
            mode.decrypt(Crypto.AES, c, iv);
            
            return new TextDecoder().decode(c);
        }
        else
            throw '⛔';
	},


	/**
	 * @description Package private methods and properties
	 */

	_blocksize: 4,
    /**
     * @param {*} m
     * @param {*} offset
     */
	_encryptblock: (m, offset) => {

		// Set input
		for (let row = 0; row < Crypto.AES._blocksize; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] = m[offset + col * 4 + row];
		}

		// Add round key
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] ^= keyschedule[col][row];
		}

		for (let round = 1; round < nrounds; round++) {

			// Sub bytes
			for (let row = 0; row < 4; row++) {
				for (let col = 0; col < 4; col++)
                    /**@ts-ignore */
					state[row][col] = SBOX[state[row][col]];
			}

			// Shift rows
            /**@ts-ignore */
			state[1].push(state[1].shift());
            /**@ts-ignore */
			state[2].push(state[2].shift());
            /**@ts-ignore */
			state[2].push(state[2].shift());
            /**@ts-ignore */
			state[3].unshift(state[3].pop());

			// Mix columns
			for (let col = 0; col < 4; col++) {
                        /**@ts-ignore */
				const   s0 = state[0][col],
                        /**@ts-ignore */
                        s1 = state[1][col],
                        /**@ts-ignore */
                        s2 = state[2][col],
                        /**@ts-ignore */
                        s3 = state[3][col];
                /**@ts-ignore */
				state[0][col] = MULT2[s0] ^ MULT3[s1] ^ s2 ^ s3;
                /**@ts-ignore */
				state[1][col] = s0 ^ MULT2[s1] ^ MULT3[s2] ^ s3;
                /**@ts-ignore */
				state[2][col] = s0 ^ s1 ^ MULT2[s2] ^ MULT3[s3];
                /**@ts-ignore */
				state[3][col] = MULT3[s0] ^ s1 ^ s2 ^ MULT2[s3];

			}

			// Add round key
			for (let row = 0; row < 4; row++) {
				for (let col = 0; col < 4; col++)
                    /**@ts-ignore */
					state[row][col] ^= keyschedule[round * 4 + col][row];
			}

		}

		// Sub bytes
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] = SBOX[state[row][col]];
		}

		// Shift rows
        /**@ts-ignore */
		state[1].push(state[1].shift());
        /**@ts-ignore */
		state[2].push(state[2].shift());
        /**@ts-ignore */
		state[2].push(state[2].shift());
        /**@ts-ignore */
		state[3].unshift(state[3].pop());

		// Add round key
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] ^= keyschedule[nrounds * 4 + col][row];
		}

		// Set output
		for (let row = 0; row < Crypto.AES._blocksize; row++) {
			for (let col = 0; col < 4; col++)
				m[offset + col * 4 + row] = state[row][col];
		}

	},
    /**
     * @param {*} c
     * @param {*} offset
     */
	_decryptblock: (c, offset) =>{

		// Set input
		for (let row = 0; row < Crypto.AES._blocksize; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] = c[offset + col * 4 + row];
		}

		// Add round key
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] ^= keyschedule[nrounds * 4 + col][row];
		}

		for (let round = 1; round < nrounds; round++) {

			// Inv shift rows
            /**@ts-ignore */
			state[1].unshift(state[1].pop());
            /**@ts-ignore */
			state[2].push(state[2].shift());
            /**@ts-ignore */
			state[2].push(state[2].shift());
            /**@ts-ignore */
			state[3].push(state[3].shift());

			// Inv sub bytes
			for (let row = 0; row < 4; row++) {
				for (let col = 0; col < 4; col++)
                    /**@ts-ignore */
					state[row][col] = INVSBOX[state[row][col]];
			}

			// Add round key
			for (let row = 0; row < 4; row++) {
				for (let col = 0; col < 4; col++)
                    /**@ts-ignore */
					state[row][col] ^= keyschedule[(nrounds - round) * 4 + col][row];
			}

			// Inv mix columns
			for (let col = 0; col < 4; col++) {
                        /**@ts-ignore */    
				const   s0 = state[0][col],
                        /**@ts-ignore */
                        s1 = state[1][col],
                        /**@ts-ignore */
                        s2 = state[2][col],
                        /**@ts-ignore */
                        s3 = state[3][col];

                /**@ts-ignore */
				state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
                /**@ts-ignore */
				state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
                /**@ts-ignore */
				state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
                /**@ts-ignore */
				state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];

			}

		}

		// Inv shift rows
        /**@ts-ignore */
		state[1].unshift(state[1].pop());
        /**@ts-ignore */
		state[2].push(state[2].shift());
        /**@ts-ignore */
		state[2].push(state[2].shift());
        /**@ts-ignore */
		state[3].push(state[3].shift());

		// Inv sub bytes
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] = INVSBOX[state[row][col]];
		}

		// Add round key
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++)
                /**@ts-ignore */
				state[row][col] ^= keyschedule[col][row];
		}

		// Set output
		for (let row = 0; row < Crypto.AES._blocksize; row++) {
			for (let col = 0; col < 4; col++)
				c[offset + col * 4 + row] = state[row][col];
		}

	},

	/**
	 * @description Private methods
     * @param {string} k
	 */
	_init: k => {
		keylength = k.length / 4;
		nrounds = keylength + 6;
		Crypto.AES._keyexpansion(k);
	},

	/**
     * @description Generate a key schedule
     * @param {string} k
     */
	_keyexpansion: k => {

		keyschedule = [];

		for (let row = 0; row < keylength; row++) {
            /**@ts-ignore */
			keyschedule[row] = [
				k[row * 4],
				k[row * 4 + 1],
				k[row * 4 + 2],
				k[row * 4 + 3]
			];
		}

		for (let row = keylength; row < Crypto.AES._blocksize * (nrounds + 1); row++) {

			const temp = [
				keyschedule[row - 1][0],
				keyschedule[row - 1][1],
				keyschedule[row - 1][2],
				keyschedule[row - 1][3]
			];

			if (row % keylength == 0) {

				// Rot word
                /**@ts-ignore */
				temp.push(temp.shift());

				// Sub word
                /**@ts-ignore */
				temp[0] = SBOX[temp[0]];
                /**@ts-ignore */
				temp[1] = SBOX[temp[1]];
                /**@ts-ignore */
				temp[2] = SBOX[temp[2]];
                /**@ts-ignore */
				temp[3] = SBOX[temp[3]];
                /**@ts-ignore */
				temp[0] ^= RCON[row / keylength];

			} else if (keylength > 6 && row % keylength == 4) {

				// Sub word
                /**@ts-ignore */
				temp[0] = SBOX[temp[0]];
                /**@ts-ignore */
				temp[1] = SBOX[temp[1]];
                /**@ts-ignore */
				temp[2] = SBOX[temp[2]];
                /**@ts-ignore */
				temp[3] = SBOX[temp[3]];

			}
            /**@ts-ignore */
			keyschedule[row] = [
				keyschedule[row - keylength][0] ^ temp[0],
				keyschedule[row - keylength][1] ^ temp[1],
				keyschedule[row - keylength][2] ^ temp[2],
				keyschedule[row - keylength][3] ^ temp[3]
			];
		}
	}
};
/**
 * @name subtle
 * @description subtle with encrypt and decrypt functions
 * @constant
 */
const subtle = {encrypt: Crypto.AES.encrypt,
                decrypt: Crypto.AES.decrypt,
                };

export {subtle};