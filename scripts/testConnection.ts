/**
 * ============================================================================
 * SCRIPT: Testar Conexão MongoDB
 * ============================================================================
 *
 * Verifica se a conexão com MongoDB está funcionando
 *
 * EXECUTAR:
 * npx tsx scripts/testConnection.ts
 *
 * ============================================================================
 */

import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const MONGODB_DB = process.env.MONGODB_DB || "PortalDaEquipe"

async function testConnection() {
  console.log("\n🧪 Testando conexão com MongoDB...\n")
  console.log("📍 URI:", MONGODB_URI.replace(/\/\/(.+):(.+)@/, "//*****:*****@"))
  console.log("📦 Database:", MONGODB_DB, "\n")

  const client = new MongoClient(MONGODB_URI)

  try {
    // Conectar
    await client.connect()
    console.log("✅ Conectado ao MongoDB Atlas!\n")

    // Testar ping
    await client.db("admin").command({ ping: 1 })
    console.log("✅ Ping bem-sucedido!\n")

    // Listar databases
    const adminDb = client.db("admin")
    const { databases } = await adminDb.admin().listDatabases()

    console.log("📚 Databases disponíveis:")
    databases.forEach((db: any) => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })
    console.log("")

    // Verificar se o database existe
    const dbExists = databases.some((db: any) => db.name === MONGODB_DB)

    if (dbExists) {
      console.log(`✅ Database "${MONGODB_DB}" encontrado!\n`)

      // Listar collections
      const db = client.db(MONGODB_DB)
      const collections = await db.listCollections().toArray()

      if (collections.length > 0) {
        console.log("📦 Collections:")
        for (const col of collections) {
          const count = await db.collection(col.name).countDocuments()
          console.log(`   - ${col.name} (${count} documentos)`)
        }
        console.log("")
      } else {
        console.log("⚠️  Nenhuma collection encontrada. Execute: npx tsx scripts/initMongoDB.ts\n")
      }
    } else {
      console.log(`⚠️  Database "${MONGODB_DB}" não encontrado.`)
      console.log("   Execute: npx tsx scripts/initMongoDB.ts\n")
    }

    console.log("🎉 Teste concluído com sucesso!\n")
  } catch (error) {
    console.error("❌ Erro ao conectar:", error)
    console.log("\n💡 Dicas:")
    console.log("   1. Verifique se o cluster está ativo no MongoDB Atlas")
    console.log("   2. Confirme usuário e senha")
    console.log("   3. Verifique o IP whitelist (Network Access)\n")
    process.exit(1)
  } finally {
    await client.close()
  }
}

testConnection()
