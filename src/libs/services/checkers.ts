export const checkEmail = (email: string): boolean => {
    const emailPrepared = email.trim();
    const reg = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

    return reg.test(emailPrepared);
}

export const checkPasswordLength = (password: string): boolean => {
    const passwordPrepared = password.trim().replace(/^[^а-яёa-z0-9]/i, "");
    const validatePassword = passwordPrepared.length > 7 && passwordPrepared.length < 33 ? true : false;

    return validatePassword;
}

export const passwordEntryVerification = (e: string, setChange: React.Dispatch<React.SetStateAction<string>>): void => {
    const symbol = e.replace(/[^а-яёa-z0-9]/i, "");
    setChange(symbol);
}