const LoadingComponent = () => {
  return (
    <section className="flex flex-col justify-center items-center min-h-[80dvh]">
      <div className="relative">
        <div className="p-16 bg-blue-500 rounded-full animate-ping"></div>
        <img
          src="/images/logo-icon.png"
          className="absolute inset-0 m-auto animate-none"
        />
      </div>
      <p>Loading...</p>
    </section>
  );
};

export default LoadingComponent;
