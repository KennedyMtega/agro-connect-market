
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import MapView from "@/components/map/MapView";
import ListView from "@/components/search/ListView";

const Search = () => {
  const [viewMode, setViewMode] = useState("list");

  return (
    <Layout>
      <div className="container py-6">
        <Tabs defaultValue="list" value={viewMode} onValueChange={setViewMode} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            <ListView />
          </TabsContent>
          
          <TabsContent value="map" className="mt-4">
            <div className="bg-background rounded-lg shadow-md border border-border">
              <MapView className="h-[70vh] md:h-[80vh]" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Search;
