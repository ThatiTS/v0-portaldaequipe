/**
 * ============================================================================
 * SCRIPT: Inicializar MongoDB
 * ============================================================================
 *
 * Cria collections, índices e validações no MongoDB
 *
 * EXECUTAR:
 * npx tsx scripts/initMongoDB.ts
 *
 * ============================================================================
 */

import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const MONGODB_DB = process.env.MONGODB_DB || "PortalDaEquipe"

async function initMongoDB() {
  console.log("\n🚀 Iniciando configuração do MongoDB...\n")

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Conectado ao MongoDB Atlas!\n")

    const db = client.db(MONGODB_DB)

    // ========================================
    // 1. COLLECTION: users
    // ========================================
    console.log("📦 Criando collection: users")

    try {
      await db.createCollection("users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["nome", "email", "senha", "setor"],
            properties: {
              nome: { bsonType: "string" },
              email: { bsonType: "string" },
              senha: { bsonType: "string" },
              setor: { bsonType: "string" },
              cargo: { bsonType: "string" },
              telefone: { bsonType: "string" },
              foto: { bsonType: "string" },
              ativo: { bsonType: "bool" },
              criadoEm: { bsonType: "date" },
              atualizadoEm: { bsonType: "date" },
            },
          },
        },
      })
    } catch (error: any) {
      if (error.code !== 48) {
        // 48 = collection já existe
        throw error
      }
      console.log("   ℹ️  Collection já existe")
    }

    // Criar índices para users
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ setor: 1 })
    await db.collection("users").createIndex({ ativo: 1 })
    await db.collection("users").createIndex({ criadoEm: -1 })
    console.log("   ✅ Índices criados\n")

    // ========================================
    // 2. COLLECTION: chamados
    // ========================================
    console.log("📦 Criando collection: chamados")

    try {
      await db.createCollection("chamados", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["numero", "titulo", "descricao", "setor", "solicitanteId", "status"],
            properties: {
              numero: { bsonType: "string" },
              titulo: { bsonType: "string" },
              descricao: { bsonType: "string" },
              setor: { enum: ["TEI", "RH", "Financeiro"] },
              categoria: { bsonType: "string" },
              prioridade: { enum: ["Baixa", "Média", "Alta", "Urgente"] },
              status: { enum: ["Aberto", "Em Andamento", "Aguardando", "Resolvido", "Fechado"] },
              solicitanteId: { bsonType: "string" },
              atribuidoParaId: { bsonType: "string" },
              criadoEm: { bsonType: "date" },
              atualizadoEm: { bsonType: "date" },
            },
          },
        },
      })
    } catch (error: any) {
      if (error.code !== 48) {
        throw error
      }
      console.log("   ℹ️  Collection já existe")
    }

    await db.collection("chamados").createIndex({ numero: 1 }, { unique: true })
    await db.collection("chamados").createIndex({ setor: 1 })
    await db.collection("chamados").createIndex({ status: 1 })
    await db.collection("chamados").createIndex({ solicitanteId: 1 })
    await db.collection("chamados").createIndex({ criadoEm: -1 })
    console.log("   ✅ Índices criados\n")

    // ========================================
    // 3. COLLECTION: eventos
    // ========================================
    console.log("📦 Criando collection: eventos")

    try {
      await db.createCollection("eventos", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["titulo", "tipo", "dataInicio", "dataFim", "organizadorId"],
            properties: {
              titulo: { bsonType: "string" },
              descricao: { bsonType: "string" },
              tipo: { enum: ["Reunião", "Treinamento", "Evento", "Feriado", "Aniversário"] },
              dataInicio: { bsonType: "date" },
              dataFim: { bsonType: "date" },
              local: { bsonType: "string" },
              organizadorId: { bsonType: "string" },
              participantes: { bsonType: "array" },
              setores: { bsonType: "array" },
              criadoEm: { bsonType: "date" },
            },
          },
        },
      })
    } catch (error: any) {
      if (error.code !== 48) {
        throw error
      }
      console.log("   ℹ️  Collection já existe")
    }

    await db.collection("eventos").createIndex({ dataInicio: 1 })
    await db.collection("eventos").createIndex({ tipo: 1 })
    await db.collection("eventos").createIndex({ organizadorId: 1 })
    await db.collection("eventos").createIndex({ setores: 1 })
    console.log("   ✅ Índices criados\n")

    // ========================================
    // 4. COLLECTION: salas
    // ========================================
    console.log("📦 Criando collection: salas")

    try {
      await db.createCollection("salas", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["nome", "capacidade"],
            properties: {
              nome: { bsonType: "string" },
              capacidade: { bsonType: "int" },
              recursos: { bsonType: "array" },
              ativa: { bsonType: "bool" },
            },
          },
        },
      })
    } catch (error: any) {
      if (error.code !== 48) {
        throw error
      }
      console.log("   ℹ️  Collection já existe")
    }

    await db.collection("salas").createIndex({ nome: 1 }, { unique: true })
    await db.collection("salas").createIndex({ ativa: 1 })
    console.log("   ✅ Índices criados\n")

    // ========================================
    // 5. COLLECTION: reservas
    // ========================================
    console.log("📦 Criando collection: reservas")

    try {
      await db.createCollection("reservas", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["salaId", "usuarioId", "dataInicio", "dataFim", "titulo"],
            properties: {
              salaId: { bsonType: "string" },
              usuarioId: { bsonType: "string" },
              titulo: { bsonType: "string" },
              descricao: { bsonType: "string" },
              dataInicio: { bsonType: "date" },
              dataFim: { bsonType: "date" },
              status: { enum: ["Confirmada", "Cancelada"] },
              criadoEm: { bsonType: "date" },
            },
          },
        },
      })
    } catch (error: any) {
      if (error.code !== 48) {
        throw error
      }
      console.log("   ℹ️  Collection já existe")
    }

    await db.collection("reservas").createIndex({ salaId: 1 })
    await db.collection("reservas").createIndex({ usuarioId: 1 })
    await db.collection("reservas").createIndex({ dataInicio: 1 })
    await db.collection("reservas").createIndex({ status: 1 })
    console.log("   ✅ Índices criados\n")

    // ========================================
    // 6. COLLECTION: cursos
    // ========================================
    console.log("📦 Criando collection: cursos")

    try {
      await db.createCollection("cursos")
    } catch (error: any) {
      if (error.code !== 48) {
        throw error
      }
      console.log("   ℹ️  Collection já existe")
    }

    await db.collection("cursos").createIndex({ titulo: 1 })
    await db.collection("cursos").createIndex({ categoria: 1 })
    await db.collection("cursos").createIndex({ ativo: 1 })
    console.log("   ✅ Índices criados\n")

    console.log("✨ MongoDB configurado com sucesso!\n")
    console.log("📊 Collections criadas:")
    console.log("   - users")
    console.log("   - chamados")
    console.log("   - eventos")
    console.log("   - salas")
    console.log("   - reservas")
    console.log("   - cursos\n")
    console.log("🎯 Próximo passo: npx tsx scripts/seedData.ts\n")
  } catch (error) {
    console.error("❌ Erro ao configurar MongoDB:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

initMongoDB()
