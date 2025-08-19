import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Brain,
  TrendingUp,
  Target,
  Users,
  ShoppingBag,
  MapPin,
  Clock,
  DollarSign,
  Star,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

// Mock ML insights data
const userBehaviorData = [
  { hour: "00:00", buyers: 45, sellers: 12, orders: 8 },
  { hour: "06:00", buyers: 120, sellers: 28, orders: 23 },
  { hour: "12:00", buyers: 340, sellers: 67, orders: 89 },
  { hour: "18:00", buyers: 280, sellers: 54, orders: 76 },
  { hour: "22:00", buyers: 180, sellers: 34, orders: 34 },
];

const cropDemandData = [
  { name: "Tomatoes", demand: 85, supply: 72, price_trend: "+12%" },
  { name: "Maize", demand: 92, supply: 95, price_trend: "-3%" },
  { name: "Rice", demand: 78, supply: 68, price_trend: "+8%" },
  { name: "Beans", demand: 67, supply: 74, price_trend: "-5%" },
  { name: "Carrots", demand: 54, supply: 48, price_trend: "+15%" },
];

const regionalInsights = [
  { region: "Dar es Salaam", users: 523, orders: 1456, avg_order: 45000, growth: 23 },
  { region: "Arusha", users: 234, orders: 687, avg_order: 52000, growth: 18 },
  { region: "Mwanza", users: 189, orders: 423, avg_order: 38000, growth: 15 },
  { region: "Dodoma", users: 145, orders: 312, avg_order: 41000, growth: 12 },
];

const spendingPatterns = [
  { segment: "High Value", users: 156, avg_spend: 85000, frequency: 4.2 },
  { segment: "Regular", users: 432, avg_spend: 35000, frequency: 2.8 },
  { segment: "Occasional", users: 659, avg_spend: 15000, frequency: 1.2 },
];

const predictions = [
  {
    type: "Demand Forecast",
    item: "Tomatoes - Next Week",
    confidence: 87,
    prediction: "+25% increase",
    reasoning: "Seasonal patterns + weather data",
    impact: "High",
  },
  {
    type: "Price Alert",
    item: "Maize Prices",
    confidence: 92,
    prediction: "Price drop expected",
    reasoning: "Harvest season approaching",
    impact: "Medium",
  },
  {
    type: "User Churn",
    item: "At-risk buyers",
    confidence: 78,
    prediction: "23 users likely to churn",
    reasoning: "Reduced activity + engagement",
    impact: "High",
  },
];

const recommendations = [
  {
    title: "Optimize Tomato Supply",
    description: "Demand for tomatoes is expected to spike by 25% next week. Encourage sellers to increase inventory.",
    priority: "High",
    potential_impact: "TSh 2.3M additional revenue",
    action: "Send targeted notifications to tomato sellers",
  },
  {
    title: "Regional Expansion",
    description: "Mbeya region shows 40% higher engagement rates. Consider expanding marketing efforts.",
    priority: "Medium",
    potential_impact: "150+ new users",
    action: "Launch regional marketing campaign",
  },
  {
    title: "User Retention Campaign",
    description: "23 high-value users showing signs of disengagement. Implement retention strategy.",
    priority: "High",
    potential_impact: "TSh 1.2M retained revenue",
    action: "Personalized discount campaign",
  },
];

export const MLInsights = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastUpdate(new Date());
    }, 3000);
  };

  const InsightCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = "primary" 
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color?: string;
  }) => (
    <Card className="hover:shadow-primary transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {change}
              </p>
            )}
          </div>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            ML Insights & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights and predictions for platform optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>
      </div>

      {/* AI Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InsightCard
          title="Prediction Accuracy"
          value="87.3%"
          change="+2.1%"
          icon={Target}
          color="green-500"
        />
        <InsightCard
          title="Active Models"
          value="12"
          icon={Brain}
          color="blue-500"
        />
        <InsightCard
          title="Data Points Analyzed"
          value="2.3M"
          change="+450K"
          icon={BarChart}
          color="purple-500"
        />
        <InsightCard
          title="Insights Generated"
          value="47"
          change="+8"
          icon={Lightbulb}
          color="orange-500"
        />
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="demand">Demand Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={prediction.impact === "High" ? "destructive" : "secondary"}>
                        {prediction.type}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {prediction.confidence}% confidence
                      </div>
                    </div>
                    <h4 className="font-medium">{prediction.item}</h4>
                    <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary">{prediction.prediction}</span>
                      <Progress value={prediction.confidence} className="w-24" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Crop Demand Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Demand vs Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropDemandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#22c55e" name="Demand" />
                    <Bar dataKey="supply" fill="#3b82f6" name="Supply" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Activity Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userBehaviorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="buyers" stroke="#22c55e" strokeWidth={2} name="Buyers" />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>User Spending Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingPatterns.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{segment.segment}</div>
                        <div className="text-sm text-muted-foreground">
                          {segment.users} users • {segment.frequency}x/month avg
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">TSh {segment.avg_spend.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">avg spend</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={regionalInsights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="users" name="Users" />
                  <YAxis dataKey="orders" name="Orders" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.region}</p>
                            <p>Users: {data.users}</p>
                            <p>Orders: {data.orders}</p>
                            <p>Avg Order: TSh {data.avg_order.toLocaleString()}</p>
                            <p>Growth: {data.growth}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="orders" fill="#22c55e" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cropDemandData.map((crop, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{crop.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Demand</span>
                      <span>{crop.demand}%</span>
                    </div>
                    <Progress value={crop.demand} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Supply</span>
                      <span>{crop.supply}%</span>
                    </div>
                    <Progress value={crop.supply} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Price Trend</span>
                    <Badge variant={crop.price_trend.startsWith('+') ? 'default' : 'secondary'}>
                      {crop.price_trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="hover:shadow-primary transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                        <Badge variant={rec.priority === "High" ? "destructive" : "secondary"}>
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{rec.potential_impact}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Action: {rec.action}
                        </div>
                      </div>
                    </div>
                    <Button className="ml-4">
                      Implement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};