import { getAdminDashboardMetrics } from '@/app/actions/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardChart from '@/components/DashboardChart'

// A simple helper function directly in the file since we might not have a helpers file yet
// Wait, we can just format it directly.
const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

export default async function AdminDashboard() {
    const metrics = await getAdminDashboardMetrics()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Comprehensive overview of company lead generation and sales performance.
                </p>
            </div>

            {/* Top Level Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Leads
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalLeads}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active + Closed</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Won / Lost
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                            {metrics.wonContacts} <span className="text-muted-foreground text-lg font-normal">/ {metrics.lostContacts}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Deals closed</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Conversion Rate
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on total leads</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pipeline Value
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatUSD(metrics.pipelineValue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all phases</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Leaderboard */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DashboardChart
                    data={metrics.leadsByStage}
                    title="Leads by Stage"
                    description="Distribution of leads across the pipeline"
                />

                <Card className="col-span-full xl:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle>Top Sales Reps</CardTitle>
                        <CardDescription>Leaderboard by won deals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metrics.topReps.length > 0 ? (
                                metrics.topReps.map((rep, idx) => (
                                    <div key={rep.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{rep.name}</p>
                                            </div>
                                        </div>
                                        <div className="font-bold">{rep.wonCount} won</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No won deals yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
