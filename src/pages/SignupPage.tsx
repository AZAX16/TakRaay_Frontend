import { useState, useEffect } from 'react';
import type React from "react";
import { Input, OtpInputGroup, PasswordInput } from '../components/ui-kit/Input';
import { Button, SegmentButton } from '../components/ui-kit/Button';
// import Checkbox from "../components/CheckBox";
import api from '../services/api';
import ForgotPasswordModal from "../components/forgot-password/ForgotPasswordModal";
import {getSignupErrorMessage, getLoginErrorMessage} from '../utils/SignupApiErrors';
import ErrorModal from '../components/modals/ErrorModal';


export default function SignupPage() {
  const [authType, setAuthType] = useState<"signup" | "login">("signup");
  
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpSendMessage, setOtpSendMessage] = useState<string>("");
  
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  // const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  const [loading, setLoading] = useState(false);

  const OTP_EXPIRE_TIME = 6 * 60;
  const [resendTimer, setResendTimer] = useState<number>(0);

  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const showError = (message: string) => {
    setErrorModal({
      open: true,
      message,
    });
  };

  const closeErrorModal = () => {
    setErrorModal({ open: false, message: "" });
  };



  const normalizeDigits = (value: string): string => {
    if (!value) return "";
    return value
      .toString()
      .replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
      .replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };
    
  const validatePhone = (phone: string): string => {
    if (!phone) return "شماره موبایل الزامی است";
    const normalizedPhone = normalizeDigits(phone);
    if (!/^09\d{9}$/.test(normalizedPhone)) {
      return "شماره موبایل معتبر نیست";
    }
    return "";
  };

  const validatePassword = (pass: string): string => {
    if (pass.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(pass)) return "رمز عبور باید شامل اعداد و حروف و حداقل یک حرف بزرگ باشد.";
    if (!/(?=.*[@!#%&_])/.test(pass)) return "رمز عبور باید حداقل یک کاراکتر ویژه داشته باشد (@, !, ...)";
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


  const handleSendOtp = async () => {
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    const normalizedPhone = normalizeDigits(phone);

    setIsSendingOtp(true);
    setOtpSendMessage("");
    setOtpError("");

    try {
      const response = await api.post("/auth/send-otp/", {
        phone: normalizedPhone,
      });
      console.log("OTP sent:", response.data);
      setOtpSendMessage("کد تایید برای شما ارسال شد ");
      setResendTimer(OTP_EXPIRE_TIME);
    } catch {
      setOtpSendMessage("خطا در ارسال کد تایید");
    } finally {
      setIsSendingOtp(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    const normalizedPhone = normalizeDigits(phone);
    const normalizedOtp = normalizeDigits(otpValues.join(""));

    if (normalizedOtp.length !== 6) {
    setOtpError("کد تایید باید ۶ رقم باشد.");
    return;
    }


    setPasswordError("");
    setOtpError("");
    setPhoneError("");
    setLoading(true);

    try {
    // Send register request
    const response = await api.post("/auth/register/", {
      phone: normalizedPhone,
      otp: normalizedOtp,
      password: password,
      confirm_password: confirmPassword,
    });

    console.log("Success:", response.data);

    alert("ثبت نام با موفقیت انجام شد.");

    } catch (error: unknown) {
      showError(getSignupErrorMessage(error))
    } finally{
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // validate phone
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    // validate password
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }
    const normalizedPhone = normalizeDigits(phone);

    setPhoneError("");
    setLoading(true);

    try {
      // 3) Send request to backend
      const response = await api.post("/auth/login/", {
        phone: normalizedPhone,
        password: password,
      });

      console.log("Success:", response.data);

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
      }
      else{
        showError("خطا در ورود")
      }

      alert("ورود با موفقیت انجام شد.");

    } catch (error: unknown) {
      showError(getLoginErrorMessage(error))
    }
    finally {
      setLoading(false);
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = normalizeDigits(value); 
    value = value.replace(/\D/g, '');

    if (value.length <= 11) {
      setPhone(value);
    }
  };


  return (
    <div
      className="min-h-screen w-full bg-[url('/images/background3.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-md min-h-[500px] bg-white rounded-[20px] shadow-lg flex flex-col items-center py-8 px-6">

        {/* Toggles */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <SegmentButton
            variant="small"
            value={authType}
            onChange={setAuthType as (value: string) => void}
            options={[
              { label: "ورود", value: "login" },
              { label: "ثبت نام", value: "signup" },
            ]}
          />
        </div>

        {/* Form Stack */}
        {authType === "signup" ? (
          <form className="flex flex-col w-full max-w-[300px] gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#000000] font-medium mr-1">
                شماره موبایل خود را وارد کنید:
              </label>
              <Input
                variant="grayLarge"
                type="tel"
                value={phone}
                placeholder='۰۹۱۲۳۴۵۶۷۸۹'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePhoneChange(e);
                  setPhoneError("");
                }}
              />
              {phoneError && (
                <p className="text-[#e0786c] text-[12px] font-medium mr-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#000000] font-medium mr-1">
                رمز عبور خود را تعیین کنید:
              </label>
              <PasswordInput
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder=""
              />
            </div>

            <div className="flex flex-col gap-1 text-[12px] text-[#24344c] mt-1 mr-1 font-medium">
              <span>رمز ورود باید:</span>
              <ul className="list-disc list-inside">
                <li>حداقل ۸ کاراکتر باشد</li>
                <li>شامل اعداد و حروف و حداقل یک حرف بزرگ باشد</li>
                <li>حداقل یک کاراکتر ویژه داشته باشد (@, !, ...)</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#000000] font-medium mr-1">
                تکرار رمز عبور:
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder=""
              />
            </div>

            {passwordError && (
              <p className="text-[#e0786c] text-[12px] font-medium mr-1">{passwordError}</p>
            )}

            <div className="flex flex-col gap-2 mt-2 items-center">
              <div className="flex justify-between w-full items-center">
                <label className="text-[14px] text-[#000000] font-medium">
                  کد تایید:
                </label>
                <button type="button" 
                        className={`text-[12px] font-medium 
                                    ${resendTimer > 0 || isSendingOtp ? "text-gray-400 cursor-not-allowed" : "text-[#4eacb7] hover:underline"}
                                  `}
                        disabled={isSendingOtp || resendTimer > 0}
                        onClick={handleSendOtp}>
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

            </div>

            <div className="flex flex-col items-center mt-6 gap-3">
              <Button variant="pillDark" type="submit">
                {loading? "درحال ثبت..." : "ثبت نام"}
              </Button>
              <button
                type="button"
                onClick={() => setAuthType("login")}
                className="text-[12px] text-[#387fa3] font-medium hover:underline"
              >
                حساب کاربری دارید؟ ورود
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col w-full max-w-[300px] gap-4" onSubmit={handleLoginSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#000000] font-medium mr-1">
                شماره موبایل:
              </label>
              <Input
                variant="grayLarge"
                type="tel"
                value={phone}
                placeholder='۰۹۱۲۳۴۵۶۷۸۹'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePhoneChange(e);
                  setPhoneError("");
                }}
              />
              {phoneError && (
                <p className="text-[#e0786c] text-[12px] font-medium mr-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#000000] font-medium mr-1">
                رمز عبور:
              </label>
              <PasswordInput
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setPasswordError("");}}
                placeholder=""
              />
            </div>
            
            {passwordError && (
              <p className="text-[#e0786c] text-[12px] font-medium mr-1">{passwordError}</p>
            )}

            <div className="flex flex-col mt-2 gap-3">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="block ml-auto text-[14px] text-[#4eacb7] font-medium hover:underline"
              >
                فراموشی رمز عبور
              </button>

              {/* <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="مرا به خاطر بسپار"
                className="block ml-auto"
              /> */}
            </div>

            <div className="flex flex-col items-center mt-4 gap-3">
              <Button variant="pillDark" type="submit">
                {loading? "درحال ورود..." : "ورود"}
              </Button>
              <button
                type="button"
                onClick={() => setAuthType("signup")}
                className="text-[12px] text-[#387fa3] font-medium hover:underline"
              >
                حساب کاربری ندارید؟ ثبت نام
              </button>
            </div>
          </form>
        )}

      </div>
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        showError={showError}
      />
      <ErrorModal
        isOpen={errorModal.open}
        message={errorModal.message}
        onClose={closeErrorModal}
      />
    </div>
  );
}
