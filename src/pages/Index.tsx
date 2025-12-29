import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import PaymentModal from '@/components/PaymentModal';
import { Product } from '@/types/payment';
import { getProducts } from '@/services/paymentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const handleBuyNow = (product: Product) => {
    console.log('Buy now clicked for:', product.name);
    setSelectedProduct(product);
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechStore
              </h1>
              <p className="text-sm text-muted-foreground">
                Demo Razorpay Integration with TanStack Query
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Demo Mode</AlertTitle>
            <AlertDescription className="text-blue-800">
              This is a dummy Razorpay integration. No real payments will be processed. 
              The payment flow simulates the actual Razorpay checkout experience.
            </AlertDescription>
          </Alert>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">
            Browse our collection and try the payment flow
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-56 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to load products</h3>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {products && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground">Check back later for new items</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with React, TanStack Query, Shadcn UI, and Razorpay (Demo)
          </p>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        product={selectedProduct}
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
      />
    </div>
  );
};

export default Index;
