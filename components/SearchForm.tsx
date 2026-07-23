import classNames from "classnames";

interface SearchFormProps {
  active: boolean;
  onClose: () => void;
}

function SearchForm({ active, onClose }: SearchFormProps) {
  return (
    <form
      action=""
      className={classNames(
        "fixed top-[-110%] left-0 w-full h-full z-1004 flex items-center justify-center bg-black bg-opacity-80 p-4 transition-transform duration-300",
        {
          "top-0": active,
        }
      )}
      id="search-form"
    >
      <input
        className="w-[50rem] p-4 text-3xl text-white border-b-2 border-white placeholder:text-gray-400 focus:outline-none"
        type="search"
        placeholder="Search here..."
        id="search-box"
      />
      <span className="fas fa-search text-white text-3xl cursor-pointer transition-colors duration-300 hover:text-green" />
      <span
        className="fas fa-times absolute top-8 right-12 text-white text-5xl cursor-pointer transition-colors duration-300 hover:text-green"
        onClick={onClose}
      />
    </form>
  );
}

export default SearchForm;
