import type { SupplementFacts as SupplementFactsType } from "@/types/product";

export default function SupplementFacts({
  facts,
}: {
  facts: SupplementFactsType;
}) {
  return (
    <div className="border-2 border-primary rounded-lg p-4 max-w-sm">
      <h3 className="text-xl font-black border-b-8 border-primary pb-1 mb-1">
        Supplement Facts
      </h3>
      <p className="text-xs border-b border-primary pb-1 mb-1">
        Serving Size: {facts.serving_size}
      </p>
      <p className="text-xs border-b-4 border-primary pb-1 mb-2">
        Servings Per Container: {facts.servings_per_container}
      </p>

      {/* Header */}
      <div className="flex justify-between text-xs font-bold border-b border-primary pb-1 mb-1">
        <span></span>
        <div className="flex gap-4">
          <span>Amount</span>
          <span className="w-12 text-right">% DV</span>
        </div>
      </div>

      {/* Nutrients */}
      {facts.nutrients.map((nutrient, i) => (
        <div
          key={i}
          className="flex justify-between text-xs py-0.5 border-b border-primary/20"
        >
          <span className="font-semibold">{nutrient.name}</span>
          <div className="flex gap-4">
            <span>{nutrient.amount}</span>
            <span className="w-12 text-right">
              {nutrient.daily_value || "†"}
            </span>
          </div>
        </div>
      ))}

      <p className="text-[10px] text-muted mt-2">
        † Daily Value not established.
      </p>

      {facts.other_ingredients && (
        <div className="mt-3 pt-2 border-t border-primary">
          <p className="text-xs">
            <span className="font-bold">Other Ingredients: </span>
            {facts.other_ingredients}
          </p>
        </div>
      )}
    </div>
  );
}
