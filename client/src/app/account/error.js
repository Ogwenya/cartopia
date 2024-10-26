"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({ error, reset }) => {
  return (
    <section>
      <div className="mx-auto">
        <div className="mx-auto text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold text-red-600">
            ERROR
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold">
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
