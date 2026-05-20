import { useState, type ChangeEvent } from "react";
import {
  Button,
  SegmentButton,
  ToggleSwitch,
} from "../components/ui-kit/Button";
import {
  Input,
  TextArea,
  SearchInput,
  SearchKeyboardInput,
  PasswordInput,
  OtpInputGroup,
} from "../components/ui-kit/Input";

const TestUiPage = () => {
  const [segmentValue, setSegmentValue] = useState("personal");
  const [toggleChecked, setToggleChecked] = useState(false);

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [keyboardSearch, setKeyboardSearch] = useState("");
  const [password, setPassword] = useState("");

  const [description, setDescription] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>([]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleKeyboardSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyboardSearch(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };



  const handleDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(event.target.value);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F3F6F8] px-8 py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#24344c]">
            صفحه تست کامپوننت‌ها
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            تست Button، Input، TextArea، Toggle، Segment و OTP
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#24344c]">Button ها</h2>

          <div className="flex flex-wrap items-center gap-5">
            <Button variant="whiteSmall">انصراف</Button>

            <Button variant="primaryLarge">ثبت</Button>

            <Button variant="pillDark">ورود</Button>

            <Button variant="circlePlusSmall">+</Button>

            <Button variant="circleCloseDark" aria-label="close dark" />

            <Button variant="circleCloseLight" aria-label="close light" />

            <Button variant="doubleCircle">۱۲</Button>

            <Button variant="doubleCircleSearch" aria-label="search" />

            <Button variant="squarePlus" aria-label="plus" />


          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#24344c]">
            Segment و Toggle
          </h2>

          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-600">
                Segment کوچک
              </p>

              <SegmentButton
                variant="small"
                value={segmentValue}
                onChange={setSegmentValue}
                options={[
                  { label: "شخصی", value: "personal" },
                  { label: "تیمی", value: "team" },
                ]}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-600">
                Segment بزرگ
              </p>

              <SegmentButton
                variant="large"
                value={segmentValue}
                onChange={setSegmentValue}
                options={[
                  { label: "شخصی", value: "personal" },
                  { label: "تیمی", value: "team" },
                ]}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-600">
                ToggleSwitch
              </p>

              <ToggleSwitch
                checked={toggleChecked}
                onChange={setToggleChecked}
                aria-label="تغییر وضعیت"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#24344c]">Input ها</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                Input خاکستری بزرگ
              </label>

              <Input
                variant="grayLarge"
                placeholder="نام برد"
                value={name}
                onChange={handleNameChange}
              />
            </div>



            <div className="space-y-3">
                <label className="block text-sm font-semibold text-zinc-600">
                    Input سفید متوسط
                </label>

                <Input
                    variant="whiteMedium"
                    placeholder="نام کاربر"
                    value={name}
                    onChange={handleNameChange}
                />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                Password Input
              </label>

              <PasswordInput
                placeholder="رمز عبور"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-semibold text-zinc-600">
                    Input سفید
                </label>

                <Input
                    variant="whiteSmall"
                    placeholder="متن تستی"
                    value={name}
                    onChange={handleNameChange}
                />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                Search Input
              </label>

              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="جستجو"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                Search Keyboard Input
              </label>

              <SearchKeyboardInput
                value={keyboardSearch}
                onChange={handleKeyboardSearchChange}
                placeholder="جستجو"
              />
            </div>




          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#24344c]">
            TextArea و OTP
          </h2>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                TextArea آبی بزرگ
              </label>

              <TextArea
                variant="blueLarge"
                placeholder="توضیحات"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                TextArea خاکستری بلند
              </label>

              <TextArea
                variant="grayTall"
                placeholder="توضیحات"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-zinc-600">
                OTP Input
              </label>

              <OtpInputGroup
                length={6}
                values={otpValues}
                onChange={setOtpValues}
              />

              <p className="text-sm text-zinc-500">
                مقدار وارد شده: {otpValues.join("") || "خالی"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestUiPage;