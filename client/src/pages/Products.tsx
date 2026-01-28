import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, AlertCircle, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Electronics", "Clothing", "Home", "Accessories"];

export default function Products() {
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | undefined>();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timeoutId = setTimeout(() => setDebouncedSearch(e.target.value), 500);
    return () => clearTimeout(timeoutId);
  };

  const { data: products, isLoading, error, refetch } = useProducts({
    category: category === "All" ? undefined : category,
    sort,
    search: debouncedSearch,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
          Curated Collection
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover our premium selection of electronics, fashion, and home essentials designed for modern living.
        </p>
      </section>

      {/* Filters & Controls */}
      <section className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 sticky top-[70px] z-40 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Categories - Desktop pills, Mobile select */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className="rounded-full px-6 transition-all duration-300 hover:scale-105"
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 h-10 rounded-xl bg-background border-border/60 focus:ring-primary/20"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <Select value={sort || ""} onValueChange={(val: any) => setSort(val || undefined)}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background border-border/60">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="min-h-[500px]">
        {error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 bg-destructive/5 rounded-2xl p-8 border border-destructive/20">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-destructive">Failed to load products</h3>
              <p className="text-muted-foreground">Something went wrong while fetching the data.</p>
            </div>
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-2xl" />
                <div className="space-y-2 px-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
            <div className="bg-muted p-6 rounded-full">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try adjusting your search or category.
              </p>
            </div>
            <Button 
              variant="default" 
              onClick={() => {
                setCategory("All");
                setSearch("");
                setDebouncedSearch("");
                setSort(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}
