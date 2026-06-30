"use client";

import React, { useState, useEffect, useMemo } from "react";
import CatalogHeader from "./CatalogHeader";
import CatalogControls from "./CatalogControls";
import ProductGrid from "./ProductGrid";
import FilterDrawer from "./FilterDrawer";
import { RUGS_CONFIG, CURTAINS_CONFIG, FilterCategory, ProductStub } from "../../lib/catalogConfig";
import { getProducts } from "../../services/Product";

interface ProductCatalogLayoutProps {
  category: "rugs" | "curtains";
}

export default function ProductCatalogLayout({ category }: ProductCatalogLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const categoryId = category === "rugs" ? 16 : 17;
      const data = await getProducts(categoryId);
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  const config = category === "rugs" ? RUGS_CONFIG : CURTAINS_CONFIG;
  const baseRoute = `/products/${category}`;

  // 1. Dynamically extract filters from products
  const dynamicFilters = useMemo(() => {
    const filters: FilterCategory[] = [];

    if (!products.length) return config.filters;

    const getUniqueValues = (keyExtractor: (p: any) => string | undefined) => {
      const values = new Set<string>();
      products.forEach(p => {
        const val = keyExtractor(p);
        if (val) values.add(val);
      });
      return Array.from(values).map(v => {
        const strVal = String(v);
        return { label: strVal, value: strVal.toLowerCase() };
      });
    };

    // Subcategories (excluding the main one)
    const subCats = new Set<string>();
    products.forEach(p => {
      p.categories?.forEach((c: any) => {
        if (c.name.toLowerCase() !== "rugs" && c.name.toLowerCase() !== "curtains") {
          subCats.add(c.name);
        }
      });
    });
    if (subCats.size > 0) {
      filters.push({
        id: "category",
        label: "Category",
        options: Array.from(subCats).map(c => ({ label: c, value: c.toLowerCase() }))
      });
    }

    // Construction (from ACF)
    const constructions = getUniqueValues(p => p.acf?.construction);
    if (constructions.length > 0) {
      filters.push({
        id: "construction",
        label: "Construction",
        options: constructions
      });
    }

    // Standard exhaustive lists for Color and Size
    const ALL_COLORS = ["Beige", "Ivory", "White", "Grey", "Charcoal", "Black", "Blue", "Navy", "Sage Green", "Ochre", "Red", "Brown"];
    const ALL_SIZE_CATEGORIES = ["Small", "Medium", "Large", "Runner", "Oversized"];

    // Color (Always show all options)
    filters.push({
      id: "color",
      label: "Color",
      options: ALL_COLORS.map(c => ({ label: c, value: c.toLowerCase() }))
    });

    // Size Category (Always show all options)
    filters.push({
      id: "size-category",
      label: "Size",
      options: ALL_SIZE_CATEGORIES.map(s => ({ label: s, value: s.toLowerCase() }))
    });

    // Exact Size (from ACF exact dimensions as a fallback if desired, but we can rely on Size Category now)
    // We will leave the exact size out to avoid confusing duplicate size filters, as the user requested "Size" to show all options.


    // Country of Origin (from ACF)
    const countries = getUniqueValues(p => p.acf?.country_of_origin);
    if (countries.length > 0) {
      filters.push({
        id: "country",
        label: "Country of Origin",
        options: countries
      });
    }

    return filters.length > 0 ? filters : config.filters;
  }, [products, config.filters]);

  // 2. Filter products based on selectedFilters
  const filteredProducts = useMemo(() => {
    const baseFiltered = products.filter(p => {
      for (const [filterId, selectedValues] of Object.entries(selectedFilters)) {
        if (selectedValues.length === 0) continue;
        
        let productValue = "";
        let matchFound = false;
        
        if (filterId === "category") {
           matchFound = p.categories?.some((c: any) => selectedValues.includes(c.name.toLowerCase()));
           if (!matchFound) return false;
           continue; 
        } else if (filterId === "color") {
           const colorAttr = p.attributes?.find((a: any) => a.name === 'Color');
           matchFound = colorAttr?.options?.some((opt: string) => selectedValues.includes(opt.toLowerCase()));
           if (!matchFound) return false;
           continue;
        } else if (filterId === "size-category") {
           const sizeAttr = p.attributes?.find((a: any) => a.name === 'Size Category');
           matchFound = sizeAttr?.options?.some((opt: string) => selectedValues.includes(opt.toLowerCase()));
           if (!matchFound) return false;
           continue;
        } else if (filterId === "construction") {
           productValue = p.acf?.construction?.toLowerCase() || "";
        } else if (filterId === "country") {
           productValue = p.acf?.country_of_origin?.toLowerCase() || "";
        } else if (filterId === "size") {
           const width = p.acf?.exact_width_cm;
           const length = p.acf?.exact_length_cm;
           productValue = width && length ? `${width}x${length} cm`.toLowerCase() : "";
        }
        
        if (filterId !== "category" && filterId !== "color" && filterId !== "size-category") {
          if (!selectedValues.includes(productValue)) return false;
        }
      }
      return true;
    });

    // Apply sorting
    return baseFiltered.sort((a, b) => {
      if (sortOption === "price_asc") {
        const priceA = parseFloat(a.price) || parseFloat(a.regularPrice) || 0;
        const priceB = parseFloat(b.price) || parseFloat(b.regularPrice) || 0;
        return priceA - priceB;
      } else if (sortOption === "price_desc") {
        const priceA = parseFloat(a.price) || parseFloat(a.regularPrice) || 0;
        const priceB = parseFloat(b.price) || parseFloat(b.regularPrice) || 0;
        return priceB - priceA;
      } else if (sortOption === "newest") {
        return b.id - a.id; // Fallback to ID for 'newest' since date created is not exposed directly here
      }
      return 0; // "default" or "popular" (no sales tracking metric available yet)
    });
  }, [products, selectedFilters, sortOption]);

  // 3. Map filtered products to ProductStub for the UI
  const displayProducts: ProductStub[] = filteredProducts.map(p => {
    const colorAttr = p.attributes?.find((a: any) => a.name === 'Color');
    const colorVal = colorAttr?.options?.[0] || "";

    return {
      id: p.id.toString(),
      slug: p.slug,
      title: p.name,
      collectionName: p.acf?.country_of_origin?.toUpperCase() || "",
      category: p.acf?.construction || p.categories?.[0]?.name || "",
      color: colorVal, 
      image: p.mainImage?.src || (category === "rugs" ? "/rugs/set1-full.png" : "/curtains/set1-room.png"),
      price: p.regularPrice ? `$${p.regularPrice}` : (p.price ? `$${p.price}` : "")
    };
  });

  const toggleFilter = (categoryId: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[categoryId] || [];
      if (current.includes(value)) {
        return { ...prev, [categoryId]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [categoryId]: [...current, value] };
      }
    });
  };

  const clearAllFilters = () => setSelectedFilters({});

  return (
    <div className="w-full bg-[var(--bg-primary)] min-h-screen pt-20">
      <div className="max-w-[var(--container-lg)] mx-auto px-[var(--space-4)] lg:px-[var(--space-8)] pb-24">

        <CatalogHeader title={config.title} subtitle={config.subtitle} />

        <CatalogControls
          onFilterClick={() => setIsFilterOpen(true)}
          resultCount={displayProducts.length}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-primary)]"></div>
          </div>
        ) : (
          <ProductGrid products={displayProducts} baseRoute={baseRoute} />
        )}

        {/* Load More Button - Static for demo */}
        {displayProducts.length > 0 && (
          <div className="w-full flex justify-center mt-16 lg:mt-24">
            <button className="bg-[var(--accent-primary)] text-[#111] px-12 py-4 font-sans text-[var(--text-sm)] uppercase tracking-widest hover:bg-[var(--accent-secondary)] transition-colors border-none">
              Load More
            </button>
          </div>
        )}

      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={dynamicFilters}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        clearAll={clearAllFilters}
      />
    </div>
  );
}
