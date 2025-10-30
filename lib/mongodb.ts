/**
 * ============================================================================
 * MONGODB CONNECTION - TradeStars Portal
 * ============================================================================
 *
 * Cliente MongoDB singleton com connection pooling otimizado
 *
 * CONFIGURAÇÃO:
 * - Cluster: cluster0.suk3y4n.mongodb.net
 * - Database: PortalDaEquipe
 * - User: di01
 *
 * USO:
 * import { getDatabase, getClient } from '@/lib/mongodb';
 * const db = await getDatabase();
 * const users = await db.collection('users').find().toArray();
 *
 * ============================================================================
 */

import { MongoClient, type Db } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const MONGODB_DB = process.env.MONGODB_DB || "PortalDaEquipe"

if (!MONGODB_URI) {
  throw new Error("⚠️ Por favor, defina a variável MONGODB_URI no arquivo .env")
}

// Opções de conexão otimizadas
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Singleton pattern para reutilizar conexão
if (process.env.NODE_ENV === "development") {
  // Em desenvolvimento, usar variável global para preservar conexão entre hot reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // Em produção, criar nova conexão
  client = new MongoClient(MONGODB_URI, options)
  clientPromise = client.connect()
}

/**
 * Obter cliente MongoDB
 */
export async function getClient(): Promise<MongoClient> {
  return clientPromise
}

/**
 * Obter database
 */
export async function getDatabase(): Promise<Db> {
  const client = await getClient()
  return client.db(MONGODB_DB)
}

/**
 * Verificar conexão
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await getClient()
    await client.db("admin").command({ ping: 1 })
    console.log("✅ MongoDB conectado com sucesso!")
    return true
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error)
    return false
  }
}

/**
 * Fechar conexão (usar apenas em scripts)
 */
export async function closeConnection(): Promise<void> {
  try {
    const client = await getClient()
    await client.close()
    console.log("🔌 Conexão MongoDB fechada")
  } catch (error) {
    console.error("❌ Erro ao fechar conexão:", error)
  }
}

export default clientPromise
