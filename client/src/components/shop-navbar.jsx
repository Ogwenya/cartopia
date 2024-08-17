import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const ShopNavbar = ({ brands, categories }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div className="flex items-center gap-x-5">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              Brands <ChevronDownIcon className="ml-1.5 h-5 w-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-6">
              {brands.map((brand) => (
                <Link
                  className="text-sm text-muted-foreground hover:underline"
                  href={`/brands/${brand.slug}`}
                  key={brand.id}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              Categories <ChevronDownIcon className="ml-1.5 h-5 w-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-6">
              {categories.map((category) => (
                <Link
                  className="text-sm text-muted-foreground hover:underline"
                  href={`/categories/${category.slug}`}
                  key={category.id}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default ShopNavbar;
