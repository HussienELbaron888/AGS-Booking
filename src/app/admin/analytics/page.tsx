'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setLang(html.lang || 'en');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
    setLang(html.lang || 'en'); // Initial set

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
