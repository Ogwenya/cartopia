import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <section className="h-full">
      <div className="section-spacing mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-primary/80 md:text-4xl">
            Not Found.
          </p>
          <p className="mb-4 text-lg font-light text-zinc-500">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p>
          <Button asChild>
            <Link href="/">Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
