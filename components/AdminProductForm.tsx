"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { Product, SupplementFact } from "@/types/product";
import { CATEGORIES, DIETARY_FLAGS } from "@/utils/constants";

interface Props {
  product?: Product;
}

export default function AdminProductForm({ product }: Props) {
  const router = useRouter();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [shortDescription, setShortDescription] = useState(
    product?.short_description || ""
  );
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price?.toString() || ""
  );
  const [category, setCategory] = useState<string>(product?.category || "vitamins");
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [sku, setSku] = useState(product?.sku || "");
  const [tags, setTags] = useState(product?.tags?.join(", ") || "");
  const [dietaryFlags, setDietaryFlags] = useState<string[]>(
    product?.dietary_flags || []
  );
  const [servingInstructions, setServingInstructions] = useState(
    product?.serving_instructions || ""
  );
  const [warnings, setWarnings] = useState(product?.warnings || "");
  const [status, setStatus] = useState<string>(product?.status || "draft");
  const [featured, setFeatured] = useState(product?.featured || false);

  // Supplement facts
  const [servingSize, setServingSize] = useState(
    product?.supplement_facts?.serving_size || ""
  );
  const [servingsPerContainer, setServingsPerContainer] = useState(
    product?.supplement_facts?.servings_per_container?.toString() || ""
  );
  const [nutrients, setNutrients] = useState<SupplementFact[]>(
    product?.supplement_facts?.nutrients || []
  );
  const [otherIngredients, setOtherIngredients] = useState(
    product?.supplement_facts?.other_ingredients || ""
  );

  // Images
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(path);
        setImages((prev) => [...prev, publicUrl]);
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addNutrient = () => {
    setNutrients((prev) => [
      ...prev,
      { name: "", amount: "", daily_value: "" },
    ]);
  };

  const updateNutrient = (
    index: number,
    field: keyof SupplementFact,
    value: string
  ) => {
    setNutrients((prev) =>
      prev.map((n, i) => (i === index ? { ...n, [field]: value } : n))
    );
  };

  const removeNutrient = (index: number) => {
    setNutrients((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDietaryFlag = (flag: string) => {
    setDietaryFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supplementFacts =
      servingSize && nutrients.length > 0
        ? {
            serving_size: servingSize,
            servings_per_container: parseInt(servingsPerContainer) || 0,
            nutrients: nutrients.filter((n) => n.name && n.amount),
            other_ingredients: otherIngredients || undefined,
          }
        : null;

    const productData = {
      name,
      slug,
      description: description || null,
      short_description: shortDescription || null,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      images,
      category,
      supplement_facts: supplementFacts,
      serving_instructions: servingInstructions || null,
      warnings: warnings || null,
      stock: parseInt(stock),
      sku: sku || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dietary_flags: dietaryFlags,
      status,
      featured,
    };

    const supabase = createClient();

    if (isEditing && product) {
      const { error: updateError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("products")
        .insert(productData);

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/dashboard/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Short Description
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          />
        </div>
      </section>

      {/* Pricing & Inventory */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading">Pricing & Inventory</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Compare at Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>
      </section>

      {/* Category & Tags */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading">
          Category & Classification
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Best Seller, New Arrival"
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Dietary Flags
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_FLAGS.map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleDietaryFlag(flag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  dietaryFlags.includes(flag)
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-muted border-border hover:border-primary/30"
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="text-sm font-medium">Featured product</span>
        </label>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading">Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface border border-border">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-error text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl"
              >
                x
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && <p className="text-xs text-muted">Uploading...</p>}
      </section>

      {/* Supplement Facts */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading">
          Supplement Facts (optional)
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Serving Size
            </label>
            <input
              type="text"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              placeholder="1 tablet"
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Servings Per Container
            </label>
            <input
              type="number"
              value={servingsPerContainer}
              onChange={(e) => setServingsPerContainer(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Nutrients</label>
            <button
              type="button"
              onClick={addNutrient}
              className="text-xs text-accent hover:text-accent-light font-medium"
            >
              + Add Nutrient
            </button>
          </div>
          {nutrients.map((nutrient, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={nutrient.name}
                onChange={(e) => updateNutrient(i, "name", e.target.value)}
                placeholder="Nutrient name"
                className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <input
                type="text"
                value={nutrient.amount}
                onChange={(e) => updateNutrient(i, "amount", e.target.value)}
                placeholder="Amount"
                className="w-28 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <input
                type="text"
                value={nutrient.daily_value || ""}
                onChange={(e) =>
                  updateNutrient(i, "daily_value", e.target.value)
                }
                placeholder="% DV"
                className="w-20 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button
                type="button"
                onClick={() => removeNutrient(i)}
                className="text-error text-xs px-2"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Other Ingredients
          </label>
          <input
            type="text"
            value={otherIngredients}
            onChange={(e) => setOtherIngredients(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </section>

      {/* Usage & Warnings */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading">Usage & Warnings</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Serving Instructions
          </label>
          <textarea
            value={servingInstructions}
            onChange={(e) => setServingInstructions(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Warnings</label>
          <textarea
            value={warnings}
            onChange={(e) => setWarnings(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          />
        </div>
      </section>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 border border-border rounded-lg text-sm font-medium hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
