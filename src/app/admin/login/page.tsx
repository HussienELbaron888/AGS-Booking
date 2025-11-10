'use client';

import { useState, FormEvent, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);

  useEffect(() => {
    // Set initial language
    const initialLang = document.documentElement.lang || 'en';
    setLang(initialLang);

    // Observe changes to the lang attribute on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          setLang(document.documentElement.lang || 'en');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // If user is already logged in, redirect to admin dashboard
    if (user && !authLoading) {
      router.push('/admin');
    }
    
    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [user, authLoading, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
      if (lang === 'ar') {
        setError('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
      } else {
        setError('Login failed. Please check your email and password.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return <div className="flex items-center justify-center h-screen"><p>{lang === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p></div>;
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-right">
          <CardTitle className="text-2xl">{lang === 'ar' ? 'تسجيل دخول المدير' : 'Admin Login'}</CardTitle>
          <CardDescription>
            {lang === 'ar'
              ? 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم.'
              : 'Enter your credentials to access the admin panel.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="email">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="password">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? (lang === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Logging in...')
                : (lang === 'ar' ? 'تسجيل الدخول' : 'Login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
