const Footer = () => {
  return (
    <footer className="border-t border-border bg-white text-center text-muted-foreground py-8 px-4 text-sm">
      <p>&copy; {new Date().getFullYear()} Food App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
