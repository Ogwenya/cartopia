import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

const CategoriesSidebar = ({ categories }) => {
  return (
    <>
      {categories.length === 0 ? (
        <div className="h-screen md:h-[80vh] bg-primary/65 flex items-center justify-center text-primary-foreground top-4">
          Product Categories
        </div>
      ) : (
        <ScrollArea className="h-screen md:h-[80vh] top-4">
          <div className="grid grid-cols-2 gap-2 px-5">
            {categories.map((category) => (
              <Card className="py-2 shadow-none" key={category.id}>
                <Link href={`/categories/${category.slug}`}>
                  <CardContent className="py-2">
                    <AspectRatio ratio={10 / 7}>
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full"
                      />
                    </AspectRatio>

                    <CardTitle className="mt-4">{category.name}</CardTitle>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default CategoriesSidebar;
