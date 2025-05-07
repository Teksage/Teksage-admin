  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  export const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^\+?[1-9][0-9]{7,14}$/;
    return mobileRegex.test(mobile);
  };