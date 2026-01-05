import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Input from "./input";

export const SearchBar = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (debouncedValue) {
      setSearchParams({ search: debouncedValue });
    } else {
      setSearchParams({});
    }
  }, [debouncedValue, setSearchParams]);

  return (
    <div>
      <Input
        className="w-full"
        RightIcon={<Search className="h-4 w-4" color="#94A3B8" />}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="Buscar"
        data-testid="search-bar"
      />
    </div>
  );
};
