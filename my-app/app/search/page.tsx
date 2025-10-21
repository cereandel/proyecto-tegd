import { SearchResults } from "../../components/SearchResults";

export default function SearchPage() {
  return (
    <SearchResults
      searchQuery=""
      hotels={[]}
      onBack={() => console.log("Back pressed")}
      onClearSearch={() => console.log("Search cleared")}
    />
  );
}
