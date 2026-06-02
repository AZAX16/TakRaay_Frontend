import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import FaqItem from "../components/faq/FaqItem";
import { faqData } from "../utils/faqData";

const FaqPage = () => {
  return (
    <div
      dir="rtl"
      className="faq-page flex min-h-screen flex-col transition-colors duration-300"
    >
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:px-6">
        <section className="faq-frame faq-frame-bg mx-auto w-full max-w-3xl rounded-[22px] border-2 border-[#4A5575] py-5 pl-1 pr-4 transition-colors duration-300 md:pl-2 md:pr-6">
          <h1 className="faq-page-title mb-6 text-right text-2xl font-extrabold md:text-4xl">
            سوالات متداول:
          </h1>

          <div className="faq-scroll max-h-[470px] overflow-y-auto pl-0">
            <div className="space-y-3">
              {faqData.map((item) => (
                <FaqItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;