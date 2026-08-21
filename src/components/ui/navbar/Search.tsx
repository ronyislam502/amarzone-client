import { Search as SearchIcon } from "lucide-react";

const Search = () => {
    return (
        <label className="input input-bordered flex items-center gap-4 w-full bg-white text-black h-12 px-6 rounded-full">
            <SearchIcon className="h-5 w-5 opacity-60" />
            <input
                type="text"
                placeholder="Search products..."
                className="grow outline-none text-base"
            />
        </label>
    );
};

export default Search;
