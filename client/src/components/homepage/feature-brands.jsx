import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureBrands = ({ brands }) => {
  return (
    <section>
      <Card className="shadow-none border-none rounded-none bg-secondary">
        <CardHeader>
          <CardTitle className="max-md:text-sm">Shop by Brands</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-x-2 gap-y-4 flex-wrap">
            {brands.map((brand) => (
              <Link href={`/brands/${brand.slug}`} key={brand.id}>
                <div className="h-full transform overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-background rounded border">
                    <img
                      src={brand.image_url}
                      className="h-full w-full rounded max-h-full max-w-full bg-transparent mix-blend-multiply"
                      alt={brand.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center justify-center p-0 py-3">
                    <span className="text-xs md:text-sm">{brand.name}</span>
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

export default FeatureBrands;
