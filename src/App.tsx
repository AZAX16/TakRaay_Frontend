import Dashboard from "./pages/Dashboard";
function App() {
  return <Dashboard />;
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <SignupPage />
import './index.css';
// import TestProfile from "./pages/TestProfile.tsx";
// import TestKit from "./pages/TestKit.tsx";
// import TestModal from "./pages/TestModal.tsx";
import TestCard from "./pages/TestCard.tsx";

function App() {
  return <TestCard />;
}

export default App;
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