import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string, message?: string }>
}) {
    const { error, message } = await searchParams

    const signup = async (formData: FormData) => {
        'use server'

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const role = formData.get('role') as string // Admin or SalesRep

        if (!name || !email || !password || !role) {
            return redirect('/signup?error=All+fields+are+required')
        }

        const supabase = await createClient()

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role, // Assigning role via user_metadata
                }
            }
        })

        if (signUpError) {
            return redirect(`/signup?error=${encodeURIComponent(signUpError.message)}`)
        }

        // Success, generally Supabase requires email verification unless auth.email.enable_confirmations is false
        return redirect('/signup?message=Check+your+email+to+continue+sign+in+process')
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to access the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signup} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive border border-destructive/20 bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 text-sm text-green-700 border border-green-200 bg-green-50 rounded-md">
                                {message}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                            />
                        </div>
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
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                name="role"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="SalesRep">Sales Rep</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground w-full">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
