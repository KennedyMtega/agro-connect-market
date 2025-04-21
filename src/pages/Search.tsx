
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import MapView from "@/components/map/MapView";
import ListView from "@/components/search/ListView";

const Search = () => {
  const [viewMode, setViewMode] = useState("categories");

  return (
    <Layout>
      <div className="container py-6">
        <Tabs defaultValue="categories" value={viewMode} onValueChange={setViewMode} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <ListView />
          </TabsContent>
          
          <TabsContent value="map">
            <div className="bg-background rounded-lg min-h-[600px] flex flex-col">
              <MapView className="h-[600px]" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Search;
