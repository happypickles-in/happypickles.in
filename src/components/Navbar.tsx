import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, ChevronDown } from "lucide-react";
import { useCart } from './CartContext';


import jadi from "../assets/nobg/jadi.png";
import rangoli from "../assets/nobg/rangoli.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { toggleCart, items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  /** 🔑 single source of truth */
  const navbarSolid = scrolled || open;

  const CATEGORIES = [
    { label: "Veg Pickles", value: "veg" },
    { label: "Non Veg Pickles", value: "non-veg" },
    { label: "Powders", value: "powder" },
    { label: "Snacks", value: "snack" },
    { label: "Sweets", value: "sweet" },
  ];

  const goHomeWithCategory = (category: string) => {
    const query = `?category=${category}`;
    if (location.pathname === "/") {
      navigate(query);
    } else {
      navigate(`/${query}`);
    }
    setCatOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-40 h-20">
        {/* background layer */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${navbarSolid
              ? "bg-white/90 backdrop-blur-md shadow-sm"
              : "bg-white/0"
            }`}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-20">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative h-14 aspect-square overflow-hidden">
                <img
                  src={rangoli}
                  className="absolute inset-0 w-full h-full object-cover spin"
                  alt=""
                />
                <img
                  src={jadi}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  alt=""
                />
              </div>
              <div className="relative scale-[115%] ml-2">
                <span
                  className={`font-amsterdam text-2xl transition-colors
                ${navbarSolid ? "text-[#7a1f1f]" : "text-white"}`}
                >
                  happy pickles
                </span>
                <span
                  className={`absolute right-[16px] -bottom-[1px] font-amsterdam text-[9px] transition-colors block
                ${navbarSolid ? "text-[#7a1f1f]" : "text-white"}`}
                >
                  <span className="text-[4px] mr-[2px]">&</span> powders
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {["Bestsellers", "Categories", "Menu", "Reviews"].map((item) => {
                if (item === "Categories") {
                  return (
                    <div
                      key={item}
                      className="relative flex items-center gap-1"
                      onMouseEnter={() => setCatOpen(true)}
                      onMouseLeave={() => setCatOpen(false)}
                    >
                      {/* text → scroll */}
                      <button
                        onClick={() => {
                          setCatOpen(false);
                          document
                            .getElementById("categories")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`font-medium transition-colors duration-500
                        ${navbarSolid ? "text-[#2D1F14]" : "text-white"}`}
                      >
                        Categories
                      </button>

                      {/* chevron → toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCatOpen((o) => !o);
                        }}
                        className={`p-1 transition-transform duration-200
                        ${catOpen ? "rotate-180" : ""}
                        ${navbarSolid ? "text-[#2D1F14]" : "text-white"}`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown */}
                      {catOpen && (
                        <div className="absolute left-0 top-full">
                          <div className="h-2" />
                          <div className="w-max min-w-full rounded-xl bg-white shadow-xl border border-[#EEE] overflow-hidden">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat.value}
                                onClick={() => goHomeWithCategory(cat.value)}
                                className="block w-full text-left px-4 py-3 text-sm text-[#2D1F14] hover:bg-[#FFF3E8]"
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`font-medium transition-colors duration-500
                    ${navbarSolid ? "text-[#2D1F14]" : "text-white"}`}
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3">
              <button className="hidden p-2">
                <User className={navbarSolid ? "text-[#2D1F14]" : "text-white"} />
              </button>

              <button onClick={toggleCart} className="block p-2 relative">
                <ShoppingCart
                  className={navbarSolid ? "text-[#2D1F14]" : "text-white"}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D35400] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}

              </button>

              <button onClick={() => setOpen(true)} className="md:hidden p-2">
                <Menu className={navbarSolid ? "text-[#2D1F14]" : "text-white"} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= TOP SLIDE MENU ================= */}
      <div
        className={`fixed inset-x-0 top-0 z-30 transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${open ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* background */}
        <div
          className='absolute inset-0 transition-all duration-700 bg-white/95 backdrop-blur-md shadow-lg'
        />

        {/* content */}
        <div className="relative z-10 pt-24 px-6 pb-8 flex flex-col gap-6 text-lg">

          {/* Links */}
          {["Bestsellers", "Categories", "Menu", "Reviews"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "")}`}
              onClick={() => setOpen(false)}
              className="text-[#2D1F14] font-medium"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}
    </>
  );
}
