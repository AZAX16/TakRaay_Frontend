import { AxiosError } from "axios";

export const getSignupErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  // Network / Unknown error
  if (!err.response) {
    return "خطا در ارتباط با سرور";
  }

  const { status, data } = err.response;

  // Signup business errors
  if (status === 400) {
    // -------------------
    // OTP errors
    // -------------------
    if (data?.otp) {
      switch (data.otp) {
        case "OTP not found":
          return "کد تأیید پیدا نشد. لطفاً مجدداً کد را دریافت کنید.";

        case "OTP already used":
          return "این کد تأیید قبلاً استفاده شده است.";

        case "OTP expired":
          return "کد تأیید منقضی شده است. لطفاً کد جدید دریافت کنید.";

        case "Invalid OTP":
          return "کد تأیید وارد شده نادرست است.";

        default:
          return "خطا در اعتبارسنجی کد تأیید.";
      }
    }

    // -------------------
    // Confirm password mismatch
    // -------------------
    if (data?.confirm_password === "Passwords do not match.") {
      return "رمز عبور و تکرار آن یکسان نیستند.";
    }

    // -------------------
    // Weak password
    // -------------------
    if (
      Array.isArray(data?.password) &&
      data.password[0]?.includes("Password must contain")
    ) {
      return "رمز عبور ضعیف است. لطفاً شرایط امنیتی رمز عبور را رعایت کنید.";
    }

    // -------------------
    // Phone errors
    // -------------------
    if (Array.isArray(data?.phone)) {
      if (
        data.phone.includes("user with this phone already exists.")
      ) {
        return "این شماره موبایل قبلاً ثبت شده است.";
      }

      if (
        data.phone.includes(
          "Phone number must be an 11-digit Iranian phone number starting with 09"
        )
      ) {
        return "شماره موبایل وارد شده معتبر نیست.";
      }
    }

    // -------------------
    // Fallback for 400
    // -------------------
    return "اطلاعات ثبت‌نام معتبر نیست.";
  }

  // Server errors
  if (status >= 500) {
    return "خطای سرور هنگام ثبت‌نام. لطفاً بعداً تلاش کنید.";
  }

  // Final fallback
  return "خطای غیرمنتظره‌ای رخ داد.";
};


export const getLoginErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  // network error
  if (!err.response) {
    return "خطا در ارتباط با سرور";
  }

  const { status, data } = err.response;

  if (status === 400) {
    // -------------------
    // non_field_errors
    // -------------------
    if (Array.isArray(data?.non_field_errors)) {
      const message = data.non_field_errors[0];

      switch (message) {
        case "Both phone and password are required.":
          return "شماره موبایل و رمز عبور الزامی هستند.";

        case "Invalid phone number or password.":
          return "شماره موبایل یا رمز عبور اشتباه است.";

        case "User account is disabled.":
          return "هیچ حساب کاربر با این شماره موبایل وجود ندارد.";

        default:
          return "اطلاعات ورود معتبر نیست.";
      }
    }

    // -------------------
    // phone validation
    // -------------------
    if (Array.isArray(data?.phone)) {
      if (data.phone.includes("This field is required.")) {
        return "وارد کردن شماره موبایل الزامی است.";
      }
    }

    // -------------------
    // password validation
    // -------------------
    if (Array.isArray(data?.password)) {
      if (data.password.includes("This field is required.")) {
        return "وارد کردن رمز عبور الزامی است.";
      }
    }

    return "اطلاعات ورود معتبر نیست.";
  }

  if (status >= 500) {
    return "خطای سرور هنگام ورود. لطفاً بعداً دوباره تلاش کنید.";
  }

  return "خطای غیرمنتظره‌ای رخ داد.";
};

export const getForgotPasswordSendOtpErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (!err.response) {
    return "خطا در ارتباط با سرور";
  }

  const { status, data } = err.response;

  if (status === 400) {
    if (Array.isArray(data?.phone)) {
      if (
        data.phone.includes(
          "Phone number must be an 11-digit Iranian phone number starting with 09"
        )
      ) {
        return "شماره موبایل وارد شده معتبر نیست.";
      }

      if (data.phone.includes("User with this phone does not exist.")) {
        return "هیچ حساب کاربری با این شماره موبایل وجود ندارد.";
      }
    }

    return "اطلاعات وارد شده معتبر نیست.";
  }

  if (status === 502) {
    if (
      data?.message ===
      "There was a problem sending the OTP SMS. Please try again later."
    ) {
      return "ارسال پیامک با مشکل مواجه شد. لطفاً کمی بعد دوباره تلاش کنید.";
    }

    return "خطا در ارسال کد تأیید.";
  }

  if (status >= 500) {
    return "خطای سرور. لطفاً بعداً دوباره تلاش کنید.";
  }

  return "خطای غیرمنتظره‌ای رخ داد.";
};

export const getVerifyResetOtpErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (!err.response) {
    return "خطا در ارتباط با سرور";
  }

  const { status, data } = err.response;

  if (status === 400) {
    if (
      data?.message === "OTP not found"
    ) {
      return "کد تأیید پیدا نشد. لطفاً مجدداً کد دریافت کنید.";
    }

    if (
      data?.message === "OTP already used"
    ) {
      return "این کد تأیید قبلاً استفاده شده است.";
    }

    if (
      data?.message === "OTP expired"
    ) {
      return "کد تأیید منقضی شده است. لطفاً کد جدید دریافت کنید.";
    }

    if (
      data?.message === "Invalid OTP"
    ) {
      return "کد تأیید وارد شده نادرست است.";
    }

    if (Array.isArray(data?.phone)) {
      if (
        data.phone.includes(
          "Phone number must be an 11-digit Iranian phone number starting with 09"
        )
      ) {
        return "شماره موبایل معتبر نیست.";
      }
    }

    return "خطا در تأیید کد.";
  }

  if (status >= 500) {
    return "خطای سرور هنگام تأیید کد.";
  }

  return "خطای غیرمنتظره‌ای رخ داد.";
};


export const getResetPasswordErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (!err.response) {
    return "خطا در ارتباط با سرور";
  }

  const { status, data } = err.response;

  if (status === 400) {
    if (data?.message === "Verified OTP not found.") {
      return "کد تأیید معتبر پیدا نشد. لطفاً دوباره فرآیند بازیابی رمز را انجام دهید.";
    }

    if (data?.message === "Verified OTP expired.") {
      return "مهلت استفاده از کد تأیید به پایان رسیده است. لطفاً دوباره کد دریافت کنید.";
    }

    if (data?.password_confirm === "Passwords do not match.") {
      return "رمز عبور و تکرار آن یکسان نیستند.";
    }

    if (data?.phone === "User with this phone does not exist.") {
      return "کاربری با این شماره موبایل وجود ندارد.";
    }

    if (Array.isArray(data?.phone)) {
      if (
        data.phone.includes(
          "Phone number must be an 11-digit Iranian phone number starting with 09"
        )
      ) {
        return "شماره موبایل معتبر نیست.";
      }
    }

    return "اطلاعات وارد شده معتبر نیست.";
  }

  if (status >= 500) {
    return "خطای سرور هنگام تغییر رمز عبور.";
  }

  return "خطای غیرمنتظره‌ای رخ داد.";
};
