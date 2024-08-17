"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    router.push(
      pathname === "/"
        ? `/catalog?search=${searchInput}`
        : `${pathname}?search=${searchInput}`
    );
  };

  return (
    <div className="w-full">
      <form className="flex-1" onSubmit={handleSearch}>
        <div className="relative w-full">
          <Input
            type="search"
            name="search"
            placeholder="Search products, brands and categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />
          <Button className="max-md:hidden absolute top-0 right-0">
            <span className="">SEARCH</span>
          </Button>
          <Button size="icon" className="md:hidden absolute top-0 right-0">
            <MagnifyingGlassIcon className="h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
