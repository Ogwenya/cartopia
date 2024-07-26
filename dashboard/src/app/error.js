"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({ error, reset }) => {
  return (
    <section>
      <div className="section-spacing mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600">
            ERROR
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl">
            Internal Server Error.
          </p>
          <p className="mb-4 text-lg font-light text-red-600">
            {error.message}
          </p>

          <Button onClick={() => reset()}>Refresh The Page</Button>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
