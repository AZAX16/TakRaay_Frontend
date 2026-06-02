import { useState, useEffect } from "react";
import Modal from "../modals/NormalModal";
import { OtpInputGroup, PasswordInput } from "../ui-kit/Input";
import { Button } from "../ui-kit/Button";
import apiClient from "../../services/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  showError?: (message: string) => void;
};

type Step = "otp" | "password" | "success";

export default function ChangePasswordModal({ isOpen, onClose, showError }: Props) {
  const [step, setStep] = useState<Step>("otp");

  const [userPhone, setUserPhone] = useState<string>("");
  
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpSendMessage, setOtpSendMessage] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const OTP_EXPIRE_TIME = 6 * 60;
  const [resendTimer, setResendTimer] = useState<number>(0);

  const normalizeDigits = (value: string): string => {
    if (!value) return "";
    return value
      .toString()
      .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
      .replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const validatePassword = (pass: string): string => {
    if (pass.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(pass)) return "رمز عبور باید شامل اعداد و حروف و حداقل یک حرف بزرگ باشد.";
    if (!/(?=.*[@!#%&_])/.test(pass)) return "رمز باید حداقل یک کاراکتر ویژه داشته باشد (@, !, ...)";
    return "";
  };

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

    // هندلر ارسال/ارسال مجدد کد (جایگاه اتصال به API)
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setOtpSendMessage("");
    setOtpError("");

    try {
      const response = await apiClient.post("/auth/change-password/request-otp/");
      
      if (response.data && response.data.phone) {
        setUserPhone(response.data.phone);
      }
      
      setOtpSendMessage("کد تایید به شماره شما ارسال شد.");
      console.log("OTP sent request triggered");
      setStep("otp");
      setResendTimer(OTP_EXPIRE_TIME);
    } catch (error) {
      if (showError) showError(error.response?.data?.message || "خطا در ارسال کد تایید");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ارسال خودکار OTP هنگام باز شدن مودال
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSendOtp();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  // هندلر بررسی کد تایید (جایگاه اتصال به API)
  const verifyOtp = async () => {
    const otp = normalizeDigits(otpValues.join(""));

    if (otp.length !== 6) {
      setOtpError("کد تایید باید ۶ رقم باشد");
      return;
    }

    if (!userPhone) {
      setOtpError("شماره موبایل یافت نشد.");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      await apiClient.post("/auth/password/verify-otp/", {
        phone: userPhone,
        otp: otp,
      });

      console.log("OTP Verified");
      setStep("password");
    } catch (error: unknown) {
      setOtpError(error.response?.data?.detail || "کد وارد شده صحیح نیست.");
      console.log(userPhone);
    } finally {
      setLoading(false);
    }
  };

  // هندلر ثبت رمز جدید (جایگاه اتصال به API)
  const handleChangePassword = async () => {
    const err = validatePassword(password);
    if (err) {
      setPasswordError(err);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    if (!userPhone) {
      if (showError) showError("شماره موبایل یافت نشد.");
      return;
    }

    setLoading(true);
    setPasswordError("");

    try {
      await apiClient.post("/auth/password/reset/", {
        phone: userPhone,
        password: password,
        password_confirm: confirmPassword,
      });

      setStep("success");
    } catch (error: unknown) {
      if (showError) showError(error.response?.data?.detail || error.response?.data?.password?.[0] || "خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("otp");
    setOtpValues(["", "", "", "", "", ""]);
    setPassword("");
    setConfirmPassword("");
    setResendTimer(0);
    setOtpError("");
    setPasswordError("");
    setUserPhone(""); 
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تغییر رمز عبور">
      {step === "otp" && (
        <div className="flex flex-col gap-2 mt-2 items-center">
          <div className="flex justify-between w-full items-center">
            <label className="text-[14px] text-[#000000] font-medium">
              کد تایید:
            </label>
            <button
              type="button"
              className={`text-[12px] font-medium 
                          ${resendTimer > 0 || isSendingOtp ? "text-gray-400 cursor-not-allowed" : "text-[#4eacb7] hover:underline"}
                          `}
              disabled={isSendingOtp || resendTimer > 0}
              onClick={handleSendOtp}
            >
              {isSendingOtp
                ? "درحال ارسال"
                : resendTimer > 0
                ? `ارسال مجدد کد تایید (${formatTime(resendTimer)})`
                : "ارسال کد تایید"}
            </button>
          </div>

          <div dir="ltr">
            <OtpInputGroup
              length={6}
              values={otpValues}
              onChange={(values: string[]) => {
                setOtpValues(values);
                setOtpError("");
              }}
            />
          </div>

          {otpSendMessage && (
            <p className="text-[12px] mt-1 font-medium text-[#f3c8c7]">
              {otpSendMessage}
            </p>
          )}
          {otpError && (
            <p className="text-[#e0786c] text-[12px] font-medium mr-1">
              {otpError}
            </p>
          )}

          <Button variant="pillDark" onClick={verifyOtp}>
            {loading ? "در حال بررسی..." : "تایید کد"}
          </Button>
        </div>
      )}

      {step === "password" && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#000000] font-medium mr-1">
              رمز جدید را تعیین کنید:
            </label>

            <PasswordInput
              value={password}
              placeholder=""
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
          </div>

          <label className="text-sm">تکرار رمز جدید</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
              setPasswordError("");
            }}
          />

          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          <Button variant="pillDark" onClick={handleChangePassword}>
            {loading ? "در حال ثبت..." : "ثبت رمز جدید"}
          </Button>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-medium">رمز عبور با موفقیت تغییر کرد</p>

          <Button variant="pillDark" onClick={handleClose}>
            بستن
          </Button>
        </div>
      )}
    </Modal>
  );
}
