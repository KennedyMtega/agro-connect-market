
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CropType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface CropTypeListProps {
  cropTypes: CropType[];
  onSelect: (id: string) => void;
}

const CropTypeCard = ({ cropType, onSelect }: { cropType: CropType, onSelect: (id: string) => void }) => {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all" 
      onClick={() => onSelect(cropType.id)}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-4xl mb-2">{cropType.icon}</div>
        <h3 className="font-medium text-lg mb-1">{cropType.name}</h3>
        <p className="text-xs text-muted-foreground">{cropType.description}</p>
      </CardContent>
    </Card>
  );
};

const CropTypeList: React.FC<CropTypeListProps> = ({ cropTypes, onSelect }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">What would you like to haul today?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cropTypes.map((cropType) => (
          <CropTypeCard
            key={cropType.id}
            cropType={cropType}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
};

export default CropTypeList;
