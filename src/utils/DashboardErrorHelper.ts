import { AxiosError } from "axios";

export const getDashboardErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (!err.response) {
    return "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.";
  }

  const { status, data } = err.response;

  if (status === 401) {
    if (data?.detail === "Authentication credentials were not provided.") {
      return "لطفاً مجدداً وارد حساب خود شوید.";
    }
    return "شما دسترسی لازم برای مشاهده این صفحه را ندارید.";
  }

  if (status >= 500) {
    return "خطای سرور در پردازش داده‌های داشبورد. لطفاً کمی بعد تلاش کنید.";
  }

  return "خطای غیرمنتظره‌ای در بارگذاری اطلاعات داشبورد رخ داد.";
};

export const getLogoutErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (!err.response) {
    return "خطا در ارتباط با سرور هنگام خروج.";
  }

  const { status, data } = err.response;

  if (status === 400) {
    if (Array.isArray(data?.refresh) && data.refresh.includes("This field is required.")) {
      return "نشست کاربری شما منقضی یا نامعتبر شده است.";
    }
    if (
      Array.isArray(data?.refresh) &&
      (data.refresh.includes("Invalid token.") || data.refresh.includes("Token is invalid or expired."))
    ) {
      return "نشست کاربری شما منقضی یا نامعتبر شده است.";
    }
    if (Array.isArray(data?.non_field_errors)) {
      return data.non_field_errors[0] || "خطا در اعتبارسنجی درخواست خروج.";
    }
    return "درخواست خروج از حساب نامعتبر است.";
  }

  if (status === 401 || status === 403) {
    return "خطا در اعتبارسنجی درخواست خروج.";
  }

  if (status >= 500) {
    return "خطای سرور در عملیات خروج از حساب. لطفاً مجدداً تلاش کنید.";
  }

  return "خطای غیرمنتظره‌ای هنگام خروج رخ داد.";
};

export const getProfileUpdateErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<any>;

  if (!err.response) {
    return "خطا در ارتباط با سرور. لطفاً وضعیت اینترنت خود را بررسی کنید.";
  }

  const { status, data } = err.response;

  if (status === 401) {
    return "نشست شما منقضی شده است. لطفاً مجدداً وارد سایت شوید.";
  }
  if (status === 403) {
    return "شما مجوز لازم برای انجام این عملیات را ندارید.";
  }

  if (status === 415) {
    return "فرمت ارسال اطلاعات نامعتبر است.";
  }

  if (status === 413) {
    return "حجم عکس انتخاب شده خیلی زیاد است. لطفاً فایل کوچک‌تری انتخاب کنید.";
  }

  if (status === 400 && data) {
    if (data.avatar) {
      return "فایل بارگذاری شده معتبر نیست. لطفاً یک تصویر سالم و بدون خرابی انتخاب کنید.";
    }
    if (data.student_id) {
      return "شماره دانشجویی وارد شده معتبر نیست.";
    }
    if (data.full_name) {
      return "نام و نام خانوادگی نمی‌تواند خالی بماند.";
    }
    if (data.non_field_errors) {
      return data.non_field_errors[0] || "اطلاعات وارد شده مورد تایید سرور نیست.";
    }
    
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) {
      return `${data[firstKey][0]}`;
    }
  }

  if (status >= 500) {
    return "خطایی در دیتابیس یا سرور رخ داده است. لطفاً بعداً مجدداً تلاش کنید.";
  }

  return "خطای غیرمنتظره‌ای در ثبت اطلاعات پروفایل رخ داد.";
};