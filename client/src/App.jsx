
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import CountryDetailPage from "./pages/CountryDetailPage";
import PuzzlePage from "./pages/PuzzlePage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import GlobePage from "./pages/GlobePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/country/:id" element={<CountryDetailPage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/globe" element={<GlobePage />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
