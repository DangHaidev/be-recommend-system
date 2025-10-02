import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPasswordhelper = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.log(error);
    }
};
