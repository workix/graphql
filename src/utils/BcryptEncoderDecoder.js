const bcrypt = require('bcrypt');
const saltRounds = 10;

const encrypt = string => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(string, salt);
    return hashedPassword;
}

const compare = (originalString, hashedString) => {
    return bcrypt.compareSync(originalString, hashedString)
}

export { encrypt, compare }
