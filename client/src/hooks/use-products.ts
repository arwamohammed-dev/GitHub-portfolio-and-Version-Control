import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type ProductListParams = z.infer<typeof api.products.list.input>;

export function useProducts(params?: ProductListParams) {
  // Construct a stable query key based on params
  const queryKey = [
    api.products.list.path,
    params?.category,
    params?.sort,
    params?.search
  ].filter(Boolean);

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build URL with query parameters
      const url = new URL(api.products.list.path, window.location.origin);
      if (params?.category && params.category !== "All") {
        url.searchParams.append("category", params.category);
      }
      if (params?.sort) {
        url.searchParams.append("sort", params.sort);
      }
      if (params?.search) {
        url.searchParams.append("search", params.search);
      }

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      
      const data = await res.json();
      return api.products.list.responses[200].parse(data);
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      
      const data = await res.json();
      return api.products.get.responses[200].parse(data);
    },
  });
}
