# 🏎️ F1FF - F1 Live Telemetry

Um aplicativo mobile premium para acompanhamento ao vivo de corridas de Fórmula 1. Projetado com arquitetura escalável e focado em transmissão de dados de ultra-baixa latência (< 250ms), permitindo a visualização de posições, tempos e mapas em tempo real.

---

## 📱 Visão Geral

O F1FF foi desenvolvido para entregar uma experiência próxima à utilizada por equipes e engenheiros durante uma corrida de Fórmula 1, permitindo acompanhar a movimentação dos pilotos em tempo real através de um mapa interativo, leaderboard dinâmico e atualizações contínuas de telemetria.

A aplicação utiliza uma arquitetura moderna baseada em WebSockets para garantir sincronização instantânea entre servidor e clientes conectados.

---

## 🏗️ Arquitetura

### Frontend

- React Native
- Expo SDK
- TypeScript
- Zustand
- React Native SVG
- React Native Reanimated

### Backend

- Python 3.12+
- FastAPI
- Uvicorn
- WebSockets
- Pydantic

---

## 🛠️ Stack de Tecnologias

### Frontend (Feature-Based Architecture)

| Tecnologia | Função |
|------------|---------|
| React Native | Desenvolvimento mobile multiplataforma |
| Expo SDK | Ferramentas e build do aplicativo |
| TypeScript | Tipagem estática |
| Zustand | Gerenciamento de estado global |
| React Native SVG | Renderização do circuito |
| Reanimated | Animações suaves em 60 FPS |

### Backend (Clean Architecture)

| Tecnologia | Função |
|------------|---------|
| Python 3.12+ | Linguagem principal |
| FastAPI | API de alta performance |
| Uvicorn | Servidor ASGI |
| WebSockets | Comunicação em tempo real |
| Pydantic | Validação e serialização de dados |

---

## 🚀 Funcionalidades

### Telemetria em Tempo Real

- Atualizações contínuas via WebSocket
- Latência inferior a 250ms
- Broadcast simultâneo para múltiplos clientes

### Mapa Interativo

- Circuito renderizado em SVG
- Movimentação suave dos pilotos
- Interpolação matemática das posições

### Leaderboard Dinâmico

- Posição dos pilotos
- Diferença entre competidores
- Atualização automática sem refresh

### Gerenciamento Global de Estado

- Estado centralizado com Zustand
- Atualizações eficientes
- Baixo consumo de recursos

---

## 📂 Estrutura do Projeto

```text
f1ff/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── simulators/
│   │   ├── models/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   │
│   └── App.tsx
│
└── README.md
```

---

## ✅ Status Atual

- [x] Estrutura modular configurada
- [x] TypeScript configurado
- [x] Backend FastAPI funcional
- [x] Servidor WebSocket ativo
- [x] Simulador interno de telemetria
- [x] Atualizações em tempo real a cada 250ms
- [x] Gerenciamento global de estado
- [x] Mapa SVG animado
- [x] Interpolação suave dos pilotos

---

## 📦 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/Guilherme-Sa-1/f1ff.git

cd f1ff
```

---

## 🔧 Executando o Backend

Acesse a pasta do backend:

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python -m venv venv
```

### Ativação do ambiente virtual

#### Windows (PowerShell)

```bash
venv\Scripts\activate
```

#### Windows (Git Bash)

```bash
source venv/Scripts/activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Instalar dependências

```bash
pip install fastapi uvicorn pydantic websockets
```

### Iniciar servidor

```bash
uvicorn app.main:app --reload
```

Servidor disponível em:

```text
http://localhost:8000
```

---

## 📱 Executando o Frontend

Abra um novo terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start -c
```

### Opções de execução

- Pressione `w` para abrir no navegador
- Pressione `a` para Android Emulator
- Pressione `i` para iOS Simulator (macOS)
- Utilize o aplicativo Expo Go para abrir pelo QR Code

---

## 🔌 WebSocket

Endpoint de comunicação em tempo real:

```text
ws://localhost:8000/ws
```

Exemplo de payload:

```json
{
  "driverId": "VER",
  "position": 1,
  "lap": 12,
  "x": 412.5,
  "y": 287.3,
  "gap": 0.0
}
```

---

## 🎯 Objetivos Futuros

- [ ] Integração com API oficial da Fórmula 1
- [ ] Histórico de voltas
- [ ] Setores em tempo real
- [ ] Estratégias de pit stop
- [ ] Comparação entre pilotos
- [ ] Replay de corridas
- [ ] Sistema de notificações
- [ ] Modo escuro
- [ ] Estatísticas avançadas

---

## 📈 Performance

### Metas

| Métrica | Objetivo |
|----------|----------|
| Latência | < 250ms |
| FPS | 60 |
| Reconexão | Automática |
| Consumo de memória | Otimizado |
| Escalabilidade | Multiusuário |

---

## 🤝 Contribuição

Contribuições são bem-vindas.

1. Faça um fork do projeto
2. Crie uma branch para sua feature

```bash
git checkout -b feature/minha-feature
```

3. Faça commit das alterações

```bash
git commit -m "feat: nova funcionalidade"
```

4. Faça push para sua branch

```bash
git push origin feature/minha-feature
```

5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

## 👨‍💻 Autor

**Guilherme Sá**

- GitHub: https://github.com/Guilherme-Sa-1
- LinkedIn: https://linkedin.com/in/guilhermesadev

---

### 🏁 F1FF — Real-Time Formula 1 Telemetry Platform