# DecentraCore Frontend (App)

This project is the **frontend module** of the broader **DecentraCore ecosystem**, a full-stack blockchain portfolio demonstrating supply chain, finance, and real estate solutions on private EVM-compatible networks. It integrates directly with the other DecentraCore modules (backend API, local blockchain node, event listeners, and database services).

---

## 📌 Project Overview

Originally bootstrapped from an old **Angular template that relied on jQuery AJAX**, this codebase has been **refactored and modernized** into a **fully functional Web3-enabled Angular frontend**.  
It now leverages **TypeScript, Angular best practices, and Web3 integrations** to interact seamlessly with the DecentraCore smart contracts and backend services.

The app connects to:
- **DecentraCore Blockchain Module** → Provides the Hardhat-based private network, deployed smart contracts, and WebSocket event streaming.
- **DecentraCore Backend (Express + MongoDB)** → Serves as the RESTful API for querying contract data, retrieving event logs, and interacting with the database.
- **DecentraCore Metadata Service** → Manages NFT and escrow metadata for the Real Estate module.

This tight coupling allows the frontend to present **real-time, verifiable blockchain interactions** in the domains of:
- **Finance**: Constant Product AMM (CPAMM), Constant Sum AMM (CSAMM), and Order Book Market Maker (OBMM).
- **Supply Chain**: Inventory management and provenance tracking.
- **Real Estate**: Escrow contracts, escrow factories, and NFT marketplace (ERC-1155).

---

## 📂 Project Structure

```
app/
├── angular.json          # Angular workspace configuration
├── Dockerfile            # Container build definition for frontend deployment
├── nginx.conf            # Nginx config for serving Angular dist files
├── package.json          # Dependencies and scripts
├── run.bat               # Windows helper script for building/running container
├── src/                  # Angular application source
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── app/
│   │   ├── app.module.ts
│   │   ├── app.component.ts / html / css
│   │   ├── blockchain/   # Smart contract ABIs and Web3 integration layer
│   │   └── ...           # Angular components and services
│   └── assets/           # Static assets (icons, images, metadata)
```

> **Note**: If you encounter any extracted folders named `api/`, this is a typo and should be read as `app/`.

---

## 🚀 Features

- **Web3-Enabled Angular Frontend** – Interacts with EVM-compatible contracts deployed on Hardhat.
- **Smart Contract ABIs Embedded** – Supports Finance (CPAMM, CSAMM, OBMM), Supply Chain (Inventory, Provenance), and Real Estate (Escrow, Factory, NFT).
- **Modular Integration** – Works seamlessly with DecentraCore backend and blockchain listeners.
- **Dockerized Deployment** – Built and served using Nginx inside a lightweight container.
- **Professional Refactor** – Migrated from outdated jQuery AJAX calls to TypeScript services using Angular’s HttpClient and Web3 libraries.

---

## 🛠️ Development

### Install dependencies
```bash
npm install
```

### Run locally
```bash
ng serve
```

The app will be available at `http://localhost:4200/`.

### Build for production
```bash
ng build --configuration production
```

### Run with Docker
```bash
docker build -t app:prod .
docker run -d -p 8080:80 --name app app:prod
```

---

## 🌐 Integration with DecentraCore

This module is designed to operate as the **frontend layer** of the DecentraCore ecosystem:

1. **Blockchain Module**  
   Provides local private EVM-compatible network (Hardhat) with deployed smart contracts.  
   This frontend consumes ABI files from the `/app/src/app/blockchain/abis` directory.

2. **Backend API (Express + MongoDB)**  
   REST endpoints (`/api/...`) return structured data from contract events and DB.  
   Angular HttpClient replaces the old jQuery AJAX calls.

3. **Event Listeners**  
   Containerized Node.js services keep MongoDB in sync with blockchain events.  
   This frontend queries the DB through the backend.

4. **Metadata Server**  
   Used in Real Estate module to serve NFT metadata for escrowed properties.

---

## 📖 About DecentraCore

DecentraCore is a **personal portfolio and resume project** demonstrating **end-to-end blockchain engineering**:  
- Smart contracts (Solidity, Hardhat)  
- Event listeners (Node.js, WebSocket, MongoDB)  
- REST backend (Express, TypeScript, MongoDB)  
- Full-stack frontend (Angular, Ionic, Web3)  

This frontend project showcases how blockchain can power **Finance, Supply Chain, and Real Estate applications**, while serving as a proof of professional **Web3 full-stack development skills**.

---

## 📜 License

This project is licensed under the MIT License.  
See the LICENSE file for details.

---

**Maintainer**: Emmanuel (DecentraCore)  
**Role**: Blockchain Engineer & Full-Stack Developer  
