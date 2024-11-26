exports.handler = async (event, context) => {
    // Verifique a autenticação
    if (!context.clientContext.user) {
      return { statusCode: 401, body: "Não autorizado" }
    }
  
    try {
      const data = JSON.parse(event.body)
      // Aqui você processaria e salvaria os dados
      // Por exemplo, usando um serviço de banco de dados
      console.log("Dados recebidos:", data) // Log dos dados para debug
  
      // Simule o salvamento dos dados (substitua isso pela lógica real de salvamento)
      const savedData = { ...data, id: Date.now() } // Adiciona um ID simulado
  
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: "Dados salvos com sucesso",
          savedData // Retorna os dados "salvos" para confirmação
        })
      }
    } catch (error) {
      console.error("Erro ao processar dados:", error)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Erro ao salvar dados" })
      }
    }
  }