const Base64Util = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    ENCODED_VALS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + '+/=',
    ENCODED_VALS_WEBSAFE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + '-_.',


    encodeByteArray: (input, opt_webSafe?: string) => {
        Base64Util.init();

        var byteToCharMap = opt_webSafe ? Base64Util.byteToCharMapWebSafe_ : Base64Util.byteToCharMap_;

        var output = [];

        for (var i = 0; i < input.length; i += 3) {
            var byte1 = input[i];
            var haveByte2 = i + 1 < input.length;
            var byte2 = haveByte2 ? input[i + 1] : 0;
            var haveByte3 = i + 2 < input.length;
            var byte3 = haveByte3 ? input[i + 2] : 0;

            var outByte1 = byte1 >> 2;
            var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
            var outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
            var outByte4 = byte3 & 0x3F;

            if (!haveByte3) {
                outByte4 = 64;

                if (!haveByte2) {
                    outByte3 = 64;
                }
            }

            output.push(byteToCharMap[outByte1],
                byteToCharMap[outByte2],
                byteToCharMap[outByte3],
                byteToCharMap[outByte4]);
        }

        return output.join('');
    },

    encode: (input, opt_webSafe?: string) => {
        return Base64Util.encodeByteArray(Base64Util.stringToByteArray(input), opt_webSafe);
    },


    decode: (input, opt_webSafe) => {
        Base64Util.init();

        var charToByteMap = opt_webSafe ? Base64Util.charToByteMapWebSafe_ : Base64Util.charToByteMap_;

        var output = [];

        for (var i = 0; i < input.length;) {
            var byte1 = charToByteMap[input.charAt(i++)];

            var haveByte2 = i < input.length;
            var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;

            var haveByte3 = i < input.length;
            var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 0;
            ++i;

            var haveByte4 = i < input.length;
            var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 0;
            ++i;

            if (byte1 == null || byte2 == null ||
                byte3 == null || byte4 == null) {
                throw Error();
            }

            var outByte1 = (byte1 << 2) | (byte2 >> 4);
            output.push(outByte1);

            if (byte3 != 64) {
                var outByte2 = ((byte2 << 4) & 0xF0) | (byte3 >> 2);
                output.push(outByte2);

                if (byte4 != 64) {
                    var outByte3 = ((byte3 << 6) & 0xC0) | byte4;
                    output.push(outByte3);
                }
            }
        }

        return output;
    },

    stringToByteArray: (str) => {
        var output = [], p = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            while (c > 0xff) {
                output[p++] = c & 0xff;
                c >>= 8;
            }
            output[p++] = c;
        }
        return output;
    },

    init: () => {
        if (!Base64Util.byteToCharMap_) {
            Base64Util.byteToCharMap_ = {};
            Base64Util.charToByteMap_ = {};
            Base64Util.byteToCharMapWebSafe_ = {};
            Base64Util.charToByteMapWebSafe_ = {};

            // We want quick mappings back and forth, so we precompute two maps.
            for (var i = 0; i < Base64Util.ENCODED_VALS.length; i++) {
                Base64Util.byteToCharMap_[i] = Base64Util.ENCODED_VALS.charAt(i);
                Base64Util.charToByteMap_[Base64Util.byteToCharMap_[i]] = i;
                Base64Util.byteToCharMapWebSafe_[i] = Base64Util.ENCODED_VALS_WEBSAFE.charAt(i);
                Base64Util.charToByteMapWebSafe_[Base64Util.byteToCharMapWebSafe_[i]] = i;
            }
        }
    }
};

export default Base64Util;