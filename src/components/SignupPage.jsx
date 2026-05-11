import React, { useState } from 'react';
import { Input, OtpInputGroup, PasswordInput } from './ui/Input';
import { Button, SegmentButton } from './ui/Button';

export default function SignupPage() {
  const [authType, setAuthType] = useState("signup");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (pass) => {
    if (pass.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(pass)) return "رمز عبور باید شامل اعداد و حروف باشد.";
    if (!/(?=.*[@!#%&_])/.test(pass)) return "رمز عبور باید حداقل یک کاراکتر ویژه داشته باشد (@, !, ...).";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    setPasswordError("");
    alert("ثبت نام با موفقیت انجام شد.");
    // Proceed with submission logic (API calls will be added here)
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert("ورود با موفقیت انجام شد.");
    // Proceed with login logic
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4 font-sans"
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
                شماره تماس خود را وارد کنید:
              </label>
              <Input
                variant="grayLarge"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#24344c] font-medium mr-1">
                رمز ورود به کلاس را وارد کنید:
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
                <li>شامل اعداد و حروف باشد</li>
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
                <button type="button" className="text-[12px] text-[#6f82b1] font-medium hover:underline">
                  ارسال کد تایید
                </button>
              </div>
              <div dir="ltr">
                <OtpInputGroup
                  length={6}
                  values={otpValues}
                  onChange={setOtpValues}
                />
              </div>
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
                شماره تماس خود را وارد کنید:
              </label>
              <Input
                variant="grayLarge"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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

            <div className="flex flex-col items-center mt-6 gap-3">
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
