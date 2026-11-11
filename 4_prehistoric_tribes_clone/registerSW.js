// Local dev clone mode: clear any stale Service Worker so upcoming optimizations reload immediately.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {}
  });
}
