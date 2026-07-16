"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CatalogHeader from "./CatalogHeader";
import CatalogControls from "./CatalogControls";
import ProductGrid from "./ProductGrid";
import FilterDrawer from "./FilterDrawer";
import Pagination from "./Pagination";
import { RUGS_CONFIG, CURTAINS_CONFIG, FilterCategory, ProductStub } from "../../lib/catalogConfig";
import { getProducts, getCategoryIdBySlug } from "../../services/Product";
import { useCurrencyStore } from "../../lib/store/useCurrencyStore";
import { formatPrice } from "../../lib/utils/price";

interface ProductCatalogLayoutProps {
  category: "rugs" | "curtains";
}

export default function ProductCatalogLayout({ category }: ProductCatalogLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const { currency } = useCurrencyStore();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const categoryParam = searchParams?.get("category");
    if (categoryParam) {
      return { category: [categoryParam.toLowerCase()] };
    }
    return {} as Record<string, string[]>;
  });
  const [sortOption, setSortOption] = useState("default");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortOption]);

  // Clear price range filter when currency changes
  useEffect(() => {
    setSelectedFilters(prev => {
      const next = { ...prev };
      delete next["price-range"];
      return next;
    });
  }, [currency]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const categoryId = await getCategoryIdBySlug(category);
      if (categoryId) {
        const data = await getProducts(categoryId);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
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

    const getUniqueValues = (keyExtractor: (p: any) => string | undefined, splitRegex?: RegExp) => {
      const uniqueMap = new Map<string, string>();
      products.forEach(p => {
        const val = keyExtractor(p);
        if (val) {
          const strVal = String(val).replace(/&amp;/g, '&').trim();
          if (splitRegex) {
            strVal.split(splitRegex).forEach(part => {
              const cleaned = part.trim();
              if (cleaned) {
                const lowerVal = cleaned.toLowerCase();
                if (!uniqueMap.has(lowerVal)) uniqueMap.set(lowerVal, cleaned);
              }
            });
          } else {
            const lowerVal = strVal.toLowerCase();
            if (!uniqueMap.has(lowerVal)) {
              uniqueMap.set(lowerVal, strVal);
            }
          }
        }
      });
      return Array.from(uniqueMap.entries()).map(([value, label]) => ({ label, value }));
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

    // Material (from Attributes)
    const materials = getUniqueValues(p => {
      const matAttr = p.attributes?.find((a: any) => a.name.toLowerCase() === 'material');
      if (matAttr && matAttr.options && matAttr.options.length > 0) {
        return matAttr.options[0];
      }
      return p.acf?.material;
    }, /&|,/);
    if (materials.length > 0) {
      filters.push({
        id: "material",
        label: "Material",
        options: materials
      });
    }

    // Color (dynamically built from ACF productColor)
    const colorOptions = getUniqueValues(p => p.acf?.productColor);
    if (colorOptions.length > 0) {
      filters.push({
        id: "color",
        label: "Color",
        options: colorOptions
      });
    }

    // Price Range
    const getPriceBuckets = (curr: string) => {
      const steps = [2500, 5000, 10000, 20000, 30000];
      
      return [
        { label: `Under ${formatPrice(steps[0], curr)}`, value: `under-${steps[0]}`, max: steps[0] },
        { label: `${formatPrice(steps[0], curr)} - ${formatPrice(steps[1], curr)}`, value: `${steps[0]}-${steps[1]}`, min: steps[0], max: steps[1] },
        { label: `${formatPrice(steps[1], curr)} - ${formatPrice(steps[2], curr)}`, value: `${steps[1]}-${steps[2]}`, min: steps[1], max: steps[2] },
        { label: `${formatPrice(steps[2], curr)} - ${formatPrice(steps[3], curr)}`, value: `${steps[2]}-${steps[3]}`, min: steps[2], max: steps[3] },
        { label: `${formatPrice(steps[3], curr)} - ${formatPrice(steps[4], curr)}`, value: `${steps[3]}-${steps[4]}`, min: steps[3], max: steps[4] },
        { label: `${formatPrice(steps[4], curr)} above`, value: `${steps[4]}-plus`, min: steps[4] }
      ];
    };

    const priceOptions = getPriceBuckets(currency);
    filters.push({
      id: "price-range",
      label: "Price Range",
      options: priceOptions.map(o => ({ label: o.label, value: o.value }))
    });

    // Actual Size (cm)
    const sizeOptions = getUniqueValues(p => {
      const length = p.dimensions?.length || p.acf?.exactLengthCm;
      const width = p.dimensions?.width || p.acf?.exactWidthCm;
      if (length && width) return `${length}x${width} cm`;
      return undefined;
    });
    if (sizeOptions.length > 0) {
      filters.push({
        id: "actual-size",
        label: "Size",
        options: sizeOptions
      });
    }

    // Shape
    const shapeOptions = getUniqueValues(p => {
      const shapeAttr = p.attributes?.find((a: any) => a.name.toLowerCase() === 'shape');
      if (shapeAttr && shapeAttr.options && shapeAttr.options.length > 0) {
        return shapeAttr.options[0];
      }
      return undefined;
    });
    if (shapeOptions.length > 0) {
      filters.push({
        id: "shape",
        label: "Shape",
        options: shapeOptions
      });
    }    // Country of Origin (from ACF)
    const countries = getUniqueValues(p => p.acf?.countryOfOrigin);
    if (countries.length > 0) {
      filters.push({
        id: "country",
        label: "Country of Origin",
        options: countries
      });
    }

    return filters.length > 0 ? filters : config.filters;
  }, [products, config.filters, currency]);

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
           const productColor = p.acf?.productColor?.toLowerCase() || "";
           if (!selectedValues.includes(productColor)) return false;
           continue;
         } else if (filterId === "price-range") {
           const currencyKey = currency.toLowerCase();
           let price = 0;
           if (p.manualPrices?.[currencyKey]) {
             price = parseFloat(p.manualPrices[currencyKey]);
           } else {
             price = parseFloat(p.price) || parseFloat(p.regularPrice) || 0;
           }

           const steps = [2500, 5000, 10000, 20000, 30000];
                         
           const buckets = [
             { value: `under-${steps[0]}`, max: steps[0] },
             { value: `${steps[0]}-${steps[1]}`, min: steps[0], max: steps[1] },
             { value: `${steps[1]}-${steps[2]}`, min: steps[1], max: steps[2] },
             { value: `${steps[2]}-${steps[3]}`, min: steps[2], max: steps[3] },
             { value: `${steps[3]}-${steps[4]}`, min: steps[3], max: steps[4] },
             { value: `${steps[4]}-plus`, min: steps[4] }
           ];

           matchFound = selectedValues.some(val => {
             const bucket = buckets.find(b => b.value === val);
             if (!bucket) return false;
             if (bucket.min !== undefined && price < bucket.min) return false;
             if (bucket.max !== undefined && price >= bucket.max) return false;
             return true;
           });
           if (!matchFound) return false;
           continue;
         } else if (filterId === "actual-size") {
           const length = p.dimensions?.length || p.acf?.exactLengthCm;
           const width = p.dimensions?.width || p.acf?.exactWidthCm;
           const sizeStr = length && width ? `${length}x${width} cm`.toLowerCase() : "";
           if (!selectedValues.includes(sizeStr)) return false;
           continue;
         } else if (filterId === "shape") {
           const shapeAttr = p.attributes?.find((a: any) => a.name.toLowerCase() === 'shape');
           const shapeStr = shapeAttr?.options?.[0]?.toLowerCase() || "";
           if (!selectedValues.includes(shapeStr)) return false;
           continue;
         } else if (filterId === "construction") {
           productValue = String(p.acf?.construction || "").toLowerCase().trim();
         } else if (filterId === "country") {
           productValue = String(p.acf?.countryOfOrigin || "").toLowerCase().trim();
         } else if (filterId === "material") {
           const matAttr = p.attributes?.find((a: any) => a.name.toLowerCase() === 'material');
           const matStr = String(matAttr?.options?.[0] || p.acf?.material || "").replace(/&amp;/g, '&').toLowerCase();
           const matchFound = selectedValues.some(selected => matStr.includes(selected));
           if (!matchFound) return false;
           continue;
         }
        
        if (filterId !== "category" && filterId !== "color" && filterId !== "price-range" && filterId !== "actual-size" && filterId !== "shape") {
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
    const colorVal = p.acf?.productColor || "";
    
    const currencyKey = currency.toLowerCase();
    let priceToUse = 0;
    let isFallback = false;
    if (p.manualPrices?.[currencyKey]) {
      priceToUse = parseFloat(p.manualPrices[currencyKey]);
    } else {
      priceToUse = parseFloat(p.price) || parseFloat(p.regularPrice) || 0;
      if (currency !== "AED") isFallback = true;
    }

    return {
      id: p.id.toString(),
      slug: p.slug,
      title: p.name,
      collectionName: String(p.acf?.countryOfOrigin || "").toUpperCase(),
      category: String(p.acf?.construction || p.categories?.[0]?.name || ""),
      color: colorVal, 
      image: p.mainImage?.src || (category === "rugs" ? "/rugs/set1-full.png" : "/curtains/set1-room.png"),
      price: priceToUse > 0 ? formatPrice(priceToUse, isFallback ? "AED" : currency) : "",
      isFallbackPrice: isFallback
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
          <ProductGrid products={displayProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} baseRoute={baseRoute} />
        )}

        {displayProducts.length > 0 && !loading && (
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(displayProducts.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
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
