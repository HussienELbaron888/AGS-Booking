'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(document.documentElement.lang || 'en');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          setLang(document.documentElement.lang || 'en');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lang === 'en' ? 'Analytics' : 'التحليلات'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {lang === 'en' ? 'This section would feature detailed charts and reports on ticket sales, revenue, event popularity, and user demographics to provide insights into event performance.' : 'سيعرض هذا القسم مخططات وتقارير مفصلة عن مبيعات التذاكر والإيرادات وشعبية الحدث والتركيبة السكانية للمستخدمين لتوفير رؤى حول أداء الحدث.'}
        </p>
      </CardContent>
    </Card>
  );
}
