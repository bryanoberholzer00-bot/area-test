# area-test

## Mini DOOM Demo

Open `doom.html` in a browser to play a tiny raycasting experiment inspired by the original DOOM. Use the **WASD** keys to move forward, back, and strafe, and use the **left** and **right** arrow keys to turn.

## Eleições Brasil 2026 – risultati in tempo reale

App (`eleicoes-brasil/`) che mostra i risultati delle presidenziali brasiliane usando i dati ufficiali del TSE
(`resultados.tse.jus.br`). Nessuna dipendenza: serve Node 18+.

```bash
cd eleicoes-brasil
node server.js        # poi apri http://localhost:3000
```

Il server fa da proxy con cache di 15 s verso il TSE (evita problemi CORS); la pagina si aggiorna ogni 20 s e mostra
candidati, percentuale di sezioni scrutinate, voti bianchi/nulli, affluenza e il dettaglio per stato.
Variabili opzionali: `PORT`, `TSE_CYCLE` (default `ele2026`), `TSE_ELECTION` (default `6257`, 1º turno;
per il ballottaggio usa il codice indicato in `https://resultados.tse.jus.br/oficial/comum/config/ele-c.json`).
