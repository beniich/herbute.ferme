'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  satisfactionDistribution: { name: string; value: number; color: string }[];
  monthlyTrend: { month: string; satisfied: number; neutral: number; unsatisfied: number }[];
  categoryRatings: { category: string; rating: number; max?: number }[];
};

export default function SatisfactionCharts({
  satisfactionDistribution,
  monthlyTrend,
  categoryRatings,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribution de Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution de la Satisfaction</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={satisfactionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {satisfactionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Évolution Mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de la Satisfaction</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="satisfied" stroke="#22c55e" name="Satisfaits" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#eab308" name="Neutres" strokeWidth={2} />
              <Line type="monotone" dataKey="unsatisfied" stroke="#ef4444" name="Insatisfaits" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Notes par Catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Satisfaction par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryRatings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#3b82f6" name="Note" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart - Performance Multi-critères */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Multi-critères</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={categoryRatings}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Radar name="Note" dataKey="rating" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
