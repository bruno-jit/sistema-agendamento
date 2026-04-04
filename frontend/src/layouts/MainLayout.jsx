import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {children}
      </div>
    </>
  );
}