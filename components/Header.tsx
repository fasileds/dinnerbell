"use client";
import classNames from "classnames";
import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import {
  FaUtensils,
  FaBars,
  FaSearch,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import Image from "next/image";

function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const menuIcon = document.querySelector("#menu-bars");
      menuIcon?.classList.add("fa-bars");
      menuIcon?.classList.remove("fa-times");
      setToggleMenu(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const sectionList = document.querySelectorAll("section");
      sectionList.forEach((section) => {
        const id = section.getAttribute("id");
        const menuItem = document.querySelector(`header nav a[href="#${id}"]`);
        if (menuItem) {
          const scrollY = window.scrollY;
          const sectionTop = section.offsetTop - 150;
          const activeLinkClass = "active-link";

          if (
            scrollY > sectionTop &&
            scrollY <= sectionTop + section.offsetHeight
          ) {
            menuItem.classList.add(activeLinkClass);
          } else {
            menuItem.classList.remove(activeLinkClass);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onMenuClick = () => {
    setToggleMenu(!toggleMenu);
    const menuIcon = document.querySelector("#menu-bars");
    menuIcon?.classList.toggle("fa-bars", toggleMenu);
    menuIcon?.classList.toggle("fa-times", !toggleMenu);
  };
  const [isVibrating, setIsVibrating] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 px-7 flex items-center justify-between bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
      <a
        href="#home"
        className="flex items-center gap-2"
        onMouseEnter={() => setIsVibrating(true)}
        onMouseLeave={() => setIsVibrating(false)}
      >
        <div className="text-2xl font-bold text-black flex flex-col leading-tight">
          <span className="text-green-600">Dinner</span>
          <span className="text-green-600">Bell</span>
        </div>
        <div className="flex justify-center items-center w-20 h-15 group">
          <div className="text-5xl transform origin-top transition-transform duration-200 group-hover:animate-[ring_1s_ease-in-out_infinite]">
            <img
              className="h-16 w-16 object-contain cursor-pointer group-hover:scale-110"
              src="/bell1.png"
              alt="Notification Bell"
            />
          </div>
        </div>
      </a>
      <span
        id="menu-bars"
        className="md:hidden text-black bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition duration-300 hover:bg-green-600 hover:shadow-lg hover:scale-105"
        onClick={onMenuClick}
      >
        <FaBars className="text-2xl transition-transform duration-300 hover:rotate-360 hover:text-white" />
      </span>
      <nav
        className={classNames(
          "fixed top-16 left-0 right-0 bg-white md:static md:flex md:flex-row items-center gap-4 md:gap-8 transition-all duration-300",
          {
            "hidden md:flex": !toggleMenu,
            "flex flex-col p-6 md:flex-row": toggleMenu,
          }
        )}
      >
        <a
          href="#home"
          className="text-lg rounded-lg py-2 px-4 text-gray-700 transition duration-300 border-2 border-transparent hover:bg-green-100 hover:border-green-600 bg-green-600"
          onClick={onMenuClick}
        >
          Home
        </a>
        <a
          href="#dishes"
          className="text-lg rounded-lg py-2 px-4 text-gray-700 transition duration-300 border-2 border-transparent hover:bg-green-100 hover:border-green-600"
          onClick={onMenuClick}
        >
          Dishes
        </a>
        <a
          href="#about"
          className="text-lg rounded-lg py-2 px-4 text-gray-700 transition duration-300 border-2 border-transparent hover:bg-green-100 hover:border-green-600"
          onClick={onMenuClick}
        >
          About
        </a>
      </nav>
      <div className="hidden md:flex gap-4">
        <span
          id="search-icon"
          className="text-black bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition duration-300 hover:bg-green-600 hover:shadow-lg hover:scale-105"
          onClick={() => setToggleSearch(true)}
        >
          <FaSearch className="text-2xl transition-transform duration-300 hover:rotate-360 hover:text-white" />
        </span>
        <span className="text-black bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition duration-300 hover:bg-green-600 hover:shadow-lg hover:scale-105">
          <FaHeart className="text-2xl transition-transform duration-300 hover:rotate-360 hover:text-white" />
        </span>
        <span className="text-black bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition duration-300 hover:bg-green-600 hover:shadow-lg hover:scale-105">
          <FaShoppingCart className="text-2xl transition-transform duration-300 hover:rotate-360 hover:text-white" />
        </span>
      </div>

      <SearchForm
        active={toggleSearch}
        onClose={() => setToggleSearch(false)}
      />
    </header>
  );
}

export default Header;
