import { FaShippingFast, FaDollarSign, FaHeadset } from "react-icons/fa"; // Importing icons from react-icons

function About() {
  return (
    <section id="about" className="w-full bg-gray-50 py-12">
      <h3 className="text-center text-gray-600 text-3xl font-semibold mb-2">
        About Us
      </h3>
      <h1 className="text-center text-5xl font-extrabold text-gray-800 mb-8">
        Why Choose Us?
      </h1>

      <div className="flex flex-wrap gap-10 items-center justify-center transition-all duration-300 px-4">
        <div className="flex-1 min-w-[300px] max-w-[500px] transition-all duration-300 shadow-lg rounded-lg overflow-hidden">
          <img
            src="https://media.istockphoto.com/id/1473906544/photo/close-up-on-delicious-round-pizza-with-prosciutto-mozzarella-and-basil-leaves-on-top-served.jpg?s=2048x2048&w=is&k=20&c=YBfhj4wG_JU-SpIbWB5HjW8-m2jwaOdsHQ3sTCdkocg="
            alt="About Us"
            className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
          />
        </div>

        <div className="flex-1 min-w-[300px] max-w-[500px] transition-all duration-300 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-black text-4xl font-semibold py-2 transition-all duration-300">
            Best Food in the Country
          </h3>
          <p className="text-gray-700 text-lg py-2 leading-7 transition-all duration-300">
            We prioritize our customers, providing top-quality meals that will
            tantalize your taste buds. Our commitment to excellence ensures that
            every dish is made with the finest ingredients and served with care.
          </p>
          <p className="text-gray-700 text-lg py-2 leading-7 transition-all duration-300">
            Experience exceptional service with our dedicated team who are
            always ready to assist you. From gourmet dishes to friendly staff,
            we aim to create a memorable dining experience.
          </p>

          <div className="flex gap-6 flex-wrap py-4 mt-4">
            <div className="bg-white border border-gray-300 shadow-md flex items-center justify-center gap-4 flex-1 min-w-[150px] rounded-md p-6 transition-all duration-300 hover:shadow-lg hover:bg-green-50 transform hover:scale-105">
              <FaDollarSign className="text-green-600 text-4xl" />
              <span className="text-lg text-black">Easy Payments</span>
            </div>
            <div className="bg-white border border-gray-300 shadow-md flex items-center justify-center gap-4 flex-1 min-w-[150px] rounded-md p-6 transition-all duration-300 hover:shadow-lg hover:bg-green-50 transform hover:scale-105">
              <FaHeadset className="text-green-600 text-4xl" />
              <span className="text-lg text-black">24/7 Service</span>
            </div>
          </div>
          <div className="text-center mt-6">
            <a
              href="#"
              className="bg-green-600 text-white py-3 px-8 rounded-md transition-all duration-300 hover:bg-green-500 transform hover:scale-105 text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
