import React, { useState } from 'react';
import { Input, OtpInputGroup, PasswordInput } from './ui/Input';
import { Button, SegmentButton } from './ui/Button';

export default function SignupPage() {
  const [authType, setAuthType] = useState("signup");
  const [loginType, setLoginType] = useState("student");
  const [phoneOrStudentId, setPhoneOrStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const getIdentifierPlaceholder = () => {
    return loginType === "student" ? "شماره دانشجویی خود را وارد کنید:" : "شماره تماس خود را وارد کنید:";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    alert("ثبت نام با موفقیت انجام شد.");
    // Proceed with submission logic
  };

  return (
    <div
      className="min-h-screen w-full bg-[url('/background.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="w-[450px] min-h-[600px] bg-white rounded-[20px] shadow-lg flex flex-col items-center py-8 px-6">

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

          <SegmentButton
            variant="large"
            value={loginType}
            onChange={setLoginType}
            options={[
              { label: "شماره تماس", value: "phone" },
              { label: "شماره دانشجویی", value: "student" },
            ]}
          />
        </div>

        {/* Form Stack */}
        <form className="flex flex-col w-full max-w-[300px] gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#24344c] font-medium mr-1">
              {getIdentifierPlaceholder()}
            </label>
            <Input
              variant="grayLarge"
              type={loginType === "phone" ? "tel" : "text"}
              value={phoneOrStudentId}
              onChange={(e) => setPhoneOrStudentId(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#24344c] font-medium mr-1">
              رمز ورود به کلاس را وارد کنید:
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#24344c] font-medium mr-1">
              تکرار رمز عبور:
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 items-center">
            <label className="text-[14px] text-[#24344c] font-medium">
              کد تایید:
            </label>
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
            <a href="#" className="text-[12px] text-[#24344c] font-medium hover:underline">
              حساب کاربری دارید؟ ورود
            </a>
          </div>
        </form>

      </div>
    </div>
  );
}
