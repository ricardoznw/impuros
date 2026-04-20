"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ADMIN_PERMISSION = BigInt(8); 

const MAPA_CARGOS: Record<string, { nome: string; cor: string }> = {
  "1475282135605706884": { nome: "WEareSmokers", cor: "#a0b4a9" },
  "1475281746873421995": { nome: "FuckingDamon", cor: "#3b0000" },
  "1475281472553222236": { nome: "TurismHell", cor: "#180808" },
  "1475280921853821029": { nome: "Supremacxy", cor: "#030303" },
};
  const formatarDataId = (id: string) => {
    if (!id) return "...";
    try {
      const binario = BigInt(id).toString(2).padStart(64, '0');
      const timestamp = parseInt(binario.substring(0, 42), 2) + 1420070400000;
      return new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return "Erro no ID";
    }
  };
export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [guildData, setGuildData] = useState<any>({
  name: "IMPUROS",
  iconURL: "/logo.jpg"
});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session }: any = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [memberData, setMemberData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [guildRoles, setGuildRoles] = useState<any[]>([]);

  const GUILD_ID = "1465143401975386247";

  useEffect(() => {
  if (session?.accessToken) {
    console.log("Token detectado, chamando API do Discord...");

    fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
    .then(async (res) => {
      console.log("Status da Resposta:", res.status);
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Erro da API do Discord:", data);
        return;
      }

      console.log("Dados recebidos com sucesso!");
      setMemberData(data);
    })
    .catch((err) => console.error("Erro de conexão:", err));
  } else {
    console.warn("Sessão ativa, mas sem AccessToken encontrado.");
  }
}, [session?.accessToken]); // Ele VAI rodar sempre que o token mudar // Ele vai rodar toda vez que a sessão carregar
  const decToHex = (color: number) => {
    if (!color) return "#99aab5"; 
    return `#${color.toString(16).padStart(6, '0')}`;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#313338] text-white p-6">
      {session ? (
        <div className="flex flex-col items-center w-full max-w-4xl">
          {/* BANNER ESTILIZADO */}
<div className="w-full h-40 bg-gradient-to-r from-red-900 via-black to-black rounded-3xl mb-[-60px] border border-white/5 shadow-2xl overflow-hidden">
  <div className="w-full h-full bg-black/30 backdrop-blur-[2px]" />
</div>

{/* INFO DO SERVIDOR E PERFIL */}
<div className="flex flex-col items-center z-10 w-full">
  {/* Ícone do Servidor */}
  <div className="relative mb-4">
    <img 
  src={guildData.iconURL} 
  alt="Server Icon" 
  className="w-32 h-32 rounded-[2rem] border-4 border-[#0a0a0b] shadow-2xl bg-[#2b2d31] object-cover"
/>
  </div>
  
  <div className="text-center">
    {/* Nome do Servidor em destaque */}
    <p className="text-red-500 font-black tracking-[0.3em] text-[10px] uppercase mb-1 drop-shadow-md">
      {guildData?.name || "CARREGANDO SERVER..."}
    </p>
    
    {/* Seu Nome com o ícone de usuário ao lado */}
    <div className="flex items-center justify-center gap-3">
      <div className="relative">
        <img 
          src={session.user?.image ?? ""} 
          className="w-10 h-10 rounded-full border-2 border-red-600/50" 
          alt="User"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#313338]"></div>
      </div>
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">
        {memberData?.nick || session.user?.name}
      </h1>
    </div>
  </div>
</div>

          {/* LISTA DE CARGOS */}
<div className="flex flex-wrap justify-center gap-2 mt-4 mb-8">
  {memberData && memberData.roles ? (
    memberData.roles.map((roleId: string) => {
      const cargoFixo = MAPA_CARGOS[roleId];
      if (!cargoFixo) return null;

      return (
        <span 
          key={roleId}
          className="px-3 py-1 rounded-full text-[10px] font-bold border transition-all hover:scale-110"
          style={{ 
            borderColor: cargoFixo.cor, 
            color: cargoFixo.cor, 
            backgroundColor: `${cargoFixo.cor}15` 
          }}
        >
          {cargoFixo.nome}
        </span>
      );
    })
  ) : (
    <span className="text-gray-600 text-[10px] uppercase tracking-widest animate-pulse">
      Sincronizando cargos...
    </span>
  )}
</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
  {/* CARD 1: IDADE DA CONTA GLOBAL */}
  <StatCard 
    title="Conta Criada" 
    value={session.user?.id ? formatarDataId(session.user.id) : "..."} 
    sub="No Discord"
  />

  {/* CARD 2: STATUS DE BOOSTER / VIP */}
  <StatCard 
  title="Status Especial" 
  value={
    (BigInt(memberData?.permissions || 0) & ADMIN_PERMISSION) === ADMIN_PERMISSION 
      ? "ADMINISTRADOR" 
      : memberData?.premium_since 
        ? "BOOSTER" 
        : "MEMBRO"
  } 
  sub={
    (BigInt(memberData?.permissions || 0) & ADMIN_PERMISSION) === ADMIN_PERMISSION
      ? "Poder total no sistema"
      : memberData?.premium_since 
        ? "Apoiando o servidor" 
        : "Hub oficial"
  }
  // Passamos o tipo para mudar a cor
  statusType={
    (BigInt(memberData?.permissions || 0) & ADMIN_PERMISSION) === ADMIN_PERMISSION 
      ? "admin" 
      : memberData?.premium_since 
        ? "booster" 
        : "default"
  }
/>

  {/* CARD 3: MEMBRO DESDE (O que já temos) */}
  <StatCard 
  title="Membro desde" 
  value={memberData?.joined_at ? new Date(memberData.joined_at).toLocaleDateString('pt-BR') : "Sincronizando..."} 
  sub="Hub Impuros"
/>
</div>

          <button onClick={() => signOut()} className="mt-12 text-gray-400 hover:text-red-500 transition-colors">
            Sair da Conta
          </button>
        </div>
      ) : (
        <button onClick={() => signIn("discord")} className="bg-[#5865f2] px-8 py-4 rounded-xl font-bold text-xl hover:bg-[#4752c4] transition-all">
          Entrar com Discord
        </button>
      )}
    </main>
  );
}

// Sub-componente para os cards não repetirem código
function StatCard({ 
  title, 
  value, 
  sub, 
  statusType = "default" // Adicionado aqui!
}: { 
  title: string; 
  value: string; 
  sub: string; 
  statusType?: "admin" | "booster" | "default"; 
}) {
  // Configuração das cores baseada no status
  const styles = {
    admin: { border: "border-red-600", text: "text-red-500", bg: "bg-red-500/10" },
    booster: { border: "border-[#ff73fa]", text: "text-[#ff73fa]", bg: "bg-[#ff73fa]/10" },
    default: { border: "border-[#3f4147]", text: "text-white", bg: "bg-transparent" }
  };

  const style = styles[statusType];

  return (
    <div className={`bg-[#2b2d31] p-6 rounded-2xl border ${style.border} shadow-lg hover:border-[#5865F2] transition-all group ${style.bg}`}>
      <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest mb-1">{title}</p>
      <p className={`text-2xl font-black ${style.text} group-hover:text-[#5865F2] transition-colors`}>
        {value}
      </p>
      <p className="text-[10px] text-gray-500 mt-2 font-medium">{sub}</p>
    </div>
  );
}