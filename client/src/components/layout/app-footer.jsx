const AppFooter = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <p className="text-center py-4">
        &copy; Cartopia {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default AppFooter;
