'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";

export default function AdminPage() {
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

  const stats = [
    {
      title: lang === 'en' ? "Total Revenue" : "إجمالي الإيرادات",
      value: `$${mockData.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      change: "+20.1% from last month",
      color: "bg-green-100",
    },
    {
      title: lang === 'en' ? "Subscriptions" : "الاشتراكات",
      value: `+${mockData.subscriptions.toLocaleString()}`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      change: "+180.1% from last month",
      color: "bg-blue-100",
    },
    {
      title: lang === 'en' ? "Sales" : "المبيعات",
      value: `+${mockData.sales.toLocaleString()}`,
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      change: "+19% from last month",
      color: "bg-purple-100",
    },
    {
      title: lang === 'en' ? "Active Now" : "النشطون الآن",
      value: `+${mockData.activeNow.toLocaleString()}`,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      change: "+201 since last hour",
      color: "bg-yellow-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{lang === 'en' ? 'Dashboard' : 'لوحة التحكم'}</h1>
        <Button asChild>
            <Link href="/admin/events">
                <PlusCircle className="mr-2 h-4 w-4" />
                {lang === 'en' ? 'Add New Event' : 'إضافة حدث جديد'}
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{lang === 'en' ? 'Welcome to the Admin Panel' : 'مرحباً بك في لوحة الإدارة'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {lang === 'en' ? 'Use the sidebar to manage events, bookings, users, and view analytics.' : 'استخدم الشريط الجانبي لإدارة الأحداث والحجوزات والمستخدمين وعرض التحليلات.'}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={stat.color}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
