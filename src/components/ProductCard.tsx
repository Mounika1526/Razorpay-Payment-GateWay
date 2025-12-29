import React from 'react';
import { ShoppingCart, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/payment';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white">
          {product.category}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
          <IndianRupee className="h-6 w-6" />
          <span>{product.price.toLocaleString('en-IN')}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onBuyNow(product)}
          className="w-full group/btn"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover/btn:scale-110" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
