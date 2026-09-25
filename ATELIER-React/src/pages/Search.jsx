import { useSearchParams } from "react-router-dom";
import Products from "./Products";

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    return <Products initialSearch={query} searchOnly />;
}

export default Search;
