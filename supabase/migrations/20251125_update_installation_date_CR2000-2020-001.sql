-- Insertar o actualizar la máquina CR2000-2020-001 de forma idempotente
INSERT INTO public.machines (name, model, serial_number, installation_date, created_at, updated_at)
VALUES ('Máquina Tostadora de Café', 'Torrecaf Eléctrica TN-1', 'CR2000-2020-001', '2020-12-31', now(), now())
ON CONFLICT (serial_number) DO UPDATE
SET name = EXCLUDED.name,
    model = EXCLUDED.model,
    installation_date = EXCLUDED.installation_date,
    updated_at = now();

-- Verificar el cambio (muestra la fila que debe aparecer en el panel)
SELECT id, name, model, serial_number, installation_date, updated_at
FROM public.machines
WHERE serial_number = 'CR2000-2020-001';