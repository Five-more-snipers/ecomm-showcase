import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/components/Providers';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import OrderModal from '@/components/order/OrderModal';
import QuickViewModal from '@/components/home/QuickViewModal';

export const metadata: Metadata = {
  title: 'Marketplace Showcase — Modern E-Commerce Platform',
  description: 'A realistic, test-friendly mock e-commerce demonstration platform built with Next.js, Spring Boot 3, and Oracle Database.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopBar />
          <Header />
          {children}
          <Footer />

          {/* Interactive Global Drawers & Modals */}
          <CartDrawer />
          <CheckoutModal />
          <OrderModal />
          <QuickViewModal />
        </Providers>
      </body>
    </html>
  );
}
