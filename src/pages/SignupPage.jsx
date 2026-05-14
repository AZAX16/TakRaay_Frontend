import { useState } from 'react';
import { Input, OtpInputGroup, PasswordInput } from '../components/ui/Input';
import { Button, SegmentButton } from '../components/ui/Button';
// import Checkbox from "../components/CheckBox";
import api from '../services/api';


export default function SignupPage() {
  const [authType, setAuthType] = useState("signup");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (pass) => {
    if (pass.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(pass)) return "رمز عبور باید شامل اعداد و حروف و حداقل یک حرف بزرگ باشد.";
    if (!/(?=.*[@!#%&_])/.test(pass)) return "رمز عبور باید حداقل یک کاراکتر ویژه داشته باشد (@, !, ...).";
    return "";
  };

  const normalizeDigits = (value) => {
    if (!value) return "";

    return value
      .toString()
      .replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
      .replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };


  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone) => {
    if (!phone) return "شماره موبایل الزامی است";

    const normalizedPhone = normalizeDigits(phone);

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      return "شماره موبایل معتبر نیست";
    }

    return "";
  };

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSendMessage, setOtpSendMessage] = useState("");


  const handleSendOtp = async () => {
    // validate phone first
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
    } catch (error) {
      console.error("Send OTP error:", error.response?.data || error.message);

      setOtpSendMessage("خطا در ارسال کد تایید");
    } finally {
      setIsSendingOtp(false);
    }
  };


  const handleSubmit = async (e) => {
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

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("خطا در ارتباط با سرور");
      }
    }
  };

  const handleLoginSubmit = async (e) => {
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

    try {
      // 3) Send request to backend
      const response = await api.post("/auth/login/", {
        phone: normalizedPhone,
        password: password,
      });

      console.log("Success:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      alert("ورود با موفقیت انجام شد.");

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("خطا در ارتباط با سرور");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[url('/images/background.jpg')] flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="w-[450px] min-h-[500px] bg-white rounded-[20px] shadow-lg flex flex-col items-center py-8 px-6">

        {/* Toggles */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <SegmentButton
            variant="small"
            value={authType}
            onChange={setAuthType}
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
              <label className="text-[14px] text-[#24344c] font-medium mr-1">
                شماره موبایل خود را وارد کنید:
              </label>
              <Input
                variant="grayLarge"
                type="tel"
                value={phone}
                placeholder='۰۹۱۲۳۴۵۶۷۸۹'
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneError && (
                <p className="text-red-500 text-[12px] font-medium mr-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#24344c] font-medium mr-1">
                رمز عبور خود را تعیین کنید:
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder=""
              />
            </div>

            <div className="flex flex-col gap-1 text-[12px] text-[#5f7480] mt-1 mr-1 font-medium">
              <span>رمز ورود باید:</span>
              <ul className="list-disc list-inside">
                <li>حداقل ۸ کاراکتر باشد</li>
                <li>شامل اعداد و حروف و خداقل یک حرف بزرگ باشد</li>
                <li>حداقل یک کاراکتر ویژه داشته باشد (@, !, ...)</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#24344c] font-medium mr-1">
                تکرار رمز عبور:
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder=""
              />
            </div>

            {passwordError && (
              <p className="text-red-500 text-[12px] font-medium mr-1">{passwordError}</p>
            )}

            <div className="flex flex-col gap-2 mt-2 items-center">
              <div className="flex justify-between w-full items-center">
                <label className="text-[14px] text-[#24344c] font-medium">
                  کد تایید:
                </label>
                <button type="button" 
                        className="text-[12px] text-[#6f82b1] font-medium hover:underline"
                        disabled={isSendingOtp}
                        onClick={handleSendOtp}>
                  {isSendingOtp? "درحال ارسال" : "ارسال کد تایید"}
                </button>
              </div>
              <div dir="ltr">
                <OtpInputGroup
                  length={6}
                  values={otpValues}
                  onChange={(values) => {
                              setOtpValues(values);
                              setOtpError("");
                            }}
                />
              </div>
              {otpSendMessage && (
                <p className="text-[12px] mt-1 font-medium text-[#6f82b1]">
                  {otpSendMessage}
                </p>
              )}
              {otpError && (
                <p className="text-red-500 text-[12px] font-medium mr-1">
                  {otpError}
                </p>
              )}

            </div>

            <div className="flex flex-col items-center mt-6 gap-3">
              <Button variant="pillDark" type="submit">
                ثبت نام
              </Button>
              <button
                type="button"
                onClick={() => setAuthType("login")}
                className="text-[12px] text-[#24344c] font-medium hover:underline"
              >
                حساب کاربری دارید؟ ورود
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col w-full max-w-[300px] gap-4" onSubmit={handleLoginSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#24344c] font-medium mr-1">
                شماره موبایل:
              </label>
              <Input
                variant="grayLarge"
                type="tel"
                value={phone}
                placeholder='۰۹۱۲۳۴۵۶۷۸۹'
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneError && (
                <p className="text-red-500 text-[12px] font-medium mr-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#24344c] font-medium mr-1">
                رمز عبور:
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="flex flex-col mt-2 gap-3">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="block ml-auto text-[14px] text-[#cdb190] font-medium hover:underline"
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
                ورود
              </Button>
              <button
                type="button"
                onClick={() => setAuthType("signup")}
                className="text-[12px] text-[#24344c] font-medium hover:underline"
              >
                حساب کاربری ندارید؟ ثبت نام
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
