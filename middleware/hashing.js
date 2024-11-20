import bcrypt from "bcrypt";
const saltRounds = 10;

export const passwordHash = async (data) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(data, salt);
        return hash;
    } catch (error) {
        return false;
    }
};

export const passwordCompare = async (data, hash) => {
    try {
        const matchedPassword = await bcrypt.compare(data, hash);
        return matchedPassword;
    } catch (error) {
        return false;
    }
};

