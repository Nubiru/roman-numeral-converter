'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ConversionResult {
  result: string | number;
  type: 'toRoman' | 'toArabic';
}

export function ConverterForm() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      toast.error('Por favor ingresa un valor');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: trimmedValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error en la conversión');
        return;
      }

      const data: ConversionResult = await response.json();
      setResult(data.result);
      toast.success('Conversión exitosa');
    } catch {
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Convertidor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="converter-input" className="text-sm font-medium">
              Valor a convertir
            </label>
            <Input
              id="converter-input"
              type="text"
              placeholder="Ej: 42 o XIV"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Convirtiendo...' : 'Convertir'}
          </Button>

          {result !== null && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Resultado</p>
              <p className="text-2xl font-bold">{result}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
