import bcrypt from 'bcrypt';

const saltRounds = 10;

const encrypt = async (plainText: string): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainText, salt);
    return hashedPassword;
};

const compare = async (originalString: string, hashedString: string): Promise<boolean> => {
    return await bcrypt.compare(originalString, hashedString);
};

export { encrypt, compare };

