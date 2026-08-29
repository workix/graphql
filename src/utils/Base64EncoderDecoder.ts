const encodeToBase64 = string => {
    //Buffer() requires a number, array or string as the first parameter, and an optional encoding type as the second parameter.
    // The default is "utf8". Possible encoding types are "ascii", "utf8", "ucs2", "base64", "binary", and "hex"
    const buffer = Buffer.from(string);
    // If we don't use toString(), JavaScript assumes we want to convert the object to utf8.
    // We can make it convert to other formats by passing the encoding type to toString().
    return buffer.toString('base64');
}

const decodeFromBase64 = string => {
    //const buffer = new Buffer('SmF2YVNjcmlwdA==', 'base64')
    const buffer = Buffer.from(string, 'base64')
    return buffer.toString();
}

export { encodeToBase64, decodeFromBase64 }
