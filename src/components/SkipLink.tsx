import { Button } from "@/components/ui/button";

const SkipLink = () => {
  return (
    <Button
      asChild
      variant="default"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4"
    >
      <a href="#main-content">Skip to main content</a>
    </Button>
  );
};

export default SkipLink;
