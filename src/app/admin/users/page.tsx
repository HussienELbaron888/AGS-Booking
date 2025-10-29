'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
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
        <CardTitle>{lang === 'en' ? 'User Management' : 'إدارة المستخدمين'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {lang === 'en' ? 'This interface would allow administrators to view, search, and manage user accounts. Actions could include viewing booking history, resetting passwords, or managing user roles.' : 'ستسمح هذه الواجهة للمسؤولين بعرض حسابات المستخدمين والبحث فيها وإدارتها. يمكن أن تشمل الإجراءات عرض سجل الحجز أو إعادة تعيين كلمات المرور أو إدارة أدوار المستخدمين.'}
        </p>
      </CardContent>
    </Card>
  );
}
