import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const t = setTimeout(() => navigate("/"), 8000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-base/10 blur-[150px] pointer-events-none" />
      <div className="max-w-md text-center glass-panel rounded-3xl p-10 relative z-10">
        <div className="flex justify-center mb-6">
          {sessionId ? (
            <CheckCircle2 className="w-16 h-16 text-gold-base animate-float" />
          ) : (
            <Sparkles className="w-16 h-16 text-white/40" />
          )}
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-3">
          {sessionId ? "Bienvenido al Club" : "Algo no salió bien"}
        </h1>
        <p className="text-white/60 mb-8">
          {sessionId
            ? "Tu ascensión está en marcha. Recibirás un correo de confirmación."
            : "No encontramos información de tu pago."}
        </p>
        <Button variant="gold" size="lg" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    </main>
  );
};

export default CheckoutReturn;
