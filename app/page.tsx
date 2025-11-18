import { ConverterForm } from '@/components/ConverterForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Convertidor de Números Romanos
          </h1>
          <p className="text-muted-foreground">
            Conversión bidireccional entre números arábigos y romanos (1-3999)
          </p>
        </header>

        <ConverterForm />

        <footer className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Estado: <span className="text-green-600 font-semibold">Operativo</span>
          </p>
          <p className="text-xs text-muted-foreground">
            API: <code className="bg-secondary px-2 py-0.5 rounded text-xs">/api/convert</code>
          </p>
        </footer>
      </div>
    </main>
  );
}
