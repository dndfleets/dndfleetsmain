import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { testSupabaseConnection, ConnectionTestResult } from '@/utils/testSupabaseConnection';
import { runDiagnostics, DiagnosticResult } from '@/utils/runDiagnostics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ConnectionTest = () => {
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDiagnostics, setShowDiagnostics] = useState(true);

  const runTest = async () => {
    setIsLoading(true);
    const testResult = await testSupabaseConnection();
    setResult(testResult);
    
    // Run full diagnostics
    const diagnosticResults = await runDiagnostics();
    setDiagnostics(diagnosticResults);
    
    setIsLoading(false);
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Supabase Connection Test</CardTitle>
                <CardDescription>
                  Verify that your Supabase database is properly configured
                </CardDescription>
              </div>
              <Button
                onClick={runTest}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retest
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && !result && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {result && (
              <>
                <Alert variant={result.success ? 'default' : 'destructive'}>
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <AlertTitle className="font-semibold">
                        {result.message}
                      </AlertTitle>
                      {result.details && (
                        <AlertDescription className="mt-2 space-y-2">
                          {result.details.url && (
                            <div>
                              <strong>Supabase URL:</strong>{' '}
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {result.details.url}
                              </code>
                            </div>
                          )}
                          {result.details.tables && (
                            <div>
                              <strong>Tables found:</strong>{' '}
                              {result.details.tables.map((table, idx) => (
                                <Badge key={idx} variant="outline" className="ml-1">
                                  {table}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {result.details.error && (
                            <div className="mt-2 p-2 bg-destructive/10 rounded text-sm">
                              <strong>Error:</strong> {result.details.error}
                            </div>
                          )}
                        </AlertDescription>
                      )}
                    </div>
                  </div>
                </Alert>

                {result.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Environment variables configured</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Database connection successful</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Database tables exist</span>
                    </div>
                    {result.details?.error && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{result.details.error}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Next Steps</AlertTitle>
                      <AlertDescription>
                        {result.details?.error?.includes('does not exist') ? (
                          <ol className="list-decimal list-inside space-y-1 mt-2">
                            <li>Go to your Supabase project dashboard</li>
                            <li>Navigate to SQL Editor</li>
                            <li>Run the migration files from <code>supabase/migrations/</code> in order</li>
                            <li>Or use Supabase CLI: <code>supabase db push</code></li>
                          </ol>
                        ) : result.details?.error?.includes('environment variables') ? (
                          <ol className="list-decimal list-inside space-y-1 mt-2">
                            <li>Create a <code>.env</code> file in the project root</li>
                            <li>Add your Supabase credentials:
                              <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                              </pre>
                            </li>
                            <li>Restart your development server</li>
                          </ol>
                        ) : (
                          <p>Please check your Supabase configuration and try again.</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </>
            )}

            {/* Detailed Diagnostics */}
            {diagnostics.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Detailed Diagnostics</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive system check results
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                  >
                    {showDiagnostics ? 'Hide' : 'Show'} Details
                  </Button>
                </div>

                {showDiagnostics && (
                  <div className="space-y-3">
                    {diagnostics.map((diagnostic, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          diagnostic.status === 'pass'
                            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                            : diagnostic.status === 'fail'
                            ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                            : 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {diagnostic.status === 'pass' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          ) : diagnostic.status === 'fail' ? (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{diagnostic.check}</h4>
                              <Badge
                                variant={
                                  diagnostic.status === 'pass'
                                    ? 'default'
                                    : diagnostic.status === 'fail'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {diagnostic.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {diagnostic.message}
                            </p>
                            {diagnostic.details && (
                              <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 p-2 rounded">
                                {diagnostic.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Summary:</span>
                    <div className="flex gap-4">
                      <span className="text-green-600 dark:text-green-400">
                        ✓ {diagnostics.filter(d => d.status === 'pass').length} Passed
                      </span>
                      <span className="text-amber-600 dark:text-amber-400">
                        ⚠ {diagnostics.filter(d => d.status === 'warning').length} Warnings
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        ✗ {diagnostics.filter(d => d.status === 'fail').length} Failed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ConnectionTest;

