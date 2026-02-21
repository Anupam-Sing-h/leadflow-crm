import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    const login = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return redirect('/login?error=Email+and+password+are+required')
        }

        const supabase = await createClient()

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            return redirect(`/login?error=${encodeURIComponent(signInError.message)}`)
        }

        revalidatePath('/', 'layout')
        redirect('/login') // The middleware will redirect them to the appropriate dashboard
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
            <Link href="/" className="flex items-center justify-center font-bold text-2xl tracking-tight text-gray-900 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <LayoutDashboard className="h-8 w-8 mr-2 stroke-[2.5]" />
                LeadFlow CRM
            </Link>
            <Card className="w-full max-w-sm shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={login} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive border border-destructive/20 bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground w-full">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
