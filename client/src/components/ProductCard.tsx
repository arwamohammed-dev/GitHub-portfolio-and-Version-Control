import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-card group">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] w-full overflow-hidden bg-secondary relative">
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
              loading="lazy"
            />
            <Badge className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-sm shadow-sm">
              {product.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-5">
          <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto bg-secondary/20">
          <span className="font-bold text-lg text-primary">
            {formatCurrency(product.price)}
          </span>
          <Button size="sm" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
