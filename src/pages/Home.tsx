// src/pages/Home.tsx
import { useState } from "react";
import { Button, SegmentButton, ToggleSwitch } from "../components/ui-kit/Button";
import {
  Input,
  OtpInputGroup,
  TextArea,
  SearchInput,
  SearchKeyboardInput,
  PasswordInput,
  KeyboardInput,
} from "../components/ui-kit/Input";
import "../App.css";

export default function Home() {
  const [authType, setAuthType] = useState("signup");
  const [loginType, setLoginType] = useState("student");
  const [isEnabled, setIsEnabled] = useState(true);

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [grayMessage, setGrayMessage] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const [searchValue, setSearchValue] = useState("");
  const [keyboardSearchValue, setKeyboardSearchValue] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardSmall, setKeyboardSmall] = useState("");
  const [keyboardLarge, setKeyboardLarge] = useState("");

  return (
    <main className="app p-10 space-y-10" dir="rtl">
      <h1 className="text-3xl font-bold">UI Kit Demo</h1>

      {/* Buttons */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button variant="whiteSmall">لغو</Button>
          <Button variant="primaryLarge">تغییر رمز</Button>
          <Button variant="pillDark">ثبت نام</Button>
          <Button variant="pillGold">متوجه شدم</Button>

          <Button variant="rectPlus">ارسال</Button>
          <Button variant="circleCloseDark">×</Button>
          <Button variant="circleCloseLight">
            <span className="leading-none">×</span>
          </Button>
          <Button variant="circlePlusSmall">+</Button>
          <Button variant="doubleCircle"></Button>
          <Button variant="squarePlus">+</Button>
          <Button variant="doubleCircleSearch" aria-label="search" />
        </div>
      </section>

      {/* Segment Buttons */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Segment Buttons</h2>
        <div className="flex flex-col gap-4">
          <SegmentButton
            variant="small"
            value={authType}
            onChange={setAuthType}
            options={[
              { label: "ثبت نام", value: "signup" },
              { label: "ورود", value: "login" },
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
      </section>

      {/* Toggle Switch */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Toggle Switch</h2>
        <ToggleSwitch
          checked={isEnabled}
          onChange={setIsEnabled}
          aria-label="Enable"
        />
      </section>

      {/* Inputs */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Inputs</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Input
            variant="grayLarge"
            placeholder="نام و نام خانوادگی"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            variant="whiteMedium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            variant="blueMedium"
            placeholder="کد"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </section>

      {/* OTP Inputs */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Code Input</h2>
        <div className="space-y-2">
          <OtpInputGroup
            length={6}
            values={otpValues}
            onChange={setOtpValues}
          />
          <p className="text-sm text-gray-600">
          </p>
        </div>
      </section>

      {/* TextArea */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Textarea</h2>
        <div className="flex flex-wrap gap-4">
          <TextArea
            variant="blueLarge"
            placeholder="متن خود را وارد کنید..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <TextArea
            variant="grayTall"
            placeholder="متن خود را وارد کنید..."
            value={grayMessage}
            onChange={(e) => setGrayMessage(e.target.value)}
          />
        </div>
      </section>

      {/* Advanced Inputs */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Advanced Inputs</h2>
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="جستجو"
          />

          <SearchKeyboardInput
            value={keyboardSearchValue}
            onChange={(e) => setKeyboardSearchValue(e.target.value)}
            placeholder="جستجو"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
          />

          <KeyboardInput
            variant="small"
            value={keyboardSmall}
            onChange={(e) => setKeyboardSmall(e.target.value)}
            placeholder="متن را وارد کنید"
          />

          <KeyboardInput
            variant="large"
            value={keyboardLarge}
            onChange={(e) => setKeyboardLarge(e.target.value)}
            placeholder="متن بزرگ‌تر را وارد کنید"
          />
        </div>
      </section>
    </main>
  );
}
