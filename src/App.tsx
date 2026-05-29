import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Main content area */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          محتوای اصلی سایت
        </div>
      </main>
      <div className="pb-4">
        <Footer />
      </div>
    </div>
  );
}

export default App;
