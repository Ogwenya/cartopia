import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCategories = ({ categories }) => {
  return (
    <section>
      <Card className="shadow-none border-none rounded-none">
        <CardHeader>
          <CardTitle className="max-md:text-sm">Shop by Categories</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
            {categories.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <div className="h-full transform overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
                  <div className="w-full aspect-square bg-background rounded-full border">
                    <img
                      src={category.image_url}
                      className="h-full w-full rounded-full max-h-full max-w-full bg-transparent mix-blend-multiply"
                      alt={category.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center justify-center p-0 py-3">
                    <span className="text-xs md:text-sm">{category.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FeatureCategories;
